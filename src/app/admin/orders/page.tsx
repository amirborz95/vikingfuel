'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCarrier } from '@/lib/carriers';

type Row = { userEmail: string; userName: string | null; order: any };

function normalizeStatus(v?: string | null): 'not_shipped' | 'progress' | 'shipped' {
  if (v === 'shipped') return 'shipped';
  if (v === 'progress') return 'progress';
  return 'not_shipped';
}

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  not_shipped: { label: 'Ej fraktad', cls: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  progress: { label: 'Pågår', cls: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500' },
  shipped: { label: 'Fraktad', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
};

function shippingOf(order: any) {
  const carrier = getCarrier(order?.carrier);
  const provider =
    order?.carrierProvider ||
    carrier?.provider ||
    (String(order?.shippingOption || '').toLowerCase() === 'postnord' ? 'postnord' : 'pickup');
  const brand = order?.shippingOption || carrier?.brand || (provider === 'postnord' ? 'PostNord' : 'Uthämtning');
  const address = order?.shippingAddress?.address
    ? Object.values(order.shippingAddress.address).filter(Boolean).join(', ')
    : '';
  const hasLabel = !!(order?.postnordLabelUrl || order?.shipmondoShipmentId || order?.postnordShipmentId);
  const tracking = order?.postnordTracking || order?.shipmondoTracking || null;
  return { provider, brand, address, hasLabel, tracking, isPickup: provider === 'pickup' };
}

function kr(n: number) {
  return `${(n || 0).toLocaleString('sv-SE')} kr`;
}

export default function OrdersPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'not_shipped' | 'progress' | 'shipped'>('all');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (res.ok) setOrders(json.orders || []);
    } catch (e) {
      console.error('Fetch orders failed', e);
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
      fetchOrders();
    } catch {
      setError('Kunde inte logga in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    fetchOrders();
    const id = setInterval(fetchOrders, 30000);
    return () => clearInterval(id);
  }, [unlocked, fetchOrders]);

  async function printLabel(row: Row) {
    setBusy(row.order.id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'printLabel', userEmail: row.userEmail, orderId: row.order.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Misslyckades');
      if (json.warning) alert('OBS: ' + json.warning);
      if (json.labelUrl) window.open(json.labelUrl, '_blank', 'noopener');
      else if (!json.warning) alert('Ingen etikett tillgänglig ännu för denna order.');
      await fetchOrders();
    } catch (e: any) {
      alert('Kunde inte skriva ut fraktsedel: ' + (e?.message || e));
    } finally {
      setBusy(null);
    }
  }

  async function setStatus(row: Row, status: string) {
    setBusy(row.order.id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setStatus', userEmail: row.userEmail, orderId: row.order.id, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Misslyckades');
      if (json.warning) alert('Status uppdaterad.\n\nOBS: ' + json.warning);
      else if (status === 'shipped' && json.emailed) {
        const tn = json?.order?.postnordTracking || json?.order?.shipmondoTracking;
        alert('Order markerad som skickad — kund mejlad.' + (tn ? `\nSpårning: ${tn}` : ''));
      }
      await fetchOrders();
    } catch (e: any) {
      alert('Kunde inte uppdatera status: ' + (e?.message || e));
    } finally {
      setBusy(null);
    }
  }

  const counts = {
    all: orders.length,
    not_shipped: orders.filter((r) => normalizeStatus(r.order.status) === 'not_shipped').length,
    progress: orders.filter((r) => normalizeStatus(r.order.status) === 'progress').length,
    shipped: orders.filter((r) => normalizeStatus(r.order.status) === 'shipped').length,
  };
  const visible = filter === 'all' ? orders : orders.filter((r) => normalizeStatus(r.order.status) === filter);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="container-wide flex min-h-[70vh] items-center justify-center">
          <form onSubmit={handleUnlock} className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-card">
            <h1 className="mb-2 text-2xl font-bold text-foreground">Orders</h1>
            <p className="mb-6 text-sm text-muted-foreground">Ange adminlösenord för att se ordrar.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord"
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="mt-5 w-full rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-white hover:bg-slate-900 disabled:opacity-50"
            >
              {loading ? 'Loggar in…' : 'Logga in'}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="container-wide py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">Skriv ut fraktsedlar och markera ordrar som skickade.</p>
          </div>
          <button onClick={fetchOrders} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-50">
            ↻ Uppdatera
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {([
            ['all', `Alla (${counts.all})`],
            ['not_shipped', `Ej fraktad (${counts.not_shipped})`],
            ['progress', `Pågår (${counts.progress})`],
            ['shipped', `Fraktad (${counts.shipped})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === key ? 'bg-foreground text-white' : 'bg-white text-foreground border border-border hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-muted-foreground shadow-card">
            Inga ordrar i denna vy.
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((row) => {
              const o = row.order;
              const st = normalizeStatus(o.status);
              const meta = STATUS_META[st];
              const s = shippingOf(o);
              const isBusy = busy === o.id;
              const itemsText = (o.items || []).map((it: any) => `${it.name} ×${it.quantity}`).join(', ');
              return (
                <div key={`${row.userEmail}-${o.id}`} className="rounded-2xl border border-border bg-white p-6 shadow-card">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left: order info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.cls}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{s.brand}</span>
                        {o.createdAt && (
                          <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString('sv-SE')}</span>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground break-words">{o.id}</p>
                      <p className="text-sm text-muted-foreground">{row.userName || 'Kund'} · {row.userEmail}</p>
                      <p className="mt-2 text-sm text-foreground">{itemsText || 'Inga produkter'}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.isPickup ? 'Uthämtning — ingen adress' : (s.address || 'Ingen adress angiven')}
                      </p>
                      {s.tracking && (
                        <p className="mt-1 text-sm text-foreground"><span className="font-semibold">Spårning:</span> {s.tracking}</p>
                      )}
                      <p className="mt-2 text-lg font-bold text-foreground">{kr(o.totalAmount)}</p>
                    </div>

                    {/* Right: actions */}
                    <div className="flex w-full flex-col gap-2 lg:w-56">
                      {!s.isPickup && (
                        <button
                          onClick={() => printLabel(row)}
                          disabled={isBusy}
                          className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-900 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                          </svg>
                          Skriv ut fraktsedel
                        </button>
                      )}
                      {st !== 'shipped' ? (
                        <button
                          onClick={() => setStatus(row, 'shipped')}
                          disabled={isBusy}
                          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          Markera som skickad
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(row, 'not_shipped')}
                          disabled={isBusy}
                          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-slate-50 disabled:opacity-50"
                        >
                          Ångra frakt
                        </button>
                      )}
                      {st === 'progress' && (
                        <p className="text-center text-xs text-muted-foreground">Fraktsedel utskriven — klistra på och lämna in.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
