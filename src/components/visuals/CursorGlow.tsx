"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — a smooth, lerped cursor halo overlayed on top of content.
 * Hidden on touch devices.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)"
    );

    const syncEnabled = () => setEnabled(media.matches);
    syncEnabled();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncEnabled);
      return () => media.removeEventListener("change", syncEnabled);
    }

    media.addListener(syncEnabled);
    return () => media.removeListener(syncEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("a, button, [data-cursor-grow]")) {
        ringRef.current?.classList.add("scale-[2.4]", "opacity-60");
      }
    };
    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("a, button, [data-cursor-grow]")) {
        ringRef.current?.classList.remove("scale-[2.4]", "opacity-60");
      }
    };

    let raf = 0;
    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-10 w-10 rounded-full border border-white/40 opacity-40 mix-blend-difference transition-[transform,opacity] duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}
