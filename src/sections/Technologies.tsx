"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const technologies = {
  "Frontend": [
    { name: "HTML5", icon: "/icons/html5.svg", color: "#E34F26" },
    { name: "CSS3", icon: "/icons/css3.svg", color: "#1572B6" },
    { name: "JavaScript", icon: "/icons/square-js.svg", color: "#F7DF1E" },
    { name: "React", icon: "/icons/react.svg", color: "#61DAFB" },
    { name: "NextJs", icon: "/icons/nextjs.svg", color: "#727273" },
    { name: "Tailwind CSS", icon: "/icons/tailwind.svg", color: "#06B6D4" },
  ],
  "Backend": [
    { name: "PHP", icon: "/icons/php.svg", color: "#777BB4" },
    { name: "Laravel", icon: "/icons/laravel.svg", color: "#FF2D20" },
    { name: "Node.js", icon: "/icons/node-js.svg", color: "#339933" },
    { name: "Python", icon: "/icons/python.svg", color: "#3776AB" },
  ],
  "Database": [
    { name: "MySQL", icon: "/icons/mysql.svg", color: "#4479A1" },
    { name: "MongoDB", icon: "/icons/mongodb.svg", color: "#47A248" },
  ],
  "DevOps": [
    { name: "Docker", icon: "/icons/docker.svg", color: "#2496ED" },
    { name: "Git", icon: "/icons/git.svg", color: "#F05032" },
    { name: "GitHub", icon: "/icons/github.svg", color: "#181717" },
  ],
  "Tools": [
    { name: "VS Code", icon: "/icons/vscode.svg", color: "#007ACC" },
    { name: "Figma", icon: "/icons/figma.svg", color: "#F24E1E" },
    { name: "Notion", icon: "/icons/notion.svg", color: "#0052CC" },
  ],
};

export const TechnologieSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Frontend");

  return (
    <div className="py-16 lg:py-24">
      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technologies I Work With
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks that I use to build robust and scalable applications.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(technologies).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`pointer-events-auto px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer select-none ${activeCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {technologies[activeCategory as keyof typeof technologies].map((tech) => (
            <motion.div
              key={tech.name}
              className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`https://www.google.com/search?q=${tech.name}`, '_blank')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative w-16 h-16 mb-4 z-10">
                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-xl pointer-events-none"
                    style={{ backgroundColor: tech.color }}
                  />
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={128}
                    height={128}
                    className="relative z-10"
                  />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{tech.name}</h3>
                <div
                  className="h-1 w-12 rounded-full transition-all duration-300 group-hover:w-24"
                  style={{ backgroundColor: tech.color }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
