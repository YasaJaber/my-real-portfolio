"use client";

import { motion, useInView } from "framer-motion";
import { Reveal, Stagger, RevealItem } from "@/components/visuals/Reveal";
import {
  Code2,
  Palette,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { SiWordpress } from "react-icons/si";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRef } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface ServiceFeature {
  text: string;
}

interface Service {
  key: string;
  icon: LucideIcon | IconType;
  color: string;
  gradient: string;
  features: ServiceFeature[];
  ctaText: string;
  ctaLink: string;
}

const services: Service[] = [
  {
    key: "frontend",
    icon: Code2,
    color: "#06B6D4",
    gradient: "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
    features: [
      { text: "Responsive web design" },
      { text: "React & Next.js development" },
      { text: "TypeScript integration" },
      { text: "Performance optimization" },
      { text: "SEO-friendly architecture" },
      { text: "Modern UI/UX implementation" },
    ],
    ctaText: "Start a project",
    ctaLink: "#contact",
  },
  {
    key: "design",
    icon: Palette,
    color: "#F59E0B",
    gradient: "from-amber-500/20 via-orange-500/20 to-red-500/20",
    features: [
      { text: "Brand identity & logos" },
      { text: "Social media graphics" },
      { text: "Marketing materials" },
      { text: "UI/UX design" },
      { text: "Print design" },
      { text: "Motion graphics" },
    ],
    ctaText: "View portfolio",
    ctaLink: "#contact",
  },
  {
    key: "wordpress",
    icon: SiWordpress,
    color: "#8B5CF6",
    gradient: "from-purple-500/20 via-violet-500/20 to-indigo-500/20",
    features: [
      { text: "Custom theme development" },
      { text: "Plugin integration" },
      { text: "E-commerce solutions" },
      { text: "Performance optimization" },
      { text: "Security hardening" },
      { text: "Maintenance & support" },
    ],
    ctaText: "Get started",
    ctaLink: "#contact",
  },
];

/* ──── Service Card ──── */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { locale, t } = useLanguage();
  const Icon = service.icon;
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, margin: "-80px" });

  const serviceTranslation = t.services.items[service.key as keyof typeof t.services.items];
  const localizedTitle = serviceTranslation[locale].title;
  const localizedDescription = serviceTranslation[locale].description;
  const localizedFeatures = serviceTranslation[locale].features;
  const localizedCtaText = serviceTranslation[locale].ctaText;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
      } : {
        opacity: 0,
        y: 60,
        scale: 0.9
      }}
      transition={{
        duration: 0.8,
        ease: easeOut,
        delay: index * 0.12,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { 
          duration: 0.3, 
          ease: easeOut,
        },
      }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${service.color}40, transparent 70%)`,
        }}
      />

      {/* Card container */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.05]">
        {/* Header with icon */}
        <div className="relative overflow-hidden border-b border-white/5 px-6 py-8 sm:px-8 sm:py-10 transition-colors duration-500 group-hover:border-white/10">
          {/* Subtle gradient background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${service.color}08, transparent 60%)`,
            }}
          />

          {/* Icon container */}
          <motion.div
            className="relative mb-6 inline-flex"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: {
                duration: 0.5,
                ease: easeOut,
              },
            }}
          >
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl sm:h-20 sm:w-20 transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`,
                boxShadow: `0 0 0 1px ${service.color}30`,
              }}
            >
              <Icon
                size={32}
                style={{ color: service.color }}
                className="transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </motion.div>

          {/* Title & Description */}
          <h3 className="mb-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            {localizedTitle}
          </h3>
          <p className="text-sm leading-relaxed text-white/60 sm:text-base transition-colors duration-500 group-hover:text-white/80">
            {localizedDescription}
          </p>
        </div>

        {/* Features list */}
        <div className="flex-1 px-6 py-8 sm:px-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-500 group-hover:text-white/60">
            {t.services.whatYouGet[locale]}
          </p>

          <ul className="space-y-3.5">
            {localizedFeatures.map((feature: string, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ 
                  delay: index * 0.12 + i * 0.05, 
                  duration: 0.5,
                  ease: easeOut,
                }}
              >
                <motion.div
                  className="flex items-start gap-3 cursor-default"
                  whileHover={{ 
                    x: 4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 transition-all duration-300"
                    style={{ color: service.color }}
                  />
                  <span className="text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    {feature}
                  </span>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="border-t border-white/5 px-6 py-6 sm:px-8 transition-colors duration-500 group-hover:border-white/10">
          <Link href={service.ctaLink} className="block">
            <motion.div
              className="group/btn relative overflow-hidden rounded-xl px-6 py-4 text-center font-medium cursor-pointer border transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${service.color}12, ${service.color}08)`,
                borderColor: `${service.color}25`,
              }}
              animate={isInView ? {
                y: [0, -2, 0],
                boxShadow: [
                  `0 0 0 ${service.color}00`,
                  `0 0 20px ${service.color}20`,
                  `0 0 0 ${service.color}00`,
                ],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5 + 1,
              }}
              whileHover={{
                scale: 1.02,
                y: -4,
                borderColor: `${service.color}50`,
                boxShadow: `0 0 30px ${service.color}40`,
                transition: {
                  duration: 0.3,
                  ease: easeOut,
                },
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              {/* Subtle shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${service.color}15, transparent)`,
                }}
                animate={isInView ? {
                  x: ["-100%", "200%"],
                } : { x: "-100%" }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.7,
                }}
              />

              <span className="relative flex items-center justify-center gap-2 text-white transition-all duration-300 group-hover/btn:gap-3">
                {localizedCtaText}
                <motion.div
                  animate={isInView ? {
                    x: [0, 2, 0],
                    y: [0, -2, 0],
                  } : {}}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5 + 0.5,
                  }}
                >
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  />
                </motion.div>
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ──── Main Services Section ──── */
export function Services() {
  const { locale, t } = useLanguage();

  return (
    <section id="services" className="section-wrapper overflow-hidden">
      {/* Header */}
      <div className="mb-14 text-center sm:mb-16">
        <Reveal direction="up" distance={14}>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
            {t.services.label[locale]}
          </span>
        </Reveal>
        <Reveal direction="up" delay={0.08}>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {t.services.heading[locale]}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.14}>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/55 md:text-lg">
            {t.services.description[locale]}
          </p>
        </Reveal>
      </div>

      {/* Services Grid */}
      <Stagger
        className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
        stagger={0.15}
        delay={0.2}
      >
        {services.map((service, index) => (
          <RevealItem key={service.key}>
            <ServiceCard service={service} index={index} />
          </RevealItem>
        ))}
      </Stagger>

      {/* Bottom decorative line */}
      <Reveal direction="up" delay={0.6}>
        <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/15 sm:w-12" />
          <span className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 sm:tracking-[0.4em]">
            {t.services.letsWorkTogether[locale]}
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/15 sm:w-12" />
        </div>
      </Reveal>
    </section>
  );
}
