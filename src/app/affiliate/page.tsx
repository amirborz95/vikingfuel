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

export default function AffiliatePage() {
  const { user, isAuthenticated, login } = useAuth();
  const { lang } = useLanguage();
  const en = lang === 'en';

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
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

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/affiliate', { method: 'POST' });
      if (res.ok) setData(await res.json());
    } finally {
      setGenerating(false);
    }
  }

  const affiliate = data?.affiliate;
  const stats = data?.stats;
  const perBottle = data?.meta?.perBottle ?? 50;
  const link = affiliate ? `${origin}/${affiliate.code}` : '';

  function copy() {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
                ? `Share your link and earn ${perBottle} kr for every bottle sold through it. A 3-pack = ${perBottle * 3} kr, a 6-pack = ${perBottle * 6} kr.`
                : `Dela din länk och tjäna ${perBottle} kr för varje flaska som säljs via den. En 3-pack = ${perBottle * 3} kr, en 6-pack = ${perBottle * 6} kr.`}
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="space-y-6">
              {/* How it works */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { n: '1', t: en ? 'Log in first' : 'Logga in först', d: en ? 'Sign in to your account below.' : 'Logga in på ditt konto nedan.' },
                  { n: '2', t: en ? 'Get your link' : 'Få din länk', d: en ? 'Generate your personal link.' : 'Generera din personliga länk.' },
                  { n: '3', t: en ? 'Earn per bottle' : 'Tjäna per flaska', d: en ? `${perBottle} kr for every bottle sold.` : `${perBottle} kr för varje såld flaska.` },
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
            <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-card">
              <p className="mb-2 font-semibold text-foreground">{user?.name || user?.email}</p>
              <p className="mb-6 text-muted-foreground">
                {en ? 'Generate your personal affiliate link to get started.' : 'Skapa din personliga affiliate-länk för att komma igång.'}
              </p>
              <button
                onClick={generate}
                disabled={generating}
                className="rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-white hover:bg-slate-900 disabled:opacity-50"
              >
                {generating ? (en ? 'Generating…' : 'Skapar…') : (en ? 'Generate link' : 'Generera länk')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
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
                    onClick={copy}
                    className="whitespace-nowrap rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95"
                  >
                    {copied ? (en ? 'Copied!' : 'Kopierad!') : (en ? 'Copy link' : 'Kopiera länk')}
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {en
                    ? `Anyone who buys after clicking this link earns you ${perBottle} kr per bottle.`
                    : `Alla som köper efter att ha klickat på länken ger dig ${perBottle} kr per flaska.`}
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
                      {en ? `Available to withdraw: ${kr(stats?.commission ?? 0)}` : `Tillgängligt att ta ut: ${kr(stats?.commission ?? 0)}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWithdraw((v) => !v)}
                    disabled={(stats?.commission ?? 0) <= 0}
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
                      <li>{en ? 'Amount sold / earned: ' : 'Sålt / intjänat belopp: '}<span className="font-semibold text-foreground">{kr(stats?.commission ?? 0)} ({stats?.bottles ?? 0} {en ? 'bottles' : 'flaskor'})</span></li>
                      <li>{en ? 'Your IBAN' : 'Din IBAN'}</li>
                      <li>{en ? 'Your SWIFT/BIC' : 'Din SWIFT/BIC'}</li>
                      <li>{en ? 'Account holder name' : 'Kontoinnehavarens namn'}</li>
                    </ol>
                    <a
                      href={`mailto:info@vikingfuel.se?subject=${encodeURIComponent(
                        (en ? 'Withdrawal request — affiliate ' : 'Utbetalning — affiliate ') + affiliate.code
                      )}&body=${encodeURIComponent(
                        (en
                          ? `Hi! I'd like to request a withdrawal for my affiliate account.\n\nLogin (email): ${user?.email}\nAffiliate code: ${affiliate.code}\nBottles sold: ${stats?.bottles ?? 0}\nAmount earned: ${kr(stats?.commission ?? 0)}\n\nIBAN: \nSWIFT/BIC: \nAccount holder name: \n`
                          : `Hej! Jag vill begära utbetalning för mitt affiliate-konto.\n\nInloggningsnamn (e-post): ${user?.email}\nAffiliate-kod: ${affiliate.code}\nAntal sålda flaskor: ${stats?.bottles ?? 0}\nIntjänat belopp: ${kr(stats?.commission ?? 0)}\n\nIBAN: \nSWIFT/BIC: \nKontoinnehavarens namn: \n`)
                      )}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      {en ? 'Email info@vikingfuel.se' : 'Mejla info@vikingfuel.se'}
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
