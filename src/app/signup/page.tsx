"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { signup } from "./actions";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-gold/20"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start Your Boutique <ArrowRight className="w-5 h-5" /></>}
    </button>
  );
}

function SignupContent() {
  const params = useSearchParams();
  const error = params?.get("error");

  return (
    <div className="min-h-screen bg-brand-obsidian flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-emerald/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 border border-white/5 p-12 rounded-[40px] shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-brand-gold/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-brand-gold" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Create <span className="text-brand-gold italic">Vault</span></h1>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Join the Elite Multi-Tenant Network</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form action={signup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="email" 
                name="email"
                required
                className="w-full pl-14 pr-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white"
                placeholder="your@brand.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="password" 
                name="password"
                required
                minLength={8}
                className="w-full pl-14 pr-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-white"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          <SubmitButton />
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">
            Already have a Vault? 
            <Link href="/login" className="text-brand-gold ml-2 hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-obsidian flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
