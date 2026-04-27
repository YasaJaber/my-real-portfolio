"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Copy } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal, Stagger, RevealItem } from "@/components/visuals/Reveal";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.author.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no-op */
    }
  };

  return (
    <section id="contact" className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-10 md:p-16"
      >
        {/* Subtle ambient glow inside card */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
          }}
        />

        <Reveal direction="up" distance={14}>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
            05 — Contact
          </span>
        </Reveal>

        <Reveal direction="up" delay={0.08}>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
            Got a project in mind?
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65">
            The fastest way to reach me is by email. I usually reply within
            24 hours.
          </p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.24, ease: easeOut }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <motion.a
            href={`mailto:${siteConfig.author.email}?subject=Project%20Inquiry`}
            className="btn-primary"
            data-cursor-grow
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Send size={16} />
            <span>Send an email</span>
          </motion.a>

          <motion.button
            onClick={copyEmail}
            className="btn-ghost"
            data-cursor-grow
            aria-label="Copy email"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="inline-flex"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </motion.span>
            <span className="font-mono text-xs">
              {copied ? "Copied" : siteConfig.author.email}
            </span>
          </motion.button>
        </motion.div>

        <Stagger
          className="mt-12 grid gap-6 border-t border-white/10 pt-8 text-sm md:grid-cols-3"
          stagger={0.12}
          delay={0.05}
        >
          <RevealItem>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              Location
            </div>
            <p className="text-white/85">{siteConfig.author.location}</p>
          </RevealItem>
          <RevealItem>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              Availability
            </div>
            <p className="text-white/85">Open to freelance & contract</p>
          </RevealItem>
          <RevealItem>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              Response time
            </div>
            <p className="text-white/85">Within 24 hours</p>
          </RevealItem>
        </Stagger>
      </motion.div>
    </section>
  );
}
