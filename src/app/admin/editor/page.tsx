"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, Type, Layout, Globe, Image as ImageIcon } from "lucide-react";
import { getSiteMetadata, supabase } from "@/lib/supabase";

export default function SiteEditor() {
  const [metadata, setMetadata] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getSiteMetadata();
      setMetadata(data);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, logic to update Supabase site_metadata table
    console.log("Saving metadata:", metadata);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const updateField = (key: string, value: string) => {
    setMetadata({ ...metadata, [key]: value });
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Site <span className="text-brand-gold italic">Editor</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">BRAND VOICE & CONTENT CONTROL</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-gold/20 min-w-[140px]"
        >
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Hero Section Editor */}
        <section className="p-10 bg-white/5 border border-white/5 rounded-[40px] space-y-8">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-brand-gold/10 rounded-xl">
               <Layout className="w-5 h-5 text-brand-gold" />
             </div>
             <h3 className="text-2xl font-serif">Hero <span className="text-brand-gold italic">Section</span></h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Main Headline</label>
              <textarea 
                value={metadata.hero_headline || "Premium Hair Redefined."}
                onChange={(e) => updateField("hero_headline", e.target.value)}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all font-serif text-xl h-32"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Hero Description</label>
              <textarea 
                value={metadata.hero_description || "Experience the ultimate in high-performance Frontals, Ponytails, and Weaves."}
                onChange={(e) => updateField("hero_description", e.target.value)}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-sm leading-relaxed text-white/60 h-32"
              />
            </div>
          </div>
        </section>

        {/* Brand & Social Editor */}
        <div className="space-y-8">
          <section className="p-10 bg-white/5 border border-white/5 rounded-[40px] space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-brand-gold/10 rounded-xl">
                 <Globe className="w-5 h-5 text-brand-gold" />
               </div>
               <h3 className="text-2xl font-serif">Brand <span className="text-brand-gold italic">Intelligence</span></h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Owner WhatsApp</label>
                <input 
                  type="text"
                  value={metadata.whatsapp_number || "27123456789"}
                  onChange={(e) => updateField("whatsapp_number", e.target.value)}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Brand Display Name</label>
                <input 
                  type="text"
                  value={metadata.brand_name || "Lux Hair Suite"}
                  onChange={(e) => updateField("brand_name", e.target.value)}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <div className="p-10 bg-brand-emerald/10 border border-brand-emerald/20 rounded-[40px] flex items-center justify-between group cursor-pointer hover:bg-brand-emerald/20 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-gold/20 rounded-2xl group-hover:scale-110 transition-all">
                  <ImageIcon className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                   <h4 className="font-serif text-xl">Gallery Manager</h4>
                   <p className="text-xs text-white/30 uppercase mt-1">Manage brand portfolio images</p>
                </div>
             </div>
             <RefreshCw className="w-5 h-5 text-white/10 group-hover:text-brand-gold transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
