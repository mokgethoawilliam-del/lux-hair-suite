"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, Info } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminLogistics() {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<any[]>([]);
  const [newZone, setNewZone] = useState({ name: "", fee: 0 });
  const [zoneLoading, setZoneLoading] = useState(false);
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", fee: 0 });

  useEffect(() => {
    import("@/lib/supabase").then(({ fetchDeliveryZones }) => {
      fetchDeliveryZones().then((z) => setZones(z || [])).catch(console.error).finally(() => setLoading(false));
    });
  }, []);

  const handleAddZone = async () => {
    if (!newZone.name) return;
    setZoneLoading(true);
    try {
      const { createDeliveryZone } = await import("@/lib/supabase");
      const added = await createDeliveryZone(newZone.name, Number(newZone.fee));
      setZones(prev => [...prev, added]);
      setNewZone({ name: "", fee: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to add delivery zone. Please try again.");
    } finally {
      setZoneLoading(false);
    }
  };

  const handleRemoveZone = async (id: string) => {
    try {
      const { deleteDeliveryZone } = await import("@/lib/supabase");
      await deleteDeliveryZone(id);
      setZones(prev => prev.filter(z => z.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm.name) return;
    try {
      const { updateDeliveryZone } = await import("@/lib/supabase");
      const updated = await updateDeliveryZone(id, editForm.name, Number(editForm.fee));
      setZones(prev => prev.map(z => z.id === id ? updated : z));
      setEditingZone(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update delivery zone.");
    }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-6 h-6 animate-spin text-green-400" /></div>;

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-green-400/60 uppercase tracking-[0.2em] font-bold mb-1">Fulfillment Infrastructure</p>
          <h1 className="text-3xl font-bold text-white">Logistics & Delivery</h1>
        </div>
      </div>

      <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-green-300/80 leading-relaxed max-w-2xl">
          Delivery Zones define exactly what shipping options customers see based on their region. 
          When a user selects a zone on the storefront checkout, the configured fee is strictly added to their Paystack total and they are required to supply their physical street address.
        </p>
      </div>

      {/* Delivery Zones Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Active Delivery Zones</h3>
              <p className="text-xs text-white/30">Selectable regions configured for the storefront checkout</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {zones.length === 0 ? (
            <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center flex flex-col items-center">
              <Globe className="w-8 h-8 text-white/10 mb-3" />
              <p className="text-white/40 text-sm font-medium">No active delivery zones.</p>
              <p className="text-[10px] uppercase tracking-widest text-white/20 mt-1">Storefront will only support collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.map((zone) => (
                <div key={zone.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between group min-h-[120px] hover:border-green-500/30 transition-all">
                   {editingZone === zone.id ? (
                     <div className="space-y-3">
                       <input 
                         value={editForm.name}
                         onChange={e => setEditForm({...editForm, name: e.target.value})}
                         className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500"
                       />
                       <div className="flex items-center gap-2">
                         <span className="text-white/40 text-xs mt-1">R</span>
                         <input 
                           type="number"
                           value={editForm.fee}
                           onChange={e => setEditForm({...editForm, fee: Number(e.target.value)})}
                           className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-green-500"
                         />
                       </div>
                       <div className="flex items-center gap-2 pt-2">
                         <button onClick={() => handleSaveEdit(zone.id)} className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-colors">
                           Save
                         </button>
                         <button onClick={() => setEditingZone(null)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-colors">
                           Cancel
                         </button>
                       </div>
                     </div>
                   ) : (
                     <div className="flex flex-col h-full justify-between">
                       <div>
                         <p className="text-xs font-bold uppercase tracking-widest text-white/50">{zone.name}</p>
                         <p className="text-2xl font-serif text-brand-gold mt-2">R {zone.fee}</p>
                       </div>
                       <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                         <button 
                           onClick={() => { setEditingZone(zone.id); setEditForm({ name: zone.name, fee: zone.fee }); }} 
                           className="text-[10px] uppercase tracking-widest font-bold text-indigo-400/70 hover:text-indigo-400 transition-colors"
                         >
                           Edit
                         </button>
                         <button onClick={() => handleRemoveZone(zone.id)} className="text-[10px] uppercase tracking-widest font-bold text-red-500/50 hover:text-red-500 transition-colors">
                           Delete
                         </button>
                       </div>
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}

          <div className="p-5 bg-black/20 border border-white/5 rounded-2xl">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4">Register New Zone</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                placeholder="Region Name (e.g. Pretoria Express)"
                value={newZone.name}
                onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                className="flex-1 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-green-500/50 outline-none transition-all text-white text-sm"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold block pt-0.5">R</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={newZone.fee}
                  onChange={(e) => setNewZone({...newZone, fee: Number(e.target.value)})}
                  className="w-full md:w-40 pl-10 pr-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl focus:border-green-500/50 outline-none transition-all text-white text-sm"
                />
              </div>
              <button 
                onClick={handleAddZone}
                disabled={zoneLoading || !newZone.name}
                className="px-8 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all whitespace-nowrap"
              >
                {zoneLoading ? '...' : '+ Add Zone'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
