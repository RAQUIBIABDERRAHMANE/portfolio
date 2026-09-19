"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Plus, Trash2, CheckCircle, XCircle, Copy, AlertCircle } from "lucide-react";
import { Card } from "@/components/Card";

export function MCPKeysTab() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["read_only"]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const PERMISSION_OPTIONS = [
    { id: "read_only", label: "Read Only", desc: "Can read lists and content (safe default)" },
    { id: "write_blogs", label: "Manage Blogs", desc: "Can create, update, and delete blogs" },
    { id: "write_projects", label: "Manage Projects", desc: "Can create, update, and delete projects" },
    { id: "write_contributions", label: "Manage Contributions", desc: "Can create, update, and delete contributions" },
    { id: "admin", label: "Full Admin", desc: "Full access to all MCP resources and tools" },
  ];

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/mcp-keys");
      if (!res.ok) throw new Error("Failed to fetch keys");
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      setCreating(true);
      const res = await fetch("/api/admin/mcp-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName, permissions: newKeyPermissions })
      });
      if (!res.ok) throw new Error("Failed to create key");
      setNewKeyName("");
      setNewKeyPermissions(["read_only"]);
      await fetchKeys();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      const res = await fetch("/api/admin/mcp-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive })
      });
      if (!res.ok) throw new Error("Failed to update key");
      await fetchKeys();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/mcp-keys?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete key");
      await fetchKeys();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            MCP API Keys
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Generate and manage API keys for the Model Context Protocol (MCP) server
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Create new key form */}
      <Card className="p-6 border-white/5 bg-white/5">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                New Key Name (e.g. Claude Desktop)
              </label>
              <input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200
                           focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                placeholder="Enter a descriptive name"
              />
            </div>
            
            <div className="flex-1 w-full relative">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Permissions
              </label>
              <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-2 bg-black/30 border border-white/10 rounded-lg p-2 max-h-36 overflow-y-auto">
                {PERMISSION_OPTIONS.map(opt => (
                  <label key={opt.id} className="flex items-start gap-2 p-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 accent-cyan-500 bg-black/50 border-white/20"
                      checked={newKeyPermissions.includes(opt.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewKeyPermissions(prev => [...prev, opt.id]);
                        } else {
                          setNewKeyPermissions(prev => prev.filter(p => p !== opt.id));
                        }
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-300">{opt.label}</div>
                      <div className="text-[10px] text-gray-500 leading-tight">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={creating || !newKeyName.trim() || newKeyPermissions.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400
                         text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 h-10 w-full md:w-auto"
            >
              {creating ? "Generating..." : (
                <>
                  <Plus className="w-4 h-4" />
                  Generate Key
                </>
              )}
            </button>
          </div>
        </form>
      </Card>

      {/* Keys List */}
      <Card className="border-white/5 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            Loading API keys...
          </div>
        ) : keys.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Key className="w-12 h-12 mx-auto mb-4 text-cyan-500/20" />
            <p>No API keys generated yet.</p>
            <p className="text-sm mt-2 opacity-60">Generate one above to connect your AI assistant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">API Key</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Permissions</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Used</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-gray-200">{key.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded text-xs">
                          {key.key_value.substring(0, 8)}...{key.key_value.substring(key.key_value.length - 4)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key_value)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                          title="Copy full key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {(() => {
                          let perms = [];
                          try { perms = typeof key.permissions === 'string' ? JSON.parse(key.permissions) : key.permissions; } 
                          catch { perms = ['admin']; }
                          if (!Array.isArray(perms)) return null;
                          if (perms.includes('admin')) {
                            return <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/20 px-1.5 py-0.5 rounded">Admin</span>;
                          }
                          return perms.map(p => (
                            <span key={p} className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded">
                              {p.replace('write_', '')}
                            </span>
                          ));
                        })()}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : <span className="opacity-50">Never</span>}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${key.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {key.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {key.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(key.id, key.is_active)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${key.is_active ? 'bg-white/5 text-gray-400 hover:bg-rose-500/10 hover:text-rose-400' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                      >
                        {key.is_active ? 'Revoke' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-gray-400 hover:text-rose-400 transition-colors"
                        title="Delete key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
