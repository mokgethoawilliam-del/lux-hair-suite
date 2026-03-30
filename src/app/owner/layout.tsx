"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Key, Users, LogOut, Shield, ChevronRight,
} from "lucide-react";
import Link from "next/link";

const OWNER_PIN = process.env.NEXT_PUBLIC_OWNER_PIN || "luxowner2026";

const navItems = [
  { href: "/owner", label: "Overview", icon: LayoutDashboard },
  { href: "/owner/keys", label: "API Key Vault", icon: Key },
  { href: "/owner/clients", label: "Clients", icon: Users },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("owner_authed");
    if (saved === "true") setAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = () => {
    if (pin === OWNER_PIN) {
      sessionStorage.setItem("owner_authed", "true");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect PIN. Access denied.");
      setPin("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("owner_authed");
    setAuthed(false);
    router.push("/owner");
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0012] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 mb-6">
              <Shield className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl font-serif text-white mb-2">
              Owner <span className="text-purple-400 italic">Portal</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">
              Lux Hair Suite · SaaS Control Centre
            </p>
          </div>

          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[40px] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">
                Owner PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your secret PIN"
                className="w-full px-6 py-4 bg-[#0a0012] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white text-lg tracking-widest"
              />
              {error && (
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest ml-1">{error}</p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              <Shield className="w-4 h-4" /> Access Owner Portal
            </button>
          </div>

          <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mt-8">
            Unauthorized access is prohibited
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0012] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/5 p-8">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Owner Portal</p>
              <p className="text-[9px] uppercase tracking-widest text-purple-400/60 font-bold">SaaS Control</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                  active
                    ? "bg-purple-600/20 border border-purple-500/30 text-white"
                    : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-purple-400" : "group-hover:text-purple-400"} transition-colors`} />
                <span className="font-bold text-sm uppercase tracking-wider">{label}</span>
                {active && <ChevronRight className="w-4 h-4 text-purple-400 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 text-white/20 hover:text-red-400 transition-colors group rounded-2xl hover:bg-red-500/5"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-wider">Exit Portal</span>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
