"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, User, 
  Phone, Mail, MessageSquare, AlertCircle, 
  CheckCircle2, Loader2, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { fetchBookings, updateBookingStatus, supabase } from "@/lib/supabase";
import { Download } from "lucide-react";

interface Booking {
  id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  slot_start: string;
  slot_end: string;
  status: string;
  notes?: string;
  products?: {
    name: string;
    price: number;
  };
}

export default function GigRadarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Active");
  const [newGigAlert, setNewGigAlert] = useState<Booking | null>(null);

  const downloadReceipt = async (booking: Booking) => {
    try {
      const { generateProfessionalReceipt } = await import("@/lib/pdf-service");
      generateProfessionalReceipt({
        id: booking.id,
        date: new Date(booking.slot_start).toLocaleDateString(),
        customer_name: booking.customer_name,
        customer_phone: booking.customer_phone,
        service_name: booking.products?.name || "Bespoke Service",
        price: booking.products?.price || 0,
        payment_status: booking.status === 'Confirmed' ? 'Paid' : 'Pending',
        brand_name: "Kagiso Hair Suite" // or your DB metadata
      });
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert(`Download Failed: ${err.message || 'Unknown error'}`);
    }
  };

  const downloadHistoryReport = async () => {
    try {
      const historyGigs = bookings.filter(b => b.status === "Completed");
      if (historyGigs.length === 0) return alert("No completed gigs found to export.");
      const { generateHistoryReport } = await import("@/lib/pdf-service");
      generateHistoryReport(historyGigs, "All Time", "Kagiso Hair Suite");
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert(`Report Generation Failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleComplete = async (id: string) => {
    // Optimistic UI Update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Completed" } : b));
    try {
      await updateBookingStatus(id, "Completed");
    } catch (err) {
      console.error("Fulfillment Error:", err);
      alert("Failed to update gig status.");
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBookings();
        setBookings(data as any);
      } catch (err) {
        console.error("Error loading gigs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Enable Realtime for instance "Gig" alerts
    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          console.log("Incoming Gig Detected:", payload);
          setNewGigAlert(payload.new as Booking);
          load(); // Refresh the grid
          
          // Play Industrial Alert sound if needed or handle notifications
          // Auto-clear alert after 5s
          setTimeout(() => setNewGigAlert(null), 8000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (filter === "Active") return b.status !== "Completed";
    if (filter === "History") return b.status === "Completed";
    return b.status === filter;
  });

  // Group by date
  const groupedGigs = filteredBookings.reduce((acc: Record<string, Booking[]>, gig) => {
    const date = new Date(gig.slot_start).toLocaleDateString("en-ZA", { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(gig);
    return acc;
  }, {});

  return (
    <div className="space-y-10 relative">
      {/* Real-time Alert Overlay */}
      <AnimatePresence>
        {newGigAlert && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -40, x: "-50%" }}
            className="fixed top-12 left-1/2 z-[100] w-full max-w-md px-6"
          >
             <div className="bg-indigo-600 border border-indigo-400 p-6 rounded-[24px] shadow-2xl shadow-indigo-600/40 flex items-center justify-between text-white overflow-hidden relative group">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl animate-pulse">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight">Incoming Gig detected!</h4>
                    <p className="text-[10px] text-indigo-100/60 uppercase tracking-widest font-bold">Radar Synchronised</p>
                  </div>
                </div>
                <div className="relative z-10">
                   <button 
                     onClick={() => setNewGigAlert(null)}
                     className="p-2 hover:bg-white/10 rounded-lg transition-all"
                   >
                     <CheckCircle2 className="w-4 h-4" />
                   </button>
                </div>
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 uppercase tracking-tight">Gig <span className="text-indigo-400 italic">Radar</span></h1>
          <p className="text-sm text-white/40 max-w-lg leading-relaxed">
            Manage your daily appointments and live sessions. Your radar updates automatically as new gigs are booked by customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {filter === "History" && (
            <button
               onClick={downloadHistoryReport}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
            >
               <Download className="w-3 h-3" />
               Report
            </button>
          )}
          <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-xl">
             {["Active", "Pending", "Confirmed", "History"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all ${filter === f ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg" : "text-white/20 hover:text-white/40"}`}
                >
                  {f}
                </button>
             ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[32px] bg-white/[0.01]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4 opacity-50" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Scanning Airwaves...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[32px] bg-white/[0.01]">
          <AlertCircle className="w-10 h-10 text-white/10 mb-4" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">No Active Gigs</p>
          <p className="text-[10px] text-white/20 italic">Share your link to start receiving bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {Object.entries(groupedGigs).map(([date, gigs]) => (
            <section key={date} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-sm uppercase tracking-[0.3em] text-indigo-400 font-bold whitespace-nowrap">{date}</h3>
                <div className="h-px w-full bg-white/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-[10px] text-white font-bold opacity-80 uppercase tracking-widest">
                            {new Date(booking.slot_start).toLocaleTimeString("en-ZA", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <span className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-[0.1em] font-bold ${
                         booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                       }`}>
                         {booking.status}
                       </span>
                    </div>

                    {/* Booking Identity */}
                    <div className="space-y-4 mb-8">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-white mb-1">{booking.customer_name}</h4>
                        <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                           {booking.products?.name || "Bespoke Service"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {booking.customer_phone && (
                          <div className="flex items-center gap-2 text-[11px] text-white/40">
                             <Phone className="w-3 h-3" /> {booking.customer_phone}
                          </div>
                        )}
                        {booking.customer_email && (
                          <div className="flex items-center gap-2 text-[11px] text-white/40">
                             <Mail className="w-3 h-3" /> {booking.customer_email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes & Actions */}
                    {booking.notes && (
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 mb-6">
                         <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-indigo-400 font-bold mb-1">
                            <MessageSquare className="w-2.5 h-2.5" /> Customer Notes
                         </div>
                         <p className="text-[10px] text-white/40 font-light leading-relaxed italic">{booking.notes}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <p className="text-xs font-serif font-bold text-white opacity-40 italic">
                         EST VAL: <span className="not-italic text-white">R {booking.products?.price || '---'}</span>
                       </p>
                       <div className="flex gap-2">
                         <button 
                           onClick={() => downloadReceipt(booking)}
                           className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white/40 hover:text-white"
                         >
                            <Download className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleComplete(booking.id)}
                           className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                         >
                            <CheckCircle2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>

                    {/* Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/10 transition-all pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
