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
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 },
  },
};

export const Header = () => {
  return (
    <motion.div
      className="flex justify-center items-center fixed top-3 w-full z-50"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <nav 
        className="flex gap-1 p-0.5 rounded-full backdrop-blur-md relative overflow-hidden"
        style={{
          background: 'rgba(10, 14, 39, 0.7)',
          border: '1px solid rgba(0, 255, 249, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 249, 0.2), inset 0 0 20px rgba(0, 255, 249, 0.05)',
        }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 249, 0.1), transparent)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.a
          href="#home"
          className="nav-item relative z-10"
          variants={itemVariants}
          whileHover="hover"
          custom={0}
        >
          Home
        </motion.a>
        <motion.a
          href="#services"
          className="nav-item relative z-10"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Services
        </motion.a>
        <motion.a
          href="#technologies"
          className="nav-item relative z-10"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Technologies
        </motion.a>
        <motion.a
          href="#project"
          className="nav-item relative z-10"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Project
        </motion.a>
        {/* <motion.a
          href="#blog"
          className="nav-item relative z-10"
          variants={itemVariants}
          whileHover="hover"
          custom={1}
        >
          Blog
        </motion.a> */}
        <motion.a
          href="#about"
          className="nav-item relative z-10"
          variants={itemVariants}
          whileHover="hover"
          custom={2}
        >
          About
        </motion.a>
        <motion.a
          href="https://wa.me/+212665830816"
          target="_blank"
          className="nav-item relative z-10 font-medium"
          style={{
            background: 'linear-gradient(90deg, #00fff9, #00d4ff)',
            color: '#050816',
          }}
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 20px rgba(0, 255, 249, 0.6)',
          }}
          custom={3}
        >
          Contact
        </motion.a>
      </nav>
    </motion.div>
  );
};
