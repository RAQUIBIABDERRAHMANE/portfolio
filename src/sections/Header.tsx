"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Menu, X } from "lucide-react";

const navVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 10,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 8,
    },
  },
};

const hoverVariants = {
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 },
  },
};

export const Header = () => {
  const [auth, setAuth] = useState<{ authenticated: boolean; role?: string }>({ authenticated: false });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setAuth({ authenticated: data.authenticated, role: data.role });
      } catch (err) {
        setAuth({ authenticated: false });
      }
    };
    checkAuth();
  }, []);

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handlePWAInstallable = (e: any) => {
      setInstallPrompt(e.detail);
    };

    window.addEventListener("pwa-installable", handlePWAInstallable);
    return () => window.removeEventListener("pwa-installable", handlePWAInstallable);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setAuth({ authenticated: false });
    router.push("/");
    router.refresh();
  };

  return (
    <motion.div
      className="flex justify-center items-center fixed top-3 w-full z-50 px-4"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="relative w-full max-w-fit">
        {/* Desktop Nav */}
        <nav
          className="hidden md:flex gap-1 p-0.5 rounded-full backdrop-blur-md relative overflow-hidden"
          style={{
            background: "rgba(10, 14, 39, 0.7)",
            border: "1px solid rgba(0, 255, 249, 0.3)",
            boxShadow: "0 0 30px rgba(0, 255, 249, 0.2), inset 0 0 20px rgba(0, 255, 249, 0.05)",
          }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0, 255, 249, 0.1), transparent)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.a href="/" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={0}>
            Home
          </motion.a>
          <motion.a href="/#services" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={1}>
            Services
          </motion.a>
          <motion.a href="/#technologies" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={1}>
            Technologies
          </motion.a>
          <motion.a href="/#project" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={1}>
            Project
          </motion.a>
          <motion.a href="/#about" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={2}>
            About
          </motion.a>

          {!auth.authenticated ? (
            <>
              <motion.a href="/register" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={2}>
                Register
              </motion.a>
              <motion.a href="/login" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={2}>
                Login
              </motion.a>
            </>
          ) : (
            <>
              {auth.role === 'admin' ? (
                <motion.a href="/admin" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={2}>
                  Admin
                </motion.a>
              ) : (
                <motion.a href="/dashboard" className="nav-item relative z-10" variants={itemVariants} whileHover="hover" custom={2}>
                  Dashboard
                </motion.a>
              )}
              <motion.button onClick={handleLogout} className="nav-item relative z-10 text-red-400" variants={itemVariants} whileHover="hover" custom={2}>
                Logout
              </motion.button>
            </>
          )}

          {installPrompt && (
            <motion.button
              onClick={handleInstall}
              className="nav-item relative z-10 flex items-center gap-1 text-cyan-400"
              variants={itemVariants}
              whileHover="hover"
              custom={3}
            >
              <Download size={16} />
              Install
            </motion.button>
          )}

          <motion.a
            href="https://wa.me/+212665830816"
            target="_blank"
            className="nav-item relative z-10 font-medium"
            style={{
              background: "linear-gradient(90deg, #00ff88, #00d4ff)",
              color: "#050816",
            }}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.6)",
            }}
            custom={3}
          >
            Contact
          </motion.a>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center justify-between w-full max-w-screen-sm px-6 py-3 rounded-full backdrop-blur-md"
          style={{
            background: "rgba(10, 14, 39, 0.8)",
            border: "1px solid rgba(0, 255, 249, 0.3)",
            boxShadow: "0 0 20px rgba(0, 255, 249, 0.1)",
          }}
        >
          <Link href="/" className="text-cyan-400 font-bold text-xl uppercase tracking-widest">
            AR
          </Link>
          <button onClick={toggleMenu} className="text-cyan-400 transition-transform active:scale-95">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="md:hidden absolute top-16 left-0 right-0 p-4 rounded-3xl backdrop-blur-xl flex flex-col gap-3 z-50 border border-cyan-500/20"
            style={{
              background: "rgba(5, 8, 22, 0.95)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/#services" },
              { label: "Technologies", href: "/#technologies" },
              { label: "Project", href: "/#project" },
              { label: "About", href: "/#about" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-xl hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-all font-medium border border-transparent hover:border-cyan-500/20"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-cyan-500/10 my-1 mx-4" />

            {!auth.authenticated ? (
              <>
                <Link href="/register" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl hover:bg-cyan-500/10 text-cyan-400 font-medium">
                  Register
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl hover:bg-cyan-500/10 text-cyan-400 font-medium">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={auth.role === 'admin' ? "/admin" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl hover:bg-cyan-500/10 text-cyan-400 font-medium"
                >
                  {auth.role === 'admin' ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="px-6 py-3 rounded-xl hover:bg-red-500/10 text-red-400 font-medium text-left"
                >
                  Logout
                </button>
              </>
            )}

            {installPrompt && (
              <button
                onClick={() => { handleInstall(); setIsOpen(false); }}
                className="px-6 py-3 rounded-xl bg-cyan-500/10 text-cyan-400 font-medium flex items-center gap-2"
              >
                <Download size={16} />
                Install App
              </button>
            )}

            <Link
              href="https://wa.me/+212665830816"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-center py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-[#050816] font-bold shadow-lg shadow-cyan-500/20"
            >
              Contact Me
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
