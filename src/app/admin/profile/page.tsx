"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Save, Loader2, CheckCircle2, Lock,
  Eye, EyeOff, Key, ShieldAlert, CreditCard,
  Globe, ExternalLink,
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
    business_focus: "Hair & Beauty",
    custom_domain: "",
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
          business_focus: s.business_focus || "Hair & Beauty",
          custom_domain: s.custom_domain || "",
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

  const FOCUS_OPTIONS = [
    { name: "Hair & Beauty", icon: "✨", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Sneakers & Streetwear", icon: "👟", color: "text-amber-400", bg: "bg-amber-500/10" },
    { name: "Clothing & Apparel", icon: "👕", color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Multi-Hustle", icon: "🚀", color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

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
      {/* Store Address & Custom Domain */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-white">Store Address</h3>
        </div>

        <div className="space-y-6">
          {/* Subdomain Display */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Permanent Address</label>
            <div className="flex items-center gap-3 p-4 bg-[#0f1117] border border-white/10 rounded-xl group hover:border-purple-500/30 transition-all">
               <code className="text-sm text-purple-400/80 flex-1 truncate">
                 {profile.store_name.toLowerCase().replace(/\s+/g, '-') || "brand"}.kasivault.com
               </code>
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-green-400/60 uppercase tracking-widest px-2 py-0.5 bg-green-400/10 rounded border border-green-400/20">Live</span>
                  <button className="p-1 hover:text-white transition-colors text-white/20"><ExternalLink className="w-3.5 h-3.5" /></button>
               </div>
            </div>
            <p className="text-[9px] text-white/20 italic tracking-wide">
              ✦ This is your official KasiVault subdomain. It is managed automatically.
            </p>
          </div>

          {/* Custom Domain Input */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Connect Professional Domain</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={profile.custom_domain}
                onChange={(e) => setProfile({ ...profile, custom_domain: e.target.value })}
                className="flex-1 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-purple-500/50 outline-none transition-all text-white text-sm"
                placeholder="e.g. www.glamhair.co.za"
              />
              <button 
                onClick={saveProfile}
                className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
              >
                {savingProfile ? "..." : "Connect"}
              </button>
            </div>
            
            <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
               <p className="text-[10px] text-purple-400/60 flex items-center gap-2 mb-2 font-bold uppercase tracking-widest">
                 <CheckCircle2 className="w-3 h-3" /> CNAME Verification
               </p>
               <p className="text-[10px] text-white/30 leading-relaxed">
                 To link your professional domain, point a **CNAME record** at your DNS provider (GoDaddy, etc.) to:
                 <br />
                 <code className="bg-black/40 px-1 py-0.5 rounded text-purple-400 mt-1 inline-block">cname.kasivault.com</code>
               </p>
            </div>
          </div>
        </div>
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
