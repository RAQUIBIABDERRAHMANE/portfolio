"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";

export const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const [redirectPath, setRedirectPath] = useState("/dashboard");

    useEffect(() => {
        // Capture referrer on mount
        if (typeof document !== 'undefined' && document.referrer) {
            const referrerUrl = new URL(document.referrer);
            // Only redirect to internal pages, excluding the login/register pages themselves to avoid loops
            if (referrerUrl.origin === window.location.origin) {
                const path = referrerUrl.pathname;
                if (path !== '/login' && path !== '/register') {
                    setRedirectPath(path);
                }
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage("Registration successful! Redirecting...");
                // Auto-login successful, redirect to previous page or dashboard
                window.location.href = redirectPath;
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to submit. Please try again later.");
        }
    };

    return (
        <Card className="p-8 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-2xl -z-10" />

            <h2 className="text-3xl font-bold mb-6 text-center glow-text" style={{
                background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                Register Now
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        placeholder="+212 600-000000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(0,255,249,0.3)] hover:shadow-[0_0_30px_rgba(0,255,249,0.5)] transition-all disabled:opacity-50"
                >
                    {status === "loading" ? "Registering..." : "Join Now"}
                </motion.button>

                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-center text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}
                    >
                        {message}
                    </motion.p>
                )}
            </form>
        </Card>
    );
};
