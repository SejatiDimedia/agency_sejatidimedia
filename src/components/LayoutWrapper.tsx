"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { ThemeMode } from "../types";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 200);
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

  // Synchronize theme class with document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("sejatidimedia-theme", theme);
  }, [theme]);

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
            <div className="absolute w-[300px] h-[300px] rounded-full bg-theme-accent/5 blur-[80px] pointer-events-none transition-colors duration-300" />

            {/* Central Circle Progress & Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="z-10 flex flex-col items-center gap-6"
            >
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 144 144">
                  <defs>
                    <linearGradient id="circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2E54A2" />
                      <stop offset="50%" stopColor="#4A85D9" />
                      <stop offset="100%" stopColor="#6AA0F2" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="var(--border-default)"
                    strokeWidth="1.5"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="url(#circle-grad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={376.99}
                    animate={{ strokeDashoffset: 376.99 - (progress / 100) * 376.99 }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </svg>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute flex items-center justify-center w-20 h-10"
                >
                  <Image
                    src="/logo.svg"
                    alt="SEJATIDIMEDIA Logo"
                    width={80}
                    height={40}
                    priority
                    className="h-10 w-auto object-contain"
                  />
                </motion.div>
              </div>

              <span className="font-mono text-xs text-theme-accent/80 tracking-widest transition-colors duration-300">
                {progress}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen relative w-full flex flex-col font-sans overflow-x-clip bg-theme-deep text-theme-fore transition-colors duration-300">
        {/* 1. Multi-Layer Background System */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {theme === "dark" ? (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#090912_0%,#050506_60%,#010103_100%)]" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#FFFFFF_0%,#FAF9FC_60%,#F3F2F6_100%)]" />
          )}

          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="dark-blobs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <div className="absolute -top-[20%] left-[25%] w-[800px] h-[800px] rounded-full bg-[#4A85D9]/10 blur-[150px] animate-float-slow pointer-events-none" />
                <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#1E315B]/5 blur-[120px] animate-float-slower pointer-events-none" />
              </motion.div>
            ) : (
              <motion.div
                key="light-blobs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <div className="absolute -top-[15%] left-[20%] w-[1000px] h-[1000px] rounded-full bg-[#2B5495]/3 blur-[140px] animate-float-slow pointer-events-none" />
                <div className="absolute top-[35%] right-[5%] w-[800px] h-[800px] rounded-full bg-[#F59E0B]/2 blur-[150px] animate-float-slower pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)"
                  : "linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              opacity: theme === "dark" ? 0.015 : 0.008,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* 2. Main Portal Application Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-[0.16,1,0.3,1] ${
            scrolled
              ? "bg-theme-base/80 backdrop-blur-xl border-b border-theme-border/80 shadow-lg shadow-black/5 py-3"
              : "bg-transparent border-b border-transparent py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300">
            {/* Logo / Brand Name */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => handleNavClick("home")}
              id="logo-header-trigger"
            >
              <div className="h-7 w-auto hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="SejatiDimedia Logo"
                  width={56}
                  height={28}
                  className="h-full w-auto object-contain"
                />
              </div>
              <span className="font-display font-bold text-base tracking-wider text-theme-accent">
                SEJATIDI<span className="text-theme-accent/80 font-normal">MEDIA</span>
              </span>
            </div>

            {/* Capsule Center Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-theme-surface/80 border border-theme-border/60">
              <button
                onClick={() => handleNavClick("home")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  pathname === "/"
                    ? "text-theme-fore bg-theme-surface"
                    : "text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface"
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => handleNavClick("capabilities-section")}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
              >
                Layanan
              </button>
              <button
                onClick={() => handleNavClick("methodology-section")}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
              >
                Proses Kerja
              </button>
              <button
                onClick={() => router.push("/projects")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  pathname.startsWith("/projects")
                    ? "text-theme-fore bg-theme-surface"
                    : "text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface"
                }`}
              >
                Portofolio
              </button>
              <button
                onClick={() => handleNavClick("contact-section")}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
              >
                Kontak
              </button>
            </nav>

            {/* Right Action: Theme Toggle & CTA */}
            <div className="flex items-center gap-3">
              <ThemeToggle theme={theme} onToggle={setTheme} />
              <button
                onClick={() => handleNavClick("contact-section")}
                className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white transition-all duration-200 cursor-pointer shadow-md shadow-theme-accent/10 hover:scale-[1.02]"
              >
                Mulai Proyek
              </button>
            </div>
          </div>
        </header>

        {/* 3. Core Body Content Shell */}
        <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-6 pt-28 pb-10">
          {children}
        </main>

        {/* 4. High-Fidelity Premium Footer */}
        <footer className="relative z-10 w-full bg-theme-base border-t border-theme-border/60 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              {/* Left Block: Tagline and Contact */}
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
                <h3 className="text-xl sm:text-2xl font-sans font-extrabold tracking-tight text-theme-fore max-w-lg leading-snug">
                  Partner teknis untuk bisnis yang ingin sistem digitalnya dibangun dengan benar — sejak awal.
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

              {/* Right Block: Sitemap Link List */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="space-y-3.5 text-left">
                  <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block font-bold">
                    Navigasi
                  </span>
                  <ul className="space-y-2.5 text-xs font-sans font-semibold text-theme-fore-muted">
                    <li>
                      <button
                        onClick={() => handleNavClick("capabilities-section")}
                        className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                      >
                        Layanan
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick("technology-section")}
                        className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                      >
                        Teknologi
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick("projects-section")}
                        className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                      >
                        Portofolio
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3.5 text-left">
                  <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block font-bold">
                    Proses & Kontak
                  </span>
                  <ul className="space-y-2.5 text-xs font-sans font-semibold text-theme-fore-muted">
                    <li>
                      <button
                        onClick={() => handleNavClick("methodology-section")}
                        className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                      >
                        Proses Kerja
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick("features-section")}
                        className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                      >
                        Keunggulan
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick("contact-section")}
                        className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left font-bold text-theme-fore"
                      >
                        Mulai Konsultasi
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Middle Row: Massive Wordmark */}
            <div className="relative py-6 select-none border-t border-b border-theme-border/20 overflow-hidden flex items-center justify-center">
              <h2 className="text-[9vw] sm:text-[10vw] md:text-[10.5vw] lg:text-[105px] xl:text-[115px] font-sans font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-theme-accent to-transparent bg-clip-text text-transparent text-center select-none w-full transition-all duration-300 opacity-90 dark:opacity-85 py-3 px-6 whitespace-nowrap">
                SEJATIDIMEDIA
              </h2>
            </div>

            {/* Bottom Row: Legal/Trademarks */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-[10px] font-mono tracking-wider text-theme-fore-subtle uppercase">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5">
                <span>© {new Date().getFullYear()} SEJATIDIMEDIA.</span>
                <span className="text-theme-border/60">•</span>
                <button className="hover:text-theme-fore transition-colors cursor-pointer">
                  KEBIJAKAN PRIVASI
                </button>
                <span className="text-theme-border/60">•</span>
                <button className="hover:text-theme-fore transition-colors cursor-pointer">
                  SYARAT & KETENTUAN
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
      </div>
    </>
  );
}
