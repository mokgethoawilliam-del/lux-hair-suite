"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, Zap, BarChart3, ArrowUpRight } from "lucide-react";
import { getPlatformStats } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

interface Stats {
  products: number;
  leads: number;
  orders: number;
  revenue: number;
}

export default function OwnerOverview() {
  const [stats, setStats] = useState<Stats>({ products: 0, leads: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Platform Revenue", value: `R ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "purple" },
    { label: "Total Leads", value: stats.leads, icon: Users, color: "blue" },
    { label: "Orders Processed", value: stats.orders, icon: ShoppingBag, color: "green" },
    { label: "Active Products", value: stats.products, icon: BarChart3, color: "orange" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-2">SaaS Control Centre</p>
        <h1 className="text-5xl font-serif text-white">
          Platform <span className="text-purple-400 italic">Overview</span>
        </h1>
        <p className="text-white/30 text-sm mt-2">Real-time metrics across all your deployments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] hover:border-purple-500/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-all">
                <card.icon className="w-5 h-5 text-purple-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-2">{card.label}</p>
            <p className="text-4xl font-serif text-white">
              {loading ? <span className="text-white/20 animate-pulse">—</span> : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Platform Status */}
      <div className="p-10 bg-purple-600/5 border border-purple-500/10 rounded-[40px] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-serif">Platform <span className="text-purple-400 italic">Health</span></h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Supabase DB", status: "Connected", ok: true },
            { label: "Gemini AI", status: "Key Configured via Vault", ok: true },
            { label: "Paystack", status: "Awaiting Key", ok: false },
          ].map((item) => (
            <div key={item.label} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${item.ok ? "bg-green-400" : "bg-orange-400"}`} />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{item.label}</span>
              </div>
              <p className={`text-sm font-bold ${item.ok ? "text-white/70" : "text-orange-400"}`}>{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick note */}
      <div className="p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex items-start gap-4">
        <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm font-bold text-white/60 mb-1">Owner Reminder</p>
          <p className="text-xs text-white/30 leading-relaxed">
            Your Gemini API key is stored securely in the Key Vault — your clients cannot see or access it.
            The AI design tool in their admin dashboard uses it silently on their behalf.
          </p>
        </div>
      </div>
    </div>
  );
}
