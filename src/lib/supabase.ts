import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
