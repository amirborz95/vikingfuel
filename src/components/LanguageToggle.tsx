'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`relative inline-flex items-center rounded-full border border-border bg-white p-1 text-xs font-bold shadow-sm ${className}`}
      role="group"
      aria-label="Language"
    >
      {/* Sliding indicator — width = each button, left snaps to the active one */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full bg-primary shadow-sm transition-[left] duration-300 ease-out"
        style={{ width: 'calc(50% - 4px)', left: lang === 'en' ? '50%' : '4px' }}
      />
      <button
        type="button"
        onClick={() => setLang('sv')}
        aria-pressed={lang === 'sv'}
        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-200 ${
          lang === 'sv' ? 'text-white' : 'text-foreground/60 hover:text-foreground'
        }`}
      >
        <span className="text-sm leading-none">🇸🇪</span>
        SV
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-200 ${
          lang === 'en' ? 'text-white' : 'text-foreground/60 hover:text-foreground'
        }`}
      >
        <span className="text-sm leading-none">🇬🇧</span>
        EN
      </button>
    </div>
  );
}
