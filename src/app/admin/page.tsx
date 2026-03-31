"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, ShoppingBag, Package,
  ChevronRight, ArrowUpRight, Loader2,
} from "lucide-react";
import Link from "next/link";
import { getPlatformStats, fetchLeads, getAppSettings } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  name?: string;
  whatsapp_number?: string;
  source?: string;
  timestamp: string;
  status?: string;
}

interface Stats {
  revenue: number;
  leads: number;
  orders: number;
  products: number;
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";
  return { greeting, dateStr: now.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
}

export default function AdminOverview() {
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState<Stats>({ revenue: 0, leads: 0, orders: 0, products: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = now.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const load = useCallback(async () => {
    try {
      const [platformStats, leads, settings] = await Promise.all([
        getPlatformStats(),
        fetchLeads(),
        getAppSettings(),
      ]);
      setStats(platformStats);
      setRecentLeads((leads as Lead[]).slice(0, 3));
      if (settings.admin_name) setAdminName(settings.admin_name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const statCards = [
    { label: "Total Revenue", value: `R ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "indigo" },
    { label: "Active Leads", value: stats.leads, icon: Users, color: "sky" },
    { label: "Bookings", value: stats.orders, icon: ShoppingBag, color: "violet" },
    { label: "Catalog Items", value: stats.products, icon: Package, color: "emerald" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-indigo-400/60 uppercase tracking-[0.2em] font-bold mb-1">{greeting}</p>
          <h1 className="text-4xl font-bold text-white">
            Welcome back, <span className="text-indigo-400">{adminName}.</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-white/10 transition-all group"
          >
            <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${colorMap[card.color]}`}>
              <card.icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-white">
              {loading ? <span className="text-white/20 animate-pulse">—</span> : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-bold text-white">Recent Leads</h3>
            <Link href="/admin/leads" className="text-xs text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1 hover:text-indigo-300 transition-colors">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-white/20 text-xs uppercase tracking-widest">No leads yet. Share your landing page!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
                    {(lead.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{lead.name || "Anonymous"}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">
                      {lead.source || "Web"} · {new Date(lead.timestamp).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                    {lead.status || "New"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-indigo-400 transition-colors" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Respond to Leads", href: "/admin/leads", color: "indigo" },
                { label: "Add New Product", href: "/admin/inventory", color: "sky" },
                { label: "View Orders", href: "/admin/orders", color: "violet" },
                { label: "Edit Site Content", href: "/admin/editor", color: "emerald" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/10 transition-all group"
                >
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Store Health */}
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/60 font-bold mb-4">Store Health</p>
            <div className="space-y-3">
              {[
                { label: "Inventory", pct: stats.products > 0 ? 100 : 0 },
                { label: "Leads Active", pct: stats.leads > 0 ? Math.min(stats.leads * 10, 100) : 0 },
                { label: "Revenue", pct: stats.revenue > 0 ? Math.min(stats.revenue / 1000, 100) : 0 },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">
                    <span>{bar.label}</span>
                    <span>{bar.pct}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.pct}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
