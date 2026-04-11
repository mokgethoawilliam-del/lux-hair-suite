"use client";

import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-brand-obsidian flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm text-center space-y-8"
      >
        <div className="inline-block p-6 bg-brand-gold/10 rounded-full mb-4">
          <Mail className="w-12 h-12 text-brand-gold animate-bounce" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-white italic">Verify Your <span className="text-brand-gold">Access</span></h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
            We've sent a secure confirmation link to your inbox. Please verify your email to begin your boutique's journey.
          </p>
        </div>

        <div className="pt-8">
            <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-white transition-colors"
            >
                <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
        </div>
        
        <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-bold">
            Security Powered by KasiVault
        </p>
      </motion.div>
    </div>
  );
}
