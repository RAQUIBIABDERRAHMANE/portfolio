"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Send, UserCheck, AlertTriangle, Loader2 } from "lucide-react";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";

interface Contribution {
  id: number;
  title: string;
  color: string;
}

interface Message {
  id: number;
  contribution_id: number;
  user_id: number;
  user_email: string;
  message: string;
  created_at: string;
}

export function ContributionChatModal({
  project,
  onClose,
}: {
  project: Contribution;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const checkMembership = async () => {
    try {
      const res = await fetch(`/api/contributions/${project.id}/members`);
      if (res.status === 401) {
        setIsMember(false);
        setLoading(false);
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

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/contributions/${project.id}/chat`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkMembership();
    let interval: NodeJS.Timeout;
    if (isMember) {
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [project.id, isMember]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contributions/${project.id}/members`, { method: "POST" });
      if (res.ok) {
        setIsMember(true);
        fetchMessages();
      } else if (res.status === 401) {
        setAuthRequired(true);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/contributions/${project.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-2xl h-[80vh] flex flex-col rounded-3xl bg-gray-900 border border-gray-700 shadow-[0_0_80px_rgba(0,255,249,0.15)] overflow-hidden"
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800 bg-gradient-to-r ${project.color} bg-opacity-10 relative shrink-0`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-[0.06]`} />
            <div className="relative flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${project.color}`}>
                <UserCheck size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">{project.title}</h2>
                <p className="text-xs text-gray-400 font-mono">Project members chat</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-950 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-cyan-400" size={36} />
              </div>
            ) : !isMember ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <AlertTriangle size={48} className="text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Join to Chat</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm">
                  You must be a member of this project to join the discussion and see messages.
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleJoin();
                  }}
                  className={`px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${project.color} hover:scale-105 transition-all relative z-50`}
                >
                  Join Project
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center text-sm font-mono mt-auto mb-auto">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col flex-wrap bg-gray-800/50 p-3 rounded-2xl max-w-[85%] border border-gray-700/50 self-start">
                      <span className="text-[10px] text-cyan-400 font-bold mb-1">{msg.user_email}</span>
                      <p className="text-sm text-gray-300 break-words">{msg.message}</p>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input */}
          {isMember && (
            <div className="shrink-0 p-4 border-t border-gray-800 bg-gray-900">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-xl bg-gradient-to-r ${project.color} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Auth Modal Trigger */}
      <AuthRequiredModal isOpen={authRequired} redirectPath="/contribute" />
    </>
  );
}
