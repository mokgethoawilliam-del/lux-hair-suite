"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, Loader2 } from "lucide-react";
import { supabase, getSiteMetadata } from "@/lib/supabase";

export default function AffiliateSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [brandName, setBrandName] = useState("LUX HAIR");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from("products").select("*").eq("category", "Pro-Care").eq("is_in_stock", true);
        const metadata = await getSiteMetadata();
        if (data) setProducts(data);
        if (metadata.brand_name) setBrandName(metadata.brand_name);
      } catch (err) {
        console.error("Error loading Pro-Care:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading && products.length === 0) return null;
  if (!isLoading && products.length === 0) return null; // Hide if empty
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
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col items-center bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-brand-gold/10 transition-all"
            >
              <div className="relative w-40 h-40 mb-8 overflow-hidden rounded-2xl">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <h4 className="text-xl font-serif mb-1 uppercase tracking-tight">{product.name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-bold">
                {product.description || 'Professional Grade'} • R{product.price}
              </p>

              <a 
                href={product.affiliate_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-brand-obsidian border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-widest text-xs"
              >
                Buy On Takealot <ExternalLink className="w-3 h-3" />
              </a>
              
              <span className="mt-4 text-[9px] text-white/20 uppercase tracking-tighter">
                Recommended by {brandName}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
