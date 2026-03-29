"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, CreditCard, ChevronRight, Bell } from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const stats = [
    { label: "Total Revenue", value: "R42,500", icon: <CreditCard className="w-5 h-5 text-brand-gold" />, trend: "+12.5%" },
    { label: "Active Leads", value: "24", icon: <Users className="w-5 h-5 text-brand-gold" />, trend: "+4" },
    { label: "Bookings", value: "12", icon: <ShoppingBag className="w-5 h-5 text-brand-gold" />, trend: "+3" },
    { label: "Analytics", value: "High", icon: <TrendingUp className="w-5 h-5 text-brand-gold" />, trend: "Optimal" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-serif mb-2">Welcome Back, <span className="text-brand-gold italic">Bella.</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">YOUR LUXURY EMPIRE AT A GLANCE</p>
        </div>
        
        <div className="flex items-center gap-6">
           <button className="relative p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
             <Bell className="w-6 h-6 text-white/40" />
             <div className="absolute top-4 right-4 w-2 h-2 bg-brand-gold rounded-full border-2 border-brand-obsidian" />
           </button>
           <div className="h-12 w-px bg-white/10" />
           <div className="text-right">
              <p className="text-sm font-bold">29 March, 2026</p>
              <p className="text-[10px] text-white/30 uppercase font-bold">Session: 4h 12m</p>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-brand-gold/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-brand-emerald/10 rounded-2xl group-hover:bg-brand-gold/10 transition-all">
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</p>
            <p className="text-4xl font-serif text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-10 bg-white/5 border border-white/5 rounded-[40px] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif">Recent <span className="text-brand-gold italic">Leads</span></h3>
            <Link href="/admin/leads" className="text-xs font-bold uppercase tracking-widest text-brand-gold border-b border-brand-gold/20 pb-1">View All Activity</Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group cursor-pointer">
                 <div className="w-12 h-12 bg-brand-emerald/20 border border-brand-gold/20 rounded-full flex items-center justify-center font-bold text-brand-gold">
                   L{i}
                 </div>
                 <div className="flex-1">
                    <p className="font-bold">New Lead from Instagram</p>
                    <p className="text-xs text-white/30 uppercase mt-1">20 mins ago • High Intent</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-brand-gold transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Missions */}
        <div className="p-10 bg-brand-emerald border border-brand-emerald/5 rounded-[40px] space-y-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full" />
          
          <h3 className="text-2xl font-serif">Mission <span className="text-brand-gold italic">Control</span></h3>
          <div className="flex flex-col gap-4">
            <Link href="/admin/leads" className="w-full p-6 bg-white shadow-2xl rounded-2xl text-brand-obsidian flex items-center justify-between group hover:scale-[1.02] transition-all">
               <span className="font-bold">Respond to Leads</span>
               <div className="p-2 bg-brand-gold/10 group-hover:bg-brand-gold transition-all rounded-lg">
                 <ChevronRight className="w-4 h-4 text-brand-gold group-hover:text-brand-obsidian" />
               </div>
            </Link>
            <Link href="/admin/inventory" className="w-full p-6 bg-white shadow-2xl rounded-2xl text-brand-obsidian flex items-center justify-between group hover:scale-[1.02] transition-all">
               <span className="font-bold">Toggle Inventory</span>
               <div className="p-2 bg-brand-gold/10 group-hover:bg-brand-gold transition-all rounded-lg">
                 <ChevronRight className="w-4 h-4 text-brand-gold group-hover:text-brand-obsidian" />
               </div>
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10">
             <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 mb-6">Store Health</p>
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
             </div>
             <p className="text-[10px] font-bold text-white/50 text-right mt-2">85% Conversion Potential</p>
          </div>
        </div>
      </div>
    </div>
  );
}
