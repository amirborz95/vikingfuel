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
  const { user, isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const en = lang === 'en';

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

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
              {en ? 'Earn with Viking Fuel' : 'Tjäna med Viking Fuel'}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {en
                ? `Share your link and earn ${perBottle} kr for every bottle sold through it. A 3-pack = ${perBottle * 3} kr, a 6-pack = ${perBottle * 6} kr.`
                : `Dela din länk och tjäna ${perBottle} kr för varje flaska som säljs via den. En 3-pack = ${perBottle * 3} kr, en 6-pack = ${perBottle * 6} kr.`}
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-card">
              <p className="mb-6 text-muted-foreground">
                {en ? 'Log in to your account to become an affiliate.' : 'Logga in på ditt konto för att bli affiliate.'}
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/login" className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95">
                  {en ? 'Log in' : 'Logga in'}
                </Link>
                <Link href="/register" className="rounded-xl border border-foreground px-6 py-3 text-sm font-bold text-foreground hover:bg-slate-100">
                  {en ? 'Create account' : 'Skapa konto'}
                </Link>
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
