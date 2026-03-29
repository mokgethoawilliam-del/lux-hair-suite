"use client";

import { motion } from "framer-motion";
import { Radio, MessageSquare, ExternalLink, Filter, Search, MoreVertical } from "lucide-react";

const mockLeads = [
  {
    id: 1,
    name: "Lerato M.",
    platform: "X (Twitter)",
    snippet: "Looking for a hair plug in Polokwane. Need a high-quality frontal for my graduation next week!",
    intent: "High Intent - Buying",
    score: 0.95,
    timestamp: "2 mins ago",
  },
  {
    id: 2,
    name: "Thandi K.",
    platform: "Instagram",
    snippet: "Do you guys do installations for ponytails or just weaves?",
    intent: "Inquiry - Service",
    score: 0.72,
    timestamp: "45 mins ago",
  },
  {
    id: 3,
    name: "Anonymous",
    platform: "Web Search",
    snippet: "HD Frontal price list 2026 South Africa",
    intent: "Price Sensitivity",
    score: 0.45,
    timestamp: "2 hours ago",
  },
];

export default function LeadRadar() {
  const handleQuickReply = (name: string) => {
    const message = encodeURIComponent(`Hi ${name}, I saw your inquiry about the hair. How can I help you today?`);
    window.open(`https://wa.me/27123456789?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2">Lead <span className="text-brand-gold italic">Radar</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">REAL-TIME OPPORTUNITY TRACKING</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <Filter className="w-4 h-4 text-white/30" />
            <span className="text-sm">Filter: All Platforms</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-brand-gold text-brand-obsidian font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-gold/10"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            Refresh Radar
          </motion.button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-brand-emerald/10 border border-brand-emerald/20 rounded-3xl">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">Active Signals</p>
          <p className="text-4xl font-serif">12</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">High Intent</p>
          <p className="text-4xl font-serif text-brand-gold">08</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">Response Rate</p>
          <p className="text-4xl font-serif">94%</p>
        </div>
      </div>

      {/* Radar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockLeads.map((lead, idx) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-brand-gold/20 transition-all group relative overflow-hidden"
          >
            {/* Platform Badge */}
            <div className="flex items-center justify-between mb-8">
               <div className="px-4 py-1.5 bg-brand-obsidian border border-white/10 rounded-full flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                 <span className="text-[10px] uppercase tracking-widest font-bold">{lead.platform}</span>
               </div>
               <button className="text-white/20 hover:text-white transition-colors">
                 <MoreVertical className="w-5 h-5" />
               </button>
            </div>

            <div className="mb-6">
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-2xl font-serif">{lead.name === "Anonymous" ? "Direct Lead" : lead.name}</h3>
                <span className="text-[10px] text-white/30 uppercase font-bold">{lead.timestamp}</span>
              </div>
              <p className="text-white/50 leading-relaxed italic border-l-2 border-brand-gold/30 pl-4 py-2 mb-6">
                "{lead.snippet}"
              </p>
              
              <div className="flex items-center justify-between p-4 bg-brand-emerald/5 rounded-2xl border border-brand-emerald/10">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-bold">Intent Analysis</span>
                  <span className="text-xs font-bold text-brand-gold">{lead.intent}</span>
                </div>
                <div className="text-right">
                   <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1 block font-bold">Match Score</span>
                   <span className="text-sm font-bold">{Math.round(lead.score * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleQuickReply(lead.name)}
                className="flex-1 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-brand-gold/10"
              >
                <MessageSquare className="w-4 h-4" />
                Quick Reply
              </button>
              <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
