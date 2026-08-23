'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

function kr(n: number) {
  return `${(n || 0).toLocaleString('sv-SE')} kr`;
}

/** Numeric codes work as /12345, named ones as /ref/HANNA. */
function linkFor(code: string) {
  return /^\d{4,6}$/.test(code) ? `/${code}` : `/ref/${code}`;
}

export default function AffiliatePage() {
  const { user, isAuthenticated, login } = useAuth();
  const { lang } = useLanguage();
  const en = lang === 'en';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Inline login (so affiliates can sign in right here, like the admin panel).
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await login(loginEmail.trim(), loginPassword);
      if (!res.success) setLoginError(res.message || (en ? 'Login failed.' : 'Inloggning misslyckades.'));
    } catch {
      setLoginError(en ? 'Login failed.' : 'Inloggning misslyckades.');
    } finally {
      setLoggingIn(false);
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vikingfuel.se';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/affiliate');
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
    else setLoading(false);
  }, [isAuthenticated, load]);

  const affiliate = data?.affiliate;
  const stats = data?.stats;
  const perBottle = data?.meta?.perBottle ?? 50;
  const contactEmail = data?.meta?.contactEmail ?? 'info@vikingfuel.se';
  const instagramUrl = data?.meta?.instagramUrl ?? 'https://www.instagram.com/vikingfuel.se/';
  const instagramHandle = data?.meta?.instagramHandle ?? '@vikingfuel.se';
  const link = affiliate ? `${origin}${linkFor(affiliate.code)}` : '';

  function copy(value: string, what: 'link' | 'code') {
    navigator.clipboard?.writeText(value);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  }

  // Prefilled application mail — just the word "Affiliate", that's all we need.
  const applyMailto = `mailto:${contactEmail}?subject=${encodeURIComponent('Affiliate')}&body=${encodeURIComponent('Affiliate')}`;

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="container-wide py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="section-label">{en ? 'Affiliate program' : 'Affiliateprogram'}</p>
            <h1 className="mt-3 text-4xl font-bold text-foreground">
              {en ? 'Become an affiliate' : 'Bli affiliate'}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {en
                ? `Share your code and earn ${perBottle} kr for every bottle sold through it. A 3-pack = ${perBottle * 3} kr, a 6-pack = ${perBottle * 6} kr.`
                : `Dela din kod och tjäna ${perBottle} kr för varje flaska som säljs via den. En 3-pack = ${perBottle * 3} kr, en 6-pack = ${perBottle * 6} kr.`}
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="space-y-6">
              {/* How it works */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { n: '1', t: en ? 'Log in first' : 'Logga in först', d: en ? 'Sign in to your account below.' : 'Logga in på ditt konto nedan.' },
                  { n: '2', t: en ? 'Contact us' : 'Kontakta oss', d: en ? 'Apply by email or Instagram DM.' : 'Ansök via mejl eller DM på Instagram.' },
                  { n: '3', t: en ? 'We activate your code' : 'Vi aktiverar din kod', d: en ? `Then you earn ${perBottle} kr per bottle.` : `Sen tjänar du ${perBottle} kr per flaska.` },
                ].map((s) => (
                  <div key={s.n} className="rounded-2xl border border-border bg-white p-5 text-center shadow-card">
                    <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{s.n}</span>
                    <p className="font-bold text-foreground">{s.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                ))}
              </div>

              {/* Inline login */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
                <h2 className="text-xl font-bold text-foreground">{en ? 'Log in to start' : 'Logga in för att börja'}</h2>
                <p className="mt-1 mb-5 text-sm text-muted-foreground">
                  {en ? 'Use your Viking Fuel account to become an affiliate.' : 'Använd ditt Viking Fuel-konto för att bli affiliate.'}
                </p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={en ? 'Email' : 'E-post'}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={en ? 'Password' : 'Lösenord'}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
                  <button
                    type="submit"
                    disabled={loggingIn || !loginEmail || !loginPassword}
                    className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95 disabled:opacity-50"
                  >
                    {loggingIn ? (en ? 'Logging in…' : 'Loggar in…') : (en ? 'Log in' : 'Logga in')}
                  </button>
                </form>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {en ? 'No account yet?' : 'Inget konto än?'}{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    {en ? 'Create one' : 'Skapa konto'}
                  </Link>
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center text-muted-foreground shadow-card">
              {en ? 'Loading…' : 'Laddar…'}
            </div>
          ) : !affiliate ? (
            /* Logged in, but no code yet — codes are handed out manually. */
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
                <p className="mb-1 text-sm text-muted-foreground">{en ? 'Logged in as' : 'Inloggad som'}</p>
                <p className="mb-6 text-lg font-bold text-foreground">{user?.name || user?.email}</p>

                <h2 className="text-xl font-bold text-foreground">
                  {en ? 'Want to work with us?' : 'Vill du samarbeta med oss?'}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {en
                    ? `Affiliate codes are handed out personally. Email us at ${contactEmail} or send a DM on Instagram — we'll get back to you and set up your code.`
                    : `Affiliate-koder delas ut personligt. Mejla oss på ${contactEmail} eller skicka ett DM på Instagram — vi hör av oss och fixar din kod.`}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={applyMailto}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    {contactEmail}
                  </a>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-900"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                    {en ? `DM ${instagramHandle}` : `DM:a ${instagramHandle}`}
                  </a>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-muted/50 p-5 text-sm">
                  <p className="font-semibold text-foreground">{en ? 'Just write this in your message:' : 'Skriv bara detta i meddelandet:'}</p>
                  <p className="mt-2 font-mono text-lg font-bold text-foreground">Affiliate</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {en
                      ? 'Once we activate your code it shows up right here, on this page — with your link and live stats.'
                      : 'När vi aktiverat din kod dyker den upp här på den här sidan — med din länk och statistik i realtid.'}
                  </p>
                </div>
              </div>

              {/* What you get */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { t: `${perBottle} kr`, d: en ? 'per bottle sold' : 'per såld flaska' },
                  { t: '10 %', d: en ? 'discount for your followers' : 'rabatt till dina följare' },
                  { t: '30 ' + (en ? 'days' : 'dagar'), d: en ? 'cookie on your link' : 'cookie på din länk' },
                ].map((s) => (
                  <div key={s.d} className="rounded-2xl border border-border bg-white p-5 text-center shadow-card">
                    <p className="text-2xl font-bold text-primary">{s.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {affiliate.active === false && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                  {en
                    ? `Your code is paused right now. Contact ${contactEmail} if you think this is a mistake.`
                    : `Din kod är pausad just nu. Kontakta ${contactEmail} om du tror att det är ett misstag.`}
                </div>
              )}

              {/* Link card */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {en ? 'Your affiliate link' : 'Din affiliate-länk'}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    readOnly
                    value={link}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground"
                  />
                  <button
                    onClick={() => copy(link, 'link')}
                    className="whitespace-nowrap rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95"
                  >
                    {copied === 'link' ? (en ? 'Copied!' : 'Kopierad!') : (en ? 'Copy link' : 'Kopiera länk')}
                  </button>
                </div>

                <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {en ? 'Your discount code' : 'Din rabattkod'}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    readOnly
                    value={affiliate.code}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 font-mono text-sm font-bold text-foreground"
                  />
                  <button
                    onClick={() => copy(affiliate.code, 'code')}
                    className="whitespace-nowrap rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-white hover:bg-slate-900"
                  >
                    {copied === 'code' ? (en ? 'Copied!' : 'Kopierad!') : (en ? 'Copy code' : 'Kopiera kod')}
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {en
                    ? `Your followers get 10% off with the code, and every bottle sold through your link or code earns you ${perBottle} kr.`
                    : `Dina följare får 10 % rabatt med koden, och varje flaska som säljs via din länk eller kod ger dig ${perBottle} kr.`}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-card">
                  <p className="text-2xl font-bold text-foreground">{stats?.orders ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{en ? 'Orders' : 'Ordrar'}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-card">
                  <p className="text-2xl font-bold text-foreground">{stats?.bottles ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{en ? 'Bottles sold' : 'Sålda flaskor'}</p>
                </div>
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center shadow-card">
                  <p className="text-2xl font-bold text-primary">{kr(stats?.commission ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">{en ? 'Earned' : 'Intjänat'}</p>
                </div>
              </div>

              {/* Withdrawal */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-foreground">{en ? 'Withdraw your earnings' : 'Ta ut dina pengar'}</p>
                    <p className="text-sm text-muted-foreground">
                      {en ? `Available to withdraw: ${kr(stats?.available ?? 0)}` : `Tillgängligt att ta ut: ${kr(stats?.available ?? 0)}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWithdraw((v) => !v)}
                    disabled={(stats?.available ?? 0) <= 0}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {en ? 'Request withdrawal' : 'Begär utbetalning'}
                  </button>
                </div>

                {showWithdraw && (
                  <div className="mt-6 rounded-xl border border-border bg-muted/50 p-5 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="font-semibold text-foreground">
                      {en ? 'To get paid, email us the details below:' : 'För att få betalt, mejla oss uppgifterna nedan:'}
                    </p>
                    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted-foreground">
                      <li>{en ? 'Your login (email): ' : 'Ditt inloggningsnamn (e-post): '}<span className="font-semibold text-foreground">{user?.email}</span></li>
                      <li>{en ? 'Affiliate code: ' : 'Affiliate-kod: '}<span className="font-semibold text-foreground">{affiliate.code}</span></li>
                      <li>{en ? 'Amount to pay out: ' : 'Belopp att betala ut: '}<span className="font-semibold text-foreground">{kr(stats?.available ?? 0)} ({stats?.bottles ?? 0} {en ? 'bottles' : 'flaskor'})</span></li>
                      <li>{en ? 'Your IBAN' : 'Din IBAN'}</li>
                      <li>{en ? 'Your SWIFT/BIC' : 'Din SWIFT/BIC'}</li>
                      <li>{en ? 'Account holder name' : 'Kontoinnehavarens namn'}</li>
                    </ol>
                    <a
                      href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                        (en ? 'Withdrawal request — affiliate ' : 'Utbetalning — affiliate ') + affiliate.code
                      )}&body=${encodeURIComponent(
                        (en
                          ? `Hi! I'd like to request a withdrawal for my affiliate account.\n\nLogin (email): ${user?.email}\nAffiliate code: ${affiliate.code}\nBottles sold: ${stats?.bottles ?? 0}\nAmount to pay out: ${kr(stats?.available ?? 0)}\n\nIBAN: \nSWIFT/BIC: \nAccount holder name: \n`
                          : `Hej! Jag vill begära utbetalning för mitt affiliate-konto.\n\nInloggningsnamn (e-post): ${user?.email}\nAffiliate-kod: ${affiliate.code}\nAntal sålda flaskor: ${stats?.bottles ?? 0}\nBelopp att betala ut: ${kr(stats?.available ?? 0)}\n\nIBAN: \nSWIFT/BIC: \nKontoinnehavarens namn: \n`)
                      )}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      {en ? `Email ${contactEmail}` : `Mejla ${contactEmail}`}
                    </a>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {en
                        ? 'We process payouts to your bank account after verifying your sales.'
                        : 'Vi betalar ut till ditt bankkonto efter att vi verifierat din försäljning.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Recent orders */}
              {stats?.recent?.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
                  <p className="mb-4 text-sm font-bold text-foreground">{en ? 'Recent sales' : 'Senaste försäljningar'}</p>
                  <div className="space-y-2">
                    {stats.recent.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between border-b border-border pb-2 text-sm last:border-0">
                        <span className="text-muted-foreground">{r.date ? new Date(r.date).toLocaleDateString('sv-SE') : '—'}</span>
                        <span className="text-foreground">{r.bottles} {en ? 'bottles' : 'flaskor'}</span>
                        <span className="font-semibold text-primary">+{kr(r.commission)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
