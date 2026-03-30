"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Check, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { fetchGalleryImages, uploadGalleryImage, deleteGalleryImage } from "@/lib/supabase";

export default function GalleryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = async () => {
    try {
      const data = await fetchGalleryImages();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadGalleryImage(file);
      await loadImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed. Check Supabase connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await deleteGalleryImage(id, imageUrl);
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Delete failed.");
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Gallery <span className="text-brand-gold italic">Vault</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">BRAND PORTFOLIO & REAL PICTURES</p>
        </div>
        
        <div className="flex gap-4">
           {/* Hidden File Input */}
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             className="hidden" 
             accept="image/*"
           />
           <button 
             onClick={triggerUpload}
             disabled={isUploading}
             className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-gold/20"
           >
             {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> Upload Real Photos</>}
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Upload Slot */}
        <div 
          onClick={triggerUpload}
          className="aspect-[3/4] bg-white/5 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-gold/30 hover:bg-white/[0.08] transition-all group"
        >
          <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-all">
            <Plus className="w-6 h-6 text-white/20 group-hover:text-brand-gold" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Add Photo</span>
        </div>

        {images.map((img) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-[3/4] rounded-[32px] overflow-hidden border border-white/10"
          >
            <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-brand-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button 
                onClick={() => removeImage(img.id, img.image_url)}
                className="p-3 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-3 bg-brand-gold text-brand-obsidian rounded-full">
                <Check className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Existing Gallery Mock */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="relative aspect-[3/4] rounded-[32px] overflow-hidden border border-white/5 bg-white/[0.02] filter grayscale opacity-40">
             <img src={`https://images.unsplash.com/photo-${1590 + i}?q=80&w=400`} alt="Gallery" className="w-full h-full object-cover" />
             <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white/10" />
             </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-brand-emerald/10 border border-brand-emerald/20 rounded-[40px] flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-gold/10 rounded-2xl">
              <Check className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
               <h4 className="font-serif text-xl">Storage Optimized</h4>
               <p className="text-xs text-white/30 uppercase mt-1">High-resolution images are automatically compressed for mobile speed.</p>
            </div>
         </div>
         <span className="text-xs font-bold text-white/20 italic">0.4 MB / 1.0 GB</span>
      </div>
    </div>
  );
}
