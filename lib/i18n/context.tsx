"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  Locale,
  LOCALES,
  getLocaleInfo,
} from "./locales";
import { translate } from "./translations";

const STORAGE_KEY = "ksn-locale";

type I18nState = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  isRtl: boolean;
};

const I18nContext = createContext<I18nState | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount (client only)
  useEffect(() => {
    let savedLocale: Locale | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.some((l) => l.code === saved)) {
        savedLocale = saved;
      }
    } catch {
      // ignore — localStorage may be unavailable
    }
    setTimeout(() => {
      if (savedLocale) {
        setLocaleState(savedLocale);
      }
      setHydrated(true);
    }, 0);
  }, []);

  // Reflect locale on <html> element for screen readers & native styling
  useEffect(() => {
    if (!hydrated) return;
    const info = getLocaleInfo(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = info.rtl ? "rtl" : "ltr";
  }, [locale, hydrated]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);
  const isRtl = getLocaleInfo(locale).rtl;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Permissive fallback so accidental calls outside the provider don't crash
    // the public render — server-rendered HTML still gets the default locale.
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key: string) => translate(DEFAULT_LOCALE, key),
      isRtl: false,
    };
  }
  return ctx;
}
