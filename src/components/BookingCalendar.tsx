"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Loader2, X, ChevronRight, ArrowLeft } from "lucide-react";
import { createBooking, supabase } from "@/lib/supabase";

interface BookingCalendarProps {
  siteId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingCalendar({ siteId, serviceId, serviceName, servicePrice, isOpen, onClose }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });

  const slots = ["09:00", "11:00", "13:00", "15:00", "17:00"];

  const handleBook = async () => {
    setLoading(true);
    try {
      const start = new Date(`${selectedDate}T${selectedTime}`);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2hr slot

      await createBooking({
        site_id: siteId,
        service_id: serviceId,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        slot_start: start.toISOString(),
        slot_end: end.toISOString(),
        notes: customer.notes
      });

      setSuccess(true);
    } catch (err) {
      console.error("Booking Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
                 <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">Duration: 2 Hours</p>
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
                         min={new Date().toISOString().split("T")[0]}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-brand-gold transition-all text-white font-bold"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Pick Your Hour</label>
                       <div className="grid grid-cols-3 gap-2">
                          {slots.map(s => (
                             <button
                               key={s}
                               onClick={() => setSelectedTime(s)}
                               className={`h-11 rounded-xl text-xs font-bold transition-all border ${selectedTime === s ? "bg-brand-gold/10 border-brand-gold text-brand-gold shadow-lg" : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"}`}
                             >
                               {s}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <button
                   disabled={!selectedDate || !selectedTime}
                   onClick={() => setStep(2)}
                   className="w-full h-16 bg-brand-gold text-brand-obsidian font-bold rounded-[24px] shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                 >
                   Confirm Slot <ChevronRight className="w-4 h-4" />
                 </button>
               </motion.div>
             ) : (
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
                   onClick={handleBook}
                   className="w-full h-16 bg-brand-gold text-brand-obsidian font-bold rounded-[24px] shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                 >
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Secure My Gig"}
                 </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
