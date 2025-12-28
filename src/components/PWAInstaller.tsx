"use client";
import { useEffect, useState } from "react";

export default function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // 1. Register Service Worker
        if ("serviceWorker" in navigator) {
            const registerSW = () => {
                navigator.serviceWorker.register("/sw.js").then(
                    (reg) => console.log("SW registered:", reg.scope),
                    (err) => console.log("SW registration failed:", err)
                );

                // Listen for messages from SW (e.g. to play sound if app is open)
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'PLAY_SOUND') {
                        const audio = new Audio('/notification.mp3');
                        audio.play().catch(e => console.log('Audio play failed (interaction required):', e));
                    }
                });
            };

            if (document.readyState === "complete") {
                registerSW();
            } else {
                window.addEventListener("load", registerSW);
            }
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
