"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Loader2, Sparkles } from "lucide-react";
import { supabase, getChatMessages, sendChatMessage } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  message: string;
  sender: 'customer' | 'admin';
  created_at: string;
}

export default function SupportChat({ siteId, orderId }: { siteId: string, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Get/Set Session ID
    let sid = localStorage.getItem("lux_chat_session");
    if (!sid) {
      sid = `cust_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem("lux_chat_session", sid);
    }
    setSessionId(sid);

    // 2. Initial Fetch
    getChatMessages(sid).then(setMessages).finally(() => setLoading(false));

    // 3. Real-time Subscription
    const channel = supabase
      .channel(`chat_${sid}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_chats', filter: `session_id=eq.${sid}` },
        (payload: any) => {
          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as ChatMessage];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || sending) return;
    setSending(true);
    try {
      await sendChatMessage(siteId, sessionId, input, 'customer', orderId);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl z-[100] border border-indigo-400/20 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20 pointer-events-none" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[360px] max-h-[520px] bg-[#0c0d12] border border-white/10 rounded-3xl shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-indigo-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                   <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Direct Support</h4>
                  <div className="flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                     <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">We're Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 py-10 opacity-30">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Establishing Secure Channel...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                   <div className="p-4 bg-white/[0.03] rounded-3xl inline-block border border-white/5">
                      <User className="w-6 h-6 text-white/20" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-white/50 font-medium">Hello! How can we assist you with order <span className="text-indigo-400">{orderId?.slice(-6) || "tracking"}</span> today?</p>
                   </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'customer' ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'customer' 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-white/[0.05] text-white/80 border border-white/[0.06] rounded-tl-none"
                    }`}>
                      {m.message}
                      <span className="block text-[8px] opacity-40 mt-1 uppercase font-bold tracking-tighter">
                         {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message Support..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500/50 text-white placeholder:text-white/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-lg"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
