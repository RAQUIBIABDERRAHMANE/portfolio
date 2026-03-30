"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { Github, Edit3, Trash2, Plus, Star, GitFork, X as XIcon, RefreshCw, Eye, EyeOff } from "lucide-react";

interface Contribution {
    id: number;
    title: string;
    description: string;
    techStack: string; // JSON array
    stars: number;
    forks: number;
    link: string;
    color: string;
    is_active: boolean;
    sort_order: number;
}

export function ContributionsTab() {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Contribution>>({
        title: "",
        description: "",
        techStack: "[]",
        stars: 0,
        forks: 0,
        link: "",
        color: "from-cyan-500 to-blue-500",
        is_active: true,
        sort_order: 0,
    });
    const [techInput, setTechInput] = useState("");

    const fetchContributions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/contributions");
            if (res.ok) {
                const data = await res.json();
                setContributions(data.contributions || []);
            }
        } catch (err) {
            console.error("Failed to fetch contributions");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContributions();
    }, []);

    const handleEdit = (c: Contribution) => {
        setFormData(c);
        let techParsed = [];
        try { techParsed = JSON.parse(c.techStack); } catch {}
        setTechInput(techParsed.join(", "));
        setEditingId(c.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this open source contribution?")) return;
        try {
            const res = await fetch(`/api/admin/contributions/${id}`, { method: "DELETE" });
            if (res.ok) {
                setContributions(prev => prev.filter(c => c.id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch {
            alert("Delete error");
        }
    };

    const handleToggleActive = async (c: Contribution) => {
        try {
            const res = await fetch(`/api/admin/contributions/${c.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !c.is_active }),
            });
            if (res.ok) {
                setContributions(prev => prev.map(item => item.id === c.id ? { ...item, is_active: !item.is_active } : item));
            }
        } catch {
            alert("Failed to toggle status");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const techArr = techInput.split(",").map(t => t.trim()).filter(Boolean);
            const payload = {
                ...formData,
                techStack: JSON.stringify(techArr),
            };

            const url = editingId ? `/api/admin/contributions/${editingId}` : "/api/admin/contributions";
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                if (editingId) {
                    setContributions(prev => prev.map(c => c.id === editingId ? data.contribution : c));
                } else {
                    setContributions(prev => [data.contribution, ...prev]);
                }
                setShowForm(false);
                setEditingId(null);
                setTechInput("");
                setFormData({
                    title: "", description: "", techStack: "[]", stars: 0, forks: 0,
                    link: "", color: "from-cyan-500 to-blue-500", is_active: true, sort_order: 0,
                });
            } else {
                alert("Failed to save");
            }
        } catch {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Contributions</h3>
                    <p className="text-gray-500 text-sm font-medium">Manage your open source repositories</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchContributions}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin text-cyan-500" : ""} />
                    </button>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ title: "", description: "", link: "", stars: 0, forks: 0, is_active: true, color: "from-cyan-500 to-blue-500", sort_order: 0 });
                            setTechInput("");
                            setShowForm(true);
                        }}
                        className="px-6 py-2 rounded-lg bg-cyan-500 text-[#020617] font-black text-sm hover:bg-cyan-400 transition-all uppercase tracking-tighter flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Repository
                    </button>
                </div>
            </div>

            <Card className="p-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50">
                                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">Order</th>
                                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest">Repository</th>
                                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest hidden lg:table-cell">Description</th>
                                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {contributions.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-900/30 transition-colors group">
                                    <td className="p-4 align-middle hidden md:table-cell text-sm text-gray-500">{c.sort_order}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={"size-8 rounded flex items-center justify-center bg-gradient-to-br " + c.color}>
                                                <Github size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{c.title}</p>
                                                <div className="flex gap-3 text-[10px] text-gray-500 font-mono mt-1">
                                                    <span className="flex items-center gap-1"><Star size={10} /> {c.stars}</span>
                                                    <span className="flex items-center gap-1"><GitFork size={10} /> {c.forks}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle hidden lg:table-cell text-sm text-gray-400 max-w-xs truncate">
                                        {c.description}
                                    </td>
                                    <td className="p-4 align-middle text-center">
                                        <button
                                            onClick={() => handleToggleActive(c)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                c.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white"
                                            }`}
                                        >
                                            {c.is_active ? <><Eye size={12}/> Visible</> : <><EyeOff size={12}/> Hidden</>}
                                        </button>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(c)} className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && contributions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center">
                                        <Github size={32} className="mx-auto text-gray-800 mb-3" />
                                        <p className="text-gray-500 font-bold">No contributions found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-white">{editingId ? "Edit" : "Add"} Repository</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Title</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                        <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">GitHub Link</label>
                                        <input type="url" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tech Stack (Comma Separated)</label>
                                        <input type="text" placeholder="e.g. Next.js, TailwnidCSS, Prisma" value={techInput} onChange={e => setTechInput(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Stars</label>
                                        <input type="number" min="0" value={formData.stars} onChange={e => setFormData({ ...formData, stars: Number(e.target.value) })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Forks</label>
                                        <input type="number" min="0" value={formData.forks} onChange={e => setFormData({ ...formData, forks: Number(e.target.value) })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tailwind Gradient Color</label>
                                        <input type="text" placeholder="e.g. from-cyan-500 to-blue-500" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Sort Order</label>
                                        <input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-colors" />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-800">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors font-bold text-sm">
                                        Cancel
                                    </button>
                                    <button disabled={saving} type="submit" className="px-6 py-2 rounded-lg bg-cyan-500 text-gray-950 font-black text-sm hover:bg-cyan-400 transition-colors disabled:opacity-50">
                                        {saving ? "Saving..." : "Save Repository"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
