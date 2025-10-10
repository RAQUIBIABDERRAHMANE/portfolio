"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden scroll-smooth" id="home">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Neural network lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00fff9" stopOpacity="0" />
              <stop offset="50%" stopColor="#00fff9" stopOpacity="1" />
              <stop offset="100%" stopColor="#00fff9" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${i * 25}%`}
              y1="0%"
              x2={`${(i + 1) * 25}%`}
              y2="100%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full backdrop-blur-sm text-sm relative overflow-hidden"
                style={{
                  background: 'rgba(0, 255, 249, 0.1)',
                  border: '1px solid rgba(0, 255, 249, 0.3)',
                  color: '#00fff9',
                  boxShadow: '0 0 20px rgba(0, 255, 249, 0.2)',
                }}>
                <span className="relative z-10">⚡ Full Stack Developer</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Crafting Digital
              </motion.span>
              <motion.span 
                className="block mt-2 glow-text"
                style={{
                  background: 'linear-gradient(90deg, #00fff9, #00d4ff, #a855f7, #00fff9)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  backgroundPosition: ['0%', '200%'],
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4,
                  backgroundPosition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                Experiences
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-neon-cyan font-mono">&gt;</span> Transforming ideas into elegant, scalable web solutions with{' '}
              <span className="text-neon-blue">AI-powered</span> technologies and{' '}
              <span className="text-neon-purple">creative</span> design.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                onClick={scrollToProjects}
                className="group relative px-8 py-4 rounded-lg font-medium overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                  color: '#050816',
                  border: '1px solid #00fff9',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div 
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7)' }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.a
                href="https://wa.me/+212665830816"
                target="_blank"
                className="group px-8 py-4 rounded-lg font-medium backdrop-blur-sm relative overflow-hidden"
                style={{
                  background: 'rgba(0, 255, 249, 0.05)',
                  border: '1px solid rgba(0, 255, 249, 0.5)',
                  color: '#00fff9',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Let&apos;s Connect</span>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'rgba(0, 255, 249, 0.1)' }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
              {/* Rotating rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid rgba(0, 255, 249, 0.3)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 rounded-full"
                style={{
                  border: '2px solid rgba(0, 212, 255, 0.3)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Glowing orbs */}
              <div className="absolute inset-0">
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, #00fff9 0%, transparent 70%)',
                      boxShadow: '0 0 20px #00fff9',
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [
                        Math.cos((angle * Math.PI) / 180) * 150,
                        Math.cos(((angle + 360) * Math.PI) / 180) * 150,
                      ],
                      y: [
                        Math.sin((angle * Math.PI) / 180) * 150,
                        Math.sin(((angle + 360) * Math.PI) / 180) * 150,
                      ],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 255, 249, 0.2) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <Image
                src="/abdo raq.png"
                width={400}
                height={400}
                className="rounded-full object-cover relative z-10"
                style={{
                  border: '3px solid rgba(0, 255, 249, 0.5)',
                  boxShadow: '0 0 50px rgba(0, 255, 249, 0.3), inset 0 0 30px rgba(0, 255, 249, 0.1)',
                }}
                alt="Abdo Raquibi - Full Stack Developer"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 rounded-full flex justify-center"
          style={{ borderColor: 'rgba(0, 255, 249, 0.5)' }}>
          <motion.div
            className="w-1.5 h-1.5 rounded-full mt-2"
            style={{ background: '#00fff9', boxShadow: '0 0 10px #00fff9' }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <span className="text-xs text-neon-cyan font-mono">SCROLL</span>
      </motion.div>
    </div>
  );
};