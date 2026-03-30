"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase, getSiteMetadata } from "@/lib/supabase";

export default function CategoryGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [whatsapp, setWhatsapp] = useState("27123456789");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch Hair Products (not services)
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .neq("category", "Service")
          .eq("is_in_stock", true)
          .limit(6);
        
        if (error) throw error;
        setProducts(data || []);

        // 2. Fetch WhatsApp
        const metadata = await getSiteMetadata();
        if (metadata.whatsapp_number) setWhatsapp(metadata.whatsapp_number);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
                  <div className="absolute inset-0 bg-brand-emerald/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>

                {/* Content */}
                <div className="p-8 relative z-20">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold mb-2 block font-semibold">
                    R {product.price}
                  </span>
                  <h3 className="text-2xl font-serif mb-2 text-white">
                    {product.name}
                  </h3>
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
                      onClick={() => handleBuyNow(product.id)}
                      className="py-3 bg-brand-gold text-brand-obsidian flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-bold text-xs shadow-lg shadow-brand-gold/10"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
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
