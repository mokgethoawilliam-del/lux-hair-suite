"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Globe, PenSquare, Shield, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";

const DOCS = [
  {
    category: "Getting Started",
    icon: BookOpen,
    articles: [
      { id: "setup", title: "Launching Your First Vault", content: "Learn how to set up your business focus, brand name, and story in the Settings tab." },
      { id: "theme", title: "Customizing Your Brand Theme", content: "Selecting a Business Focus automatically re-themes your storefront. Choose between Hair, Sneakers, Fashion, or Multi-Hustle." },
    ]
  },
  {
    category: "E-Commerce & Inventory",
    icon: PenSquare,
    articles: [
      { id: "inventory", title: "Managing Diverse Products", content: "How to add weaves, sneakers, or tech items to your inventory. Remember to use high-quality images for a premium look." },
      { id: "multi-hustle", title: "The Multi-Hustle Strategy", content: "Selling both Services (Hair) and Products (Sneakers)? Use the Multi-Hustle focus for a versatile shop layout." },
    ]
  },
  {
    category: "Advanced Features",
    icon: Globe,
    articles: [
      { id: "domain", title: "Connecting a Professional Domain", content: "Step-by-step DNS guide for your custom domain. Point your A records and CNAME to KasiVault's high-speed servers." },
      { id: "bookings", title: "Mastering the Gig Radar", content: "Configure real-time booking alerts and manage your calendar for service-based commerce." },
    ]
  }
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");

  const filteredDocs = DOCS.map(cat => ({
    ...cat,
    articles: cat.articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => cat.articles.length > 0);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs text-indigo-400/60 uppercase tracking-[0.2em] font-bold mb-1">Support & Guidance</p>
        <h1 className="text-3xl font-bold text-white">Help Center</h1>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for guides, 'domains', 'bookings'..."
          className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/10 rounded-2xl focus:border-indigo-500/50 outline-none transition-all text-white text-sm"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((cat, idx) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-indigo-400">
               <cat.icon className="w-5 h-5 opacity-60" />
               <h2 className="text-xs uppercase tracking-widest font-bold">{cat.category}</h2>
            </div>

            <div className="space-y-3">
              {cat.articles.map(article => (
                <div 
                  key={article.id}
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                    {article.title}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-xs text-white/30 leading-relaxed">
                    {article.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 border-t border-white/5">
        <a href="/admin/settings" className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between group">
           <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-white">Go to Domain Hub</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Link your custom domain</p>
              </div>
           </div>
           <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
        </a>
        <a href="/admin/calendar" className="p-6 bg-pink-500/5 border border-pink-500/10 rounded-2xl flex items-center justify-between group">
           <div className="flex items-center gap-4">
              <HelpCircle className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-sm font-bold text-white">Contact Platform Support</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Talk to a human developer</p>
              </div>
           </div>
           <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
        </a>
      </div>
    </div>
  );
}
