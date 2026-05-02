"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  ArrowDownRight,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Mail,
} from "lucide-react";
import { FaBehance } from "react-icons/fa";
import { InteractiveName } from "@/components/visuals/InteractiveName";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n/LanguageContext";

// X (Twitter) icon — lucide doesn't ship the new wordmark.
function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}



const SOCIAL_LINKS = [
  { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: siteConfig.links.instagram, icon: Instagram, label: "Instagram" },
  { href: siteConfig.links.behance, icon: FaBehance, label: "Behance" },
  { href: siteConfig.links.x, icon: XIcon, label: "X" },
  { href: siteConfig.links.facebook, icon: Facebook, label: "Facebook" },
  { href: siteConfig.links.youtube, icon: Youtube, label: "YouTube" },
  { href: `mailto:${siteConfig.author.email}`, icon: Mail, label: "Email" },
] as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

function TypewriterRole() {
  const { locale, t } = useLanguage();
  const roles = t.hero.roles[locale];
  const [displayed, setDisplayed] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Reset on locale change
  useEffect(() => {
    setDisplayed("");
    setRoleIndex(0);
    setIsDeleting(false);
    setIsPaused(false);
  }, [locale]);

  useEffect(() => {
    const currentRole = roles[roleIndex];

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
        setRoleIndex((prev) => (prev + 1) % roles.length);
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
  }, [displayed, roleIndex, isDeleting, isPaused, roles]);

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
  const { locale, t } = useLanguage();
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
          className={`font-mono text-xs uppercase tracking-[0.3em] text-white/50 ${
            locale === "ar" ? "mb-8 md:mb-9" : "mb-6"
          }`}
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
          className={`mx-auto flex justify-center ${locale === "ar" ? "mt-[22px] md:mt-[26px]" : ""}`}
          style={{
            transform:
              `translate3d(calc(var(--hero-x, 0px) * 0.6 + ${locale === "ar" ? "8px" : "0px"}), calc(var(--hero-y, 0px) * 0.6), 0)`,
            transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <InteractiveName text={t.hero.heroName[locale]} isRTL={locale === "ar"} />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
          className={`max-w-xl text-pretty text-base leading-relaxed text-white/60 md:text-lg ${
            locale === "ar" ? "mt-10 md:mt-11" : "mt-8"
          }`}
          style={{
            transform:
              "translate3d(calc(var(--hero-x, 0px) * 0.3), calc(var(--hero-y, 0px) * 0.3), 0)",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {t.hero.tagline[locale]}
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
              <span>{t.hero.viewProjects[locale]}</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="#contact" className="btn-ghost" data-cursor-grow>
              <span>{t.hero.getInTouch[locale]}</span>
              <ArrowDownRight
                size={16}
                className="transition-transform duration-500 group-hover:rotate-12"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Social links */}
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.9 },
            },
          }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{
            transform:
              "translate3d(calc(var(--hero-x, 0px) * 0.25), calc(var(--hero-y, 0px) * 0.25), 0)",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.85 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <motion.div
                whileHover={{ y: -3, rotate: -4 }}
                whileTap={{ scale: 0.92 }}
              >
                <Link
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:") ? undefined : "noreferrer"
                  }
                  aria-label={label}
                  title={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  data-cursor-grow
                >
                  <Icon size={15} />
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/30"
      >
        <span>{t.hero.scroll[locale]}</span>
        <span className="block h-8 w-px overflow-hidden bg-white/15">
          <span className="block h-1/2 w-full animate-[float_2.4s_ease-in-out_infinite] bg-white/40" />
        </span>
      </motion.div>
    </section>
  );
}
