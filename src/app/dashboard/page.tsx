"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, LogOut, Bell, BellOff } from "lucide-react";

export default function ClientDashboard() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/auth/check");
                const data = await res.json();

                if (!data.authenticated || data.role !== "client") {
                    router.push("/login");
                    return;
                }

                // Fetch full profile if needed, but for now we have enough from auth check
                // We could also fetch from a protected API like /api/user/profile
                setUserData(data);
            } catch (err) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [router]);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);

    // Helper for VAPID key conversion
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert("Push notifications are not supported in this browser.");
            return;
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
            console.error("VAPID Public Key is missing (NEXT_PUBLIC_VAPID_PUBLIC_KEY)");
            alert("Configuration error: Missing public key.");
            return;
        }

        setSubscribing(true);
        try {
            console.log("Starting push subscription...");
            const registration = await navigator.serviceWorker.ready;
            console.log("Service Worker ready");

            const convertedKey = urlBase64ToUint8Array(vapidKey);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });

            console.log("Push subscription created:", subscription);

            const res = await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscription }),
            });

            if (!res.ok) throw new Error("Server failed to store subscription");

            setIsSubscribed(true);
            alert("Notifications enabled! You will now receive updates on this device.");
        } catch (err: any) {
            console.error("Failed to subscribe:", err);

            let extraInfo = "";
            if (window.navigator.userAgent.match(/iPhone|iPad|iPod/)) {
                extraInfo = "\n\nNote: On iOS, notifications require adding this app to your Home Screen first.";
            }

            alert(`Failed to enable notifications: ${err.message || 'Unknown error'}${extraInfo}`);
        } finally {
            setSubscribing(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050816]">
                <div className="text-[#00fff9] animate-pulse font-medium text-xl">Loading your profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <Header />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Sidebar / Profile Summary */}
                        <Card className="w-full md:w-1/3 p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center mb-4 text-3xl font-bold">
                                {userData?.fullName?.charAt(0) || "U"}
                            </div>
                            <h1 className="text-2xl font-bold mb-1">{userData?.fullName}</h1>
                            <p className="text-gray-400 text-sm mb-6 capitalize">{userData?.role}</p>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm mb-3"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>

                            {!isSubscribed && (
                                <button
                                    onClick={subscribeToPush}
                                    disabled={subscribing}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm disabled:opacity-50"
                                >
                                    {subscribing ? (
                                        <span className="animate-pulse">Enabling...</span>
                                    ) : (
                                        <>
                                            <Bell size={16} />
                                            Enable Notifications
                                        </>
                                    )}
                                </button>
                            )}

                            {isSubscribed && (
                                <div className="text-xs text-green-400 flex items-center justify-center gap-1 mt-2">
                                    <Bell size={12} />
                                    Notifications Active
                                </div>
                            )}
                        </Card>

                        {/* Main Content */}
                        <div className="w-full md:w-2/3 space-y-6">
                            <Card className="p-8">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <User size={20} className="text-cyan-400" />
                                    Account Information
                                </h2>

                                <div className="grid gap-6">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
                                        <Mail className="text-cyan-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                                            <p className="text-lg">{userData?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
                                        <Phone className="text-cyan-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Number</p>
                                            <p className="text-lg">{userData?.phone || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-8 border-cyan-500/20">
                                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Welcome to your Dashboard</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Hi {userData?.fullName}, thank you for registering! This is your personal space where you can view your profile information.
                                    Stay tuned as we add more features for our valued users.
                                </p>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
