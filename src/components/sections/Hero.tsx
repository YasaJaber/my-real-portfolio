"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { InteractiveName } from "@/components/visuals/InteractiveName";

const easeOut = [0.22, 1, 0.36, 1] as const;

const ROLES = [
  "Front-End Developer",
  "Graphic Designer",
  "WordPress Developer",
  "UI/UX Designer",
  "React Developer",
  "Brand Identity Designer",
];

function TypewriterRole() {
  const [displayed, setDisplayed] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];

    // Hold pause after fully typed
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(timer);
    }

    // Erasing
    if (isDeleting) {
      if (displayed.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        return;
      }
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1));
      }, 40);
      return () => clearTimeout(timer);
    }

    // Typing
    if (displayed.length === currentRole.length) {
      setIsPaused(true);
      return;
    }
    const timer = setTimeout(
      () => setDisplayed(currentRole.slice(0, displayed.length + 1)),
      85
    );
    return () => clearTimeout(timer);
  }, [displayed, roleIndex, isDeleting, isPaused]);

  return (
    <span className="inline-flex items-center gap-0.5">
      <span>{displayed}</span>
      <span
        aria-hidden
        className="inline-block w-px h-[1em] bg-white/70 animate-[cursor-blink_1s_step-end_infinite] translate-y-[0.05em]"
      />
    </span>
  );
}

/**
 * Hero — centered, dark, professional.
 * Avatar (circular) on top, role label, name, one-line bio, CTAs.
 * Adds layered parallax + depth-of-field fade as user scrolls down.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);
  const contentBlur = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["blur(0px)", "blur(6px)"]
  );
  const cueOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--hero-x", `${x * 14}px`);
      el.style.setProperty("--hero-y", `${y * 14}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, filter: contentBlur }}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center md:px-10"
      >
        {/* Profile avatar with video-call ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut }}
          className="relative mb-10"
          style={{
            transform:
              "translate3d(calc(var(--hero-x, 0px) * 0.4), calc(var(--hero-y, 0px) * 0.4), 0)",
            transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Avatar container */}
          <motion.div
            className="group relative h-36 w-36 cursor-pointer md:h-44 md:w-44"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* CSS-driven ripple rings stay stable across refreshes and hot reloads. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/35 animate-pulse-ring"
              style={{ animationDelay: "0s" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/25 animate-pulse-ring"
              style={{ animationDelay: "0.95s" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/15 animate-pulse-ring"
              style={{ animationDelay: "1.9s" }}
            />

            {/* Hover glow */}
            <div className="absolute -inset-3 rounded-full bg-emerald-500/0 blur-xl transition-all duration-500 group-hover:bg-emerald-500/20" />

            {/* Circular image */}
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/10">
              <Image
                src="/yasa-jaber-hero.jpg"
                alt="Yasa Jaber"
                fill
                className="object-cover object-[center_20%] transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                priority
              />
              {/* Hover overlay gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Green online dot */}
            <span className="absolute bottom-2 right-2 z-20 flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeat: Infinity,
                }}
              />
              <motion.span
                className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#030303] bg-emerald-500 md:h-4 md:w-4"
                animate={{
                  boxShadow: [
                    "0 0 6px 1px rgba(16,185,129,0.4)",
                    "0 0 12px 3px rgba(16,185,129,0.6)",
                    "0 0 6px 1px rgba(16,185,129,0.4)",
                  ],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </span>
          </motion.div>
        </motion.div>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/50"
          style={{
            transform:
              "translate3d(calc(var(--hero-x, 0px) * 0.2), calc(var(--hero-y, 0px) * 0.2), 0)",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <TypewriterRole />
        </motion.p>

        {/* Name (centered) */}
        <div
          className="mx-auto flex justify-center"
          style={{
            transform:
              "translate3d(calc(var(--hero-x, 0px) * 0.6), calc(var(--hero-y, 0px) * 0.6), 0)",
            transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <InteractiveName text="Yasa Jaber" />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
          className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-white/60 md:text-lg"
          style={{
            transform:
              "translate3d(calc(var(--hero-x, 0px) * 0.3), calc(var(--hero-y, 0px) * 0.3), 0)",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          I build clean, fast websites and design the visuals that go with them.
          Based in sohag, available worldwide.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: easeOut }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="#projects" className="btn-primary" data-cursor-grow>
              <span>View projects</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="#contact" className="btn-ghost" data-cursor-grow>
              <span>Get in touch</span>
              <ArrowDownRight
                size={16}
                className="transition-transform duration-500 group-hover:rotate-12"
              />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/30"
      >
        <span>Scroll</span>
        <span className="block h-8 w-px overflow-hidden bg-white/15">
          <span className="block h-1/2 w-full animate-[float_2.4s_ease-in-out_infinite] bg-white/40" />
        </span>
      </motion.div>
    </section>
  );
}
