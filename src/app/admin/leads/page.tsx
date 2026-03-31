"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, MessageSquare, ExternalLink, Filter, MoreVertical } from "lucide-react";
import { fetchLeads } from "@/lib/supabase";

interface Lead {
  id: string;
  name?: string;
  whatsapp_number?: string;
  source?: string;
  timestamp: string;
  snippet?: string;
  status?: string;
}

export default function LeadRadar() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data as Lead[]);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleQuickReply = (name: string, number?: string) => {
    const targetNumber = number || "27123456789";
    const message = encodeURIComponent(`Hi ${name}, I saw your inquiry about the hair. How can I help you today?`);
    window.open(`https://wa.me/${targetNumber}?text=${message}`, "_blank");
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
            onClick={loadLeads}
            disabled={isLoading}
            className="px-6 py-2 bg-brand-gold text-brand-obsidian font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-gold/10 disabled:opacity-50"
          >
            <Radio className={`w-4 h-4 ${isLoading ? "animate-spin" : "animate-pulse"}`} />
            {isLoading ? "Refreshing..." : "Refresh Radar"}
          </motion.button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">Total Signals</p>
          <p className="text-4xl font-bold text-white">{isLoading ? "—" : leads.length.toString().padStart(2, "0")}</p>
        </div>
        <div className="p-8 bg-white/[0.03] border border-white/[0.06] rounded-3xl">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">New (Unread)</p>
          <p className="text-4xl font-bold text-indigo-400">{isLoading ? "—" : leads.filter(l => !l.status || l.status === "New").length.toString().padStart(2, "0")}</p>
        </div>
        <div className="p-8 bg-white/[0.03] border border-white/[0.06] rounded-3xl">
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">Responded</p>
          <p className="text-4xl font-bold text-white">{isLoading ? "—" : (leads.length > 0 ? `${Math.round((leads.filter(l => l.status === "Contacted").length / leads.length) * 100)}%` : "0%")}</p>
        </div>
      </div>

      {/* Radar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {leads.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[32px] border border-dashed border-white/10">
             <p className="text-white/30 uppercase tracking-widest text-sm">No leads captured yet.</p>
          </div>
        )}
        {leads.map((lead, idx) => (
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
                  <span className="text-[10px] uppercase tracking-widest font-bold">{lead.source || "Web"}</span>
               </div>
               <button className="text-white/20 hover:text-white transition-colors">
                 <MoreVertical className="w-5 h-5" />
               </button>
            </div>

            <div className="mb-6">
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-2xl font-serif">{lead.name || "Anonymous Lead"}</h3>
                <span className="text-[10px] text-white/30 uppercase font-bold">{new Date(lead.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-white/50 leading-relaxed italic border-l-2 border-brand-gold/30 pl-4 py-2 mb-6">
                &quot;{lead.snippet || `New inquiry from ${lead.name || 'customer'} regarding services.`}&quot;
              </p>
              
              <div className="flex items-center justify-between p-4 bg-brand-emerald/5 rounded-2xl border border-brand-emerald/10">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-bold">Status</span>
                  <span className="text-xs font-bold text-brand-gold">{lead.status}</span>
                </div>
                <div className="text-right">
                   <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1 block font-bold">Contact</span>
                   <span className="text-sm font-bold">{lead.whatsapp_number}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleQuickReply(lead.name || "Customer", lead.whatsapp_number)}
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
