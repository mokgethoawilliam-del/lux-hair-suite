"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Layout, ExternalLink, Loader2, Globe, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Site {
  id: string;
  name: string;
  subdomain_slug: string;
  custom_domain?: string | null;
  created_at: string;
}

export default function OwnerClients() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSite, setNewSite] = useState({ name: "", subdomain_slug: "", custom_domain: "" });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setSites((data as Site[]) || []);
    } catch (err) {
      console.error("Error loading sites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("sites")
        .insert([newSite])
        .select()
        .single();
      
      if (error) throw error;
      setSites([data as Site, ...sites]);
      setIsAddModalOpen(false);
      setNewSite({ name: "", subdomain_slug: "", custom_domain: "" });
    } catch (err) {
      console.error("Error creating site:", err);
      alert("Failed to create site. Check if the slug is unique.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-purple-400 mx-auto" /></div>;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Client <span className="text-purple-400 italic">Portfolio</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">MANAGEMENT & PROVISIONING · KASIVAULT</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 bg-purple-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          Provision New Site
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.length === 0 ? (
          <div className="col-span-full p-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] text-center">
             <Globe className="w-12 h-12 text-white/10 mx-auto mb-6" />
             <p className="text-white/20 uppercase tracking-[0.3em] text-sm">No clients provisioned yet.</p>
          </div>
        ) : (
          sites.map((site) => (
            <motion.div 
              key={site.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/5 border border-white/5 rounded-[32px] p-8 hover:border-purple-500/20 transition-all space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-all">
                  <Layout className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[9px] uppercase font-bold text-green-400/60 tracking-widest">Active</span>
                </div>
              </div>

              <div>
                 <h4 className="font-serif text-xl text-white mb-1">{site.name}</h4>
                 <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest leading-loose">
                    {site.subdomain_slug}.kasivault.com
                 </p>
                 {site.custom_domain && (
                   <p className="text-[10px] uppercase font-bold text-purple-400 tracking-widest flex items-center gap-2 mt-1">
                     <Globe className="w-3 h-3" /> {site.custom_domain}
                   </p>
                 )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <div className="text-left">
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Created</p>
                  <p className="text-xs text-white/40">{new Date(site.created_at).toLocaleDateString()}</p>
                </div>
                <a 
                  href={`/s/${site.subdomain_slug}`} 
                  target="_blank"
                  className="p-3 bg-white/5 hover:bg-purple-500/10 border border-white/10 rounded-xl transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-obsidian/90 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 border border-white/5 p-12 rounded-[40px] w-full max-w-lg space-y-8 shadow-2xl">
            <h2 className="text-3xl font-serif text-white">Provision <span className="text-purple-400 italic">New Site</span></h2>
            <form onSubmit={handleCreateSite} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Brand Name</label>
                 <input 
                  required
                  value={newSite.name}
                  onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none text-white" 
                  placeholder="e.g. The Sneaker Plug"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Subdomain Slug</label>
                 <input 
                  required
                  value={newSite.subdomain_slug}
                  onChange={(e) => setNewSite({...newSite, subdomain_slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none text-white font-mono text-sm" 
                  placeholder="e.g. SNEAKER-PLUG"
                 />
               </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Custom Domain (Optional)</label>
                  <input 
                   value={newSite.custom_domain}
                   onChange={(e) => setNewSite({...newSite, custom_domain: e.target.value.toLowerCase()})}
                   className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none text-white font-mono text-sm" 
                   placeholder="e.g. www.brand.com"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] text-white/20 italic tracking-wide">
                     ✦ Default URL: <span className="text-purple-400/60">kasivault.com/s/{newSite.subdomain_slug || 'brand-name'}</span>
                  </p>
                  <p className="text-[9px] text-white/20 italic tracking-wide">
                     ✦ Subdomain: <span className="text-purple-400/60">{newSite.subdomain_slug || 'brand'}.kasivault.com</span>
                  </p>
                </div>

               <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-2 py-4 bg-purple-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm Provisioning'}
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
