"use client";
import { useEffect, useState } from "react";
import { Copy, RefreshCw, Key } from "lucide-react";

export function ApiKeyManager() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch("/api/auth/apikey")
            .then(res => res.json())
            .then(data => {
                if (data.api_key) setApiKey(data.api_key);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const generateKey = async () => {
        setGenerating(true);
        try {
            const res = await fetch("/api/auth/apikey", { method: "POST" });
            const data = await res.json();
            if (data.api_key) setApiKey(data.api_key);
        } catch (e) {
            console.error(e);
        }
        setGenerating(false);
    };

    const copyToClipboard = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="text-sm opacity-50">Loading API Key...</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Key className="size-5 text-emerald-400" />
                <h3 className="font-semibold text-lg text-white">Your MCP API Key</h3>
            </div>
            {apiKey ? (
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10 overflow-hidden">
                    <code className="text-emerald-400 text-sm truncate flex-1">{apiKey}</code>
                    <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors"
                        title="Copy to clipboard"
                    >
                        <Copy className="size-4" />
                    </button>
                </div>
            ) : (
                <p className="text-sm text-white/50">You don&apos;t have an API key yet. Generate one to use the MCP Server.</p>
            )}
            
            <div className="flex items-center gap-4 mt-2">
                <button
                    onClick={generateKey}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`size-4 ${generating ? 'animate-spin' : ''}`} />
                    {apiKey ? 'Regenerate Key' : 'Generate Key'}
                </button>
                {copied && <span className="text-emerald-400 text-sm">Copied!</span>}
            </div>
            <p className="text-xs text-white/40 mt-1">
                Keep this key secret. You can use it as a Bearer token to connect to the MCP Server and access your account via AI agents.
            </p>
        </div>
    );
}
