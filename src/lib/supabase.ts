import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Helper for Lead capture
export async function captureLead(leadData: { name: string; whatsapp_number: string; source: string }) {
  const { data, error } = await supabase
    .from("leads")
    .insert([leadData])
    .select();
  
  if (error) throw error;
  return data;
}

// Helper to fetch Site Metadata (for Live CMS)
export async function getSiteMetadata() {
  const { data, error } = await supabase
    .from("site_metadata")
    .select("*");
  
  if (error) return {};
  
  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

// Helper to update Site Metadata
export async function updateSiteMetadata(metadata: Record<string, string>) {
  const updates = Object.entries(metadata).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("site_metadata")
    .upsert(updates, { onConflict: "key" })
    .select();

  if (error) throw error;
  return data;
}

// Helper to fetch Leads
export async function fetchLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data;
}

// Helper for Gallery/Products
export async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "Gallery")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadImage(file: File, bucket: string = "gallery") {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
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
export async function getAppSettings() {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*");
  
  if (error) throw error;

  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

export async function updateAppSettings(settings: Record<string, string>) {
  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("app_settings")
    .upsert(updates, { onConflict: "key" })
    .select();

  if (error) throw error;
  return data;
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customers (full_name, whatsapp_number, email),
      products (name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 3. Platform Growth Dashboard (Stats)
export async function getPlatformStats() {
  const [products, leads, orders, customers] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
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
    revenue: revenue
  };
}
