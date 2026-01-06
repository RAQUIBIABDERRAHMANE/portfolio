"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card } from "./Card";

interface AuthRequiredModalProps {
    isOpen: boolean;
    redirectPath?: string;
}

export const AuthRequiredModal = ({ isOpen, redirectPath = "/event" }: AuthRequiredModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative z-10 w-full max-w-md"
                    >
                        <Card className="p-8 relative overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-2xl -z-10" />

                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-cyan-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                className="text-2xl md:text-3xl font-bold mb-4 text-center glow-text"
                                style={{
                                    background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Authentication Required
                            </h2>

                            {/* Description */}
                            <p className="text-gray-400 text-center mb-8">
                                Please login or create an account to access this event registration.
                            </p>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(0,255,249,0.3)] hover:shadow-[0_0_30px_rgba(0,255,249,0.5)] transition-all"
                                    >
                                        Login
                                    </motion.button>
                                </Link>

                                <Link href={`/register?redirect=${encodeURIComponent(redirectPath)}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-lg bg-gray-800/50 border border-cyan-500/30 text-cyan-400 font-bold text-lg hover:bg-gray-800/70 hover:border-cyan-500/50 transition-all"
                                    >
                                        Create Account
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Footer text */}
                            <p className="text-gray-500 text-xs text-center mt-6">
                                Secure authentication powered by encrypted sessions
                            </p>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
