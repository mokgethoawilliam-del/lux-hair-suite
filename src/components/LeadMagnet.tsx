"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { captureLead } from "@/lib/supabase";

export default function LeadMagnet() {
  const [formData, setFormData] = useState({ name: "", whatsapp: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      await captureLead({
        name: formData.name,
        whatsapp_number: formData.whatsapp,
        source: "Footer",
      });
      setStatus("success");
      setFormData({ name: "", whatsapp: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="py-24 bg-brand-obsidian border-t border-brand-gold/10 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-brand-emerald p-10 md:p-16 rounded-[40px] shadow-2xl border border-white/5 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
              Exclusive Access
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Join the <span className="italic">Drop List</span>.
            </h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Get early access to our premium bundles and receive our <strong>"2026 Weave Care Guide"</strong> PDF instantly via WhatsApp.
            </p>

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="p-4 bg-brand-gold text-brand-obsidian rounded-full">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif">You're on the list!</h3>
                <p className="text-white/40">Check your WhatsApp for your gift.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 px-6 py-4 bg-black/20 border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all placeholder:text-white/20 text-white"
                />
                <input 
                  type="tel" 
                  placeholder="WhatsApp Number"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="flex-1 px-6 py-4 bg-black/20 border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all placeholder:text-white/20 text-white"
                />
                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join Now <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
            
            <p className="mt-8 text-[10px] text-white/20 uppercase tracking-widest font-bold">
              No Spam. Just Luxury Drops & Expert Care.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
