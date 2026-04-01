"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import InstallationSuite from "@/components/InstallationSuite";
import AffiliateSection from "@/components/AffiliateSection";
import LeadMagnet from "@/components/LeadMagnet";
import { fetchGalleryImages } from "@/lib/supabase";

interface GalleryImage {
  id: string;
  image_url: string;
  name?: string;
}

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [brandName, setBrandName] = useState("KAGISO HAIR");
  const [aboutUs, setAboutUs] = useState("");
  const [businessFocus, setBusinessFocus] = useState("Hair & Beauty");

  useEffect(() => {
    async function load() {
      try {
        const { getSiteMetadata } = await import("@/lib/supabase");
        const meta = await getSiteMetadata();
        if (meta.brand_name) setBrandName(meta.brand_name);
        if (meta.about_us) setAboutUs(meta.about_us);
        if (meta.business_focus) setBusinessFocus(meta.business_focus);
        
        const data = await fetchGalleryImages();
        setGalleryImages(data as GalleryImage[]);
      } catch (error) {
        console.error("Error loading home data:", error);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-brand-obsidian text-white selection:bg-brand-gold selection:text-brand-obsidian">
      <Navbar />
      
      {/* Scrollable Content */}
      <div className="relative z-10 font-sans">
        <Hero />
        
        <div className="relative">
          {/* Subtle separator gradients */}
          <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-brand-emerald/10 to-transparent pointer-events-none" />
          
          <CategoryGrid />
          
          <div id="installations">
            <InstallationSuite />
          </div>
          
          <div id="pro-care">
            <AffiliateSection />
          </div>
          <section id="gallery" className="py-24 bg-brand-obsidian overflow-hidden">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif mb-4 uppercase tracking-[0.2em]">The <span className="text-brand-gold italic">Gallery</span></h2>
                <div className="w-16 h-px bg-brand-gold/50 mx-auto" />
              </div>
              
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden group border border-white/5">
                      <img 
                        src={img.image_url} 
                        alt={img.name || "Gallery Image"} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110 cursor-crosshair" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                   <p className="text-white/20 uppercase tracking-[0.3em] text-sm">Brand Portfolio Loading...</p>
                </div>
              )}
            </div>
          </section>

          <LeadMagnet />
        </div>
      </div>

      <footer id="about" className="py-24 bg-brand-obsidian border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-16">
            <h3 className="text-3xl font-serif text-white mb-6 uppercase tracking-[0.2em]">Our <span className="text-brand-gold italic">Story</span></h3>
            <p className="text-lg text-white/40 leading-relaxed font-light">
               {aboutUs || `Welcome to ${brandName}. We are dedicated to providing the highest quality products and experiences for our community.`}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
            <div className="text-2xl font-serif font-bold tracking-tighter uppercase whitespace-nowrap">
              {brandName.split(' ')[0]}<span className="text-brand-gold italic">{brandName.split(' ').slice(1).join(' ')}</span>
            </div>
            
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
              © {new Date().getFullYear()} {brandName.toUpperCase()} • KasiVault
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
