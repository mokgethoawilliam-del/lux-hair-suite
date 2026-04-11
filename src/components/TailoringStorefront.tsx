"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Scissors, Ruler, Suitcase, MessageSquare, ChevronRight, Award, Zap, Users } from "lucide-react";
import { getSiteMetadata, fetchGalleryImages } from "@/lib/supabase";

interface TailoringStorefrontProps {
  siteId: string;
}

export default function TailoringStorefront({ siteId }: { siteId: string }) {
  const [metadata, setMetadata] = useState<any>({});
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [meta, images] = await Promise.all([
          getSiteMetadata(siteId),
          fetchGalleryImages(siteId)
        ]);
        setMetadata(meta);
        setGallery(images || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (siteId) load();
  }, [siteId]);

  const brandName = metadata.brand_name || "Kings Wear Clothing";
  const founder = "King Wiz";
  const gold = "#C9A646";

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-[#C9A646] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1594932224010-756707797ebd?q=80&w=2070&auto=format&fit=crop" 
            alt="Tailoring Hero"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#C9A646] uppercase tracking-[0.5em] text-[10px] font-bold mb-6">
              Bespoke Excellence by {founder}
            </p>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight lowercase">
               Tailored for <span className="italic block -mt-2 md:-mt-4">Kings.</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/50 font-light text-sm md:text-base mb-12 uppercase tracking-widest leading-loose">
              {metadata.hero_description || "Premium Bespoke Suits & Styling for the modern icon."}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <button className="group relative px-10 py-5 bg-[#C9A646] text-black font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:pr-14">
                  Book Your Fitting
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-4 h-4" />
               </button>
               <button className="px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all">
                  View Collection
               </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
           <div className="w-[1px] h-16 bg-gradient-to-b from-[#C9A646] to-transparent" />
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-32 bg-[#0a0a0a] border-b border-white/5">
         <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm group">
               <img 
                 src="https://images.unsplash.com/photo-1507679799987-c7377ec486b8?q=80&w=2071&auto=format&fit=crop" 
                 alt="King Wiz"
                 className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
               />
               <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[#C9A646] font-serif italic text-2xl">{founder}</p>
                  <p className="text-white/40 uppercase tracking-widest text-[9px] font-bold">House of Kings Founder</p>
               </div>
            </div>
            <div className="space-y-10">
               <div>
                  <h2 className="text-4xl md:text-5xl font-serif mb-6 lowercase">The <span className="italic">Craftsman.</span></h2>
                  <div className="w-12 h-[1px] bg-[#C9A646]" />
               </div>
               <p className="text-white/50 text-base leading-relaxed font-light">
                  {metadata.about_us || `${founder} is a visionary stylist dedicated to the art of absolute precision. We don't just make suits; we engineer confidence. Every stitch in a ${brandName} garment is a testament to our pursuit of perfection in luxury tailoring.`}
               </p>
               <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10">
                  <div className="space-y-2">
                     <p className="text-3xl font-serif text-[#C9A646]">150+</p>
                     <p className="text-white/30 uppercase tracking-widest text-[9px] font-bold">Bespoke Cuts</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-3xl font-serif text-[#C9A646]">100%</p>
                     <p className="text-white/30 uppercase tracking-widest text-[9px] font-bold">Handcrafted</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-32 bg-[#0f1115]">
         <div className="container mx-auto px-6">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-6xl font-serif mb-4 lowercase">The <span className="italic">Curated</span> Services</h2>
               <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Architecture of Style</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { title: "Bespoke Suits", icon: Scissors, desc: "Individually drafted patterns for a silhouette unique to you." },
                 { title: "Occasion Styling", icon: Award, desc: "From wedding suites to red carpet galas, redefined elegance." },
                 { title: "Image Transformation", icon: Users, desc: "A total overhaul of your professional and personal aesthetic." }
               ].map((s, i) => (
                 <div key={i} className="p-12 bg-white/[0.02] border border-white/5 hover:border-[#C9A646]/30 transition-all rounded-sm group">
                    <s.icon className="w-8 h-8 text-[#C9A646] mb-8 transition-transform group-hover:-translate-y-2" />
                    <h3 className="text-2xl font-serif mb-4 lowercase">{s.title}</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">{s.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. GALLERY SECTION */}
      <section className="py-32 bg-[#0a0a0a]">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
               <h2 className="text-4xl md:text-6xl font-serif lowercase">Visual <span className="italic">TransFormation</span></h2>
               <button className="text-[#C9A646] uppercase tracking-[0.3em] text-[10px] font-bold border-b border-[#C9A646]/30 pb-2">View Portfolio</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {gallery.length > 0 ? gallery.slice(0, 8).map((img, i) => (
                 <div key={i} className={`aspect-[3/4] overflow-hidden rounded-sm relative group ${i % 3 === 0 ? 'md:col-span-1' : ''}`}>
                    <img src={img.image_url} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-700 m-4" />
                 </div>
               )) : (
                 [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-white/[0.02] border border-white/5 rounded-sm" />)
               )}
            </div>
         </div>
      </section>

      {/* 5. EXPERIENCE / VALUE */}
      <section className="py-40 bg-[#0f1115] relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-16">
               <div className="space-y-4">
                  <p className="text-[#C9A646] uppercase tracking-[0.4em] text-[10px] font-bold">The Standard</p>
                  <h2 className="text-4xl md:text-7xl font-serif lowercase">Luxury isn't expensive, <span className="italic block text-white/20 mt-2">it's invaluable.</span></h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div>
                     <p className="text-white font-bold uppercase tracking-widest text-[9px] mb-4">Fabric</p>
                     <p className="text-white/40 text-sm italic font-serif">Italian Wool & Silk</p>
                  </div>
                  <div>
                     <p className="text-white font-bold uppercase tracking-widest text-[9px] mb-4">Precision</p>
                     <p className="text-white/40 text-sm italic font-serif">24 Individual Measurements</p>
                  </div>
                  <div>
                     <p className="text-white font-bold uppercase tracking-widest text-[9px] mb-4">Service</p>
                     <p className="text-white/40 text-sm italic font-serif">Private In-Home Fittings</p>
                  </div>
               </div>
            </div>
         </div>
         {/* Decorative Element */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-serif text-white/[0.01] pointer-events-none select-none uppercase">
            Kings
         </div>
      </section>

      {/* 6. BOOKING SECTION */}
      <section id="book" className="py-32 bg-[#0a0a0a] border-y border-white/5">
         <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto bg-white/[0.01] border border-white/5 p-12 md:p-24 rounded-sm text-center space-y-12">
               <h2 className="text-4xl md:text-7xl font-serif lowercase">Acquire your <span className="italic">Suit.</span></h2>
               <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed uppercase tracking-widest">
                  Fittings are by appointment only. Secure your slot in {founder}'s private schedule.
               </p>
               <div className="flex flex-col items-center gap-8">
                  <button className="px-16 py-6 bg-[#C9A646] text-black font-bold uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-2xl shadow-[#C9A646]/10">
                     Book Private Fitting
                  </button>
                  <div className="flex items-center gap-6 text-white/20">
                     <span className="w-8 h-[1px] bg-white/10" />
                     <p className="text-[10px] uppercase tracking-widest font-bold">Or WhatsApp</p>
                     <span className="w-8 h-[1px] bg-white/10" />
                  </div>
                  <button className="flex items-center gap-3 text-white/60 hover:text-[#C9A646] transition-colors uppercase tracking-[0.3em] text-[10px] font-bold">
                     <MessageSquare className="w-4 h-4" />
                     Instant Style Consultation
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 bg-[#0a0a0a]">
         <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-12">
            <div className="text-3xl font-serif lowercase tracking-tighter">
               Kings <span className="text-[#C9A646] italic">Wear</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-8 md:gap-12">
               {['Hero', 'About', 'Services', 'Gallery', 'Experience', 'Contact'].map(link => (
                 <a key={link} href="#" className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/30 hover:text-[#C9A646] transition-colors">{link}</a>
               ))}
            </nav>

            <div className="pt-12 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-[9px] uppercase tracking-widest text-white/10 font-bold">© {new Date().getFullYear()} {brandName.toUpperCase()} · Handcrafted in SA</p>
               <p className="text-[9px] uppercase tracking-widest text-white/10 font-bold italic">Bespoke Excellence for the Modern Icon</p>
            </div>
         </div>
      </footer>

    </div>
  );
}
