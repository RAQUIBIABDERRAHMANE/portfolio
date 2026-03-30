"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { PageGuard } from "@/components/PageGuard";
import { Card } from "@/components/Card";
import {
  Github,
  Star,
  GitFork,
  CheckCircle,
  Code2,
  ExternalLink,
} from "lucide-react";

interface Contribution {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  stars: number;
  forks: number;
  link: string;
  color: string;
}

export default function ContributePage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contributions')
      .then(res => res.json())
      .then(data => {
        const mapped = (data.contributions || []).map((c: any) => {
          let techParsed = [];
          try { techParsed = JSON.parse(c.techStack); } catch {}
          return { ...c, techStack: techParsed };
        });
        setContributions(mapped);
      })
      .catch(err => console.error("Failed to fetch contributions", err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <PageGuard pagePath="contribute">
      <Header />
      <main className="min-h-screen bg-[#020617] pt-28 pb-20">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-[100px]"
            style={{
              background: "radial-gradient(circle, #00fff9 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(0,255,249,0.1)]">
              <Code2 size={14} />
              Open Source
            </div>
            <h1
              className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight"
              style={{ textShadow: "0 0 40px rgba(0,255,249,0.3)" }}
            >
              Build With <span className="text-cyan-400">Me</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Explore my open-source projects. Feel free to contribute, open issues, or submit pull requests. Let&apos;s build something amazing together!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <div className="size-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                <p className="mt-4 text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">Loading Repositories...</p>
              </div>
            ) : contributions.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 mb-4">
                  <Github size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No contributions listed yet</h3>
                <p className="text-gray-500">I&apos;m currently working on some exciting new projects.</p>
              </div>
            ) : (
              contributions.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                <Card className="h-full flex flex-col p-6 border-gray-800 hover:border-cyan-500/30 group transition-all duration-300 relative overflow-hidden">
                  {/* Subtle top glare */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.color} opacity-50`} />

                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div className={`size-12 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-10 flex items-center justify-center`}>
                       <Github className="text-white" size={24} />
                    </div>
                    <div className="flex gap-3 text-sm font-bold text-gray-400 mt-2">
                      <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                        <Star size={16} /> {project.stars}
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                        <GitFork size={16} /> {project.forks}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>

                  <div className="space-y-6 mt-auto">
                    <div className="flex flex-wrap gap-2">
                       {project.techStack.map(tech => (
                         <span key={tech} className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                           {tech}
                         </span>
                       ))}
                    </div>

                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-800/80 text-white font-bold hover:bg-cyan-500 text-sm transition-all hover:text-gray-950 group/btn"
                    >
                      <Github size={18} />
                      Contribute on GitHub
                      <ExternalLink size={16} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            )))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,255,249,0.1)]">
               <CheckCircle size={20} />
               <p className="font-bold text-sm">New repositories are added regularly. Follow me to stay updated!</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </PageGuard>
  );
}
