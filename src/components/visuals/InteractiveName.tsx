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
  homeXFactor: number;
  homeYFactor: number;
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
  angularVelocity: number;
  endScale: number;
  endRot: number;
}

interface TextSegment {
  value: string;
  start: number;
  end: number;
  isSpace: boolean;
  sourceText: string;
  sourceStart: number;
  sourceEnd: number;
}

interface LetterRect {
  x: number;
  y: number;
  w: number;
  h: number;
  sourceX: number;
  sourceY: number;
  sourceW: number;
  sourceH: number;
}

const FLOATING_TOP_PADDING = 72;
const FLOATING_SIDE_PADDING = 16;
const FLOATING_BOTTOM_PADDING = 24;

function rand(seed: number): number {
  const x = Math.sin(seed * 9999.123) * 10000;
  return x - Math.floor(x);
}

function clamp(value: number, min: number, max: number) {
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

function segmentGraphemes(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment, index }) => ({
      value: segment,
      start: index,
      end: index + segment.length,
    }));
  }

  const parts: Array<{ value: string; start: number; end: number }> = [];
  let cursor = 0;

  for (const value of Array.from(text)) {
    parts.push({ value, start: cursor, end: cursor + value.length });
    cursor += value.length;
  }

  return parts;
}

function buildSegments(text: string, isRTL: boolean): TextSegment[] {
  const graphemes = segmentGraphemes(text);

  if (!isRTL) {
    return graphemes.map(({ value, start, end }) => ({
      value,
      start,
      end,
      isSpace: value.trim().length === 0,
      sourceText: value,
      sourceStart: start,
      sourceEnd: end,
    }));
  }

  const words = Array.from(text.matchAll(/\S+/gu), (match) => {
    const start = match.index ?? 0;
    return {
      text: match[0],
      start,
      end: start + match[0].length,
    };
  });

  let wordIndex = 0;

  return graphemes.map(({ value, start, end }) => {
    const isSpace = value.trim().length === 0;

    if (isSpace) {
      return {
        value,
        start,
        end,
        isSpace: true,
        sourceText: value,
        sourceStart: start,
        sourceEnd: end,
      };
    }

    while (words[wordIndex] && start >= words[wordIndex].end) {
      wordIndex += 1;
    }

    const word = words[wordIndex];

    if (!word) {
      return {
        value,
        start,
        end,
        isSpace: false,
        sourceText: value,
        sourceStart: start,
        sourceEnd: end,
      };
    }

    return {
      value,
      start,
      end,
      isSpace: false,
      sourceText: word.text,
      sourceStart: word.start,
      sourceEnd: word.end,
    };
  });
}

function measureTextRange(
  textNode: Text,
  start: number,
  end: number,
  offsetX: number,
  offsetY: number
) {
  const range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, end);
  const rect = range.getBoundingClientRect();

  return {
    x: rect.left + window.scrollX + offsetX,
    y: rect.top + window.scrollY + offsetY,
    w: rect.width,
    h: rect.height,
  };
}

/**
 * InteractiveName
 * --------------------------------------------------------------------------
 *  - Measures the rendered text directly from a single connected text node so
 *    Arabic shaping remains intact.
 *  - Builds animated overlay slices per grapheme; for RTL text each slice
 *    renders as a clipped window into the full word, preserving joined forms.
 *  - As the user scrolls past the hero, slices scatter and float independently,
 *    then regroup smoothly when the hero returns into view.
 * --------------------------------------------------------------------------
 */
export function InteractiveName({ text, isRTL = false }: InteractiveNameProps) {
  const wrapRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [letterRects, setLetterRects] = useState<LetterRect[]>([]);
  const [fontSize, setFontSize] = useState(0);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chars = useMemo(() => buildSegments(text, isRTL), [text, isRTL]);

  const metas = useMemo<LetterMeta[]>(() => {
    const occupiedHomes: Array<{ x: number; y: number }> = [];
    const nonSpaceCount = chars.filter((char) => !char.isSpace).length;
    const leftSlots = Math.ceil(nonSpaceCount / 2);
    const rightSlots = Math.floor(nonSpaceCount / 2);
    let visibleIndex = 0;
    let leftSeen = 0;
    let rightSeen = 0;

    return chars.map((ch, i) => {
      const r = (k: number) => rand(i * 7 + k * 31 + 13);
      let homeXFactor = 0.08 + r(1) * 0.84;
      let homeYFactor = 0.12 + r(2) * 0.72;

      if (!ch.isSpace) {
        const prefersLeft = visibleIndex % 2 === 0;
        const sideIndex = prefersLeft ? leftSeen : rightSeen;
        const sideTotal = Math.max(prefersLeft ? leftSlots : rightSlots, 1);
        const normalizedY = (sideIndex + 0.5) / sideTotal;
        const fallbackY = clamp(0.28 + normalizedY * 0.42 + (r(19) - 0.5) * 0.05, 0.26, 0.74);
        let bestX = homeXFactor;
        let bestY = fallbackY;
        let bestScore = -1;

        for (let attempt = 0; attempt < 10; attempt += 1) {
          const candidateX = prefersLeft
            ? 0.045 + rand(i * 181 + attempt * 59 + 7) * 0.11
            : 0.845 + rand(i * 211 + attempt * 67 + 11) * 0.11;
          const candidateY = clamp(
            fallbackY + (rand(i * 239 + attempt * 71 + 17) - 0.5) * 0.1,
            0.24,
            0.78
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
        visibleIndex += 1;
        if (prefersLeft) {
          leftSeen += 1;
        } else {
          rightSeen += 1;
        }
      }

      return {
        homeXFactor,
        homeYFactor,
        driftAmpX1: 26 + r(3) * 42,
        driftAmpX2: 10 + r(4) * 18,
        driftFreqX1: 0.18 + r(5) * 0.22,
        driftFreqX2: 0.6 + r(6) * 0.55,
        driftPhaseX1: r(7) * Math.PI * 2,
        driftPhaseX2: r(8) * Math.PI * 2,
        driftAmpY1: 46 + r(9) * 54,
        driftAmpY2: 16 + r(10) * 24,
        driftFreqY1: 0.16 + r(11) * 0.22,
        driftFreqY2: 0.55 + r(12) * 0.55,
        driftPhaseY1: r(13) * Math.PI * 2,
        driftPhaseY2: r(14) * Math.PI * 2,
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
      const textSpan = textRef.current;
      const textNode = textSpan?.firstChild;

      if (!wrap || !(textNode instanceof Text)) return;

      const cs = window.getComputedStyle(wrap);
      const fs = parseFloat(cs.fontSize);
      const wrapRect = wrap.getBoundingClientRect();
      const wrapLayoutPosition = getLayoutPagePosition(wrap);
      const transformOffsetX = wrapLayoutPosition.x - (wrapRect.left + window.scrollX);
      const transformOffsetY = wrapLayoutPosition.y - (wrapRect.top + window.scrollY);

      const rects = chars.map((segment) => {
        const rect = measureTextRange(
          textNode,
          segment.start,
          segment.end,
          transformOffsetX,
          transformOffsetY
        );
        const sourceRect =
          segment.sourceStart === segment.start && segment.sourceEnd === segment.end
            ? rect
            : measureTextRange(
                textNode,
                segment.sourceStart,
                segment.sourceEnd,
                transformOffsetX,
                transformOffsetY
              );

        return {
          ...rect,
          sourceX: sourceRect.x,
          sourceY: sourceRect.y,
          sourceW: sourceRect.w,
          sourceH: sourceRect.h,
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

  const scatterTarget = useTransform(scrollY, (sy) => {
    if (letterRects.length === 0 || viewport.h === 0) return 0;
    const vh = viewport.h;
    const headingY = letterRects.find((rect) => rect.w > 0)?.y ?? 0;
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
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <span
          ref={textRef}
          className={`inline-block whitespace-pre transition-opacity duration-300 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          {text}
        </span>
      </h1>

      {ready &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {chars.map((ch, i) => {
              if (ch.isSpace) return null;
              const rect = letterRects[i];
              const meta = metas[i];
              if (!rect || !meta || rect.w === 0 || rect.h === 0) return null;

              return (
                <FloatingLetter
                  key={`${ch.start}-${ch.end}-${i}`}
                  segment={ch}
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
  segment: TextSegment;
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
}

function FloatingLetter({
  segment,
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
}: FloatingLetterProps) {
  const homeX = meta.homeXFactor * viewport.w;
  const homeY = meta.homeYFactor * viewport.h;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scaleMV = useMotionValue(1);
  const opacityMV = useMotionValue(1);
  const blurMV = useMotionValue("blur(0px)");
  const glowMV = useMotionValue(0);
  const tiltDir = meta.angularVelocity > 0 ? 1 : -1;
  const hoverScale = useSpring(1, { stiffness: 380, damping: 18, mass: 0.3 });
  const hoverY = useSpring(0, { stiffness: 340, damping: 15, mass: 0.3 });
  const hoverGlow = useSpring(0, { stiffness: 280, damping: 20, mass: 0.5 });
  const hoverRotateZ = useSpring(0, { stiffness: 340, damping: 14, mass: 0.35 });

  useEffect(() => {
    hoverScale.set(isHovered ? 1.4 : neighborHover ? 1.14 : secondNeighborHover ? 1.04 : 1);
    hoverY.set(isHovered ? -22 : neighborHover ? -10 : secondNeighborHover ? -3 : 0);
    hoverGlow.set(isHovered ? 1 : neighborHover ? 0.36 : 0);
    hoverRotateZ.set(isHovered ? tiltDir * 13 : neighborHover ? tiltDir * 4 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, neighborHover, secondNeighborHover]);

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
        Math.sin(ts * meta.driftFreqX2 + meta.driftPhaseX2) * meta.driftAmpX2) *
      motionFactor;
    const driftY =
      (Math.cos(ts * meta.driftFreqY1 + meta.driftPhaseY1) * meta.driftAmpY1 +
        Math.sin(ts * meta.driftFreqY2 + meta.driftPhaseY2) * meta.driftAmpY2) *
      motionFactor;
    const spin = meta.angularVelocity * ts * spinFactor;

    const maxX = Math.max(FLOATING_SIDE_PADDING, viewport.w - rect.w - FLOATING_SIDE_PADDING);
    const maxY = Math.max(FLOATING_TOP_PADDING, viewport.h - rect.h - FLOATING_BOTTOM_PADDING);
    const floatingX = clamp(homeX + driftX, FLOATING_SIDE_PADDING, maxX);
    const floatingY = clamp(homeY + driftY, FLOATING_TOP_PADDING, maxY);

    x.set(s * (floatingX - rect.x));
    y.set(s * (floatingY - rect.y) + hoverY.get());
    rotate.set(s * (meta.endRot + spin) + (1 - s) * hoverRotateZ.get());
    scaleMV.set((1 - s * (1 - meta.endScale)) * hoverScale.get());
    opacityMV.set(1 - s * 0.78);
    blurMV.set(`blur(${(s * 0.65).toFixed(2)}px)`);
    glowMV.set(hoverGlow.get());
  });

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

  const textColor = useTransform(hoverGlow, (g) => {
    if (g < 0.01) return "rgba(255,255,255,1)";
    const r = Math.round(255 - g * 63);
    const gr = Math.round(255 - g * 74);
    const b = Math.round(255 - g * 2);
    return `rgba(${r},${gr},${b},1)`;
  });

  const usesClippedWord = segment.sourceText !== segment.value;

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
        overflow: usesClippedWord ? "hidden" : "visible",
      }}
      className="pointer-events-auto font-display font-semibold tracking-tight"
    >
      {usesClippedWord ? (
        <span
          style={{
            position: "absolute",
            left: rect.sourceX - rect.x,
            top: rect.sourceY - rect.y,
            width: rect.sourceW,
            height: rect.sourceH,
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {segment.sourceText}
        </span>
      ) : (
        segment.value
      )}
    </motion.span>
  );
}
