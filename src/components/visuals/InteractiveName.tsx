"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface InteractiveNameProps {
  text: string;
  isRTL?: boolean;
}

interface LetterMeta {
  // Side-biased "home" position as a fraction of the viewport [0..1]
  homeXFactor: number;
  homeYFactor: number;
  // Lissajous-like drift around the home (two sines per axis for organic motion)
  driftAmpX1: number;
  driftAmpX2: number;
  driftFreqX1: number;
  driftFreqX2: number;
  driftPhaseX1: number;
  driftPhaseX2: number;
  driftAmpY1: number;
  driftAmpY2: number;
  driftFreqY1: number;
  driftFreqY2: number;
  driftPhaseY1: number;
  driftPhaseY2: number;
  // Continuous spin (deg/sec, can be negative for counter-clockwise)
  angularVelocity: number;
  endScale: number;
  endRot: number;
}

interface LetterRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const FLOATING_TOP_PADDING = 72;
const FLOATING_SIDE_PADDING = 16;
const FLOATING_BOTTOM_PADDING = 24;

// Deterministic pseudo-random based on integer seed (stable across SSR & resize)
function rand(seed: number): number {
  const x = Math.sin(seed * 9999.123) * 10000;
  return x - Math.floor(x);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getLayoutPagePosition(el: HTMLElement) {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = el;

  while (current) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return { x, y };
}

/**
 * InteractiveName
 * --------------------------------------------------------------------------
 *  - Renders the name as a normal heading made of inline placeholder spans.
 *  - On mount, measures each letter's page coordinates and projects them
 *    onto a fixed-position overlay (portal'd to <body>) that can float across
 *    the full site while staying below navigation and cursor chrome.
 *  - As the user scrolls past the hero, letters detach, drift to a unique
 *    random "home" somewhere in the viewport, and continue floating with
 *    organic Lissajous motion + a slow continuous spin (driven every frame).
 *  - Scrolling back into the hero smoothly regroups them into the heading.
 * --------------------------------------------------------------------------
 */
export function InteractiveName({ text, isRTL = false }: InteractiveNameProps) {
  const wrapRef = useRef<HTMLHeadingElement | null>(null);
  const placeholderRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [letterRects, setLetterRects] = useState<LetterRect[]>([]);
  const [fontSize, setFontSize] = useState(0);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inHero, setInHero] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // For RTL (Arabic), split by words to keep letters connected
  // For LTR (English), split by characters for individual letter animation
  const chars = useMemo(() => {
    if (isRTL) {
      // Split Arabic text into words, keeping spaces
      const parts: string[] = [];
      const words = text.split(/(\s+)/);
      words.forEach(word => {
        if (word.trim()) {
          parts.push(word);
        } else if (word) {
          parts.push(word);
        }
      });
      return parts;
    }
    return Array.from(text);
  }, [text, isRTL]);

  // Per-letter random profile — stable across renders thanks to deterministic seed
  const metas = useMemo<LetterMeta[]>(() => {
    const occupiedHomes: Array<{ x: number; y: number }> = [];
    const nonSpaceCount = chars.filter((char) => char !== " ").length;

    return chars.map((ch, i) => {
      const r = (k: number) => rand(i * 7 + k * 31 + 13);
      let homeXFactor = 0.08 + r(1) * 0.84;
      let homeYFactor = 0.12 + r(2) * 0.72;

      if (ch !== " ") {
        const fallbackY =
          0.14 +
          ((occupiedHomes.length + r(19) * 0.65) / Math.max(nonSpaceCount, 1)) * 0.68;
        let bestX = homeXFactor;
        let bestY = fallbackY;
        let bestScore = -1;

        // Try a handful of random side homes and keep the least crowded one.
        for (let attempt = 0; attempt < 10; attempt += 1) {
          const prefersLeft = rand(i * 149 + attempt * 83 + 41) > 0.5;
          const candidateX = prefersLeft
            ? 0.025 + rand(i * 181 + attempt * 59 + 7) * 0.18
            : 0.795 + rand(i * 211 + attempt * 67 + 11) * 0.18;
          const candidateY = clamp(
            0.12 + rand(i * 239 + attempt * 71 + 17) * 0.72,
            0.12,
            0.9
          );

          const minDistance = occupiedHomes.reduce((min, home) => {
            const dx = (candidateX - home.x) * 1.6;
            const dy = candidateY - home.y;
            return Math.min(min, Math.hypot(dx, dy));
          }, Number.POSITIVE_INFINITY);

          if (minDistance > bestScore) {
            bestScore = minDistance;
            bestX = candidateX;
            bestY = candidateY;
          }
        }

        homeXFactor = bestX;
        homeYFactor = bestY;
        occupiedHomes.push({ x: homeXFactor, y: homeYFactor });
      }

      return {
        // Each letter picks its own random side home, while spacing away from its neighbors.
        homeXFactor,
        homeYFactor,

        // Favor vertical drift with a smaller horizontal sway to keep the center clear.
        driftAmpX1: 26 + r(3) * 42,
        driftAmpX2: 12 + r(4) * 24,
        driftFreqX1: 0.18 + r(5) * 0.22,
        driftFreqX2: 0.6 + r(6) * 0.55,
        driftPhaseX1: r(7) * Math.PI * 2,
        driftPhaseX2: r(8) * Math.PI * 2,

        driftAmpY1: 140 + r(9) * 180,
        driftAmpY2: 60 + r(10) * 90,
        driftFreqY1: 0.16 + r(11) * 0.22,
        driftFreqY2: 0.55 + r(12) * 0.55,
        driftPhaseY1: r(13) * Math.PI * 2,
        driftPhaseY2: r(14) * Math.PI * 2,

        // ±25 deg/sec continuous rotation while scattered
        angularVelocity: (r(15) - 0.5) * 50,

        endScale: 0.5 + r(16) * 0.6,
        endRot: (r(17) - 0.5) * 360,
      };
    });
  }, [chars]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    const compute = () => {
      if (cancelled) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const cs = window.getComputedStyle(wrap);
      const fs = parseFloat(cs.fontSize);
      const wrapRect = wrap.getBoundingClientRect();
      const wrapLayoutPosition = getLayoutPagePosition(wrap);
      const transformOffsetX =
        wrapLayoutPosition.x - (wrapRect.left + window.scrollX);
      const transformOffsetY =
        wrapLayoutPosition.y - (wrapRect.top + window.scrollY);
      const rects: LetterRect[] = placeholderRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0, w: 0, h: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left + window.scrollX + transformOffsetX,
          y: r.top + window.scrollY + transformOffsetY,
          w: r.width,
          h: r.height,
        };
      });
      setFontSize(fs);
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      setLetterRects(rects);
    };

    compute();

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => compute()).catch(() => undefined);
    }

    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [chars, mounted]);

  const { scrollY } = useScroll();

  // 0 = heading at rest in hero · 1 = fully scattered (hero scrolled away)
  const scatterTarget = useTransform(scrollY, (sy) => {
    if (letterRects.length === 0 || viewport.h === 0) return 0;
    const vh = viewport.h;
    const headingY = letterRects[0]?.y ?? 0;
    const start = Math.max(0, headingY - vh * 0.3);
    const end = headingY + vh * 0.55;
    if (sy <= start) return 0;
    if (sy >= end) return 1;
    return (sy - start) / (end - start);
  });

  const scatter = useSpring(scatterTarget, {
    stiffness: 45,
    damping: 24,
    mass: 1,
  });

  const ready = mounted && letterRects.length === chars.length;

  return (
    <>
      <h1
        ref={wrapRef}
        className="relative block w-full select-none text-center font-display text-[clamp(2.8rem,9vw,8.5rem)] font-semibold leading-[1] tracking-tight text-white"
        aria-label={text}
        style={{ 
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {chars.map((ch, i) => {
          const dist = hoveredIndex !== null ? Math.abs(hoveredIndex - i) : null;
          const isActive = hoveredIndex === i;
          const isNeighbor = dist === 1;
          const is2ndNeighbor = dist === 2;
          const isSpace = ch.trim() === "";
          return (
            <span
              key={`${ch}-${i}`}
              ref={(el) => {
                placeholderRefs.current[i] = el;
              }}
              className={`inline-block transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                ready ? "opacity-0" : "opacity-100"
              } ${!ready && isNeighbor ? "scale-110 -translate-y-1" : ""} ${
                !ready && is2ndNeighbor ? "scale-[1.04] -translate-y-0.5" : ""
              }`}
              style={{
                whiteSpace: isRTL && !isSpace ? "nowrap" : "normal",
                ...((!ready && isActive) ? {
                  color: "rgba(196, 181, 253, 1)",
                  transform: "scale(1.4) translateY(-8px)",
                  filter:
                    "drop-shadow(0 0 14px rgba(168,85,247,0.65)) drop-shadow(0 0 36px rgba(168,85,247,0.2))",
                } : {})
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isSpace ? "\u00A0" : ch}
            </span>
          );
        })}
      </h1>

      {ready &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[2] overflow-visible"
            style={{ 
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {chars.map((ch, i) => {
              const isSpace = ch.trim() === "";
              if (isSpace) return null;
              const rect = letterRects[i];
              const meta = metas[i];
              if (!rect || !meta || rect.w === 0 || rect.h === 0) return null;
              return (
                <FloatingLetter
                  key={i}
                  ch={ch}
                  rect={rect}
                  meta={meta}
                  fontSize={fontSize}
                  viewport={viewport}
                  scatter={scatter}
                  scrollY={scrollY}
                  reducedMotion={reducedMotion}
                  isHovered={hoveredIndex === i}
                  neighborHover={hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1}
                  secondNeighborHover={hoveredIndex !== null && Math.abs(hoveredIndex - i) === 2}
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  isRTL={isRTL}
                />
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

interface FloatingLetterProps {
  ch: string;
  rect: LetterRect;
  meta: LetterMeta;
  fontSize: number;
  viewport: { w: number; h: number };
  scatter: MotionValue<number>;
  scrollY: MotionValue<number>;
  reducedMotion: boolean;
  isHovered: boolean;
  neighborHover: boolean;
  secondNeighborHover: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isRTL?: boolean;
}

function FloatingLetter({
  ch,
  rect,
  meta,
  fontSize,
  viewport,
  scatter,
  scrollY,
  reducedMotion,
  isHovered,
  neighborHover,
  secondNeighborHover,
  onHoverStart,
  onHoverEnd,
  isRTL = false,
}: FloatingLetterProps) {
  const homeX = meta.homeXFactor * viewport.w;
  const homeY = meta.homeYFactor * viewport.h;

  // Direct motion values — driven by useAnimationFrame for guaranteed per-frame updates
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scaleMV = useMotionValue(1);
  const opacityMV = useMotionValue(1);
  const blurMV = useMotionValue("blur(0px)");
  const glowMV = useMotionValue(0);

  // Unique tilt direction per letter based on its angular velocity seed
  const tiltDir = meta.angularVelocity > 0 ? 1 : -1;

  // Hover springs initialized at rest — framer-motion useSpring only uses the
  // first argument as the initial value and does NOT track prop changes.
  // We drive the targets manually with useEffect + .set() below.
  const hoverScale = useSpring(1, { stiffness: 380, damping: 18, mass: 0.3 });
  const hoverY = useSpring(0, { stiffness: 340, damping: 15, mass: 0.3 });
  const hoverGlow = useSpring(0, { stiffness: 280, damping: 20, mass: 0.5 });
  const hoverRotateZ = useSpring(0, { stiffness: 340, damping: 14, mass: 0.35 });

  // Animate springs to new targets whenever hover state changes
  useEffect(() => {
    hoverScale.set(isHovered ? 1.4 : neighborHover ? 1.14 : secondNeighborHover ? 1.04 : 1);
    hoverY.set(isHovered ? -22 : neighborHover ? -10 : secondNeighborHover ? -3 : 0);
    hoverGlow.set(isHovered ? 1 : neighborHover ? 0.36 : 0);
    hoverRotateZ.set(isHovered ? tiltDir * 13 : neighborHover ? tiltDir * 4 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, neighborHover, secondNeighborHover]);

  // Letter follows page scroll while at rest; once scattered, it detaches
  // from scroll (top stays anchored to original heading row in viewport).
  const fixedTop = useTransform<number, number>(
    [scrollY, scatter],
    ([sy, s]) => rect.y - sy * (1 - s)
  );

  useAnimationFrame((t) => {
    const s = scatter.get();
    const ts = t / 1000;
    const motionFactor = reducedMotion ? 0.28 : 1;
    const spinFactor = reducedMotion ? 0.18 : 1;

    const driftX =
      (Math.sin(ts * meta.driftFreqX1 + meta.driftPhaseX1) * meta.driftAmpX1 +
        Math.sin(ts * meta.driftFreqX2 + meta.driftPhaseX2) *
          meta.driftAmpX2) *
      motionFactor;
    const driftY =
      (Math.cos(ts * meta.driftFreqY1 + meta.driftPhaseY1) * meta.driftAmpY1 +
        Math.sin(ts * meta.driftFreqY2 + meta.driftPhaseY2) *
          meta.driftAmpY2) *
      motionFactor;
    const spin = meta.angularVelocity * ts * spinFactor;

    const maxX = Math.max(
      FLOATING_SIDE_PADDING,
      viewport.w - rect.w - FLOATING_SIDE_PADDING
    );
    const maxY = Math.max(
      FLOATING_TOP_PADDING,
      viewport.h - rect.h - FLOATING_BOTTOM_PADDING
    );
    const floatingX = clamp(homeX + driftX, FLOATING_SIDE_PADDING, maxX);
    const floatingY = clamp(homeY + driftY, FLOATING_TOP_PADDING, maxY);

    x.set(s * (floatingX - rect.x));
    y.set(s * (floatingY - rect.y) + hoverY.get());
    // Tilt fades out as scatter grows so it doesn't fight the scatter spin
    rotate.set(s * (meta.endRot + spin) + (1 - s) * hoverRotateZ.get());
    scaleMV.set((1 - s * (1 - meta.endScale)) * hoverScale.get());
    opacityMV.set(1 - s * 0.78);
    blurMV.set(`blur(${(s * 0.65).toFixed(2)}px)`);
    glowMV.set(hoverGlow.get());
  });

  // Glow: purple inner (site accent) + cyan far whisper — mirrors the aurora bg palette
  const glowFilter = useTransform(glowMV, (g) => {
    const pu1 = (g * 14).toFixed(1);
    const pu2 = (g * 32).toFixed(1);
    const cy1 = (g * 56).toFixed(1);
    return [
      `drop-shadow(0 0 ${pu1}px rgba(168,85,247,${(g * 0.65).toFixed(2)}))`,
      `drop-shadow(0 0 ${pu2}px rgba(168,85,247,${(g * 0.22).toFixed(2)}))`,
      `drop-shadow(0 0 ${cy1}px rgba(6,182,212,${(g * 0.1).toFixed(2)}))`,
    ].join(" ");
  });

  const combinedFilter = useTransform(
    [blurMV, glowFilter] as MotionValue<string>[],
    ([blur, glow]: string[]) => {
      const hasGlow = glowMV.get() > 0.01;
      return hasGlow ? `${blur} ${glow}` : blur;
    }
  );

  // Transition white → soft lavender (#C4B5FD / purple-300) — subtle, matches site accent
  const textColor = useTransform(hoverGlow, (g) => {
    if (g < 0.01) return "rgba(255,255,255,1)";
    const r = Math.round(255 - g * 63);  // 255 → 192
    const gr = Math.round(255 - g * 74); // 255 → 181
    const b = Math.round(255 - g * 2);   // 255 → 253
    return `rgba(${r},${gr},${b},1)`;
  });

  return (
    <motion.span
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      style={{
        position: "fixed",
        left: rect.x,
        top: fixedTop,
        width: rect.w,
        height: rect.h,
        fontSize,
        lineHeight: 1,
        x,
        y,
        rotate,
        scale: scaleMV,
        opacity: opacityMV,
        filter: combinedFilter,
        color: textColor,
        willChange: "transform, top, opacity, filter, color",
        transformOrigin: "center center",
        cursor: "default",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
      className="pointer-events-auto font-display font-semibold tracking-tight"
    >
      {ch}
    </motion.span>
  );
}
