"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Scissors, Calendar, Package, BarChart2, Users, Sparkles,
  ArrowRight, Check, ChevronDown, Zap, Globe, ShieldCheck, Star
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Instant Branded Storefront",
    desc: "Go live in minutes. Your own professional online presence — no coding, no designers needed.",
  },
  {
    icon: Calendar,
    title: "Smart Appointment Booking",
    desc: "Let clients book slots 24/7. No more back-and-forth DMs. Built for salons and barbers alike.",
  },
  {
    icon: Package,
    title: "Inventory & Product Sales",
    desc: "Sell weaves, care products, and grooming kits directly from your storefront. Real-time stock tracking included.",
  },
  {
    icon: BarChart2,
    title: "Revenue Dashboard",
    desc: "See your earnings, top services, and client growth — all from one sleek command centre.",
  },
  {
    icon: Users,
    title: "Client CRM & Leads",
    desc: "Capture every lead, track loyal clients, and send WhatsApp follow-ups — all from one place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments via Paystack",
    desc: "Accept card payments, EFT, and more. Your money lands in your account within 24 hours.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R 299",
    period: "/mo",
    desc: "Perfect for independent stylists & barbers launching their first boutique.",
    features: ["1 Branded Storefront", "Online Bookings", "Up to 50 Products", "Basic Analytics", "Email Support"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R 599",
    period: "/mo",
    desc: "For established salons ready to scale with powerful tools.",
    features: ["1 Branded Storefront", "Online Bookings & Calendar", "Unlimited Products", "Advanced Analytics", "CRM & Lead Capture", "WhatsApp Notifications", "Priority Support"],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Elite",
    price: "R 999",
    period: "/mo",
    desc: "Multi-chair salons and barbershops with a full team and high volume.",
    features: ["Everything in Pro", "Multiple Staff Profiles", "Fulfillment Radar", "AI Design Assistant", "Custom Domain", "Dedicated Account Manager"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const testimonials = [
  { name: "Lerato M.", role: "Hair Salon Owner, Soweto", quote: "Before KasiBusiness Style I was running my bookings on WhatsApp. Now I have a proper website and my clients book themselves. Revenue is up 40% in 2 months." },
  { name: "Thabiso K.", role: "Barber, Tembisa", quote: "Walk-ins were unpredictable. Appointment bookings changed everything. I'm fully booked every Friday now." },
  { name: "Zanele N.", role: "Weave Specialist, Johannesburg", quote: "I sell weaves from my page and get paid before clients even arrive. The inventory tracker is a game changer." },
];

const faqs = [
  { q: "Do I need to know how to code?", a: "Not at all. You sign up, set your boutique name, and your professional storefront is live instantly. No technical skills required." },
  { q: "Can I use this if I'm a barber?", a: "Absolutely. KasiBusiness Style is built for both hair salons and barbershops. Appointment scheduling, client profiles, and product sales all work perfectly for barbers." },
  { q: "How do I get paid?", a: "Payments are processed securely via Paystack. Funds are transferred directly to your South African bank account within 24 hours." },
  { q: "Can I use my own domain name?", a: "Yes — on the Elite plan you can connect your own domain (e.g. leratohair.co.za). All plans include a free branded subdomain at no extra cost." },
  { q: "Is there a free trial?", a: "Yes. The Starter plan comes with a 14-day free trial — no credit card required." },
];

export default function MarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-[#C8A951] selection:text-black">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8A951]/20 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#C8A951]" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">KasiBusiness</span>
              <span className="text-[#C8A951] font-bold text-sm tracking-tight"> Style</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-white/40 font-bold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="flex items-center gap-2 px-5 py-3 bg-[#C8A951] text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#d4b86a] transition-all">
              Start Free <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#C8A951]/5 rounded-full blur-[200px]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-full mb-10">
              <Sparkles className="w-3 h-3 text-[#C8A951]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A951] font-bold">Part of KasiBusiness Hub</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1] tracking-tight">
              The Elite Platform for<br />
              <span className="text-[#C8A951] italic">Salons & Barbers</span>
            </h1>
            <p className="text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
              Launch your branded storefront, take appointments, sell products, and grow your clientele — all without touching a single line of code.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="flex items-center gap-3 px-10 py-5 bg-[#C8A951] text-black font-bold rounded-2xl hover:bg-[#d4b86a] hover:scale-[1.02] transition-all shadow-2xl shadow-[#C8A951]/20 uppercase tracking-widest text-sm"
              >
                <Zap className="w-4 h-4" /> Launch Your Boutique Free
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-3 px-10 py-5 border border-white/10 text-white/60 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-sm"
              >
                Sign In to Vault
              </Link>
            </div>

            <p className="mt-6 text-[11px] uppercase tracking-widest text-white/20 font-bold">
              No credit card required · 14-day free trial · Live in under 5 minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C8A951] font-bold mb-4">Everything You Need</p>
            <h2 className="text-4xl md:text-5xl font-serif">Built for the Kasi Business Owner</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] hover:border-[#C8A951]/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C8A951]/10 border border-[#C8A951]/20 flex items-center justify-center mb-6 group-hover:bg-[#C8A951]/20 transition-all">
                  <f.icon className="w-5 h-5 text-[#C8A951]" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 relative bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C8A951] font-bold mb-4">Real Stories</p>
            <h2 className="text-4xl md:text-5xl font-serif">From the Community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 text-[#C8A951] fill-[#C8A951]" />)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C8A951] font-bold mb-4">Simple Pricing</p>
            <h2 className="text-4xl md:text-5xl font-serif">Invest in Your Business</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {plans.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[32px] flex flex-col gap-8 ${p.highlight
                  ? "bg-[#C8A951] text-black scale-105 shadow-2xl shadow-[#C8A951]/30"
                  : "bg-white/[0.02] border border-white/5 text-white"
                }`}
              >
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 ${p.highlight ? "text-black/50" : "text-white/30"}`}>{p.name}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-bold">{p.price}</span>
                    <span className={`text-sm font-bold mb-1 ${p.highlight ? "text-black/50" : "text-white/30"}`}>{p.period}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${p.highlight ? "text-black/60" : "text-white/40"}`}>{p.desc}</p>
                </div>
                <ul className="space-y-3">
                  {p.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm font-medium ${p.highlight ? "text-black/80" : "text-white/60"}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${p.highlight ? "text-black" : "text-[#C8A951]"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] text-center transition-all ${p.highlight
                    ? "bg-black text-[#C8A951] hover:bg-black/80"
                    : "bg-[#C8A951]/10 border border-[#C8A951]/30 text-[#C8A951] hover:bg-[#C8A951]/20"
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C8A951] font-bold mb-4">Common Questions</p>
            <h2 className="text-4xl md:text-5xl font-serif">Got Questions?</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] hover:border-[#C8A951]/20 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-bold text-white text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180 text-[#C8A951]" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-white/50 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#C8A951]/5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,81,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,81,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-full mb-10">
            <Sparkles className="w-3 h-3 text-[#C8A951]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A951] font-bold">Join Today</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-8">
            Your clients are <span className="text-[#C8A951] italic">waiting.</span>
          </h2>
          <p className="text-white/40 text-lg mb-12 leading-relaxed">
            Hundreds of Kasi stylists and barbers are already running their businesses smarter. Your vault is ready — claim it now.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-12 py-6 bg-[#C8A951] text-black font-bold rounded-2xl hover:bg-[#d4b86a] hover:scale-[1.02] transition-all shadow-2xl shadow-[#C8A951]/20 uppercase tracking-widest"
          >
            <Zap className="w-5 h-5" /> Launch Your Boutique Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C8A951]/20 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#C8A951]" />
            </div>
            <span className="font-bold text-sm"><span className="text-white">KasiBusiness</span><span className="text-[#C8A951]"> Style</span></span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
            © {new Date().getFullYear()} KasiBusiness Hub · All Rights Reserved
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/30 font-bold">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
