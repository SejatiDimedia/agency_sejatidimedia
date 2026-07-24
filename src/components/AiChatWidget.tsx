"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Custom Sedia AI Icon based on user's new SVG/image
const SediaIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head, Antenna, and Cutout Eyes */}
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M11 3V1.5a1.5 1.5 0 0 1 3 0V3h1.5A3.5 3.5 0 0 1 19 6.5v4A3.5 3.5 0 0 1 15.5 14H8.5A3.5 3.5 0 0 1 5 10.5v-4A3.5 3.5 0 0 1 8.5 3H11zM9 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" 
    />
    
    {/* Bottom Body */}
    <path d="M4 17.5C4 16.12 5.12 15 6.5 15h11c1.38 0 2.5 1.12 2.5 2.5 0 3.5-3.5 5.5-8 5.5s-8-2-8-5.5z" />
  </svg>
);

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Halo! Saya Sedia AI, asisten virtual dari SejatiDimedia. Ada yang bisa saya bantu terkait layanan, harga, atau portofolio kami?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Format history (excluding the very first greeting and current message)
      const historyForApi = messages.slice(1).map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        text: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyForApi
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memuat balasan.');
      }

      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Error: ${error.message}` }]);
      setInput(userMessage); // Restore input so user doesn't have to retype
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[100] w-14 h-14 rounded-full bg-theme-accent hover:bg-theme-accent-bright text-white shadow-lg shadow-theme-accent/20 flex items-center justify-center cursor-pointer transition-colors border border-white/10 group"
          >
            <SediaIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Ping animation behind button */}
            <span className="absolute inset-0 rounded-full bg-theme-accent animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[100] w-[calc(100vw-32px)] md:w-[380px] h-[500px] max-h-[80vh] flex flex-col rounded-3xl bg-theme-surface/80 backdrop-blur-xl border border-theme-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-theme-border bg-theme-elevated/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center">
                  <SediaIcon className="w-5 h-5 text-theme-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-sans font-bold text-theme-fore leading-tight">Sedia AI</h3>
                  <p className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-theme-elevated hover:bg-theme-border/50 flex items-center justify-center text-theme-fore-muted hover:text-theme-fore transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-theme-fore text-theme-base' : 'bg-theme-accent text-white'}`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <SediaIcon className="w-4 h-4" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-theme-fore text-theme-base rounded-br-sm' 
                      : 'bg-theme-elevated border border-theme-border text-theme-fore rounded-bl-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p>{msg.text}</p>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0 text-xs">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2 flex-row">
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm bg-theme-accent text-white">
                    <SediaIcon className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-theme-elevated border border-theme-border rounded-bl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-fore-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-fore-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-fore-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-theme-elevated/50 border-t border-theme-border">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  disabled={isLoading}
                  className="w-full pl-4 pr-12 py-3 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-fore placeholder-theme-fore-muted focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-theme-accent hover:bg-theme-accent-bright text-white disabled:bg-theme-border disabled:text-theme-fore-muted transition-colors cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
