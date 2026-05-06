"use client";

import { useEffect, useRef } from "react";

/**
 * AuroraBackground
 * ----------------
 * Enhanced professional ambient aurora effect:
 *  - 5 vibrant gradient blobs (purple, cyan, rose, violet, aqua)
 *  - Smooth drift with visible movement
 *  - Enhanced cursor reactivity (0.8% lerp on first 2 blobs)
 *  - Colorful click ripples with purple-cyan gradient
 *  - Optimized for performance with requestAnimationFrame
 *  - Mobile-optimized with reduced complexity
 *  - Balanced vignette for depth without overwhelming
 *
 * Performance features:
 *  - Canvas-based rendering (GPU accelerated)
 *  - Reduced motion support
 *  - Mobile detection with scaled-down effects
 *  - Efficient blob count (5 blobs)
 *  - Smart DPR handling (max 2x)
 */
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let started = false;
    let teardown: (() => void) | null = null;
    let idleId: number | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      if (started) return;
      started = true;
      teardown = setupAurora(canvas, ctx);
    };

    // Defer the heavy canvas init until the browser is idle so we don't compete with LCP work.
    const ric = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(start, { timeout: 1500 });
    } else {
      fallbackTimer = setTimeout(start, 600);
    }

    return () => {
      const cic = (window as Window & {
        cancelIdleCallback?: (id: number) => void;
      }).cancelIdleCallback;
      if (idleId !== null && typeof cic === "function") cic(idleId);
      if (fallbackTimer !== null) clearTimeout(fallbackTimer);
      teardown?.();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
      {/* Enhanced film grain for subtle texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

function setupAurora(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let isMobile = mobileQuery.matches || coarsePointerQuery.matches;
    let mobileScale = isMobile ? 0.5 : 1;
    let baseFill = isMobile ? "#020204" : "#030306";
    let vignetteAlpha = isMobile ? 0.88 : 0.70;

    let resizeRaf = 0;
    const resize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        isMobile = mobileQuery.matches || coarsePointerQuery.matches;
        dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.1 : 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        mobileScale = isMobile ? 0.5 : 1;
        baseFill = isMobile ? "#020204" : "#030306";
        vignetteAlpha = isMobile ? 0.88 : 0.70;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    };
    resize();
    window.addEventListener("resize", resize);

    type Blob = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseR: number;
      hue: number;
      sat: number;
      light: number;
      alpha: number;
    };

    // Enhanced aurora palette: vibrant yet professional
    // Purple, cyan, and rose accents with better visibility
    const palette = [
      { hue: 280, sat: 75, light: 35, alpha: 0.28 }, // vibrant purple
      { hue: 190, sat: 85, light: 45, alpha: 0.22 }, // bright cyan
      { hue: 340, sat: 70, light: 40, alpha: 0.18 }, // soft rose
      { hue: 260, sat: 65, light: 38, alpha: 0.25 }, // electric violet
      { hue: 200, sat: 80, light: 42, alpha: 0.20 }, // aqua blue
    ];

    // Position blobs around center with controlled spread
    const blobs: Blob[] = palette.map((p, i) => {
      const angle = (i / palette.length) * Math.PI * 2;
      const spread = Math.min(width, height) * 0.25;
      return {
        x: width / 2 + Math.cos(angle) * spread * (0.5 + Math.random() * 0.5),
        y: height / 2 + Math.sin(angle) * spread * (0.5 + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        baseR: 420 + i * 90 + Math.random() * 120,
        hue: p.hue,
        sat: p.sat,
        light: p.light,
        alpha: p.alpha,
      };
    });

    const mouse = { x: width / 2, y: height / 2, active: false };

    const ripples: { x: number; y: number; t: number }[] = [];

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("input, textarea, select")) return;
      ripples.push({ x: e.clientX, y: e.clientY, t: 0 });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("click", onClick, { passive: true });
    }

    let raf = 0;
    const draw = () => {
      // Clear with deep base
      ctx.fillStyle = baseFill;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = isMobile ? "source-over" : "lighter";

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const r = b.baseR * mobileScale;

        if (!reduceMotion && !isMobile) {
          b.x += b.vx;
          b.y += b.vy;

          // Keep blobs near center with soft boundaries
          const centerX = width / 2;
          const centerY = height / 2;
          const maxDist = Math.min(width, height) * 0.4;
          const distFromCenter = Math.hypot(b.x - centerX, b.y - centerY);
          
          if (distFromCenter > maxDist) {
            const angle = Math.atan2(b.y - centerY, b.x - centerX);
            b.vx -= Math.cos(angle) * 0.02;
            b.vy -= Math.sin(angle) * 0.02;
          }

          // Bounce at edges
          if (b.x < -r * 0.5 || b.x > width + r * 0.5) b.vx *= -1;
          if (b.y < -r * 0.5 || b.y > height + r * 0.5) b.vy *= -1;

          // Enhanced cursor influence for more visible interaction
          if (i < 2 && mouse.active) {
            b.x += (mouse.x - b.x) * 0.008;
            b.y += (mouse.y - b.y) * 0.008;
          }

          // Mild ripple repulsion (subtle)
          for (const r of ripples) {
            const dx = b.x - r.x;
            const dy = b.y - r.y;
            const d = Math.hypot(dx, dy) + 0.01;
            const push = Math.max(0, 150 - r.t) * 0.012;
            b.x += (dx / d) * push;
            b.y += (dy / d) * push;
          }
        }

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(
          0,
          `hsla(${b.hue}, ${b.sat}%, ${b.light + 12}%, ${b.alpha})`
        );
        grad.addColorStop(
          0.4,
          `hsla(${b.hue}, ${b.sat}%, ${b.light + 5}%, ${b.alpha * 0.6})`
        );
        grad.addColorStop(
          0.7,
          `hsla(${b.hue}, ${b.sat}%, ${b.light}%, ${b.alpha * 0.3})`
        );
        grad.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Enhanced click ripples with color
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += 1;
        const radius = r.t * 5;
        const alpha = Math.max(0, 0.35 - r.t / 200);
        const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, radius);
        grad.addColorStop(0, `hsla(280, 70%, 60%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(190, 80%, 55%, ${alpha * 0.6})`);
        grad.addColorStop(1, `hsla(280, 70%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (r.t > 180) ripples.splice(i, 1);
      }

      ctx.globalCompositeOperation = "source-over";

      // Center-focused vignette - highlights the middle
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.6, `rgba(0,0,0,${vignetteAlpha * 0.5})`);
      vignette.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (!isMobile) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
}
