"use client";

import { motion } from "framer-motion";
import { Scissors, Sparkle, Calendar } from "lucide-react";

const services = [
  {
    name: "Full Sew-in",
    price: "R1,500",
    duration: "3-4 Hours",
    icon: <Scissors className="w-5 h-5 text-brand-gold" />,
  },
  {
    name: "Frontal Install",
    price: "R1,200",
    duration: "2-3 Hours",
    icon: <Sparkle className="w-5 h-5 text-brand-gold" />,
  },
  {
    name: "Wig Refresh",
    price: "R650",
    duration: "1.5 Hours",
    icon: <Calendar className="w-5 h-5 text-brand-gold" />,
  },
];

export default function InstallationSuite() {
  return (
    <section id="installations" className="py-24 bg-brand-emerald/10 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <span className="text-[10px] uppercase tracking-widest text-brand-gold block mb-4 font-bold">The Service Menu</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 max-w-md leading-tight">
              Professional <span className="italic">Installations</span> For The Perfect Finish.
            </h2>
            <p className="text-white/50 mb-10 leading-relaxed max-w-md">
              Our salon specialists ensure every install is seamless, long-lasting, and tailored to your natural hairline. From full sew-ins to bespoke frontal applications.
            </p>
            
            <div className="space-y-6 max-w-md">
              {services.map((service, idx) => (
                <motion.div 
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-gold/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-emerald/20 rounded-xl group-hover:bg-brand-gold/20 transition-all">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg">{service.name}</h4>
                      <span className="text-xs text-white/30 truncate">{service.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-gold">{service.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="mt-10 px-10 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-full hover:scale-105 transition-transform">
              Book Your Appointment
            </button>
          </div>
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative aspect-square">
            <div className="absolute inset-4 border border-brand-gold/20 rounded-3xl z-10" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop" 
                alt="Expert Installation"
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className="absolute -bottom-8 -left-8 p-8 bg-brand-obsidian rounded-2xl shadow-2xl border border-white/5">
              <span className="text-3xl font-serif text-brand-gold font-bold block mb-1">98%</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
