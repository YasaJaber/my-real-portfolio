"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "article" | "li" | "span";
}

const easing = [0.22, 1, 0.36, 1] as const;

function getOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
}

/**
 * Reveal — drop-in scroll-triggered fade/slide for any content block.
 * Defaults: subtle 28px upward slide, 0.7s, with `viewport={{ once: true }}`.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 28,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const offset = getOffset(direction, distance);

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: easing, delay },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px 0px -80px 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
}

/**
 * Stagger — orchestrates child Reveals with a clean stagger.
 * Wrap children in `<RevealItem>` to participate.
 */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px 0px -80px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
}

export function RevealItem({
  children,
  className,
  direction = "up",
  distance = 22,
  duration = 0.65,
}: RevealItemProps) {
  const offset = getOffset(direction, distance);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: easing },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
