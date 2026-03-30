"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, User, CreditCard, Loader2, RefreshCw } from "lucide-react";
import { fetchOrders } from "@/lib/supabase";

interface Order {
  id: string;
  amount: number;
  status: string;
  payment_reference: string;
  created_at: string;
  products?: { name: string };
  customers?: { full_name: string; whatsapp_number: string; email: string };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data as Order[]);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-brand-gold mx-auto" /></div>;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Order <span className="text-brand-gold italic">History</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">SALES & CUSTOMER LEADS</p>
        </div>
        
        <button 
          onClick={loadOrders}
          className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-bold"
        >
          <RefreshCw className="w-5 h-5 text-brand-gold" />
          Refresh Orders
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="p-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] text-center">
             <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-6" />
             <p className="text-white/20 uppercase tracking-[0.3em] text-sm">No transactions yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/5 border border-white/5 rounded-[32px] p-8 hover:border-brand-gold/20 transition-all grid grid-cols-1 md:grid-cols-4 gap-8 items-center"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-brand-emerald/20 rounded-2xl group-hover:bg-brand-gold/20 transition-all">
                  <ShoppingBag className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                   <h4 className="font-serif text-lg text-white">{order.products?.name}</h4>
                   <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">R {order.amount}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <User className="w-4 h-4 text-white/20" />
                </div>
                <div>
                   <h5 className="text-sm font-medium text-white/80">{order.customers?.full_name}</h5>
                   <p className="text-[10px] text-white/40 font-bold uppercase">{order.customers?.whatsapp_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <CreditCard className="w-4 h-4 text-white/20" />
                </div>
                <div>
                   <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${order.status === 'Paid' ? 'bg-brand-gold text-brand-obsidian' : 'bg-white/10 text-white/40'}`}>
                      {order.status}
                   </span>
                   <p className="text-[10px] text-white/20 mt-1 font-mono">{order.payment_reference}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-6">
                 <div className="text-right">
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Processed</p>
                    <p className="text-xs text-white/50">{new Date(order.created_at).toLocaleDateString()}</p>
                 </div>
                 <button className="px-6 py-3 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-obsidian rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest">
                    View Details
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
