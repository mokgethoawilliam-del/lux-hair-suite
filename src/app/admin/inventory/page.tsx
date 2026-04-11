"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  PenSquare, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  ArrowUpDown,
  X,
  Palette
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  image_url: string; // Legacy support
  image_urls: string[]; // New Multi-image support
  type: string;
  is_in_stock: boolean;
  stock_count: number;
  description: string;
  affiliate_link: string | null;
  sizes: string[];
  colors: string[];
  created_at: string;
  is_new: boolean;
  caption?: string;
  duration_hours?: number; // Estimated Service Time
}

const LUXURY_COLORS = [
  // Hair & Beauty
  { name: "Jet Black", hex: "#000000" },
  { name: "Natural Black (1B)", hex: "#2b2b2b" },
  { name: "Chocolate Brown", hex: "#3d2b1f" },
  { name: "Honey Blonde", hex: "#f5d76e" },
  { name: "Platinum Blonde", hex: "#f5f5f5" },
  { name: "Copper Ginger", hex: "#c0392b" },
  { name: "Auburn Red", hex: "#922b21" },
  { name: "Burgundy Velvet", hex: "#7f1d1d" },
  { name: "Silver Ash", hex: "#94a3b8" },
  { name: "Deep Obsidian", hex: "#111827" },
  
  // High-End Sneakers & Fashion
  { name: "Electric Volt", hex: "#ceff00" },
  { name: "Royal Blue", hex: "#005bb7" },
  { name: "Infrared Red", hex: "#ff3a3a" },
  { name: "Hyper Purple", hex: "#7d3cff" },
  { name: "University Blue", hex: "#5b92e1" },
  { name: "Forest Green", hex: "#1b4332" },
  { name: "Raw Emerald", hex: "#064e3b" },
  { name: "Gold Dust", hex: "#d97706" },
  { name: "White Silk", hex: "#f8fafc" },
  { name: "Midnight Blue", hex: "#1e3a8a" },
  { name: "Cement Grey", hex: "#7d7d7d" },
  { name: "Peach Fuzz", hex: "#ffbe7d" },
  { name: "Sky Blue", hex: "#87ceeb" },
  { name: "Sand Dune", hex: "#c2b280" }
];

const INDUSTRIAL_SIZES = [
  { category: "Hair (Inches)", values: ["10\"", "12\"", "14\"", "16\"", "18\"", "20\"", "22\"", "24\"", "26\"", "28\"", "30\"", "32\"", "34\""] },
  { category: "Sneakers (UK)", values: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"] },
  { category: "Clothing", values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] }
];

function SizePicker({ selected, onChange }: { selected: string[], onChange: (sizes: string[]) => void }) {
  const [search, setSearch] = useState("");
  
  const toggle = (size: string) => {
    if (selected.includes(size)) {
      onChange(selected.filter(s => s !== size));
    } else {
      onChange([...selected, size]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
        <input 
          type="text"
          placeholder="Add custom size (e.g. 10ml, 500g)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search) {
              e.preventDefault();
              toggle(search);
              setSearch("");
            }
          }}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-4 border-b border-white/5 pb-4">
        {INDUSTRIAL_SIZES.map(group => (
          <div key={group.category} className="space-y-2">
            <p className="text-[8px] uppercase font-bold text-white/20 tracking-widest">{group.category}</p>
            <div className="flex flex-wrap gap-2">
              {group.values.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggle(size)}
                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold transition-all ${selected.includes(size) ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_15px_-5px_#f59e0b]" : "border-white/5 bg-white/5 text-white/40 hover:border-white/20"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selected.map(s => (
            <span key={s} className="text-[8px] font-bold uppercase tracking-widest text-brand-obsidian bg-white/80 px-2 py-1 rounded-md">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorPicker({ selected, onChange }: { selected: string[], onChange: (colors: string[]) => void }) {
  const [search, setSearch] = useState("");
  const filtered = LUXURY_COLORS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const exactMatch = LUXURY_COLORS.find(c => c.name.toLowerCase() === search.toLowerCase());

  const toggle = (color: string) => {
    if (selected.includes(color)) {
      onChange(selected.filter(c => c !== color));
    } else {
      onChange([...selected, color]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
        <input 
          type="text"
          placeholder="Search or add custom color..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search && !exactMatch) {
              e.preventDefault();
              toggle(search);
              setSearch("");
            }
          }}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar border-b border-white/5 pb-4">
        <div className="grid grid-cols-4 gap-2">
          {search && !exactMatch && (
            <button
              type="button"
              onClick={() => {
                toggle(search);
                setSearch("");
              }}
              className="col-span-full h-10 border border-dashed border-amber-500/40 bg-amber-500/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3 h-3" /> Add Custom: {search}
            </button>
          )}

          {filtered.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => toggle(c.name)}
              className={`group relative h-10 rounded-lg border transition-all flex items-center justify-center ${selected.includes(c.name) ? "border-amber-500 bg-amber-500/10 shadow-[0_0_15px_-5px_#f59e0b]" : "border-white/5 bg-white/5 hover:border-white/20"}`}
            >
              <div 
                className="w-4 h-4 rounded-full border border-white/10" 
                style={{ backgroundColor: c.hex }}
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 scale- scale-0 group-hover:scale-100 transition-all z-20 whitespace-nowrap bg-brand-obsidian px-2 py-1 rounded text-[8px] font-bold text-amber-500 uppercase">
                {c.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selected.map(c => (
            <span key={c} className="text-[8px] font-bold uppercase tracking-widest text-brand-obsidian bg-amber-500 px-2 py-1 rounded-full border border-amber-500/20 shadow-lg shadow-amber-500/10">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InventoryManager() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Frontal",
    price: 0,
    original_price: 0,
    type: "In-Stock", // Default to valid DB enum
    is_in_stock: true,
    stock_count: 10,
    description: "",
    affiliate_link: "",
    image_url: "", // Legacy first image
    image_urls: [] as string[], // Multi-image support
    sizes: [] as string[],
    colors: [] as string[],
    is_new: false,
    caption: "",
    duration_hours: 2.0 // Default 2hr service
  });

  const theme = {
    bg: "bg-brand-obsidian",
    card: "bg-white/5",
    text: "text-amber-500",
    border: "border-white/10"
  };

  useEffect(() => {
    const init = async () => {
       const { resolveSiteId } = await import("@/lib/supabase");
       const id = await resolveSiteId();
       setActiveSiteId(id);
       fetchInventory(id);
    };
    init();
  }, []);

  const fetchInventory = async (siteId?: string) => {
    try {
      let query = supabase.from("products").select("*").neq("category", "Gallery");
      
      if (siteId) {
        query = query.eq("site_id", siteId);
      } else if (activeSiteId) {
        query = query.eq("site_id", activeSiteId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      setInventory((data as Product[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setInventory(inventory.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      category: "Frontal",
      price: 0,
      original_price: 0,
      type: "In-Stock",
      is_in_stock: true,
      stock_count: 10,
      description: "",
      affiliate_link: "",
      image_url: "",
      image_urls: [],
      sizes: [],
      colors: [],
      is_new: false,
      caption: "",
      duration_hours: 2.0
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrls = [...newProduct.image_urls];

      if (imageFiles.length > 0) {
        const { uploadImage } = await import("@/lib/supabase");
        const uploadPromises = imageFiles.map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
      }

      // Prepare payload
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        original_price: newProduct.original_price ? Number(newProduct.original_price) : null,
        image_url: finalImageUrls[0] || "", // Primary image
        image_urls: finalImageUrls,
        type: newProduct.category === "Service" ? "Service" : (newProduct.category === "Pro-Care" && newProduct.affiliate_link ? "Affiliate" : "In-Stock"),
        description: newProduct.description,
        affiliate_link: newProduct.affiliate_link,
        sizes: newProduct.sizes,
        colors: newProduct.colors,
        stock_count: Number(newProduct.stock_count),
        is_new: newProduct.is_new,
        caption: newProduct.caption,
        duration_hours: ["Service", "Frontal", "Weave", "Ponytail"].includes(newProduct.category) ? Number(newProduct.duration_hours) : 0,
        site_id: activeSiteId
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
      setImageFiles([]);
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
      let finalImageUrls = Array.isArray(editingProduct.image_urls) ? [...editingProduct.image_urls] : [editingProduct.image_url].filter(Boolean);

      if (imageFiles.length > 0) {
        const { uploadImage } = await import("@/lib/supabase");
        const uploadPromises = imageFiles.map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
      }

      const payload = {
        name: editingProduct.name,
        is_in_stock: editingProduct.is_in_stock,
        price: Number(editingProduct.price),
        original_price: editingProduct.original_price ? Number(editingProduct.original_price) : null,
        image_url: finalImageUrls[0] || "",
        image_urls: finalImageUrls,
        type: editingProduct.category === "Service" ? "Service" : (editingProduct.category === "Pro-Care" && editingProduct.affiliate_link ? "Affiliate" : "In-Stock"),
        stock_count: Number(editingProduct.stock_count),
        description: editingProduct.description,
        sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [],
        colors: Array.isArray(editingProduct.colors) ? editingProduct.colors : [],
        is_new: editingProduct.is_new,
        caption: editingProduct.caption,
        duration_hours: ["Service", "Frontal", "Weave", "Ponytail"].includes(editingProduct.category) ? Number(editingProduct.duration_hours) : 0
      };

      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProduct.id)
        .select()
        .single();
      
      if (error) throw error;
      setInventory(inventory.map(item => item.id === data.id ? data as Product : item));
      setIsEditModalOpen(false);
      setImageFiles([]);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs text-amber-500/60 uppercase tracking-[0.2em] font-bold mb-1">Administrative Terminal</p>
          <h1 className="text-4xl font-serif text-white uppercase tracking-tighter italic">Inventory <span className={theme.text}>Vault</span></h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 bg-amber-500 text-brand-obsidian rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-amber-500/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-4">
          <div className="flex items-center gap-4 text-white/40">
            <Package className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-bold">Total Stock</span>
          </div>
          <p className="text-4xl font-serif text-white">{inventory.length}</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-4">
          <div className="flex items-center gap-4 text-emerald-400/60">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-bold">Active Listings</span>
          </div>
          <p className="text-4xl font-serif text-white">{inventory.filter(i => i.is_in_stock).length}</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-4">
          <div className="flex items-center gap-4 text-red-400/60">
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-bold">Out of Stock</span>
          </div>
          <p className="text-4xl font-serif text-white">{inventory.filter(i => !i.is_in_stock).length}</p>
        </div>
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
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">
                    {newProduct.category === "Service" ? "Service Price (R)" : "Sale Price (R)"}
                  </label>
                  <input 
                   type="number"
                   required
                   value={newProduct.price}
                   onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                   className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white" 
                  />
                </div>

                {newProduct.category !== "Service" && (
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
                )}

                <div className="space-y-4 col-span-full">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Industrial Gallery (Multi-Photography)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="aspect-square bg-brand-obsidian rounded-2xl border border-white/10 overflow-hidden relative group">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square bg-brand-obsidian border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/30 transition-all text-white/10 hover:text-amber-500">
                      <Plus className="w-6 h-6 mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Add Angle</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setImageFiles([...imageFiles, ...files]);
                        }}
                      />
                    </label>
                  </div>
                </div>
                
                {newProduct.category !== "Service" && (
                  <>
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
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Industrial Sizes (UK/Inches/Cloth)</label>
                      <SizePicker 
                        selected={newProduct.sizes}
                        onChange={(sizes) => setNewProduct({...newProduct, sizes})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Colors (Multi-select)</label>
                      <ColorPicker 
                       selected={newProduct.colors} 
                       onChange={(colors) => setNewProduct({...newProduct, colors: colors})} 
                      />
                    </div>
                  </>
                )}

                <div className="col-span-full grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">New Collection Launch?</label>
                    <button 
                      type="button"
                      onClick={() => setNewProduct({...newProduct, is_new: !newProduct.is_new})}
                      className={`w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${newProduct.is_new ? "bg-amber-500 text-brand-obsidian shadow-lg shadow-amber-500/20" : "bg-white/5 text-white/20 border border-white/5"}`}
                    >
                      {newProduct.is_new ? 'Active: NEW IN' : 'Standard Collection'}
                    </button>
                  </div>
                  {["Service", "Frontal", "Weave", "Ponytail"].includes(newProduct.category) && (
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Estimated Time (Hours)</label>
                        <input 
                          type="number"
                          step="0.5"
                          value={newProduct.duration_hours}
                          onChange={(e) => setNewProduct({...newProduct, duration_hours: parseFloat(e.target.value)})}
                          className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white italic" 
                          placeholder="e.g. 2.5"
                        />
                     </div>
                  )}
                  {newProduct.category === "Gallery" && (
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Gallery Story (Caption)</label>
                        <input 
                          value={newProduct.caption}
                          onChange={(e) => setNewProduct({...newProduct, caption: e.target.value})}
                          className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white italic" 
                          placeholder="e.g. Recent Bridal Install"
                        />
                     </div>
                  )}
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
                        {item.stock_count !== undefined && item.category !== 'Service' && (
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
                      {item.category !== 'Service' ? (item.sizes?.map(size => (
                        <span key={size} className="text-[9px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/40 uppercase">
                          {size}
                        </span>
                      )) || <span className="text-white/10 text-[9px] uppercase tracking-widest">N/A</span>) : (
                        <span className="text-white/10 text-[9px] uppercase tracking-widest">Service Item</span>
                      )}
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
                   {editingProduct.is_in_stock ? 'Open / Available' : 'Closed / Unavailable'}
                 </button>
               </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">
                    {editingProduct.category === "Service" ? "Service Price (R)" : "Sale Price (R)"}
                  </label>
                  <input 
                   type="number"
                   required
                   value={editingProduct.price}
                   onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                   className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl outline-none text-white focus:border-amber-500" 
                  />
                </div>

                {editingProduct.category !== "Service" && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Original Price (R)</label>
                    <input 
                     type="number"
                     value={editingProduct.original_price || 0}
                     onChange={(e) => setEditingProduct({...editingProduct, original_price: parseInt(e.target.value)})}
                     className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl outline-none text-white focus:border-emerald-500" 
                    />
                  </div>
                )}

                <div className="space-y-4 col-span-full">
                  <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Industrial Gallery (Photography Angels)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Existing Images */}
                    {editingProduct.image_urls?.map((url, idx) => (
                      <div key={`exist-${idx}`} className="aspect-square bg-brand-obsidian rounded-2xl border border-white/10 overflow-hidden relative group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setEditingProduct({...editingProduct, image_urls: editingProduct.image_urls.filter((_, i) => i !== idx)})}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {/* New Staged Images */}
                    {imageFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="aspect-square bg-brand-obsidian rounded-2xl border border-amber-500/20 overflow-hidden relative group">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                        <button 
                          type="button" 
                          onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square bg-brand-obsidian border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/30 transition-all text-white/10 hover:text-amber-500">
                      <Plus className="w-6 h-6 mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Add Angle</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setImageFiles([...imageFiles, ...files]);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {editingProduct.category !== "Service" && (
                  <>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Industrial Sizes (UK/Inches/Cloth)</label>
                       <SizePicker 
                         selected={Array.isArray(editingProduct.sizes) ? editingProduct.sizes : []} 
                         onChange={(sizes) => setEditingProduct({...editingProduct, sizes: sizes})} 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Colors (Multi-select)</label>
                       <ColorPicker 
                         selected={Array.isArray(editingProduct.colors) ? editingProduct.colors : []} 
                         onChange={(colors) => setEditingProduct({...editingProduct, colors: colors})} 
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
                  </>
                )}

                <div className="col-span-full grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Mark as 'New In'?</label>
                    <button 
                      type="button"
                      onClick={() => setEditingProduct({...editingProduct, is_new: !editingProduct.is_new})}
                      className={`w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${editingProduct.is_new ? "bg-amber-500 text-brand-obsidian shadow-lg shadow-amber-500/20" : "bg-white/5 text-white/20 border border-white/5"}`}
                    >
                      {editingProduct.is_new ? 'ACTIVE: NEW IN' : 'STANDARD STOCK'}
                    </button>
                  </div>
                  {["Service", "Frontal", "Weave", "Ponytail"].includes(editingProduct.category) && (
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Service Time (Hours)</label>
                        <input 
                          type="number"
                          step="0.5"
                          value={editingProduct.duration_hours}
                          onChange={(e) => setEditingProduct({...editingProduct, duration_hours: parseFloat(e.target.value)})}
                          className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white italic" 
                        />
                     </div>
                  )}
                  {editingProduct.category === "Gallery" && (
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Gallery Caption</label>
                        <input 
                          value={editingProduct.caption}
                          onChange={(e) => setEditingProduct({...editingProduct, caption: e.target.value})}
                          className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white italic" 
                        />
                     </div>
                  )}
                </div>

                <div className="col-span-full space-y-2">
                   <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest ml-1">Update Description</label>
                   <textarea 
                     rows={2}
                     value={editingProduct.description || ""}
                     onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                     className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-amber-500/50 outline-none text-white resize-none" 
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
