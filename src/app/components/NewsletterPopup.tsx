'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

const STORAGE_KEY = 'vf_newsletter_seen';
const CODE_KEY = 'vf_newsletter_code';
const SHOW_DELAY_MS = 500; // appear right as the site opens, after the first paint
const HIDDEN_PATHS = ['/admin', '/checkout', '/login', '/register'];

export default function NewsletterPopup() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (HIDDEN_PATHS.some((p) => pathname?.startsWith(p))) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Allow other components (e.g. the "Subscribe" button on the accessories
  // card) to re-open the popup on demand, even after it has been dismissed.
  // Someone who already subscribed gets their code straight back instead of
  // having to type their address again.
  useEffect(() => {
    function openHandler() {
      setError('');
      setCopied(false);
      let saved = '';
      try {
        saved = localStorage.getItem(CODE_KEY) || '';
      } catch {}
      if (saved) {
        setCode(saved);
        setDone(t('newsletter.success'));
      } else {
        setDone('');
        setCode('');
      }
      setOpen(true);
    }
    window.addEventListener('open-newsletter', openHandler);
    return () => window.removeEventListener('open-newsletter', openHandler);
  }, [t]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  }

  function copyCode() {
    if (!code) return;

    // The synchronous path runs first and on its own is enough: it works in
    // every browser, over plain http, and on a page that does not have focus —
    // cases where navigator.clipboard either rejects or never settles, which
    // would leave the button stuck without feedback.
    try {
      const el = document.createElement('textarea');
      el.value = code;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      el.setSelectionRange(0, code.length);
      document.execCommand('copy');
      document.body.removeChild(el);
    } catch {}

    // Then the modern API, for browsers that have already dropped execCommand.
    // Same string either way, so whichever lands last is still correct.
    try {
      navigator.clipboard?.writeText(code).catch(() => {});
    } catch {}

    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setError(t('newsletter.invalid'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || 'Något gick fel');
      const granted = String(payload?.discountCode || '');
      setCode(granted);
      setDone(payload?.alreadySubscribed ? t('newsletter.already') : t('newsletter.success'));
      try {
        localStorage.setItem(STORAGE_KEY, '1');
        if (granted) localStorage.setItem(CODE_KEY, granted);
      } catch {}
      // No auto-close here — the code stays up until they close the popup.
    } catch (err: any) {
      setError(err?.message || t('newsletter.error'));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-500 ease-out sm:p-10">
        <button
          onClick={dismiss}
          aria-label={t('newsletter.close')}
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <Icon name="XMarkIcon" size={20} />
        </button>

        {done ? (
          <div className="py-2">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Icon name="CheckIcon" size={32} className="text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-neutral-900">{done}</p>

            {code ? (
              <>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {t('newsletter.codeLabel')}
                </p>
                <div className="mt-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-4">
                  <span className="select-all font-mono text-2xl font-bold tracking-[0.15em] text-emerald-700">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white shadow-sm transition ${
                    copied
                      ? 'bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
                  }`}
                >
                  <Icon name={copied ? 'CheckIcon' : 'ClipboardIcon'} size={18} />
                  {copied ? t('newsletter.copied') : t('newsletter.copy')}
                </button>
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                  {t('newsletter.codeNote')}
                </p>
                <a
                  href="/products"
                  onClick={dismiss}
                  className="mt-4 inline-block text-xs font-semibold text-emerald-700 underline underline-offset-4 transition hover:text-emerald-800"
                >
                  {t('newsletter.shopNow')}
                </a>
              </>
            ) : (
              <p className="mt-1.5 text-sm text-neutral-500">{t('newsletter.inbox')}</p>
            )}
          </div>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
              <Icon name="EnvelopeIcon" size={26} className="text-emerald-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
              {t('newsletter.badge')}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{t('newsletter.title')}</h2>
            <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-neutral-500">
              {t('newsletter.desc')}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
              <Icon name="TagIcon" size={16} />
              {t('newsletter.perk')}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                required
                disabled={loading}
                aria-label={t('newsletter.emailLabel') }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center text-neutral-900 placeholder:text-neutral-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('newsletter.sending')}
                  </>
                ) : (
                  t('newsletter.subscribe')
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 text-xs font-medium text-neutral-400 transition hover:text-neutral-600"
            >
              {t('newsletter.noThanks')}
            </button>
            <p className="mt-3 text-[11px] text-neutral-400">
              {t('newsletter.noSpam')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
