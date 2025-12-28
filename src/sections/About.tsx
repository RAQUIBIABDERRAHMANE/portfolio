"use client";
import { HeaderSection } from "@/components/HeaderSection";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";
import { ToolBoxItems } from "@/components/ToolBoxItems";
import GitHubIcon from "@/assets/icons/github.svg";
import ReactIcon from "@/assets/icons/react.svg";
import CssIcon from "@/assets/icons/css3.svg";
import HtmlIcon from "@/assets/icons/html5.svg";
import LaravelIcon from "@/assets/icons/laravel.svg";
import JsIcon from "@/assets/icons/square-js.svg";
import DockerIcon from "@/assets/icons/docker.svg";
import PHPIcon from "@/assets/icons/php.svg";
import NodeJsIcon from "@/assets/icons/node-js.svg";

const toolBoxItems = [
  { title: "HTML5", iconType: "/icons/html5.svg" },
  { title: "CSS3", iconType: "/icons/css3.svg" },
  { title: "JavaScript", iconType: "/icons/square-js.svg" },
  { title: "PHP", iconType: "/icons/php.svg" },
  { title: "Laravel", iconType: "/icons/laravel.svg" },
  { title: "ReactJS", iconType: "/icons/react.svg" },
  { title: "NodeJs", iconType: "/icons/node-js.svg" },
  { title: "GitHub", iconType: "/icons/github.svg" },
  { title: "Docker", iconType: "/icons/docker.svg" },
];

const timeline = [
  {
    year: "2023",
    title: "Senior Full Stack Developer",
    description: "Leading development of enterprise applications using Laravel and React",
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    description: "Developed and maintained multiple web applications using modern technologies",
  },
  {
    year: "2019",
    title: "Junior Developer",
    description: "Started my journey in web development, focusing on frontend technologies",
  },
];

const interests = [
  { title: "Reading", icon: "📚", color: "from-blue-400 to-cyan-400" },
  { title: "Traveling", icon: "✈️", color: "from-purple-400 to-pink-400" },
  { title: "Photography", icon: "📸", color: "from-orange-400 to-red-400" },
  { title: "Movies", icon: "🎬", color: "from-green-400 to-emerald-400" },
];

export const AboutSection = () => {
  const constraintRef = useRef(null);

  return (
    <div className="py-20 lg:py-28" id="about">
      <div className="container">
        <HeaderSection
          eyebrow="ABOUT ME"
          title="Crafting Digital Experiences"
          description="A passionate Full Stack Developer based in Morocco, focused on creating elegant solutions to complex problems."
        />

        <div className="mt-20 space-y-16">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6 glow-text" style={{
                  background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  My Journey
                </h3>
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                      className="relative pl-8"
                      style={{
                        borderLeft: '2px solid rgba(0, 255, 249, 0.3)',
                      }}
                    >
                      <motion.div
                        className="absolute -left-[9px] top-0 w-4 h-4 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #00fff9, #00d4ff)',
                          boxShadow: '0 0 10px #00fff9',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            '0 0 10px #00fff9',
                            '0 0 20px #00fff9',
                            '0 0 10px #00fff9',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                      <span className="text-sm font-medium font-mono" style={{ color: '#00fff9' }}>
                        {item.year}
                      </span>
                      <h4 className="text-lg font-semibold mt-1">{item.title}</h4>
                      <p className="text-gray-400 mt-1">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Right Column - Skills & Interests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6 glow-text" style={{
                  background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  My Toolbox
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {toolBoxItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center p-4 rounded-lg relative overflow-hidden group"
                      style={{
                        background: 'rgba(0, 255, 249, 0.05)',
                        border: '1px solid rgba(0, 255, 249, 0.2)',
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 20px rgba(0, 255, 249, 0.3)',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1) 0%, transparent 100%)',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Image src={item.iconType} alt={item.title} width={32} height={32} className="w-8 h-8 mb-2 relative z-10" />
                      <span className="text-sm text-center relative z-10">{item.title}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6 glow-text" style={{
                  background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Beyond Code
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {interests.map((interest, index) => (
                    <motion.div
                      key={interest.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg relative overflow-hidden group"
                      style={{
                        background: 'rgba(0, 255, 249, 0.05)',
                        border: '1px solid rgba(0, 255, 249, 0.2)',
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 20px rgba(0, 255, 249, 0.2)',
                      }}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <span className="text-2xl">{interest.icon}</span>
                        <span className="font-medium">{interest.title}</span>
                      </div>
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(0, 212, 255, 0.1))`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Section - Personal Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4 glow-text" style={{
                  background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  My Philosophy
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  I believe in creating software that not only solves problems but also delights users.
                  Every line of code I write is an opportunity to make someone&apos;s life a little better.
                  When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source projects,
                  or sharing knowledge with the developer community.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};