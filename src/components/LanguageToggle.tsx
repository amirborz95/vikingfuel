'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-border bg-white p-0.5 text-xs font-bold ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang('sv')}
        aria-pressed={lang === 'sv'}
        className={`px-2.5 py-1 rounded-md transition-colors ${
          lang === 'sv'
            ? 'bg-primary text-white'
            : 'text-foreground/60 hover:text-foreground'
        }`}
      >
        SV
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`px-2.5 py-1 rounded-md transition-colors ${
          lang === 'en'
            ? 'bg-primary text-white'
            : 'text-foreground/60 hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  );
}
