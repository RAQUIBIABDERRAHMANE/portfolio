"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_PHRASES = [
  "INITIALIZING SYSTEM...",
  "LOADING COMPONENTS...",
  "ESTABLISHING CONNECTION...",
  "RENDERING PORTFOLIO...",
];

export const PageLoader = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Animate progress bar
    const duration = 2400; // ms total
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const progressTimer = setInterval(() => {
      step++;
      // Ease-out curve
      const pct = Math.min(100, Math.round((1 - Math.pow(1 - step / steps, 3)) * 100));
      setProgress(pct);
      if (step >= steps) clearInterval(progressTimer);
    }, interval);

    // Cycle phrases
    const phraseTimer = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length);
    }, 450);

    // Animate dots
    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 300);

    // Dismiss after load
    const dismissTimer = setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => {
      clearInterval(progressTimer);
      clearInterval(phraseTimer);
      clearInterval(dotsTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #050816 0%, #0a0e27 55%, #050816 100%)",
            overflow: "hidden",
          }}
        >
          {/* Grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(30,41,59,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.35) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              pointerEvents: "none",
            }}
          />

          {/* Ambient glows */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,255,249,0.12) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />

          {/* Horizontal scan line */}
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, transparent, #00fff9, transparent)",
              boxShadow: "0 0 12px #00fff9",
              pointerEvents: "none",
            }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner accents */}
          {[
            "top-6 left-6 border-t-2 border-l-2",
            "top-6 right-6 border-t-2 border-r-2",
            "bottom-6 left-6 border-b-2 border-l-2",
            "bottom-6 right-6 border-b-2 border-r-2",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 border-[#00fff9] ${cls}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}

          {/* ── Logo & Name ── */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Hexagon logo mark */}
            <motion.div
              className="relative mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <motion.path
                  d="M40 4 L72 22 L72 58 L40 76 L8 58 L8 22 Z"
                  stroke="#00fff9"
                  strokeWidth="1.5"
                  fill="rgba(0,255,249,0.05)"
                  animate={{ strokeOpacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M40 14 L64 28 L64 52 L40 66 L16 52 L16 28 Z"
                  stroke="rgba(0,255,249,0.4)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [0, -16] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </svg>
              {/* Inner dot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-3 h-3 rounded-full bg-[#00fff9]"
                  style={{ boxShadow: "0 0 12px #00fff9, 0 0 24px rgba(0,255,249,0.5)" }} />
              </motion.div>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-center"
              style={{
                background: "linear-gradient(90deg, #ffffff 0%, #a5f3fc 50%, #00fff9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
              initial={{ letterSpacing: "0.3em", opacity: 0 }}
              animate={{ letterSpacing: "-0.02em", opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Abdo Raquibi
            </motion.h1>

            {/* Role */}
            <motion.p
              className="text-sm font-mono tracking-[0.25em] text-white/40 mb-10 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Full-Stack Developer
            </motion.p>

            {/* Progress bar container */}
            <div className="w-64 md:w-80">
              <div
                className="w-full h-[2px] rounded-full overflow-hidden"
                style={{ background: "rgba(0,255,249,0.1)", border: "1px solid rgba(0,255,249,0.15)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00fff9, #a855f7)",
                    boxShadow: "0 0 10px rgba(0,255,249,0.8)",
                    width: `${progress}%`,
                  }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status text */}
              <div className="flex items-center justify-between mt-3">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-[10px] font-mono tracking-[0.2em] text-[#00fff9] opacity-60"
                >
                  {LOADING_PHRASES[phraseIndex]}{dots}
                </motion.span>
                <span className="text-[10px] font-mono text-[#00fff9] opacity-40">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Blinking cursor */}
            <motion.div
              className="mt-8 w-2 h-5 bg-[#00fff9] rounded-sm"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ boxShadow: "0 0 8px #00fff9" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
