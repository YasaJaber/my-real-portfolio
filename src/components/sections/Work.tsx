"use client";

import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Pause,
  Play,
  X,
} from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/visuals/Reveal";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;
// How long each card stays at the front before auto-advancing.
const SLIDE_MS = 5000;
// How many cards are mounted at once (active + cards visible behind it).
const VISIBLE = 3;
// Ignore rapid repeated navigation clicks until the stack settles.
const NAV_LOCK_MS = 650;

export function Work() {
  const { locale, t } = useLanguage();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const navLockedRef = useRef(false);
  const navUnlockTimerRef = useRef<number | null>(null);
  const total = projects.length;
  // Pause the carousel whenever a project detail modal is open as well.
  const paused = hoverPaused || manualPaused || openProject !== null;

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

  const lockNavigation = useCallback(() => {
    navLockedRef.current = true;
    if (navUnlockTimerRef.current) {
      window.clearTimeout(navUnlockTimerRef.current);
    }
    navUnlockTimerRef.current = window.setTimeout(() => {
      navLockedRef.current = false;
      navUnlockTimerRef.current = null;
    }, NAV_LOCK_MS);
  }, []);

  const next = useCallback(() => {
    if (navLockedRef.current || total <= 1) return;
    lockNavigation();
    setDirection(1);
    resetProgress();
    setActive((p) => (p + 1) % total);
  }, [lockNavigation, resetProgress, total]);

  const prev = useCallback(() => {
    if (navLockedRef.current || total <= 1) return;
    lockNavigation();
    setDirection(-1);
    resetProgress();
    setActive((p) => (p - 1 + total) % total);
  }, [lockNavigation, resetProgress, total]);

  const jumpTo = useCallback(
    (idx: number) => {
      if (idx === active || navLockedRef.current || total <= 1) return;
      lockNavigation();
      setDirection(idx > active ? 1 : -1);
      resetProgress();
      setActive(idx);
    },
    [active, lockNavigation, resetProgress, total]
  );

  useEffect(
    () => () => {
      if (navUnlockTimerRef.current) {
        window.clearTimeout(navUnlockTimerRef.current);
      }
    },
    []
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

  // Close modal on Escape.
  useEffect(() => {
    if (!openProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openProject]);

  return (
     <section id="projects" className="section-wrapper overflow-hidden">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
        <div>
          <Reveal direction="up" distance={14}>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
              {t.work.label[locale]}
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {t.work.heading[locale]}
            </h2>
          </Reveal>
        </div>

      </div>

      <Reveal direction="up" delay={0.2}>
        <div className="relative mx-auto w-full max-w-4xl">
          {/* Card stack viewport */}
          <div
            className="relative min-h-[460px] overflow-hidden sm:min-h-[560px] md:min-h-[700px]"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            style={{ perspective: 1400, contain: "layout paint", isolation: "isolate" }}
          >
            <AnimatePresence initial={false} mode="sync">
              {Array.from({ length: VISIBLE }).map((_, offset) => {
                const i = (active + offset) % total;
                const project = projects[i];
                return (
                  <StackCard
                    key={project.slug}
                    project={project}
                    offset={offset}
                    direction={direction}
                    onOpen={() => setOpenProject(project)}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls + progress */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous project"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="order-3 flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto sm:flex-1">
              {projects.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Go to ${p.title}`}
                    aria-current={isActive}
                    className="relative flex h-11 w-11 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-full transition-all duration-500",
                        isActive
                          ? "w-8 bg-white/80"
                          : "w-3 bg-white/20 hover:bg-white/40"
                      )}
                    />
                  </button>
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
          <div className="relative mt-5 flex items-center gap-2 sm:gap-3">
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

      <ProjectModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />
    </section>
  );
}

function StackCard({
  project,
  offset,
  direction,
  onOpen,
}: {
  project: Project;
  offset: number;
  direction: 1 | -1;
  onOpen: () => void;
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
      style={{
        zIndex: 10 - offset,
        pointerEvents: isTop ? "auto" : "none",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <Card project={project} interactive={isTop} onOpen={onOpen} />
    </motion.div>
  );
}

function Card({
  project,
  interactive,
  onOpen,
}: {
  project: Project;
  interactive: boolean;
  onOpen: () => void;
}) {
  const { locale } = useLanguage();
  // Cards behind the active one are inert: they should not steal focus,
  // appear in the a11y tree, or fire pointer events.
  const inertProps: { tabIndex: number; "aria-hidden"?: boolean } = interactive
    ? { tabIndex: 0 }
    : { tabIndex: -1, "aria-hidden": true };

  const openFromKeyboard = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  const title = locale === "ar" ? project.titleAr : project.title;
  const category = locale === "ar" ? project.categoryAr : project.category;
  const summary = locale === "ar" ? project.summaryAr : project.summary;

  return (
    <div
      role="button"
      onKeyDown={openFromKeyboard}
      onClick={interactive ? onOpen : undefined}
      data-cursor-grow={interactive ? "" : undefined}
      {...inertProps}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] text-left shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)] sm:rounded-2xl",
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

      {project.cover ? (
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-white/10 bg-[#4030d4]">
          <Image
            src={project.cover}
            alt={`${title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            priority={interactive}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
        </div>
      ) : (
        <div
          aria-hidden
          className="relative h-2 w-full overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${project.accent}, ${project.accent}55)`,
          }}
        />
      )}

      <div className="relative flex flex-1 flex-col gap-5 p-5 text-white sm:p-6 md:gap-6 md:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
              <span>{category}</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
            </div>
            <h3 className="font-display text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
              {title}
            </h3>
            <RoleLine project={project} className="mt-2 text-xs" />
          </div>
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-white/40 group-hover:bg-white/[0.12] sm:h-11 sm:w-11"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>

        {/* Summary */}
        <p
          className="text-sm leading-relaxed !text-white sm:text-base"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          {summary}
        </p>

        {/* Spacer pushes the stack to the bottom of the card */}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/85 transition-colors duration-300 group-hover:border-white/30 group-hover:text-white"
              >
                {s}
              </span>
            ))}
          </div>

          <ClickToViewHint accent={project.accent} />
        </div>
      </div>
    </div>
  );
}

function RoleLine({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const { locale } = useLanguage();
  const role = locale === "ar" ? project.roleAr : project.role;
  
  if (!role) return null;

  return (
    <p
      className={cn(className, "!text-white/80")}
      style={{ color: "rgba(255,255,255,0.8)" }}
    >
      <span>{role}</span>
      {project.roleLink && (
        <>
          {" "}
          <a
            href={project.roleLink.href}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="font-medium underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {project.roleLink.label}
          </a>
        </>
      )}
    </p>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { locale } = useLanguage();
  const canUseDOM = typeof document !== "undefined";

  // Lock body scroll while the modal is open so the page underneath
  // doesn't bounce when users wheel inside the dialog.
  useEffect(() => {
    if (!project) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [project]);

  // Render via a portal so the modal escapes ancestors that create a
  // containing block (e.g. the Work card stack uses CSS `perspective`,
  // which traps `position: fixed` and would hide the dialog).
  if (!canUseDOM) return null;

  const title = project && locale === "ar" ? project.titleAr : project?.title;
  const category = project && locale === "ar" ? project.categoryAr : project?.category;
  const description = project && locale === "ar" ? project.descriptionAr : project?.description;
  const features = project && locale === "ar" ? project.featuresAr : project?.features;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-2xl"
          >
            {/* Accent halo */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(60% 40% at 50% 0%, ${project.accent}33, transparent 70%)`,
              }}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur transition hover:border-white/30 hover:bg-black/70 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            >
              <X size={16} />
            </button>

            {project.cover ? (
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-white/10 bg-[#4030d4]">
                <Image
                  src={project.cover}
                  alt={`${title} screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/35 via-transparent to-transparent" />
              </div>
            ) : (
              <div
                aria-hidden
                className="h-2 w-full shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${project.accent}, ${project.accent}55)`,
                }}
              />
            )}
            <div className="relative shrink-0 px-5 pb-5 pt-7 sm:px-6 sm:pb-6 sm:pt-8 md:px-8 md:pb-7 md:pt-10">
              <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
                <span>{category}</span>
                <span aria-hidden>·</span>
                <span>{project.year}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
                {title}
              </h3>
              <RoleLine project={project} className="mt-3 text-sm" />
            </div>

            {/* Scrollable body */}
            <div className="relative flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
              <p
                className="text-base leading-relaxed !text-white"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                {description}
              </p>

              {features && features.length > 0 && (
                <div className="mt-7">
                  <ModalHighlightsLabel />
                  <ul className="mt-4 space-y-2.5">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-3 text-sm leading-relaxed text-white/85 md:text-base"
                      >
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: project.accent }}
                        />
                        <span
                          className="!text-white"
                          style={{ color: "rgba(255,255,255,0.9)" }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-7">
                <ModalStackLabel />
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/85"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with CTAs */}
            <div className="relative flex flex-col gap-3 border-t border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-5 md:p-6">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white sm:w-auto"
                >
                  <Github size={14} />
                  <ModalViewRepoLabel />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-black transition hover:bg-white/90 sm:w-auto"
                >
                  <ExternalLink size={14} />
                  <ModalLivePreviewLabel />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ──── Small helper components to read context inside Work children ──── */
function ClickToViewHint({ accent }: { accent: string }) {
  const { locale, t } = useLanguage();
  return (
    <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      {t.work.clickToView[locale]}
    </div>
  );
}

function ModalHighlightsLabel() {
  const { locale, t } = useLanguage();
  return (
    <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
      {t.work.highlights[locale]}
    </h4>
  );
}

function ModalStackLabel() {
  const { locale, t } = useLanguage();
  return (
    <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
      {t.work.stack[locale]}
    </h4>
  );
}

function ModalViewRepoLabel() {
  const { locale, t } = useLanguage();
  return <>{t.work.viewRepo[locale]}</>;
}

function ModalLivePreviewLabel() {
  const { locale, t } = useLanguage();
  return <>{t.work.livePreview[locale]}</>;
}
