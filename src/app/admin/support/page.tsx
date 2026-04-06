"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, User, Send, Search, 
  Loader2, Sparkles, CheckCircle2, Clock,
  ChevronRight, Phone, Mail, ShieldCheck
} from "lucide-react";
import { 
  supabase, getActiveChats, getChatMessages, 
  sendChatMessage, markChatAsRead, getAdminSite 
} from "@/lib/supabase";

interface ChatSession {
  session_id: string;
  message: string;
  sender: 'customer' | 'admin';
  created_at: string;
  is_read: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: 'customer' | 'admin';
  created_at: string;
  session_id: string;
}

export default function AdminSupportPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteId, setSiteId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function init() {
      const id = await getAdminSite();
      if (id) {
        setSiteId(id);
        const data = await getActiveChats(id);
        setSessions(data);
      }
      setLoading(false);
    }
    init();

    // Global Real-time for sessions
    const sessionChannel = supabase
      .channel('admin_chats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_chats' },
        (payload: any) => {
          setSessions((prev) => {
            const index = prev.findIndex(s => s.session_id === payload.new.session_id);
            const newSession = payload.new as ChatSession;
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = newSession;
              // Move to top
              updated.splice(index, 1);
              return [newSession, ...updated];
            }
            return [newSession, ...prev];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(sessionChannel); };
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      getChatMessages(selectedSessionId).then(setMessages);
      markChatAsRead(selectedSessionId);
      
      const chatChannel = supabase
        .channel(`admin_chat_${selectedSessionId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'support_chats', filter: `session_id=eq.${selectedSessionId}` },
          (payload: any) => {
            setMessages((prev) => {
              if (prev.some(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as ChatMessage];
            });
            if (payload.new.sender === 'customer') {
              markChatAsRead(selectedSessionId);
            }
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(chatChannel); };
    }
  }, [selectedSessionId]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedSessionId || !siteId || sending) return;
    setSending(true);
    try {
      await sendChatMessage(siteId, selectedSessionId, input, 'admin');
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight">Support <span className="text-white/20 not-italic">Radar</span></h1>
          <p className="text-sm text-white/40 mt-2">Real-time customer assistance bridge.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl">
           <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-400" />
           </div>
           <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Status</p>
              <p className="text-xs font-bold text-green-400">System Live</p>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[70vh]">
        {/* Chat List */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/[0.06] rounded-[32px] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/[0.06] bg-white/[0.01]">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Filter Conversations..."
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl text-xs outline-none focus:border-indigo-500/30 transition-all uppercase tracking-widest font-bold"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.length === 0 ? (
              <div className="py-20 text-center opacity-20">
                 <MessageSquare className="w-10 h-10 mx-auto mb-4" />
                 <p className="text-[10px] uppercase font-bold tracking-widest">No Active Inbound</p>
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.session_id}
                  onClick={() => setSelectedSessionId(s.session_id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all border ${
                    selectedSessionId === s.session_id 
                      ? "bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-600/20" 
                      : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${selectedSessionId === s.session_id ? "bg-white/20 text-white" : "bg-white/5 text-white/40"}`}>
                        {s.session_id}
                     </span>
                     {!s.is_read && s.sender === 'customer' && (
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                     )}
                  </div>
                  <p className={`text-xs truncate ${selectedSessionId === s.session_id ? "text-white" : "text-white/60"}`}>
                    {s.message}
                  </p>
                  <p className={`text-[8px] mt-2 uppercase font-bold tracking-tighter ${selectedSessionId === s.session_id ? "text-white/40" : "text-white/20"}`}>
                    {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.06] rounded-[32px] overflow-hidden flex flex-col relative">
           {!selectedSessionId ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6 opacity-30">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 italic font-serif text-2xl">?</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-widest">Select a Session</h3>
                  <p className="text-xs max-w-xs mx-auto">Click on an active inbound chat to start providing real-time assistance.</p>
                </div>
             </div>
           ) : (
             <>
               {/* Chat Header */}
               <div className="p-6 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-400" />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white mb-0.5">{selectedSessionId}</h3>
                        <div className="flex items-center gap-1.5 opacity-40">
                           <Clock className="w-3 h-3" />
                           <span className="text-[10px] uppercase font-bold tracking-widest">Active session</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
                        <Mail className="w-4 h-4 text-white/40" />
                     </button>
                     <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
                        <Phone className="w-4 h-4 text-white/40" />
                     </button>
                  </div>
               </div>

               {/* Messages List */}
               <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'admin' ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed ${
                        m.sender === 'admin' 
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10" 
                          : "bg-white/[0.05] text-white/80 border border-white/[0.06] rounded-tl-none"
                      }`}>
                        {m.message}
                        <span className="block text-[9px] opacity-40 mt-2 uppercase font-bold tracking-tighter">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               <div className="p-6 bg-white/[0.01] border-t border-white/[0.06]">
                  <div className="flex gap-4 p-2 bg-[#0a0a0a] rounded-2xl border border-white/5">
                     <input
                       type="text"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && handleSend()}
                       placeholder="Reply to customer..."
                       className="flex-1 bg-transparent px-4 py-3 text-sm outline-none focus:border-indigo-500/30 text-white placeholder:text-white/20 font-medium"
                     />
                     <button
                       onClick={handleSend}
                       disabled={!input.trim() || sending}
                       className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                     >
                       {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                       <span className="text-[10px] uppercase font-bold tracking-widest hidden md:inline">Send Response</span>
                     </button>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
