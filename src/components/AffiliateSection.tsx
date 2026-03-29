"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

const products = [
  {
    name: "Professional Flat Iron",
    brand: "GHD Gold",
    price: "R3,200",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800&auto=format&fit=crop",
    link: "https://www.takealot.com/ghd-gold-professional-styler/PLID52136004",
  },
  {
    name: "Organic Hair Oil",
    brand: "Moroccanoil",
    price: "R450",
    image: "https://images.unsplash.com/photo-1626015365107-16478987486e?q=80&w=800&auto=format&fit=crop",
    link: "https://www.takealot.com/moroccanoil-treatment-100ml/PLID32851411",
  },
  {
    name: "Silk Sleep Bonnet",
    brand: "Luxe Care",
    price: "R280",
    image: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=800&auto=format&fit=crop",
    link: "https://www.takealot.com/silk-satin-bonnet/PLID72136004",
  },
];

export default function AffiliateSection() {
  return (
    <section id="pro-care" className="py-24 bg-brand-obsidian">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="px-4 py-1 rounded-full border border-brand-gold/30 text-brand-gold text-[10px] uppercase tracking-widest mb-4 font-bold">
            Maintenance & Care
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            The <span className="italic">Pro-Care</span> Toolkit
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto leading-relaxed">
            Preserve your investment with professional-grade tools and products. These are the exact items we recommend for every installation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product, idx) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col items-center bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-brand-gold/10 transition-all"
            >
              <div className="relative w-40 h-40 mb-8 overflow-hidden rounded-2xl">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <h4 className="text-xl font-serif mb-1">{product.name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-bold">
                {product.brand} • {product.price}
              </p>

              <a 
                href={product.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 bg-brand-obsidian border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-widest text-xs"
              >
                Buy On Takealot <ExternalLink className="w-3 h-3" />
              </a>
              
              <span className="mt-4 text-[9px] text-white/20 uppercase tracking-tighter">
                Recommended by Lux Hair
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
