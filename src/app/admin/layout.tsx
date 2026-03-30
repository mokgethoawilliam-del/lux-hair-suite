"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Radio, Package, Calendar, Settings, Image as ImageIcon, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [brandName, setBrandName] = useState("LUX HAIR");

  useEffect(() => {
    async function load() {
      const { getSiteMetadata } = await import("@/lib/supabase");
      const metadata = await getSiteMetadata();
      if (metadata.brand_name) setBrandName(metadata.brand_name);
    }
    load();
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/admin" },
    { icon: <Radio className="w-5 h-5" />, label: "Lead Radar", href: "/admin/leads" },
    { icon: <Package className="w-5 h-5" />, label: "Inventory", href: "/admin/inventory" },
    { icon: <Calendar className="w-5 h-5" />, label: "Orders & Sales", href: "/admin/orders" },
    { icon: <ImageIcon className="w-5 h-5" />, label: "Gallery", href: "/admin/gallery" },
    { icon: <Home className="w-5 h-5" />, label: "Site Editor", href: "/admin/editor" },
    { icon: <Settings className="w-5 h-5" />, label: "App Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-brand-obsidian flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col gap-12 sticky top-0 h-screen overflow-y-auto">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter uppercase">
          {brandName.split(' ')[0]}<span className="text-brand-gold italic">{brandName.split(' ').slice(1).join(' ')}</span>
          <span className="text-[10px] block font-sans tracking-widest text-white/30 ml-1">MISSION CONTROL</span>
        </Link>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all group ${isActive ? "bg-brand-emerald text-brand-gold shadow-xl" : "hover:bg-white/5 text-white/50 hover:text-white"}`}
              >
                <div className={`transition-all ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-4 px-6 py-4 text-white/30 hover:text-white transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5" />
            View Site
          </Link>
          <div className="px-6 py-4 bg-white/5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-obsidian font-bold text-xs uppercase">
              BH
            </div>
            <div>
              <p className="text-xs font-bold leading-none">Bella Hair</p>
              <p className="text-[10px] text-white/30 uppercase mt-1">Admin Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
