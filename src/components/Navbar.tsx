"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getSiteMetadata } from "@/lib/supabase";

export default function Navbar({ siteId, slug }: { siteId?: string, slug?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brandName, setBrandName] = useState("LUX HAIR");
  const [businessFocus, setBusinessFocus] = useState("Hair & Beauty");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    async function load() {
      const metadata = await getSiteMetadata(siteId);
      if (metadata?.brand_name) setBrandName(metadata.brand_name);
      if (metadata?.business_focus) setBusinessFocus(metadata.business_focus);
    }
    load();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [siteId]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-brand-obsidian/80 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-white">
          {brandName.split(' ')[0]}<span className="text-brand-gold italic">{brandName.split(' ').slice(1).join(' ')}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {[
            "Collections", 
            businessFocus === "Hair & Beauty" ? "Installations" : 
            businessFocus === "Tailoring & Styling" ? "Bespoke" : "Events", 
            "Pro-Care", "Gallery", "About"
          ].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-widest uppercase text-white/70 hover:text-brand-gold transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {slug && (
            <Link
              href={`/s/${slug}/track`}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-brand-gold hover:text-brand-gold text-white/80 rounded-full transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Track
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white/80 hover:text-brand-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>

          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-obsidian border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {[
                "Collections", 
                businessFocus === "Hair & Beauty" ? "Installations" : 
                businessFocus === "Tailoring & Styling" ? "Bespoke" : "Events", 
                "Pro-Care", "Gallery"
              ].map((item) => (
                <Link 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-serif tracking-widest text-white/80 hover:text-brand-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
