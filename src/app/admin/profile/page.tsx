"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Save, Loader2, CheckCircle2, Lock,
  Eye, EyeOff, Key, ShieldAlert, CreditCard,
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
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Vault state
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultPin, setVaultPin] = useState("");
  const [vaultError, setVaultError] = useState("");
  const [payVault, setPayVault] = useState({ paystack_public_key: "", paystack_secret_key: "" });
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
        });
        setPayVault({
          paystack_public_key: s.paystack_public_key || "",
          paystack_secret_key: s.paystack_secret_key || "",
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
      await updateAppSettings(payVault);
      setVaultSaved(true);
      setTimeout(() => setVaultSaved(false), 3000);
    } catch (err) { console.error(err); alert("Failed to save vault."); }
    finally { setSavingVault(false); }
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
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-bold text-white">Personal Info</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Your Name</label>
            <input
              type="text"
              value={profile.admin_name}
              onChange={(e) => setProfile({ ...profile, admin_name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="e.g. Thando Ndlovu"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Brand / Store Name</label>
            <input
              type="text"
              value={profile.store_name}
              onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="e.g. Glam Hair Collection"
            />
            <p className="text-[10px] text-indigo-400/60 ml-1">✦ This updates your landing page navbar &amp; footer automatically</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">WhatsApp Number</label>
            <input
              type="text"
              value={profile.whatsapp_number}
              onChange={(e) => setProfile({ ...profile, whatsapp_number: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
              placeholder="27631234567"
            />
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={savingProfile}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
        >
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : profileSaved ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
          {profileSaved ? "Profile Saved!" : "Save Profile"}
        </button>
      </motion.div>

      {/* Payment Vault — PIN Protected */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-white/[0.06] rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Payment Vault</h3>
            <p className="text-xs text-white/30">Paystack keys — PIN protected</p>
          </div>
          {vaultUnlocked ? (
            <div className="ml-auto flex items-center gap-1.5 text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Unlocked</span>
            </div>
          ) : (
            <Lock className="w-4 h-4 text-white/20 ml-auto" />
          )}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!vaultUnlocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/60 leading-relaxed">
                    Enter your vault PIN to access payment credentials. Unauthorised access to these keys can compromise your finances.
                  </p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={vaultPin}
                    onChange={(e) => setVaultPin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && unlockVault()}
                    placeholder="Enter Vault PIN"
                    className="flex-1 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none transition-all text-white text-sm tracking-widest"
                  />
                  <button
                    onClick={unlockVault}
                    className="px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-bold rounded-xl transition-all text-sm"
                  >
                    Unlock
                  </button>
                </div>
                {vaultError && <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{vaultError}</p>}
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Paystack Public Key</label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white/20 flex-shrink-0" />
                    <input
                      type="text"
                      value={payVault.paystack_public_key}
                      onChange={(e) => setPayVault({ ...payVault, paystack_public_key: e.target.value })}
                      className="flex-1 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-amber-500/50 outline-none transition-all text-white text-sm font-mono"
                      placeholder="pk_live_••••••••••••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Paystack Secret Key</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus-within:border-amber-500/50 transition-all">
                      <CreditCard className="w-4 h-4 text-white/20 flex-shrink-0" />
                      <input
                        type={showSecret ? "text" : "password"}
                        value={payVault.paystack_secret_key}
                        onChange={(e) => setPayVault({ ...payVault, paystack_secret_key: e.target.value })}
                        className="flex-1 bg-transparent outline-none text-white text-sm font-mono"
                        placeholder="sk_live_••••••••••••••••••"
                      />
                    </div>
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                      {showSecret ? <EyeOff className="w-4 h-4 text-white/40" /> : <Eye className="w-4 h-4 text-white/40" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveVault}
                    disabled={savingVault}
                    className="flex-1 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    {savingVault ? <Loader2 className="w-4 h-4 animate-spin" /> : vaultSaved ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
                    {vaultSaved ? "Vault Saved!" : "Save to Vault"}
                  </button>
                  <button
                    onClick={() => setVaultUnlocked(false)}
                    className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white rounded-xl transition-all text-sm"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
