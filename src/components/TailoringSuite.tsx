"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, Ruler, UserCheck, Calendar as CalendarIcon, Loader2, MessageCircle } from "lucide-react";
import { supabase, getSiteMetadata } from "@/lib/supabase";
import BookingCalendar from "./BookingCalendar";

interface Service {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category: string;
  duration_hours?: number;
}

export default function TailoringSuite({ siteId }: { siteId?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function load() {
      if (!siteId) return;
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("site_id", siteId)
          .eq("category", "Service");

        const metadata = await getSiteMetadata(siteId);
        if (data) setServices(data as Service[]);
        if (metadata.whatsapp_number) setWhatsapp(metadata.whatsapp_number);
      } catch (err) {
        console.error("Error loading tailoring services:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [siteId]);

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setIsCalendarOpen(true);
  };

  if (loading) return null;

  return (
    <section id="tailoring" className="py-32 bg-brand-obsidian relative overflow-hidden">
      {/* Decorative Indigo Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Visual Showcase */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden group border border-white/5 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1594932224010-721667dcf49c?q=80&w=800&auto=format&fit=crop" 
                alt="Bespoke Tailoring"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-10 left-10 p-8 bg-brand-obsidian/40 backdrop-blur-md rounded-2xl border border-white/10">
                 <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Couture Standard</p>
                 <p className="text-2xl font-serif text-white italic">Precision <span className="text-white not-italic font-sans font-bold uppercase">Craft</span></p>
              </div>
            </div>
          </div>

          {/* Service Listing */}
          <div className="flex-1 space-y-12">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4"
              >
                Bespoke & Styling
              </motion.p>
              <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 uppercase tracking-tight">
                The <span className="text-indigo-400 italic">Signature</span> Edit
              </h2>
              <p className="text-white/40 text-lg leading-relaxed font-light max-w-xl">
                Elevate your presence with bespoke tailoring and professional styling. From custom-fit suits to wardrobe curation, our sessions are designed for the modern gentleman.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-8 group hover:border-indigo-500/20 transition-all"
                >
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                        {idx % 2 === 0 ? <Scissors className="w-6 h-6 text-indigo-400" /> : <Ruler className="w-6 h-6 text-indigo-400" />}
                     </div>
                     <div>
                        <h4 className="text-xl font-serif text-white mb-1">{service.name}</h4>
                        <p className="text-xs text-white/30 italic">Duration: 1.5 Hours • Consultation Included</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <span className="text-2xl font-serif text-white font-bold italic mr-4">R {service.price}</span>
                     <button 
                       onClick={() => handleBook(service)}
                       className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/10 transition-all uppercase tracking-widest text-xs"
                     >
                       <CalendarIcon className="w-4 h-4" />
                       Book Consultation
                     </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-wrap gap-10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Expert Fitter</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Real-time Updates</span>
               </div>
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
          serviceDuration={selectedService.duration_hours || 1.5}
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}
    </section>
  );
}
