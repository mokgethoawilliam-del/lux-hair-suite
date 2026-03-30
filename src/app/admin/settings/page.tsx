"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Shield, Save, Loader2, Info, Globe, Sparkles, TrendingUp, Users, Package, ShoppingCart, Zap } from "lucide-react";
import { getAppSettings, updateAppSettings, getPlatformStats } from "@/lib/supabase";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    paystack_public_key: "",
    paystack_secret_key: "",
    gemini_api_key: "",
    custom_domain: "",
    store_currency: "ZAR",
  });
  const [stats, setStats] = useState({ products: 0, leads: 0, orders: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [config, platformStats] = await Promise.all([
          getAppSettings(),
          getPlatformStats()
        ]);
        setSettings(prev => ({ ...prev, ...config }));
        setStats(platformStats);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      await updateAppSettings(settings);
      setMessage("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-brand-gold mx-auto" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">App <span className="text-brand-gold italic">Settings</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">CONFIGURATION & API VAULT</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-gold/20"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>

      {/* Platform Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `R ${stats.revenue.toLocaleString()}`, icon: <TrendingUp />, color: "text-emerald-400" },
          { label: "Active Businesses", value: "1", icon: <Globe />, color: "text-blue-400" },
          { label: "Growth Leads", value: stats.leads, icon: <Users />, color: "text-brand-gold" },
          { label: "Catalog Items", value: stats.products, icon: <Package />, color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-4"
          >
            <div className={`p-3 bg-white/5 w-fit rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">{stat.label}</p>
              <h4 className="text-2xl font-serif text-white">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gemini AI Card */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-brand-emerald/10 border border-brand-emerald/20 rounded-[40px] p-10 space-y-8"
        >
          <div className="flex items-center gap-4 text-brand-gold">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-xl font-serif uppercase tracking-widest">AI Designer Config</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Gemini API Key</label>
              <input 
                type="password" 
                value={settings.gemini_api_key}
                onChange={(e) => setSettings({...settings, gemini_api_key: e.target.value})}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white font-mono"
                placeholder="AI_STUDIO_KEY"
              />
            </div>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl flex gap-4">
             <Zap className="w-5 h-5 text-brand-gold shrink-0" />
             <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">
                Powers the "Magic Designer" in the Site Editor. Get your key at Google AI Studio.
             </p>
          </div>
        </motion.div>

        {/* Domain Management Card */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/5 border border-white/5 rounded-[40px] p-10 space-y-8"
        >
          <div className="flex items-center gap-4 text-brand-gold">
            <Globe className="w-6 h-6" />
            <h3 className="text-xl font-serif uppercase tracking-widest">Domain Hub</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Custom Domain</label>
              <input 
                type="text" 
                value={settings.custom_domain}
                onChange={(e) => setSettings({...settings, custom_domain: e.target.value})}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white"
                placeholder="www.yourname.co.za"
              />
            </div>
            {settings.custom_domain && (
              <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 rounded-2xl space-y-3">
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Point your DNS to:</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Type: A Record</span>
                  <span className="font-mono text-brand-gold">76.76.21.21</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Type: CNAME</span>
                  <span className="font-mono text-brand-gold">cname.vercel-dns.com</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Paystack Card */}
        <motion.div 
           className="bg-white/5 border border-white/5 rounded-[40px] p-10 space-y-8"
        >
          <div className="flex items-center gap-4 text-brand-gold">
            <Key className="w-6 h-6" />
            <h3 className="text-xl font-serif uppercase tracking-widest">Paystack Vault</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Live Public Key</label>
              <input 
                type="text" 
                value={settings.paystack_public_key}
                onChange={(e) => setSettings({...settings, paystack_public_key: e.target.value})}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Live Secret Key</label>
              <input 
                type="password" 
                value={settings.paystack_secret_key}
                onChange={(e) => setSettings({...settings, paystack_secret_key: e.target.value})}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Global Config Card */}
        <motion.div 
          className="bg-white/5 border border-white/5 rounded-[40px] p-10 space-y-8"
        >
          <div className="flex items-center gap-4 text-brand-gold">
            <Shield className="w-6 h-6" />
            <h3 className="text-xl font-serif uppercase tracking-widest">Governance</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Platform Currency</label>
              <select 
                value={settings.store_currency}
                onChange={(e) => setSettings({...settings, store_currency: e.target.value})}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white"
              >
                <option value="ZAR">South African Rand (ZAR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-6 rounded-3xl text-center font-bold uppercase tracking-widest text-xs ${message.includes("Error") ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
}
