"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Plus, Trash2, ArrowUpDown } from "lucide-react";

const initialInventory = [
  { id: 1, name: "20-inch HD Frontal", category: "Frontal", price: 1200, status: "In Stock" },
  { id: 2, name: "24-inch Virgin Bundle", category: "Bundle", price: 1800, status: "In Stock" },
  { id: 3, name: "Sleek Ponytail 18\"", category: "Ponytail", price: 850, status: "Out of Stock" },
  { id: 4, name: "Silk Edge Scarf", category: "Pro-Care", price: 150, status: "In Stock" },
  { id: 5, name: "Full Sew-in Service", category: "Service", price: 1500, status: "In Stock" },
];

export default function InventoryManager() {
  const [inventory, setInventory] = useState(initialInventory);

  const toggleStatus = (id: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, status: item.status === "In Stock" ? "Out of Stock" : "In Stock" } : item
    ));
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Inventory <span className="text-brand-gold italic">Vault</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">DIRECT STOCK CONTROL</p>
        </div>
        
        <button className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-bold">
          <Plus className="w-5 h-5 text-brand-gold" />
          Add New Product
        </button>
      </div>

      {/* Grid View */}
      <div className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-6">
          <div className="flex-1 px-6 py-3 bg-brand-obsidian border border-white/10 rounded-2xl flex items-center gap-4">
            <Search className="w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search products or services..." className="bg-transparent text-sm w-full outline-none placeholder:text-white/20" />
          </div>
          <div className="px-6 py-3 bg-brand-obsidian border border-white/10 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-brand-gold/30 transition-all">
            <ArrowUpDown className="w-4 h-4 text-white/30" />
            <span className="text-sm">Sort By: Price</span>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-obsidian/50 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                <th className="px-10 py-6">Product Item</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Price</th>
                <th className="px-10 py-6 text-center">Status Toggle</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-emerald rounded-xl border border-white/10 flex items-center justify-center font-serif text-brand-gold">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-serif text-lg">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-white/50 text-sm">{item.category}</td>
                  <td className="px-10 py-8 font-bold text-brand-gold">R {item.price}</td>
                  <td className="px-10 py-8">
                     <div className="flex justify-center">
                       <button 
                         onClick={() => toggleStatus(item.id)}
                         className={`relative w-14 h-7 rounded-full transition-all duration-300 ${item.status === "In Stock" ? "bg-brand-gold" : "bg-white/10"}`}
                       >
                         <div className={`absolute top-1 w-5 h-5 rounded-full bg-brand-obsidian transition-all duration-300 ${item.status === "In Stock" ? "left-8" : "left-1"}`} />
                       </button>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 text-white/10 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
