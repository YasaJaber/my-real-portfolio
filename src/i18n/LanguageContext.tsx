"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Locale, translations } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  t: typeof translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio_locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    return saved === "ar" || saved === "en" ? saved : "en";
  });

  // Apply locale to <html> element: lang, dir, and font-family adjustments
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";

    // Toggle an RTL-specific class for targeted CSS
    if (locale === "ar") {
      html.classList.add("is-rtl");
    } else {
      html.classList.remove("is-rtl");
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  return (
    <LanguageContext.Provider
      value={{ locale, dir, isRTL, toggleLocale, setLocale, t: translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language/locale context.
 * Returns the current locale, direction, toggle function, and translation strings.
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
