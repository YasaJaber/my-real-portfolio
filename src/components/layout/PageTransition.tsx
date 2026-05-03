"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PageTransition — wraps children with a cinematic enter/exit animation
 * when the route changes (Liquid / Zoom-in feel via Framer Motion).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={hasMounted ? { opacity: 0, scale: 0.985, filter: "blur(10px)" } : false}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.015, filter: "blur(8px)" }}
        transition={{ duration: 0.55, ease: [0.83, 0, 0.17, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
