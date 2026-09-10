"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isHoveringInput, setIsHoveringInput] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Exact mouse coordinates (0 latency)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth elastic spring for trailing halo ring
  const springConfig = { damping: 24, stiffness: 260, mass: 0.4 };
  const haloX = useSpring(cursorX, springConfig);
  const haloY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad)
    if (typeof window === "undefined") return;
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    
    if (!finePointerQuery.matches) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect input or textarea to restore native I-beam cursor
      const isInput = !!target.closest('input, textarea, select, [contenteditable="true"]');
      setIsHoveringInput(isInput);

      // Detect clickable elements for magnetic expansion
      const isClickable = !!target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer, [data-cursor]'
      );
      setIsHoveringClickable(isClickable && !isInput);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  // Don't render on touchscreens/mobile devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Precision Center Dot (Follows cursor with zero latency) */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible && !isHoveringInput ? 1 : 0,
          scale: isMouseDown ? 0.7 : isHoveringClickable ? 0.6 : 1,
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#2C5098] dark:bg-[#38BDF8] pointer-events-none z-[99999] shadow-[0_0_6px_rgba(56,189,248,0.6)] will-change-transform"
      />

      {/* 2. Crystal-Clear Trailing Halo Ring (Zero blur, 100% razor sharp text readability) */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible && !isHoveringInput ? 1 : 0,
          scale: isMouseDown ? 0.8 : isHoveringClickable ? 1.4 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99998] will-change-transform bg-transparent transition-colors duration-200 ${
          isHoveringClickable
            ? "w-9 h-9 border border-[#2C5098] dark:border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.25)]"
            : "w-7 h-7 border border-[#2C5098]/30 dark:border-[#38BDF8]/30"
        }`}
      />
    </>
  );
}
