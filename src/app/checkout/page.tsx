"use client";

import { Suspense, useState, useEffect } from "react";
import nextDynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, ShieldCheck, Loader2 } from "lucide-react";
import { getAppSettings, createOrder, supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Dynamically import Paystack to prevent SSR issues
const PaystackButton = nextDynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<CheckoutProduct | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "", whatsapp: "" });
  const [paystackKey, setPaystackKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!productId) {
        router.push("/");
        return;
      }

      // 1. Fetch Product
      const { data } = await supabase.from("products").select("*").eq("id", productId).single();
      setProduct(data as CheckoutProduct);

      // 2. Fetch Paystack Public Key
      const settings = await getAppSettings();
      setPaystackKey(settings.paystack_public_key || "");
      
      setIsLoading(false);
    }
    init();
  }, [productId, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-obsidian"><Loader2 className="animate-spin text-brand-gold" /></div>;

  const componentProps = {
    email: customer.email,
    amount: (product?.price || 0) * 100, // Paystack works in kobo/cents
    currency: "ZAR",
    metadata: {
      custom_fields: [
        { display_name: "Name", variable_name: "name", value: customer.name },
        { display_name: "WhatsApp", variable_name: "whatsapp", value: customer.whatsapp },
      ],
    },
    publicKey: paystackKey,
    text: "Pay Now",
    onSuccess: async (reference: { reference: string }) => {
      try {
        await createOrder({
          customer: { full_name: customer.name, email: customer.email, whatsapp_number: customer.whatsapp },
          product_id: productId!,
          amount: product?.price || 0,
          payment_reference: reference.reference,
          payment_method: 'Paystack',
        });
        alert("Payment Successful! Your order has been securely logged.");
        // Redirect directly to the tracking portal so the customer instantly learns where to track their package
        router.push("/s/lux-hair-suite/track");
      } catch (err) {
        console.error("Error saving order:", err);
      }
    },
    onClose: () => alert("Transaction cancelled."),
  };

  return (
    <div className="min-h-screen bg-brand-obsidian text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Customer Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <h1 className="text-4xl font-serif">Secure <span className="text-brand-gold italic">Checkout</span></h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={customer.name}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={customer.email}
                onChange={(e) => setCustomer({...customer, email: e.target.value})}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">WhatsApp Number</label>
              <input 
                type="tel" 
                required
                value={customer.whatsapp}
                onChange={(e) => setCustomer({...customer, whatsapp: e.target.value})}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                placeholder="27712345678"
              />
            </div>
          </div>

          <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 rounded-3xl space-y-4">
             <div className="flex items-center gap-4 text-brand-gold">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-xs uppercase font-bold tracking-widest">Mzansi Trusted Payments</span>
             </div>
             <div className="flex items-center justify-between text-white/40">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold"><CreditCard className="w-3 h-3" /> Cards</div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold"><Smartphone className="w-3 h-3" /> Ozow & Capitec</div>
             </div>
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/5 p-10 rounded-[40px] space-y-8">
          <h3 className="text-2xl font-serif">Order <span className="text-brand-gold italic">Summary</span></h3>
          
          <div className="flex gap-6 items-center">
             <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10">
                <img src={product?.image_url} alt={product?.name} className="w-full h-full object-cover" />
             </div>
             <div>
                <h4 className="text-xl font-serif">{product?.name}</h4>
                <p className="text-white/40 text-sm">{product?.category}</p>
             </div>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex justify-between items-center text-2xl font-serif">
             <span>Total</span>
             <span className="text-brand-gold text-3xl">R {product?.price}</span>
          </div>

          {!paystackKey ? (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500 text-sm">
              Note: Paystack is currently in test mode or unconfigured.
            </div>
          ) : (
            <PaystackButton 
              {...componentProps}
              className="w-full py-5 bg-brand-gold text-brand-obsidian font-extrabold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-gold/20 text-lg uppercase tracking-widest"
            />
          )}

          <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
             Secured by Paystack & SSL
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-obsidian"><Loader2 className="animate-spin text-brand-gold" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
