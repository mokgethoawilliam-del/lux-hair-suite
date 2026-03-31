"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Shield, Save, Loader2, CheckCircle2 } from "lucide-react";
import { getAppSettings, updateAppSettings } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ custom_domain: "", store_currency: "ZAR" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAppSettings()
      .then((s) => setSettings({ custom_domain: s.custom_domain || "", store_currency: s.store_currency || "ZAR" }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppSettings(settings);
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
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-all text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

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

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Custom Domain</label>
          <input
            type="text"
            value={settings.custom_domain}
            onChange={(e) => setSettings({ ...settings, custom_domain: e.target.value })}
            className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
            placeholder="www.yourstore.co.za"
          />
        </div>

        {settings.custom_domain && (
          <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-xl space-y-2 text-sm">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Point your DNS to:</p>
            <div className="flex justify-between"><span className="text-white/50">A Record</span><span className="font-mono text-sky-400">76.76.21.21</span></div>
            <div className="flex justify-between"><span className="text-white/50">CNAME</span><span className="font-mono text-sky-400">cname.vercel-dns.com</span></div>
          </div>
        )}
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
