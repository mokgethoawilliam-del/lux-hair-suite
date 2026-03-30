"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Key, Eye, EyeOff, Save, RefreshCw, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { getAppSettings, updateAppSettings } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default function KeyVault() {
  const [geminiKey, setGeminiKey] = useState("");
  const [paystackKey, setPaystackKey] = useState("");
  const [showGemini, setShowGemini] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAppSettings()
      .then((s) => {
        setGeminiKey(s.gemini_api_key || "");
        setPaystackKey(s.paystack_public_key || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppSettings({
        gemini_api_key: geminiKey,
        paystack_public_key: paystackKey,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save keys.");
    } finally {
      setSaving(false);
    }
  };

  const mask = (val: string) =>
    val.length > 8 ? val.slice(0, 6) + "••••••••••••••••" + val.slice(-4) : "••••••••••••••••";

  return (
    <div className="space-y-12 max-w-2xl">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-2">Owner Only</p>
        <h1 className="text-5xl font-serif text-white">
          API Key <span className="text-purple-400 italic">Vault</span>
        </h1>
        <p className="text-white/30 text-sm mt-2">
          These keys are stored securely. Your clients will never see them.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 text-white/30 py-20">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className="text-sm uppercase tracking-widest font-bold">Loading vault...</span>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Gemini Key */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 bg-white/[0.03] border border-white/5 rounded-[40px] space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-2xl">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">Google Gemini API Key</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-1">
                  Used by AI Magic Designer in client dashboard · Never exposed to clients
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza••••••••••••••••••••••••••••••••••••••"
                className="flex-1 px-6 py-4 bg-[#0a0012] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white font-mono text-sm"
              />
              <button
                onClick={() => setShowGemini(!showGemini)}
                className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
              >
                {showGemini ? <EyeOff className="w-5 h-5 text-white/40" /> : <Eye className="w-5 h-5 text-white/40" />}
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-purple-300/60 leading-relaxed">
                Get your key from{" "}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">
                  aistudio.google.com/apikey
                </a>
                . Each client's AI design session uses this key, so monitor your quota on the Google Cloud Console.
              </p>
            </div>
          </motion.div>

          {/* Paystack Key */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-white/[0.03] border border-white/5 rounded-[40px] space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-2xl">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">Paystack Public Key</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-1">
                  Enables checkout payments · Stored per-deployment
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type={showPaystack ? "text" : "password"}
                value={paystackKey}
                onChange={(e) => setPaystackKey(e.target.value)}
                placeholder="pk_live_••••••••••••••••••••••••••••••••••••"
                className="flex-1 px-6 py-4 bg-[#0a0012] border border-white/10 rounded-2xl focus:border-blue-500/50 outline-none transition-all text-white font-mono text-sm"
              />
              <button
                onClick={() => setShowPaystack(!showPaystack)}
                className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
              >
                {showPaystack ? <EyeOff className="w-5 h-5 text-white/40" /> : <Eye className="w-5 h-5 text-white/40" />}
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-900/30 text-sm uppercase tracking-widest"
          >
            {saving ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Saving to Vault...</>
            ) : saved ? (
              <><CheckCircle2 className="w-5 h-5 text-green-300" /> Keys Saved Successfully</>
            ) : (
              <><Save className="w-5 h-5" /> Save to Vault</>
            )}
          </motion.button>

          {/* Security note */}
          <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
            Keys are encrypted in Supabase · Never visible to clients
          </p>
        </div>
      )}
    </div>
  );
}
