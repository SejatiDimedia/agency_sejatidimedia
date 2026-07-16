/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: (theme: ThemeMode) => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => onToggle(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-full bg-theme-elevated border border-theme-border flex items-center justify-center hover:border-theme-border-accent/80 hover:bg-theme-surface hover:shadow-lg hover:shadow-theme-accent/5 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden group"
      id="btn-theme-toggle"
      aria-label="Toggle theme"
    >
      {/* Decorative inner circular glow */}
      <div className="absolute inset-0 bg-theme-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun-icon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-theme-accent flex items-center justify-center"
          >
            <Sun className="w-[18px] h-[18px] stroke-[2.2]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-theme-accent flex items-center justify-center"
          >
            <Moon className="w-[18px] h-[18px] stroke-[2.2]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

