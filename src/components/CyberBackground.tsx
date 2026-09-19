"use client";
import { motion } from "framer-motion";

export const CyberBackground = () => {
  // Deterministic particle positions to prevent SSR/client hydration mismatch
  const particles = [
    { left: 8, top: 18, dur: 5.2, del: 0.3 },
    { left: 22, top: 42, dur: 6.1, del: 1.1 },
    { left: 38, top: 14, dur: 4.8, del: 1.8 },
    { left: 52, top: 68, dur: 6.9, del: 0.6 },
    { left: 68, top: 32, dur: 5.4, del: 1.4 },
    { left: 82, top: 58, dur: 6.3, del: 2.1 },
    { left: 94, top: 22, dur: 4.2, del: 0.4 },
    { left: 14, top: 78, dur: 5.7, del: 1.6 },
    { left: 32, top: 58, dur: 6.0, del: 0.8 },
    { left: 62, top: 82, dur: 4.9, del: 2.5 },
    { left: 45, top: 88, dur: 5.5, del: 1.0 },
    { left: 76, top: 16, dur: 4.6, del: 2.0 },
    { left: 88, top: 74, dur: 5.8, del: 0.7 },
    { left: 28, top: 28, dur: 6.4, del: 1.9 },
    { left: 58, top: 48, dur: 5.1, del: 1.3 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Cyber city skyline with towers */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-20">
        {/* Buildings/Towers */}
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="towerGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00fff9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00fff9" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="towerGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="towerGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Tower 1 - Far left */}
          <motion.g
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <rect x="50" y="200" width="80" height="200" fill="url(#towerGradient1)" />
            <rect x="55" y="205" width="70" height="3" fill="#00fff9" opacity="0.6" />
            <rect x="55" y="220" width="70" height="3" fill="#00fff9" opacity="0.4" />
            <rect x="55" y="235" width="70" height="3" fill="#00fff9" opacity="0.6" />
            {/* Windows pattern */}
            {[...Array(8)].map((_, i) => (
              <g key={i}>
                <rect x="60" y={250 + i * 18} width="8" height="12" fill="#00fff9" opacity="0.3" />
                <rect x="75" y={250 + i * 18} width="8" height="12" fill="#00fff9" opacity="0.2" />
                <rect x="90" y={250 + i * 18} width="8" height="12" fill="#00fff9" opacity="0.3" />
                <rect x="105" y={250 + i * 18} width="8" height="12" fill="#00fff9" opacity="0.2" />
              </g>
            ))}
            {/* Antenna */}
            <line x1="90" y1="200" x2="90" y2="160" stroke="#00fff9" strokeWidth="2" opacity="0.6" />
            <circle cx="90" cy="160" r="4" fill="#00fff9" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* Tower 2 - Center left */}
          <motion.g
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <rect x="200" y="150" width="100" height="250" fill="url(#towerGradient2)" />
            <rect x="205" y="155" width="90" height="4" fill="#00d4ff" opacity="0.7" />
            <rect x="205" y="170" width="90" height="4" fill="#00d4ff" opacity="0.5" />
            {/* Windows */}
            {[...Array(12)].map((_, i) => (
              <g key={i}>
                <rect x="210" y={180 + i * 18} width="10" height="12" fill="#00d4ff" opacity="0.3" />
                <rect x="230" y={180 + i * 18} width="10" height="12" fill="#00d4ff" opacity="0.2" />
                <rect x="250" y={180 + i * 18} width="10" height="12" fill="#00d4ff" opacity="0.3" />
                <rect x="270" y={180 + i * 18} width="10" height="12" fill="#00d4ff" opacity="0.2" />
              </g>
            ))}
            {/* Multiple antennas */}
            <line x1="230" y1="150" x2="230" y2="100" stroke="#00d4ff" strokeWidth="2" opacity="0.6" />
            <line x1="270" y1="150" x2="270" y2="120" stroke="#00d4ff" strokeWidth="2" opacity="0.6" />
            <circle cx="230" cy="100" r="5" fill="#00d4ff" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* Tower 3 - Tallest center */}
          <motion.g
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <rect x="400" y="80" width="120" height="320" fill="url(#towerGradient3)" />
            <rect x="405" y="85" width="110" height="5" fill="#a855f7" opacity="0.8" />
            <rect x="405" y="100" width="110" height="5" fill="#a855f7" opacity="0.6" />
            {/* Dense windows */}
            {[...Array(16)].map((_, i) => (
              <g key={i}>
                <rect x="410" y={110 + i * 18} width="12" height="12" fill="#a855f7" opacity="0.3" />
                <rect x="430" y={110 + i * 18} width="12" height="12" fill="#a855f7" opacity="0.25" />
                <rect x="450" y={110 + i * 18} width="12" height="12" fill="#a855f7" opacity="0.3" />
                <rect x="470" y={110 + i * 18} width="12" height="12" fill="#a855f7" opacity="0.25" />
                <rect x="490" y={110 + i * 18} width="12" height="12" fill="#a855f7" opacity="0.3" />
              </g>
            ))}
            {/* Top structure */}
            <polygon points="460,80 440,50 480,50" fill="#a855f7" opacity="0.5" />
            <line x1="460" y1="50" x2="460" y2="20" stroke="#a855f7" strokeWidth="3" opacity="0.7" />
            <circle cx="460" cy="20" r="6" fill="#a855f7" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* Tower 4 - Right side */}
          <motion.g
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <rect x="650" y="180" width="90" height="220" fill="url(#towerGradient1)" />
            <rect x="655" y="185" width="80" height="4" fill="#00fff9" opacity="0.6" />
            {/* Windows */}
            {[...Array(10)].map((_, i) => (
              <g key={i}>
                <rect x="660" y={200 + i * 18} width="10" height="12" fill="#00fff9" opacity="0.3" />
                <rect x="680" y={200 + i * 18} width="10" height="12" fill="#00fff9" opacity="0.25" />
                <rect x="700" y={200 + i * 18} width="10" height="12" fill="#00fff9" opacity="0.3" />
                <rect x="720" y={200 + i * 18} width="10" height="12" fill="#00fff9" opacity="0.25" />
              </g>
            ))}
            <line x1="695" y1="180" x2="695" y2="140" stroke="#00fff9" strokeWidth="2" opacity="0.6" />
            <circle cx="695" cy="140" r="4" fill="#00fff9" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* Tower 5 - Far right */}
          <motion.g
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <rect x="850" y="220" width="85" height="180" fill="url(#towerGradient2)" />
            <rect x="855" y="225" width="75" height="3" fill="#00d4ff" opacity="0.6" />
            {/* Windows */}
            {[...Array(8)].map((_, i) => (
              <g key={i}>
                <rect x="860" y={240 + i * 18} width="9" height="12" fill="#00d4ff" opacity="0.3" />
                <rect x="877" y={240 + i * 18} width="9" height="12" fill="#00d4ff" opacity="0.2" />
                <rect x="894" y={240 + i * 18} width="9" height="12" fill="#00d4ff" opacity="0.3" />
                <rect x="911" y={240 + i * 18} width="9" height="12" fill="#00d4ff" opacity="0.2" />
              </g>
            ))}
            <line x1="892" y1="220" x2="892" y2="190" stroke="#00d4ff" strokeWidth="2" opacity="0.6" />
            <circle cx="892" cy="190" r="4" fill="#00d4ff" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* Additional smaller buildings */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            <rect x="10" y="280" width="30" height="120" fill="#00fff9" opacity="0.1" />
            <rect x="160" y="300" width="25" height="100" fill="#00d4ff" opacity="0.1" />
            <rect x="330" y="260" width="40" height="140" fill="#a855f7" opacity="0.1" />
            <rect x="560" y="290" width="35" height="110" fill="#00fff9" opacity="0.1" />
            <rect x="780" y="270" width="30" height="130" fill="#00d4ff" opacity="0.1" />
            <rect x="960" y="300" width="28" height="100" fill="#a855f7" opacity="0.1" />
          </motion.g>
        </svg>
      </div>

      {/* Atmospheric particles */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-neon-cyan rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.del,
            }}
          />
        ))}
      </div>
    </div>
  );
};
