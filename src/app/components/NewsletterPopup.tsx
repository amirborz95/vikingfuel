'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const STORAGE_KEY = 'vf_newsletter_seen';
const SHOW_DELAY_MS = 500; // appear right as the site opens, after the first paint
const HIDDEN_PATHS = ['/admin', '/checkout', '/login', '/register'];

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (HIDDEN_PATHS.some((p) => pathname?.startsWith(p))) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setError('Ange en giltig e-postadress.');
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
      setDone(payload.message || 'Tack för att du prenumererar!');
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {}
      setTimeout(() => setOpen(false), 2600);
    } catch (err: any) {
      setError(err?.message || 'Något gick fel. Försök igen.');
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
          aria-label="Stäng"
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <Icon name="XMarkIcon" size={20} />
        </button>

        {done ? (
          <div className="py-4">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Icon name="CheckIcon" size={32} className="text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-neutral-900">{done}</p>
            <p className="mt-1.5 text-sm text-neutral-500">Håll utkik i din inkorg.</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
              <Icon name="EnvelopeIcon" size={26} className="text-emerald-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Nyhetsbrev
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">
              Gå med i Viking-klanen
            </h2>
            <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-neutral-500">
              Var först att veta om nya produkter, lanseringar och exklusiva erbjudanden.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din.email@example.com"
                required
                disabled={loading}
                aria-label="E-postadress"
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
                    Skickar...
                  </>
                ) : (
                  'Prenumerera'
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 text-xs font-medium text-neutral-400 transition hover:text-neutral-600"
            >
              Nej tack, kanske senare
            </button>
            <p className="mt-3 text-[11px] text-neutral-400">
              Ingen spam – avsluta när du vill.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
