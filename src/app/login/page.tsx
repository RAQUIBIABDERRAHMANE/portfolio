"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("idle");

                // Priority: URI Redirect > Role-based Redirect
                if (redirectTo) {
                    router.push(redirectTo);
                } else if (data.role === 'admin') {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            } else {
                setStatus("error");
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setStatus("error");
            setError("An unexpected error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                    placeholder="admin@raquibi.com"
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

            {error && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded">
                    {error}
                </p>
            )}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(0,255,249,0.3)] hover:shadow-[0_0_30px_rgba(0,255,249,0.5)] transition-all disabled:opacity-50"
            >
                {status === "loading" ? "Logging in..." : "Login"}
            </motion.button>

            <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative">
                <Header />
                <div className="py-32 container mx-auto px-4 flex justify-center items-center">
                    <Card className="p-10 w-full max-w-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-2xl -z-10" />

                        <h2 className="text-3xl font-bold mb-8 text-center glow-text" style={{
                            background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Login
                        </h2>

                        <Suspense fallback={<div className="text-cyan-400 animate-pulse text-center">SYNCHRONIZING...</div>}>
                            <LoginForm />
                        </Suspense>
                    </Card>
                </div>
                <Footer />
            </div>
        </main>
    );
}
