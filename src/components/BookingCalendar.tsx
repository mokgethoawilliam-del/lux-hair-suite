"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Loader2, X, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import { createBooking, supabase, getSiteMetadata } from "@/lib/supabase";
import Cal, { getCalApi } from "@calcom/embed-react";
import dynamic from 'next/dynamic';

const PaystackButton = dynamic(() => import('react-paystack').then(mod => mod.PaystackButton), { ssr: false });

interface BookingCalendarProps {
  siteId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingCalendar({ siteId, serviceId, serviceName, servicePrice, serviceDuration, isOpen, onClose }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [calLink, setCalLink] = useState("");
  
  const [paystackKey, setPaystackKey] = useState("");
  
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [isOccupied, setIsOccupied] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Fetch Professional Scheduler link & Paystack Key
    getSiteMetadata(siteId).then(meta => {
      if (meta.cal_link) setCalLink(meta.cal_link);
      setPaystackKey(meta.paystack_public_key || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "");
    });

    // 2. Setup Cal.com UI theme
    (async () => {
      const cal = await getCalApi();
      cal("ui", { theme: "dark", styles: { branding: { brandColor: "#D4AF37" } }, hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, [isOpen, siteId]);

  useEffect(() => {
    if (!selectedDate) return;
    
    setCheckingAvailability(true);
    // 3. Fetch ALL bookings for this date to check ranges
    supabase.from("bookings").select("slot_start, slot_end")
      .eq("site_id", siteId)
      .gte("slot_start", `${selectedDate}T00:00:00`)
      .lte("slot_start", `${selectedDate}T23:59:59`)
      .then(({ data }) => {
        setExistingBookings(data || []);
        setCheckingAvailability(false);
      });
  }, [selectedDate, siteId]);

  useEffect(() => {
    if (!selectedDate || !selectedTime || existingBookings.length === 0) {
      setIsOccupied(false);
      return;
    }

    // 4. Industrial Range Collision Check
    const newStart = new Date(`${selectedDate}T${selectedTime}:00`);
    const newEnd = new Date(newStart.getTime() + serviceDuration * 60 * 60 * 1000);

    const collision = existingBookings.some(b => {
      const bStart = new Date(b.slot_start);
      const bEnd = new Date(b.slot_end);
      // Range Intersection: (StartA < EndB) && (EndA > StartB)
      return (newStart < bEnd) && (newEnd > bStart);
    });

    setIsOccupied(collision);
  }, [selectedTime, selectedDate, existingBookings, serviceDuration]);

  const handleBook = async (status: 'Pending' | 'Confirmed' = 'Pending') => {
    if (!selectedDate || !selectedTime) return alert("Please select a valid date and time.");
    if (!siteId || siteId === "") {
       console.error("Booking Logic Error: siteId is missing or empty string.");
       return alert("Technical Error: Store context missing. Please refresh and try again.");
    }
    if (!serviceId || serviceId === "") {
       console.error("Booking Logic Error: serviceId is missing or empty string.");
       return alert("Technical Error: Service metadata missing. Please refresh and try again.");
    }
    
    setLoading(true);
    try {
      // Ensure ISO format for Supabase (YYYY-MM-DDTHH:mm:ss.sssZ)
      const start = new Date(`${selectedDate}T${selectedTime}:00`);
      const end = new Date(start.getTime() + serviceDuration * 60 * 60 * 1000); // Dynamic Duration

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([{
          site_id: siteId,
          service_id: serviceId,
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          slot_start: start.toISOString(),
          slot_end: end.toISOString(),
          notes: customer.notes,
          status: status
        }])
        .select()
        .single();

      if (error) throw error;

      // Industrial: Trigger Automated Notification Hub
      await fetch("/api/notify", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking.id })
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Booking Error Detail:", err);
      alert(`Booking Failed: ${err.message || 'Server Error'}`);
    } finally {
      setLoading(false);
    }
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: customer.email || "bookings@kagiso.hair",
    amount: (servicePrice / 2) * 100, // 50% in kobo
    publicKey: paystackKey,
    text: "Pay 50% Deposit",
    onSuccess: () => handleBook('Confirmed'),
    onClose: () => alert("Transaction Cancelled - Deposit required to secure slot.")
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-obsidian/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-brand-obsidian border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Aspect: Service Brief */}
        <div className="w-full md:w-1/3 bg-brand-gold/5 p-8 border-b md:border-b-0 md:border-r border-white/5">
           <div className="flex flex-col h-full justify-between">
              <div>
                 <div className="w-10 h-10 bg-brand-gold/20 rounded-xl flex items-center justify-center mb-6">
                    <CalendarIcon className="w-5 h-5 text-brand-gold" />
                 </div>
                 <h3 className="text-xl font-serif text-white mb-2">{serviceName}</h3>
                 <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">Duration: {serviceDuration} Hours</p>
                 <div className="h-px w-8 bg-brand-gold/50 mb-6" />
                 <p className="text-2xl font-serif text-white font-bold italic">R {servicePrice}</p>
              </div>

              <div className="hidden md:block">
                 <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold leading-loose">
                    Session Isolation Guaranteed
                 </p>
              </div>
           </div>
        </div>

        {/* Right Aspect: Scheduler */}
        <div className="flex-1 p-8 md:p-12 relative min-h-[400px]">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-opacity">
              <X className="w-5 h-5" />
           </button>

           {(!siteId || siteId === "") && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                 <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-gold/20" />
                    <AlertCircle className="absolute inset-0 m-auto w-6 h-6 text-brand-gold animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-white text-lg font-serif italic">Initializing Secure Vault...</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest max-w-[200px] leading-relaxed">
                       We are securely connecting to the Lux Hair database. If this persists, please refresh the page.
                    </p>
                 </div>
                 <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition-all"
                 >
                    Manual Refresh
                 </button>
              </div>
           )}

           <AnimatePresence mode="wait">
             {success ? (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="h-full flex flex-col items-center justify-center text-center space-y-6"
               >
                 <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-serif text-white mb-2 italic">Session Secured</h2>
                    <p className="text-white/40 text-sm max-w-xs mx-auto">
                       Your gig is locked in. Our lead stylist will reach out soon to confirm the details.
                    </p>
                 </div>
                 <button onClick={onClose} className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all uppercase tracking-widest text-xs">
                    Return to Store
                 </button>
               </motion.div>
             ) : step === 1 ? (
               <motion.div 
                 key="step1"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-10"
               >
                 <div>
                    <h2 className="text-4xl font-serif text-white mb-2 uppercase tracking-tighter italic">Pick Your <span className="text-brand-gold">Slot</span></h2>
                    <p className="text-white/30 text-sm font-light uppercase tracking-widest">Live Availability Updates</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Select Date</label>
                       <input 
                         type="date"
                         value={selectedDate}
                         min={new Date().toISOString().split("T")[0]}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-brand-gold transition-all text-white font-bold"
                       />
                    </div>

                     <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Choose Any Time (Minute Perfect)</label>
                      <div className="relative group">
                        <input 
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className={`w-full h-16 px-8 bg-white/[0.03] border rounded-[24px] outline-none transition-all text-xl font-serif italic ${isOccupied ? "border-red-500/50 text-red-400 bg-red-500/5" : "border-white/10 text-white focus:border-brand-gold group-hover:border-white/20"}`}
                        />
                        <Clock className={`absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 ${isOccupied ? "text-red-500" : "text-white/10 group-hover:text-white/30"}`} />
                      </div>

                      {/* Live Availability Feedback */}
                      {selectedTime && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${isOccupied ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10"}`}>
                           <div className={`w-2 h-2 rounded-full animate-pulse ${isOccupied ? "bg-red-500" : "bg-emerald-500"}`} />
                           {isOccupied ? "Occupied: Window Overlaps" : "Slot Clear: Ready for Booking"}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!selectedDate || !selectedTime || isOccupied || checkingAvailability}
                    onClick={() => setStep(2)}
                    className="w-full h-16 bg-brand-gold text-brand-obsidian font-bold rounded-[24px] shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  >
                    {checkingAvailability ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm Selection <ChevronRight className="w-4 h-4" /></>}
                  </button>
               </motion.div>
             ) : step === 2 ? (
               <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
               >
                 <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest hover:text-white mb-6">
                    <ArrowLeft className="w-3 h-3" /> Change Slot
                 </button>

                 <div>
                    <h2 className="text-3xl font-serif text-white mb-2 uppercase tracking-tight italic">Client <span className="text-brand-gold uppercase not-italic font-sans font-bold">Registry</span></h2>
                    <p className="text-white/30 text-sm">Where should we send the confirmation?</p>
                 </div>

                 <div className="space-y-4">
                    <input 
                      placeholder="Your Full Name"
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-brand-gold transition-all text-white text-sm"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        placeholder="WhatsApp Number"
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-brand-gold transition-all text-white text-sm"
                      />
                      <input 
                        placeholder="Email (Optional)"
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-brand-gold transition-all text-white text-sm"
                      />
                    </div>
                    <textarea 
                      placeholder="Special requests or prep notes..."
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full h-24 p-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-brand-gold transition-all text-white text-sm resize-none"
                    />
                 </div>

                 <button
                   disabled={!customer.name || !customer.phone || loading}
                   onClick={() => setStep(3)}
                   className="w-full h-16 bg-brand-gold text-brand-obsidian font-bold rounded-[24px] shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                 >
                   Proceed to Deposit <ChevronRight className="w-4 h-4" />
                 </button>
               </motion.div>
             ) : (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 text-center"
               >
                  <div className="w-20 h-20 bg-brand-gold/10 border border-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <AlertCircle className="w-10 h-10 text-brand-gold animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-white mb-2 italic">Deposit Required</h2>
                    <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">
                       To secure your session for <strong>{serviceName}</strong>, a non-refundable 50% deposit of <strong>R {(servicePrice / 2).toFixed(2)}</strong> is required.
                    </p>
                  </div>

                  <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl mb-8">
                     <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">
                        <span>Service Total</span>
                        <span>R {servicePrice.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-sm font-bold text-white mb-4">
                        <span>50% Commitment</span>
                        <span className="text-brand-gold">R {(servicePrice / 2).toFixed(2)}</span>
                     </div>
                     <div className="h-px w-full bg-white/5 mb-4" />
                     <p className="text-[9px] text-white/20 italic">Remaining balance payable on the day of service.</p>
                  </div>

                  <div className="space-y-3">
                     {paystackKey ? (
                       <PaystackButton 
                          {...paystackConfig}
                          className="w-full h-16 bg-brand-gold text-brand-obsidian font-bold rounded-[24px] shadow-xl shadow-brand-gold/20 hover:scale-[1.05] transition-all uppercase tracking-widest text-xs"
                       />
                     ) : (
                       <button disabled className="w-full h-16 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-[24px] uppercase tracking-widest text-xs">
                          Payments Offline (Configure Vault)
                       </button>
                     )}
                     <button onClick={() => setStep(2)} className="text-[10px] text-white/20 uppercase tracking-widest hover:text-white transition-all">
                        Change Details
                     </button>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
