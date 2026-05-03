"use client";

import { motion } from "framer-motion";
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

  const serviceTranslation = t.services.items[service.key as keyof typeof t.services.items];
  const localizedTitle = serviceTranslation[locale].title;
  const localizedDescription = serviceTranslation[locale].description;
  const localizedFeatures = serviceTranslation[locale].features;
  const localizedCtaText = serviceTranslation[locale].ctaText;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.92 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            ease: easeOut,
            delay: index * 0.2,
          },
        },
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative h-full"
    >
      {/* Animated gradient background glow - continuous animation */}
      <motion.div
        className={`pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br ${service.gradient} blur-2xl`}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.5,
        }}
      />

      {/* Rotating border gradient - always visible and rotating */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-3xl"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${service.color}20, transparent 60%)`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Card container */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-white/[0.15] group-hover:bg-white/[0.05]">
        {/* Header with icon */}
        <div className="relative overflow-hidden border-b border-white/[0.06] px-6 py-8 sm:px-8 sm:py-10">
          {/* Animated background pattern */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${service.color}10 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "24px 24px"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Floating particles effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full"
                style={{
                  background: service.color,
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                  opacity: 0.2,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
              />
            ))}
          </motion.div>

          {/* Icon container with continuous animations */}
          <motion.div
            className="relative mb-6 inline-flex"
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
            whileHover={{ 
              rotate: [0, -8, 8, -8, 0],
              scale: 1.15,
            }}
          >
            <motion.div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl sm:h-20 sm:w-20"
              style={{
                background: `linear-gradient(135deg, ${service.color}15, ${service.color}08)`,
                boxShadow: `0 0 0 1px ${service.color}20, 0 8px 32px ${service.color}15`,
              }}
              animate={{
                boxShadow: [
                  `0 0 0 1px ${service.color}20, 0 8px 32px ${service.color}15`,
                  `0 0 0 1px ${service.color}30, 0 12px 40px ${service.color}25`,
                  `0 0 0 1px ${service.color}20, 0 8px 32px ${service.color}15`,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              >
                <Icon
                  size={32}
                  className="transition-all duration-500 group-hover:scale-110"
                  style={{ color: service.color }}
                />
              </motion.div>
            </motion.div>

            {/* Multiple pulse rings - always animating */}
            <motion.div
              className="absolute -inset-2 rounded-2xl"
              style={{ border: `1.5px solid ${service.color}30` }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute -inset-2 rounded-2xl"
              style={{ border: `1.5px solid ${service.color}25` }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute -inset-2 rounded-2xl"
              style={{ border: `1.5px solid ${service.color}20` }}
              animate={{
                scale: [1, 1.7, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1,
              }}
            />
          </motion.div>

          {/* Title & Description with continuous subtle animation */}
          <motion.h3 
            className="mb-3 font-display text-2xl font-semibold text-white sm:text-3xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
            animate={{
              textShadow: [
                `0 0 8px ${service.color}00`,
                `0 0 15px ${service.color}20`,
                `0 0 8px ${service.color}00`,
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {localizedTitle}
          </motion.h3>
          <motion.p 
            className="text-sm leading-relaxed sm:text-base"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          >
            {localizedDescription}
          </motion.p>
        </div>

        {/* Features list with stagger */}
        <div className="flex-1 px-6 py-8 sm:px-8">
          <motion.p 
            className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {t.services.whatYouGet[locale]}
          </motion.p>

          <ul className="space-y-3.5">
            {localizedFeatures.map((feature: string, i: number) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1 + i * 0.08 + 0.5, 
                  duration: 0.4,
                  ease: easeOut,
                }}
                whileHover={{ x: 4 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.8,
                  }}
                  whileHover={{ 
                    scale: 1.2,
                  }}
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 transition-colors duration-300"
                    style={{ color: `${service.color}70` }}
                  />
                </motion.div>
                <span className="text-sm leading-relaxed text-white/70">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA Button with enhanced animations */}
        <div className="border-t border-white/[0.06] px-6 py-6 sm:px-8">
          <Link href={service.ctaLink} className="block">
            <motion.div
              className="group/btn relative overflow-hidden rounded-xl px-6 py-4 text-center font-medium transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${service.color}15, ${service.color}08)`,
                border: `1px solid ${service.color}30`,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 0 30px ${service.color}35`,
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${service.color}20, transparent)`,
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                }}
              />

              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${service.color}25, ${service.color}15)`,
                }}
              />

              <span className="relative flex items-center justify-center gap-2 text-white">
                {localizedCtaText}
                <motion.div
                  animate={{
                    x: [0, 4, 0],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
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
