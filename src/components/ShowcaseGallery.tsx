"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, Layers, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlioProjectDocument } from "../lib/api/glio-projects";
import { useLanguage } from "../lib/i18n/LanguageContext";

interface ShowcaseGalleryProps {
  images: GlioProjectDocument[];
  isNdaBlurred?: boolean;
}

export default function ShowcaseGallery({ images, isNdaBlurred = false }: ShowcaseGalleryProps) {
  const { t, language } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Set loading state when image index changes
  useEffect(() => {
    if (activeIdx !== null) {
      setImageLoading(true);
    }
  }, [activeIdx]);

  // Close on ESC key or navigate on arrows
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIdx(null);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, images.length]);

  if (!images || images.length === 0) return null;

  const displayLimit = 5;
  const visibleImages = images.slice(0, displayLimit);
  const remainingCount = images.length - displayLimit + 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border/60 shadow-lg hover:shadow-xl transition-all duration-300 space-y-5 text-left relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-theme-border/40 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-sans font-bold text-slate-900 dark:text-theme-fore uppercase tracking-wider">
              Project Showcase
            </h3>
            {isNdaBlurred && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <ShieldAlert className="w-2.5 h-2.5" />
                <span>{t.projectDetail?.ndaGalleryBadge || (language === 'en' ? 'Protected by NDA' : 'Proteksi NDA')}</span>
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-theme-fore-subtle font-mono">
            {images.length} {images.length === 1 ? (language === 'en' ? 'Screenshot' : 'Tangkapan Layar') : (language === 'en' ? 'Screenshots' : 'Tangkapan Layar')}
          </p>
        </div>
        {isNdaBlurred ? (
          <ShieldAlert className="w-4 h-4 text-amber-500" />
        ) : (
          <Layers className="w-4 h-4 text-[#2C5098]" />
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-2.5">
          {visibleImages.map((img, idx) => {
            const isLastVisibleWithMore = images.length > displayLimit && idx === displayLimit - 1;
            
            return (
              <motion.div
                key={img.id}
                onClick={() => {
                  if (!isNdaBlurred) {
                    setActiveIdx(idx);
                  }
                }}
                whileHover={isNdaBlurred ? {} : { scale: 1.03, y: -2 }}
                whileTap={isNdaBlurred ? {} : { scale: 0.98 }}
                className={`relative aspect-square w-full rounded-xl overflow-hidden border border-slate-200 dark:border-theme-border/60 bg-slate-50 dark:bg-theme-surface/50 transition-all duration-300 group shadow-sm ${
                  isNdaBlurred ? 'cursor-not-allowed' : 'hover:border-[#2C5098] cursor-pointer hover:shadow-md'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isNdaBlurred
                      ? 'filter blur-md scale-110 brightness-75 select-none pointer-events-none'
                      : 'filter brightness-[0.9] group-hover:brightness-100 group-hover:scale-105'
                  }`}
                  sizes="(max-w-768px) 33vw, 10vw"
                />
                
                {/* Expand Hover Icon (Only when NOT blurred) */}
                {!isNdaBlurred && !isLastVisibleWithMore && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-900 shadow-lg"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>
                )}
                
                {isLastVisibleWithMore && !isNdaBlurred && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 transition-all group-hover:bg-black/80">
                    <span className="text-base font-sans font-extrabold text-white tracking-tight drop-shadow">
                      +{remainingCount}
                    </span>
                    <span className="text-[8px] font-mono text-white/70 uppercase tracking-widest mt-0.5">
                      Gallery
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* NDA Overlay Badge on top of gallery */}
        {isNdaBlurred && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-3 text-center z-20 pointer-events-none select-none border border-white/10 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mb-1.5 border border-amber-500/30 shadow-xs">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 drop-shadow-xs">
              {t.projectDetail?.ndaGalleryTitle || (language === 'en' ? 'Screenshots Protected by NDA' : 'Tangkapan Layar Terproteksi NDA')}
            </span>
            <span className="text-[9.5px] font-sans text-slate-200 mt-0.5 max-w-[210px] leading-tight drop-shadow-xs">
              {t.projectDetail?.ndaGalleryDesc || (language === 'en' ? 'Internal system screenshots are blurred to maintain non-disclosure compliance.' : 'Tangkapan layar sistem internal disamarkan untuk kepatuhan regulasi kerahasiaan.')}
            </span>
          </div>
        )}
      </div>

      {/* PORTAL AT THE DOCUMENT BODY FOR HIGH-PRIORITY SCREEN OVERLAY */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIdx(null)}
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none"
            >
              {/* Modal Card (Screen-filling size) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[96vw] md:max-w-6xl h-[85vh] md:h-[90vh] bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-theme-border/60 bg-slate-50 dark:bg-theme-surface/30">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] font-mono text-[#2C5098] uppercase tracking-wider font-bold">
                      Project Screenshot
                    </span>
                    <h3 className="text-sm sm:text-base font-sans font-bold text-slate-900 dark:text-theme-fore truncate max-w-[200px] sm:max-w-xl">
                      {images[activeIdx].name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-theme-fore-subtle bg-white dark:bg-theme-surface/60 border border-slate-200 dark:border-theme-border/40 px-2 py-0.5 rounded">
                      {activeIdx + 1} / {images.length}
                    </span>
                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveIdx(null)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-theme-surface dark:hover:bg-theme-border border border-slate-200 dark:border-theme-border/60 text-slate-700 dark:text-theme-fore transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Modal Body / Image Frame */}
                <div className="relative w-full flex-grow bg-black/10 flex items-center justify-center group/stage">
                  {/* Prev Button */}
                  {activeIdx > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrev}
                      className="absolute left-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-[#2C5098] hover:text-white border border-slate-200 text-slate-800 cursor-pointer shadow-lg transition-colors animate-in fade-in"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                  )}

                  {/* Image Stage Container */}
                  <div className="relative w-full h-full p-2 flex items-center justify-center">
                    <Image
                      src={images[activeIdx].url}
                      alt={images[activeIdx].name}
                      fill
                      className={`object-contain transition-all duration-300 ${
                        imageLoading ? "opacity-30 scale-[0.98] blur-[2px]" : "opacity-100 scale-100 blur-0"
                      }`}
                      sizes="(max-w-1200px) 95vw, 85vw"
                      priority
                      onLoad={() => setImageLoading(false)}
                    />

                    {/* Loader overlay */}
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-8 h-8 rounded-full border-2 border-[#2C5098]/20 border-t-[#2C5098] animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Next Button */}
                  {activeIdx < images.length - 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="absolute right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-[#2C5098] hover:text-white border border-slate-200 text-slate-800 cursor-pointer shadow-lg transition-colors animate-in fade-in"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {/* Modal Footer / Thumbnails list */}
                {images.length > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 dark:border-theme-border/60 bg-slate-50 dark:bg-theme-surface/10">
                    <div className="flex gap-2 overflow-x-auto py-1 px-0.5 justify-center no-scrollbar">
                      {images.map((img, idx) => (
                        <div
                          key={img.id}
                          onClick={() => setActiveIdx(idx)}
                          className={`relative w-10 h-10 rounded-lg overflow-hidden border cursor-pointer transition-all flex-shrink-0 ${
                            idx === activeIdx
                              ? "border-[#2C5098] scale-105 shadow-sm"
                              : "border-slate-200 opacity-40 hover:opacity-85"
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
