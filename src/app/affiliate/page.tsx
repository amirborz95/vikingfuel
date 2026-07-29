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
