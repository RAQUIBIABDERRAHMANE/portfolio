import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { Trash2, Mail, MailOpen, User, Calendar, MessageSquare, Clock, BellRing, X } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  created_at: string;
}

export const MessagesTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newToast, setNewToast] = useState<{ id: number; name: string } | null>(null);
  
  // Keep track of the highest message ID to detect new ones
  const maxIdRef = useRef<number>(0);
  // Audio for notification ping
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const fetchMessages = async (isPolling = false) => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        const newMessages: Message[] = data.messages || [];
        
        if (newMessages.length > 0) {
          const currentMaxId = Math.max(...newMessages.map(m => m.id));
          
          // If we already have messages, and we find a newer ID during polling
          if (isPolling && maxIdRef.current > 0 && currentMaxId > maxIdRef.current) {
            const newlyArrived = newMessages.find(m => m.id === currentMaxId);
            if (newlyArrived) {
              setNewToast({ id: newlyArrived.id, name: newlyArrived.name });
              // Play notification sound
              audioRef.current?.play().catch(e => console.log("Audio play blocked by browser policy"));
              
              // Auto dismiss toast after 5s
              setTimeout(() => setNewToast(null), 5000);
            }
          }
          
          maxIdRef.current = currentMaxId;
        }
        
        setMessages(newMessages);
      }
    } catch (err) {
      if (!isPolling) console.error("Failed to fetch messages", err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(false);
    
    // Poll for new messages every 10 seconds without reloading
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Failed to delete message");
    }
  };

  if (loading) return <div className="text-gray-400 p-8 text-center animate-pulse">Loading messages...</div>;

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {newToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-8 z-[200] max-w-sm"
          >
            <div className="bg-cyan-950/90 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex gap-4 items-center">
              <div className="bg-cyan-500/20 p-2.5 rounded-full text-cyan-400">
                <BellRing size={20} className="animate-pulse" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-white text-sm">New Message Received!</h3>
                <p className="text-xs text-cyan-200 truncate">From: {newToast.name}</p>
              </div>
              <button 
                onClick={() => setNewToast(null)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-cyan-400" />
          Contact Form Messages
        </h2>
        <div className="bg-gray-800/50 px-4 py-2 rounded-full text-sm">
          <span className="text-cyan-400 font-bold">{messages.filter(m => m.status === 'unread').length}</span> Unread
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-gray-700 bg-transparent flex flex-col items-center">
          <Mail className="size-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Messages Yet</h3>
          <p className="text-gray-400">When someone fills out your contact form, it will show up here.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`overflow-hidden border transition-all ${
                  msg.status === 'unread' ? 'border-cyan-500/30 bg-gray-800/80' : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer group"
                  onClick={() => {
                    setExpandedId(expandedId === msg.id ? null : msg.id);
                    if (msg.status === 'unread') handleMarkAsRead(msg.id, msg.status);
                  }}
                >
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    <div className="flex-shrink-0">
                      {msg.status === 'unread' ? (
                        <div className="size-10 rounded-full bg-cyan-500/20 flex items-center justify-center relative">
                          <Mail className="text-cyan-400 size-5" />
                          <span className="absolute top-0 right-0 size-2.5 bg-cyan-400 rounded-full animate-pulse border-2 border-gray-900" />
                        </div>
                      ) : (
                        <div className="size-10 rounded-full bg-gray-800 flex items-center justify-center">
                          <MailOpen className="text-gray-500 size-5" />
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-semibold truncate ${msg.status === 'unread' ? 'text-white' : 'text-gray-300'}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 whitespace-nowrap">
                          {msg.subject}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 truncate">{msg.email}</div>
                    </div>
                    
                    <div className="flex items-center gap-6 flex-shrink-0 hidden md:flex text-gray-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id, msg.status); }}
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      title={msg.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                    >
                      {msg.status === 'unread' ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === msg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-2 border-t border-gray-800/50 bg-black/20">
                        <div className="flex items-center gap-6 mb-4 text-sm text-gray-400 md:hidden">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {new Date(msg.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 mb-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-16">From:</span>
                            <span className="text-white flex items-center gap-1"><User size={13}/> {msg.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-16">Email:</span>
                            <a href={`mailto:${msg.email}`} className="text-cyan-400 hover:underline">{msg.email}</a>
                          </div>
                        </div>
                        <div className="bg-gray-900/80 rounded-xl p-5 text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm border border-gray-800">
                          {msg.message}
                        </div>
                        <div className="mt-4 flex gap-3">
                            <a 
                                href={`mailto:${msg.email}?subject=RE: ${msg.subject}`}
                                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium transition-colors border border-cyan-500/30 flex items-center gap-2"
                            >
                                <Mail size={16} /> Reply via Email
                            </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
