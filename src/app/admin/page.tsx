"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import {
    Send,
    Users,
    LayoutDashboard,
    Shield,
    Search,
    Bell,
    LogOut,
    User as UserIcon,
    ArrowUpRight,
    Clock
} from "lucide-react";

interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const [pushData, setPushData] = useState({ title: "", body: "", url: "" });
    const [sendingPush, setSendingPush] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingPush(true);
        try {
            const res = await fetch("/api/push/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...pushData,
                    targetUserIds: selectedUserIds
                }),
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setPushData({ title: "", body: "", url: "" });
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Failed to send notification");
        } finally {
            setSendingPush(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/admin/users");
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)
        );
    }, [users, searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050816]">
                <div className="relative">
                    <div className="size-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="mt-4 text-cyan-400 font-mono text-sm animate-pulse">SYNCHRONIZING CORE...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-cyan-500/20 bg-[#050816]/70 backdrop-blur-xl flex flex-col z-50">
                <div className="p-8 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <Shield className="text-[#050816]" size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-white leading-none">RAQUIBI</h2>
                            <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
                        { id: "users", label: "Registry", icon: <Users size={20} /> },
                        { id: "push", label: "Comms", icon: <Bell size={20} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                                }`}
                        >
                            {item.icon}
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-cyan-500/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut size={20} />
                        TERMINATE SESSION
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto">
                {/* Top Header */}
                <header className="h-20 border-b border-cyan-500/10 bg-[#050816]/30 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="size-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]"></div>
                        <span className="text-gray-400 font-mono text-xs uppercase tracking-[0.2em]">{activeTab} node active</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search registry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-950/50 border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64 transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        </div>
                        <div className="h-8 w-px bg-gray-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-white">Administrator</p>
                                <p className="text-[10px] text-gray-500">Root Access</p>
                            </div>
                            <div className="size-10 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center">
                                <UserIcon size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 space-y-10">
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Stats Card */}
                            <Card className="p-8 border-l-4 border-cyan-500 bg-gray-900/40">
                                <div className="flex items-center gap-3 mb-4 text-cyan-400">
                                    <Users size={24} />
                                    <span className="text-xs font-black uppercase tracking-widest">Total Users</span>
                                </div>
                                <p className="text-5xl font-black text-white">{users.length}</p>
                                <p className="text-gray-500 text-xs mt-2 font-bold tracking-tight uppercase italic">Live database count</p>
                            </Card>

                            {/* Recent Feed */}
                            <Card className="lg:col-span-2 p-8 h-full">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
                                        <Clock size={24} className="text-cyan-400" />
                                        Registry Feed
                                    </h3>
                                    <button onClick={() => setActiveTab("users")} className="text-cyan-500 text-xs font-bold hover:underline tracking-widest">GOTO REGISTRY</button>
                                </div>
                                <div className="space-y-4">
                                    {users.slice(0, 5).map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-950/40 border border-gray-900/50 group hover:border-cyan-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-cyan-500 border border-gray-800">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-100 text-sm group-hover:text-cyan-400 transition-colors uppercase tracking-wide">{user.fullName}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono italic">{user.email}</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-600 font-black uppercase">{new Date(user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                    {users.length === 0 && <p className="text-gray-600 text-center py-10 font-mono text-sm">NO USER DATA DETECTED</p>}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Registry</h3>
                                    <p className="text-gray-500 text-sm font-medium">Monitoring {filteredUsers.length} system nodes | {selectedUserIds.length} selected for comms</p>
                                </div>
                                <div className="flex gap-4">
                                    {selectedUserIds.length > 0 && (
                                        <button
                                            onClick={() => setActiveTab("push")}
                                            className="px-6 py-2 rounded-lg bg-emerald-500 text-[#020617] font-black text-sm hover:bg-emerald-400 transition-all uppercase tracking-tighter flex items-center gap-2"
                                        >
                                            <Bell size={16} /> Prepare targeted broadcast
                                        </button>
                                    )}
                                    {selectedUserIds.length > 0 && (
                                        <button
                                            onClick={() => setSelectedUserIds([])}
                                            className="px-6 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all uppercase tracking-tighter"
                                        >
                                            Clear Selection
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Card className="overflow-hidden border-cyan-500/10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-500/5 border-b border-cyan-500/10">
                                            <th className="px-6 py-5 w-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedUserIds(filteredUsers.map(u => u.id));
                                                        } else {
                                                            setSelectedUserIds([]);
                                                        }
                                                    }}
                                                    className="size-4 rounded border-gray-800 bg-gray-950 text-cyan-500 focus:ring-cyan-500"
                                                />
                                            </th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/70">Signature</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/70">Email Access</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/70">Uplink</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/70 text-right">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className={`${selectedUserIds.includes(user.id) ? 'bg-cyan-500/10' : 'hover:bg-cyan-500/5'} transition-all group`}>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUserIds.includes(user.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedUserIds([...selectedUserIds, user.id]);
                                                            } else {
                                                                setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                                                            }
                                                        }}
                                                        className="size-4 rounded border-gray-800 bg-gray-950 text-cyan-500 focus:ring-cyan-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-10 bg-gray-950 rounded-lg flex items-center justify-center font-black text-cyan-500 border border-gray-800">
                                                            {user.fullName.charAt(0)}
                                                        </div>
                                                        <p className="font-bold text-gray-100 uppercase tracking-wide text-sm">{user.fullName}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-mono text-xs text-cyan-400/70">{user.email}</td>
                                                <td className="px-6 py-6 font-mono text-xs text-gray-500">{user.phone}</td>
                                                <td className="px-6 py-6 text-right whitespace-nowrap">
                                                    <p className="text-gray-400 text-xs font-black">{new Date(user.createdAt).toLocaleDateString()}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="py-20 text-center text-gray-700 italic font-mono uppercase tracking-[0.2em] text-xs underline decoration-red-500/50 underline-offset-8">Data buffer empty</div>
                                )}
                            </Card>
                        </div>
                    )}

                    {activeTab === "push" && (
                        <div className="max-w-2xl mx-auto py-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="size-20 bg-cyan-500/5 rounded-[2rem] flex items-center justify-center text-cyan-400 mx-auto border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
                                            <Bell className="animate-pulse" size={32} />
                                        </div>
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Signal Command</h3>
                                        {selectedUserIds.length > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Targeted mode active</p>
                                                <p className="text-gray-500 text-sm font-medium">Ready to inject signal into {selectedUserIds.length} selected endpoint nodes</p>
                                                <button
                                                    onClick={() => setSelectedUserIds([])}
                                                    className="text-[10px] text-red-500 font-bold hover:underline uppercase tracking-tighter"
                                                >
                                                    Switch to Global Broadcast
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm font-medium">Inject broadcast signals into all connected endpoint nodes</p>
                                        )}
                                    </div>

                                    <Card className="p-12 border-cyan-500/20">
                                        <form onSubmit={handleSendNotification} className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-2">Header Signature</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={pushData.title}
                                                    onChange={(e) => setPushData({ ...pushData, title: e.target.value })}
                                                    className="w-full bg-[#030712] border border-gray-800 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-xl font-bold placeholder:text-gray-800"
                                                    placeholder="Identify the signal"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-2">Payload Data</label>
                                                <textarea
                                                    required
                                                    value={pushData.body}
                                                    onChange={(e) => setPushData({ ...pushData, body: e.target.value })}
                                                    className="w-full bg-[#030712] border border-gray-800 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 h-40 transition-all placeholder:text-gray-800 font-medium leading-relaxed"
                                                    placeholder="Enter core message payload..."
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-2">Redirect URI</label>
                                                <input
                                                    type="text"
                                                    value={pushData.url}
                                                    onChange={(e) => setPushData({ ...pushData, url: e.target.value })}
                                                    className="w-full bg-[#030712] border border-gray-800 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-800 font-mono text-sm italic"
                                                    placeholder="Target destination (e.g. /dashboard)"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={sendingPush}
                                                className="w-full py-6 rounded-3xl bg-cyan-500 text-[#020617] font-black text-xl hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-tighter"
                                            >
                                                {sendingPush ? (
                                                    <span className="animate-pulse">TRANSMITTING...</span>
                                                ) : (
                                                    <>
                                                        <Send size={24} />
                                                        DEPLOY BROADCAST
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
