"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase, provisionNewSite } from "@/lib/supabase";

const SYSTEM_BLOCKLIST = ["admin", "login", "signup", "auth", "help", "api", "support", "dashboard", "settings", "profile", "default", "system"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [slugStatus, setSlugStatus] = useState<"idle" | "validating" | "available" | "taken" | "blocked">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUserId(data.user.id);
    });
  }, [router]);

  // Real-time Slug Validation
  useEffect(() => {
    if (!formData.slug) {
        setSlugStatus("idle");
        return;
    }

    const check = async () => {
      setSlugStatus("validating");
      
      // 1. Blocklist Check
      if (SYSTEM_BLOCKLIST.includes(formData.slug.toLowerCase())) {
        setSlugStatus("blocked");
        return;
      }

      // 2. Uniqueness Check
      const { data } = await supabase.from("sites").select("id").eq("subdomain_slug", formData.slug).single();
      if (data) setSlugStatus("taken");
      else setSlugStatus("available");
    };

    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleProvision = async () => {
    if (!userId || slugStatus !== "available" || !formData.name) return;
    setLoading(true);
    try {
      await provisionNewSite({
        name: formData.name,
        slug: formData.slug.toLowerCase(),
        ownerId: userId
      });
      setStep(3);
      setTimeout(() => router.push("/admin"), 3000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong during provisioning. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-obsidian flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-emerald/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-lg bg-white/5 border border-white/5 p-12 rounded-[48px] shadow-2xl backdrop-blur-3xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-brand-gold/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-brand-gold" />
                </div>
                <h1 className="text-4xl font-serif text-white">Let's build your <span className="text-brand-gold italic">Boutique</span></h1>
                <p className="text-white/40 text-sm">Every great brand starts with a name. What should we call yours?</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Boutique Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-8 py-5 bg-brand-obsidian border border-white/10 rounded-3xl focus:border-brand-gold/50 outline-none transition-all text-white text-xl font-serif"
                  placeholder="e.g. Lerato Luxury Weaves"
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name}
                className="w-full py-5 bg-white text-black font-bold rounded-3xl hover:bg-brand-gold hover:text-brand-obsidian transition-all flex items-center justify-center gap-3 disabled:opacity-20"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-brand-gold/10 rounded-2xl">
                  <Globe className="w-6 h-6 text-brand-gold" />
                </div>
                <h1 className="text-4xl font-serif text-white italic">Claim Your <span className="text-white not-italic">Domain</span></h1>
                <p className="text-white/40 text-sm">This will be your storefront's unique high-speed address on the web.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Unique Store URL (Slug)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className={`w-full px-8 py-5 bg-brand-obsidian border rounded-3xl outline-none transition-all text-white text-xl font-mono ${
                        slugStatus === "available" ? "border-green-500/50" : slugStatus === "taken" || slugStatus === "blocked" ? "border-red-500/50" : "border-white/10"
                      }`}
                      placeholder="lerato-weaves"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        {slugStatus === "validating" && <Loader2 className="w-5 h-5 animate-spin text-white/20" />}
                        {slugStatus === "available" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        {slugStatus === "taken" && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {slugStatus === "blocked" && <AlertCircle className="w-5 h-5 text-amber-500" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-white/20 font-bold ml-1">
                    Your URL: <span className="text-brand-gold">{formData.slug || '...'}</span>.vercel.app
                  </p>
                </div>

                <AnimatePresence>
                    {slugStatus === "blocked" && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                            ✦ This address is reserved for system use. Please choose another.
                        </motion.p>
                    )}
                    {slugStatus === "taken" && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-bold uppercase tracking-widest">
                            ✦ This address is already claimed by another boutique.
                        </motion.p>
                    )}
                </AnimatePresence>
              </div>

              <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-5 border border-white/10 text-white font-bold rounded-3xl hover:bg-white/5 transition-all">Back</button>
                  <button 
                    onClick={handleProvision}
                    disabled={loading || slugStatus !== "available"}
                    className="flex-1 py-5 bg-brand-gold text-brand-obsidian font-bold rounded-3xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Link Landing Page <ArrowRight className="w-5 h-5" /></>}
                  </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-10"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-serif text-white">You're <span className="text-brand-gold italic">Live!</span></h1>
                <p className="text-white/40 text-sm max-w-xs mx-auto">We've linked your domain and initialized your dashboard. Welcome to the elite.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 font-mono text-sm text-brand-gold">
                {formData.slug}.vercel.app
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest animate-pulse">Redirecting to Vault Control...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
