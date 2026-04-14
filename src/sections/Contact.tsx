"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { HeaderSection } from "@/components/HeaderSection";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    icon: "/icons/github.svg",
    url: "https://github.com/RAQUIBIABDERRAHMANE",
  },
  {
    name: "LinkedIn",
    icon: "/icons/linkedin.svg",
    url: "https://linkedin.com/in/abderrahmaneraquibi",
  },
  {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    url: "https://instagram.com/abderrahmaneraquibi1",
  },
];

const contactMethods = [
  {
    name: "WhatsApp",
    icon: "/icons/whatsapp.svg",
    value: "+212665830816",
    action: (value: string) => window.open(`https://wa.me/${value}`, "_blank"),
  },
  {
    name: "Email",
    icon: "/icons/email.svg",
    value: "contact@raquibi.com",
    action: (value: string) => window.open(`mailto:${value}`, "_blank"),
  },
];

type FormState = "idle" | "sending" | "success" | "error";

export const ContactSection = () => {
  const [autoFilled, setAutoFilled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-fill if user is signed in
  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setForm((prev) => ({
            ...prev,
            name: data.fullName || prev.name,
            email: data.email || prev.email,
          }));
          if (data.fullName || data.email) setAutoFilled(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setFormState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setErrorMsg(err.message);
      setFormState("error");
    }
  };

  const inputClass =
    "w-full bg-gray-900/60 border border-gray-700/80 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200";

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <HeaderSection
          eyebrow="Get in Touch"
          title="Let's Create Something Amazing Together"
          description="Ready to bring your next project to life? Fill in the form or reach out directly — I usually reply within 24 hours."
        />

        <div className="mt-12 lg:mt-20 grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Contact Form ─────────────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 h-full">
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Send a Message
              </h3>

              {/* Auto-fill notice */}
              {autoFilled && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold"
                >
                  <Sparkles size={13} className="flex-shrink-0" />
                  Your name and email were auto-filled from your account
                </motion.div>
              )}

              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                >
                  <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle size={30} className="text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                  <p className="text-gray-400 max-w-xs">Thanks for reaching out. I&apos;ll get back to you within 24 hours. Check your inbox for a confirmation email.</p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/10 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5 font-medium flex items-center justify-between">
                        <span>Your Name <span className="text-cyan-500">*</span></span>
                        {autoFilled && form.name && (
                          <span className="text-[10px] text-emerald-400 font-bold tracking-wide">✓ AUTO-FILLED</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className={`${inputClass} ${autoFilled && form.name ? 'border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/20' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5 font-medium flex items-center justify-between">
                        <span>Email Address <span className="text-cyan-500">*</span></span>
                        {autoFilled && form.email && (
                          <span className="text-[10px] text-emerald-400 font-bold tracking-wide">✓ AUTO-FILLED</span>
                        )}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className={`${inputClass} ${autoFilled && form.email ? 'border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/20' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5 font-medium">Subject <span className="text-cyan-500">*</span></label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="" disabled>Select a topic...</option>
                      <option value="Project Inquiry">Project Inquiry</option>
                      <option value="Freelance Collaboration">Freelance Collaboration</option>
                      <option value="Job Opportunity">Job Opportunity</option>
                      <option value="Technical Question">Technical Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5 font-medium">Message <span className="text-cyan-500">*</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project, what you need, and any relevant details..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {formState === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                      <AlertCircle size={17} className="flex-shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={formState === "sending"}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 relative overflow-hidden"
                    style={{
                      background: formState === "sending"
                        ? "rgba(0,255,249,0.05)"
                        : "linear-gradient(90deg, #00fff9, #00d4ff)",
                      color: formState === "sending" ? "#00fff9" : "#050816",
                      border: "1px solid rgba(0,255,249,0.5)",
                    }}
                    whileHover={formState !== "sending" ? { scale: 1.01, boxShadow: "0 0 25px rgba(0,255,249,0.3)" } : {}}
                    whileTap={formState !== "sending" ? { scale: 0.99 } : {}}
                  >
                    {formState === "sending" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </Card>
          </motion.div>

          {/* ── Right Column: Direct Contact + Socials ──────── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Direct Contact */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-5 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Direct Contact
              </h3>
              <div className="flex flex-col gap-3">
                {contactMethods.map((method) => (
                  <motion.button
                    key={method.name}
                    onClick={() => method.action(method.value)}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors group text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="size-11 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl p-0.5 flex-shrink-0">
                      <div className="size-full bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Image src={method.icon} alt={method.name} width={22} height={22} className="size-5" />
                      </div>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-white/60 truncate">{method.value}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-5 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Find Me Online
              </h3>
              <div className="flex flex-col gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="size-11 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl p-0.5 flex-shrink-0">
                      <div className="size-full bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Image src={social.icon} alt={social.name} width={22} height={22} className="size-5" />
                      </div>
                    </div>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </Card>

            {/* Response time card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-400">Available for Work</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Typically respond within <span className="text-white font-semibold">24 hours</span>. Based in Morocco 🇲🇦, working with clients worldwide.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
