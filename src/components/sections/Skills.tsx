"use client";

import { motion } from "framer-motion";
import { Reveal, Stagger, RevealItem } from "@/components/visuals/Reveal";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTailwindcss,
  SiBootstrap,
  SiSass,
  SiFramer,
  SiGreensock,
  SiRedux,
  SiGraphql,
  SiFigma,
  SiGit,
  SiWebpack,
  SiGulp,
  SiWordpress,
  SiNodedotjs,
} from "react-icons/si";
import {
  TbApi,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobeIndesign,
  TbBrandAdobeAfterEffect,
} from "react-icons/tb";
import { HiOutlineCube, HiOutlineViewGrid, HiOutlineLightningBolt } from "react-icons/hi";
import { BiNetworkChart } from "react-icons/bi";
import { MdOutlineHub } from "react-icons/md";
import type { IconType } from "react-icons";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ──── Colour palette for skill icon accents ──── */
const c = {
  html: "#E34F26",
  css: "#1572B6",
  js: "#F7DF1E",
  ts: "#3178C6",
  react: "#61DAFB",
  next: "#ffffff",
  angular: "#DD0031",
  tailwind: "#06B6D4",
  bootstrap: "#7952B3",
  sass: "#CC6699",
  framer: "#BB4BFF",
  gsap: "#88CE02",
  redux: "#764ABC",
  context: "#61DAFB",
  rest: "#6DB33F",
  graphql: "#E10098",
  figma: "#F24E1E",
  ps: "#31A8FF",
  ai: "#FF9A00",
  id: "#FF3366",
  ae: "#9999FF",
  brand: "#F59E0B",
  git: "#F05032",
  webpack: "#8DD6F9",
  gulp: "#CF4647",
  wp: "#21759B",
  headless: "#8B5CF6",
  node: "#339933",
  oop: "#A78BFA",
  ds: "#06B6D4",
  algo: "#10B981",
} as const;

interface SkillItem {
  name: string;
  icon: IconType;
  color: string;
}

interface SkillGroup {
  key: string;
  label: string;
  description: string;
  items: SkillItem[];
}

const skillGroups: SkillGroup[] = [
  {
    key: "Front-End",
    label: "Front-End",
    description: "Building responsive, pixel-perfect interfaces",
    items: [
      { name: "HTML",         icon: SiHtml5,              color: c.html },
      { name: "CSS",          icon: SiCss,                color: c.css },
      { name: "JavaScript",   icon: SiJavascript,         color: c.js },
      { name: "TypeScript",   icon: SiTypescript,          color: c.ts },
      { name: "React.js",     icon: SiReact,              color: c.react },
      { name: "Next.js",      icon: SiNextdotjs,          color: c.next },
      { name: "Angular",      icon: SiAngular,            color: c.angular },
      { name: "Tailwind CSS", icon: SiTailwindcss,        color: c.tailwind },
      { name: "Bootstrap",    icon: SiBootstrap,          color: c.bootstrap },
      { name: "SASS/SCSS",    icon: SiSass,               color: c.sass },
      { name: "Framer Motion",icon: SiFramer,             color: c.framer },
      { name: "GSAP",         icon: SiGreensock,          color: c.gsap },
    ],
  },
  {
    key: "State & APIs",
    label: "State & APIs",
    description: "Managing data flow and integrations",
    items: [
      { name: "Redux",       icon: SiRedux,   color: c.redux },
      { name: "Context API", icon: SiReact,    color: c.context },
      { name: "REST APIs",   icon: TbApi,      color: c.rest },
      { name: "GraphQL",     icon: SiGraphql,  color: c.graphql },
    ],
  },
  {
    key: "Design",
    label: "Design",
    description: "Crafting visual identities and experiences",
    items: [
      { name: "Figma",             icon: SiFigma,                  color: c.figma },
      { name: "Adobe Photoshop",   icon: TbBrandAdobePhotoshop,    color: c.ps },
      { name: "Adobe Illustrator", icon: TbBrandAdobeIllustrator,  color: c.ai },
      { name: "InDesign",          icon: TbBrandAdobeIndesign,     color: c.id },
      { name: "After Effects",     icon: TbBrandAdobeAfterEffect,  color: c.ae },
      { name: "Branding & Logos",  icon: HiOutlineLightningBolt,   color: c.brand },
    ],
  },
  {
    key: "Tools & CMS",
    label: "Tools & CMS",
    description: "Streamlining development workflows",
    items: [
      { name: "Git",          icon: SiGit,        color: c.git },
      { name: "Webpack",      icon: SiWebpack,    color: c.webpack },
      { name: "Gulp",         icon: SiGulp,       color: c.gulp },
      { name: "WordPress",    icon: SiWordpress,   color: c.wp },
      { name: "Headless CMS", icon: MdOutlineHub,  color: c.headless },
      { name: "Node.js",      icon: SiNodedotjs,   color: c.node },
    ],
  },
  {
    key: "CS Fundamentals",
    label: "CS Fundamentals",
    description: "Core computer science knowledge",
    items: [
      { name: "OOP",             icon: HiOutlineCube,       color: c.oop },
      { name: "Data Structures",  icon: HiOutlineViewGrid,   color: c.ds },
      { name: "Algorithms",       icon: BiNetworkChart,       color: c.algo },
    ],
  },
];

/* ──── Skill card ──── */
function SkillCard({ skill, index }: { skill: SkillItem; index: number }) {
  const Icon = skill.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: easeOut,
            delay: index * 0.03,
          },
        },
      }}
      whileHover={{
        y: -6,
        scale: 1.04,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative"
    >
      {/* Hover glow - positioned behind the card */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundColor: `${skill.color}20` }}
      />

      <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-4 backdrop-blur-sm transition-all duration-500 group-hover:border-white/[0.12] group-hover:bg-white/[0.05] sm:px-4 sm:py-5">
        {/* Icon container with subtle ring */}
        <div className="relative">
          {/* Animated ring on hover */}
          <motion.div
            className="absolute -inset-2 rounded-full"
            style={{
              border: `1.5px solid transparent`,
            }}
            whileHover={{
              borderColor: `${skill.color}40`,
              scale: 1.1,
            }}
            transition={{ duration: 0.3 }}
          />

          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 sm:h-11 sm:w-11"
            style={{
              background: `linear-gradient(135deg, ${skill.color}12, ${skill.color}06)`,
              boxShadow: `0 0 0 1px ${skill.color}15`,
            }}
          >
            <Icon
              size={20}
              className="transition-all duration-500 group-hover:scale-110"
              style={{
                color: `${skill.color}CC`,
                filter: `drop-shadow(0 0 0px ${skill.color}00)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = skill.color;
                el.style.filter = `drop-shadow(0 0 8px ${skill.color}60)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = `${skill.color}CC`;
                el.style.filter = `drop-shadow(0 0 0px ${skill.color}00)`;
              }}
            />
          </div>
        </div>

        {/* Skill name */}
        <span className="text-center text-[11px] font-medium leading-tight tracking-wide text-white/55 transition-colors duration-300 group-hover:text-white/85 sm:text-xs">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
}

/* ──── Group header pill ──── */
function GroupHeader({ label, description, index }: { label: string; description: string; index: number }) {
  return (
    <motion.div
      className="mb-6 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, ease: easeOut },
        },
      }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-[10px] text-white/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-base font-semibold tracking-wide text-white/90 sm:text-lg">
          {label}
        </h3>
      </div>
      <div className="hidden h-px flex-1 bg-gradient-to-r from-white/10 to-transparent sm:block" />
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-[11px]">
        {description}
      </p>
    </motion.div>
  );
}

/* ──── Main Skills section ──── */
export function Skills() {
  const { locale, t } = useLanguage();

  return (
     <section id="skills" className="section-wrapper overflow-hidden">
      {/* Header */}
      <div className="mb-14 sm:mb-16">
        <Reveal direction="up" distance={14}>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
            {t.skills.label[locale]}
          </span>
        </Reveal>
        <Reveal direction="up" delay={0.08}>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {t.skills.heading[locale]}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.14}>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/55 md:text-lg">
            {t.skills.description[locale]}
          </p>
        </Reveal>
      </div>

      {/* Skill groups */}
      <Stagger className="space-y-12 sm:space-y-14" stagger={0.15} delay={0.1}>
        {skillGroups.map((group, groupIdx) => {
          const groupTranslation = t.skills.groups[group.key as keyof typeof t.skills.groups];
          const localizedLabel = groupTranslation ? groupTranslation[locale].label : group.label;
          const localizedDesc = groupTranslation ? groupTranslation[locale].description : group.description;

          return (
            <RevealItem key={group.key}>
              <GroupHeader
                label={localizedLabel}
                description={localizedDesc}
                index={groupIdx}
              />

              <motion.div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
                  },
                }}
              >
                {group.items.map((skill, i) => (
                  <SkillCard key={skill.name} skill={skill} index={i} />
                ))}
              </motion.div>
            </RevealItem>
          );
        })}
      </Stagger>

      {/* Bottom decorative line */}
      <Reveal direction="up" delay={0.3}>
        <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/15 sm:w-12" />
          <span className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 sm:tracking-[0.4em]">
            {t.skills.alwaysLearning[locale]}
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/15 sm:w-12" />
        </div>
      </Reveal>
    </section>
  );
}
