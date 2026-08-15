"use client";

import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Home, Layers, GitMerge, FolderOpen, MessageCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AiChatWidget from "./AiChatWidget";
import AuroraBackground from "./ui/aurora-background";
import { ThemeMode } from "../types";
import { useLanguage, Language } from "@/lib/i18n/LanguageContext";
import { TemplateId, getActiveTemplate } from "@/lib/templates";
import { Icon } from "@iconify/react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sejatidimedia-theme");
      return (saved as ThemeMode) || "dark";
    }
    return "dark";
  });

  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  // Template state synchronization
  useEffect(() => {
    setTemplate(getActiveTemplate());

    const handleTemplateChange = (e: CustomEvent<TemplateId>) => {
      const newTmpl = e.detail;
      setTemplate(newTmpl);
      if (newTmpl === 'professional') {
        setTheme('light');
      }
    };

    window.addEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    return () => {
      window.removeEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 1400); // Extended to allow the text animation to play out
          return 100;
        }
        return prev + 2;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current route is an admin, portal, or auth route (standalone full-page layout)
  const isStandalonePage =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/portal') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/design-system');

  // Synchronize theme class with document element
  useEffect(() => {
    if (isStandalonePage) return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // If template is professional, force light theme
    const activeTheme = template === 'professional' ? 'light' : theme;
    root.classList.add(activeTheme);
    if (template === 'classic') {
      localStorage.setItem("sejatidimedia-theme", activeTheme);
    }
  }, [theme, template, isStandalonePage]);

  if (isStandalonePage) {
    return <div className="min-h-screen bg-[#f0f4f8] text-slate-900 antialiased font-sans">{children}</div>;
  }

  const handleThemeToggle = (newTheme: ThemeMode, event?: React.MouseEvent) => {
    // If the browser doesn't support view transitions, just set the theme instantly
    if (!document.startViewTransition || !event) {
      setTheme(newTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    // Calculate distance to furthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 700,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const handleNavClick = (sectionId: string) => {
    if (pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <>
      {/* 0. Premium Minimalist Loading Screen Overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-theme-deep text-theme-fore transition-colors duration-300"
          >
            <div className="absolute w-[400px] h-[400px] rounded-full bg-theme-accent/5 blur-[100px] pointer-events-none transition-colors duration-300" />

            {/* Premium Minimalist Logo Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="z-10 flex flex-col items-center gap-8"
            >
              <Image
                src="/logo.svg"
                alt="SEJATIDIMEDIA Logo"
                width={140}
                height={70}
                priority
                className="h-12 w-auto object-contain drop-shadow-xl"
              />

              <div className="relative flex flex-col items-center">
                {/* Ultra-thin elegant progress line */}
                <div className="w-32 h-[1px] bg-theme-border/50 overflow-hidden rounded-full relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-theme-accent shadow-[0_0_8px_rgba(74,133,217,0.8)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>

                {/* Animated Brand Title at the end of loading */}
                <div className="absolute top-full mt-6 flex items-center justify-center w-64">
                  {progress >= 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="font-sora font-extrabold text-[11px] tracking-[0.3em] text-theme-fore uppercase">
                        SejatiDimedia
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer Shell: Aurora for Classic Template, Clean Portal Slate Background for Professional Template */}
      {template === 'classic' ? (
        <AuroraBackground
          className="min-h-screen relative w-full flex flex-col font-sans overflow-x-clip bg-theme-deep text-theme-fore"
          gradientColors={
            theme === 'dark'
              ? ["rgba(74, 133, 217, 0.15)", "rgba(106, 160, 242, 0.15)"]
              : ["rgba(43, 84, 149, 0.12)", "rgba(30, 49, 91, 0.12)"]
          }
        >
          {/* 2. Main Portal Application Header */}
          <header
            className={`fixed top-0 left-0 right-0 z-50 w-full flex flex-col transition-all duration-300 ease-[0.16,1,0.3,1] ${scrolled
              ? "bg-theme-base/80 backdrop-blur-xl border-b border-theme-border/80 shadow-lg shadow-black/5"
              : "bg-transparent border-b border-transparent"
              }`}
          >
            {/* Top Info Announcement Bar */}
            <div className={`w-full bg-theme-accent flex items-center justify-center transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
              <div className="flex items-center gap-2 text-theme-base text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase">
                <Icon icon="ph:sparkle-fill" className="w-3 h-3 text-amber-300 shrink-0" />
                <span>{language === 'id' ? 'Tersedia Sesi Konsultasi Gratis Terbatas' : 'Limited Free Consultation Available'}</span>
                <span className="mx-1 opacity-50 hidden sm:inline">|</span>
                <button onClick={() => handleNavClick('contact-section')} className="underline underline-offset-2 hover:text-theme-base/80 transition-colors cursor-pointer hidden sm:inline">
                  {language === 'id' ? 'Pesan Sekarang' : 'Book Now'}
                </button>
              </div>
            </div>

            <div className={`max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
              {/* Logo / Brand Name */}
              <div
                className="flex items-center gap-2 cursor-pointer select-none shrink-0"
                onClick={() => handleNavClick("home")}
                id="logo-header-trigger"
              >
                <div className="h-5 sm:h-5.5 w-auto hover:scale-105 transition-transform duration-200 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.svg"
                    alt="SejatiDimedia Logo"
                    width={40}
                    height={14}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <span
                  className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight uppercase whitespace-nowrap shrink-0"
                >
                  <span className="font-sora" style={{ color: '#2E54A2' }}>Sejati</span> <span className="font-sora" style={{ color: '#23385B' }}>Dimedia</span>
                </span>
              </div>

              {/* Capsule Center Navigation */}
              <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-theme-surface/80 border border-theme-border/60">
                <button
                  onClick={() => handleNavClick("home")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${pathname === "/"
                    ? "text-theme-fore bg-theme-surface"
                    : "text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface"
                    }`}
                >
                  {t.nav.home}
                </button>
                <button
                  onClick={() => handleNavClick("capabilities-section")}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
                >
                  {t.nav.services}
                </button>
                <button
                  onClick={() => handleNavClick("methodology-section")}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
                >
                  {t.nav.workflow}
                </button>
                <button
                  onClick={() => router.push("/projects")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${pathname.startsWith("/projects")
                    ? "text-theme-fore bg-theme-surface"
                    : "text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface"
                    }`}
                >
                  {t.nav.portfolio}
                </button>
                <button
                  onClick={() => handleNavClick("contact-section")}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
                >
                  {t.nav.contact}
                </button>
              </nav>

              {/* Right Action: Theme Toggle & Premium Lang Toggle */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Premium Segmented Language Toggle (Flags) */}
                <div className="flex items-center relative bg-theme-surface border border-theme-border/60 rounded-full p-1 shadow-inner h-[36px]">
                  <div
                    className={`absolute top-1 bottom-1 w-[32px] bg-theme-accent/20 border border-theme-accent/50 rounded-full transition-all duration-400 ease-[0.16,1,0.3,1] shadow-sm ${language === 'id' ? 'left-1' : 'left-[37px]'}`}
                  />
                  <button
                    onClick={() => setLanguage('id')}
                    className="relative z-10 w-[32px] h-[28px] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 group"
                    title="Bahasa Indonesia"
                  >
                    <img src="/flags/id.svg" alt="ID" className={`w-5 h-5 rounded-full object-cover shadow-sm border border-theme-border transition-all duration-300 ${language === 'id' ? 'opacity-100 scale-100' : 'opacity-40 grayscale-[50%] group-hover:opacity-100 group-hover:grayscale-0'}`} />
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className="relative z-10 w-[32px] h-[28px] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 group"
                    title="English"
                  >
                    <img src="/flags/gb.svg" alt="EN" className={`w-5 h-5 rounded-full object-cover shadow-sm border border-theme-border transition-all duration-300 ${language === 'en' ? 'opacity-100 scale-100' : 'opacity-40 grayscale-[50%] group-hover:opacity-100 group-hover:grayscale-0'}`} />
                  </button>
                </div>

                {/* Theme Toggle Component */}
                <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
              </div>
            </div>
          </header>

          {/* 3. Core Body Content Shell */}
          <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-6 pt-28 pb-10">
            {children}
          </main>

          {/* 4. High-Fidelity Premium Footer */}
          <footer className="relative z-10 w-full bg-theme-base/30 backdrop-blur-2xl border-t border-theme-border/60 pt-16 pb-28 md:pb-12">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-7 space-y-6 text-left">
                  <div className="h-7 w-auto flex items-center justify-start">
                    <Image
                      src="/logo.svg"
                      alt="SejatiDimedia Logo"
                      width={56}
                      height={28}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-sans font-medium sm:font-semibold tracking-tight text-theme-fore max-w-lg leading-snug">
                    {t.footer.tagline}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-theme-fore-muted">
                    <a
                      href="mailto:sejatidimedia@gmail.com"
                      className="hover:text-theme-accent transition-colors duration-200 underline underline-offset-4"
                    >
                      sejatidimedia@gmail.com
                    </a>
                    <span className="text-theme-border/60">•</span>
                    <span>+62 895 0843 6275</span>
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-4">
                  <div className="space-y-3.5 text-left">
                    <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block font-bold">
                      {t.footer.contact}
                    </span>
                    <ul className="space-y-2.5 text-xs font-sans font-semibold text-theme-fore-muted">
                      <li>
                        <button
                          onClick={() => handleNavClick("capabilities-section")}
                          className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.services}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("technology-section")}
                          className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.tech}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("projects-section")}
                          className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.portfolio}
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3.5 text-left">
                    <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block font-bold">
                      {t.footer.connect}
                    </span>
                    <ul className="space-y-2.5 text-xs font-sans font-semibold text-theme-fore-muted">
                      <li>
                        <button
                          onClick={() => handleNavClick("methodology-section")}
                          className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.workflow}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("features-section")}
                          className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.advantages}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("contact-section")}
                          className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left font-bold text-theme-fore"
                        >
                          {t.nav.contact}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative py-6 select-none border-t border-b border-theme-border/20 overflow-hidden flex items-center justify-center">
                <h2 className="text-[9vw] sm:text-[10vw] md:text-[10.5vw] lg:text-[105px] xl:text-[115px] font-sora font-bold tracking-tighter uppercase leading-none text-center select-none w-full transition-all duration-300 opacity-90 dark:opacity-85 py-3 px-6 whitespace-nowrap">
                  <span className="bg-gradient-to-b from-[#2E54A2] via-[#2E54A2]/80 to-transparent bg-clip-text text-transparent">SEJATI</span>
                  <span className="bg-gradient-to-b from-[#23385B] via-[#23385B]/80 to-transparent bg-clip-text text-transparent">DIMEDIA</span>
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-[10px] font-mono tracking-wider text-theme-fore-subtle uppercase">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5">
                  <span>© {new Date().getFullYear()} SEJATIDIMEDIA. {t.footer.rights}</span>
                  <span className="text-theme-border/60">•</span>
                  <button className="hover:text-theme-fore transition-colors cursor-pointer">
                    {t.legal.privacy}
                  </button>
                  <span className="text-theme-border/60">•</span>
                  <button className="hover:text-theme-fore transition-colors cursor-pointer">
                    {t.legal.terms}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <a href="#instagram" className="hover:text-theme-fore transition-colors">
                    INSTAGRAM
                  </a>
                  <span className="text-theme-border/40">•</span>
                  <a href="#linkedin" className="hover:text-theme-fore transition-colors">
                    LINKEDIN
                  </a>
                  <span className="text-theme-border/40">•</span>
                  <a href="#twitter" className="hover:text-theme-fore transition-colors">
                    X(TWITTER)
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {/* 5. Mobile Bottom Navigation Bar */}
          <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-theme-surface/80 backdrop-blur-xl border border-theme-border/60 shadow-2xl rounded-2xl p-1.5 flex items-center justify-between">
              <button
                onClick={() => handleNavClick("home")}
                className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all duration-300 ${pathname === "/" ? "text-theme-accent bg-theme-accent/10" : "text-theme-fore-muted hover:text-theme-fore"}`}
              >
                <Home className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.home}</span>
              </button>
              <button
                onClick={() => handleNavClick("capabilities-section")}
                className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-theme-fore-muted hover:text-theme-fore transition-all duration-300"
              >
                <Layers className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.services}</span>
              </button>
              <button
                onClick={() => handleNavClick("methodology-section")}
                className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-theme-fore-muted hover:text-theme-fore transition-all duration-300"
              >
                <GitMerge className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.workflow}</span>
              </button>
              <button
                onClick={() => router.push("/projects")}
                className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all duration-300 ${pathname.startsWith("/projects") ? "text-theme-accent bg-theme-accent/10" : "text-theme-fore-muted hover:text-theme-fore"}`}
              >
                <FolderOpen className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.portfolio}</span>
              </button>
              <button
                onClick={() => handleNavClick("contact-section")}
                className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-theme-fore-muted hover:text-theme-fore transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.contact}</span>
              </button>
            </div>
          </nav>

          <AiChatWidget />
        </AuroraBackground>
      ) : (
        /* PROFESSIONAL V2: Clean Light Workspace Container (No Aurora) */
        <div className="min-h-screen relative w-full flex flex-col font-sans overflow-x-clip bg-[#f0f4f8] text-slate-900">
          {/* Header for V2 (Fullwidth at Top, Floating Island when Scrolled) */}
          <header
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 flex flex-col items-center ${scrolled ? 'pt-2 sm:pt-3 pointer-events-none' : 'pt-0 pointer-events-auto'
              }`}
          >
            {/* Top Announcement Bar: Fullwidth at Top, Smoothly Collapses on Scroll */}
            <div
              className={`w-full bg-[#1E315B] text-white transition-all duration-300 ease-out overflow-hidden ${scrolled ? 'max-h-0 opacity-0 py-0 shadow-none' : 'max-h-12 opacity-100 py-2 sm:py-2.5 px-4 shadow-2xs'
                }`}
            >
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase">
                <Icon icon="ph:sparkle-fill" className="w-3 h-3 text-amber-300 shrink-0" />
                <span>{language === 'id' ? 'Tersedia Sesi Konsultasi Gratis' : 'Limited Free Consultation Available'}</span>
                <span className="opacity-40 hidden sm:inline">•</span>
                <button
                  onClick={() => handleNavClick('contact-section')}
                  className="underline underline-offset-2 hover:text-blue-200 transition-colors cursor-pointer hidden sm:inline"
                >
                  {language === 'id' ? 'Pesan Sekarang' : 'Book Now'}
                </button>
              </div>
            </div>

            {/* Navbar Wrapper: Fullwidth at Top, Floating Capsule when Scrolled */}
            <div
              className={`w-full transition-all duration-300 ease-out flex items-center justify-center border-t-0 border-l-0 border-r-0 ${scrolled
                ? 'px-3 sm:px-4 bg-transparent border-b border-transparent shadow-none'
                : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs'
                }`}
            >
              <div
                className={`pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between gap-2 sm:gap-4 border ${scrolled
                  ? 'w-[95%] sm:w-[92%] max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-2xl border-slate-200 shadow-md shadow-slate-900/5'
                  : 'w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-none bg-transparent border-transparent shadow-none'
                  }`}
              >
                {/* Brand Logo */}
                <div
                  className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none shrink-0 min-w-0"
                  onClick={() => handleNavClick("home")}
                  id="logo-header-trigger"
                >
                  <div className="h-4.5 sm:h-5.5 w-auto hover:scale-105 transition-transform duration-200 flex items-center justify-center shrink-0">
                    <Image
                      src="/logo.svg"
                      alt="SejatiDimedia Logo"
                      width={38}
                      height={14}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <span className="font-bold text-slate-900 text-[11px] sm:text-sm tracking-tight uppercase whitespace-nowrap shrink-0">
                    <span className="font-sora" style={{ color: '#2E54A2' }}>Sejati</span>{' '}
                    <span className="font-sora" style={{ color: '#23385B' }}>Dimedia</span>
                  </span>
                </div>

                {/* Center Navigation Links */}
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => handleNavClick("home")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${pathname === "/"
                      ? "text-blue-600 bg-blue-50/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                  >
                    {t.nav.home}
                  </button>
                  <button
                    onClick={() => handleNavClick("capabilities-section")}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 cursor-pointer transition-all duration-200"
                  >
                    {t.nav.services}
                  </button>
                  <button
                    onClick={() => handleNavClick("methodology-section")}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 cursor-pointer transition-all duration-200"
                  >
                    {t.nav.workflow}
                  </button>
                  <button
                    onClick={() => router.push("/projects")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${pathname.startsWith("/projects")
                      ? "text-blue-600 bg-blue-50/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                  >
                    {t.nav.portfolio}
                  </button>
                  <button
                    onClick={() => handleNavClick("faq-section")}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 cursor-pointer transition-all duration-200"
                  >
                    FAQ
                  </button>
                </nav>

                {/* Right Side: Language Switcher & Quick CTA */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  {/* Language Switcher */}
                  <div className="flex items-center relative bg-slate-100/90 border border-slate-200 rounded-full p-0.5 shadow-inner h-[28px] sm:h-[32px] shrink-0">
                    <div
                      className={`absolute top-0.5 bottom-0.5 w-[22px] sm:w-[28px] bg-white border border-slate-200 rounded-full transition-all duration-300 ease-[0.16,1,0.3,1] shadow-xs ${language === 'id' ? 'left-0.5' : 'left-[24px] sm:left-[31px]'
                        }`}
                    />
                    <button
                      onClick={() => setLanguage('id')}
                      className="relative z-10 w-[22px] sm:w-[28px] h-[20px] sm:h-[24px] flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
                      title="Bahasa Indonesia"
                    >
                      <img
                        src="/flags/id.svg"
                        alt="ID"
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover shadow-xs border border-slate-200 transition-all ${language === 'id' ? 'opacity-100' : 'opacity-40 grayscale-[50%]'
                          }`}
                      />
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className="relative z-10 w-[22px] sm:w-[28px] h-[20px] sm:h-[24px] flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
                      title="English"
                    >
                      <img
                        src="/flags/gb.svg"
                        alt="EN"
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover shadow-xs border border-slate-200 transition-all ${language === 'en' ? 'opacity-100' : 'opacity-40 grayscale-[50%]'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Navbar CTA Button */}
                  <button
                    onClick={() => handleNavClick("contact-section")}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/20 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0"
                  >
                    <span>{language === 'en' ? 'Consult' : 'Konsul'}</span>
                    <span className="hidden xs:inline">{language === 'en' ? 'ation' : 'tasi'}</span>
                    <Icon icon="ph:arrow-up-right-bold" className="w-3 h-3 hidden sm:inline" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Core Body Content */}
          <main className={`relative z-10 flex-grow w-full ${pathname === "/" ? "pt-16 sm:pt-20 pb-0" : "max-w-7xl mx-auto px-6 pt-28 sm:pt-32 pb-12"}`}>
            {children}
          </main>

          {/* Clean Portal Footer */}
          <footer className="relative z-10 w-full bg-[#F8FAFC] border-t border-slate-200/80 pt-16 pb-28 md:pb-12 text-slate-800">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-7 space-y-6 text-left">
                  <div className="h-7 w-auto flex items-center justify-start">
                    <Image
                      src="/logo.svg"
                      alt="SejatiDimedia Logo"
                      width={56}
                      height={28}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-sans font-medium sm:font-semibold tracking-tight text-slate-800 max-w-lg leading-snug">
                    {t.footer.tagline}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-500">
                    <a
                      href="mailto:sejatidimedia@gmail.com"
                      className="hover:text-blue-600 transition-colors duration-200 underline underline-offset-4"
                    >
                      sejatidimedia@gmail.com
                    </a>
                    <span className="text-slate-300">•</span>
                    <span>+62 895 0843 6275</span>
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-4">
                  <div className="space-y-3.5 text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      {t.footer.contact}
                    </span>
                    <ul className="space-y-2.5 text-xs font-sans font-semibold text-slate-600">
                      <li>
                        <button
                          onClick={() => handleNavClick("capabilities-section")}
                          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.services}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("technology-section")}
                          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.tech}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("projects-section")}
                          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.portfolio}
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3.5 text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      {t.footer.connect}
                    </span>
                    <ul className="space-y-2.5 text-xs font-sans font-semibold text-slate-600">
                      <li>
                        <button
                          onClick={() => handleNavClick("methodology-section")}
                          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.workflow}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("features-section")}
                          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-left"
                        >
                          {t.nav.advantages}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick("contact-section")}
                          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-left font-bold text-slate-900"
                        >
                          {t.nav.contact}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative py-6 select-none border-t border-b border-slate-200/80 overflow-hidden flex items-center justify-center">
                <h2 className="text-[9vw] sm:text-[10vw] md:text-[10.5vw] lg:text-[105px] xl:text-[115px] font-sans font-bold tracking-tighter uppercase leading-none text-center select-none w-full transition-all duration-300 py-3 px-6 whitespace-nowrap">
                  <span className="bg-gradient-to-b from-[#2E54A2] via-[#2E54A2]/80 to-transparent bg-clip-text text-transparent">SEJATI</span>
                  <span className="bg-gradient-to-b from-[#23385B] via-[#23385B]/80 to-transparent bg-clip-text text-transparent">DIMEDIA</span>
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5">
                  <span>© {new Date().getFullYear()} SEJATIDIMEDIA. {t.footer.rights}</span>
                  <span className="text-slate-300">•</span>
                  <button className="hover:text-slate-900 transition-colors cursor-pointer">
                    {t.legal.privacy}
                  </button>
                  <span className="text-slate-300">•</span>
                  <button className="hover:text-slate-900 transition-colors cursor-pointer">
                    {t.legal.terms}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <a href="#instagram" className="hover:text-slate-900 transition-colors">
                    INSTAGRAM
                  </a>
                  <span className="text-slate-300">•</span>
                  <a href="#linkedin" className="hover:text-slate-900 transition-colors">
                    LINKEDIN
                  </a>
                  <span className="text-slate-300">•</span>
                  <a href="#twitter" className="hover:text-slate-900 transition-colors">
                    X(TWITTER)
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation Bar for V2 */}
          <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-1.5 flex items-center justify-between">
              <button
                onClick={() => handleNavClick("home")}
                className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all duration-300 ${pathname === "/" ? "text-blue-700 bg-blue-50 font-bold" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Home className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.home}</span>
              </button>
              <button
                onClick={() => handleNavClick("capabilities-section")}
                className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-slate-600 hover:text-slate-900 transition-all duration-300"
              >
                <Layers className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.services}</span>
              </button>
              <button
                onClick={() => handleNavClick("methodology-section")}
                className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-slate-600 hover:text-slate-900 transition-all duration-300"
              >
                <GitMerge className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.workflow}</span>
              </button>
              <button
                onClick={() => router.push("/projects")}
                className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all duration-300 ${pathname.startsWith("/projects") ? "text-blue-700 bg-blue-50 font-bold" : "text-slate-600 hover:text-slate-900"}`}
              >
                <FolderOpen className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.portfolio}</span>
              </button>
              <button
                onClick={() => handleNavClick("contact-section")}
                className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-slate-600 hover:text-slate-900 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold tracking-wider leading-none">{t.nav.contact}</span>
              </button>
            </div>
          </nav>

          <AiChatWidget />
        </div>
      )}
    </>
  );
}
