"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Clock, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  metadata?: {
    event_date?: string;
    location?: string;
    time?: string;
  };
}

export default function EventsSuite({ siteId }: { siteId?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (!siteId) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("site_id", siteId)
        .eq("category", "Events")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEvents(data as Event[]);
      }
      setLoading(false);
    }
    fetchEvents();
  }, [siteId]);

  if (loading) return null;
  if (events.length === 0) return null;

  return (
    <section id="events" className="py-32 bg-brand-obsidian relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-brand-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4"
          >
            Lifestyle & Experience
          </motion.p>
          <motion.h2 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-6xl font-serif text-white mb-6 uppercase tracking-tight"
          >
            The <span className="text-brand-gold italic">Archives</span> 
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg leading-relaxed font-light"
          >
            Exclusive lifestyle events, branded drops, and community gatherings. Secure your access to the next session.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group flex flex-col md:flex-row bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden hover:border-brand-gold/20 transition-all duration-700"
            >
              <div className="w-full md:w-[45%] h-[400px] overflow-hidden">
                <img 
                  src={event.image_url} 
                  alt={event.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
              
              <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                   <div className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                     Upcoming Session
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>

                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 group-hover:text-brand-gold transition-colors">{event.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2">{event.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                   <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-1">Date</p>
                        <p className="text-xs text-white/80 font-medium">{event.metadata?.event_date || "To Be Announced"}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-1">Location</p>
                        <p className="text-xs text-white/80 font-medium">{event.metadata?.location || "Secret Venue"}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                   <div>
                     <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-1">Entrance</p>
                     <p className="text-2xl font-bold text-white font-serif">R {event.price}</p>
                   </div>
                   <button className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand-gold/10">
                     <Ticket className="w-4 h-4" />
                     Secure Tickets
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Branded Footer CTA */}
        <div className="mt-24 text-center">
           <button className="group flex items-center gap-3 text-white/40 hover:text-white transition-all mx-auto">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">View Archive Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </div>
    </section>
  );
}
