"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AuroraBackground = dynamic(
  () => import("@/components/visuals/AuroraBackground").then((m) => m.AuroraBackground),
  { ssr: false }
);
const CursorGlow = dynamic(
  () => import("@/components/visuals/CursorGlow").then((m) => m.CursorGlow),
  { ssr: false }
);
const SmoothScroll = dynamic(
  () => import("@/components/layout/SmoothScroll").then((m) => m.SmoothScroll),
  { ssr: false }
);
const ScrollProgress = dynamic(
  () => import("@/components/layout/ScrollProgress").then((m) => m.ScrollProgress),
  { ssr: false }
);
const Chatbot = dynamic(
  () => import("@/components/layout/Chatbot").then((m) => m.Chatbot),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [showDeferredUi, setShowDeferredUi] = useState(false);
  const [showCursorGlow, setShowCursorGlow] = useState(false);

  useEffect(() => {
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const requestIdleCallback =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : null;
    const cancelIdleCallback =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : null;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const updateCursorGlow = () => {
      setShowCursorGlow(!coarsePointerQuery.matches && !reducedMotionQuery.matches);
    };

    updateCursorGlow();

    if (requestIdleCallback) {
      idleCallbackId = requestIdleCallback(() => setShowDeferredUi(true), {
        timeout: 1600,
      });
    } else {
      timeoutId = setTimeout(() => setShowDeferredUi(true), 1200);
    }

    coarsePointerQuery.addEventListener?.("change", updateCursorGlow);
    reducedMotionQuery.addEventListener?.("change", updateCursorGlow);

    return () => {
      if (cancelIdleCallback && idleCallbackId !== null) {
        cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      coarsePointerQuery.removeEventListener?.("change", updateCursorGlow);
      reducedMotionQuery.removeEventListener?.("change", updateCursorGlow);
    };
  }, []);

  return (
    <>
      <AuroraBackground />
      <SmoothScroll />
      {showDeferredUi ? <ScrollProgress /> : null}
      {showCursorGlow ? <CursorGlow /> : null}
      {children}
      {showDeferredUi ? <Chatbot /> : null}
    </>
  );
}
