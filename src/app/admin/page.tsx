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
    Clock,
    Trash2,
    FileText,
    Eye,
    EyeOff,
    Plus,
    Save,
    Briefcase,
    CheckCircle,
    XCircle,
    ExternalLink,
    Mail,
    Phone,
    Calendar,
    Code,
    DollarSign,
    Download
} from "lucide-react";

interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    deletedAt?: string | null;
}

interface PageSetting {
    id: number;
    page_path: string;
    page_name: string;
    is_enabled: boolean;
    disabled_message: string;
    redirect_path: string | null;
}

interface EmploymentSubmission {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    idNumber: string;
    startDate: string;
    position: string;
    githubUrl: string;
    portfolioUrl: string;
    linkedinUrl: string;
    skills: string;
    hasFixedSalary: number;
    fixedSalary: string;
    revenueSharePercentage: string;
    cvFileName: string;
    cvData: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [pages, setPages] = useState<PageSetting[]>([]);
    const [applications, setApplications] = useState<EmploymentSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApplication, setSelectedApplication] = useState<EmploymentSubmission | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const router = useRouter();

    const [pushData, setPushData] = useState({ title: "", body: "", url: "" });
    const [sendingPush, setSendingPush] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [savingPages, setSavingPages] = useState<{ [key: string]: boolean }>({});
    const [newPage, setNewPage] = useState({ page_path: "", page_name: "", disabled_message: "" });
    const [showAddPage, setShowAddPage] = useState(false);

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

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Are you sure you want to deactivate this user? They will be unable to log in.")) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to deactivate user");
            }
        } catch (err) {
            alert("Failed to deactivate user");
        }
    };

    const handleTogglePage = async (page: PageSetting) => {
        const pathKey = page.page_path.replace("/", "");
        setSavingPages(prev => ({ ...prev, [pathKey]: true }));
        
        try {
            const res = await fetch(`/api/admin/pages/${pathKey}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_enabled: !page.is_enabled }),
            });
            
            if (res.ok) {
                setPages(pages.map(p => 
                    p.page_path === page.page_path 
                        ? { ...p, is_enabled: !p.is_enabled } 
                        : p
                ));
            } else {
                alert("Failed to update page");
            }
        } catch (err) {
            alert("Failed to update page");
        } finally {
            setSavingPages(prev => ({ ...prev, [pathKey]: false }));
        }
    };

    const handleUpdatePageMessage = async (page: PageSetting, message: string) => {
        const pathKey = page.page_path.replace("/", "");
        
        try {
            await fetch(`/api/admin/pages/${pathKey}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ disabled_message: message }),
            });
            
            setPages(pages.map(p => 
                p.page_path === page.page_path 
                    ? { ...p, disabled_message: message } 
                    : p
            ));
        } catch (err) {
            console.error("Failed to update message");
        }
    };

    const handleAddPage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPage.page_path || !newPage.page_name) return;
        
        try {
            const res = await fetch("/api/admin/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page_path: newPage.page_path.startsWith("/") ? newPage.page_path : "/" + newPage.page_path,
                    page_name: newPage.page_name,
                    is_enabled: true,
                    disabled_message: newPage.disabled_message || "Cette page est temporairement indisponible.",
                }),
            });
            
            const data = await res.json();
            
            if (res.ok) {
                // Refetch pages
                const pagesRes = await fetch("/api/admin/pages");
                if (pagesRes.ok) {
                    const pagesData = await pagesRes.json();
                    setPages(pagesData.pages);
                }
                setNewPage({ page_path: "", page_name: "", disabled_message: "" });
                setShowAddPage(false);
            } else {
                alert("Failed to add page: " + (data.error || "Unknown error"));
            }
        } catch (err: any) {
            alert("Failed to add page: " + (err.message || "Network error"));
        }
    };

    const fetchPages = async () => {
        try {
            const response = await fetch("/api/admin/pages");
            if (response.ok) {
                const data = await response.json();
                setPages(data.pages || []);
            }
        } catch (err) {
            console.error("Failed to fetch pages:", err);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await fetch("/api/employment");
            if (response.ok) {
                const data = await response.json();
                setApplications(data.submissions || []);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        }
    };

    const updateApplicationStatus = async (id: number, status: 'approved' | 'rejected') => {
        setUpdatingStatus(id);
        try {
            const response = await fetch(`/api/employment/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setApplications(apps => apps.map(app => 
                    app.id === id ? { ...app, status } : app
                ));
                setSelectedApplication(null);
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const deleteApplication = async (id: number) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        try {
            const response = await fetch(`/api/employment/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setApplications(apps => apps.filter(app => app.id !== id));
                setSelectedApplication(null);
            } else {
                alert('Failed to delete application');
            }
        } catch (err) {
            alert('Failed to delete application');
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
        fetchPages();
        fetchApplications();
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
                    {([
                        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
                        { id: "users", label: "Registry", icon: <Users size={20} /> },
                        { id: "applications", label: "Applications", icon: <Briefcase size={20} />, badge: applications.filter(a => a.status === 'pending').length },
                        { id: "pages", label: "Pages", icon: <FileText size={20} /> },
                        { id: "push", label: "Comms", icon: <Bell size={20} /> },
                    ] as Array<{ id: string; label: string; icon: JSX.Element; badge?: number }>).map((item) => (
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
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className="ml-auto bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                            )}
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
                                            <th className="px-6 py-5 w-10"></th>
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
                                                <td className="px-6 py-6 text-right">
                                                    {!user.deletedAt ? (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all group/delete"
                                                            title="Deactivate User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-red-500/50 uppercase tracking-widest border border-red-500/20 px-2 py-1 rounded">Deactivated</span>
                                                    )}
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

                    {activeTab === "pages" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Page Control</h3>
                                    <p className="text-gray-500 text-sm font-medium">Gérer la visibilité des pages du site</p>
                                </div>
                                <button
                                    onClick={() => setShowAddPage(!showAddPage)}
                                    className="px-6 py-2 rounded-lg bg-cyan-500 text-[#020617] font-black text-sm hover:bg-cyan-400 transition-all uppercase tracking-tighter flex items-center gap-2"
                                >
                                    <Plus size={16} /> Ajouter une page
                                </button>
                            </div>

                            {showAddPage && (
                                <Card className="p-6 border-cyan-500/20">
                                    <form onSubmit={handleAddPage} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Chemin</label>
                                                <input
                                                    type="text"
                                                    value={newPage.page_path}
                                                    onChange={(e) => setNewPage({ ...newPage, page_path: e.target.value })}
                                                    placeholder="/example"
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Nom</label>
                                                <input
                                                    type="text"
                                                    value={newPage.page_name}
                                                    onChange={(e) => setNewPage({ ...newPage, page_name: e.target.value })}
                                                    placeholder="Example Page"
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Message désactivé</label>
                                                <input
                                                    type="text"
                                                    value={newPage.disabled_message}
                                                    onChange={(e) => setNewPage({ ...newPage, disabled_message: e.target.value })}
                                                    placeholder="Page temporairement indisponible"
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddPage(false)}
                                                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 font-bold text-sm hover:bg-gray-700 transition-all"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 rounded-lg bg-cyan-500 text-[#020617] font-bold text-sm hover:bg-cyan-400 transition-all flex items-center gap-2"
                                            >
                                                <Save size={16} /> Enregistrer
                                            </button>
                                        </div>
                                    </form>
                                </Card>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pages.map((page) => (
                                    <Card key={page.id} className={`p-6 transition-all ${page.is_enabled ? 'border-emerald-500/20' : 'border-red-500/20 bg-red-500/5'}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-black text-white text-lg uppercase tracking-tight">{page.page_name}</h4>
                                                <p className="text-cyan-400 font-mono text-xs">{page.page_path}</p>
                                            </div>
                                            <button
                                                onClick={() => handleTogglePage(page)}
                                                disabled={savingPages[page.page_path.replace("/", "")]}
                                                className={`p-3 rounded-xl transition-all ${
                                                    page.is_enabled 
                                                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                                                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                }`}
                                            >
                                                {savingPages[page.page_path.replace("/", "")] ? (
                                                    <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : page.is_enabled ? (
                                                    <Eye size={20} />
                                                ) : (
                                                    <EyeOff size={20} />
                                                )}
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${page.is_enabled ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                                                <span className={`text-xs font-bold uppercase tracking-widest ${page.is_enabled ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {page.is_enabled ? 'Active' : 'Désactivée'}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Message quand désactivé:</label>
                                                <input
                                                    type="text"
                                                    value={page.disabled_message}
                                                    onChange={(e) => {
                                                        setPages(pages.map(p => 
                                                            p.page_path === page.page_path 
                                                                ? { ...p, disabled_message: e.target.value } 
                                                                : p
                                                        ));
                                                    }}
                                                    onBlur={(e) => handleUpdatePageMessage(page, e.target.value)}
                                                    className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                
                                {pages.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-700 italic font-mono uppercase tracking-[0.2em] text-xs">
                                        Aucune page configurée. Exécutez le script SQL pour initialiser.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "applications" && (
                        <div className="p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Employment Applications</h2>
                                    <p className="text-gray-500 mt-2">Manage developer employment submissions</p>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                                        <span className="font-bold">{applications.filter(a => a.status === 'pending').length}</span> Pending
                                    </div>
                                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                                        <span className="font-bold">{applications.filter(a => a.status === 'approved').length}</span> Approved
                                    </div>
                                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                        <span className="font-bold">{applications.filter(a => a.status === 'rejected').length}</span> Rejected
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {applications.map((app) => (
                                    <Card 
                                        key={app.id} 
                                        className={`p-6 cursor-pointer hover:scale-[1.02] transition-all ${
                                            app.status === 'pending' ? 'border-amber-500/30' : 
                                            app.status === 'approved' ? 'border-emerald-500/30' : 'border-red-500/30'
                                        } ${selectedApplication?.id === app.id ? 'ring-2 ring-cyan-500' : ''}`}
                                        onClick={() => setSelectedApplication(app)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-black text-white text-lg">{app.fullName}</h4>
                                                <p className="text-cyan-400 text-sm">{app.position}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                app.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-gray-600" />
                                                {app.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-600" />
                                                Start: {new Date(app.startDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={14} className="text-gray-600" />
                                                {app.revenueSharePercentage}% Revenue Share
                                            </div>
                                        </div>
                                        {app.skills && (
                                            <div className="mt-4 flex flex-wrap gap-1">
                                                {app.skills.split(', ').slice(0, 5).map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] rounded-md font-bold">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {app.skills.split(', ').length > 5 && (
                                                    <span className="px-2 py-0.5 bg-gray-800 text-gray-500 text-[10px] rounded-md">
                                                        +{app.skills.split(', ').length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-600">
                                            Submitted: {new Date(app.submittedAt).toLocaleString()}
                                        </div>
                                    </Card>
                                ))}
                                
                                {applications.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-700 italic font-mono uppercase tracking-[0.2em] text-xs">
                                        No applications yet
                                    </div>
                                )}
                            </div>

                            {/* Detail Modal */}
                            <AnimatePresence>
                                {selectedApplication && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                        onClick={() => setSelectedApplication(null)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="bg-[#0a0f1a] border border-cyan-500/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white">{selectedApplication.fullName}</h3>
                                                    <p className="text-cyan-400">{selectedApplication.position}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedApplication(null)}
                                                    className="text-gray-500 hover:text-white text-2xl"
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                                                    <p className="text-white">{selectedApplication.email}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                                                    <p className="text-white">{selectedApplication.phone}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">ID/Passport</p>
                                                    <p className="text-white">{selectedApplication.idNumber}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Start Date</p>
                                                    <p className="text-white">{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Fixed Salary</p>
                                                    <p className="text-white">{selectedApplication.hasFixedSalary ? (selectedApplication.fixedSalary || 'Yes') : 'No'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Revenue Share</p>
                                                    <p className="font-bold text-emerald-400">{selectedApplication.revenueSharePercentage}%</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Skills & Technologies</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApplication.skills?.split(', ').map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg font-medium">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-6">
                                                {selectedApplication.githubUrl && (
                                                    <a href={selectedApplication.githubUrl} target="_blank" rel="noopener noreferrer" 
                                                       className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all">
                                                        <Code size={16} /> GitHub <ExternalLink size={12} />
                                                    </a>
                                                )}
                                                {selectedApplication.portfolioUrl && (
                                                    <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer"
                                                       className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all">
                                                        Portfolio <ExternalLink size={12} />
                                                    </a>
                                                )}
                                                {selectedApplication.linkedinUrl && (
                                                    <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                                       className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all">
                                                        LinkedIn <ExternalLink size={12} />
                                                    </a>
                                                )}
                                                {selectedApplication.cvData && (
                                                    <a href={selectedApplication.cvData} download={selectedApplication.cvFileName || 'cv.pdf'}
                                                       className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all">
                                                        <FileText size={16} /> {selectedApplication.cvFileName || 'CV'} <Download size={12} />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex gap-3 pt-6 border-t border-gray-800">
                                                {selectedApplication.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                                                            disabled={updatingStatus === selectedApplication.id}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
                                                        >
                                                            <CheckCircle size={18} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                                                            disabled={updatingStatus === selectedApplication.id}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400 transition-all disabled:opacity-50"
                                                        >
                                                            <XCircle size={18} /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteApplication(selectedApplication.id)}
                                                    className="px-4 py-3 bg-gray-800 text-gray-400 rounded-xl font-bold hover:bg-red-900 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
