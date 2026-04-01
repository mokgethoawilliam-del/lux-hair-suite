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
  shipping_street?: string;
  shipping_city?: string;
  shipping_province?: string;
  shipping_postal_code?: string;
  delivery_status?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [orderData, settings] = await Promise.all([
        fetchOrders(),
        import("@/lib/supabase").then(m => m.getAppSettings())
      ]);
      setOrders(orderData as Order[]);
      setAppSettings(settings);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadSlip = async (order: Order) => {
    const { generatePackingSlip } = await import("@/lib/pdf");
    
    generatePackingSlip({
      orderId: order.id,
      customerName: order.customers?.full_name || "N/A",
      customerEmail: order.customers?.email || "N/A",
      customerPhone: order.customers?.whatsapp_number || "N/A",
      shippingAddress: `${order.shipping_street || 'No Address Provided'}, ${order.shipping_city || ''}, ${order.shipping_province || ''}, ${order.shipping_postal_code || ''}`,
      productName: order.products?.name || "Product",
      amount: order.amount,
      date: new Date(order.created_at).toLocaleDateString(),
      storeName: appSettings?.store_name || "Store",
      adminName: appSettings?.admin_name || "Admin",
      saasName: "Kasi BusinessHub"
    });
  };

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-amber-500 mx-auto" /></div>;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Sales <span className="text-indigo-400 italic">Radar</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase text-indigo-400/40">SALES & DELIVERY TRACKING · KASI BUSINESSHUB</p>
        </div>
        
        <button 
          onClick={loadData}
          className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-bold"
        >
          <RefreshCw className="w-5 h-5 text-amber-500" />
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
              className="group bg-white/5 border border-white/5 rounded-[32px] p-8 hover:border-amber-500/20 transition-all grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-all">
                  <ShoppingBag className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                   <h4 className="font-serif text-lg text-white">{order.products?.name}</h4>
                   <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">R {order.amount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <User className="w-4 h-4 text-white/20" />
                  </div>
                  <div>
                     <h5 className="text-sm font-medium text-white/80">{order.customers?.full_name}</h5>
                     <p className="text-[10px] text-white/40 font-bold uppercase">{order.customers?.whatsapp_number}</p>
                  </div>
                </div>
                {order.shipping_street && (
                  <div className="pl-[52px]">
                    <p className="text-[10px] text-white/30 leading-relaxed max-w-[200px]">
                      {order.shipping_street}, {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <CreditCard className="w-4 h-4 text-white/20" />
                  </div>
                  <div>
                     <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${order.status === 'Paid' ? 'bg-amber-500 text-brand-obsidian' : 'bg-white/10 text-white/40'}`}>
                        {order.status}
                     </span>
                     <p className="text-[10px] text-white/20 mt-1 font-mono">{order.payment_reference}</p>
                  </div>
                </div>
                <div className="pl-[52px]">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-amber-500/60">
                    Delivery: <span className="text-white/40">{order.delivery_status || 'Pending'}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-6 h-full justify-between">
                 <div className="text-right">
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Processed</p>
                    <p className="text-xs text-white/50">{new Date(order.created_at).toLocaleDateString()}</p>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleDownloadSlip(order)}
                     className="px-6 py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-brand-obsidian rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                   >
                      Packing Slip
                   </button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
