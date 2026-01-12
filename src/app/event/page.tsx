"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import { PageGuard } from "@/components/PageGuard";

function EventPageContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    classe: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "checking">("checking");
  const [message, setMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking event auth...");
        const res = await fetch("/api/auth/check");
        if (!res.ok) throw new Error();
        const data = await res.json();
        console.log("Auth data for event:", data);

        if (!data.authenticated) {
          setShowAuthModal(true);
          setStatus("idle");
          return;
        }

        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || ""
        }));
        setStatus("idle");
      } catch (err) {
        console.error("Event auth error:", err);
        setShowAuthModal(true);
        setStatus("idle");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      console.log("Submitting event form with data:", formData);
      const response = await fetch("https://n8n.raquibi.com/webhook/event-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setMessage("Registration successful!");
        setFormData(prev => ({ ...prev, classe: "" }));
      } else {
        setStatus("error");
        setMessage("An error occurred while submitting the form. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050816]">
        <div className="text-cyan-400 animate-pulse font-mono tracking-widest uppercase">Verified Access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <AuthRequiredModal isOpen={showAuthModal} redirectPath="/event" />
      <Header />
      <main className="container max-w-3xl py-32 lg:py-40">
        <HeaderSection
          eyebrow="Join the Event"
          title="ID-SIGNAL LOCK: EVENT"
          description="FORCED AUTO-FILL ACTIVE. If you see placeholders, please refresh your terminal/browser."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <Card className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="Your full name"
                />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="example@email.com"
                />
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="06 XX XX XX XX"
                />
              </div>
              {/* Class */}
              <div>
                <label htmlFor="classe" className="block text-sm font-medium text-white/90 mb-2">
                  Class
                </label>
                <input
                  type="text"
                  id="classe"
                  name="classe"
                  value={formData.classe}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="Your class"
                />
              </div>

              {/* Status Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${status === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                >
                  {message}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Registration"
                )}
              </button>
            </form>
            <div className="mt-8 text-center text-xs text-white/40">
              <p>
                Secure identity node registration enabled. Your data is protected.
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function EventPage() {
  return (
    <PageGuard>
      <EventPageContent />
    </PageGuard>
  );
}
