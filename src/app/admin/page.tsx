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
    Download,
    Edit3,
    RefreshCw,
    Layers,
    Link as LinkIcon,
    Star,
    GripVertical,
    X as XIcon,
    Paperclip,
    AlertCircle
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
    userImageData: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

interface ProjectDownloadFile {
    name: string;
    filename: string;
    url: string;
    size?: number;
}

interface Project {
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
    download_files: string; // JSON array of ProjectDownloadFile
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    read_time: string;
    category: string;
    tags: string;
    image: string;
    meta_description: string;
    meta_keywords: string;
    is_published: boolean;
    is_featured: boolean;
    view_count: number;
    created_at?: string;
    updated_at?: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [pages, setPages] = useState<PageSetting[]>([]);
    const [applications, setApplications] = useState<EmploymentSubmission[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApplication, setSelectedApplication] = useState<EmploymentSubmission | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [editingApplication, setEditingApplication] = useState(false);
    const [appEditData, setAppEditData] = useState<Partial<EmploymentSubmission>>({});
    const [savingApplication, setSavingApplication] = useState(false);
    const router = useRouter();

    const [pushData, setPushData] = useState({ title: "", body: "", url: "" });
    const [sendingPush, setSendingPush] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [savingPages, setSavingPages] = useState<{ [key: string]: boolean }>({});
    const [newPage, setNewPage] = useState({ page_path: "", page_name: "", disabled_message: "" });
    const [showAddPage, setShowAddPage] = useState(false);

    // Blog states
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [blogFormData, setBlogFormData] = useState<Partial<Blog>>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        read_time: "5 min read",
        tags: "",
        image: "",
        meta_description: "",
        meta_keywords: "",
        is_published: false,
        is_featured: false,
        date: new Date().toISOString().split('T')[0],
    });
    const [savingBlog, setSavingBlog] = useState(false);

    // Project states
    const [projects, setProjects] = useState<Project[]>([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [projectFormData, setProjectFormData] = useState<Partial<Project>>({
        title: "",
        company: "",
        year: new Date().getFullYear().toString(),
        description: "",
        results: "[]",
        link: "",
        link_text: "View Project",
        image_url: "",
        color: "from-cyan-500 to-blue-500",
        is_published: true,
        is_featured: false,
        sort_order: 0,
    });
    const [projectResultsInput, setProjectResultsInput] = useState("");
    const [savingProject, setSavingProject] = useState(false);
    const [projectDownloadFiles, setProjectDownloadFiles] = useState<ProjectDownloadFile[]>([]);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [fileDisplayName, setFileDisplayName] = useState("");

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
        const pathKey = page.page_path.toLowerCase().trim().replace(/^\/+/, "").replace(/\/+$/, "");
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
            const normalizedPath = newPage.page_path.trim().toLowerCase().replace(/^\/+/, "").replace(/\/+$/, "");
            const res = await fetch("/api/admin/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page_path: normalizedPath,
                    page_name: newPage.page_name || normalizedPath,
                    is_enabled: false,
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

    const handleEditApplication = () => {
        if (!selectedApplication) return;
        setAppEditData({
            fixedSalary: selectedApplication.fixedSalary,
            revenueSharePercentage: selectedApplication.revenueSharePercentage,
            hasFixedSalary: selectedApplication.hasFixedSalary,
            position: selectedApplication.position,
            startDate: selectedApplication.startDate,
            skills: selectedApplication.skills,
        });
        setEditingApplication(true);
    };

    const handleSaveApplication = async () => {
        if (!selectedApplication) return;
        setSavingApplication(true);
        try {
            const response = await fetch(`/api/employment/${selectedApplication.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appEditData),
            });
            if (response.ok) {
                const data = await response.json();
                setApplications(apps => apps.map(app => 
                    app.id === selectedApplication.id ? { ...app, ...appEditData } : app
                ));
                setSelectedApplication({ ...selectedApplication, ...appEditData } as EmploymentSubmission);
                setEditingApplication(false);
            } else {
                alert('Failed to save changes');
            }
        } catch (err) {
            alert('Failed to save changes');
        } finally {
            setSavingApplication(false);
        }
    };

    const handleUploadProjectFile = async (file: File) => {
        setUploadingFile(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("name", fileDisplayName.trim() || file.name);
            const res = await fetch("/api/admin/upload", { method: "POST", body: form });
            const data = await res.json();
            if (res.ok) {
                setProjectDownloadFiles(prev => [...prev, data.file]);
                setFileDisplayName("");
            } else {
                alert(data.error || "Upload failed");
            }
        } catch {
            alert("Upload failed");
        } finally {
            setUploadingFile(false);
        }
    };

    const handleRemoveProjectFile = async (filename: string) => {
        if (!confirm("Remove this download file?")) return;
        try {
            await fetch("/api/admin/upload/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename }),
            });
        } catch {}
        setProjectDownloadFiles(prev => prev.filter(f => f.filename !== filename));
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/admin/projects");
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        }
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProject(true);
        try {
            // Build results array from textarea
            let resultsArr: { title: string }[] = [];
            try { resultsArr = JSON.parse(projectFormData.results || "[]"); } catch {}
            // If projectResultsInput is set, parse it line-by-line
            if (projectResultsInput.trim()) {
                resultsArr = projectResultsInput.split("\n").filter(l => l.trim()).map(l => ({ title: l.trim() }));
            }

            const payload = {
                ...projectFormData,
                results: JSON.stringify(resultsArr),
                download_files: JSON.stringify(projectDownloadFiles),
            };

            const method = editingProject ? "PATCH" : "POST";
            const endpoint = editingProject
                ? `/api/admin/projects/${editingProject.id}`
                : "/api/admin/projects";

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingProject) {
                    setProjects(projects.map(p => p.id === editingProject.id ? data.project : p));
                } else {
                    setProjects([data.project, ...projects]);
                }
                setShowProjectForm(false);
                setEditingProject(null);
                setProjectResultsInput("");
                setProjectDownloadFiles([]);
                setFileDisplayName("");
                setProjectFormData({
                    title: "", company: "", year: new Date().getFullYear().toString(),
                    description: "", results: "[]", link: "", link_text: "View Project",
                    image_url: "", color: "from-cyan-500 to-blue-500",
                    download_files: "[]",
                    is_published: true, is_featured: false, sort_order: 0,
                });
            } else {
                const data = await response.json();
                alert(data.error || "Failed to save project");
            }
        } catch (err) {
            alert("Failed to save project");
        } finally {
            setSavingProject(false);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            if (response.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert("Failed to delete project");
            }
        } catch (err) {
            alert("Failed to delete project");
        }
    };

    const fetchBlogs = async () => {
        try {
            const response = await fetch("/api/admin/blogs");
            if (response.ok) {
                const data = await response.json();
                setBlogs(data.blogs || []);
            }
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
        }
    };

    const handleSaveBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingBlog(true);
        try {
            const method = editingBlog ? 'PATCH' : 'POST';
            const endpoint = editingBlog ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs';
            
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogFormData),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingBlog) {
                    setBlogs(blogs.map(b => b.id === editingBlog.id ? data.blog : b));
                } else {
                    setBlogs([data.blog, ...blogs]);
                }
                setShowBlogForm(false);
                setEditingBlog(null);
                setBlogFormData({
                    title: "",
                    slug: "",
                    excerpt: "",
                    content: "",
                    category: "",
                    author: "",
                    read_time: "5 min read",
                    tags: "",
                    image: "",
                    meta_description: "",
                    meta_keywords: "",
                    is_published: false,
                    is_featured: false,
                    date: new Date().toISOString().split('T')[0],
                });
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save blog');
            }
        } catch (err) {
            alert('Failed to save blog');
        } finally {
            setSavingBlog(false);
        }
    };

    const handleDeleteBlog = async (blogId: number) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            const response = await fetch(`/api/admin/blogs/${blogId}`, { method: 'DELETE' });
            if (response.ok) {
                setBlogs(blogs.filter(b => b.id !== blogId));
            } else {
                alert('Failed to delete blog');
            }
        } catch (err) {
            alert('Failed to delete blog');
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
        fetchBlogs();
        fetchProjects();

        // Auto-refresh data every 5 seconds
        const interval = setInterval(() => {
            fetchUsers();
            fetchPages();
            fetchApplications();
            fetchBlogs();
            fetchProjects();
        }, 5000);

        return () => clearInterval(interval);
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
                        { id: "blogs", label: "Blogs", icon: <Code size={20} /> },
                        { id: "projects", label: "Projects", icon: <Layers size={20} /> },
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
                                            <div className="flex justify-between items-start mb-6 gap-4">
                                                <div className="flex items-center gap-4">
                                                    {selectedApplication.userImageData && (
                                                        <img 
                                                            src={selectedApplication.userImageData} 
                                                            alt={selectedApplication.fullName}
                                                            className="size-20 rounded-full object-cover border-2 border-cyan-500/30"
                                                        />
                                                    )}
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white">{selectedApplication.fullName}</h3>
                                                        <p className="text-cyan-400">{selectedApplication.position}</p>
                                                    </div>
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
                                                    {editingApplication ? (
                                                        <input
                                                            type="date"
                                                            value={appEditData.startDate || ''}
                                                            onChange={(e) => setAppEditData({ ...appEditData, startDate: e.target.value })}
                                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-white">{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Fixed Salary</p>
                                                    {editingApplication ? (
                                                        <div className="flex items-center gap-3">
                                                            <label className="flex items-center gap-2 text-white text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!appEditData.hasFixedSalary}
                                                                    onChange={(e) => setAppEditData({ ...appEditData, hasFixedSalary: e.target.checked ? 1 : 0 })}
                                                                    className="size-4"
                                                                />
                                                                Has Salary
                                                            </label>
                                                            {appEditData.hasFixedSalary ? (
                                                                <input
                                                                    type="text"
                                                                    value={appEditData.fixedSalary || ''}
                                                                    onChange={(e) => setAppEditData({ ...appEditData, fixedSalary: e.target.value })}
                                                                    placeholder="e.g. $5000"
                                                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                                />
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <p className="text-white">{selectedApplication.hasFixedSalary ? (selectedApplication.fixedSalary || 'Yes') : 'No'}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Revenue Share</p>
                                                    {editingApplication ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={appEditData.revenueSharePercentage || ''}
                                                                onChange={(e) => setAppEditData({ ...appEditData, revenueSharePercentage: e.target.value })}
                                                                className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                            />
                                                            <span className="text-emerald-400 font-bold">%</span>
                                                        </div>
                                                    ) : (
                                                        <p className="font-bold text-emerald-400">{selectedApplication.revenueSharePercentage}%</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Position</p>
                                                {editingApplication ? (
                                                    <input
                                                        type="text"
                                                        value={appEditData.position || ''}
                                                        onChange={(e) => setAppEditData({ ...appEditData, position: e.target.value })}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                    />
                                                ) : (
                                                    <p className="text-cyan-400 font-medium">{selectedApplication.position}</p>
                                                )}
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Skills & Technologies</p>
                                                {editingApplication ? (
                                                    <input
                                                        type="text"
                                                        value={appEditData.skills || ''}
                                                        onChange={(e) => setAppEditData({ ...appEditData, skills: e.target.value })}
                                                        placeholder="React, Node.js, TypeScript"
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                    />
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedApplication.skills?.split(', ').map((skill, i) => (
                                                            <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg font-medium">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
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
                                                {editingApplication ? (
                                                    <>
                                                        <button
                                                            onClick={handleSaveApplication}
                                                            disabled={savingApplication}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
                                                        >
                                                            {savingApplication ? (
                                                                <RefreshCw size={18} className="animate-spin" />
                                                            ) : (
                                                                <Save size={18} />
                                                            )}
                                                            {savingApplication ? 'Saving...' : 'Save Changes'}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingApplication(false)}
                                                            disabled={savingApplication}
                                                            className="px-4 py-3 bg-gray-800 text-gray-400 rounded-xl font-bold hover:bg-gray-700 transition-all disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={handleEditApplication}
                                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl font-bold hover:bg-cyan-500/30 transition-all"
                                                        >
                                                            <Edit3 size={18} /> Edit
                                                        </button>
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
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {activeTab === "blogs" && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Blog Manager</h3>
                                    <p className="text-gray-500 text-sm font-medium">Create, edit, publish, or feature blog posts</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingBlog(null);
                                        setBlogFormData({
                                            title: "",
                                            slug: "",
                                            excerpt: "",
                                            content: "",
                                            category: "",
                                            author: "",
                                            read_time: "5 min read",
                                            tags: "",
                                            image: "",
                                            meta_description: "",
                                            meta_keywords: "",
                                            is_published: false,
                                            is_featured: false,
                                            date: new Date().toISOString().split('T')[0],
                                        });
                                        setShowBlogForm(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 text-[#020617] font-black text-sm hover:bg-cyan-400 transition-all uppercase tracking-tighter"
                                >
                                    <Plus size={16} /> New Blog
                                </button>
                            </div>

                            <Card className="overflow-hidden border-cyan-500/10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-500/5 border-b border-cyan-500/10 text-xs uppercase tracking-widest text-gray-400">
                                            <th className="px-4 py-3">Title</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Featured</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Views</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blogs.map((blog) => (
                                            <tr key={blog.id} className="border-b border-gray-900/60 hover:bg-gray-900/30 transition-colors text-sm">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-white">{blog.title}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono">/{blog.slug}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${blog.is_published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                                                        {blog.is_published ? "Published" : "Draft"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${blog.is_featured ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-gray-800 text-gray-400 border border-gray-700"}`}>
                                                        {blog.is_featured ? "Featured" : "Standard"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs">{blog.date}</td>
                                                <td className="px-4 py-3 text-gray-400 text-xs">{blog.view_count}</td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingBlog(blog);
                                                            setBlogFormData({ ...blog });
                                                            setShowBlogForm(true);
                                                        }}
                                                        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog.id)}
                                                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {blogs.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-10 text-gray-600 font-mono text-sm">No blogs yet. Create the first post.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Card>

                            {showBlogForm && (
                                <Card className="p-8 border-cyan-500/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">{editingBlog ? "Edit Blog" : "New Blog"}</h4>
                                            <p className="text-gray-500 text-sm">Fill the fields below then save</p>
                                        </div>
                                        <button
                                            onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveBlog} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Title</label>
                                            <input
                                                required
                                                value={blogFormData.title || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="Blog title"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Slug</label>
                                            <input
                                                required
                                                value={blogFormData.slug || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="my-blog-post"
                                            />
                                        </div>

                                        <div className="space-y-2 lg:col-span-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Excerpt</label>
                                            <textarea
                                                required
                                                value={blogFormData.excerpt || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 h-24"
                                                placeholder="Short summary"
                                            />
                                        </div>

                                        <div className="space-y-2 lg:col-span-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Content (Markdown allowed)</label>
                                            <textarea
                                                required
                                                value={blogFormData.content || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 h-48"
                                                placeholder="Full article content"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Category</label>
                                            <input
                                                required
                                                value={blogFormData.category || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="Frontend"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Author</label>
                                            <input
                                                required
                                                value={blogFormData.author || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="Author name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Date</label>
                                            <input
                                                type="date"
                                                value={blogFormData.date || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, date: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Read Time</label>
                                            <input
                                                value={blogFormData.read_time || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, read_time: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="5 min read"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Tags</label>
                                            <input
                                                value={blogFormData.tags || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="Next.js, React"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Image URL</label>
                                            <input
                                                value={blogFormData.image || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="/images/blog-cover.jpg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Meta Description</label>
                                            <input
                                                value={blogFormData.meta_description || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, meta_description: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="SEO description"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Meta Keywords</label>
                                            <input
                                                value={blogFormData.meta_keywords || ""}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, meta_keywords: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="keyword1, keyword2"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 lg:col-span-2">
                                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={!!blogFormData.is_published}
                                                    onChange={(e) => setBlogFormData({ ...blogFormData, is_published: e.target.checked })}
                                                    className="size-4"
                                                />
                                                <span>Published</span>
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={!!blogFormData.is_featured}
                                                    onChange={(e) => setBlogFormData({ ...blogFormData, is_featured: e.target.checked })}
                                                    className="size-4"
                                                />
                                                <span>Featured</span>
                                            </label>
                                        </div>

                                        <div className="lg:col-span-2 flex items-center gap-4 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}
                                                className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm hover:bg-gray-700 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={savingBlog}
                                                className="px-6 py-3 rounded-xl bg-emerald-500 text-[#020617] font-black text-sm hover:bg-emerald-400 transition-all disabled:opacity-50 uppercase tracking-tighter"
                                            >
                                                {savingBlog ? "Saving..." : editingBlog ? "Update Blog" : "Create Blog"}
                                            </button>
                                        </div>
                                    </form>
                                </Card>
                            )}
                        </div>
                    )}

                    {activeTab === "projects" && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Projects Manager</h3>
                                    <p className="text-gray-500 text-sm font-medium">Add, edit, publish or delete portfolio projects</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingProject(null);
                                        setProjectResultsInput("");
                                        setProjectDownloadFiles([]);
                                        setFileDisplayName("");
                                        setProjectFormData({
                                            title: "", company: "", year: new Date().getFullYear().toString(),
                                            description: "", results: "[]", link: "", link_text: "View Project",
                                            image_url: "", color: "from-cyan-500 to-blue-500",
                                            download_files: "[]",
                                            is_published: true, is_featured: false, sort_order: 0,
                                        });
                                        setShowProjectForm(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 text-[#020617] font-black text-sm hover:bg-cyan-400 transition-all uppercase tracking-tighter"
                                >
                                    <Plus size={16} /> New Project
                                </button>
                            </div>

                            {/* Projects table */}
                            <Card className="overflow-hidden border-cyan-500/10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-500/5 border-b border-cyan-500/10 text-xs uppercase tracking-widest text-gray-400">
                                            <th className="px-4 py-3">Project</th>
                                            <th className="px-4 py-3">Company / Year</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Featured</th>
                                            <th className="px-4 py-3">Order</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project) => (
                                            <tr key={project.id} className="border-b border-gray-900/60 hover:bg-gray-900/30 transition-colors text-sm">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-white">{project.title}</div>
                                                    {project.link && (
                                                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                                                           className="text-[10px] text-cyan-400 font-mono hover:underline flex items-center gap-1 mt-0.5">
                                                            <LinkIcon size={10} /> {project.link.length > 40 ? project.link.slice(0, 40) + '...' : project.link}
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs">
                                                    <span className="font-bold text-white">{project.company}</span>
                                                    <span className="ml-2 text-gray-500">{project.year}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        project.is_published
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                                                    }`}>
                                                        {project.is_published ? "Published" : "Hidden"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        project.is_featured
                                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                                            : "bg-gray-800 text-gray-400 border border-gray-700"
                                                    }`}>
                                                        {project.is_featured ? "Featured" : "Standard"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs font-mono">{project.sort_order}</td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProject(project);
                                                            setProjectFormData({ ...project });
                                                            // Populate the textarea from results JSON
                                                            try {
                                                                const arr: { title: string }[] = JSON.parse(project.results || "[]");
                                                                setProjectResultsInput(arr.map(r => r.title).join("\n"));
                                                            } catch {
                                                                setProjectResultsInput("");
                                                            }
                                                            // Populate download files
                                                            try {
                                                                setProjectDownloadFiles(JSON.parse(project.download_files || "[]"));
                                                            } catch {
                                                                setProjectDownloadFiles([]);
                                                            }
                                                            setFileDisplayName("");
                                                            setShowProjectForm(true);
                                                        }}
                                                        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {projects.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-10 text-gray-600 font-mono text-sm">No projects yet. Add your first project.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Card>

                            {/* Project form */}
                            {showProjectForm && (
                                <Card className="p-8 border-cyan-500/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">{editingProject ? "Edit Project" : "New Project"}</h4>
                                            <p className="text-gray-500 text-sm">Fill the fields below then save</p>
                                        </div>
                                        <button
                                            onClick={() => { setShowProjectForm(false); setEditingProject(null); }}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Title *</label>
                                            <input
                                                required
                                                value={projectFormData.title || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="My Awesome Project"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Company *</label>
                                            <input
                                                required
                                                value={projectFormData.company || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, company: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="Company / Client name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Year *</label>
                                            <input
                                                required
                                                value={projectFormData.year || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="2025"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Sort Order</label>
                                            <input
                                                type="number"
                                                value={projectFormData.sort_order ?? 0}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, sort_order: Number(e.target.value) })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2 lg:col-span-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Description</label>
                                            <textarea
                                                value={projectFormData.description || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 h-24"
                                                placeholder="Short project description"
                                            />
                                        </div>

                                        <div className="space-y-2 lg:col-span-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Key Results (one per line)</label>
                                            <textarea
                                                value={projectResultsInput}
                                                onChange={(e) => setProjectResultsInput(e.target.value)}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 h-36"
                                                placeholder={"Real-time performance and scalability\nCross-platform device accessibility\nCost-effective implementation"}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Project Link</label>
                                            <input
                                                value={projectFormData.link || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, link: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Link Button Text</label>
                                            <input
                                                value={projectFormData.link_text || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, link_text: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="View Source Code"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Image URL</label>
                                            <input
                                                value={projectFormData.image_url || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, image_url: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="/images/project.jpg or https://..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] ml-1">Gradient Color (Tailwind)</label>
                                            <input
                                                value={projectFormData.color || ""}
                                                onChange={(e) => setProjectFormData({ ...projectFormData, color: e.target.value })}
                                                className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                placeholder="from-cyan-500 to-blue-500"
                                            />
                                        </div>

                                        {/* Download Files Section */}
                                        <div className="space-y-4 lg:col-span-2 border border-cyan-500/10 rounded-xl p-5 bg-gray-950/30">
                                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                <Download size={12} /> Downloadable Files (.apk, .exe, .zip, .pdf…)
                                            </label>

                                            {/* Existing files list */}
                                            {projectDownloadFiles.length > 0 && (
                                                <div className="space-y-2">
                                                    {projectDownloadFiles.map((f) => (
                                                        <div key={f.filename} className="flex items-center justify-between gap-3 bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Paperclip size={14} className="text-cyan-400 flex-shrink-0" />
                                                                <div className="min-w-0">
                                                                    <p className="text-white text-sm font-bold truncate">{f.name}</p>
                                                                    <p className="text-gray-500 text-[10px] font-mono truncate">{f.filename}{f.size ? ` · ${(f.size / 1024).toFixed(1)} KB` : ""}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveProjectFile(f.filename)}
                                                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                                                            >
                                                                <XIcon size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload new file */}
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={fileDisplayName}
                                                    onChange={(e) => setFileDisplayName(e.target.value)}
                                                    placeholder="Display name (optional, e.g. Download Android APK)"
                                                    className="w-full bg-[#030712] border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-700"
                                                />
                                                <label className={`flex items-center justify-center gap-3 w-full px-4 py-5 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                                    uploadingFile
                                                        ? "border-cyan-500/50 bg-cyan-500/5"
                                                        : "border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-500/5"
                                                }`}>
                                                    <input
                                                        type="file"
                                                        accept=".apk,.aab,.ipa,.exe,.msi,.dmg,.deb,.zip,.tar.gz,.gz,.rar,.pdf,.jar,.war"
                                                        className="hidden"
                                                        disabled={uploadingFile}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleUploadProjectFile(file);
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                    {uploadingFile ? (
                                                        <>
                                                            <div className="size-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                                            <span className="text-cyan-400 text-sm font-bold">Uploading…</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download size={16} className="text-gray-500" />
                                                            <span className="text-gray-500 text-sm">Click to choose a file to upload</span>
                                                        </>
                                                    )}
                                                </label>
                                                <p className="text-[10px] text-gray-600 flex items-center gap-1">
                                                    <AlertCircle size={10} /> Allowed: .apk .aab .ipa .exe .msi .dmg .zip .pdf - Max 100 MB
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 lg:col-span-2">
                                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!projectFormData.is_published}
                                                    onChange={(e) => setProjectFormData({ ...projectFormData, is_published: e.target.checked })}
                                                    className="size-4"
                                                />
                                                <span>Published (visible on site)</span>
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!projectFormData.is_featured}
                                                    onChange={(e) => setProjectFormData({ ...projectFormData, is_featured: e.target.checked })}
                                                    className="size-4"
                                                />
                                                <span>Featured</span>
                                            </label>
                                        </div>

                                        <div className="lg:col-span-2 flex items-center gap-4 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setShowProjectForm(false); setEditingProject(null); }}
                                                className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm hover:bg-gray-700 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={savingProject}
                                                className="px-6 py-3 rounded-xl bg-emerald-500 text-[#020617] font-black text-sm hover:bg-emerald-400 transition-all disabled:opacity-50 uppercase tracking-tighter"
                                            >
                                                {savingProject ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                                            </button>
                                        </div>
                                    </form>
                                </Card>
                            )}
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
