"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import ArrowDown from "@/assets/icons/arrow-down.svg";

export const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="section-padding relative overflow-hidden" id="home">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Full Stack Developer & 
              <span className="gradient-text"> Digital Creator</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              Building modern web experiences with cutting-edge technologies. 
              Focused on creating scalable and user-friendly applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToProjects}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                View My Work
              </button>
              <a 
                href="https://wa.me/+212665830816" 
                target="_blank"
                className="px-8 py-4 rounded-lg glass-effect text-white font-medium hover:bg-white/10 transition-all"
              >
                Let's Connect
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-3xl"></div>
              <Image
                src="/abdo raq.png"
                width={400}
                height={400}
                className="rounded-full object-cover"
                alt="Abdo Raquibi - Full Stack Developer"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
};