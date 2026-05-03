"use client";

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
  return (
    <>
      <AuroraBackground />
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
      {children}
      <Chatbot />
    </>
  );
}
