"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/visuals/Reveal";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;
// How long each card stays at the front before auto-advancing.
const SLIDE_MS = 5000;
// How many cards are mounted at once (active + cards visible behind it).
const VISIBLE = 3;

export function Work() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const total = projects.length;
  const paused = hoverPaused || manualPaused;

  const setProgressWidth = useCallback((elapsedMs: number) => {
    const progress = Math.min(100, (elapsedMs / SLIDE_MS) * 100);
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${progress}%`;
    }
  }, []);

  const resetProgress = useCallback(() => {
    elapsedRef.current = 0;
    setProgressWidth(0);
  }, [setProgressWidth]);

  const next = useCallback(() => {
    setDirection(1);
    resetProgress();
    setActive((p) => (p + 1) % total);
  }, [resetProgress, total]);

  const prev = useCallback(() => {
    setDirection(-1);
    resetProgress();
    setActive((p) => (p - 1 + total) % total);
  }, [resetProgress, total]);

  const jumpTo = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setDirection(idx > active ? 1 : -1);
      resetProgress();
      setActive(idx);
    },
    [active, resetProgress]
  );

  useEffect(() => {
    if (paused || total <= 1) return;

    let frameId = 0;
    let lastFrame = performance.now();

    const tick = (now: number) => {
      const delta = now - lastFrame;
      lastFrame = now;
      elapsedRef.current += delta;

      // When the slide finishes, advance to the next card. `next()` already
      // resets `elapsedRef` back to 0, so we just keep the rAF loop alive
      // instead of bailing out — that way the carousel keeps cycling.
      if (elapsedRef.current >= SLIDE_MS) {
        next();
      }

      setProgressWidth(elapsedRef.current);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [next, paused, setProgressWidth, total]);

  return (
    <section id="projects" className="section-wrapper">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Reveal direction="up" distance={14}>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
              03 — Projects
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
              Selected projects
            </h2>
          </Reveal>
        </div>
        
      </div>

      <Reveal direction="up" delay={0.2}>
        <div className="relative mx-auto w-full max-w-3xl">
          {/* Card stack viewport */}
          <div
            className="relative min-h-[560px] sm:min-h-[600px] md:min-h-[620px]"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            style={{ perspective: 1400 }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {Array.from({ length: VISIBLE }).map((_, offset) => {
                const i = (active + offset) % total;
                const project = projects[i];
                return (
                  <StackCard
                    key={project.slug}
                    project={project}
                    offset={offset}
                    direction={direction}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls + progress */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous project"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex flex-1 items-center justify-center gap-2">
              {projects.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Go to ${p.title}`}
                    aria-current={isActive}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      isActive
                        ? "w-8 bg-white/80"
                        : "w-3 bg-white/20 hover:bg-white/40"
                    )}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setManualPaused((p) => !p)}
                aria-label={paused ? "Resume" : "Pause"}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Auto-advance progress bar */}
          <div className="relative mt-5 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
              {String(active + 1).padStart(2, "0")}
            </span>

            {/* Track */}
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              {/* Fill — key remounts the element on every slide change,
                  restarting the animation from 0% width. */}
              <div
                ref={progressFillRef}
                className="h-full rounded-full bg-white/80"
                style={{ width: 0 }}
              />
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function StackCard({
  project,
  offset,
  direction,
}: {
  project: Project;
  offset: number;
  direction: 1 | -1;
}) {
  const isTop = offset === 0;

  // Per-stack-position transforms. The deeper a card is in the stack, the more
  // it shrinks and lifts up so it peeks out from behind the active card.
  const stackY = -offset * 26;
  const stackScale = 1 - offset * 0.06;
  // Back cards are visibly dimmer so the front card always reads as primary.
  const stackOpacity =
    offset === 0 ? 1 : Math.max(0, 0.55 - offset * 0.2);

  return (
    <motion.div
      className="absolute inset-0"
      // Newly-mounted cards always come in from the back of the stack
      // (regardless of direction) — that matches a physical deck of cards.
      initial={{
        y: -VISIBLE * 26,
        scale: 1 - VISIBLE * 0.06,
        opacity: 0,
      }}
      animate={{
        y: stackY,
        scale: stackScale,
        opacity: stackOpacity,
      }}
      // The leaving card flicks off in the direction of travel.
      exit={{
        x: direction * 110 + "%",
        rotate: direction * 5,
        opacity: 0,
        transition: { duration: 0.55, ease: easeOut },
      }}
      transition={{ duration: 0.65, ease: easeOut }}
      style={{ zIndex: 10 - offset, pointerEvents: isTop ? "auto" : "none" }}
    >
      <Card project={project} interactive={isTop} />
    </motion.div>
  );
}

function Card({
  project,
  interactive,
}: {
  project: Project;
  interactive: boolean;
}) {
  // Cards behind the active one are inert: they should not steal focus,
  // appear in the a11y tree, or fire pointer events.
  const inertProps: { tabIndex: number; "aria-hidden"?: boolean } = interactive
    ? { tabIndex: 0 }
    : { tabIndex: -1, "aria-hidden": true };

  return (
    <a
      href={project.href ?? "#"}
      data-cursor-grow={interactive ? "" : undefined}
      {...inertProps}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]",
        !interactive && "select-none"
      )}>
      {/* Subtle white wash on top of the solid base for a touch of glass */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white/[0.015]"
      />
      {/* Accent halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${project.accent}26, transparent 70%)`,
        }}
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          priority={interactive}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: `linear-gradient(to top, ${project.accent}33, transparent)`,
          }}
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
              <span>{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold leading-tight text-white md:text-3xl">
              {project.title}
            </h3>
          </div>
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-white/40 group-hover:bg-white/[0.12]"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between gap-4 p-6">
        <p className="text-sm leading-relaxed text-white/65 md:text-base">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/75"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
