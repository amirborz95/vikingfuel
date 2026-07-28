'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { translations, type Lang } from '@/lib/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function lookup(dict: any, key: string): string | undefined {
  return key
    .split('.')
    .reduce((o: any, k) => (o && o[k] !== undefined ? o[k] : undefined), dict);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Swedish; the client syncs from localStorage after mount so the
  // first render matches the server (no hydration mismatch).
  const [lang, setLangState] = useState<Lang>('sv');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vf_lang');
      if (saved === 'en' || saved === 'sv') {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('vf_lang', l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === 'sv' ? 'en' : 'sv';
      try {
        localStorage.setItem('vf_lang', next);
        document.documentElement.lang = next;
      } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => {
      const primary = lookup(translations[lang], key);
      if (primary !== undefined) return primary;
      const fallback = lookup(translations.sv, key);
      return fallback !== undefined ? fallback : key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
