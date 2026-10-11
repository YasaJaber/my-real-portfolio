import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge tailwind classes safely with conditional logic. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation between two values. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Format a date as "MMM DD, YYYY". */
export function formatDate(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Create a stable, readable fragment ID for article section links. */
export function slugifyHeading(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}
