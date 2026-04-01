"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Lock, Key, Save, Loader2, 
  CheckCircle2, Globe, ExternalLink, CreditCard,
  Eye, EyeOff, Calendar, Mail, MessageSquare
} from "lucide-react";
import { getAppSettings, updateAppSettings, updateSiteMetadata } from "@/lib/supabase";

const VAULT_PIN = "pay2026";

export default function SecuredVaultPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [vaultData, setVaultData] = useState({
    paystack_public_key: "",
    paystack_secret_key: "",
    custom_domain: "",
    cal_link: "",
    google_calendar_id: "",
    twilio_sid: "",
    twilio_token: "",
    twilio_from: "",
    resend_api_key: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const s = await getAppSettings();
        setVaultData({
          paystack_public_key: s.paystack_public_key || "",
          paystack_secret_key: s.paystack_secret_key || "",
          custom_domain: s.custom_domain || "",
          cal_link: s.cal_link || "",
          google_calendar_id: s.google_calendar_id || "",
          twilio_sid: s.twilio_sid || "",
          twilio_token: s.twilio_token || "",
          twilio_from: s.twilio_from || "",
          resend_api_key: s.resend_api_key || "",
        });
      } catch (err) {
        console.error("Vault load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Auto-Lock Logic: Lock on unmount (navigation)
    return () => {
      setIsUnlocked(false);
    };
  }, []);

  const handleUnlock = () => {
    if (pin === VAULT_PIN) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN. Access Denied.");
      setPin("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppSettings(vaultData);
      if (vaultData.custom_domain) {
          await updateSiteMetadata({ custom_domain: vaultData.custom_domain });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Vault sync failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyComms = async (type: "twilio" | "resend") => {
    try {
      const res = await fetch("/api/verify-comms", {
        method: "POST",
        body: JSON.stringify({ type, data: vaultData }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${type.toUpperCase()} Synchronised Successfully! ✅`);
      } else {
        alert(`${type.toUpperCase()} Error: ${data.message || "Invalid Credentials"}`);
      }
    } catch (err) {
      alert("Connection Failed. Check your network or API keys.");
    }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;

  return (
    <div className="space-y-10 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Lock className="w-8 h-8 text-indigo-500" />
          Secured <span className="text-indigo-400 italic">Vault</span>
        </h1>
        <p className="text-white/30 text-sm mt-1 uppercase tracking-widest font-bold">Industrial High-Security Operations</p>
      </div>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 bg-white/[0.02] border border-white/[0.06] rounded-[32px] flex flex-col items-center text-center space-y-8"
          >
            <div className="p-5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <ShieldAlert className="w-12 h-12 text-indigo-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Access Restricted</h3>
              <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                You are entering the high-security operations zone. Authorisation is required to manage financial and connectivity keys.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  placeholder="ENTER ACCESS PIN"
                  className="w-full px-6 py-5 bg-[#0f1117] border border-white/10 rounded-2xl focus:border-indigo-500/50 outline-none transition-all text-white text-center text-lg tracking-[0.4em] font-mono"
                />
                {error && <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest">{error}</p>}
              </div>

              <button
                onClick={handleUnlock}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-sm"
              >
                Authorise Access
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked-vault"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Financial Integrations */}
            <div className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Payment Gateway</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">Paystack Credentials</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Live Public Key</label>
                  <input
                    type="text"
                    value={vaultData.paystack_public_key}
                    onChange={(e) => setVaultData({ ...vaultData, paystack_public_key: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-indigo-300 font-mono text-sm outline-none focus:border-indigo-500/30 transition-all"
                    placeholder="pk_live_••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Live Secret Key</label>
                  <div className="flex gap-2">
                    <input
                      type={showSecret ? "text" : "password"}
                      value={vaultData.paystack_secret_key}
                      onChange={(e) => setVaultData({ ...vaultData, paystack_secret_key: e.target.value })}
                      className="flex-1 px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-indigo-300 font-mono text-sm outline-none focus:border-indigo-500/30 transition-all"
                      placeholder="sk_live_••••••••"
                    />
                    <button 
                      onClick={() => setShowSecret(!showSecret)}
                      className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                      {showSecret ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Connectivity Center */}
            <div className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg font-serif italic">Scheduling Sync</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">Dual-Sync Strategy</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Cal.com Link</label>
                  <input
                    type="text"
                    value={vaultData.cal_link}
                    onChange={(e) => setVaultData({ ...vaultData, cal_link: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-emerald-300 text-sm outline-none focus:border-emerald-500/30 transition-all"
                    placeholder="e.g. your-username/hair-install"
                  />
                  <p className="text-[9px] text-white/20 italic ml-1">Connects your professional scheduling infrastructure.</p>
                </div>
              </div>
            </div>

            {/* Communications Hub (Twilio & Resend) */}
            <div className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Communications Hub</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">SMS & Email Fulfillment</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Twilio SMS */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-pink-400/60 tracking-widest ml-1 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Twilio SMS (Global)
                    </label>
                    <button 
                      onClick={() => handleVerifyComms("twilio")}
                      className="text-[9px] font-bold text-pink-400 uppercase tracking-widest bg-pink-400/10 px-2 py-1 rounded border border-pink-400/20 hover:bg-pink-400/20 transition-all"
                    >
                      Verify Connection
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[9px] uppercase text-white/20 font-bold ml-1">Account SID</p>
                      <input
                        type="text"
                        value={vaultData.twilio_sid}
                        onChange={(e) => setVaultData({ ...vaultData, twilio_sid: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-pink-300 font-mono text-xs outline-none focus:border-pink-500/30 transition-all"
                        placeholder="AC••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] uppercase text-white/20 font-bold ml-1">Auth Token</p>
                      <input
                        type="password"
                        value={vaultData.twilio_token}
                        onChange={(e) => setVaultData({ ...vaultData, twilio_token: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-pink-300 font-mono text-xs outline-none focus:border-pink-500/30 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase text-white/20 font-bold ml-1">Twilio Phone Number (or Sender ID)</p>
                    <input
                      type="text"
                      value={vaultData.twilio_from}
                      onChange={(e) => setVaultData({ ...vaultData, twilio_from: e.target.value })}
                      className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-pink-300 font-mono text-sm outline-none focus:border-pink-500/30 transition-all"
                      placeholder="e.g. +1234567890"
                    />
                  </div>
                </div>

                {/* Resend Email */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-indigo-400/60 tracking-widest ml-1 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Resend Email (Official)
                    </label>
                    <button 
                      onClick={() => handleVerifyComms("resend")}
                      className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded border border-indigo-400/20 hover:bg-indigo-400/20 transition-all"
                    >
                      Verify Connection
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase text-white/20 font-bold ml-1">API Key</p>
                    <input
                      type="password"
                      value={vaultData.resend_api_key}
                      onChange={(e) => setVaultData({ ...vaultData, resend_api_key: e.target.value })}
                      className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-indigo-300 font-mono text-sm outline-none focus:border-indigo-500/30 transition-all"
                      placeholder="re_••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
               <button
                 onClick={handleSave}
                 disabled={saving}
                 className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20"
               >
                 {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Save className="w-5 h-5" />}
                 {saved ? "Vault Synchronised!" : "Secure & Sync"}
               </button>
               
               <button
                 onClick={() => setIsUnlocked(false)}
                 className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all group"
               >
                 <Lock className="w-5 h-5 transition-transform group-hover:scale-110" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
