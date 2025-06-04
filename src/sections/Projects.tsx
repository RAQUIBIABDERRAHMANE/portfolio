"use client";

import VirtualRLandingPage from "@/assets/images/VirtualR.webp";
import HRMImage from "@/assets/images/veneroo.webp";
import MedicareplusImage from "@/assets/images/medicareplus.webp";
import DefpImage from "@/assets/images/mng.jpg";
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import Image from "next/image";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";

const portfolioProjects = [
  {
    company: "EquipTrack",
    year: "2025",
    title: "Equipment Tracking & Movement",
    results: [
      { title: "Manage all equipment in one place" },
      { title: "Track equipment movements between services" },
      { title: "Filter by department or service" },
      {
        title: "Easily add new equipment",
      },
      { title: "Status indicators: available, moved, or broken" },
      { title: "Visualize usage with movement charts" },
    ],
    link: "https://github.com/ABDERRAHMANERAQUIBI/EquipTrack",
    image: DefpImage,
    text: "GitHub Source Code",
    color: "from-blue-500 to-violet-500",
  },
  {
    company: "Veneroo",
    year: "2024",
    title: "ERP Project",
    results: [
      { title: "Implemented efficient attendance tracking system" },
      { title: "Developed robust absence recording features" },
      { title: "Integrated holiday management functionality" },
      { title: "Optimized employee salary processing" },
      { title: "Streamlined project management tools" },
    ],
    link: "https://buymeacoffee.com/anaser_25/e/298045",
    image: HRMImage,
    text: "Get Source Code",
    color: "from-violet-500 to-purple-500",
  },
  {
    company: "Academic",
    year: "2024",
    title: "VirtualR Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://buymeacoffee.com/anaser_25/e/297849",
    image: VirtualRLandingPage,
    text: "Get Source Code",
    color: "from-purple-500 to-pink-500",
  },
  {
    company: "Veneroo",
    year: "2023",
    title: "Medical website",
    results: [
      { title: "Developing a medical website" },
      { title: "Develeped and maintained client websites" },
      { title: "Collaborated with cross-functional teams" },
      {
        title: "Implemented responsive design and cross-browser compatibility",
      },
    ],
    link: "https://medicareplus.ma/",
    image: MedicareplusImage,
    text: "Vist Live Site",
    color: "from-pink-500 to-red-500",
  },
];

export const ProjectsSection = () => {
  return (
    <section className="py-16 lg:py-24 scroll-smooth" id="project">
      <div className="container">
        <HeaderSection
          eyebrow="CURATED WORK"
          title="Featured Case Studies"
          description="Compilation of case studies that evoke my sense of pride"
        />
        <div className="mt-10 md:mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {portfolioProjects.map((project, projectIndex) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: projectIndex * 0.1 }}
            >
              <Card className="group relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, ${project.color})` }}
                />
                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex font-bold uppercase tracking-widest text-sm gap-2 text-transparent bg-clip-text">
                      <span>{project.company}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-6">
                    {project.title}
                  </h3>
                  <div className="relative aspect-video mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading={projectIndex < 2 ? "eager" : "lazy"}
                      priority={projectIndex < 2}
                    />
                  </div>
                  <ul className="space-y-3 mb-6">
                    {project.results.map((result) => (
                      <motion.li
                        key={result.title}
                        className="flex items-start gap-3 text-sm md:text-base text-white/70"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckIcon className="size-5 md:size-6 flex-shrink-0 mt-0.5" />
                        <span>{result.title}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.a
                    href={project.link}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{project.text}</span>
                    <ArrowUpRightIcon className="size-4" />
                  </motion.a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
