"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Send, UserCheck, AlertTriangle, Loader2, ArrowLeft, Github, Terminal, Trash2, LogOut, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/Card";
import Link from "next/link";
import { PageGuard } from "@/components/PageGuard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  user_id: number;
  user_email: string;
  user_role: string;
  message: string;
  created_at: string;
}

export default function StandaloneChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);

  // Verify auth on load
  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push(`/login?redirect=/contribute/${params.id}/chat`);
        } else {
          setCurrentUser(data);
        }
      });
  }, [router, params.id]);

  useEffect(() => {
    // 1. Check membership
    const checkMembership = async () => {
      try {
        const res = await fetch(`/api/contributions/${params.id}/members`);
        if (res.status === 401 || res.status === 403) {
          setIsMember(false);
          return;
        }
        const data = await res.json();
        setIsMember(!!data.isMember);
        if (data.isMember) {
          fetchMessages();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkMembership();
  }, [params.id]);

  useEffect(() => {
    // 2. Fetch project metadata
    fetch(`/api/contributions`)
      .then(res => res.json())
      .then(data => {
        const projList = data.contributions || [];
        const fetchId = Array.isArray(projList) ? projList.find((p: any) => String(p.id) === String(params.id)) : null;
        if (fetchId) {
          setProjectData(fetchId);
        } else {
          setProjectData({ title: "Project Not Found", color: "from-gray-500 to-gray-700" });
        }
      })
      .catch((e) => {
        console.error("Failed to fetch project:", e);
        setProjectData({ title: "Error Loading Project", color: "from-gray-500 to-gray-700" });
      });
  }, [params.id]);

  // Fetch GitHub Issues if link exists
  useEffect(() => {
    if (!projectData?.link) return;
    const match = projectData.link.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return;
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");

    setIssuesLoading(true);
    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/issues?state=open&per_page=5`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setIssues(data.filter(issue => !issue.pull_request));
        }
      })
      .catch(console.error)
      .finally(() => setIssuesLoading(false));
  }, [projectData?.link]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/contributions/${params.id}/chat`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      // Handle
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMember) {
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [isMember, params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contributions/${params.id}/members`, { method: "POST" });
      if (res.ok) {
        setIsMember(true);
        fetchMessages();
      }
    } catch (e) {
    }
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/contributions/${params.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (e) {}
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contributions/${params.id}/chat?messageId=${messageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveProject = async () => {
    if (!confirm("Are you sure you want to leave this project chat?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/contributions/${params.id}/members`, { method: "DELETE" });
      if (res.ok) {
        setIsMember(false);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Gravatar utility generator
  const getAvatar = (email: string) => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${email}&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf`;
  };

  return (
    <PageGuard pagePath="dashboard">
      <Header />
      <main className="min-h-screen bg-[#050816] pt-32 pb-20 text-white relative">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none -z-10 blur-[130px] opacity-20">
          <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br ${projectData?.color || "from-cyan-500 to-blue-500"}`} />
        </div>

        <div className="container max-w-5xl mx-auto px-4 flex flex-col h-[calc(100vh-8rem)]">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors py-4 text-sm w-fit font-bold uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <Card className="flex-1 flex flex-col overflow-hidden mb-8 border border-white/10 rounded-3xl shadow-[0_20px_100px_rgba(0,0,0,0.8)] backdrop-blur-md bg-gray-950/80">
            {/* Chat header */}
            <div className={`shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between relative overflow-hidden z-10 shadow-sm`}>
              <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${projectData?.color || "from-cyan-500 to-blue-500"} opacity-100 z-20`} />
              <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${projectData?.color || "from-cyan-500 to-blue-500"} opacity-10 blur-3xl pointer-events-none rounded-full`} />
              
              <div className="flex items-center gap-5 relative z-10 w-full">
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${projectData?.color || "from-cyan-500 to-blue-500"} p-[2px] shadow-lg shrink-0`}>
                  <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
                    <Terminal size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-white truncate tracking-tight">{projectData?.title || "Loading..."}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Project Team Chat</span>
                  </div>
                </div>
              </div>

              {projectData?.link && (
                <div className="flex items-center gap-3 hidden sm:flex shrink-0 z-10 relative">
                  <a href={projectData.link} target="_blank" rel="noopener noreferrer" className="p-3 mb-auto rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-300" title="View Source">
                    <Github size={20} />
                  </a>
                  {isMember && currentUser?.role !== 'admin' && (
                    <button onClick={handleLeaveProject} className="p-3 mb-auto rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 hover:scale-105 hover:shadow-lg transition-all duration-300" title="Leave Project">
                      <LogOut size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex overflow-hidden bg-white dark:bg-gray-50 rounded-b-3xl">
              {/* Chat Body */}
              <div className="flex-1 p-6 flex flex-col relative w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                ) : !isMember ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                  <AlertTriangle size={64} className="text-amber-500 mb-6" />
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Join project to participate</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                    This channel is restricted to project contributors. Join now to collaborate with other developers.
                  </p>
                  <button
                    onClick={handleJoin}
                    className={`w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all`}
                  >
                    Join Project Chat
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6">
                  {messages.length === 0 ? (
                    <div className="m-auto text-center flex flex-col items-center justify-center opacity-70">
                      <div className="inline-flex relative items-center justify-center size-20 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
                        <Terminal size={32} className="text-gray-400 relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-wide">Start the conversation</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-4 max-w-sm">No messages here yet. Say hello, ask a question, or share an idea with the team!</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isSelf = currentUser && String(msg.user_id) === String(currentUser.id);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={msg.id} 
                          className={`flex flex-col max-w-[80%] ${isSelf ? "self-end items-end" : "self-start items-start"}`}
                        >
                          <div className={`flex items-center gap-2 mb-1.5 px-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                            <img
                              src={getAvatar(msg.user_email)}
                              alt="avatar"
                              className="size-7 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
                            />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide">{msg.user_email.split('@')[0]}</span>
                            {msg.user_role === "admin" && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded font-bold tracking-wider flex items-center justify-center gap-1">
                                <CheckCircle2 size={10} /> ADMIN
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {(isSelf || currentUser?.role === "admin") && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded transition-all cursor-pointer z-10"
                                title="Delete message"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap break-words overflow-hidden prose dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800 ${
                            isSelf
                              ? "bg-blue-600 text-white rounded-tr-sm"
                              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                          }`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.message}
                            </ReactMarkdown>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} className="h-4 pb-20" />
                </div>
              )}
            </div>

            {/* GitHub Sidebar (Hidden on mobile) */}
            {projectData?.link && isMember && (
              <div className="w-80 border-l border-gray-800 bg-gray-950 p-6 hidden lg:flex flex-col">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-800/50 pb-4">
                  <div className="p-2 rounded-lg bg-gray-900 border border-gray-800 shadow-inner">
                    <Github size={18} className="text-gray-300" />
                  </div>
                  <h3 className="font-black text-gray-200 tracking-wider text-sm uppercase">Active Issues</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 pb-4">
                  {issuesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full animate-pulse" />
                        <Loader2 className="animate-spin text-cyan-400 relative z-10" size={24} />
                      </div>
                    </div>
                  ) : issues.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center opacity-70">
                      <div className="size-12 rounded-full border border-dashed border-gray-700 flex items-center justify-center mb-3 bg-gray-900/50">
                        <CheckCircle2 size={20} className="text-gray-500" />
                      </div>
                      <span className="text-xs font-mono text-gray-500 block">No open issues found</span>
                      <span className="text-[10px] text-gray-600 mt-1">All clear!</span>
                    </div>
                  ) : (
                    issues.map((issue, index) => (
                      <motion.a 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={issue.id} 
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-2xl border border-gray-800/60 bg-gray-900/40 hover:bg-gray-800/80 hover:border-gray-700 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded shadow-inner">#{issue.number}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-300 group-hover:text-white leading-relaxed mb-4 transition-colors">
                          {issue.title}
                        </h4>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                          <div className="flex gap-1.5 flex-wrap overflow-hidden">
                            {issue.labels.slice(0, 2).map((l: any) => (
                              <span key={l.id} className="text-[9px] px-2 py-0.5 rounded border border-gray-700/50 bg-gray-800/50 text-gray-400 whitespace-nowrap shadow-sm">
                                {l.name}
                              </span>
                            ))}
                            {issue.labels.length > 2 && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 text-gray-500 bg-gray-900 rounded border border-gray-800">+{issue.labels.length - 2}</span>
                            )}
                          </div>
                          <img 
                            src={issue.user.avatar_url} 
                            alt={issue.user.login}
                            className="size-5 rounded-full ring-2 ring-gray-800 shadow-sm"
                            title={issue.user.login}
                          />
                        </div>
                      </motion.a>
                    ))
                  )}
                </div>
              </div>
            )}
            </div>

            {/* Input Footer */}
            {isMember && (
              <div className="shrink-0 p-5 bg-gradient-to-t from-gray-950 to-[#0A0D18] border-t border-white/5 relative shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-sm" />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message the dev team..."
                    className="flex-1 bg-[#050816]/80 border border-gray-800 rounded-2xl px-6 py-4 text-[15px] tracking-wide text-white placeholder-gray-500/80 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-900 focus:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all shadow-inner relative z-10"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`px-8 rounded-2xl bg-gradient-to-r ${projectData?.color || "from-cyan-500 to-blue-500"} text-white font-black disabled:opacity-30 disabled:saturate-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center relative z-10`}
                  >
                    <Send size={18} className="drop-shadow-md" />
                  </button>
                </form>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </PageGuard>
  );
}