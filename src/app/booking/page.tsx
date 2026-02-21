"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { PageGuard } from "@/components/PageGuard";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Lock,
  LogIn,
} from "lucide-react";
import { Card } from "@/components/Card";

const SERVICE_TYPES = [
  "Appel de decouverte",
  "Demo de projet",
  "Consultation technique",
  "Autre",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Step = "calendar" | "slots" | "form" | "success";

export default function BookingPage() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setAuthStatus("authenticated");
          setForm((prev) => ({
            ...prev,
            name: d.fullName || "",
            email: d.email || "",
            phone: d.phone || "",
          }));
        } else {
          setAuthStatus("unauthenticated");
        }
      })
      .catch(() => setAuthStatus("unauthenticated"));
  }, []);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState<Step>("calendar");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: SERVICE_TYPES[0],
    message: "",
  });

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const calendarDays = (): (number | null)[] => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < todayDate;
  };

  const isTodayCell = (day: number) =>
    todayDate.getFullYear() === viewYear &&
    todayDate.getMonth() === viewMonth &&
    todayDate.getDate() === day;

  const toDateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    try {
      const res = await fetch(`/api/booking/slots?date=${date}`);
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleDayClick = (day: number) => {
    if (isPast(day)) return;
    const ds = toDateStr(day);
    setSelectedDate(ds);
    setSelectedSlot(null);
    fetchSlots(ds);
    setStep("slots");
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time_slot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("success");
      } else {
        alert(data.error || "Booking failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (ds: string) => {
    if (!ds) return "";
    const [y, m, d] = ds.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const resetBooking = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setForm({
      name: "",
      email: "",
      phone: "",
      service_type: SERVICE_TYPES[0],
      message: "",
    });
  };

  const stepList: Step[] = ["calendar", "slots", "form", "success"];

  return (
    <PageGuard pagePath="booking">
      <Header />
      <main className="min-h-screen bg-[#020617] pt-20 pb-20">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #00fff9 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="container max-w-4xl px-4 pt-10">
          {/* Auth loading */}
          {authStatus === "loading" && (
            <div className="flex items-center justify-center py-40 gap-3 text-cyan-400">
              <Loader2 size={28} className="animate-spin" />
              <span className="font-bold tracking-widest uppercase text-sm">
                Checking access...
              </span>
            </div>
          )}

          {/* Not signed in */}
          {authStatus === "unauthenticated" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="size-24 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,255,249,0.1)]">
                <Lock size={40} className="text-cyan-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">
                Sign In Required
              </h2>
              <p className="text-gray-400 max-w-sm mb-8">
                You must be signed in to book a session. Create a free account
                or log in to continue.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/login?redirect=/booking")}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-[#020617] rounded-xl font-black hover:bg-cyan-400 transition-all"
                >
                  <LogIn size={18} /> Sign In
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl font-black hover:bg-cyan-500/20 transition-all"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}

          {/* Authenticated */}
          {authStatus === "authenticated" && (
            <>
              {/* Page header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <Calendar size={12} />
                  Schedule a Meeting
                </div>
                <h1
                  className="text-4xl md:text-5xl font-black text-white mb-4"
                  style={{ textShadow: "0 0 40px rgba(0,255,249,0.3)" }}
                >
                  Book a Session
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                  Choose a date and time that works for you. All sessions are 45
                  minutes.
                </p>
              </motion.div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-3 mb-10">
                {stepList.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        step === s
                          ? "bg-cyan-500 text-[#020617]"
                          : stepList.indexOf(step) > i
                          ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                          : "bg-gray-900 border border-gray-800 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < 3 && (
                      <div
                        className={`w-8 h-px transition-all ${
                          stepList.indexOf(step) > i
                            ? "bg-cyan-500/50"
                            : "bg-gray-800"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1 — Calendar */}
                {step === "calendar" && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="p-6 md:p-8 border-cyan-500/10">
                      <div className="flex items-center justify-between mb-8">
                        <button
                          onClick={prevMonth}
                          className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition-all"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">
                          {MONTH_NAMES[viewMonth]} {viewYear}
                        </h2>
                        <button
                          onClick={nextMonth}
                          className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      {/* Day labels */}
                      <div className="grid grid-cols-7 mb-2">
                        {DAY_LABELS.map((d) => (
                          <div
                            key={d}
                            className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-2"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Days grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays().map((day, idx) => {
                          if (!day) return <div key={`empty-${idx}`} />;
                          const past = isPast(day);
                          const isT = isTodayCell(day);
                          const ds = toDateStr(day);
                          const isSel = selectedDate === ds;
                          return (
                            <motion.button
                              key={day}
                              whileHover={!past ? { scale: 1.1 } : {}}
                              whileTap={!past ? { scale: 0.95 } : {}}
                              onClick={() => !past && handleDayClick(day)}
                              disabled={past}
                              className={[
                                "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative",
                                past
                                  ? "text-gray-800 cursor-not-allowed"
                                  : "cursor-pointer",
                                isSel
                                  ? "bg-cyan-500 text-[#020617] shadow-[0_0_20px_rgba(0,255,249,0.4)]"
                                  : "",
                                isT && !isSel
                                  ? "border border-cyan-500/50 text-cyan-400"
                                  : "",
                                !past && !isSel
                                  ? "hover:bg-cyan-500/10 hover:text-cyan-300 text-gray-300"
                                  : "",
                              ].join(" ")}
                            >
                              {day}
                              {isT && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-cyan-500" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="mt-6 flex items-center gap-6 text-xs text-gray-500">
                        <span className="flex items-center gap-2">
                          <span className="size-3 rounded-sm bg-cyan-500" />
                          Selected
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="size-3 rounded-sm border border-cyan-500/50" />
                          Today
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="size-3 rounded-sm bg-gray-800" />
                          Unavailable
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2 — Time slots */}
                {step === "slots" && (
                  <motion.div
                    key="slots"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="p-6 md:p-8 border-cyan-500/10">
                      <button
                        onClick={() => setStep("calendar")}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-bold mb-6"
                      >
                        <ArrowLeft size={16} /> Back to calendar
                      </button>

                      <div className="flex items-center gap-3 mb-8">
                        <div className="size-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                          <Clock size={20} className="text-cyan-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-white">
                            {formatDate(selectedDate!)}
                          </h2>
                          <p className="text-gray-500 text-sm">
                            Select an available time slot (45 min)
                          </p>
                        </div>
                      </div>

                      {loadingSlots ? (
                        <div className="flex items-center justify-center py-16 gap-3 text-cyan-400">
                          <Loader2 size={24} className="animate-spin" />
                          <span className="font-bold">
                            Loading available slots...
                          </span>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-16">
                          <p className="text-gray-500 font-bold text-lg mb-2">
                            No slots available
                          </p>
                          <p className="text-gray-600 text-sm mb-6">
                            This day is fully booked or unavailable.
                          </p>
                          <button
                            onClick={() => setStep("calendar")}
                            className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl font-bold hover:bg-cyan-500/20 transition-all"
                          >
                            Choose another date
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {availableSlots.map((slot) => (
                            <motion.button
                              key={slot}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSlotSelect(slot)}
                              className="py-3 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 font-bold hover:bg-cyan-500/20 hover:border-cyan-500/60 hover:shadow-[0_0_15px_rgba(0,255,249,0.2)] transition-all text-sm"
                            >
                              {slot}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}

                {/* Step 3 — Form */}
                {step === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="p-6 md:p-8 border-cyan-500/10">
                      <button
                        onClick={() => setStep("slots")}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-bold mb-6"
                      >
                        <ArrowLeft size={16} /> Back to time slots
                      </button>

                      {/* Session summary */}
                      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-cyan-300">
                          <Calendar size={14} />
                          <span className="font-bold">
                            {formatDate(selectedDate!)}
                          </span>
                        </div>
                        <span className="text-gray-700">|</span>
                        <div className="flex items-center gap-2 text-sm text-cyan-300">
                          <Clock size={14} />
                          <span className="font-bold">
                            {selectedSlot} (45 min)
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Auto-fill notice */}
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-[11px] text-cyan-400">
                          <Lock size={12} className="shrink-0" />
                          <span>Your profile info has been pre-filled automatically.</span>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/60"
                            />
                            <input
                              required
                              readOnly
                              value={form.name}
                              className="w-full bg-gray-950/60 border border-cyan-500/20 rounded-xl pl-11 pr-10 py-3 text-gray-300 cursor-default select-none focus:outline-none"
                            />
                            <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">
                            Email *
                          </label>
                          <div className="relative">
                            <Mail
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/60"
                            />
                            <input
                              required
                              type="email"
                              readOnly
                              value={form.email}
                              className="w-full bg-gray-950/60 border border-cyan-500/20 rounded-xl pl-11 pr-10 py-3 text-gray-300 cursor-default select-none focus:outline-none"
                            />
                            <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">
                            Phone
                          </label>
                          <div className="relative">
                            <Phone
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/60"
                            />
                            <input
                              readOnly
                              value={form.phone}
                              className="w-full bg-gray-950/60 border border-cyan-500/20 rounded-xl pl-11 pr-10 py-3 text-gray-300 cursor-default select-none focus:outline-none"
                              placeholder="Not set in profile"
                            />
                            <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                          </div>
                        </div>

                        {/* Service type */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">
                            Session Type *
                          </label>
                          <div className="relative">
                            <Briefcase
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                            <select
                              required
                              value={form.service_type}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  service_type: e.target.value,
                                })
                              }
                              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                            >
                              {SERVICE_TYPES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">
                            Message
                          </label>
                          <div className="relative">
                            <MessageSquare
                              size={16}
                              className="absolute left-4 top-4 text-gray-500"
                            />
                            <textarea
                              value={form.message}
                              onChange={(e) =>
                                setForm({ ...form, message: e.target.value })
                              }
                              rows={4}
                              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                              placeholder="Tell me what you would like to discuss..."
                            />
                          </div>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={submitting}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 rounded-xl bg-cyan-500 text-[#020617] font-black text-lg hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-tighter"
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Booking...
                            </>
                          ) : (
                            <>
                              <Calendar size={20} />
                              Confirm Booking
                            </>
                          )}
                        </motion.button>
                      </form>
                    </Card>
                  </motion.div>
                )}

                {/* Step 4 — Success */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="p-10 md:p-16 text-center border-emerald-500/20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          delay: 0.2,
                        }}
                        className="size-24 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                      >
                        <CheckCircle size={48} className="text-emerald-400" />
                      </motion.div>
                      <h2 className="text-3xl font-black text-white mb-3">
                        Booking Submitted!
                      </h2>
                      <p className="text-gray-400 mb-2">
                        Your session request has been received.
                      </p>
                      <div className="inline-flex flex-col items-center gap-2 px-8 py-4 bg-gray-900/50 border border-gray-800 rounded-xl my-6">
                        <p className="text-cyan-400 font-bold">
                          {formatDate(selectedDate!)}
                        </p>
                        <p className="text-cyan-300 text-sm">
                          {selectedSlot} - 45 minutes
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Type: {form.service_type}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm mb-8">
                        A confirmation email has been sent to{" "}
                        <span className="text-cyan-400">{form.email}</span>. I
                        will review your request and confirm shortly.
                      </p>
                      <button
                        onClick={resetBooking}
                        className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl font-bold hover:bg-cyan-500/20 transition-all"
                      >
                        Book another session
                      </button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
      <Footer />
    </PageGuard>
  );
}
