"use client";

import { motion } from "framer-motion";
import { Reveal, Stagger, RevealItem } from "@/components/visuals/Reveal";

const easeOut = [0.22, 1, 0.36, 1] as const;

const skillGroups = [
  {
    label: "Front-End",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Angular",
      "Tailwind CSS",
      "Bootstrap",
      "SASS/SCSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    label: "State & APIs",
    items: ["Redux", "Context API", "REST APIs", "GraphQL"],
  },
  {
    label: "Design",
    items: [
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "InDesign",
      "After Effects",
      "Branding & Logos",
    ],
  },
  {
    label: "Tools & CMS",
    items: ["Git", "Webpack", "Gulp", "WordPress", "Headless CMS", "Node.js"],
  },
  {
    label: "CS Fundamentals",
    items: ["OOP", "Data Structures", "Algorithms"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="section-wrapper">
      {/* Header */}
      <div className="mb-14">
        <Reveal direction="up" distance={14}>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
            02 — Skills
          </span>
        </Reveal>
        <Reveal direction="up" delay={0.08}>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Tools I work with
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.14}>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/55 md:text-lg">
            A curated set of technologies and tools I use to build, design, and
            ship great digital products.
          </p>
        </Reveal>
      </div>

      {/* Skill groups */}
      <Stagger className="space-y-8" stagger={0.12} delay={0.1}>
        {skillGroups.map((group) => (
          <RevealItem
            key={group.label}
            className="grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[200px_1fr]"
          >
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/45 pt-1">
              {group.label}
            </div>
            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {group.items.map((s) => (
                <motion.span
                  key={s}
                  variants={{
                    hidden: { opacity: 0, y: 12, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: easeOut },
                    },
                  }}
                  whileHover={{ y: -2 }}
                  className="cursor-default rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                >
                  {s}
                </motion.span>
              ))}
            </motion.div>
          </RevealItem>
        ))}
      </Stagger>
    </section>
  );
}
