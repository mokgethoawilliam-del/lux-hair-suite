"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Radio, Package, ShoppingBag,
  Image as ImageIcon, PenSquare, Settings, ExternalLink,
  User, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { getAppSettings } from "@/lib/supabase";

interface AdminProfile {
  admin_name: string;
  store_name: string;
  avatar_color: string;
  business_focus: string;
}

const THEME_MAP: Record<string, { color: string; bg: string; border: string; icon: string; highlight: string }> = {
  "Hair & Beauty": { color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", icon: "text-emerald-400", highlight: "emerald" },
  "Sneakers & Streetwear": { color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/20", icon: "text-amber-400", highlight: "amber" },
  "Clothing & Apparel": { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/20", icon: "text-blue-400", highlight: "blue" },
  "Multi-Hustle": { color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/20", icon: "text-purple-400", highlight: "purple" },
};

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Radio, label: "Lead Radar", href: "/admin/leads" },
  { icon: Package, label: "Inventory", href: "/admin/inventory" },
  { icon: ShoppingBag, label: "Orders & Sales", href: "/admin/orders" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: PenSquare, label: "Site Editor", href: "/admin/editor" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

function Clock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-center">
      <p className="text-lg font-mono font-bold text-white tracking-widest">{time}</p>
      <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">{date}</p>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<AdminProfile>({
    admin_name: "Admin",
    store_name: "My Store",
    avatar_color: "#6366f1",
    business_focus: "Hair & Beauty",
  });

  const loadProfile = useCallback(async () => {
    try {
      const s = await getAppSettings();
      setProfile({
        admin_name: s.admin_name || "Admin",
        store_name: s.store_name || "My Store",
        avatar_color: s.avatar_color || "#6366f1",
        business_focus: s.business_focus || "Hair & Beauty",
      });
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile, pathname]);

  const theme = THEME_MAP[profile.business_focus] || THEME_MAP["Hair & Beauty"];

  const initials = profile.admin_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0f1117] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col border-r border-white/[0.06] sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="px-6 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg shadow-amber-500/20">
               <img src="/kasivault-logo.png" alt="KasiVault" className="w-5 h-5 object-contain invert" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">KasiVault SaaS</p>
          </div>
          <p className="text-lg font-bold text-white truncate">{profile.store_name}</p>
        </div>

        {/* Clock */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <Clock />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  active
                    ? `${theme.bg} text-white border ${theme.border}`
                    : "text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? theme.color : "group-hover:" + theme.color} transition-colors`} />
                <span className="text-sm font-medium">{label}</span>
                {active && <ChevronRight className={`w-3 h-3 ${theme.color} ml-auto`} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 space-y-1 border-t border-white/[0.06] pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/[0.04] text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View Live Site
          </Link>

          {/* Profile Card */}
          <Link href="/admin/profile">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`flex items-center gap-3 px-4 py-3 bg-white/[0.03] hover:${theme.bg} border border-white/[0.06] hover:${theme.border} rounded-xl cursor-pointer transition-all group`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: profile.avatar_color + "33", border: `1px solid ${profile.avatar_color}55` }}
              >
                <span style={{ color: profile.avatar_color }}>{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{profile.admin_name}</p>
                <p className={`text-[9px] ${theme.color.replace('text-', 'text-opacity-60 text-')} uppercase tracking-widest font-bold`}>{profile.business_focus}</p>
              </div>
              <User className={`w-3 h-3 text-white/20 group-hover:${theme.color} ml-auto transition-colors`} />
            </motion.div>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-10 max-w-7xl"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
