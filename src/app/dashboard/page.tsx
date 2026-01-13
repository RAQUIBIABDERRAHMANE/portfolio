"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";
import { User, Mail, Phone, LogOut, Bell, Clock, Briefcase, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function ClientDashboard() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<any[]>([]);
    const [appsLoading, setAppsLoading] = useState(false);
    const router = useRouter();

    const { isSubscribed, subscribing, subscribeToPush } = usePushNotifications();

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

                // Fetch this user's employment submissions
                setAppsLoading(true);
                const appsRes = await fetch("/api/employment");
                if (appsRes.ok) {
                    const appsData = await appsRes.json();
                    setApplications(appsData.submissions || []);
                }
            } catch (err) {
                router.push("/login");
            } finally {
                setAppsLoading(false);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const hasApplications = applications.length > 0;
    const latestApplication = hasApplications ? applications[0] : null;
    const profileCompletion = Math.round(([
        userData?.fullName,
        userData?.email,
        userData?.phone
    ].filter(Boolean).length / 3) * 100);

    const statusStyles = (status: string) => {
        if (status === "approved") return "bg-green-500/15 text-green-300";
        if (status === "rejected") return "bg-red-500/15 text-red-300";
        return "bg-amber-500/15 text-amber-300";
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
                                    onClick={() => subscribeToPush(false)}
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
                            {hasApplications && (
                                <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-gray-900/60 via-gray-900 to-gray-800/80 shadow-lg shadow-cyan-500/10">
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                <Briefcase size={16} className="text-cyan-400" />
                                                Employment
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-semibold">{latestApplication ? latestApplication.status : "Not started"}</span>
                                                <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wide font-semibold ${statusStyles(latestApplication?.status || "pending")}`}>
                                                    {latestApplication ? latestApplication.status : "pending"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{latestApplication ? `Submitted ${latestApplication.submittedAt?.slice(0,10)}` : "Start your employment application"}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                <Bell size={16} className="text-emerald-400" />
                                                Notifications
                                            </div>
                                            <div className="text-lg font-semibold">{isSubscribed ? "Enabled" : "Disabled"}</div>
                                            <p className="text-xs text-gray-500 mt-1">{isSubscribed ? "You will get status updates" : "Enable push to stay updated"}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                <CheckCircle size={16} className="text-amber-400" />
                                                Profile
                                            </div>
                                            <div className="text-lg font-semibold">{profileCompletion}% complete</div>
                                            <div className="w-full h-2 bg-white/10 rounded-full mt-2">
                                                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${profileCompletion}%` }} />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Add phone to reach 100%</p>
                                        </div>
                                    </div>
                                </Card>
                            )}

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

                            {hasApplications && (
                                <Card className="p-8 border-cyan-500/20">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold flex items-center gap-2 text-cyan-400">
                                                <Clock size={18} />
                                                Employment Application
                                            </h2>
                                            <p className="text-sm text-gray-400">Track your submission status below.</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <a
                                                href="/employment"
                                                className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition-all text-sm"
                                            >
                                                Review application
                                            </a>
                                            {!isSubscribed && (
                                                <button
                                                    onClick={() => subscribeToPush(false)}
                                                    disabled={subscribing}
                                                    className="px-4 py-2 rounded-lg border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-all text-sm disabled:opacity-50"
                                                >
                                                    Enable updates
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {appsLoading ? (
                                        <p className="text-gray-400">Loading your submissions...</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {applications.map((app) => (
                                                <div
                                                    key={app.id}
                                                    className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/40 flex flex-col gap-2"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Briefcase size={16} className="text-cyan-300" />
                                                            <div>
                                                                <p className="font-semibold">{app.position || "Software Developer"}</p>
                                                                <p className="text-xs text-gray-500">Submitted {app.submittedAt?.slice(0, 10)}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wide font-semibold ${statusStyles(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                    {app.revenueSharePercentage && (
                                                        <p className="text-sm text-gray-400">Revenue Share: {app.revenueSharePercentage}%</p>
                                                    )}
                                                    {app.status === "approved" && (
                                                        <p className="text-sm text-green-300">Congrats! We will reach out shortly with next steps.</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            )}

                            <Card className="p-8 border-cyan-500/20">
                                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Welcome to your Dashboard</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Hi {userData?.fullName}, thank you for registering! This is your personal space where you can stay connected and updated on everything.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <a
                                        href="/blog"
                                        className="px-4 py-2 rounded-lg border border-white/15 text-white hover:border-cyan-400 hover:text-cyan-200 transition-all text-sm flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Read Latest Updates
                                    </a>
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
