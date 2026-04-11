import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Safety check for build-time environment where keys might be missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey) 
  : {} as any; 

export async function getSiteBySlug(slug: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("subdomain_slug", slug)
    .limit(1)
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
  if (!siteId) return {}; // Identity Guard
  let query = supabase.from("site_metadata").select("*").eq("site_id", siteId);
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
  if (!siteId) return []; // Identity Guard
  let query = supabase.from("products").select("*").eq("category", "Gallery").eq("site_id", siteId);
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
  shipping?: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
    delivery_zone_id: string | null;
    delivery_fee: number;
  };
}) {
  const activeSiteId = await getAdminSite();
  if (!activeSiteId) throw new Error("Could not resolve Site Identity for Order.");

  // First, upsert the customer (Isolate by Site ID to support multi-tenancy)
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert([{ ...orderData.customer, site_id: activeSiteId }], { onConflict: "site_id,whatsapp_number" })
    .select()
    .single();

  if (customerError) {
    console.error("Critical: Failed to upsert customer during checkout.", customerError);
    throw customerError;
  }

  // Then, create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      site_id: activeSiteId,
      customer_id: customer.id,
      product_id: orderData.product_id,
      amount: orderData.amount,
      payment_reference: orderData.payment_reference,
      payment_method: orderData.payment_method,
      status: 'Paid',
      shipping_street: orderData.shipping?.street || null,
      shipping_city: orderData.shipping?.city || null,
      shipping_province: orderData.shipping?.province || null,
      shipping_postal_code: orderData.shipping?.postal_code || null,
      delivery_zone_id: orderData.shipping?.delivery_zone_id || null,
      delivery_fee: orderData.shipping?.delivery_fee || 0,
      delivery_status: 'Pending'
    }])
    .select()
    .single();

  if (orderError) throw orderError;

  // 3. Atomically Decrement Inventory
  try {
    await supabase.rpc('decrement_stock', { 
      p_id: orderData.product_id, 
      p_quantity: 1 
    });
  } catch (err) {
    console.error("Non-blocking: Failed to decrement stock.", err);
    // We don't throw here to avoid failing the order if only inventory sync fails,
    // though in a production env you might want stricter consistency.
  }

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

// 2.2 Definitive Site Resolver for Hub & Storefront
export async function resolveSiteId() {
  try {
    if (typeof window === "undefined") return null;
    
    const host = window.location.hostname;
    let slug = "";
    
    // 1. Check for Admin Console Identity (Definitive Hub Identification)
    if (host.includes("lux-hair-suite.vercel.app") || host.includes("kasi-business-hub")) {
       const { data: mainSite } = await supabase
        .from("sites")
        .select("id")
        .eq("subdomain_slug", "kagiso-hair-suite")
        .single();
       if (mainSite) return mainSite.id;
    }

    // 2. Resolve via Hostname/Subdomain
    if (host.includes(".vercel.app")) {
      slug = host.split(".")[0];
      // Industrial Override: If the root vercel app is accessed, bind to lux-hair-suite identity
      if (slug === 'lux-hair-suite') slug = 'lux-hair-suite';
    } else if (host === "localhost" || host === "127.0.0.1") {
      const { data: firstSite } = await supabase.from("sites").select("id").limit(1).single();
      return firstSite?.id;
    } else {
      // Custom Domain Support
      const { data: site } = await supabase
        .from("sites")
        .select("id")
        .eq("custom_domain", host)
        .limit(1)
        .single();
      if (site) return site.id;
      
      slug = host.split(".")[0];
    }
    
    if (slug) {
      const { data: site } = await supabase
        .from("sites")
        .select("id")
        .eq("subdomain_slug", slug)
        .limit(1)
        .single();
      if (site) return site.id;
    }
    
    // Industrial Resilience: Definitive Master Fallback
    const { data: fallbackSite } = await supabase
      .from("sites")
      .select("id")
      .eq("subdomain_slug", "lux-hair-suite")
      .limit(1)
      .single();
    if (fallbackSite) return fallbackSite.id;
    
    // Final Legacy Fallback
    const { data: finalSite } = await supabase
       .from("sites")
       .select("id")
       .order("created_at", { ascending: true })
       .limit(1)
       .single();
    return finalSite?.id || null;
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

// 2.3 Logistics
export async function fetchDeliveryZones(siteId?: string) {
  const activeSiteId = siteId || await getAdminSite();
  if (!activeSiteId) return [];

  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("site_id", activeSiteId)
    .order("fee", { ascending: true });

  if (error) return [];
  return data;
}

export async function createDeliveryZone(name: string, fee: number) {
  const activeSiteId = await getAdminSite();
  if (!activeSiteId) throw new Error("Unauthorized.");

  const { data, error } = await supabase
    .from("delivery_zones")
    .insert([{ site_id: activeSiteId, name, fee }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDeliveryZone(id: string, name: string, fee: number) {
  const { data, error } = await supabase
    .from("delivery_zones")
    .update({ name, fee })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDeliveryZone(id: string) {
  const { error } = await supabase
    .from("delivery_zones")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function fetchOrders(siteId?: string) {
  const activeSiteId = siteId || await getAdminSite();
  if (!activeSiteId) return []; // Identity Guard
  let query = supabase
    .from("orders")
    .select(`
      *,
      customers (full_name, whatsapp_number, email),
      products (name)
    `)
    .eq("site_id", activeSiteId); // Absolute isolation
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateDeliveryStatus(id: string, delivery_status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ delivery_status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 3. Booking Engine
export async function fetchBookings(siteId?: string) {
  const activeSiteId = siteId || await getAdminSite();
  if (!activeSiteId) return []; // Identity Guard
  let query = supabase
    .from("bookings")
    .select(`
      *,
      products (name, price)
    `)
    .eq("site_id", activeSiteId); // Absolute isolation
  
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

export async function updateBookingStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchLeads(siteId?: string) {
  const activeSiteId = siteId || await getAdminSite();
  let query = supabase.from("leads").select("*");
  if (activeSiteId) query = query.eq("site_id", activeSiteId);
  
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
  
  const revenue = totalRevenue?.reduce((sum: number, order: { amount: number }) => sum + Number(order.amount), 0) || 0;

  return {
    products: products.count || 0,
    leads: (leads.count || 0) + (customers.count || 0),
    orders: orders.count || 0,
    bookings: bookings.count || 0,
    revenue: revenue
  };
}

// Support Chat Functions
export async function getChatMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('support_chats')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendChatMessage(siteId: string, sessionId: string, message: string, sender: 'customer' | 'admin', orderId?: string) {
  const { data, error } = await supabase
    .from('support_chats')
    .insert([{ site_id: siteId, session_id: sessionId, message, sender, order_id: orderId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getActiveChats(siteId: string) {
  const { data, error } = await supabase
    .from('support_chats')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  // Group by session_id and keep latest message
  const sessions = new Map();
  data.forEach((m: any) => {
    if (!sessions.has(m.session_id)) {
      sessions.set(m.session_id, m);
    }
  });
  return Array.from(sessions.values());
}

export async function markChatAsRead(sessionId: string) {
  const { error } = await supabase
    .from('support_chats')
    .update({ is_read: true })
    .eq('session_id', sessionId)
    .eq('sender', 'customer');
  if (error) throw error;
}
