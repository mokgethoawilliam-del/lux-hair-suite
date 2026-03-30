"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Search, Plus, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InventoryManager() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_in_stock: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      setInventory(inventory.map(item => 
        item.id === id ? { ...item, is_in_stock: !currentStatus } : item
      ));
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const deleteProduct = async (id: string) => {
     if (!confirm("Are you sure? This will remove the product/service from the store.")) return;
     try {
       const { error } = await supabase.from("products").delete().eq("id", id);
       if (error) throw error;
       setInventory(inventory.filter(item => item.id !== id));
     } catch (err) {
       console.error("Error deleting product:", err);
     }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Frontal", price: 0, image_url: "", type: "In-Stock", description: "", affiliate_link: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = newProduct.image_url;

      // 1. Upload Image if exists
      if (imageFile) {
        const { uploadImage } = await import("@/lib/supabase");
        finalImageUrl = await uploadImage(imageFile);
      }

      // 2. Insert Product
      const { data, error } = await supabase
        .from("products")
        .insert([{ ...newProduct, image_url: finalImageUrl }])
        .select()
        .single();
      
      if (error) throw error;
      setInventory([data, ...inventory]);
      setIsAddModalOpen(false);
      setNewProduct({ name: "", category: "Frontal", price: 0, image_url: "", type: "In-Stock", description: "", affiliate_link: "" });
      setImageFile(null);
    } catch (err: any) {
      console.error("Full Error:", err);
      alert(`Error adding item: ${err.message || 'Check your permissions or Supabase connection.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-brand-gold mx-auto" /></div>;

  return (
    <div className="space-y-12 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Inventory <span className="text-brand-gold italic">Vault</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">DIRECT STOCK CONTROL</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-gold/20"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-brand-obsidian/90 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 border border-white/5 p-12 rounded-[40px] w-full max-w-2xl max-h-full overflow-auto space-y-8 shadow-2xl">
            <h2 className="text-3xl font-serif text-white">Add <span className="text-brand-gold italic">New Item</span></h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Product Name</label>
                 <input 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Category</label>
                 <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none text-white"
                 >
                    <option value="Frontal">Frontal</option>
                    <option value="Weave">Weave</option>
                    <option value="Ponytail">Ponytail</option>
                    <option value="Service">Service (Installation)</option>
                    <option value="Pro-Care">Pro-Care</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Price (R)</label>
                 <input 
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Product Media</label>
                 <div className="relative group/upload">
                   <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className="w-full px-6 py-4 bg-brand-obsidian border border-dashed border-white/10 rounded-2xl group-hover/upload:border-brand-gold/50 transition-all text-center">
                      <span className="text-xs text-white/40 group-hover/upload:text-brand-gold transition-colors">
                        {imageFile ? imageFile.name : 'Click to Upload Product Image'}
                      </span>
                   </div>
                 </div>
               </div>
               <div className="col-span-full space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Description</label>
                 <textarea 
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none text-white resize-none" 
                 />
               </div>
               
               {newProduct.category === "Pro-Care" && (
                 <div className="col-span-full space-y-2">
                   <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Affiliate Link (Optional)</label>
                   <input 
                    value={newProduct.affiliate_link}
                    onChange={(e) => setNewProduct({...newProduct, affiliate_link: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-obsidian border border-brand-gold/20 rounded-2xl focus:border-brand-gold/50 outline-none text-white italic" 
                    placeholder="https://www.takealot.com/..."
                   />
                 </div>
               )}

               <div className="col-span-full flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-2 py-4 bg-brand-gold text-brand-obsidian rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : 'Add to Inventory'}
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Grid View */}
      <div className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-6">
          <div className="flex-1 px-6 py-3 bg-brand-obsidian border border-white/10 rounded-2xl flex items-center gap-4">
            <Search className="w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search products or services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none placeholder:text-white/20 text-white" 
            />
          </div>
          <div className="px-6 py-3 bg-brand-obsidian border border-white/10 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-brand-gold/30 transition-all">
            <ArrowUpDown className="w-4 h-4 text-white/30" />
            <span className="text-sm">Sort By: Newest</span>
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
              {filteredInventory.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      {item.image_url ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                           <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-serif text-brand-gold">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-serif text-lg">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-white/50 text-sm font-bold uppercase tracking-widest">{item.category}</td>
                  <td className="px-10 py-8 font-bold text-brand-gold">R {item.price}</td>
                  <td className="px-10 py-8">
                     <div className="flex justify-center">
                       <button 
                         onClick={() => toggleStatus(item.id, item.is_in_stock)}
                         className={`relative w-14 h-7 rounded-full transition-all duration-300 ${item.is_in_stock ? "bg-brand-gold" : "bg-white/10"}`}
                       >
                         <div className={`absolute top-1 w-5 h-5 rounded-full bg-brand-obsidian transition-all duration-300 ${item.is_in_stock ? "left-8" : "left-1"}`} />
                       </button>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => deleteProduct(item.id)}
                      className="p-3 text-white/10 hover:text-white hover:bg-red-500/20 rounded-xl transition-all"
                    >
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
