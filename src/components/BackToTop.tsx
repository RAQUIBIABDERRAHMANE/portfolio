"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(0,255,249,0.5)" }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50 size-12 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,249,0.15), rgba(0,212,255,0.15))",
            border: "1px solid rgba(0,255,249,0.4)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 15px rgba(0,255,249,0.2)",
          }}
          aria-label="Back to top"
        >
          <ChevronUp size={20} className="text-cyan-400" />
          {/* Pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-full border border-cyan-400/40"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
