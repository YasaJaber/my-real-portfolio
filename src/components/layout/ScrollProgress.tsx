"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — slim animated bar that tracks page scroll progress.
 * Uses Framer Motion's spring for a silky, organic feel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-white/0 via-white/60 to-white/0"
    />
  );
}
