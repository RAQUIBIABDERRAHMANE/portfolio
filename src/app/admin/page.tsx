"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Send, Users } from "lucide-react";

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
    const router = useRouter();

    const [pushData, setPushData] = useState({ title: "", body: "", url: "" });
    const [sendingPush, setSendingPush] = useState(false);

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingPush(true);
        try {
            const res = await fetch("/api/push/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pushData),
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

    return (
        <main className="min-h-screen text-white">
            <Header />
            <div className="py-32 container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
                        <div className="bg-gray-800/50 border border-cyan-500/30 px-4 py-2 rounded-full text-cyan-400 font-mono text-sm">
                            Total Users: {users.length}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Users List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Users size={20} className="text-cyan-400" />
                            Registered Users
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : error ? (
                            <Card className="p-8 text-center text-red-400 bg-red-400/5">
                                <p>{error}</p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {users.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="p-6 h-full hover:border-cyan-500/50 transition-colors">
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{user.fullName}</h3>
                                                    <p className="text-cyan-400 text-sm font-medium">{user.email}</p>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <span className="opacity-50">Phone:</span>
                                                        <span className="text-gray-200">{user.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="opacity-50">Joined:</span>
                                                        <span className="text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!loading && users.length === 0 && (
                            <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                No users registered yet.
                            </div>
                        )}
                    </div>

                    {/* Push Notifications Tool */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Send size={20} className="text-cyan-400" />
                            Push Notifications
                        </h2>
                        <Card className="p-6">
                            <form onSubmit={handleSendNotification} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={pushData.title}
                                        onChange={(e) => setPushData({ ...pushData, title: e.target.value })}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="e.g. New Update!"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Message Body</label>
                                    <textarea
                                        required
                                        value={pushData.body}
                                        onChange={(e) => setPushData({ ...pushData, body: e.target.value })}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 h-24"
                                        placeholder="Enter your message here..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Target URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={pushData.url}
                                        onChange={(e) => setPushData({ ...pushData, url: e.target.value })}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="e.g. /#services"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendingPush}
                                    className="w-full py-3 rounded-lg bg-cyan-500 text-gray-950 font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {sendingPush ? "Sending..." : (
                                        <>
                                            <Send size={18} />
                                            Send to All Devices
                                        </>
                                    )}
                                </button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
