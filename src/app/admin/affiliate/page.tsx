'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function kr(n: number) {
  return `${(n || 0).toLocaleString('sv-SE')} kr`;
}

/** Numeric codes work as /12345, named ones as /ref/HANNA. */
function linkFor(code: string) {
  return /^\d{4,6}$/.test(code) ? `/${code}` : `/ref/${code}`;
}

export default function AdminAffiliatePage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // "Ny affiliate" — someone mailed info@vikingfuel.se or DM:ade oss på Instagram.
  const [form, setForm] = useState({ name: '', email: '', code: '', instagram: '', note: '' });
  const [formError, setFormError] = useState('');
  const [created, setCreated] = useState<any>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vikingfuel.se';

  // Every admin call is the same password-gated POST; 'list' just reads.
  const call = useCallback(
    async (payload: Record<string, any>) => {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || 'Misslyckades');
      return json;
    },
    [password]
  );

  const load = useCallback(async () => {
    try {
      setData(await call({ action: 'list' }));
    } catch (e) {
      console.error(e);
    }
  }, [call]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', password: password.trim() }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || 'Fel lösenord.');
        return;
      }
      setPassword(password.trim());
      setData(json);
      setUnlocked(true);
    } catch {
      setError('Kunde inte logga in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [unlocked, load]);

  async function createAffiliate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setCreated(null);
    setBusy('create');
    try {
      const json = await call({ action: 'create', ...form });
      setData(json);
      setCreated(json.affiliate);
      setForm({ name: '', email: '', code: '', instagram: '', note: '' });
    } catch (e: any) {
      setFormError(e?.message || 'Kunde inte skapa affiliate.');
    } finally {
      setBusy(null);
    }
  }

  async function run(key: string, payload: Record<string, any>, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setBusy(key);
    try {
      setData(await call(payload));
    } catch (e: any) {
      alert(e?.message || 'Misslyckades');
    } finally {
      setBusy(null);
    }
  }

  function copyLink(link: string, code: string) {
    navigator.clipboard?.writeText(`${origin}${link}`);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

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
  const totals = data?.totals || { affiliates: 0, orders: 0, bottles: 0, commission: 0, paidOut: 0, unpaid: 0, sales: 0 };
  const perBottle = data?.meta?.perBottle ?? 50;

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="container-wide py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Affiliates</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Koder skapas manuellt här när någon mejlat info@vikingfuel.se eller DM:at oss ({perBottle} kr per flaska).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-50">← Admin</Link>
            <button onClick={load} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-50">↻ Uppdatera</button>
            {rows.length > 0 && (
              <button
                onClick={() => run('deleteAll', { action: 'deleteAll' }, `Ta bort ALLA ${rows.length} affiliates? Detta går inte att ångra.`)}
                disabled={busy === 'deleteAll'}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                {busy === 'deleteAll' ? 'Tar bort…' : 'Ta bort alla'}
              </button>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Affiliates" value={String(totals.affiliates)} />
          <Stat label="Sålda flaskor" value={String(totals.bottles)} />
          <Stat label="Total provision" value={kr(totals.commission)} />
          <Stat label="Kvar att betala" value={kr(totals.unpaid)} highlight />
        </div>

        {/* New affiliate */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-foreground">Ny affiliate</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Skapa och aktivera en kod. Lämna kodfältet tomt för en slumpad 5-siffrig kod, eller skriv en egen (t.ex. HANNA).
            Koden funkar både som länk och som rabattkod i kassan (10 % till kunden, {perBottle} kr per flaska till affiliaten).
          </p>
          <form onSubmit={createAffiliate} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Namn"
              className="rounded-xl border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="E-post (deras inlogg) *"
              className="rounded-xl border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="Kod (valfritt)"
              className="rounded-xl border border-border px-4 py-2.5 font-mono text-sm uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="Instagram (valfritt)"
              className="rounded-xl border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={busy === 'create' || !form.email.trim()}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95 disabled:opacity-50"
            >
              {busy === 'create' ? 'Skapar…' : 'Skapa & aktivera'}
            </button>
          </form>
          {formError && <p className="mt-3 text-sm font-semibold text-rose-600">{formError}</p>}
          {created && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <p className="font-bold text-emerald-800">
                Kod <span className="font-mono">{created.code}</span> är aktiverad för {created.email}.
              </p>
              <p className="mt-1 text-emerald-700">
                Skicka detta till dem: länk{' '}
                <span className="font-mono font-semibold">{origin}{linkFor(created.code)}</span> — rabattkod i kassan:{' '}
                <span className="font-mono font-semibold">{created.code}</span>. De loggar in med {created.email} på /affiliate för att se sin statistik.
              </p>
            </div>
          )}
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
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ordrar</th>
                  <th className="px-4 py-3 text-right">Flaskor</th>
                  <th className="px-4 py-3 text-right">Provision</th>
                  <th className="px-4 py-3 text-right">Utbetalt</th>
                  <th className="px-4 py-3 text-right">Kvar</th>
                  <th className="px-4 py-3 text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.code} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-blue-600 hover:underline">
                        {r.link}
                      </a>
                      <button
                        onClick={() => copyLink(r.link, r.code)}
                        className="ml-2 rounded-md border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:bg-slate-50"
                      >
                        {copied === r.code ? 'Kopierad!' : 'Kopiera'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{r.name || '—'}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                      {r.instagram && <div className="text-xs text-muted-foreground">@{r.instagram}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {r.active ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Aktiverad</span>
                      ) : (
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">Pausad</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">{r.orders}</td>
                    <td className="px-4 py-3 text-right text-foreground">{r.bottles}</td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">{kr(r.commission)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{kr(r.paidOut)}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{kr(r.unpaid)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {r.unpaid > 0 ? (
                          <button
                            onClick={() =>
                              run(`pay-${r.code}`, { action: 'markPaid', code: r.code }, `Markera ${kr(r.unpaid)} som utbetalt till affiliate ${r.code}?`)
                            }
                            disabled={busy === `pay-${r.code}`}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {busy === `pay-${r.code}` ? '…' : 'Markera utbetald'}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600">✓ Betald</span>
                        )}
                        <button
                          onClick={() => run(`status-${r.code}`, { action: 'setStatus', code: r.code, status: r.active ? 'paused' : 'active' })}
                          disabled={busy === `status-${r.code}`}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-50 disabled:opacity-50"
                        >
                          {r.active ? 'Pausa' : 'Aktivera'}
                        </button>
                        <button
                          onClick={() => run(`del-${r.code}`, { action: 'delete', code: r.code }, `Ta bort affiliate ${r.code} (${r.email})?`)}
                          disabled={busy === `del-${r.code}`}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        >
                          Ta bort
                        </button>
                      </div>
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
