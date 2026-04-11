"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupKingsWear() {
  const [status, setStatus] = useState("Initializing King Wiz Identity...");

  useEffect(() => {
    async function run() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setStatus("Error: You must be logged into the admin dashboard.");
          return;
        }

        const { data: existing } = await supabase.from('sites').select('id').eq('subdomain_slug', 'kingswear').single();
        if (existing) {
          setStatus("Kings Wear is already successfully set up in your database! You can now use the preview link.");
          return;
        }

        const { data: newSite, error: siteError } = await supabase.from('sites').insert({
          name: 'Kings Wear Clothing',
          subdomain_slug: 'kingswear',
          owner_id: userData.user.id,
          status: 'active'
        }).select().single();

        if (siteError) throw siteError;

        const { error: metaError } = await supabase.from('site_metadata').insert({
          site_id: newSite.id,
          brand_name: 'Kings Wear Clothing',
          business_focus: 'Tailoring & Styling',
          about_us: 'Kings Wear Clothing by King Wiz is dedicated to the art of absolute precision in bespoke tailoring.',
          hero_headline: 'Tailored for Kings',
          hero_description: 'Premium Bespoke Suits & Styling.'
        });

        if (metaError) throw metaError;

        setStatus("✅ Success! The Kings Wear secure identity has been created. You can now use the preview link!");
      } catch (e: any) {
        setStatus("Error fixing database: " + e.message);
      }
    }
    run();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-20 text-white space-y-6">
      <h1 className="text-3xl font-serif text-[#C9A646]">Kings Wear Initialization</h1>
      <div className="p-8 border border-white/10 rounded-xl bg-white/[0.02]">
        <p className="font-mono text-sm tracking-widest uppercase">{status}</p>
      </div>
    </div>
  );
}
