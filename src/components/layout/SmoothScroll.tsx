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
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      navigator.maxTouchPoints > 0;

    // Keep native momentum scrolling on touch devices to avoid
    // jank during layout/animation updates on mobile browsers.
    if (reduceMotion || isTouchDevice) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let idleId: number | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let firstInputCleanup: (() => void) | undefined;

    const boot = async () => {
      if (cancelled) return;
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
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
        const anchor = target.closest<HTMLAnchorElement>(
          "a[href^='#'], a[href^='/#']"
        );
        if (!anchor) return;
        const destination = new URL(anchor.href, window.location.href);
        if (
          destination.origin !== window.location.origin ||
          destination.pathname !== window.location.pathname ||
          !destination.hash
        ) return;
        let id: string;
        try {
          id = decodeURIComponent(destination.hash.slice(1));
        } catch {
          return;
        }
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        window.history.replaceState(null, "", destination.hash);
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
    };

    // Defer Lenis + GSAP (~80 KB combined) until after first idle or first user
    // interaction so they never block LCP/TBT.
    const ric = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(() => {
        idleId = null;
        boot();
      }, { timeout: 2500 });
    } else {
      fallbackTimer = setTimeout(() => {
        fallbackTimer = null;
        boot();
      }, 1500);
    }

    // If the user interacts before idle fires, boot immediately so smooth scroll
    // is ready when they start scrolling.
    const onFirstInput = () => {
      firstInputCleanup?.();
      firstInputCleanup = undefined;
      if (idleId !== null) {
        const cic = (window as Window & {
          cancelIdleCallback?: (id: number) => void;
        }).cancelIdleCallback;
        if (typeof cic === "function") cic(idleId);
        idleId = null;
      }
      if (fallbackTimer !== null) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      boot();
    };
    window.addEventListener("wheel", onFirstInput, { passive: true, once: true });
    window.addEventListener("keydown", onFirstInput, { once: true });
    firstInputCleanup = () => {
      window.removeEventListener("wheel", onFirstInput);
      window.removeEventListener("keydown", onFirstInput);
    };

    return () => {
      cancelled = true;
      firstInputCleanup?.();
      if (idleId !== null) {
        const cic = (window as Window & {
          cancelIdleCallback?: (id: number) => void;
        }).cancelIdleCallback;
        if (typeof cic === "function") cic(idleId);
      }
      if (fallbackTimer !== null) clearTimeout(fallbackTimer);
      cleanup?.();
    };
  }, []);

  return null;
}
