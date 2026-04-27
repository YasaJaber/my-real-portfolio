"use client";

import { motion } from "framer-motion";
import { memo, useMemo } from "react";

export interface ShutterBladeProps {
  index: number;
  totalBlades: number;
  isClosing: boolean;
  animationDuration: number;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * A single iris blade.
 *
 * Each blade pivots around a point on the lens perimeter (NOT the center),
 * mimicking a real DSLR aperture. When the iris is open the blade lies
 * tangent to the perimeter (out of view), when closing it sweeps inward
 * across the lens center, overlapping its neighbours to fully cover the
 * image — producing the classic octagonal aperture closure.
 */
export const ShutterBlade = memo(function ShutterBlade({
  index,
  totalBlades,
  isClosing,
  animationDuration,
}: ShutterBladeProps) {
  const { pivotLeft, pivotTop, openRotation, closedRotation } = useMemo(() => {
    const angleDeg = (360 / totalBlades) * index;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Pivot point on the perimeter circle (lens is inscribed in the container).
    // Positions are expressed as percentages relative to the container.
    const left = 50 + 50 * Math.cos(angleRad);
    const top = 50 + 50 * Math.sin(angleRad);

    // Open: blade lies along the tangent direction, tucked outside the lens.
    // Closed: blade points toward the lens center, crossing it.
    return {
      pivotLeft: left,
      pivotTop: top,
      openRotation: angleDeg + 95,
      closedRotation: angleDeg + 175,
    };
  }, [index, totalBlades]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${pivotLeft}%`,
        top: `${pivotTop}%`,
        width: "112%",
        height: "76%",
        // Wedge shape: tip at the pivot (left-center), wide tail away from it.
        clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
        background:
          "linear-gradient(120deg, rgba(20,20,20,0.98) 0%, rgba(4,4,4,0.99) 58%, rgba(0,0,0,1) 100%)",
        boxShadow:
          "inset 0 0 30px rgba(0,0,0,0.75), 0 0 14px rgba(255,255,255,0.05)",
        transformOrigin: "0% 50%",
        willChange: "transform",
      }}
      initial={{ x: "0%", y: "-50%", rotate: openRotation }}
      animate={{
        x: "0%",
        y: "-50%",
        rotate: isClosing ? closedRotation : openRotation,
      }}
      transition={{
        duration: animationDuration / 1000,
        ease: easeOut,
      }}
    />
  );
});
