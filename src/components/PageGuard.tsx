"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

interface PageGuardProps {
    children: ReactNode;
    pagePath?: string;
}

interface PageStatus {
    is_enabled: boolean;
    disabled_message: string | null;
    redirect_path: string | null;
}

export function PageGuard({ children, pagePath }: PageGuardProps) {
    const [status, setStatus] = useState<"loading" | "enabled" | "disabled">("loading");
    const [pageStatus, setPageStatus] = useState<PageStatus | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const path = pagePath || pathname;

    useEffect(() => {
        const checkPageStatus = async () => {
            try {
                // Extract the first segment of the path (e.g., /event/123 -> event)
                const pathSegment = path.split("/")[1];
                if (!pathSegment) {
                    setStatus("enabled");
                    return;
                }

                const res = await fetch(`/api/pages/${pathSegment}`);
                const data: PageStatus = await res.json();
                
                setPageStatus(data);
                
                if (!data.is_enabled) {
                    if (data.redirect_path) {
                        router.replace(data.redirect_path);
                        return;
                    }
                    setStatus("disabled");
                } else {
                    setStatus("enabled");
                }
            } catch (error) {
                console.error("Error checking page status:", error);
                // Fail open - allow access if check fails
                setStatus("enabled");
            }
        };

        checkPageStatus();
    }, [path, router]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="relative">
                    <div className="size-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (status === "disabled") {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center space-y-6">
                        <div className="size-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="text-yellow-500" size={40} />
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white">Page Indisponible</h1>
                            <p className="text-gray-400">
                                {pageStatus?.disabled_message || "Cette page est temporairement désactivée."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                            >
                                <ArrowLeft size={18} />
                                Retour
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-xl font-bold transition-all"
                            >
                                <Home size={18} />
                                Accueil
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
