"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef, memo } from "react";
import { ShutterBlade } from "./ShutterBlade";
import { useShutterSound } from "@/hooks/useShutterSound";
import { cn } from "@/lib/utils";

export interface CameraShutterProps {
  isHovered: boolean;
  triggerKey?: number;
  bladeCount?: number;
  animationDuration?: number;
  soundEnabled?: boolean;
  className?: string;
}

type AnimationPhase = "idle" | "closing" | "flash" | "opening";

const DEFAULT_BLADE_COUNT = 8;
const DEFAULT_ANIMATION_DURATION = 460;
const FLASH_DURATION = 140;

/**
 * CameraShutter
 *
 * Drives a four-phase aperture animation when the parent reports a hover:
 *   1. closing — iris blades sweep inward to cover the photo.
 *   2. flash   — a brief white burst simulating the camera capture.
 *   3. opening — blades sweep back to their resting position.
 *   4. idle    — overlay is unmounted.
 *
 * A synthesized DSLR shutter sound is played in sync with the closing phase.
 */
export const CameraShutter = memo(function CameraShutter({
  isHovered,
  triggerKey,
  bladeCount = DEFAULT_BLADE_COUNT,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  soundEnabled = true,
  className,
}: CameraShutterProps) {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Refs survive re-renders, so the running animation isn't cancelled by the
  // very setPhase calls that drive it (which would happen if we relied on the
  // useEffect cleanup to manage timers tied to phase state).
  const isAnimatingRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const lastTriggerKeyRef = useRef(triggerKey ?? 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const { play: playShutterSound } = useShutterSound(
    soundEnabled && !prefersReducedMotion
  );

  // Cleanup any pending timers ONLY when the component unmounts — not on
  // every render or phase change.
  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  // Trigger the full sequence on hover-in. Re-hovers mid-animation are ignored
  // via the ref guard so the audio + visuals never restart partway through.
  useEffect(() => {
    if (typeof triggerKey === "number") {
      if (triggerKey === lastTriggerKeyRef.current) return;
      lastTriggerKeyRef.current = triggerKey;
      if (triggerKey === 0) return;
    } else if (!isHovered) {
      return;
    }

    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setPhase("closing");
    playShutterSound().catch(() => {
      // Silently fail — animation continues without sound.
    });

    const closingMs = animationDuration;
    const openingMs = animationDuration;

    timersRef.current.push(
      window.setTimeout(() => setPhase("flash"), closingMs)
    );
    timersRef.current.push(
      window.setTimeout(
        () => setPhase("opening"),
        closingMs + FLASH_DURATION
      )
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("idle");
        isAnimatingRef.current = false;
        timersRef.current = [];
      }, closingMs + FLASH_DURATION + openingMs)
    );
  }, [isHovered, triggerKey, animationDuration, playShutterSound]);

  const blades = useMemo(
    () => Array.from({ length: bladeCount }, (_, i) => i),
    [bladeCount]
  );

  const isClosing = phase === "closing" || phase === "flash";
  const showOverlay = phase !== "idle";

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          key="shutter"
          className={cn(
            "absolute inset-0 z-30 overflow-hidden rounded-2xl pointer-events-none",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 1 : 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          />

          {/* Strong visible aperture sweep, so the effect reads on dark photos too. */}
          <motion.div
            className="absolute left-1/2 top-1/2 aspect-square w-[150%] rounded-full"
            style={{
              background:
                "repeating-conic-gradient(from 22.5deg, rgba(0,0,0,0.98) 0deg 28deg, rgba(28,28,28,0.98) 28deg 45deg)",
              boxShadow: "0 0 50px rgba(0,0,0,0.85)",
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              scale: 0,
              rotate: -18,
              opacity: 0,
            }}
            animate={{
              x: "-50%",
              y: "-50%",
              scale: isClosing ? 1.15 : 0,
              rotate: isClosing ? 24 : -18,
              opacity: isClosing ? 1 : 0,
            }}
            transition={{
              duration: animationDuration / 1000,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Iris blades */}
          <div className="absolute inset-0">
            {blades.map((index) => (
              <ShutterBlade
                key={index}
                index={index}
                totalBlades={bladeCount}
                isClosing={isClosing}
                animationDuration={animationDuration}
              />
            ))}
          </div>

          {/* Flash burst */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.75) 34%, rgba(255,255,255,0.0) 72%)",
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "flash" ? 1 : 0 }}
            transition={{
              duration: phase === "flash" ? 0.04 : 0.18,
              ease: "easeOut",
            }}
          />

          {/* Subtle lens glint at the moment of capture */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(52,211,153,0.0) 0%, rgba(6,182,212,0.18) 30%, rgba(0,0,0,0) 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "flash" ? 0.9 : 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});
