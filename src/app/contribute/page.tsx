"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { PageGuard } from "@/components/PageGuard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Github,
  Star,
  GitFork,
  CheckCircle,
  Code2,
  ExternalLink,
  BookOpen,
  X,
  Loader2,
  AlertTriangle,
  GitPullRequest,
  Eye,
  Zap,
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

interface GhStats {
  stars: number;
  forks: number;
  live: boolean; // true once fetched from GitHub
}

// ── 3D Tilt Card ───────────────────────────────────────────────────────────────
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── README Modal ───────────────────────────────────────────────────────────────
function ReadmeModal({
  project,
  onClose,
}: {
  project: Contribution;
  onClose: () => void;
}) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const match = project.link.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      setError("Invalid GitHub URL");
      setLoading(false);
      return;
    }
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");

    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`)
      .then(async (res) => {
        if (!res.ok) throw new Error("README not found");
        const data = await res.json();
        // Properly decode base64 → UTF-8 (atob alone breaks multi-byte chars)
        const base64 = data.content.replace(/\n/g, "");
        const binaryStr = atob(base64);
        const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
        const decoded = new TextDecoder("utf-8").decode(bytes);
        setReadme(decoded);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [project.link]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-gray-900 border border-gray-700 shadow-[0_0_80px_rgba(0,255,249,0.15)] overflow-hidden"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800 bg-gradient-to-r ${project.color} bg-opacity-10 relative`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-[0.06]`} />
          <div className="relative flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${project.color}`}>
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{project.title}</h2>
              <p className="text-xs text-gray-400 font-mono">README.md</p>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm font-bold text-gray-300 hover:text-white hover:border-cyan-500/50 transition-all"
            >
              <Github size={16} />
              Open Repo
              <ExternalLink size={13} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-cyan-400" size={36} />
              <p className="text-gray-400 font-mono text-sm animate-pulse">Fetching README from GitHub...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <AlertTriangle size={36} className="text-amber-400" />
              <p className="text-white font-bold">Could not load README</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-all"
              >
                <Github size={16} /> View on GitHub
              </a>
            </div>
          ) : (
            <article className="prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme!}</ReactMarkdown>
            </article>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center gap-4 bg-gray-950/50">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-gray-800 text-gray-400 border border-gray-700"
            >
              {t}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" />{project.stars}</span>
            <span className="flex items-center gap-1"><GitFork size={12} className="text-blue-400" />{project.forks}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Contribution Card ──────────────────────────────────────────────────────────
function ContributionCard({
  project,
  index,
  onReadme,
  isLive = false,
}: {
  project: Contribution;
  index: number;
  onReadme: (p: Contribution) => void;
  isLive?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
      className="h-full"
      style={{ perspective: "1200px" }}
    >
      <TiltCard className="h-full group">
        <div
          className="relative h-full flex flex-col rounded-3xl border border-gray-800 bg-gray-950/60 backdrop-blur-md overflow-hidden
            transition-all duration-500
            group-hover:border-transparent group-hover:shadow-[0_0_60px_rgba(0,255,249,0.15)]"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Animated border gradient on hover */}
          <div
            className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
            style={{
              background: `linear-gradient(var(--angle, 135deg), transparent 40%, rgba(0,255,249,0.25), transparent 60%)`,
              padding: "1px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Gradient color wash (bg tint) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none`} />

          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.color} opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_12px_rgba(0,255,249,0.6)] transition-all duration-500`} />

          {/* Corner glow */}
          <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />

          {/* Content */}
          <div className="relative z-10 p-6 flex flex-col h-full">
            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              {/* Icon */}
              <div className={`relative size-14 rounded-2xl p-[1.5px] bg-gradient-to-br ${project.color} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center">
                  <Github size={26} className="text-white group-hover:text-cyan-300 transition-colors duration-300" />
                </div>
                {/* Pulse ring */}
                <span className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.color} animate-ping opacity-0 group-hover:opacity-20`} />
              </div>

              {/* Stats */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-400">
                    <Star size={11} className="fill-yellow-400" /> {project.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                    <GitFork size={11} /> {project.forks.toLocaleString()}
                  </span>
                </div>
                {isLive ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Live from GitHub
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <span className="size-1.5 rounded-full bg-gray-600 inline-block" />
                    Open Source
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 tracking-tight leading-tight">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow group-hover:text-gray-300 transition-colors line-clamp-3">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-gray-900 text-gray-400 border border-gray-800 group-hover:border-cyan-500/30 group-hover:text-cyan-200 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              {/* View README */}
              <button
                onClick={() => onReadme(project)}
                className="relative flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-700 text-gray-300 text-sm font-bold overflow-hidden
                  hover:border-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all duration-300"
              >
                <BookOpen size={15} />
                <span>README</span>
                {/* Shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>

              {/* Contribute */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black text-gray-950 bg-gradient-to-r ${project.color}
                  hover:shadow-[0_0_25px_rgba(0,255,249,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden`}
              >
                <GitPullRequest size={15} />
                <span>Contribute</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            </div>
          </div>

          {/* Bottom scan line effect */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-50`}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </TiltCard>
    </motion.div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

async function fetchGhStats(url: string): Promise<{ stars: number; forks: number } | null> {
  const parsed = parseGithubUrl(url);
  if (!parsed) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
  } catch {
    return null;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ContributePage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReadme, setActiveReadme] = useState<Contribution | null>(null);
  const [ghStats, setGhStats] = useState<Record<number, GhStats>>({});

  useEffect(() => {
    fetch("/api/contributions")
      .then((res) => res.json())
      .then((data) => {
        const mapped: Contribution[] = (data.contributions || []).map((c: any) => {
          let techParsed: string[] = [];
          try { techParsed = JSON.parse(c.techStack); } catch {}
          return { ...c, techStack: techParsed };
        });
        setContributions(mapped);

        // Fetch live GitHub stats in parallel for every repo
        mapped.forEach((c) => {
          fetchGhStats(c.link).then((stats) => {
            if (!stats) return;
            setGhStats((prev) => ({
              ...prev,
              [c.id]: { stars: stats.stars, forks: stats.forks, live: true },
            }));
          });
        });
      })
      .catch((err) => console.error("Failed to fetch contributions", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageGuard pagePath="contribute">
      <Header />

      <main className="min-h-screen bg-[#020617] pt-28 pb-20 relative overflow-hidden">
        {/* Background glows */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07] blur-[120px]"
            style={{ background: "radial-gradient(circle, #00fff9 0%, #2563eb 50%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.05] blur-[100px]"
            style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
          />
        </div>

        <div className="container max-w-6xl mx-auto px-4">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-black uppercase tracking-widest mb-8 shadow-[0_0_30px_rgba(0,255,249,0.1)]"
            >
              <Zap size={13} className="fill-cyan-400" />
              Open Source — Contributions Welcome
            </motion.div>

            <h1
              className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-none"
              style={{ textShadow: "0 0 60px rgba(0,255,249,0.3)" }}
            >
              Build With{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Me
                </span>
                <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-cyan-400/30 to-blue-500/30 -z-10 rounded-xl" />
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Explore my open-source projects. Dive into the README, open issues, or
              submit pull requests — let&apos;s build something incredible together.
            </p>

            {/* Stats row */}
            {!loading && contributions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex items-center justify-center gap-8"
              >
                {[
                  { icon: <Github size={16} />, label: "Repositories", value: contributions.length },
                  {
                    icon: <Star size={16} className="fill-yellow-400 text-yellow-400" />,
                    label: "Total Stars",
                    value: contributions.reduce((a, c) => a + (ghStats[c.id]?.stars ?? c.stars), 0),
                  },
                  {
                    icon: <GitFork size={16} className="text-blue-400" />,
                    label: "Total Forks",
                    value: contributions.reduce((a, c) => a + (ghStats[c.id]?.forks ?? c.forks), 0),
                  },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
                      {stat.icon}
                      <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* ── Cards ────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="size-14 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">
                Loading Repositories...
              </p>
            </div>
          ) : contributions.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-gray-900 border border-gray-800 mb-6">
                <Github size={36} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">No contributions listed yet</h3>
              <p className="text-gray-500">I&apos;m currently working on some exciting new projects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {contributions.map((project, idx) => {
                const live = ghStats[project.id];
                const displayProject = live
                  ? { ...project, stars: live.stars, forks: live.forks }
                  : project;
                return (
                  <ContributionCard
                    key={project.id}
                    project={displayProject}
                    index={idx}
                    onReadme={setActiveReadme}
                    isLive={!!live?.live}
                  />
                );
              })}
            </div>
          )}

          {/* ── Footer CTA ───────────────────────────────────────────── */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-24 text-center"
            >
              <div className="inline-flex items-center gap-3 px-8 py-5 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-300 shadow-[0_0_40px_rgba(0,255,249,0.08)]">
                <CheckCircle size={22} className="text-cyan-400" />
                <p className="font-bold">
                  New repositories are added regularly.{" "}
                  <a
                    href="https://github.com/abderrahmaneraquibi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-white transition-colors"
                  >
                    Follow me on GitHub
                  </a>{" "}
                  to stay updated!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── README Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeReadme && (
          <ReadmeModal project={activeReadme} onClose={() => setActiveReadme(null)} />
        )}
      </AnimatePresence>
    </PageGuard>
  );
}
