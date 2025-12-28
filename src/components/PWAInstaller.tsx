"use client";
import { useEffect, useState } from "react";

export default function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // 1. Register Service Worker
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js").then(
                    (reg) => console.log("SW registered:", reg.scope),
                    (err) => console.log("SW registration failed:", err)
                );
            });
        }

        // 2. Listen for install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Dispatch custom event so the Header can see it
            window.dispatchEvent(new CustomEvent("pwa-installable", { detail: e }));
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    return null; // Side-effect only component
}
