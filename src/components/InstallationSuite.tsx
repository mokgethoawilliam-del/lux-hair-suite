"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, ShoppingCart, Calendar as CalendarIcon, Scissors, Sparkles, Wand2, Star, Camera, Palette } from "lucide-react";
import { getSiteMetadata, supabase } from "@/lib/supabase";
import BookingCalendar from "./BookingCalendar";

interface Service {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  description?: string;
  category: string;
  is_in_stock: boolean;
  stock_count?: number;
  duration_hours?: number;
}

export default function InstallationSuite({ siteId }: { siteId?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [whatsapp, setWhatsapp] = useState("27123456789");
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch Services
        let query = supabase
          .from("products")
          .select("*")
          .eq("category", "Service")
          .order("is_in_stock", { ascending: false })
          .order("created_at", { ascending: false });
        
        if (siteId) query = query.eq("site_id", siteId);
        
        const { data, error } = await query;
        
        if (error) throw error;
        setServices((data as Service[]) || []);

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

  const handleWhatsAppInquiry = (name: string) => {
    window.open(`https://wa.me/${whatsapp}?text=Hi, I'm interested in the ${name}.`, "_blank");
  };

  const handleBuyNow = (service: Service) => {
    setSelectedService(service);
    setIsCalendarOpen(true);
  };

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("frontal") || n.includes("install")) return <Scissors className="w-10 h-10" />;
    if (n.includes("style") || n.includes("curl")) return <Sparkles className="w-10 h-10" />;
    if (n.includes("color") || n.includes("dye")) return <Palette className="w-10 h-10" />;
    if (n.includes("wig") || n.includes("revamp")) return <Wand2 className="w-10 h-10" />;
    return <Star className="w-10 h-10" />;
  };

  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
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
                    {/* Icon Perspective Box (Replacing Image) */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-brand-obsidian/40 flex items-center justify-center group-hover:bg-brand-gold/5 transition-colors">
                      <div className="absolute inset-0 bg-brand-emerald/10 group-hover:bg-transparent transition-all duration-500 z-10" />
                      {!cat.is_in_stock && (
                        <div className="absolute inset-0 z-30 bg-brand-obsidian/60 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="px-6 py-2 bg-white text-brand-obsidian text-[10px] font-bold uppercase tracking-widest rounded-full shadow-2xl">Fully Booked</span>
                        </div>
                      )}
                      
                      <div className="relative z-20 text-brand-gold/20 group-hover:text-brand-gold transition-all duration-500 transform group-hover:scale-110">
                        {getServiceIcon(cat.name)}
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); scrollToGallery(); }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-white/5 hover:bg-white text-white/40 hover:text-brand-obsidian text-[8px] font-bold uppercase tracking-widest rounded-full border border-white/5 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                      >
                        <Camera className="w-3 h-3" />
                        Ref. Gallery
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 relative z-20">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl uppercase tracking-tighter text-white font-serif">
                          R {cat.price}
                        </span>
                        {cat.original_price && cat.original_price > cat.price && (
                          <span className="text-xs text-white/30 line-through decoration-red-500/50">
                            R {cat.original_price}
                          </span>
                        )}
                      </div>
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
                          disabled={!cat.is_in_stock}
                          onClick={() => handleBuyNow(cat)}
                          className="py-3 bg-brand-gold text-brand-obsidian flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-bold text-xs shadow-lg shadow-brand-gold/10 disabled:opacity-20 disabled:grayscale"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {cat.is_in_stock ? 'Book Now' : 'Sold Out'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => {
                if (services.length > 0) handleBuyNow(services[0]);
              }}
              className="mt-10 px-10 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              Book Appointment
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
                src="/luxury_hair_installation_suite_1774966989604.png" 
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

      {selectedService && (
        <BookingCalendar 
          siteId={siteId || ""}
          serviceId={selectedService.id}
          serviceName={selectedService.name}
          servicePrice={selectedService.price}
          serviceDuration={selectedService.duration_hours || 2}
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}
    </section>
  );
}
