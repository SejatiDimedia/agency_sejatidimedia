/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from './types';
import ThemeToggle from './components/ThemeToggle';
import AgencyLanding from './components/AgencyLanding';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sejatidimedia-theme');
    return (saved as ThemeMode) || 'dark';
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize the HTML document element class list for Tailwind v4
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sejatidimedia-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen relative w-full flex flex-col font-sans overflow-x-hidden bg-theme-deep text-theme-fore transition-colors duration-300">

      {/* 1. Multi-Layer Background System (Linear/Modern Spec) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle base gradient reflecting light source direction */}
        {theme === 'dark' ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#090912_0%,#050506_60%,#010103_100%)]" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#FFFFFF_0%,#FAF9FC_60%,#F3F2F6_100%)]" />
        )}

        {/* Floating blurred organic accent pools / blobs */}
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="dark-blobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Cinematic Indigo Blob */}
              <div className="absolute -top-[20%] left-[25%] w-[800px] h-[800px] rounded-full bg-[#4A85D9]/10 blur-[150px] animate-float-slow pointer-events-none" />
              {/* Lavender Supporting Blob */}
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
              {/* Crisp Studio Soft Blue Blob */}
              <div className="absolute -top-[15%] left-[20%] w-[1000px] h-[1000px] rounded-full bg-[#2B5495]/3 blur-[140px] animate-float-slow pointer-events-none" />
              {/* Amber warmth accent blob */}
              <div className="absolute top-[35%] right-[5%] w-[800px] h-[800px] rounded-full bg-[#F59E0B]/2 blur-[150px] animate-float-slower pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Razor-thin Grid Pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: theme === 'dark'
              ? 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)'
              : 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Micro SVG Noise Layer to break digital banding and add tactile depth */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: theme === 'dark' ? 0.015 : 0.008,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 2. Main Portal Application Header (Fixed/Sticky Glassmorphism with Smooth Scroll Transitions) */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-[0.16,1,0.3,1] ${scrolled
        ? 'bg-theme-base/80 backdrop-blur-xl border-b border-theme-border/80 shadow-lg shadow-black/5 py-3'
        : 'bg-transparent border-b border-transparent py-5'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300">

          {/* Logo / Brand Name */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="logo-header-trigger"
          >
            <div className="h-7 w-auto hover:scale-105 transition-transform duration-200 flex items-center justify-center">
              <img src="/logo.svg" alt="SejatiDimedia Logo" className="h-full w-auto object-contain" />
            </div>
            <span className="font-display font-bold text-base tracking-wider text-theme-accent">
              SEJATIDI<span className="text-theme-accent/80 font-normal">MEDIA</span>
            </span>
          </div>

          {/* Capsule Center Navigation matching the layout references */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-theme-surface/80 border border-theme-border/60">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => document.getElementById('capabilities-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
            >
              Capabilities
            </button>
            <button
              onClick={() => document.getElementById('methodology-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
            >
              Methodology
            </button>
            <button
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-theme-fore-muted hover:text-theme-fore hover:bg-theme-surface cursor-pointer transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right Action: Theme Switch Controller & Brand Accent CTA Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={setTheme} />
            <button
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white transition-all duration-200 cursor-pointer shadow-md shadow-theme-accent/10 hover:scale-[1.02]"
            >
              Start a Project
            </button>
          </div>

        </div>
      </header>

      {/* 3. Core Body Content Shell */}
      <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-6 pt-28 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <AgencyLanding />
        </motion.div>
      </main>

      {/* 4. High-Fidelity Premium Footer (Design Inspired by Reference) */}
      <footer className="relative z-10 w-full bg-theme-base border-t border-theme-border/60 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-16">

          {/* Top Row: Mission Text and Custom List of Navigations */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

            {/* Left Block: Tagline and Contact */}
            <div className="md:col-span-7 space-y-6">
              <div className="h-7 w-auto flex items-center justify-start">
                <img src="/logo.svg" alt="SejatiDimedia Logo" className="h-full w-auto object-contain" />
              </div>
              <h3 className="text-xl sm:text-2xl font-sans font-extrabold tracking-tight text-theme-fore max-w-lg leading-snug">
                Embrace the future of digital engineering with our high-fidelity product software craftsmanship.
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

            {/* Right Block: Vertical list of high-fidelity link actions */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block font-bold">
                  Sitemap Navigation
                </span>
                <ul className="space-y-2.5 text-xs font-sans font-semibold text-theme-fore-muted">
                  <li>
                    <button
                      onClick={() => document.getElementById('capabilities-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                    >
                      Explore Services
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => document.getElementById('technology-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                    >
                      Active Tech Stack
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                    >
                      Interactive Sandbox
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3.5">
                <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block font-bold">
                  Processes & Contact
                </span>
                <ul className="space-y-2.5 text-xs font-sans font-semibold text-theme-fore-muted">
                  <li>
                    <button
                      onClick={() => document.getElementById('methodology-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                    >
                      Sprint Methodology
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left"
                    >
                      Enterprise Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-theme-accent transition-colors duration-200 cursor-pointer block text-left font-bold text-theme-fore"
                    >
                      Start Project Console
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Middle Row: Massive Stylized Background Wordmark matching "DOZE" in Reference Image */}
          <div className="relative py-6 select-none border-t border-b border-theme-border/20 overflow-hidden flex items-center justify-center">
            <h2 className="text-[9vw] sm:text-[10vw] md:text-[10.5vw] lg:text-[105px] xl:text-[115px] font-sans font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-theme-accent to-transparent bg-clip-text text-transparent text-center select-none w-full transition-all duration-300 opacity-90 dark:opacity-85 py-3 px-6 whitespace-nowrap">
              SEJATIDIMEDIA
            </h2>
          </div>

          {/* Bottom Row: Trademarks, Legal & Social handles */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-[10px] font-mono tracking-wider text-theme-fore-subtle uppercase">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5">
              <span>© {new Date().getFullYear()} SEJATIDIMEDIA.</span>
              <span className="text-theme-border/60">•</span>
              <button className="hover:text-theme-fore transition-colors cursor-pointer">PRIVACY POLICY</button>
              <span className="text-theme-border/60">•</span>
              <button className="hover:text-theme-fore transition-colors cursor-pointer">TERMS & CONDITIONS</button>
            </div>

            <div className="flex items-center gap-4">
              <a href="#instagram" className="hover:text-theme-fore transition-colors">INSTAGRAM</a>
              <span className="text-theme-border/40">•</span>
              <a href="#linkedin" className="hover:text-theme-fore transition-colors">LINKEDIN</a>
              <span className="text-theme-border/40">•</span>
              <a href="#twitter" className="hover:text-theme-fore transition-colors">X(TWITTER)</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
