import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export async function getSiteBySlug(slug: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("subdomain_slug", slug)
    .single();
  
  if (error) return null;
  return data;
}

// Helper for Lead capture
export async function captureLead(leadData: { name: string; whatsapp_number: string; source: string; site_id?: string }) {
  const { data, error } = await supabase
    .from("leads")
    .insert([leadData])
    .select();
  
  if (error) throw error;
  return data;
}

// Helper to fetch Site Metadata (for Live CMS)
export async function getSiteMetadata(siteId?: string) {
  let query = supabase.from("site_metadata").select("*");
  if (siteId) query = query.eq("site_id", siteId);
  
  const { data, error } = await query;
  if (error) return {};
  
  return data.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

// Helper to update Site Metadata
export async function updateSiteMetadata(metadata: Record<string, string>, siteId?: string) {
  let activeSiteId = siteId;
  if (!activeSiteId) activeSiteId = await getAdminSite();
  if (!activeSiteId) throw new Error("Could not identify site for metadata update.");

  const updates = Object.entries(metadata).map(([key, value]) => ({
    key,
    value,
    site_id: activeSiteId,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("site_metadata")
    .upsert(updates, { onConflict: "key,site_id" })
    .select();

  if (error) throw error;
  return data;
}

export async function updateSiteDomain(domain: string, siteId: string) {
  const { data, error } = await supabase
    .from("sites")
    .update({ custom_domain: domain, updated_at: new Date().toISOString() })
    .eq("id", siteId)
    .select();

  if (error) throw error;
  return data;
}

// Helper for Gallery/Products
export async function fetchGalleryImages(siteId?: string) {
  let query = supabase.from("products").select("*").eq("category", "Gallery");
  if (siteId) query = query.eq("site_id", siteId);
  
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function uploadImage(file: File, bucket: string = "gallery") {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function uploadGalleryImage(file: File) {
  const publicUrl = await uploadImage(file, "gallery");

  const { data: productData, error: dbError } = await supabase
    .from("products")
    .insert([{
      name: file.name,
      category: "Gallery",
      image_url: publicUrl,
      type: "In-Stock"
    }])
    .select();

  if (dbError) throw dbError;
  return productData;
}

export async function deleteGalleryImage(id: string, imageUrl: string) {
  const fileName = imageUrl.split("/").pop();
  
  if (fileName) {
    await supabase.storage
      .from("gallery")
      .remove([fileName]);
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// --- NEW BUSINESS LOGIC HELPERS ---

// 1. Create Order & Customer
export async function createOrder(orderData: {
  customer: { full_name: string; email: string; whatsapp_number: string };
  product_id: string;
  amount: number;
  payment_reference: string;
  payment_method: string;
}) {
  // First, upsert the customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert([orderData.customer], { onConflict: "whatsapp_number" })
    .select()
    .single();

  if (customerError) throw customerError;

  // Then, create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      customer_id: customer.id,
      product_id: orderData.product_id,
      amount: orderData.amount,
      payment_reference: orderData.payment_reference,
      payment_method: orderData.payment_method,
      status: 'Paid'
    }])
    .select()
    .single();

  if (orderError) throw orderError;
  return order;
}

// 2. Settings Management
export async function getAdminSite() {
  try {
    const id = await resolveSiteId();
    return id;
  } catch (err) {
    console.error("Error identifying admin site:", err);
    return null;
  }
}

// 2.2 Definitive Site Resolver for Storefront
export async function resolveSiteId() {
  try {
    if (typeof window === "undefined") return null;
    
    const host = window.location.hostname;
    let slug = "";
    
    if (host.includes(".vercel.app")) {
      slug = host.split(".")[0];
    } else if (host === "localhost" || host === "127.0.0.1") {
      // In local dev, we default to the primary site.
      const { data: firstSite } = await supabase.from("sites").select("id").limit(1).single();
      return firstSite?.id;
    } else {
      // Custom Domain Support
      const { data: site } = await supabase
        .from("sites")
        .select("id")
        .eq("custom_domain", host)
        .single();
      if (site) return site.id;
      
      slug = host.split(".")[0];
    }
    
    if (slug) {
      const { data: site } = await supabase
        .from("sites")
        .select("id")
        .eq("subdomain_slug", slug)
        .single();
      if (site) return site.id;
    }
    
    const { data: finalSite } = await supabase.from("sites").select("id").limit(1).single();
    return finalSite?.id;
  } catch (err) {
    console.error("Error resolving siteId:", err);
    return null;
  }
}

export async function getAppSettings(siteId?: string) {
  let query = supabase.from("app_settings").select("*");
  if (siteId) query = query.eq("site_id", siteId);
  
  const { data, error } = await query;
  
  if (error) return {};

  return data.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

export async function updateAppSettings(settings: Record<string, string>, siteId?: string) {
  let activeSiteId = siteId;
  if (!activeSiteId) activeSiteId = await getAdminSite();
  if (!activeSiteId) throw new Error("Could not identify site for settings update.");

  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    site_id: activeSiteId,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("app_settings")
    .upsert(updates, { onConflict: "key,site_id" })
    .select();

  if (error) throw error;
  return data;
}

export async function fetchOrders(siteId?: string) {
  let query = supabase
    .from("orders")
    .select(`
      *,
      customers (full_name, whatsapp_number, email),
      products (name)
    `);
  
  if (siteId) query = query.eq("site_id", siteId);
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 3. Booking Engine
export async function fetchBookings(siteId?: string) {
  let query = supabase
    .from("bookings")
    .select(`
      *,
      products (name, price)
    `);
  
  if (siteId) query = query.eq("site_id", siteId);
  
  const { data, error } = await query.order("slot_start", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createBooking(bookingData: {
  site_id: string;
  service_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  slot_start: string;
  slot_end: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([bookingData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchLeads(siteId?: string) {
  let query = supabase.from("leads").select("*");
  if (siteId) query = query.eq("site_id", siteId);
  
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// 4. Platform Growth Dashboard (Stats)
export async function getPlatformStats() {
  const [products, leads, orders, customers, bookings] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
  ]);

  // Aggregate stats
  const { data: totalRevenue } = await supabase
    .from("orders")
    .select("amount");
  
  const revenue = totalRevenue?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;

  return {
    products: products.count || 0,
    leads: (leads.count || 0) + (customers.count || 0),
    orders: orders.count || 0,
    bookings: bookings.count || 0,
    revenue: revenue
  };
}
