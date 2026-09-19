"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { PageGuard } from "@/components/PageGuard";
import { ContributionChatModal } from "./ContributionChatModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Github,
  Star,
  GitFork,
  Code2,
  ExternalLink,
  BookOpen,
  X,
  Loader2,
  AlertTriangle,
  GitPullRequest,
  Zap,
  Search,
  Copy,
  Check,
  Coffee,
  Share2,
  Terminal,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Flame,
  Tag,
  MessageSquare,
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
  live: boolean;
}

interface RealGitHubIssue {
  id: string;
  number: number;
  projectTitle: string;
  projectColor: string;
  repoUrl: string;
  title: string;
  body: string;
  labels: { name: string; color: string }[];
  html_url: string;
  created_at: string;
  comments: number;
  author: string;
  isGoodFirstIssue: boolean;
  isHelpWanted: boolean;
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
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 300, damping: 30 });

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
        if (!res.ok) throw new Error("README not found on GitHub");
        const data = await res.json();
        const base64 = data.content.replace(/\n/g, "");
        const binaryStr = atob(base64);
        const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
        const decoded = new TextDecoder("utf-8").decode(bytes);
        setReadme(decoded);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [project.link]);

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
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" />

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
              aria-label="Close modal"
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
            <article className="prose prose-invert max-w-none text-gray-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme!}</ReactMarkdown>
            </article>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex flex-wrap items-center gap-2 md:gap-4 bg-gray-950/50">
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

// ── 🎯 Help Wanted & Good First Issues Board ─────────────────────────────────
function HelpWantedBoard({
  contributions,
  loading,
}: {
  contributions: Contribution[];
  loading: boolean;
}) {
  const [issues, setIssues] = useState<RealGitHubIssue[]>([]);
  const [fetchingIssues, setFetchingIssues] = useState(false);
  const [filterType, setFilterType] = useState<string>("All");
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (contributions.length === 0) {
      setIssues([]);
      return;
    }

    setFetchingIssues(true);
    const fetchPromises = contributions.map(async (c) => {
      const match = c.link.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return [];
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");

      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${cleanRepo}/issues?state=open&per_page=10`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];

        return data
          .filter((i: any) => !i.pull_request)
          .map((i: any): RealGitHubIssue => {
            const rawLabels: { name: string; color: string }[] = (i.labels || []).map((l: any) => ({
              name: l.name,
              color: l.color || "00fff9",
            }));

            const isGoodFirstIssue = rawLabels.some((l) =>
              l.name.toLowerCase().includes("good first") ||
              l.name.toLowerCase().includes("good-first")
            );

            const isHelpWanted = rawLabels.some((l) =>
              l.name.toLowerCase().includes("help wanted") ||
              l.name.toLowerCase().includes("help-wanted")
            );

            return {
              id: `${cleanRepo}-${i.id}`,
              number: i.number,
              projectTitle: c.title,
              projectColor: c.color,
              repoUrl: c.link,
              title: i.title,
              body: i.body || "No detailed description provided on GitHub.",
              labels: rawLabels,
              html_url: i.html_url,
              created_at: i.created_at,
              comments: i.comments ?? 0,
              author: i.user?.login || "anonymous",
              isGoodFirstIssue,
              isHelpWanted,
            };
          });
      } catch (err) {
        console.error(`Failed to fetch issues for ${cleanRepo}:`, err);
        return [];
      }
    });

    Promise.all(fetchPromises)
      .then((results) => {
        setIssues(results.flat());
      })
      .finally(() => setFetchingIssues(false));
  }, [contributions]);

  const projects = useMemo(() => {
    return ["All", ...Array.from(new Set(issues.map((o) => o.projectTitle)))];
  }, [issues]);

  const filteredTasks = useMemo(() => {
    return issues.filter((task) => {
      const matchProject = projectFilter === "All" || task.projectTitle === projectFilter;
      let matchLabel = true;
      if (filterType === "good-first") {
        matchLabel = task.isGoodFirstIssue;
      } else if (filterType === "help-wanted") {
        matchLabel = task.isHelpWanted;
      }
      return matchProject && matchLabel;
    });
  }, [issues, filterType, projectFilter]);

  const copyTaskTitle = (task: RealGitHubIssue) => {
    navigator.clipboard.writeText(`${task.title} (${task.projectTitle} #${task.number})`);
    setCopiedId(task.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || fetchingIssues) {
    return (
      <section className="mb-24">
        <div className="rounded-3xl border border-gray-800 bg-gray-950/40 p-12 text-center">
          <Loader2 className="animate-spin text-cyan-400 size-8 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-mono animate-pulse">
            Scanning repositories for live open issues...
          </p>
        </div>
      </section>
    );
  }

  if (contributions.length === 0) {
    return (
      <section className="mb-24">
        <div className="relative rounded-3xl border border-gray-800 bg-gray-950/60 backdrop-blur-md p-8 md:p-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-inner">
            <GitPullRequest size={24} />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3">
            Dynamic GitHub Sync
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            Open Tasks & Good First Issues
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Tasks in this section are dynamically fetched in real time directly from the repositories you configure. Once you add repositories via the Admin Dashboard, any open GitHub issues and Good First Issues will appear here automatically.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://github.com/RAQUIBIABDERRAHMANE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:text-white hover:border-cyan-500/50 transition-all"
            >
              <Github size={14} />
              Explore GitHub Profile
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (issues.length === 0) {
    return (
      <section className="mb-24">
        <div className="relative rounded-3xl border border-gray-800 bg-gray-950/60 backdrop-blur-md p-8 md:p-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-inner">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3">
            All Clear
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            No Open Issues Across Repositories
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            All configured repositories currently have 0 open issues! Have an enhancement idea, feature request, or spotted a bug? Open a new issue directly on GitHub.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`${contributions[0]?.link.replace(/\/$/, "")}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-950 text-xs font-black hover:shadow-[0_0_20px_rgba(0,255,249,0.3)] transition-all"
            >
              <span>Propose an Issue on GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  const goodFirstCount = issues.filter((t) => t.isGoodFirstIssue).length;
  const helpWantedCount = issues.filter((t) => t.isHelpWanted).length;

  return (
    <section className="mb-24">
      {/* Live Ticker Bar */}
      <div className="relative rounded-2xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md p-3 px-4 mb-8 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Flame size={14} className="text-emerald-400" />
            Live GitHub Issue Ticker
          </span>
        </div>
        <p className="hidden md:block text-xs font-mono text-gray-300 truncate">
          <span className="text-cyan-400 font-bold">{issues.length} active issues</span> found across your configured repositories — Pick a task and submit a PR!
        </p>
        <span className="text-xs font-mono text-cyan-400 font-bold flex-shrink-0">
          Live Synced
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3">
            Live Repositories
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Help Wanted & Good First Issues
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
            Live issues fetched directly from your repositories. Pick a task, open a branch, and submit your pull request!
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("All")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === "All"
                ? "bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(0,255,249,0.15)]"
                : "bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            All Issues <span className="opacity-60 ml-1">({issues.length})</span>
          </button>

          {goodFirstCount > 0 && (
            <button
              onClick={() => setFilterType("good-first")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "good-first"
                  ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-gray-200"
              }`}
            >
              Good First Issue <span className="opacity-60 ml-1">({goodFirstCount})</span>
            </button>
          )}

          {helpWantedCount > 0 && (
            <button
              onClick={() => setFilterType("help-wanted")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "help-wanted"
                  ? "bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  : "bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-gray-200"
              }`}
            >
              Help Wanted <span className="opacity-60 ml-1">({helpWantedCount})</span>
            </button>
          )}

          {projects.length > 2 && (
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-900 border border-gray-800 text-gray-300 focus:outline-none focus:border-cyan-500"
            >
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All Repos" : p}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="group relative rounded-3xl border border-gray-800 bg-gray-950/70 backdrop-blur-md p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,255,249,0.08)] transition-all duration-300"
          >
            <div>
              {/* Top row: Project & Issue number */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 text-xs font-bold text-cyan-300">
                  <Code2 size={13} />
                  {task.projectTitle}
                </span>

                <span className="text-xs font-mono text-gray-400">
                  #{task.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                {task.title}
              </h3>

              {/* Description snippet */}
              <p className="text-gray-400 text-xs leading-relaxed mb-5 line-clamp-3">
                {task.body}
              </p>

              {/* Labels with real GitHub colors */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {task.labels.length > 0 ? (
                  task.labels.map((lbl) => (
                    <span
                      key={lbl.name}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `#${lbl.color}15`,
                        borderColor: `#${lbl.color}40`,
                        color: `#${lbl.color}`,
                      }}
                    >
                      <Tag size={10} />
                      {lbl.name}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-gray-800 bg-gray-900/60 text-gray-400">
                    <Tag size={10} />
                    Open Task
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-800/80">
              <a
                href={task.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-950 text-xs font-black hover:shadow-[0_0_20px_rgba(0,255,249,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>View on GitHub #{task.number}</span>
                <ArrowUpRight size={13} />
              </a>

              <button
                onClick={() => copyTaskTitle(task)}
                className="p-2.5 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-700 text-gray-400 hover:text-white transition-all"
                title="Copy issue info"
                aria-label="Copy issue title"
              >
                {copiedId === task.id ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Contribution Card ──────────────────────────────────────────────────────────
function ContributionCard({
  project,
  index,
  onReadme,
  onChat,
  isLive = false,
}: {
  project: Contribution;
  index: number;
  onReadme: (p: Contribution) => void;
  onChat?: (p: Contribution) => void;
  isLive?: boolean;
}) {
  const issuesUrl = `${project.link.replace(/\/$/, "")}/issues?q=is%3Aissue+is%3Aopen`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
      className="h-full"
      style={{ perspective: "1200px" }}
    >
      <TiltCard className="h-full group">
        <div
          className="relative h-full flex flex-col rounded-3xl border border-gray-800 bg-gray-950/60 backdrop-blur-md overflow-hidden
            transition-all duration-500 group-hover:border-cyan-500/40 group-hover:shadow-[0_0_50px_rgba(0,255,249,0.12)]"
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.color} opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_12px_rgba(0,255,249,0.6)] transition-all duration-500`} />

          {/* Corner glow */}
          <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />

          <div className="relative z-10 p-6 flex flex-col h-full">
            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              <div className={`relative size-14 rounded-2xl p-[1.5px] bg-gradient-to-br ${project.color} group-hover:scale-105 transition-transform duration-500 shadow-lg`}>
                <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center">
                  <Github size={26} className="text-white group-hover:text-cyan-300 transition-colors duration-300" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
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
                    Live GitHub Sync
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
            <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-grow group-hover:text-gray-300 transition-colors line-clamp-3">
              {project.description}
            </p>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-gray-900/90 text-gray-400 border border-gray-800 group-hover:border-cyan-500/30 group-hover:text-cyan-200 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className={`grid ${onChat ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"} gap-2 mt-auto pt-2 border-t border-gray-800/80`}>
              {/* View README */}
              <button
                onClick={() => onReadme(project)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-gray-800 bg-gray-900/60 text-gray-300 text-xs font-bold
                  hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                title="View README"
              >
                <BookOpen size={14} />
                <span>README</span>
              </button>

              {/* Chat Button */}
              {onChat && (
                <button
                  onClick={() => onChat(project)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-gray-800 bg-gray-900/60 text-gray-300 text-xs font-bold
                    hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                  title="Project Chat"
                >
                  <MessageSquare size={13} className="text-cyan-400" />
                  <span>Chat</span>
                </button>
              )}

              {/* Issues shortcut */}
              <a
                href={issuesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-gray-800 bg-gray-900/60 text-gray-300 text-xs font-bold
                  hover:border-amber-500/50 hover:text-amber-300 hover:bg-amber-500/10 transition-all"
                title="View Open Issues"
              >
                <AlertTriangle size={13} className="text-amber-400" />
                <span>Issues</span>
              </a>

              {/* Direct PR / Contribute */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-black text-gray-950 bg-gradient-to-r ${project.color}
                  hover:shadow-[0_0_20px_rgba(0,255,249,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all`}
                title="Contribute on GitHub"
              >
                <GitPullRequest size={14} />
                <span>PR</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

// ── How to Contribute Guide ───────────────────────────────────────────────────
function ContributionGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "Fork & Clone",
      desc: "Fork the repository to your GitHub account and clone it to your local environment.",
      cmd: "git clone https://github.com/RAQUIBIABDERRAHMANE/<repo>.git",
      icon: <GitFork size={20} className="text-cyan-400" />,
      accent: "from-cyan-500 to-blue-500",
    },
    {
      num: "02",
      title: "Create Feature Branch",
      desc: "Create a descriptive branch for your feature or bug fix using conventional prefixes.",
      cmd: "git checkout -b feat/your-feature-name",
      icon: <Terminal size={20} className="text-purple-400" />,
      accent: "from-purple-500 to-pink-500",
    },
    {
      num: "03",
      title: "Submit Pull Request",
      desc: "Commit clean code with tests, push your branch, and open a Pull Request linking any issues.",
      cmd: "git push origin feat/your-feature-name",
      icon: <GitPullRequest size={20} className="text-emerald-400" />,
      accent: "from-emerald-500 to-cyan-500",
    },
  ];

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="mb-24">
      <div className="text-center mb-10">
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3">
          Workflow
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          How to Contribute in 3 Steps
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mt-2">
          Whether fixing a bug, adding documentation, or proposing an architectural enhancement — all contributions are valued!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12, duration: 0.5 }}
            className="relative rounded-3xl border border-gray-800 bg-gray-950/70 backdrop-blur-md p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-black text-white/20 group-hover:text-cyan-400/80 transition-colors">
                  {step.num}
                </span>
                <div className="p-2.5 rounded-2xl bg-gray-900 border border-gray-800 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {step.desc}
              </p>
            </div>

            {/* Terminal snippet */}
            <div className="rounded-xl bg-gray-900/90 border border-gray-800 p-3 flex items-center justify-between gap-2 font-mono text-xs text-gray-300">
              <span className="truncate text-cyan-300/90 select-all">$ {step.cmd}</span>
              <button
                onClick={() => copyCommand(step.cmd, idx)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-gray-400 transition-all flex-shrink-0"
                title="Copy snippet"
                aria-label="Copy command snippet"
              >
                {copiedIndex === idx ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Support & Sponsor Section ─────────────────────────────────────────────────
function SupportSection() {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="mt-28 mb-12">
      <div className="relative rounded-3xl border border-gray-800 bg-gradient-to-b from-gray-900/60 to-gray-950/80 backdrop-blur-xl p-8 md:p-12 overflow-hidden shadow-[0_0_60px_rgba(0,255,249,0.06)]">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} className="text-purple-400" />
            Support Open Source
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Ways to Support Without Writing Code
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
            Not writing code today? You can still make a huge impact by starring repositories, fueling development, or sharing this work with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: Star on GitHub */}
          <div className="rounded-2xl border border-gray-800/80 bg-gray-900/40 p-6 flex flex-col justify-between hover:border-yellow-500/30 transition-all">
            <div>
              <div className="size-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4">
                <Star size={22} className="fill-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Star Repositories</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Giving a star on GitHub boosts repository visibility and helps other developers discover open-source projects.
              </p>
            </div>
            <a
              href="https://github.com/RAQUIBIABDERRAHMANE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold text-xs transition-all"
            >
              <Github size={15} />
              Star on GitHub
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Card 2: Buy Me a Coffee */}
          <div className="rounded-2xl border border-gray-800/80 bg-gray-900/40 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all">
            <div>
              <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Coffee size={22} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Buy Me a Coffee</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Directly sponsor tools, hosting servers, and late-night coding sessions with a one-time or monthly coffee.
              </p>
            </div>
            <a
              href="https://buymeacoffee.com/abderrahmar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 font-black text-xs hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all"
            >
              <Coffee size={15} />
              Support on BuyMeACoffee
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Card 3: Share Portfolio */}
          <div className="rounded-2xl border border-gray-800/80 bg-gray-900/40 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
            <div>
              <div className="size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Share2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Spread the Word</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Know a developer or team looking for modern web solutions? Share this portfolio with your tech circle.
              </p>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 size={15} />
                  <span>Copy Portfolio Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────────
export default function ContributePage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReadme, setActiveReadme] = useState<Contribution | null>(null);
  const [activeChat, setActiveChat] = useState<Contribution | null>(null);
  const [ghStats, setGhStats] = useState<Record<number, GhStats>>({});

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("All");

  useEffect(() => {
    fetch("/api/contributions")
      .then((res) => res.json())
      .then((data) => {
        const mapped: Contribution[] = (data.contributions || []).map((c: any) => {
          let techParsed: string[] = [];
          try { techParsed = JSON.parse(c.techStack); } catch { }
          return { ...c, techStack: techParsed };
        });
        setContributions(mapped);

        // Fetch live GitHub stats for loaded repos
        mapped.forEach((c) => {
          const match = c.link.match(/github\.com\/([^/]+)\/([^/]+)/);
          if (!match) return;
          const [, owner, repo] = match;
          const cleanRepo = repo.replace(/\.git$/, "");

          fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
            headers: { Accept: "application/vnd.github+json" },
          })
            .then((r) => r.ok ? r.json() : null)
            .then((stats) => {
              if (!stats) return;
              setGhStats((prev) => ({
                ...prev,
                [c.id]: {
                  stars: stats.stargazers_count ?? 0,
                  forks: stats.forks_count ?? 0,
                  live: true,
                },
              }));
            })
            .catch(() => { });
        });
      })
      .catch((err) => console.error("Failed to fetch contributions", err))
      .finally(() => setLoading(false));
  }, []);

  // Compute available tech categories
  const techCategories = useMemo(() => {
    const set = new Set<string>();
    contributions.forEach((c) => {
      c.techStack.forEach((t) => set.add(t));
    });
    const initialList = Array.from(set);
    if (initialList.length === 0) {
      return ["All", "Laravel", "React", "TypeScript", "Next.js", "PHP"];
    }
    return ["All", ...initialList];
  }, [contributions]);

  // Filtered contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.techStack.some((t) => t.toLowerCase().includes(q));

      const matchesCategory =
        selectedTech === "All" ||
        c.techStack.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [contributions, searchQuery, selectedTech]);

  const totalStars = useMemo(() => {
    return contributions.reduce((acc, c) => acc + (ghStats[c.id]?.stars ?? c.stars), 0);
  }, [contributions, ghStats]);

  const totalForks = useMemo(() => {
    return contributions.reduce((acc, c) => acc + (ghStats[c.id]?.forks ?? c.forks), 0);
  }, [contributions, ghStats]);

  return (
    <PageGuard pagePath="contribute">
      <Header />

      <main className="min-h-screen bg-[#020617] pt-28 pb-20 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07] blur-[140px]"
            style={{ background: "radial-gradient(circle, #00fff9 0%, #2563eb 50%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.05] blur-[120px]"
            style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
          />
        </div>

        <div className="container max-w-6xl mx-auto px-4">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
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
              style={{ textShadow: "0 0 60px rgba(0,255,249,0.25)" }}
            >
              Build With{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Me
                </span>
                <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-cyan-400/30 to-blue-500/30 -z-10 rounded-xl" />
              </span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore my open-source projects, dive into the code, pick up good first issues, or submit pull requests — let&apos;s build fast, accessible software together.
            </p>

            {/* Dynamic Stats Row (When repos are available) */}
            {!loading && contributions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex items-center justify-center gap-8 md:gap-12"
              >
                {[
                  { icon: <Github size={16} />, label: "Repositories", value: contributions.length },
                  { icon: <Star size={16} className="fill-yellow-400 text-yellow-400" />, label: "Total Stars", value: totalStars },
                  { icon: <GitFork size={16} className="text-blue-400" />, label: "Total Forks", value: totalForks },
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

          {/* ── 🎯 Live Help Wanted & Good First Issues Board ───────────── */}
          <HelpWantedBoard contributions={contributions} loading={loading} />

          {/* ── How to Contribute Guide ───────────────────────────────── */}
          <ContributionGuide />

          {/* ── Search & Filter Controls ─────────────────────────────── */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, keywords, or tech..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-gray-900/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status Counter */}
              {!loading && (
                <div className="text-xs font-mono text-gray-400 self-center">
                  Showing <span className="text-cyan-400 font-bold">{filteredContributions.length}</span> of {contributions.length} Repositories
                </div>
              )}
            </div>

            {/* Tech Category Pills */}
            <div className="flex flex-wrap gap-2 items-center">
              {techCategories.map((tech) => {
                const isActive = selectedTech.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${isActive
                        ? "bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(0,255,249,0.2)]"
                        : "bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700"
                      }`}
                  >
                    {tech}
                  </button>
                );
              })}

              {(selectedTech !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTech("All");
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-cyan-400 transition-colors ml-auto"
                >
                  <RotateCcw size={12} />
                  Reset Filters
                </button>
              )}
            </div>
          </section>

          {/* ── Repository Grid / Empty State ─────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="size-14 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">
                Loading Repositories...
              </p>
            </div>
          ) : filteredContributions.length === 0 ? (
            <div className="py-20 px-6 rounded-3xl border border-gray-800 bg-gray-950/50 backdrop-blur-md text-center max-w-2xl mx-auto">
              <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-gray-900 border border-gray-800 mb-6 shadow-inner">
                <Github size={36} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                {searchQuery || selectedTech !== "All"
                  ? "No matching repositories found"
                  : "Open-Source Repositories Coming Soon"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
                {searchQuery || selectedTech !== "All"
                  ? "No repositories match your active search or tech stack filter. Try resetting filters to explore all items."
                  : "I'm actively curating and packaging my open-source projects for public release. In the meantime, you can explore my active GitHub profile or suggest a project you'd love to see open-sourced!"}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {searchQuery || selectedTech !== "All" ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTech("All");
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-sm transition-all"
                  >
                    <RotateCcw size={15} />
                    Reset All Filters
                  </button>
                ) : (
                  <>
                    <a
                      href="https://github.com/RAQUIBIABDERRAHMANE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_25px_rgba(0,255,249,0.35)] text-gray-950 font-black text-sm transition-all"
                    >
                      <Github size={16} />
                      Explore GitHub Profile
                      <ExternalLink size={13} />
                    </a>
                    <a
                      href="/#contact"
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-700 bg-gray-900 hover:border-gray-600 text-gray-200 font-bold text-sm transition-all"
                    >
                      Suggest a Project
                      <ArrowRight size={15} />
                    </a>
                  </>
                )}
              </div>
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
                    onChat={setActiveChat}
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
                <CheckCircle2 size={22} className="text-cyan-400" />
                <p className="font-bold">
                  New repositories are added regularly.{" "}
                  <a
                    href="https://github.com/RAQUIBIABDERRAHMANE"
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

      {/* ── CHAT Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeChat && (
          <ContributionChatModal project={activeChat} onClose={() => setActiveChat(null)} />
        )}
      </AnimatePresence>
    </PageGuard>
  );
}
