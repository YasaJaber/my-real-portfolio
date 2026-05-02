"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Languages } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * A premium animated language toggle (EN ↔ AR).
 * Renders as a pill-shaped button that smoothly transitions between locales.
 */
export function LanguageSwitcher() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <motion.button
      type="button"
      onClick={toggleLocale}
      className="lang-switcher"
      data-cursor-grow
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      title={locale === "en" ? "العربية" : "English"}
    >
      {/* Animated icon */}
      <motion.span
        className="lang-switcher-icon"
        animate={{ rotate: locale === "ar" ? 180 : 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <Languages size={14} />
      </motion.span>

      {/* Animated label */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={locale}
          initial={{ y: 8, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -8, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="lang-switcher-label"
        >
          {locale === "en" ? "AR" : "EN"}
        </motion.span>
      </AnimatePresence>

      {/* Active locale indicator dot */}
      <span className="lang-switcher-dot" aria-hidden />
    </motion.button>
  );
}
