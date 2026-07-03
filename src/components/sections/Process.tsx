"use client";

import { motion, type Variants } from "framer-motion";
import {
  Code2,
  Compass,
  PenTool,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/visuals/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

type ProcessStepKey = "discovery" | "design" | "build" | "launch";

interface ProcessStep {
  key: ProcessStepKey;
  icon: LucideIcon;
  accent: string;
}

const processSteps: ProcessStep[] = [
  { key: "discovery", icon: Compass, accent: "#06B6D4" },
  { key: "design", icon: PenTool, accent: "#A855F7" },
  { key: "build", icon: Code2, accent: "#10B981" },
  { key: "launch", icon: Rocket, accent: "#F43F5E" },
];

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

export function Process() {
  const { locale, t } = useLanguage();

  return (
    <section id="process" className="section-wrapper overflow-hidden">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <Reveal direction="up" distance={14}>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
              {t.process.label[locale]}
            </span>
          </Reveal>

          <Reveal direction="up" delay={0.08}>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {t.process.heading[locale]}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.14}>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/60 md:text-lg">
              {t.process.description[locale]}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  {t.process.phasesLabel[locale]}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">
                  04
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  {t.process.outputLabel[locale]}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/85">
                  {t.process.outputValue[locale]}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          className="relative grid gap-4"
        >
          <span
            aria-hidden
            className="absolute bottom-6 left-6 top-6 hidden w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block rtl:left-auto rtl:right-6"
          />

          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const copy = t.process.steps[step.key][locale];

            return (
              <motion.li
                key={step.key}
                variants={stepVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: easeOut }}
                className="group relative"
              >
                <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-white backdrop-blur-sm transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.045] sm:p-6 md:pl-24 rtl:md:pl-6 rtl:md:pr-24">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background: `radial-gradient(65% 90% at 0% 0%, ${step.accent}18, transparent 70%)`,
                    }}
                  />

                  <div
                    className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border md:absolute md:left-6 md:top-6 md:mb-0 rtl:md:left-auto rtl:md:right-6"
                    style={{
                      borderColor: `${step.accent}35`,
                      background: `linear-gradient(135deg, ${step.accent}20, ${step.accent}08)`,
                      boxShadow: `0 0 30px -14px ${step.accent}`,
                    }}
                  >
                    <Icon size={20} style={{ color: step.accent }} />
                  </div>

                  <div className="relative">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent rtl:bg-gradient-to-l"
                      />
                    </div>

                    <h3 className="font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
                      {copy.title}
                    </h3>

                    <p
                      className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
                      style={{ color: "rgba(255, 255, 255, 0.72)" }}
                    >
                      {copy.description}
                    </p>

                    <div className="mt-5 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                        {t.process.deliverableLabel[locale]}
                      </p>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-white/85">
                        {copy.deliverable}
                      </p>
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
