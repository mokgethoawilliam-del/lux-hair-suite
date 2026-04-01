"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, ArrowUpDown, Loader2, PenSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_in_stock: boolean;
  description?: string;
  affiliate_link?: string;
  sizes?: string[];
  colors?: string[];
  stock_count?: number;
}

export default function InventoryManager() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [businessFocus, setBusinessFocus] = useState("Hair & Beauty");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { getAppSettings } = await import("@/lib/supabase");
      const [invData, settings] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        getAppSettings()
      ]);
      
      if (invData.error) throw invData.error;
      setInventory((invData.data as Product[]) || []);
      setBusinessFocus(settings.business_focus || "Hair & Beauty");
      
      // Default category based on focus
      if (settings.business_focus === "Sneakers & Streetwear") {
        setNewProduct(prev => ({ ...prev, category: "Sneakers" }));
      } else if (settings.business_focus === "Clothing & Apparel") {
        setNewProduct(prev => ({ ...prev, category: "Clothing" }));
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const themeColors: Record<string, { text: string; bg: string; button: string; border: string; highlight: string }> = {
    "Hair & Beauty": { text: "text-emerald-500", bg: "bg-emerald-500", button: "bg-emerald-500", border: "border-emerald-500/20", highlight: "emerald" },
    "Sneakers & Streetwear": { text: "text-amber-500", bg: "bg-amber-500", button: "bg-amber-500", border: "border-amber-500/20", highlight: "amber" },
    "Clothing & Apparel": { text: "text-blue-500", bg: "bg-blue-500", button: "bg-blue-500", border: "border-blue-500/20", highlight: "blue" },
    "Multi-Hustle": { text: "text-purple-500", bg: "bg-purple-500", button: "bg-purple-500", border: "border-purple-500/20", highlight: "purple" },
  };

  const theme = themeColors[businessFocus] || themeColors["Hair & Beauty"];

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    category: "Frontal", 
    price: 0, 
    original_price: 0,
    image_url: "", 
    type: "In-Stock", 
    description: "", 
    affiliate_link: "",
    sizes: "", 
    colors: "",
    stock_count: 10
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = newProduct.image_url;

      if (imageFile) {
        const { uploadImage } = await import("@/lib/supabase");
        finalImageUrl = await uploadImage(imageFile);
      }

      // Prepare payload
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        original_price: newProduct.original_price ? Number(newProduct.original_price) : null,
        image_url: finalImageUrl,
        type: newProduct.type,
        description: newProduct.description,
        affiliate_link: newProduct.affiliate_link,
        sizes: newProduct.sizes.split(",").map(s => s.trim()).filter(s => s !== ""),
        colors: newProduct.colors.split(",").map(c => c.trim()).filter(c => c !== ""),
        stock_count: Number(newProduct.stock_count)
      };

      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select()
        .single();
      
      if (error) throw error;
      setInventory([data as Product, ...inventory]);
      setIsAddModalOpen(false);
      resetNewProduct();
      setImageFile(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      let finalImageUrl = editingProduct.image_url;
      if (imageFile) {
        const { uploadImage } = await import("@/lib/supabase");
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from("products")
        .update({
          ...editingProduct,
          image_url: finalImageUrl,
          price: Number(editingProduct.price),
          original_price: editingProduct.original_price ? Number(editingProduct.original_price) : null,
          stock_count: Number(editingProduct.stock_count)
        })
        .eq("id", editingProduct.id);

      if (error) throw error;
      setInventory(inventory.map(p => p.id === editingProduct.id ? { ...editingProduct, image_url: finalImageUrl } : p));
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setImageFile(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetNewProduct = () => {
    setNewProduct({ 
      name: "", 
      category: businessFocus === "Sneakers & Streetwear" ? "Sneakers" : businessFocus === "Clothing & Apparel" ? "Clothing" : "Frontal", 
      price: 0, 
      original_price: 0,
      image_url: "", 
      type: "In-Stock", 
      description: "", 
      affiliate_link: "",
      sizes: "",
      colors: "",
      stock_count: 10
    });
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-20 text-center"><Loader2 className={`animate-spin ${theme.text} mx-auto`} /></div>;

  return (
    <div className="space-y-12 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Inventory <span className={`${theme.text} italic`}>Vault</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">DIRECT STOCK CONTROL · {businessFocus.toUpperCase()}</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className={`px-8 py-4 ${theme.button} text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-${theme.highlight}-500/20`}
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-brand-obsidian/90 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 border border-white/5 p-12 rounded-[40px] w-full max-w-2xl max-h-full overflow-auto space-y-8 shadow-2xl">
            <h2 className="text-3xl font-serif text-white">Add <span className={`${theme.text} italic`}>New Item</span></h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Product Name</label>
                 <input 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Category</label>
                 <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white"
                 >
                    <optgroup label="Hair & Beauty">
                      <option value="Frontal">Frontal</option>
                      <option value="Weave">Weave</option>
                      <option value="Ponytail">Ponytail</option>
                      <option value="Service">Service (Installation)</option>
                    </optgroup>
                    <optgroup label="Sneakers & Clothing">
                      <option value="Sneakers">Sneakers (Direct Stock)</option>
                      <option value="Clothing">Clothing / Apparel</option>
                    </optgroup>
                    <option value="Pro-Care">Pro-Care / Accessories</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Sale Price (R)</label>
                 <input 
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Original Price / RRP (R)</label>
                 <input 
                  type="number"
                  value={newProduct.original_price}
                  onChange={(e) => setNewProduct({...newProduct, original_price: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-emerald-500/10 rounded-2xl focus:border-emerald-500/30 outline-none text-white" 
                  placeholder="e.g. 2499 (Market Price)"
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
                   <div className="w-full px-6 py-4 bg-brand-obsidian border border-dashed border-white/10 rounded-2xl group-hover/upload:border-amber-500/50 transition-all text-center">
                      <span className="text-xs text-white/40 group-hover/upload:text-amber-500 transition-colors">
                        {imageFile ? imageFile.name : 'Click to Upload Product Image'}
                      </span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Stock Quantity</label>
                  <input 
                   type="number"
                   value={newProduct.stock_count}
                   onChange={(e) => setNewProduct({...newProduct, stock_count: parseInt(e.target.value)})}
                   className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white" 
                  />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Sizes (UK7, S, 12\")</label>
                 <input 
                  value={newProduct.sizes}
                  onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Colors (Black, Emerald)</label>
                 <input 
                  value={newProduct.colors}
                  onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white" 
                 />
               </div>

               <div className="col-span-full space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white resize-none" 
                  />
               </div>

               <div className="col-span-full space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Affiliate Link (Optional)</label>
                 <input 
                  value={newProduct.affiliate_link}
                  onChange={(e) => setNewProduct({...newProduct, affiliate_link: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/5 rounded-2xl focus:border-amber-500/50 outline-none text-white italic" 
                  placeholder="https://..."
                 />
               </div>

               <div className="col-span-full flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-2 py-4 bg-amber-500 text-brand-obsidian rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
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
          <div className="px-6 py-3 bg-brand-obsidian border border-white/10 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-amber-500/30 transition-all">
            <ArrowUpDown className="w-4 h-4 text-white/30" />
            <span className="text-sm">Sort By: Newest</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-brand-obsidian/50 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                <th className="px-10 py-6">Product Item</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Price</th>
                <th className="px-10 py-6">Stock / Sizes</th>
                <th className="px-10 py-6 text-center">Status</th>
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
                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-serif text-amber-500">
                           {item.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-serif text-lg block">{item.name}</span>
                        {item.stock_count !== undefined && (
                          <span className={`text-[9px] uppercase font-bold tracking-widest ${item.stock_count < 5 ? 'text-red-400' : 'text-white/20'}`}>
                            {item.stock_count} units left
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      item.category === 'Sneakers' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      item.category === 'Clothing' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                      'border-white/10 text-white/40'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-10 py-8 font-bold text-amber-500">
                    <div className="flex flex-col">
                      <span>R {item.price}</span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-[10px] text-white/20 line-through">R {item.original_price}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {item.sizes?.map(size => (
                        <span key={size} className="text-[9px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/40 uppercase">
                          {size}
                        </span>
                      )) || <span className="text-white/10 text-[9px] uppercase tracking-widest">N/A</span>}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex justify-center">
                       <button 
                         onClick={() => toggleStatus(item.id, item.is_in_stock)}
                         className={`relative w-14 h-7 rounded-full transition-all duration-300 ${item.is_in_stock ? "bg-amber-500" : "bg-white/10"}`}
                       >
                         <div className={`absolute top-1 w-5 h-5 rounded-full bg-brand-obsidian transition-all duration-300 ${item.is_in_stock ? "left-8" : "left-1"}`} />
                       </button>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(item);
                          setIsEditModalOpen(true);
                        }}
                        className="p-3 text-white/10 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <PenSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteProduct(item.id)}
                        className="p-3 text-white/10 hover:text-white hover:bg-red-500/20 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-brand-obsidian/90 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 border border-white/5 p-12 rounded-[40px] w-full max-w-2xl max-h-full overflow-auto space-y-8 shadow-2xl">
            <h2 className="text-3xl font-serif text-white">Update <span className={`${theme.text} italic`}>Product Information</span></h2>
            <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Product Name</label>
                 <input 
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl outline-none text-white" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Status</label>
                 <button 
                   type="button"
                   onClick={() => setEditingProduct({...editingProduct, is_in_stock: !editingProduct.is_in_stock})}
                   className={`w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-brand-obsidian transition-colors ${editingProduct.is_in_stock ? "bg-emerald-500" : "bg-white/10 text-white/20"}`}
                 >
                   {editingProduct.is_in_stock ? 'In Stock' : 'Out of Stock'}
                 </button>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Sale Price (R)</label>
                 <input 
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl outline-none text-white focus:border-amber-500" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Original Price (R)</label>
                 <input 
                  type="number"
                  value={editingProduct.original_price || 0}
                  onChange={(e) => setEditingProduct({...editingProduct, original_price: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl outline-none text-white focus:border-emerald-500" 
                 />
               </div>
               <div className="col-span-full space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Adjust Stock ({editingProduct.stock_count} Available)</label>
                  <input 
                   type="number"
                   value={editingProduct.stock_count}
                   onChange={(e) => setEditingProduct({...editingProduct, stock_count: parseInt(e.target.value)})}
                   className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl outline-none text-white" 
                  />
               </div>
               <div className="col-span-full flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-2 py-4 bg-white text-brand-obsidian rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save Changes'}
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
