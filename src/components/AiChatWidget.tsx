"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Pusher from 'pusher-js';

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
  const [sessionId, setSessionId] = useState<string>('');
  const [isHandoffMode, setIsHandoffMode] = useState(false);
  const [isWaitingForName, setIsWaitingForName] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Session ID and Pusher
  useEffect(() => {
    // Get or create session ID
    let currentSessionId = localStorage.getItem('sedia_session_id');
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem('sedia_session_id', currentSessionId);
    }
    setSessionId(currentSessionId);

    // Initialize Pusher Client
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (pusherKey && pusherCluster) {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });

      const channel = pusher.subscribe(`session-${currentSessionId}`);
      channel.bind('owner_reply', (data: { text: string }) => {
        setMessages(prev => [...prev, { role: 'ai', text: `**👨‍💼 Tim SejatiDimedia:**\n\n${data.text}` }]);
        setIsHandoffMode(true); // Since owner replied, we must be in handoff
      });

      return () => {
        pusher.unsubscribe(`session-${currentSessionId}`);
        pusher.disconnect();
      };
    }
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');

    if (isWaitingForName) {
      setIsWaitingForName(false);
      await performChat(userMessage, `/chatowner ${userMessage}`);
    } else {
      await performChat(userMessage);
    }
  };

  const performChat = async (displayMessage: string, hiddenPayload?: string) => {
    if (isLoading) return;

    // Only display user message if it's not a system command
    if (!displayMessage.startsWith('/')) {
      setMessages(prev => [...prev, { role: 'user', text: displayMessage }]);
    }

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
          message: hiddenPayload || displayMessage,
          history: historyForApi,
          session_id: sessionId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memuat balasan.');
      }

      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);

      // Update handoff state from server response
      if (data.isHandoff !== undefined) {
        setIsHandoffMode(data.isHandoff);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Error: ${error.message}` }]);
      if (!displayMessage.startsWith('/')) {
        setInput(displayMessage); // Restore input so user doesn't have to retype
      }
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
            className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-[100] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white shadow-lg shadow-[#2C5098]/30 flex items-center justify-center cursor-pointer transition-all border border-white/20 group p-0 overflow-hidden"
            aria-label="Buka Chat AI"
          >
            <img
              src="/ai-gif2.gif"
              alt="Chat with us"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Subtle ping animation behind button */}
            <span className="absolute inset-0 rounded-full bg-[#2C5098] animate-ping opacity-25 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-24px)] sm:w-[340px] md:w-[350px] h-[420px] sm:h-[450px] max-h-[75vh] flex flex-col rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2C5098]/10 border border-[#2C5098]/20 flex items-center justify-center overflow-hidden">
                  <img src="/ai-gif2.gif" alt="CS Avatar" className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <h3 className="text-xs font-sans font-bold text-slate-900 leading-tight">Sedia AI</h3>
                  <p className="text-[9px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (isHandoffMode) {
                      performChat('/end');
                    } else {
                      setIsWaitingForName(true);
                      setMessages(prev => [...prev, { role: 'ai', text: "Baik, saya akan segera memanggilkan tim SejatiDimedia untuk Anda. Sebelumnya, bolehkah saya tahu siapa nama Anda?" }]);
                    }
                  }}
                  disabled={isLoading || isWaitingForName}
                  className={
                    isHandoffMode
                      ? "px-2.5 py-1 rounded-full bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-colors text-[9px] font-bold tracking-wide uppercase disabled:opacity-50 cursor-pointer border border-red-500/20 flex items-center gap-1"
                      : "px-2.5 py-1 rounded-full bg-[#2C5098]/10 hover:bg-[#2C5098] text-[#2C5098] hover:text-white transition-colors text-[9px] font-bold tracking-wide uppercase disabled:opacity-50 cursor-pointer border border-[#2C5098]/20 flex items-center gap-1"
                  }
                >
                  {!isHandoffMode && (
                    <img src="/telegram-icon.svg" alt="Telegram" className="w-3 h-3" />
                  )}
                  {isHandoffMode ? "Akhiri Sesi" : "Hubungi Tim"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shadow-xs ${msg.role === 'user' ? 'bg-[#23385B] text-white' : 'bg-[#2C5098]/10 border border-[#2C5098]/20'}`}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <img src="/ai-gif2.gif" className="w-full h-full object-cover scale-110" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] px-3 py-2 rounded-xl text-[11.5px] leading-relaxed ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-bl-xs'
                    }`}>
                    {msg.role === 'user' ? (
                      <p>{msg.text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-0.5 prose-ul:my-0.5 prose-ul:pl-3.5 prose-li:my-0 text-[11.5px] text-slate-800">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-1.5 flex-row">
                  <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-xs bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white">
                    <SediaIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 rounded-bl-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-200/80">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  disabled={isLoading}
                  className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2C5098] focus:ring-1 focus:ring-[#2C5098] transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer shadow-xs"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
