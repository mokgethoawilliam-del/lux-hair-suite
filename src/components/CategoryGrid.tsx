"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase, getSiteMetadata } from "@/lib/supabase";

interface HairProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string; // Primary
  image_urls?: string[]; // Gallery
  description?: string;
  category: string;
  is_in_stock: boolean;
  stock_count?: number;
  sizes?: string[];
  colors?: string[];
  is_new?: boolean;
  caption?: string;
}

const COLOR_MAP: Record<string, string> = {
  "Jet Black": "#000000",
  "Natural Black (1B)": "#2b2b2b",
  "Chocolate Brown": "#3d2b1f",
  "Honey Blonde": "#f5d76e",
  "Platinum Blonde": "#f5f5f5",
  "Copper Ginger": "#c0392b",
  "Auburn Red": "#922b21",
  "Burgundy Velvet": "#7f1d1d",
  "Silver Ash": "#94a3b8",
  "Deep Obsidian": "#111827",
  "Electric Volt": "#ceff00",
  "Royal Blue": "#005bb7",
  "Infrared Red": "#ff3a3a",
  "Hyper Purple": "#7d3cff",
  "University Blue": "#5b92e1",
  "Forest Green": "#1b4332",
  "Raw Emerald": "#064e3b",
  "Gold Dust": "#d97706",
  "White Silk": "#f8fafc",
  "Midnight Blue": "#1e3a8a",
  "Cement Grey": "#7d7d7d",
  "Peach Fuzz": "#ffbe7d",
  "Sky Blue": "#87ceeb",
  "Sand Dune": "#c2b280"
};

export default function CategoryGrid({ siteId }: { siteId?: string }) {
  const [products, setProducts] = useState<HairProduct[]>([]);
  const [whatsapp, setWhatsapp] = useState("27123456789");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch Products for this site
        let query = supabase
          .from("products")
          .select("*")
          .neq("category", "Service")
          .neq("category", "Gallery")
          .order("is_new", { ascending: false })
          .order("is_in_stock", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(12);
        
        if (siteId) query = query.eq("site_id", siteId);
        
        const { data, error } = await query;
        
        if (error) throw error;
        setProducts((data as HairProduct[]) || []);

        // 2. Fetch WhatsApp
        const metadata = await getSiteMetadata(siteId);
        if (metadata.whatsapp_number) setWhatsapp(metadata.whatsapp_number);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [siteId]);

  const handleWhatsAppInquiry = (productName: string) => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${productName}...`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  const handleBuyNow = (id: string) => {
    router.push(`/checkout?id=${id}`);
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
          {isLoading ? (
            <div className="col-span-full py-20 text-center">
               <Loader2 className="w-8 h-8 animate-spin text-brand-gold mx-auto" />
               <p className="mt-4 text-white/20 uppercase tracking-widest text-xs">Curating Collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[32px]">
               <p className="text-white/20 uppercase tracking-widest text-xs">No products in vault yet.</p>
            </div>
          ) : (
            products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-brand-emerald/5 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all"
              >
                {/* Image Aspect Ratio Box */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 z-40">
                    <button className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-brand-obsidian rounded-full backdrop-blur-md flex items-center justify-center transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-brand-emerald/10 group-hover:bg-transparent transition-all duration-500 z-10" />
                  
                  {product.is_new && (
                    <div className="absolute top-4 right-4 z-50 bg-amber-500 text-brand-obsidian text-[10px] font-black px-3 py-1.5 rounded-sm shadow-xl uppercase tracking-tighter">
                      NEW
                    </div>
                  )}

                  {!product.is_in_stock && (
                    <div className="absolute inset-0 z-30 bg-brand-obsidian/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-6 py-2 bg-white text-brand-obsidian text-[10px] font-bold uppercase tracking-widest rounded-full shadow-2xl">Sold Out</span>
                    </div>
                  )}

                  {product.original_price && product.original_price > product.price && (
                    <div className="absolute top-4 left-4 z-30 bg-white text-brand-obsidian text-[10px] font-black px-3 py-1.5 rounded-sm shadow-xl">
                      -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                    </div>
                  )}

                  {/* Primary Image */}
                  <img 
                    src={product.image_url || "/placeholder.jpg"} 
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${product.image_urls && product.image_urls.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`} 
                  />

                  {/* Secondary Image (Hover Swap) */}
                  {product.image_urls && product.image_urls.length > 1 && (
                    <img 
                      src={product.image_urls[1]} 
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" 
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-8 relative z-20">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                       {product.colors?.slice(0, 4).map(c => (
                         <div 
                           key={c} 
                           className="w-3 h-3 rounded-full border border-white/10 shadow-sm" 
                           style={{ backgroundColor: COLOR_MAP[c] || '#333' }}
                           title={c}
                         />
                       ))}
                       {(product.colors?.length || 0) > 4 && (
                         <span className="text-[8px] font-bold text-white/30">+{product.colors!.length - 4}</span>
                       )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/60">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif mb-2 text-white leading-tight">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl font-serif text-white">
                      R {product.price}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-white/20 line-through decoration-white/10">
                        R {product.original_price}
                      </span>
                    )}
                  </div>
                  
                  {/* Sizes Preview */}
                  {(product.sizes?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-1 mb-6">
                      {product.sizes?.slice(0, 4).map(s => (
                        <span key={s} className="text-[9px] font-bold px-2 py-1 bg-white/5 border border-white/5 text-white/40 uppercase rounded">
                          {s}
                        </span>
                      ))}
                      {(product.sizes?.length || 0) > 4 && <span className="text-[9px] text-white/20 ml-1">+{product.sizes!.length - 4}</span>}
                    </div>
                  )}

                  <p className="text-white/40 text-sm mb-6 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleWhatsAppInquiry(product.name)}
                      className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-medium text-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquiry
                    </button>
                    <button 
                      disabled={!product.is_in_stock}
                      onClick={() => handleBuyNow(product.id)}
                      className="py-3 bg-brand-gold text-brand-obsidian flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-bold text-xs shadow-lg shadow-brand-gold/10 disabled:opacity-20 disabled:grayscale"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.is_in_stock ? 'Buy Now' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
