import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Pusher from 'pusher-js';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hai! Selamat datang di SejatiDimedia. Saya Sedia AI.\n\nSedang merencanakan pembuatan aplikasi web/mobile atau integrasi AI untuk bisnis Anda? Ceritakan ide Anda, atau tanyakan apa saja seputar layanan dan portofolio kami!'
    }
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
  }, [messages, isExpanded]);

  // Handle ESC key to minimize or close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false);
        } else if (isOpen) {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExpanded]);

  // Smart Auto-Open AI Chat (Default: 45 detik)
  useEffect(() => {
    // Check if chat has already been auto-opened or manually closed in this session
    const hasAutoOpened = sessionStorage.getItem('sedia_auto_opened');
    const isDismissed = sessionStorage.getItem('sedia_chat_dismissed');

    if (!hasAutoOpened && !isDismissed) {
      // 45 seconds golden window for high-intent visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('sedia_auto_opened', 'true');
      }, 45000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    sessionStorage.setItem('sedia_auto_opened', 'true');
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
    sessionStorage.setItem('sedia_chat_dismissed', 'true');
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

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
            onClick={handleOpen}
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

      {/* Backdrop for Center Modal Fullscreen Mode */}
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-[105] bg-slate-900/40 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Chat Window (Adaptive: Bottom Floating or Center Expanded Modal) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={isExpanded ? 'chat-expanded' : 'chat-compact'}
            initial={{ opacity: 0, scale: 0.95, y: isExpanded ? 0 : 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isExpanded ? 0 : 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={
              isExpanded
                ? "fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[110] w-auto sm:w-[740px] md:w-[800px] h-[calc(100vh-24px)] sm:h-[82vh] max-h-[820px] flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-900/20 overflow-hidden touch-auto"
                : "fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-24px)] sm:w-[380px] h-[500px] max-h-[80dvh] flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-900/10 overflow-hidden touch-auto"
            }
          >
            {/* Minimal Clean Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              {/* Identity */}
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <img src="/ai-gif2.gif" alt="Sedia AI" className="w-full h-full object-cover scale-110" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-sans font-bold text-slate-900 leading-tight">
                    Sedia AI
                  </h3>
                  <span className="text-[11px] font-sans text-slate-400 mt-0.5 block">
                    {isHandoffMode ? 'Terhubung dengan Tim' : 'Online'}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Handoff / End Handoff Button */}
                {isHandoffMode ? (
                  <button
                    onClick={() => performChat('/end')}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-[10px] font-bold tracking-wide uppercase cursor-pointer border border-red-200"
                  >
                    Akhiri Sesi
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsWaitingForName(true);
                      setMessages(prev => [...prev, { role: 'ai', text: "Baik, saya akan segera memanggilkan tim SejatiDimedia untuk Anda. Sebelumnya, bolehkah saya tahu siapa nama Anda?" }]);
                    }}
                    disabled={isLoading || isWaitingForName}
                    title="Hubungi tim via Telegram"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-blue-50 text-[#2C5098] transition-colors text-[11px] font-bold border border-slate-200/70 hover:border-[#2C5098]/30 cursor-pointer disabled:opacity-50"
                  >
                    <img src="/telegram-icon.svg" alt="Telegram" className="w-3 h-3" />
                    <span>Hubungi Tim</span>
                  </button>
                )}

                {/* Expand / Minimize Toggle Button */}
                <button
                  onClick={toggleExpand}
                  title={isExpanded ? "Kecilkan (ESC)" : "Perbesar Layar"}
                  className="w-7.5 h-7.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  title="Tutup Chat"
                  className="w-7.5 h-7.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area (Smooth scrollable) */}
            <div 
              className={`flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar touch-pan-y ${
                isExpanded ? 'p-6 space-y-4' : 'p-4 space-y-3.5'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 ${isExpanded ? 'w-7.5 h-7.5' : 'w-6.5 h-6.5'} rounded-full overflow-hidden flex items-center justify-center shadow-2xs ${
                    msg.role === 'user' ? 'bg-[#23385B] text-white' : 'bg-[#2C5098]/10 border border-[#2C5098]/20'
                  }`}>
                    {msg.role === 'user' ? <User className={isExpanded ? 'w-4 h-4' : 'w-3.5 h-3.5'} /> : <img src="/ai-gif2.gif" className="w-full h-full object-cover scale-110" />}
                  </div>

                  {/* Bubble */}
                  <div className={`${isExpanded ? 'max-w-[85%] sm:max-w-[80%] px-4.5 py-3 text-[13px]' : 'max-w-[82%] px-3.5 py-2.5 text-xs'} leading-relaxed rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white rounded-br-xs shadow-2xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className={`prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5 text-slate-800 ${
                        isExpanded ? 'text-[13px] leading-relaxed' : 'text-xs'
                      }`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2.5 flex-row">
                  <div className={`shrink-0 ${isExpanded ? 'w-7.5 h-7.5' : 'w-6.5 h-6.5'} rounded-full overflow-hidden flex items-center justify-center shadow-2xs bg-[#2C5098]/10 border border-[#2C5098]/20`}>
                    <img src="/ai-gif2.gif" alt="Sedia AI" className="w-full h-full object-cover scale-110" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 rounded-bl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`border-t border-slate-100 bg-white shrink-0 ${isExpanded ? 'p-4 sm:p-5' : 'p-3'}`}>
              <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  disabled={isLoading}
                  className={`w-full pl-4 pr-11 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2C5098] focus:ring-1 focus:ring-[#2C5098] transition-all disabled:opacity-50 ${
                    isExpanded ? 'py-3 text-sm' : 'py-2.5 text-xs'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-1.5 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer shadow-2xs ${
                    isExpanded ? 'w-9 h-9 right-2' : 'w-7.5 h-7.5'
                  }`}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
