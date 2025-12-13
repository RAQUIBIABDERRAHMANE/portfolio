"use client";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";

export default function NewsletterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("https://n8n.raquibi.com/webhook/clients-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing! We'll be in touch soon.");
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
        });
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to send data. Please check your connection and try again.");
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container max-w-3xl">
        <HeaderSection
          eyebrow="Stay Connected"
          title="Join Our Newsletter"
          description="Subscribe to receive updates, exclusive content, and special offers directly to your inbox."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <Card className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Input */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Phone Number Input */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Status Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    status === "success"
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
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Submitting...
                  </span>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/60">
              <p>
                We respect your privacy. Your information will never be shared with third
                parties.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
