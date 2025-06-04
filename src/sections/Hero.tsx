"use client";
import { motion } from "framer-motion";
import Image from "next/image";
// import ArrowDown from "@/assets/icons/arrow-down.svg";

export const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden  scroll-smooth" id="home">
      <div className="container mx-auto px-4">
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
              <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300">
                Full Stack Developer
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Crafting Digital
              <span className="block mt-2 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                Experiences
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transforming ideas into elegant, scalable web solutions with modern technologies and creative design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <motion.button
                onClick={scrollToProjects}
                className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              <motion.a
                href="https://wa.me/+212665830816"
                target="_blank"
                className="group px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s Connect
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10 animate-spin-slow"></div>
              <Image
                src="/abdo raq.png"
                width={400}
                height={400}
                className="rounded-full object-cover relative z-10 border-4 border-white/10"
                alt="Abdo Raquibi - Full Stack Developer"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* <ArrowDown className="w-6 h-6 text-gray-400" /> */}
      </motion.div>
    </div>
  );
};