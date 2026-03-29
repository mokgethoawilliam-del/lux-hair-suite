import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import InstallationSuite from "@/components/InstallationSuite";
import AffiliateSection from "@/components/AffiliateSection";
import LeadMagnet from "@/components/LeadMagnet";

export default function Home() {
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
          <InstallationSuite />
          
          {/* Gallery Placeholder - Soon to be Dynamic */}
          <section id="gallery" className="py-24 bg-brand-obsidian overflow-hidden">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif mb-4 uppercase tracking-[0.2em]">The <span className="text-brand-gold italic">Gallery</span></h2>
                <div className="w-16 h-px bg-brand-gold/50 mx-auto" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden group border border-white/5">
                    <img 
                      src={`https://images.unsplash.com/photo-${1590 + i}?q=80&w=600&auto=format&fit=crop`} 
                      alt="Gallery style" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110 cursor-crosshair" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <AffiliateSection />
          <LeadMagnet />
        </div>
      </div>

      <footer className="py-12 bg-brand-obsidian border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-serif font-bold tracking-tighter">
            LUX<span className="text-brand-gold italic">HAIR</span>
          </div>
          
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
            © 2026 LUX HAIR SUITE • All Rights Reserved
          </div>
          
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <a href="#" className="hover:text-brand-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
