import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Modern Dark Mesh System
        base: {
          DEFAULT: "#030303",
          deeper: "#020014",
          panel: "#0A0A12",
        },
        accent: {
          purple: "#A855F7",
          cyan: "#06B6D4",
          midnight: "#1E3A8A",
          rose: "#F43F5E",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          strong: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "aurora":
          "radial-gradient(ellipse at 20% 0%, rgba(168,85,247,0.35), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(6,182,212,0.30), transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(30,58,138,0.25), transparent 60%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        "aurora-shift": "aurora 18s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "cursor-blink": "cursorBlink 1s step-end infinite",
        "pulse-ring": "pulseRing 2.8s ease-out infinite",
      },
      keyframes: {
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "60%": { opacity: "0.15" },
          "100%": { transform: "scale(2.8)", opacity: "0" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 0%, 100% 100%, 50% 50%" },
          "50%": { backgroundPosition: "100% 50%, 0% 50%, 50% 100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", filter: "blur(40px)" },
          "50%": { opacity: "1", filter: "blur(60px)" },
        },
      },
      boxShadow: {
        "glow-purple": "0 0 60px -10px rgba(168, 85, 247, 0.5)",
        "glow-cyan": "0 0 60px -10px rgba(6, 182, 212, 0.5)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
