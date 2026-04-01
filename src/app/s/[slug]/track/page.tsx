"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Package, Calendar, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Loader2, Download,
  MessageSquare, Phone, Mail, ArrowLeft
} from "lucide-react";
import { supabase, getSiteBySlug } from "@/lib/supabase";
import { generateProfessionalReceipt } from "@/lib/pdf-service";

export default function TrackOrderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [site, setSite] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [siteLoading, setSiteLoading] = useState(true);

  useEffect(() => {
    async function loadSite() {
      const s = await getSiteBySlug(slug);
      setSite(s);
      setSiteLoading(false);
    }
    loadSite();
  }, [slug]);

  const handleSearch = async () => {
    if (!query || !site) return;
    setLoading(true);
    setResults(null);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          products (name, price)
        `)
        .eq("site_id", site.id)
        .or(`customer_phone.eq.${query},customer_email.eq.${query}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      alert("Radar search failed. Please verify your contact details.");
    } finally {
      setLoading(false);
    }
  };

  if (siteLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden origin-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Navigation */}
        <motion.a 
          href={`/s/${slug}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Storefront
        </motion.a>

        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
             <div className="flex items-center gap-3">
               <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Package className="w-6 h-6 text-indigo-400" />
               </div>
               <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight">Gig <span className="text-white/20 not-italic">Tracker</span></h1>
             </div>
             <p className="text-sm text-white/40 max-w-lg leading-relaxed">
               Locate your live bookings and download official receipts. Enter your WhatsApp number or Email address to sync with our Radar.
             </p>
          </motion.div>
        </div>

        {/* Search Engine */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 p-8 bg-white/[0.02] border border-white/[0.06] rounded-[32px] backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="WHATSAPP NUMBER OR EMAIL"
                  className="w-full pl-14 pr-6 py-5 bg-[#0f0f0f] border border-white/5 rounded-2xl focus:border-indigo-500/30 outline-none transition-all text-sm uppercase tracking-widest font-bold placeholder:text-white/10"
                />
             </div>
             <button
               onClick={handleSearch}
               disabled={loading}
               className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 shrink-0"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-4 h-4" />}
               Sync Radar
             </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {results.length === 0 ? (
                <div className="py-24 text-center space-y-4">
                   <AlertCircle className="w-12 h-12 text-white/10 mx-auto" />
                   <div>
                     <p className="text-sm font-bold uppercase tracking-widest text-white/40">No Gigs Found</p>
                     <p className="text-[10px] text-white/20 italic">If you just booked, please allow a micro-second for the Radar to sync.</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                   {results.map((gig) => (
                     <motion.div
                       key={gig.id}
                       layout
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="p-8 bg-white/[0.03] border border-white/[0.06] rounded-3xl hover:border-indigo-500/30 transition-all group overflow-hidden relative"
                     >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                           <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                 <h3 className="text-xl font-serif font-bold italic">{gig.products?.name || "Bespoke Service"}</h3>
                                 <span className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-[0.1em] font-bold ${
                                   gig.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-lg shadow-green-500/10' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                 }`}>
                                   {gig.status}
                                 </span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                 <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 text-indigo-400" />
                                    {new Date(gig.slot_start).toLocaleDateString("en-ZA", { day: 'numeric', month: 'short', year: 'numeric' })}
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-indigo-400" />
                                    {new Date(gig.slot_start).toLocaleTimeString("en-ZA", { hour: '2-digit', minute: '2-digit' })}
                                 </div>
                              </div>
                           </div>

                           <div className="flex gap-3 w-full md:w-auto">
                              <button 
                                onClick={() => generateProfessionalReceipt({
                                  id: gig.id,
                                  date: new Date(gig.created_at).toLocaleDateString(),
                                  customer_name: gig.customer_name,
                                  customer_phone: gig.customer_phone,
                                  service_name: gig.products?.name || "Bespoke Service",
                                  price: gig.products?.price || 0,
                                  payment_status: gig.status === 'Confirmed' ? 'Paid' : 'Pending',
                                  brand_name: site?.name || "Kagiso Hair Suite"
                                })}
                                className="flex-1 md:flex-none px-6 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest"
                              >
                                <Download className="w-4 h-4" />
                                Receipt
                              </button>
                              <a 
                                href={`https://wa.me/${site?.whatsapp_number || ""}`}
                                className="flex-1 md:flex-none px-6 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Support
                              </a>
                           </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/10 transition-all pointer-events-none" />
                     </motion.div>
                   ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <div className="mt-24 pt-12 border-t border-white/5 text-center">
           <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">Kasi BusinessHub industrial fulfillment</p>
        </div>
      </div>
    </div>
  );
}
