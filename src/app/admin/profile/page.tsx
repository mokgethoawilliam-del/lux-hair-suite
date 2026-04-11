"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Save, Loader2, CheckCircle2, Lock,
  Eye, EyeOff, Key, ShieldAlert, CreditCard,
  Globe, ExternalLink, MessageSquare, Mail, Calendar
} from "lucide-react";
import { getAppSettings, updateAppSettings, updateSiteMetadata } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

const VAULT_PIN = process.env.NEXT_PUBLIC_VAULT_PIN || "pay2026";

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

export default function AdminProfile() {
  // Profile state
    const [profile, setProfile] = useState({
    admin_name: "",
    store_name: "",
    whatsapp_number: "",
    avatar_color: "#6366f1",
    business_focus: "Premium Weaves & Hair",
    custom_domain: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Vault state
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultPin, setVaultPin] = useState("");
  const [vaultError, setVaultError] = useState("");
  const [vaultData, setVaultData] = useState({
    paystack_public_key: "",
    paystack_secret_key: "",
    cal_link: "",
    google_calendar_id: "",
    twilio_sid: "",
    twilio_token: "",
    twilio_from: "",
    resend_api_key: "",
  });
  const [showSecret, setShowSecret] = useState(false);
  const [savingVault, setSavingVault] = useState(false);
  const [vaultSaved, setVaultSaved] = useState(false);

  useEffect(() => {
    getAppSettings()
      .then((s) => {
        setProfile({
          admin_name: s.admin_name || "",
          store_name: s.store_name || "",
          whatsapp_number: s.whatsapp_number || "",
          avatar_color: s.avatar_color || "#6366f1",
          business_focus: s.business_focus || "Premium Weaves & Hair",
          custom_domain: s.custom_domain || "",
        });
        setVaultData({
          paystack_public_key: s.paystack_public_key || "",
          paystack_secret_key: s.paystack_secret_key || "",
          cal_link: s.cal_link || "",
          google_calendar_id: s.google_calendar_id || "",
          twilio_sid: s.twilio_sid || "",
          twilio_token: s.twilio_token || "",
          twilio_from: s.twilio_from || "",
          resend_api_key: s.resend_api_key || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoadingProfile(false));
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      // Save to app_settings (admin profile)
      await updateAppSettings(profile);
      // Also sync store_name → brand_name on the landing page
      if (profile.store_name) {
        await updateSiteMetadata({ brand_name: profile.store_name });
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) { console.error(err); alert("Failed to save profile."); }
    finally { setSavingProfile(false); }
  };

  const unlockVault = () => {
    if (vaultPin === VAULT_PIN) {
      setVaultUnlocked(true);
      setVaultError("");
      setVaultPin("");
    } else {
      setVaultError("Incorrect PIN. Access denied.");
      setVaultPin("");
    }
  };

  const saveVault = async () => {
    setSavingVault(true);
    try {
      await updateAppSettings(vaultData);
      setVaultSaved(true);
      setTimeout(() => setVaultSaved(false), 3000);
    } catch (err) { console.error(err); alert("Failed to save vault."); }
    finally { setSavingVault(false); }
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

  const initials = profile.admin_name
    .split(" ").map((w) => w[0] || "").join("").slice(0, 2).toUpperCase() || "?";

  if (loadingProfile) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
    </div>
  );

  return (
    <div className="space-y-10 max-w-2xl">
      {/* Header */}
      <div>
        <p className="text-xs text-indigo-400/60 uppercase tracking-[0.2em] font-bold mb-1">Personalisation</p>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-white/30 text-sm mt-1">Personalise your dashboard and manage payment settings.</p>
      </div>

      {/* Avatar Preview */}
      <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold transition-all"
          style={{ backgroundColor: profile.avatar_color + "22", border: `2px solid ${profile.avatar_color}44`, color: profile.avatar_color }}
        >
          {initials}
        </div>
        <div>
          <p className="font-bold text-white text-lg">{profile.admin_name || "Your Name"}</p>
          <p className="text-white/30 text-sm">{profile.store_name || "Your Store"}</p>
          <div className="flex gap-2 mt-3">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setProfile({ ...profile, avatar_color: c })}
                className="w-5 h-5 rounded-full transition-all hover:scale-110"
                style={{
                  backgroundColor: c,
                  outline: profile.avatar_color === c ? `2px solid ${c}` : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-bold text-white uppercase tracking-tight">Identity Profile</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Your Name</label>
            <input
              type="text"
              value={profile.admin_name}
              onChange={(e) => setProfile({ ...profile, admin_name: e.target.value })}
              className="w-full px-5 py-4 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="e.g. Kagiso"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Brand / Boutique Name</label>
            <input
              type="text"
              value={profile.store_name}
              onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
              className="w-full px-5 py-4 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="e.g. Kagiso Hair Suite"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">WhatsApp Communications</label>
            <input
              type="text"
              value={profile.whatsapp_number}
              onChange={(e) => setProfile({ ...profile, whatsapp_number: e.target.value })}
              className="w-full px-5 py-4 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="e.g. 27631234567"
            />
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={savingProfile}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20"
        >
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : profileSaved ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
          {profileSaved ? "Identity Synchronised!" : "Update Identity"}
        </button>
      </motion.div>

      {/* Secured Vault Integration */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Lock className="w-5 h-5 text-indigo-400" />
              Secured <span className="text-indigo-400 italic">Vault</span>
            </h2>
            <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1 font-bold">Payments & Infrastructure</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!vaultUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-10 bg-white/[0.02] border border-white/[0.06] rounded-3xl flex flex-col items-center text-center space-y-6"
            >
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <ShieldAlert className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Access Restricted</h4>
                <p className="text-[10px] text-white/30 max-w-[240px] leading-relaxed">
                  Sensitive payment and communications data is encrypted. Enter your security PIN to modify.
                </p>
              </div>
              <div className="w-full max-w-[200px] space-y-3">
                <input
                  type="password"
                  value={vaultPin}
                  onChange={(e) => setVaultPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && unlockVault()}
                  placeholder="••••"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-center text-lg tracking-[0.5em] font-mono outline-none focus:border-indigo-500/40"
                />
                {vaultError && <p className="text-[9px] text-red-400 uppercase font-bold tracking-widest">{vaultError}</p>}
                <button
                  onClick={unlockVault}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest transition-all"
                >
                  Authorise
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Financials */}
              <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-white/20" />
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Financial Gateway</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Live Public Key</label>
                    <input
                      type="text"
                      value={vaultData.paystack_public_key}
                      onChange={(e) => setVaultData({ ...vaultData, paystack_public_key: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-indigo-300 font-mono text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Live Secret Key</label>
                    <div className="flex gap-2">
                      <input
                        type={showSecret ? "text" : "password"}
                        value={vaultData.paystack_secret_key}
                        onChange={(e) => setVaultData({ ...vaultData, paystack_secret_key: e.target.value })}
                        className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-indigo-300 font-mono text-xs outline-none"
                      />
                      <button onClick={() => setShowSecret(!showSecret)} className="px-3 bg-white/5 border border-white/10 rounded-xl">
                        {showSecret ? <EyeOff className="w-3 h-3 text-white/20" /> : <Eye className="w-3 h-3 text-white/20" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comms */}
              <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-white/20" />
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Communications Hub</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-pink-400 opacity-60">Twilio SMS</span>
                    <button onClick={() => handleVerifyComms("twilio")} className="text-[8px] uppercase font-bold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded border border-pink-400/20">Verify</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={vaultData.twilio_sid}
                      placeholder="Twilio SID"
                      onChange={(e) => setVaultData({ ...vaultData, twilio_sid: e.target.value })}
                      className="px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-pink-300"
                    />
                    <input
                      type="password"
                      value={vaultData.twilio_token}
                      placeholder="Auth Token"
                      onChange={(e) => setVaultData({ ...vaultData, twilio_token: e.target.value })}
                      className="px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-pink-300"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-indigo-400 opacity-60">Resend Email</span>
                    <button onClick={() => handleVerifyComms("resend")} className="text-[8px] uppercase font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">Verify</button>
                  </div>
                  <input
                    type="password"
                    value={vaultData.resend_api_key}
                    placeholder="Resend API Key"
                    onChange={(e) => setVaultData({ ...vaultData, resend_api_key: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-indigo-300"
                  />
                </div>
              </div>

              {/* Scheduling */}
              <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-white/20" />
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Scheduling Link</span>
                </div>
                <input
                  type="text"
                  value={vaultData.cal_link}
                  placeholder="cal.com/your-username"
                  onChange={(e) => setVaultData({ ...vaultData, cal_link: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-emerald-300 text-xs outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={saveVault}
                  disabled={savingVault}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                >
                  {savingVault ? <Loader2 className="w-4 h-4 animate-spin" /> : vaultSaved ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
                  {vaultSaved ? "Vault Synced!" : "Secure & Sync Vault"}
                </button>
                <button onClick={() => setVaultUnlocked(false)} className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white/30 hover:text-red-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
