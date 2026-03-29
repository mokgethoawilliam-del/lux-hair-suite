"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

const categories = [
  {
    title: "HD Frontals",
    description: "Ultra-thin lace for a seamless, natural hairline.",
    image: "https://images.unsplash.com/photo-1595475243692-392881ca8d32?q=80&w=800&auto=format&fit=crop", // placeholder
    price: "From R1,200",
  },
  {
    title: "Sleek Ponytails",
    description: "Instant luxury and length in minutes.",
    image: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?q=80&w=800&auto=format&fit=crop", // placeholder
    price: "From R850",
  },
  {
    title: "Virgin Weaves",
    description: "Double-drawn bundles for maximum volume.",
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=800&auto=format&fit=crop", // placeholder
    price: "From R1,500",
  },
];

export default function CategoryGrid() {
  const handleWhatsAppInquiry = (category: string) => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${category}...`);
    window.open(`https://wa.me/27123456789?text=${message}`, "_blank");
  };

  return (
    <section id="collections" className="py-24 bg-brand-obsidian">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 uppercase tracking-tighter">
              The <span className="text-brand-gold italic">Essential</span> Edit
            </h2>
            <p className="text-white/60 font-light">
              Carefully curated hair collections designed to elevate your style with premium quality and effortless elegance.
            </p>
          </div>
          <button className="text-brand-gold border-b border-brand-gold/50 pb-1 hover:border-brand-gold transition-all uppercase tracking-widest text-xs font-semibold">
            Explore All Products
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-brand-emerald/5 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all"
            >
              {/* Image Aspect Ratio Box */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 bg-brand-emerald/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>

              {/* Content */}
              <div className="p-8 relative z-20">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold mb-2 block font-semibold">
                  {cat.price}
                </span>
                <h3 className="text-2xl font-serif mb-2 text-white">
                  {cat.title}
                </h3>
                <p className="text-white/40 text-sm mb-6 leading-relaxed">
                  {cat.description}
                </p>
                <button 
                  onClick={() => handleWhatsAppInquiry(cat.title)}
                  className="w-full py-3 bg-white/5 hover:bg-brand-gold hover:text-brand-obsidian border border-white/10 flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-medium text-sm group-hover:border-transparent"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Inquiry
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
