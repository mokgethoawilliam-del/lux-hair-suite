"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, Type, Layout, Globe, Image as ImageIcon, Sparkles, ArrowRight, Loader2, X, CheckCircle2 } from "lucide-react";
import { getSiteMetadata, updateSiteMetadata, supabase } from "@/lib/supabase";
import { askDesignerQuestions, generateSiteDesign } from "@/lib/ai";

export default function SiteEditor() {
  const [metadata, setMetadata] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // AI Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // 1: Prompt, 2: Questions, 3: Success
  const [aiPrompt, setAiPrompt] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteMetadata();
      setMetadata(data);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteMetadata(metadata);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving metadata:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setMetadata({ ...metadata, [key]: value });
  };

  // AI Logic
  const startAIWizard = async () => {
    if (!aiPrompt.trim()) return;
    setIsAILoading(true);
    try {
      const qs = await askDesignerQuestions(aiPrompt, metadata.brand_name || "Lux Hair Suite");
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(""));
      setWizardStep(2);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAILoading(false);
    }
  };

  const processAnswers = async () => {
    setIsAILoading(true);
    try {
      const design = await generateSiteDesign({
        description: aiPrompt,
        answers,
        currentBrand: metadata.brand_name || "Lux Hair Suite"
      });
      setAiResult(design);
      setWizardStep(3);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAILoading(false);
    }
  };

  const applyAIDesign = () => {
    if (!aiResult) return;
    setMetadata({
      ...metadata,
      brand_name: aiResult.brand_name,
      hero_headline: aiResult.hero_headline,
      hero_description: aiResult.hero_description
    });
    setIsWizardOpen(false);
    setWizardStep(1);
    setAiPrompt("");
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2 text-white">Site <span className="text-brand-gold italic">Editor</span></h1>
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">BRAND VOICE & CONTENT CONTROL</p>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsWizardOpen(true)}
             className="px-8 py-4 bg-brand-emerald text-brand-gold font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-emerald/20"
           >
             <Sparkles className="w-5 h-5" /> Magic Design
           </button>

           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-8 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-gold/20 min-w-[140px]"
           >
             {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Hero Section Editor */}
        <section className="p-10 bg-white/5 border border-white/5 rounded-[40px] space-y-8">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-brand-gold/10 rounded-xl">
               <Layout className="w-5 h-5 text-brand-gold" />
             </div>
             <h3 className="text-2xl font-serif">Hero <span className="text-brand-gold italic">Section</span></h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Main Headline</label>
              <textarea 
                value={metadata.hero_headline || "Premium Hair Redefined."}
                onChange={(e) => updateField("hero_headline", e.target.value)}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all font-serif text-xl h-32"
                placeholder="The bold headline of your site..."
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Hero Description</label>
              <textarea 
                value={metadata.hero_description || "Experience the ultimate in high-performance Frontals, Ponytails, and Weaves."}
                onChange={(e) => updateField("hero_description", e.target.value)}
                className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all text-sm leading-relaxed text-white/60 h-32"
                placeholder="Describe what you do in 2 sentences..."
              />
            </div>
          </div>
        </section>

        {/* Brand & Social Editor */}
        <div className="space-y-8">
          <section className="p-10 bg-white/5 border border-white/5 rounded-[40px] space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-brand-gold/10 rounded-xl">
                 <Globe className="w-5 h-5 text-brand-gold" />
               </div>
               <h3 className="text-2xl font-serif">Brand <span className="text-brand-gold italic">Intelligence</span></h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Owner WhatsApp</label>
                <input 
                  type="text"
                  value={metadata.whatsapp_number || ""}
                  onChange={(e) => updateField("whatsapp_number", e.target.value)}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                  placeholder="27631234567"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Brand Display Name</label>
                <input 
                  type="text"
                  value={metadata.brand_name || ""}
                  onChange={(e) => updateField("brand_name", e.target.value)}
                  className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                  placeholder="e.g. Bolt Kicks"
                />
              </div>
            </div>
          </section>

          <div className="p-10 bg-brand-emerald/10 border border-brand-emerald/20 rounded-[40px] flex items-center justify-between group cursor-pointer hover:bg-brand-emerald/20 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-gold/20 rounded-2xl group-hover:scale-110 transition-all">
                  <ImageIcon className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                   <h4 className="font-serif text-xl">Gallery Vault</h4>
                   <p className="text-xs text-white/30 uppercase mt-1">Manage brand portfolio images</p>
                </div>
             </div>
             <RefreshCw className="w-5 h-5 text-white/10 group-hover:text-brand-gold transition-all" />
          </div>
        </div>
      </div>

      {/* AI MAGIC DESIGNER MODAL */}
      <AnimatePresence>
        {isWizardOpen && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-obsidian/90 backdrop-blur-xl"
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[48px] p-12 relative overflow-hidden"
            >
              <button 
                 onClick={() => { setIsWizardOpen(false); setWizardStep(1); }}
                 className="absolute top-8 right-8 text-white/20 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-12">
                 <div className="p-4 bg-brand-gold/10 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-brand-gold" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-serif">Magic <span className="text-brand-gold italic">Designer</span></h3>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Conversational AI Branding</p>
                 </div>
              </div>

              {wizardStep === 1 && (
                <div className="space-y-8">
                   <div className="space-y-4">
                      <h4 className="text-xl text-white/80 font-serif lowercase italic">Tell me about your business...</h4>
                      <textarea 
                         value={aiPrompt}
                         onChange={(e) => setAiPrompt(e.target.value)}
                         placeholder="e.g. I am starting a high-end barbershop in Johannesburg that focuses on executive haircuts and grooming..."
                         className="w-full h-40 px-8 py-6 bg-brand-obsidian border border-white/10 rounded-[32px] focus:border-brand-gold/50 outline-none transition-all resize-none text-lg"
                      />
                   </div>
                   <button 
                      onClick={startAIWizard}
                      disabled={isAILoading || !aiPrompt}
                      className="w-full py-5 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
                   >
                      {isAILoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> Start Designing</>}
                   </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-8">
                   <div className="max-h-[400px] overflow-y-auto space-y-8 pr-4 custom-scrollbar">
                      {questions.map((q, i) => (
                        <div key={i} className="space-y-2">
                           <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">{q}</label>
                           <input 
                              value={answers[i]}
                              onChange={(e) => {
                                 const newAnswers = [...answers];
                                 newAnswers[i] = e.target.value;
                                 setAnswers(newAnswers);
                              }}
                              className="w-full px-6 py-4 bg-brand-obsidian border border-white/10 rounded-2xl focus:border-brand-gold/50 outline-none transition-all"
                              placeholder="Type your answer..."
                           />
                        </div>
                      ))}
                   </div>
                   <button 
                      onClick={processAnswers}
                      disabled={isAILoading || answers.some(a => !a)}
                      className="w-full py-5 bg-brand-gold text-brand-obsidian font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
                   >
                      {isAILoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Design</>}
                   </button>
                </div>
              )}

              {wizardStep === 3 && aiResult && (
                <div className="space-y-8">
                   <div className="p-8 bg-brand-emerald/10 border border-brand-emerald/20 rounded-[32px] space-y-6">
                      <div className="flex items-center gap-3 text-brand-emerald">
                         <CheckCircle2 className="w-5 h-5" />
                         <span className="text-xs uppercase font-bold tracking-widest">AI Proposal Ready</span>
                      </div>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] uppercase text-white/30 font-bold mb-1">New Brand Name</p>
                            <p className="text-2xl font-serif text-white">{aiResult.brand_name}</p>
                         </div>
                         <div>
                            <p className="text-[10px] uppercase text-white/30 font-bold mb-1">Hero Headline</p>
                            <p className="text-lg font-serif text-white/80 leading-tight">{aiResult.hero_headline}</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                         onClick={() => setWizardStep(1)}
                         className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5"
                      >
                         Draft Again
                      </button>
                      <button 
                         onClick={applyAIDesign}
                         className="flex-2 py-4 bg-brand-gold text-brand-obsidian rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-gold/20"
                      >
                         Apply Magic Design
                      </button>
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
