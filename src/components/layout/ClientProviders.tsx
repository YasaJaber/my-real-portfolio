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
  const [showMobileChatbot, setShowMobileChatbot] = useState(false);
  const [showCursorGlow, setShowCursorGlow] = useState(false);

  useEffect(() => {
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const mobileWidthQuery = window.matchMedia("(max-width: 767px)");
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
    let mobileChatbotTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let mobileChatbotArmed = false;

    const updateCursorGlow = () => {
      setShowCursorGlow(!coarsePointerQuery.matches && !reducedMotionQuery.matches);
    };

    const isMobileDevice = () => mobileWidthQuery.matches || coarsePointerQuery.matches;

    const showMobileDeferredChatbot = () => {
      if (!isMobileDevice()) return;
      setShowMobileChatbot(true);
    };

    const armMobileChatbot = () => {
      if (mobileChatbotArmed) return;
      mobileChatbotArmed = true;
      mobileChatbotTimeoutId = setTimeout(showMobileDeferredChatbot, 1200);
    };

    updateCursorGlow();

    if (requestIdleCallback) {
      idleCallbackId = requestIdleCallback(() => {
        setShowDeferredUi(true);
        if (!isMobileDevice()) {
          setShowMobileChatbot(true);
        }
      }, {
        timeout: 1600,
      });
    } else {
      timeoutId = setTimeout(() => {
        setShowDeferredUi(true);
        if (!isMobileDevice()) {
          setShowMobileChatbot(true);
        }
      }, 1200);
    }

    coarsePointerQuery.addEventListener?.("change", updateCursorGlow);
    reducedMotionQuery.addEventListener?.("change", updateCursorGlow);
    window.addEventListener("pointerdown", armMobileChatbot, { passive: true });
    window.addEventListener("keydown", armMobileChatbot);
    window.addEventListener("scroll", armMobileChatbot, { passive: true, once: true });

    return () => {
      if (cancelIdleCallback && idleCallbackId !== null) {
        cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (mobileChatbotTimeoutId !== null) {
        clearTimeout(mobileChatbotTimeoutId);
      }

      coarsePointerQuery.removeEventListener?.("change", updateCursorGlow);
      reducedMotionQuery.removeEventListener?.("change", updateCursorGlow);
      window.removeEventListener("pointerdown", armMobileChatbot);
      window.removeEventListener("keydown", armMobileChatbot);
      window.removeEventListener("scroll", armMobileChatbot);
    };
  }, []);

  return (
    <>
      <AuroraBackground />
      <SmoothScroll />
      {showDeferredUi ? <ScrollProgress /> : null}
      {showCursorGlow ? <CursorGlow /> : null}
      {children}
      {showDeferredUi && showMobileChatbot ? <Chatbot /> : null}
    </>
  );
}
