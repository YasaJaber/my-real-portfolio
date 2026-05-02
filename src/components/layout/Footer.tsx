"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Facebook, Youtube, Mail } from "lucide-react";
import { FaBehance } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

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

export function Footer() {
  const { locale, t } = useLanguage();

  return (
     <footer className="relative z-10 mt-20 max-w-[100vw] overflow-x-hidden border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 text-center sm:px-6 md:flex-row md:items-end md:justify-between md:px-10 md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <h3 className="font-display text-xl font-semibold text-white">
            {siteConfig.name}
          </h3>
          <p className="mt-2 text-sm text-white/55">
            {siteConfig.author.role}
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          className="flex flex-wrap items-center justify-center gap-2 md:justify-end"
        >
          {[
            { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
            { href: siteConfig.links.instagram, icon: Instagram, label: "Instagram" },
            { href: siteConfig.links.behance, icon: FaBehance, label: "Behance" },
            { href: siteConfig.links.x, icon: XIcon, label: "X" },
            { href: siteConfig.links.facebook, icon: Facebook, label: "Facebook" },
            { href: siteConfig.links.youtube, icon: Youtube, label: "YouTube" },
            { href: `mailto:${siteConfig.author.email}`, icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <motion.div
                whileHover={{ y: -3, rotate: -3 }}
                whileTap={{ scale: 0.92 }}
              >
                <Link
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                  data-cursor-grow
                >
                  <Icon size={15} />
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 sm:px-6 md:flex-row md:px-10 md:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <p>{t.footer.builtWith[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
