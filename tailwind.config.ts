import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f2fe',
          100: '#b9e6fe',
          200: '#7dd3fc',
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          950: '#041e2e',
        },
        neon: {
          cyan: '#00fff9',
          blue: '#00d4ff',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#00ff88',
        },
        cyber: {
          dark: '#0a0e27',
          darker: '#050816',
          card: '#0f172a',
          border: '#1e293b',
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["'Courier New'", "monospace"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-right": "slideRight 20s linear infinite",
        "grid-flow": "gridFlow 4s ease-in-out infinite",
        "scan-line": "scanLine 8s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "data-stream": "dataStream 20s linear infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { 
            boxShadow: "0 0 5px #00fff9, 0 0 10px #00fff9, 0 0 15px #00fff9",
          },
          "100%": { 
            boxShadow: "0 0 10px #00fff9, 0 0 20px #00fff9, 0 0 30px #00fff9, 0 0 40px #00d4ff",
          },
        },
        slideRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
        gridFlow: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        dataStream: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        borderGlow: {
          "0%, 100%": { 
            borderColor: "#00fff9",
            boxShadow: "0 0 5px #00fff9",
          },
          "50%": { 
            borderColor: "#00d4ff",
            boxShadow: "0 0 20px #00d4ff",
          },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
        'radial-gradient': "radial-gradient(circle at center, #00fff9 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;