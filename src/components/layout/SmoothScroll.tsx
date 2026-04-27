"use client";

import { useEffect } from "react";

/**
 * SmoothScroll
 * ------------
 * Buttery scroll powered by Lenis. Also wires Lenis with GSAP ScrollTrigger
 * so scroll-driven animations stay perfectly in sync.
 *
 * - Respects prefers-reduced-motion (disables itself).
 * - Skips smooth scroll on touch devices to keep native momentum/UX intact.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });

      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const anchor = target.closest<HTMLAnchorElement>("a[href^='#']");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href.length < 2) return;
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
      };
      document.addEventListener("click", handleAnchorClick);

      lenis.on("scroll", ScrollTrigger.update);

      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(ticker);
        document.removeEventListener("click", handleAnchorClick);
        lenis.destroy();
      };
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
