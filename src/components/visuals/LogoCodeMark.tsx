"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const DRAW_DURATION = 2;
const HOLD_DURATION = 3;
const ERASE_DURATION = 1.5;
const PAUSE_DURATION = 0.8;
const TOTAL = DRAW_DURATION + HOLD_DURATION + ERASE_DURATION + PAUSE_DURATION;

const drawEnd = DRAW_DURATION / TOTAL;
const holdEnd = (DRAW_DURATION + HOLD_DURATION) / TOTAL;
const eraseEnd = (DRAW_DURATION + HOLD_DURATION + ERASE_DURATION) / TOTAL;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function LogoCodeMark() {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: TOTAL,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [progress]);

  const clipPath = useTransform(progress, (p) => {
    if (p <= drawEnd) {
      const t = easeInOutCubic(p / drawEnd);
      return `inset(0 ${(100 - t * 100).toFixed(2)}% 0 0)`;
    }
    if (p <= holdEnd) return "inset(0 0% 0 0)";
    if (p <= eraseEnd) {
      const t = easeInOutCubic((p - holdEnd) / (eraseEnd - holdEnd));
      return `inset(0 0 0 ${(t * 100).toFixed(2)}%)`;
    }
    return "inset(0 0 0 100%)";
  });

  const cursorLeft = useTransform(progress, (p) => {
    if (p <= drawEnd)
      return `${(easeInOutCubic(p / drawEnd) * 100).toFixed(2)}%`;
    if (p <= holdEnd) return "-10%";
    if (p <= eraseEnd)
      return `${(easeInOutCubic((p - holdEnd) / (eraseEnd - holdEnd)) * 100).toFixed(2)}%`;
    return "-10%";
  });

  const cursorOpacity = useTransform(progress, (p) => {
    if (p <= drawEnd) {
      const t = p / drawEnd;
      if (t < 0.05) return t / 0.05;
      if (t > 0.95) return (1 - t) / 0.05;
      return 1;
    }
    if (p <= holdEnd) return 0;
    if (p <= eraseEnd) {
      const t = (p - holdEnd) / (eraseEnd - holdEnd);
      if (t < 0.05) return t / 0.05;
      if (t > 0.95) return (1 - t) / 0.05;
      return 1;
    }
    return 0;
  });

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 0px rgba(168,85,247,0)) saturate(1.3) brightness(1.15)",
              "drop-shadow(0 0 10px rgba(168,85,247,0.6)) saturate(1.3) brightness(1.15)",
              "drop-shadow(0 0 0px rgba(168,85,247,0)) saturate(1.3) brightness(1.15)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            style={{ clipPath }}
            className="will-change-[clip-path]"
          >
            <Image
              src="/yasaJaberLogo.svg"
              alt="Yasa Jaber Logo"
              width={629}
              height={396}
              className="h-auto w-full"
              priority
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute top-0 h-full w-[2px]"
          style={{
            left: cursorLeft,
            opacity: cursorOpacity,
          }}
        >
          <div className="h-full w-full bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
          <div className="absolute inset-y-0 -left-[3px] w-[8px] bg-gradient-to-b from-transparent via-purple-500/40 to-transparent blur-sm" />
        </motion.div>
      </div>
    </motion.div>
  );
}
