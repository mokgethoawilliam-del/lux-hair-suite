"use client";

import { useState, useEffect, use } from "react";
import { getSiteBySlug, getSiteMetadata, fetchGalleryImages } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import InstallationSuite from "@/components/InstallationSuite";
import AffiliateSection from "@/components/AffiliateSection";
import LeadMagnet from "@/components/LeadMagnet";
import SupportChat from "@/components/SupportChat";
import { Radar, Package, Search } from "lucide-react";
import Link from "next/link";

interface GalleryImage {
  id: string;
  image_url: string;
  name?: string;
}

export default function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [site, setSite] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [brandName, setBrandName] = useState("KasiVault");
  const [businessFocus, setBusinessFocus] = useState("Premium Weaves & Hair");
  const [aboutUs, setAboutUs] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const siteData = await getSiteBySlug(slug);
        if (!siteData) {
          setLoading(false);
          return;
        }
        setSite(siteData);

        const [meta, gallery] = await Promise.all([
          getSiteMetadata(siteData.id),
          fetchGalleryImages(siteData.id)
        ]);

        if (meta.brand_name) setBrandName(meta.brand_name);
        else if (siteData.name) setBrandName(siteData.name);
        
        if (meta.business_focus) setBusinessFocus(meta.business_focus);
        if (meta.about_us) setAboutUs(meta.about_us);
        
        setGalleryImages(gallery as GalleryImage[]);
      } catch (error) {
        console.error("Error loading dynamic site data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-brand-obsidian flex items-center justify-center">
      <p className="text-white/20 uppercase tracking-[0.3em] animate-pulse">Launching {slug.replace('-', ' ')}...</p>
    </div>
  );

  if (!site) return (
    <div className="min-h-screen bg-brand-obsidian flex items-center justify-center flex-col gap-6">
      <h1 className="text-4xl font-serif text-white opacity-50 italic">Vault Not Found</h1>
      <a href="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all text-sm uppercase tracking-widest">Return to KasiVault Home</a>
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-obsidian text-white selection:bg-brand-gold selection:text-brand-obsidian">
      <Navbar siteId={site.id} slug={slug} />
      
      <div className="relative z-10 font-sans">
        <Hero siteId={site.id} />
        
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-brand-emerald/10 to-transparent pointer-events-none" />
          
          <CategoryGrid siteId={site.id} />
          
          <InstallationSuite siteId={site.id} />

          {/* Gallery Section */}
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
                   <p className="text-white/20 uppercase tracking-[0.3em] text-sm">Portfolio Coming Soon...</p>
                </div>
              )}
            </div>
          </section>

          <AffiliateSection siteId={site.id} />

          {/* Fulfillment Radar Section */}
          <section id="track" className="py-24 relative overflow-hidden">
             <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-[40px] p-8 md:p-12 backdrop-blur-3xl overflow-hidden relative group">
                   <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="flex-1 space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                               <Radar className="w-6 h-6 text-brand-gold animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold italic">Fulfillment <span className="text-white/20 not-italic">Radar</span></h2>
                         </div>
                         <p className="text-white/40 text-sm leading-relaxed max-w-md">
                            Lost your receipt? Track your live installations, product orders, and bespoke bookings instantly across our network.
                         </p>
                         <Link 
                           href={`/s/${slug}/track`}
                           className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-gold/20 uppercase tracking-widest text-xs"
                         >
                            <Search className="w-4 h-4" />
                            Sync Your Radar
                         </Link>
                      </div>
                      <div className="w-full md:w-64 aspect-square bg-gradient-to-br from-brand-gold/10 to-transparent rounded-3xl border border-white/5 flex items-center justify-center relative">
                         <Package className="w-20 h-20 text-brand-gold/20" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 border border-brand-gold/10 rounded-full animate-ping opacity-20" />
                         </div>
                      </div>
                   </div>
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-gold/10 transition-all" />
                </div>
             </div>
          </section>

          <LeadMagnet siteId={site.id} />
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
              © {new Date().getFullYear()} {brandName.toUpperCase()} • {site.name}
            </div>
          </div>
        </div>
      </footer>

      <SupportChat siteId={site.id} />
    </main>
  );
}
