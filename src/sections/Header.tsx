"use client";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Menu,
  X,
  Home,
  Briefcase,
  Cpu,
  User,
  Github,
  Linkedin,
  Instagram,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Smartphone
} from "lucide-react";

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

export const Header = () => {
  const [auth, setAuth] = useState<{ authenticated: boolean; role?: string }>({ authenticated: false });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) throw new Error();
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setAuth({ authenticated: false });
    router.push("/");
    router.refresh();
    handleLinkClick();
  };

  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 z-[110] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center py-4 px-4">
        {/* Navbar Container */}
        <div className="relative w-full flex justify-center items-center h-14">
          {/* Desktop Navigation */}
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className="hidden md:flex gap-1 p-0.5 rounded-full backdrop-blur-md relative overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,249,0.2)] bg-gray-950/70"
          >
            {/* Animated Reflection */}
            <motion.div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0, 255, 249, 0.4), transparent)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/#services" },
              { label: "Technologies", href: "/#technologies" },
              { label: "Project", href: "/#project" },
              { label: "About", href: "/#about" },
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="nav-item"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                custom={i}
              >
                {link.label}
              </motion.a>
            ))}

            {!auth.authenticated ? (
              <>
                <motion.a
                  href="/register"
                  className="nav-item text-cyan-400 font-bold"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  custom={5}
                >
                  Register
                </motion.a>
                <motion.a
                  href="/login"
                  className="nav-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  custom={6}
                >
                  Login
                </motion.a>
              </>
            ) : (
              <>
                <motion.a
                  href={auth.role === 'admin' ? "/admin" : "/dashboard"}
                  className="nav-item text-cyan-400 font-bold"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  custom={5}
                >
                  {auth.role === 'admin' ? "Admin" : "Dashboard"}
                </motion.a>
                <motion.button
                  onClick={handleLogout}
                  className="nav-item text-red-100/60 hover:text-red-400"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  custom={6}
                >
                  Logout
                </motion.button>
              </>
            )}

            {installPrompt && (
              <motion.button
                onClick={handleInstall}
                className="nav-item flex items-center gap-1 text-emerald-400"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                custom={7}
              >
                <Download size={16} /> Install
              </motion.button>
            )}

            <motion.a
              href="https://wa.me/+212665830816"
              target="_blank"
              className="nav-item font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 ml-1 rounded-full px-6"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(0, 255, 249, 0.4)"
              }}
              custom={8}
            >
              Contact
            </motion.a>
          </motion.nav>

          {/* Mobile Navbar Toggle */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:hidden flex items-center justify-between w-full max-w-sm px-6 py-2 rounded-full backdrop-blur-md border border-cyan-500/30 bg-gray-950/80 shadow-lg shadow-cyan-500/10"
          >
            <Link href="/" className="text-cyan-400 font-black text-xl tracking-tighter" onClick={handleLinkClick}>
              RAQUIBI<span className="text-white">.</span>
            </Link>
            <button
              onClick={toggleMenu}
              className="relative z-[110] text-cyan-400 p-2 transition-transform active:scale-90"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-0 z-[105] bg-gray-950/95 backdrop-blur-2xl flex flex-col pt-24 pb-12 px-8 overflow-y-auto"
            >
              {/* Nav Group */}
              <div className="space-y-2 mb-10">
                <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em] mb-4 ml-4">Explore</p>
                {[
                  { label: "Home", href: "/", icon: <Home size={22} /> },
                  { label: "Services", href: "/#services", icon: <Briefcase size={22} /> },
                  { label: "Technologies", href: "/#technologies", icon: <Cpu size={22} /> },
                  { label: "Projects", href: "/#project", icon: <MessageSquare size={22} /> },
                  { label: "About Me", href: "/#about", icon: <User size={22} /> },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-5 p-4 rounded-2xl hover:bg-cyan-500/10 text-gray-300 hover:text-white transition-all group border border-transparent hover:border-cyan-500/20"
                  >
                    <div className="text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                      {link.icon}
                    </div>
                    <span className="text-xl font-bold">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Account Group */}
              <div className="mb-10">
                <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em] mb-4 ml-4">Account</p>
                {!auth.authenticated ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={handleLinkClick} className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-gray-900 border border-gray-800 text-cyan-400 font-bold">
                      <LogIn size={24} /> Login
                    </Link>
                    <Link href="/register" onClick={handleLinkClick} className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-cyan-500 text-gray-950 font-bold">
                      <UserPlus size={24} /> Join
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={auth.role === 'admin' ? "/admin" : "/dashboard"} onClick={handleLinkClick} className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-gray-900 border border-gray-800 text-cyan-400 font-bold">
                      <LayoutDashboard size={24} /> {auth.role === 'admin' ? "Admin" : "Panel"}
                    </Link>
                    <button onClick={handleLogout} className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold">
                      <LogOut size={24} /> Exit
                    </button>
                  </div>
                )}
              </div>

              {/* Utility / Socials */}
              <div className="mt-auto space-y-6">
                {installPrompt && (
                  <button
                    onClick={() => { handleInstall(); handleLinkClick(); }}
                    className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center gap-3"
                  >
                    <Smartphone size={20} /> Install App
                  </button>
                )}

                <div className="flex justify-center gap-6">
                  {[
                    { icon: <Github size={24} />, url: "https://github.com/abderrahmaneraquibi" },
                    { icon: <Linkedin size={24} />, url: "https://linkedin.com/in/abderrahmaneraquibi" },
                    { icon: <Instagram size={24} />, url: "https://instagram.com/abderrahmaneraquibi1" },
                  ].map((s, i) => (
                    <a key={i} href={s.url} target="_blank" className="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-cyan-400 transition-colors">
                      {s.icon}
                    </a>
                  ))}
                </div>

                <Link
                  href="https://wa.me/+212665830816"
                  target="_blank"
                  onClick={handleLinkClick}
                  className="block w-full text-center py-5 rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-600 text-gray-950 font-black text-xl shadow-lg shadow-cyan-500/20"
                >
                  LET&apos;S CONNECT
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
