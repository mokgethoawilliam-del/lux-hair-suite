"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, ShoppingCart } from "lucide-react";
import { getSiteMetadata, supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category: string;
  is_in_stock: boolean;
}

export default function InstallationSuite() {
  const [services, setServices] = useState<Service[]>([]);
  const [whatsapp, setWhatsapp] = useState("27123456789");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch Services
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", "Service")
          .eq("is_in_stock", true);
        
        if (error) throw error;
        setServices((data as Service[]) || []);

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

  const handleWhatsAppInquiry = (name: string) => {
    window.open(`https://wa.me/${whatsapp}?text=Hi, I'm interested in the ${name}.`, "_blank");
  };

  const handleBuyNow = (id: string) => {
    // Navigate to checkout with product id
    window.location.href = `/checkout?product=${id}`;
  };

  return (
    <section id="installations" className="py-24 bg-brand-emerald/10 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <span className="text-[10px] uppercase tracking-widest text-brand-gold block mb-4 font-bold">The Service Menu</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 max-w-md leading-tight">
              Professional <span className="italic">Installations</span> For The Perfect Finish.
            </h2>
            <p className="text-white/50 mb-10 leading-relaxed max-w-md">
              Our salon specialists ensure every install is seamless, long-lasting, and tailored to your natural hairline. From full sew-ins to bespoke frontal applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading ? (
                <div className="col-span-full py-20 text-center">
                   <Loader2 className="w-8 h-8 animate-spin text-brand-gold mx-auto" />
                   <p className="mt-4 text-white/20 uppercase tracking-widest text-xs">Curating Collection...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[32px]">
                   <p className="text-white/20 uppercase tracking-widest text-xs">No products in vault yet.</p>
                </div>
              ) : (
                services.map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-brand-emerald/5 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all"
                  >
                    {/* Image Aspect Ratio Box */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 bg-brand-emerald/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                      <img 
                        src={cat.image_url || ""} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>

                    {/* Content */}
                    <div className="p-8 relative z-20">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold mb-2 block font-semibold">
                        R {cat.price}
                      </span>
                      <h3 className="text-2xl font-serif mb-2 text-white">
                        {cat.name}
                      </h3>
                      <p className="text-white/40 text-sm mb-6 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleWhatsAppInquiry(cat.name)}
                          className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-medium text-xs"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Inquiry
                        </button>
                        <button 
                          onClick={() => handleBuyNow(cat.id)}
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
            
            <button className="mt-10 px-10 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-full hover:scale-105 transition-transform">
              Book Your Appointment
            </button>
          </div>
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative aspect-square">
            <div className="absolute inset-4 border border-brand-gold/20 rounded-3xl z-10" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop" 
                alt="Expert Installation"
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className="absolute -bottom-8 -left-8 p-8 bg-brand-obsidian rounded-2xl shadow-2xl border border-white/5">
              <span className="text-3xl font-serif text-brand-gold font-bold block mb-1">98%</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
