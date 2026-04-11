"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { supabase, getSiteMetadata } from "@/lib/supabase";

interface ProCareProduct {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  affiliate_link?: string;
  category: string;
  is_in_stock: boolean;
}

export default function AffiliateSection({ siteId }: { siteId?: string }) {
  const [products, setProducts] = useState<ProCareProduct[]>([]);
  const [brandName, setBrandName] = useState("LUX HAIR");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!siteId) {
        setIsLoading(false);
        return;
      }
      
      try {
        let query = supabase
          .from("products")
          .select("*")
          .eq("category", "Pro-Care")
          .eq("site_id", siteId) // Mando Isolation
          .order("is_in_stock", { ascending: false })
          .order("created_at", { ascending: false });
        
        const { data } = await query;
        const metadata = await getSiteMetadata(siteId);
        
        if (data) setProducts(data as ProCareProduct[]);
        if (metadata.brand_name) setBrandName(metadata.brand_name);
        else {
           // Industrial Fallback: Fetch site name directly if metadata missing
           const { data: site } = await supabase.from('sites').select('name').eq('id', siteId).single();
           if (site?.name) setBrandName(site.name);
        }
      } catch (err) {
        console.error("Error loading Pro-Care:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [siteId]);

  return (
    <section id="pro-care" className="py-24 bg-brand-obsidian relative scroll-mt-20">
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

        {isLoading ? (
          <div className="py-20 text-center">
             <div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
             <p className="text-white/20 uppercase tracking-[0.3em] text-[10px] font-bold">Syncing Maintenance Suite...</p>
          </div>
        ) : products.length > 0 ? (
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
                  {!product.is_in_stock && (
                    <div className="absolute inset-0 z-30 bg-brand-obsidian/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-4 py-1 bg-white text-brand-obsidian text-[8px] font-bold uppercase tracking-widest rounded-full shadow-2xl text-center">Coming Soon</span>
                    </div>
                  )}
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
                  href={product.is_in_stock ? product.affiliate_link : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full py-4 bg-brand-obsidian border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-widest text-xs ${!product.is_in_stock ? 'opacity-20 pointer-events-none' : ''}`}
                >
                  {product.is_in_stock ? 'Buy On Takealot' : 'Unavailable'} <ExternalLink className="w-3 h-3" />
                </a>
                
                <span className="mt-4 text-[9px] text-white/20 uppercase tracking-tighter">
                  Recommended by {brandName}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
             <p className="text-white/20 uppercase tracking-[0.4em] text-sm font-bold mb-4 italic">Maintenance Products Coming Soon</p>
             <p className="text-[10px] text-white/10 uppercase tracking-widest">The admin is currently curating this specific toolset for your site identity.</p>
          </div>
        )}
      </div>
    </section>
  );
}
