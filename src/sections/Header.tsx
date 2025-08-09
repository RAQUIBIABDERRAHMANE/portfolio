"use client";
import { motion } from "framer-motion";

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
    scale: 1.1,
    rotate: 5,
    transition: { type: "spring", stiffness: 300 },
  },
};

export const Header = () => {
  return (
    <motion.div
      className="flex justify-center items-center fixed top-3 w-full z-10"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <nav className="flex gap-1 p-0.5 border border-white/15 rounded-full bg-white/10 backdrop-blur">
        <motion.a
          href="#home"
          className="nav-item"
          variants={itemVariants}
          whileHover="hover"
          custom={0}
        >
          Home
        </motion.a>
        <motion.a
          href="#services"
          className="nav-item"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Services
        </motion.a>
        <motion.a
          href="#technologies"
          className="nav-item"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Technologies
        </motion.a>
        <motion.a
          href="#project"
          className="nav-item"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Project
        </motion.a>
        <motion.a
          href="#blog"
          className="nav-item"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Blog
        </motion.a>
        <motion.a
          href="#about"
          className="nav-item"
          variants={itemVariants}
          whileHover="hover"
          custom={2}
        >
          About
        </motion.a>
        <motion.a
          href="https://wa.me/+212665830816"
          target="_blank"
          className="nav-item bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900"
          variants={itemVariants}
          whileHover="hover"
          custom={3}
        >
          Contact
        </motion.a>
      </nav>
    </motion.div>
  );
};
