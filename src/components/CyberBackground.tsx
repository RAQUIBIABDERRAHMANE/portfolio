"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export const CyberBackground = () => {
  // Generate random positions for robots/drones
  const robots = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Giant AI Robot Head - Using actual image with background removed */}
      <motion.div
        className="absolute -top-32 -right-10 w-[100px] h-[100px] md:w-[900px] md:h-[900px]"
        initial={{ opacity: 0, scale: 0.7, x: 100 }}
        animate={{ 
          opacity: [0.3, 0.4, 0.3], 
          scale: 1,
          y: [0, -30, 0],
        }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 2 },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-full h-full">
          <Image 
            src="/image.png" 
            alt="AI Robot" 
            width={900} 
            height={900}
            className="w-full h-full object-contain"
            style={{
              mixBlendMode: 'screen',
              filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 0 40px rgba(0, 255, 249, 0.6))',
            }}
            priority
          />
          
          {/* Cyan/Blue color overlay to match theme */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 249, 0.3) 0%, rgba(0, 212, 255, 0.2) 50%, transparent 70%)',
              mixBlendMode: 'overlay',
            }}
          />
        </div>
        
        {/* Additional glow effect around the head */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 249, 0.3) 0%, rgba(0, 212, 255, 0.2) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Animated scanning lines over the robot */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 249, 0.4) 50%, transparent 100%)',
            height: '100px',
          }}
          animate={{
            y: [-100, 900],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

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

      {/* Flying robots/drones in the sky */}
      <div className="absolute inset-0">
        {robots.map((robot) => (
          <motion.div
            key={robot.id}
            className="absolute"
            style={{
              left: `${robot.x}%`,
              top: '20%',
            }}
            initial={{ x: -100, y: 0, opacity: 0 }}
            animate={{
              x: [0, 1400],
              y: [0, -50, 0, 50, 0],
              opacity: [0, 0.6, 0.6, 0.6, 0],
            }}
            transition={{
              duration: robot.duration,
              delay: robot.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Robot/Drone SVG */}
            <svg width="40" height="40" viewBox="0 0 40 40">
              <defs>
                <filter id={`glow-${robot.id}`}>
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Drone body */}
              <ellipse
                cx="20"
                cy="20"
                rx="8"
                ry="6"
                fill="#00fff9"
                opacity="0.3"
                filter={`url(#glow-${robot.id})`}
              />
              {/* Propellers */}
              <motion.line
                x1="10"
                y1="15"
                x2="10"
                y2="25"
                stroke="#00fff9"
                strokeWidth="2"
                opacity="0.6"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                style={{ originX: '10px', originY: '20px' }}
              />
              <motion.line
                x1="30"
                y1="15"
                x2="30"
                y2="25"
                stroke="#00fff9"
                strokeWidth="2"
                opacity="0.6"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                style={{ originX: '30px', originY: '20px' }}
              />
              {/* Lights */}
              <circle cx="15" cy="20" r="1.5" fill="#00fff9">
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="25" cy="20" r="1.5" fill="#00d4ff">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Antenna */}
              <line x1="20" y1="14" x2="20" y2="10" stroke="#00fff9" strokeWidth="1" opacity="0.7" />
              <circle cx="20" cy="10" r="1" fill="#00fff9" opacity="0.9">
                <animate
                  attributeName="opacity"
                  values="0.9;0.4;0.9"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Additional atmospheric particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};
