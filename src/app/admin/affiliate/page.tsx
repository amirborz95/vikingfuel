'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function kr(n: number) {
  return `${(n || 0).toLocaleString('sv-SE')} kr`;
}

export default function AdminAffiliatePage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/affiliates');
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      if (!res.ok) {
        const p = await res.json().catch(() => null);
        setError(p?.error || 'Fel lösenord.');
        return;
      }
      setUnlocked(true);
      load();
    } catch {
      setError('Kunde inte logga in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [unlocked, load]);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="container-wide flex min-h-[70vh] items-center justify-center">
          <form onSubmit={handleUnlock} className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-card">
            <h1 className="mb-2 text-2xl font-bold text-foreground">Affiliates</h1>
            <p className="mb-6 text-sm text-muted-foreground">Ange adminlösenord.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord"
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={loading || !password.trim()} className="mt-5 w-full rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-white hover:bg-slate-900 disabled:opacity-50">
              {loading ? 'Loggar in…' : 'Logga in'}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  const rows = data?.affiliates || [];
  const totals = data?.totals || { affiliates: 0, orders: 0, bottles: 0, commission: 0, sales: 0 };
  const perBottle = data?.meta?.perBottle ?? 50;

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="container-wide py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Affiliates</h1>
            <p className="mt-1 text-sm text-muted-foreground">Alla aktiva affiliates och deras försäljning ({perBottle} kr per flaska).</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-50">← Admin</Link>
            <button onClick={load} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-50">↻ Uppdatera</button>
          </div>
        </div>

        {/* Totals */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Affiliates" value={String(totals.affiliates)} />
          <Stat label="Ordrar" value={String(totals.orders)} />
          <Stat label="Sålda flaskor" value={String(totals.bottles)} />
          <Stat label="Total provision" value={kr(totals.commission)} highlight />
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-muted-foreground shadow-card">
            Inga affiliates ännu.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Kod / Länk</th>
                  <th className="px-4 py-3">Affiliate</th>
                  <th className="px-4 py-3 text-right">Ordrar</th>
                  <th className="px-4 py-3 text-right">Flaskor</th>
                  <th className="px-4 py-3 text-right">Försäljning</th>
                  <th className="px-4 py-3 text-right">Provision</th>
                  <th className="px-4 py-3">Senaste</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.code} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-blue-600 hover:underline">
                        /{r.code}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{r.name || '—'}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">{r.orders}</td>
                    <td className="px-4 py-3 text-right text-foreground">{r.bottles}</td>
                    <td className="px-4 py-3 text-right text-foreground">{kr(r.sales)}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{kr(r.commission)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {r.lastOrder ? new Date(r.lastOrder).toLocaleDateString('sv-SE') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 text-center shadow-card ${highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-white'}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
