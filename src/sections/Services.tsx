"use client";

import { motion } from "framer-motion";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const services = [
  {
    category: "Business-Oriented Websites",
    icon: "💼",
    items: [
      "Corporate websites – represent a company's identity and services",
      "Portfolio websites – showcase work of freelancers or agencies",
      "Consulting firm websites – highlight expertise and attract leads",
      "Service-based business websites – for plumbers, salons, law firms, etc.",
    ],
    color: "from-blue-500 to-violet-500",
    description: "Professional websites that help businesses establish their online presence and attract potential clients.",
  },
  {
    category: "Commerce & Sales",
    icon: "🛒",
    items: [
      "E-commerce stores – sell physical or digital products online",
      "Dropshipping websites – e-commerce without managing inventory",
      "Marketplace platforms – multi-vendor stores",
      "Subscription box services – recurring delivery",
    ],
    color: "from-violet-500 to-purple-500",
    description: "Online stores and marketplaces that enable businesses to sell products and services directly to customers.",
  },
  {
    category: "Software & SaaS Platforms",
    icon: "💻",
    items: [
      "SaaS (Software as a Service) – subscription-based tools",
      "Web apps – interactive tools or services in browser",
      "PaaS (Platform as a Service) websites – developer platforms",
    ],
    color: "from-purple-500 to-pink-500",
    description: "Web-based software solutions that provide specific functionality to users through subscription models.",
  },
  {
    category: "Content-Driven Websites",
    icon: "🧠",
    items: [
      "Blogs – personal, niche, or corporate",
      "News websites – publish articles and updates",
      "Wiki-style sites – collaborative knowledge bases",
      "Online magazines – digital publishing",
    ],
    color: "from-pink-500 to-red-500",
    description: "Websites focused on delivering valuable content to readers and building engaged audiences.",
  },
  {
    category: "Education & Learning",
    icon: "📚",
    items: [
      "Online course platforms – sell and manage courses",
      "University/school websites – inform students, parents, staff",
      "E-learning platforms – interactive learning",
    ],
    color: "from-red-500 to-orange-500",
    description: "Educational platforms that facilitate online learning and course management.",
  },
  // {
  //   category: "Community & Social",
  //   icon: "🌐",
  //   items: [
  //     "Social networks – user profiles, posts, interactions",
  //     "Forums/discussion boards – niche communities",
  //     "Membership websites – gated content or community",
  //   ],
  //   color: "from-orange-500 to-yellow-500",
  //   description: "Platforms that connect people and foster community engagement through various features.",
  // },
  // {
  //   category: "Creative & Media",
  //   icon: "🎨",
  //   items: [
  //     "Artist or photographer portfolios",
  //     "Music/band websites – promote albums, events",
  //     "Video streaming platforms",
  //   ],
  //   color: "from-yellow-500 to-green-500",
  //   description: "Websites that showcase creative work and media content in an engaging way.",
  // },
  // {
  //   category: "Personal & Miscellaneous",
  //   icon: "🧾",
  //   items: [
  //     "Personal websites/resumes – online CVs",
  //     "Event websites – for weddings, conferences, or concerts",
  //     "Nonprofit/NGO websites – promote a cause, accept donations",
  //     "Landing pages – single-page focused sites for marketing campaigns",
  //   ],
  //   color: "from-green-500 to-emerald-500",
  //   description: "Specialized websites for personal branding, events, and specific purposes.",
  // },
];

const handleContactClick = (service: typeof services[0], platform: 'whatsapp' | 'instagram') => {
  const message = `Hello! I'm interested in your ${service.category} service. ${service.description} Could you tell me more about this service and how you can help me?`;
  const encodedMessage = encodeURIComponent(message);
  
  if (platform === 'whatsapp') {
    const whatsappUrl = `https://wa.me/212665830816?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  } else {
    const instagramUrl = `https://instagram.com/direct/t/abderrahmaneraquibi1?text=${encodedMessage}`;
    window.open(instagramUrl, "_blank");
  }
};

export const ServicesSection = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <section className="py-16 lg:py-24 scroll-smooth" id="services">
      <div className="container">
        <HeaderSection
          eyebrow="SERVICES"
          title="Web Development Solutions"
          description="Comprehensive web development services tailored to your specific needs and goals"
        />
        <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden h-full flex flex-col">
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, ${service.color})` }}
                />
                <div className="relative z-10 p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{service.icon}</span>
                    <h3 className="font-serif text-xl md:text-2xl">
                      {service.category}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.items.map((item) => (
                      <motion.li
                        key={item}
                        className="flex items-start gap-3 text-sm md:text-base text-white/70"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="size-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-10 mt-auto">
                  <motion.button
                    onClick={() => setActiveDropdown(activeDropdown === service.category ? null : service.category)}
                    className="w-full p-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Contact Me</span>
                  </motion.button>
                  
                  {/* Dropdown Menu */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeDropdown === service.category ? "auto" : 0,
                      opacity: activeDropdown === service.category ? 1 : 0,
                    }}
                    className="absolute bottom-full left-0 right-0 bg-gray-800 rounded-t-lg overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          handleContactClick(service, 'whatsapp');
                          setActiveDropdown(null);
                        }}
                        className="w-full p-3 text-left hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <Image
                          src="/icons/whatsapp.svg"
                          alt="WhatsApp"
                          width={20}
                          height={20}
                          className="size-5"
                        />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => {
                          handleContactClick(service, 'instagram');
                          setActiveDropdown(null);
                        }}
                        className="w-full p-3 text-left hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <Image
                          src="/icons/instagram.svg"
                          alt="Instagram"
                          width={20}
                          height={20}
                          className="size-5"
                        />
                        <span>Instagram</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 