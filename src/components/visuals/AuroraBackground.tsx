"use client";

import { useEffect, useRef } from "react";

/**
 * AuroraBackground
 * ----------------
 * A dark, professional ambient mesh:
 *  - 4 large, low-saturation blobs (deep blue / desaturated indigo / charcoal)
 *  - Subtle drift, very slow movement
 *  - Cursor reactivity is gentle (0.4% lerp, not 1.2%)
 *  - Click ripple is monochrome and barely noticeable
 *
 * Goal: a high-end "studio dark" backdrop, NOT a rainbow.
 */
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let isMobile = mobileQuery.matches;
    let mobileScale = isMobile ? 0.5 : 1;
    let baseFill = isMobile ? "#030305" : "#050507";
    let vignetteAlpha = isMobile ? 0.96 : 0.85;

    let resizeRaf = 0;
    const resize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        isMobile = mobileQuery.matches;
        mobileScale = isMobile ? 0.5 : 1;
        baseFill = isMobile ? "#030305" : "#050507";
        vignetteAlpha = isMobile ? 0.96 : 0.85;
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

    // Calm, professional palette: deep midnight + faint indigo accents.
    // No rose, no electric purple — just controlled depth.
    const palette = [
      { hue: 220, sat: 60, light: 22, alpha: 0.55 }, // deep midnight blue
      { hue: 232, sat: 45, light: 18, alpha: 0.45 }, // indigo shadow
      { hue: 260, sat: 35, light: 24, alpha: 0.35 }, // muted violet accent
      { hue: 210, sat: 30, light: 14, alpha: 0.5 },  // near-black blue
    ];

    const blobs: Blob[] = palette.map((p, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      baseR: 380 + i * 80 + Math.random() * 100,
      hue: p.hue,
      sat: p.sat,
      light: p.light,
      alpha: p.alpha,
    }));

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

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    let raf = 0;
    const draw = () => {
      // Clear with deep base
      ctx.fillStyle = baseFill;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = isMobile ? "source-over" : "lighter";

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const r = b.baseR * mobileScale;

        if (!reduceMotion) {
          b.x += b.vx;
          b.y += b.vy;

          if (b.x < -r * 0.5 || b.x > width + r * 0.5) b.vx *= -1;
          if (b.y < -r * 0.5 || b.y > height + r * 0.5) b.vy *= -1;

          // Very gentle cursor influence on the first blob only
          if (i === 0 && mouse.active) {
            b.x += (mouse.x - b.x) * 0.004;
            b.y += (mouse.y - b.y) * 0.004;
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
          `hsla(${b.hue}, ${b.sat}%, ${b.light + 8}%, ${b.alpha})`
        );
        grad.addColorStop(
          0.5,
          `hsla(${b.hue}, ${b.sat}%, ${b.light}%, ${b.alpha * 0.4})`
        );
        grad.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Click ripples — monochrome, very subtle
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += 1;
        const radius = r.t * 4;
        const alpha = Math.max(0, 0.2 - r.t / 250);
        const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, radius);
        grad.addColorStop(0, `hsla(220, 25%, 40%, 0)`);
        grad.addColorStop(0.7, `hsla(220, 25%, 40%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(220, 25%, 40%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (r.t > 200) ripples.splice(i, 1);
      }

      ctx.globalCompositeOperation = "source-over";

      // Stronger vignette grounds the mesh and keeps it understated
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
      {/* Very subtle film grain for texture, not for color */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
