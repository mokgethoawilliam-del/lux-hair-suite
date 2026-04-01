"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Shield, Save, Loader2, CheckCircle2, Layout, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { getAppSettings, updateAppSettings, updateSiteMetadata } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ 
    custom_domain: "", 
    store_currency: "ZAR",
    business_focus: "Hair & Beauty",
    admin_name: "",
    store_name: "",
    about_us: "",
    cal_link: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAppSettings()
      .then((s) => setSettings({ 
        custom_domain: s.custom_domain || "", 
        store_currency: s.store_currency || "ZAR",
        business_focus: s.business_focus || "Hair & Beauty",
        admin_name: s.admin_name || "",
        store_name: s.store_name || "",
        about_us: s.about_us || "",
        cal_link: s.cal_link || "",
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update general settings (currency, focus, names)
      await updateAppSettings(settings);

      // 2. Update site-level domain if changed
      // We'd ideally fetch siteId from context, but for now we'll assume the session site
      // (Simplified for this MVP stage)

      // 3. Sync store_name & about_us to landing page metadata
      const metaToSync: Record<string, string> = { business_focus: settings.business_focus };
      if (settings.store_name) metaToSync.brand_name = settings.store_name;
      if (settings.about_us) metaToSync.about_us = settings.about_us;
      if (settings.cal_link) metaToSync.cal_link = settings.cal_link;
      
      await updateSiteMetadata(metaToSync);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;

  return (
    <div className="space-y-10 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-400/60 uppercase tracking-[0.2em] font-bold mb-1">Configuration</p>
          <h1 className="text-3xl font-bold text-white">App Settings</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-3 transition-all text-sm group"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
          {saved ? "Settings Updated!" : "Sync Vault"}
        </button>
      </div>

      {/* Business Identity Selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Layout className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Business Focus</h3>
            <p className="text-xs text-white/30">Your niche-specific SaaS theme</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Hair & Beauty", icon: "✨", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { name: "Sneakers & Streetwear", icon: "👟", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { name: "Clothing & Apparel", icon: "👕", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { name: "Events & Apparel", icon: "🎟️", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { name: "Tailoring & Styling", icon: "✂️", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
            { name: "Multi-Hustle", icon: "🏬", bg: "bg-pink-500/10", border: "border-pink-500/20" },
          ].map((opt) => (
            <button
              key={opt.name}
              onClick={() => setSettings({ ...settings, business_focus: opt.name })}
              className={`p-4 rounded-xl border transition-all text-left ${
                settings.business_focus === opt.name 
                  ? `bg-white/[0.05] ${opt.border}` 
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              <div className={`w-8 h-8 ${opt.bg} rounded-lg flex items-center justify-center mb-3`}>
                <span className="text-sm">{opt.icon}</span>
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${settings.business_focus === opt.name ? "text-white" : "text-white/30"}`}>{opt.name}</p>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-white/20 italic tracking-wide">
          ✦ Selecting a focus will automatically re-theme your entire dashboard and storefront to match your industry.
        </p>
      </motion.div>

      {/* Domain Hub */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <Globe className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Domain Hub</h3>
            <p className="text-xs text-white/30">Connect your custom domain</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Connect Professional Domain</label>
            <input
              type="text"
              value={settings.custom_domain}
              onChange={(e) => setSettings({ ...settings, custom_domain: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="www.yourstore.co.za"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-white/5">
             <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl text-center space-y-2">
                <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest leading-loose text-center">Step 1</p>
                <p className="text-xs font-bold text-white">Save Domain</p>
                <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                   <ArrowRight className="w-3 h-3 text-indigo-400" />
                </div>
             </div>
             <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl text-center space-y-2 opacity-50">
                <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest leading-loose text-center">Step 2</p>
                <p className="text-xs font-bold text-white">Update DNS</p>
                <Globe className="w-6 h-6 text-white/10 mx-auto" />
             </div>
             <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl text-center space-y-2 opacity-50">
                <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest leading-loose text-center">Step 3</p>
                <p className="text-xs font-bold text-white">Verification</p>
                <CheckCircle2 className="w-6 h-6 text-white/10 mx-auto" />
             </div>
          </div>

          {settings.custom_domain && (
            <div className="mt-6 space-y-4">
               <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-500/10">
                     <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">DNS Connection Details</p>
                     <span className="text-[9px] px-2 py-0.5 bg-indigo-500/20 rounded border border-indigo-500/30 text-indigo-300 font-bold tracking-widest uppercase">Required</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest">
                         <span>CNAME Record (Preferred)</span>
                         <button className="flex items-center gap-1 hover:text-indigo-400 transition-colors uppercase"><Copy className="w-3 h-3" /> Copy</button>
                      </div>
                      <code className="block p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-indigo-400 truncate">
                        cname.kasivault.com
                      </code>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest">
                         <span>A Record (IP Address)</span>
                         <button className="flex items-center gap-1 hover:text-indigo-400 transition-colors uppercase"><Copy className="w-3 h-3" /> Copy</button>
                      </div>
                      <code className="block p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-indigo-400 truncate">
                        76.76.21.21
                      </code>
                    </div>
                  </div>

                  <p className="text-[9px] text-white/20 italic tracking-wide mt-2">
                     ✦ Point your domain to either of the above at your registrar (GoDaddy, Namecheap, etc.) to go live.
                  </p>
               </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Governance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/20">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Store Governance</h3>
            <p className="text-xs text-white/30">Platform currency and regional config</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Platform Currency</label>
          <select
            value={settings.store_currency}
            onChange={(e) => setSettings({ ...settings, store_currency: e.target.value })}
            className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
          >
            <option value="ZAR">South African Rand (ZAR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/5">
          <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Brand Narrative / About Us</label>
          <textarea
            value={settings.about_us}
            onChange={(e) => setSettings({ ...settings, about_us: e.target.value })}
            className="w-full h-32 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm resize-none leading-relaxed"
            placeholder="Tell your story... e.g. How your boutique journey started."
          />
          <p className="text-[9px] text-white/20 italic tracking-wide">
            ✦ Your story will appear in the 'About' section of your landing page. Keep it authentic.
          </p>
        </div>

        {/* Scheduling Sync: Cal.com & Gmail */}
        <div className="col-span-full pt-10 pb-4 border-t border-white/5">
          <h3 className="text-xl font-serif text-white mb-2 italic">Power <span className="text-emerald-500">Scheduler</span></h3>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Native Cal.com & Gmail Sync</p>
        </div>
        <div className="col-span-full space-y-4">
           <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Cal.com Event Link (Gmail / Google Sync)</label>
           <div className="flex gap-4">
             <input 
               value={settings.cal_link}
               onChange={(e) => setSettings({...settings, cal_link: e.target.value})}
               placeholder="e.g. your-username/installation"
               className="flex-1 px-8 py-5 bg-[#0f1117] border border-white/10 rounded-[32px] focus:border-emerald-500 outline-none text-white transition-all text-sm" 
             />
           </div>
           <p className="text-[9px] text-white/20 italic ml-4">
             Paste your Cal.com event link here to replace the internal system with professional scheduling.
           </p>
        </div>
      </motion.div>

      {/* Info box re: Paystack */}
      <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3">
        <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-300/60 leading-relaxed">
          Payment keys (Paystack) are managed in your <a href="/admin/profile" className="text-indigo-400 underline">Profile → Payment Vault</a> and are password-protected for security.
        </p>
      </div>
    </div>
  );
}
