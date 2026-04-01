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
            <p className="text-[9px] text-indigo-400/60 ml-1 italic leading-relaxed">
               This updates your boutique identity across the landing page and official receipts.
            </p>
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

      {/* Security Notice */}
      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4">
        <Lock className="w-6 h-6 text-indigo-400 opacity-40" />
        <p className="text-xs text-white/30 leading-relaxed font-medium">
          Sensitive configurations including **Payments**, **Domains**, and **Scheduling** have been moved to the <span className="text-indigo-400 font-bold">Secured Vault</span> for industrial-grade protection.
        </p>
      </div>
    </div>
  );
}
