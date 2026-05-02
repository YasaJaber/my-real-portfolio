"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="relative grid min-h-dvh place-items-center bg-[#030303] text-white antialiased">
        <div className="text-center px-6">
          <h1 className="font-display text-[clamp(4rem,14vw,10rem)] font-extrabold leading-none gradient-text">
            :/
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Something went wrong. The mesh collapsed.
          </p>
          <button
            onClick={reset}
            className="btn-ghost mt-8 inline-flex"
          >
            <span>Try again</span>
          </button>
        </div>
      </body>
    </html>
  );
}
