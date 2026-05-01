"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { LogoCodeMark } from "@/components/visuals/LogoCodeMark";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy — highlight active section in navbar
  useEffect(() => {
    const sectionIds = siteConfig.nav
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => item.href.slice(2));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ x: "-50%", y: -30, opacity: 0 }}
      animate={{ x: "-50%", y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-full border transition-all duration-500",
        scrolled
          ? "border-white/10 bg-black/55 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-white/[0.06] bg-white/[0.015] backdrop-blur-md"
      )}
    >
      <nav className="relative flex items-center justify-between px-5 py-3 md:px-7">
        <Link
          href="/"
          className="group flex flex-1 items-center"
          data-cursor-grow
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-20 md:w-24"
          >
            <LogoCodeMark />
          </motion.div>
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const id = item.href.startsWith("/#") ? item.href.slice(2) : null;
            const isActive = id ? id === activeId : false;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative z-[1] block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                    isActive
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                  )}
                  data-cursor-grow
                >
                  {item.label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="hidden flex-1 justify-end md:flex">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/blog"
              className="btn-primary !px-5 !py-2 text-xs"
              data-cursor-grow
            >
              Blog
            </Link>
          </motion.div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08] md:hidden"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="grid place-items-center"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="flex flex-col gap-1 px-5 pb-5"
            >
              {siteConfig.nav.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pt-2"
              >
                <Link
                  href="/blog"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Blog
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
