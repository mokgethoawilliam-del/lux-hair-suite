"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getSiteMetadata } from "@/lib/supabase";

export default function Hero({ siteId }: { siteId?: string }) {
  const [content, setContent] = useState({
    hero_headline: "Premium Hair Redefined.",
    hero_description: "Experience the ultimate in high-performance Frontals, Ponytails, and Weaves. Professional installations for the modern woman who demands excellence."
  });
  useEffect(() => {
    async function load() {
      const metadata = await getSiteMetadata(siteId);
      if (metadata.hero_headline) {
        setContent({
          hero_headline: metadata.hero_headline,
          hero_description: metadata.hero_description || "Experience the ultimate in high-performance Frontals, Ponytails, and Weaves. Professional installations for the modern woman who demands excellence."
        });
      }
    }
    load();
  }, [siteId]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-obsidian">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,44,34,0.4)_0%,transparent_70%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-emerald/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-gold/10 blur-3xl rounded-full" />
      </div>

      <div className="container relative z-10 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium tracking-widest uppercase border rounded-full text-brand-gold border-brand-gold/30 gold-text">
            The Luxe Collection
          </span>
          <h1 className="mb-6 text-5xl md:text-8xl font-serif leading-tight whitespace-pre-line">
            {content.hero_headline}
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-white/60 font-light leading-relaxed">
            {content.hero_description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-brand-gold text-brand-obsidian font-semibold rounded-full flex items-center gap-2 group transition-all"
            >
              Shop The Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('installations')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all"
            >
              Book Installation
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Hero Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-gold/50 to-transparent" />
      </motion.div>
    </section>
  );
}
