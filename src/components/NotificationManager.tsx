"use client";

import { useEffect, useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Bell } from "lucide-react";

export const NotificationManager = () => {
    const { subscribeToPush } = usePushNotifications();
    const [showDeniedPopup, setShowDeniedPopup] = useState(false);
    const [userDismissed, setUserDismissed] = useState(false);

    useEffect(() => {
        const handlePermission = async () => {
            if (!("Notification" in window)) return;
            if (userDismissed) return; // Don't show if user dismissed it

            // Function to request permission and handle the result
            const requestLoop = async () => {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        subscribeToPush(true);
                        setShowDeniedPopup(false);
                    } else if (permission === 'default') {
                        console.log("Notification permission dismissed. Retrying in 20s...");
                        setTimeout(requestLoop, 20000);
                    } else {
                        // User denied
                        console.log("Notification permission denied.");
                        if (!userDismissed) {
                            setShowDeniedPopup(true);
                            // Hide after 10 seconds
                            setTimeout(() => setShowDeniedPopup(false), 10000);
                        }
                    }
                } catch (err) {
                    console.error("Error requesting notification permission:", err);
                    setTimeout(requestLoop, 20000);
                }
            };

            // Initial check
            if (Notification.permission === 'default') {
                requestLoop();
            } else if (Notification.permission === 'granted') {
                subscribeToPush(true);
            } else if (Notification.permission === 'denied') {
                if (!userDismissed) {
                    setShowDeniedPopup(true);
                    setTimeout(() => setShowDeniedPopup(false), 10000);
                }
            }
        };

        handlePermission();
    }, [subscribeToPush, userDismissed]);

    return (
        <AnimatePresence>
            {showDeniedPopup && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 50, x: "-50%" }}
                    className="fixed bottom-8 left-1/2 z-[200] w-[90%] max-w-md"
                >
                    <div className="bg-gray-900/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.2)] flex gap-4 items-start">
                        <div className="bg-red-500/10 p-2 rounded-xl text-red-400">
                            <AlertCircle size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">Notifications Blocked</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                Please enable notifications in your browser settings to receive updates.
                            </p>
                            <button
                                onClick={() => subscribeToPush(false)}
                                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Bell size={14} />
                                Try Enabling
                            </button>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setUserDismissed(true);
                                setShowDeniedPopup(false);
                            }}
                            className="text-white hover:text-red-200 bg-red-500/80 hover:bg-red-600 border border-red-400/50 rounded-lg p-1 transition-colors cursor-pointer flex-shrink-0"
                            type="button"
                            aria-label="Close notification"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
