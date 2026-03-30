"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, ArrowUpRight, ShoppingBag, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

interface Client {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const { data: customers } = await supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });
        setClients((customers as Client[]) || []);

        const { count } = await supabase
          .from("orders")
          .select("id", { count: "exact", head: true });
        setOrderCount(count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-2">Platform Data</p>
        <h1 className="text-5xl font-serif text-white">
          Client <span className="text-purple-400 italic">Registry</span>
        </h1>
        <p className="text-white/30 text-sm mt-2">All customers across your platform.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Total Customers", value: clients.length, icon: Users },
          { label: "Orders Placed", value: orderCount, icon: ShoppingBag },
          { label: "Conversion Est.", value: clients.length > 0 ? `${Math.round((orderCount / clients.length) * 100)}%` : "—", icon: TrendingUp },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px]"
          >
            <div className="p-3 bg-purple-500/10 rounded-xl mb-4 inline-block">
              <s.icon className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">{s.label}</p>
            <p className="text-3xl font-serif text-white">
              {loading ? <span className="text-white/20 animate-pulse">—</span> : s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Client Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-serif text-white">Customer <span className="text-purple-400 italic">List</span></h3>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{clients.length} Total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : clients.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/20 uppercase tracking-widest text-xs">No customers yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {clients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-10 py-6 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-sm">
                    {client.full_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-white">{client.full_name || "Unknown"}</p>
                    <p className="text-xs text-white/30 mt-0.5">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">WhatsApp</p>
                    <p className="text-sm text-white/60 font-mono">{client.whatsapp_number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Joined</p>
                    <p className="text-sm text-white/60">
                      {new Date(client.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-purple-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
