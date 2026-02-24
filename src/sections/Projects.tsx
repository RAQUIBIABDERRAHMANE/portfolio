"use client";

import VirtualRLandingPage from "@/assets/images/VirtualR.webp";
import POS from "@/assets/images/pos.webp";
import MedicareplusImage from "@/assets/images/medicareplus.webp";
import DefpImage from "@/assets/images/mng.jpg";
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import Image from "next/image";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

// Static fallback projects (used when database is empty)
const staticProjects = [
  {
    company: "EquipTrack",
    year: "2025",
    title: "Equipment Tracking & Movement",
    results: [
      { title: "Manage all equipment in one place" },
      { title: "Track equipment movements between services" },
      { title: "Filter by department or service" },
      { title: "Easily add new equipment" },
      { title: "Status indicators: available, moved, or broken" },
      { title: "Visualize usage with movement charts" },
    ],
    link: "https://github.com/ABDERRAHMANERAQUIBI/EquipTrack",
    image: DefpImage as any,
    text: "GitHub Source Code",
    color: "from-blue-500 to-violet-500",
  },
  {
    company: "First POS",
    year: "2025",
    title: "POS System",
    results: [
      { title: "Modern web-based architecture system" },
      { title: "Real-time performance and scalability" },
      { title: "Cross-platform device accessibility everywhere" },
      { title: "Cost-effective implementation and setup" },
      { title: "Easy maintenance and updates" },
    ],
    link: "https://github.com/RAQUIBIABDERRAHMANE/POS",
    image: POS as any,
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
    image: VirtualRLandingPage as any,
    text: "Get Source Code",
    color: "from-purple-500 to-pink-500",
  },
  {
    company: "Veneroo",
    year: "2023",
    title: "Medical website",
    results: [
      { title: "Developing a medical website" },
      { title: "Developed and maintained client websites" },
      { title: "Collaborated with cross-functional teams" },
      { title: "Implemented responsive design and cross-browser compatibility" },
    ],
    link: "https://medicareplus.ma/",
    image: MedicareplusImage as any,
    text: "Visit Live Site",
    color: "from-pink-500 to-red-500",
  },
];

interface DBProject {
  id: number;
  title: string;
  company: string;
  year: string;
  description: string;
  results: string;
  link: string;
  link_text: string;
  image_url: string;
  color: string;
  download_files: string; // JSON array
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
}

export const ProjectsSection = () => {
  const [dbProjects, setDbProjects] = useState<DBProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => {
        if (!r.ok) {
          console.error("[Projects] API error:", r.status, r.statusText);
          return { projects: [] };
        }
        return r.json();
      })
      .then((data) => {
        console.log("[Projects] API response:", data.projects?.length, "projects");
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setDbProjects(data.projects);
        }
      })
      .catch((err) => { console.error("[Projects] fetch failed:", err); })
      .finally(() => setLoaded(true));
  }, []);

  // Build unified project list: DB projects if any, otherwise static fallback
  const portfolioProjects = loaded && dbProjects.length > 0
    ? dbProjects.map((p) => {
        let results: { title: string }[] = [];
        try { results = JSON.parse(p.results); } catch { results = []; }
        let downloads: { name: string; url: string; filename: string }[] = [];
        try { downloads = JSON.parse(p.download_files || '[]'); } catch { downloads = []; }
        return {
          company: p.company,
          year: p.year,
          title: p.title,
          results,
          link: p.link,
          image: p.image_url || null,
          text: p.link_text,
          color: p.color,
          downloads,
        };
      })
    : staticProjects.map(p => ({ ...p, downloads: [] as { name: string; url: string; filename: string }[] }));

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
                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, #00fff9, #00d4ff, #a855f7, #00fff9)',
                    backgroundSize: '200% 200%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="absolute inset-[1px] bg-cyber-card rounded-2xl z-10" />
                
                {/* Holographic effect overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 249, 0.1) 0%, transparent 70%)',
                  }}
                />
                
                <div className="relative z-30 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className="font-bold uppercase tracking-widest text-sm gap-2 font-mono"
                      style={{
                        background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: '0 0 10px rgba(0, 255, 249, 0.5)',
                      }}
                      whileHover={{
                        textShadow: '0 0 20px rgba(0, 255, 249, 0.8)',
                      }}
                    >
                      <span>{project.company}</span>
                      <span className="mx-2">•</span>
                      <span>{project.year}</span>
                    </motion.div>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-6 glow-text">
                    {project.title}
                  </h3>
                  <div className="relative aspect-video mb-6 overflow-hidden rounded-lg group/image">
                    <div className="absolute inset-0 z-10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.2) 0%, transparent 50%)',
                      }}
                    />
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading={projectIndex < 2 ? "eager" : "lazy"}
                        priority={projectIndex < 2}
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 flex items-center justify-center`}>
                        <span className="text-white/30 text-4xl font-black uppercase tracking-widest">{project.company?.charAt(0)}</span>
                      </div>
                    )}
                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-neon-cyan opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-neon-cyan opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  </div>
                  <ul className="space-y-3 mb-6">
                    {project.results.map((result, idx) => (
                      <motion.li
                        key={result.title}
                        className="flex items-start gap-3 text-sm md:text-base text-white/70 group/item"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                          transitionDelay: `${idx * 0.1}s`,
                        }}
                      >
                        <motion.div
                          whileHover={{
                            rotate: 360,
                            scale: 1.2,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckIcon className="size-5 md:size-6 flex-shrink-0 mt-0.5" style={{ color: '#00fff9' }} />
                        </motion.div>
                        <span className="group-hover/item:text-neon-cyan transition-colors duration-300">{result.title}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.a
                    href={project.link}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg relative overflow-hidden group/btn"
                    style={{
                      background: 'rgba(0, 255, 249, 0.1)',
                      border: '1px solid rgba(0, 255, 249, 0.5)',
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(0, 255, 249, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 text-neon-cyan font-medium">{project.text}</span>
                    <ArrowUpRightIcon className="size-4 relative z-10" style={{ color: '#00fff9' }} />
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'rgba(0, 255, 249, 0.2)' }}
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>

                  {/* Download buttons */}
                  {project.downloads && project.downloads.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.downloads.map((dl) => (
                        <motion.a
                          key={dl.url}
                          href={`/api/download?path=${encodeURIComponent(dl.url.replace(/^\//, ''))}`}
                          download={dl.filename || dl.name || true}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg relative overflow-hidden group/dl"
                          style={{
                            background: 'rgba(168, 85, 247, 0.08)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                          }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: '0 0 16px rgba(168, 85, 247, 0.35)',
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Download size={14} className="text-purple-400 relative z-10 flex-shrink-0" />
                          <span className="relative z-10 text-purple-300 font-medium text-sm">{dl.name}</span>
                          <motion.div
                            className="absolute inset-0"
                            style={{ background: 'rgba(168, 85, 247, 0.15)' }}
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
