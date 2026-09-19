import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-md mx-auto py-24">
          <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-gray-900 border border-gray-800 text-cyan-400 mb-6 shadow-[0_0_30px_rgba(0,255,249,0.1)]">
            <Compass size={36} className="animate-spin" style={{ animationDuration: "12s" }} />
          </div>

          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase block mb-3">
            Error 404
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Page Not Found
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            The page you are looking for doesn&apos;t exist, has moved, or is temporarily unavailable.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-950 font-black text-sm hover:shadow-[0_0_25px_rgba(0,255,249,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Home size={16} />
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
