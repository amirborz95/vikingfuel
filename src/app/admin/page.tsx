'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCarrier } from '@/lib/carriers';

interface DashboardUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  orderCount: number;
  latestOrder: string | null;
}

interface CountRow {
  key: string;
  views: number;
  visitors: number;
}

interface RangeSummary {
  key: 'today' | 'week' | 'month' | 'all';
  label: string;
  from: string | null;
  visits: number;
  visitors: number;
  sessions: number;
  pages: CountRow[];
  entryPages: CountRow[];
  countries: CountRow[];
  referrers: CountRow[];
  devices: CountRow[];
  daily: { date: string; visits: number; visitors: number }[];
}

interface RecentVisit {
  timestamp: string;
  path: string;
  page: string;
  email: string;
  visitor: string;
  country: string | null;
  city: string | null;
  device: string | null;
  referrer: string | null;
}

interface AnalyticsSummary {
  ranges: Record<'today' | 'week' | 'month' | 'all', RangeSummary>;
  recent: RecentVisit[];
  totalVisits: number;
  excludedVisits: number;
  firstVisit: string | null;
  lastVisit: string | null;
}

interface DashboardMetrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalPageViews: number;
  latestPageView: string | null;
  firstPageView: string | null;
}

interface OrderStat {
  count: number;
  revenue: number;
}

interface DashboardData {
  users: DashboardUser[];
  metrics: DashboardMetrics;
  staffExcluded: boolean;
  analytics: AnalyticsSummary;
  orderStats: Record<'today' | 'week' | 'month' | 'all', OrderStat>;
  waitlistEmails: string[];
  newsletterSubscribers?: { email: string; subscribedAt: string }[];
}

type RangeKey = 'today' | 'week' | 'month' | 'all';

const RANGE_TABS: { key: RangeKey; label: string; hint: string }[] = [
  { key: 'today', label: 'Idag', hint: 'sedan midnatt' },
  { key: 'week', label: '7 dagar', hint: 'senaste veckan' },
  { key: 'month', label: '30 dagar', hint: 'senaste månaden' },
  { key: 'all', label: 'Allt', hint: 'hela historiken' },
];

function kr(n: number) {
  return `${(n || 0).toLocaleString('sv-SE')} kr`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'nyss';
  if (min < 60) return `${min} min sedan`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} tim sedan`;
  return `${Math.round(h / 24)} d sedan`;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  // Held in a ref so background refreshes can authenticate too.
  const passwordRef = useRef('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Array<any>>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [orderPage, setOrderPage] = useState(0);

  const canUnlock = password.trim().length > 0;

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const enteredPassword = password.trim();
    if (!enteredPassword) {
      setError('Ange lösenord.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: enteredPassword }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Fel lösenord eller serverfel.');
        return;
      }

      setData(payload);
      passwordRef.current = enteredPassword;
      setUnlocked(true);

      // fetch orders after unlocking
      fetchOrders();
    } catch (err) {
      setError('Misslyckades med att hämta admindata.');
    } finally {
      setLoading(false);
    }
  };

  async function fetchOrders() {
    if (!passwordRef.current) return;
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', password: passwordRef.current }),
      });
      const json = await res.json();
      if (res.ok) {
        setOrders(json.orders || []);
      } else {
        console.error('Failed to fetch orders', json);
      }
    } catch (e) {
      console.error('Fetch orders failed', e);
    } finally {
      setOrdersLoading(false);
    }
  }

  async function setOrderStatus(userEmail: string, orderId: string, status: string) {
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setStatus', userEmail, orderId, status, password: passwordRef.current }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      if (json?.warning) {
        alert('Status uppdaterad.\n\nOBS: ' + json.warning);
      } else if (status === 'shipped' && json?.emailed) {
        const tn = json?.order?.postnordTracking;
        alert('Order markerad som skickad — kund mejlad.' + (tn ? `\nSpårningsnummer: ${tn}` : ''));
      }
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert('Kunde inte uppdatera orderstatus');
    } finally {
      setActionLoading(null);
    }
  }
  
  useEffect(() => {
    if (!unlocked) return;
    fetchOrders();
    // Auto-refresh so shipped/not-shipped status updates itself without any action.
    const id = setInterval(fetchOrders, 30000);
    return () => clearInterval(id);
  }, [unlocked]);

  const normalizeShippingOption = (value?: string | null) => {
    if (!value) return 'pickup';
    const normalized = value.toLowerCase();
    return normalized === 'postnord' ? 'postnord' : 'pickup';
  };

  const STATUS_OPTIONS = [
    { value: 'not_shipped', label: 'Ej skickad' },
    { value: 'progress', label: 'Pågår' },
    { value: 'shipped', label: 'Skickad' },
  ];

  const normalizeStatus = (value?: string | null) => {
    if (value === 'shipped') return 'shipped';
    if (value === 'progress') return 'progress';
    return 'not_shipped'; // legacy 'completed'/undefined => not shipped
  };

  const statusLabelOf = (value?: string | null) =>
    STATUS_OPTIONS.find((o) => o.value === normalizeStatus(value))?.label || 'Ej skickad';

  const statusBadgeClass = (value?: string | null) => {
    const s = normalizeStatus(value);
    if (s === 'shipped') return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
    if (s === 'progress') return 'bg-blue-100 text-blue-700 border border-blue-300';
    return 'bg-amber-100 text-amber-700 border border-amber-300';
  };

  const getShippingSummary = (order: any) => {
    const carrier = getCarrier(order?.carrier);
    const provider =
      order?.carrierProvider ||
      carrier?.provider ||
      (normalizeShippingOption(order?.shippingOption) === 'postnord' ? 'postnord' : 'pickup');
    const brand = order?.shippingOption || carrier?.brand || (provider === 'postnord' ? 'PostNord' : 'Uthämtning');

    if (provider !== 'pickup') {
      const address = order?.shippingAddress?.address
        ? Object.values(order.shippingAddress.address).filter(Boolean).join(', ')
        : '';
      return { label: brand, detail: address || 'Ingen adress angiven', needsLabel: true };
    }

    return { label: brand, detail: 'Ingen adress behövs – kunden hämtar själv', needsLabel: false };
  };

  // ── Analytics: one range at a time, everything derived from the summary ──
  const [range, setRange] = useState<RangeKey>('today');
  const [visitQuery, setVisitQuery] = useState('');
  const [showAllPages, setShowAllPages] = useState(false);
  const [countingSelf, setCountingSelf] = useState(false);
  const [trackingBusy, setTrackingBusy] = useState(false);

  // "Don't count my own visits" is on by default from the moment the panel is
  // unlocked; this lets it be switched back for testing.
  async function setOwnTracking(exclude: boolean) {
    setTrackingBusy(true);
    try {
      const res = await fetch('/api/admin/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordRef.current, exclude }),
      });
      if (!res.ok) throw new Error('Misslyckades');
      setCountingSelf(!exclude);
    } catch (e: any) {
      alert(e?.message || 'Kunde inte ändra inställningen');
    } finally {
      setTrackingBusy(false);
    }
  }

  const summary = data?.analytics.ranges[range] || null;
  const orderStat = data?.orderStats?.[range] || null;

  const rangeVisits = useMemo(() => {
    if (!data) return [] as RecentVisit[];
    const from = data.analytics.ranges[range].from;
    const list = from
      ? data.analytics.recent.filter((v) => new Date(v.timestamp) >= new Date(from))
      : data.analytics.recent;
    const q = visitQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((v) =>
      [v.path, v.email, v.country, v.city, v.device, v.referrer]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [data, range, visitQuery]);

  const maxDaily = useMemo(
    () => (summary ? Math.max(1, ...summary.daily.map((d) => d.visits)) : 1),
    [summary]
  );

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const pagedOrders = orders.slice(orderPage * pageSize, (orderPage + 1) * pageSize);

  useEffect(() => {
    if (orderPage > 0 && orderPage >= totalPages) setOrderPage(0);
  }, [orders.length, totalPages, orderPage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBar />
      <Header />
      <main className="py-12">
        <div className="container-wide">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            {!unlocked ? (
              <section className="mx-auto max-w-md">
                <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-2xl shadow-slate-200/50">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Administrator</p>
                      <h2 className="mt-4 text-3xl font-bold text-slate-900">Admin Access</h2>
                      <p className="mt-3 text-sm text-slate-600">Enter password to access the dashboard.</p>
                    </div>
                    <form onSubmit={handleUnlock} className="space-y-6">
                      <div>
                        <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700 mb-2">
                          Password
                        </label>
                        <input
                          id="admin-password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                          placeholder="Enter password"
                        />
                      </div>
                      {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                      <button
                        type="submit"
                        disabled={!canUnlock || loading}
                        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/50 transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Unlock Dashboard'}
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            ) : (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">System</p>
                      <h1 className="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a href="#overview" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Overview</a>
                      <a href="#orders" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Orders</a>
                      <a href="#users" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Users</a>
                      <a href="#waitlist" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Waitlist</a>
                      <a href="#newsletter" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Nyhetsbrev</a>
                      <a href="#insights" className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Analytics</a>
                    </div>
                  </div>

                  <div id="overview" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Users</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.metrics.totalUsers : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">Registered</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">👥</div>
                      </div>
                    </div>
                    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Besökare idag</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.analytics.ranges.today.visitors : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">{data ? data.analytics.ranges.today.sessions + ' besök' : 'unika browsers'}</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">📊</div>
                      </div>
                    </div>
                    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Sidvisningar idag</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.analytics.ranges.today.visits : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">{data ? data.analytics.ranges.week.visitors + ' besökare senaste 7 dagarna' : 'sidvisningar'}</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">⚡</div>
                      </div>
                    </div>
                    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Ordrar</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.metrics.totalOrders : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">{data ? kr(data.metrics.totalRevenue) + ' totalt' : 'Total'}</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">📦</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="orders" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Management</p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">Orderhantering</h2>
                      <p className="mt-2 text-sm text-slate-600 max-w-3xl">
                        Se alla beställningar, skriv ut fraktsedlar och markera som skickade på den dedikerade orders-sidan.
                      </p>
                    </div>
                    <a
                      href="/admin/orders"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 whitespace-nowrap"
                    >
                      Gå till orders
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </a>
                  </div>

                  {false && (
                  <div className="mt-6 space-y-4">
                    {ordersLoading ? (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">Loading orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">No orders found.</div>
                    ) : (
                      <div className="space-y-6">
                        {orders.length > pageSize && (
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">Showing {Math.min(orders.length, pageSize)} of {orders.length}</div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setOrderPage((p) => Math.max(0, p - 1))}
                                disabled={orderPage === 0}
                                className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition"
                              >
                                Prev
                              </button>
                              <span className="text-sm text-slate-600 font-medium min-w-[60px] text-center">Page {orderPage + 1} / {totalPages}</span>
                              <button
                                type="button"
                                onClick={() => setOrderPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={orderPage >= totalPages - 1}
                                className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}


                        <div className="orders-scroll grid gap-4" aria-live="polite">
                          {pagedOrders.map((row: any, idx: number) => {
                          const o = row.order;
                          const itemsText = (o.items || []).map((it: any) => `${it.name} x${it.quantity}`).join(', ');
                          const shippingSummary = getShippingSummary(o);
                          const isLoading = actionLoading === o.id;
                          const statusValue = normalizeStatus(o.status);
                          const isPostNord = normalizeShippingOption(o.shippingOption) === 'postnord';

                          return (
                            <div key={`${row.userEmail}-${o.id}-${idx}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs uppercase tracking-widest text-slate-500">Order ID</p>
                                  <h3 className="mt-2 text-lg font-semibold text-slate-900 break-words">{o.id}</h3>
                                  <p className="mt-1 text-sm text-slate-600">{row.userName || 'Customer'} • {row.userEmail}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusBadgeClass(o.status)}`}>
                                    {statusLabelOf(o.status)}
                                  </span>
                                  {o.createdAt && (
                                    <span className="text-sm text-slate-600 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Items</p>
                                  <p className="mt-2 text-sm text-slate-700">{itemsText || 'No items'}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Shipping</p>
                                  <p className="mt-2 text-sm font-semibold text-slate-900">{shippingSummary.label}</p>
                                  <p className="mt-1 text-sm text-slate-700">{shippingSummary.detail}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Total</p>
                                  <p className="mt-2 text-lg font-bold text-emerald-600">{o.totalAmount ? `${o.totalAmount} ${o.currency || 'SEK'}` : '–'}</p>
                                </div>
                              </div>

                              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="text-sm text-slate-600 space-y-1">
                                  {(o.postnordTracking || o.shipmondoTracking) && (
                                    <p className="text-slate-700"><span className="font-semibold text-slate-900">Spårning:</span> {o.postnordTracking || o.shipmondoTracking}</p>
                                  )}
                                  {(o.postnordLabelUrl || o.shipmondoShipmentId) && (
                                    <a
                                      href={`/api/admin/label?email=${encodeURIComponent(row.userEmail)}&order=${encodeURIComponent(o.id)}&t=${encodeURIComponent(row.labelToken || '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
                                    >
                                      Skriv ut fraktsedel{o.shippingOption ? ` (${o.shippingOption})` : ''}
                                    </a>
                                  )}
                                  {shippingSummary.needsLabel && !o.postnordShipmentId && !o.shipmondoShipmentId && (
                                    <p className="text-xs text-amber-600">Ingen etikett skapad ännu.</p>
                                  )}
                                </div>

                                <div className="flex flex-col items-start gap-1 sm:items-end">
                                  {isPostNord ? (
                                    <>
                                      <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${statusBadgeClass(o.status)}`}>
                                        {statusLabelOf(o.status)}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        {normalizeStatus(o.status) === 'shipped'
                                          ? 'Skickad – spårning mejlad till kund'
                                          : `Uppdateras automatiskt via PostNord${o.postnordStatus ? ` · ${o.postnordStatus}` : ''}`}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Uthämtning – status</label>
                                      <select
                                        value={statusValue}
                                        disabled={isLoading}
                                        onChange={(e) => setOrderStatus(row.userEmail, o.id, e.target.value)}
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {STATUS_OPTIONS.map((opt) => (
                                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                      </select>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                          })}
                        </div>

                      </div>
                    )}
                  </div>
                  )}
                </div>

                <div id="users" className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Manage</p>
                        <h2 className="text-2xl font-bold text-slate-900">Users</h2>
                        <p className="text-sm text-slate-600 mt-2">Registered accounts and contact information.</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                        {data ? data.users.length : '...'} total
                      </span>
                    </div>
                    {loading ? (
                      <p className="text-sm text-slate-600">Laddar...</p>
                    ) : !data ? (
                      <p className="text-sm text-slate-600">Inga data hittades.</p>
                    ) : (
                      <div className="list-scroll overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2">
                        <table className="w-full text-left text-sm border-separate border-spacing-0">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-[0.15em] text-xs">
                              <th className="px-4 py-3">Namn</th>
                              <th className="px-4 py-3">E-post</th>
                              <th className="px-4 py-3">Telefon</th>
                              <th className="px-4 py-3">Gatuadress</th>
                              <th className="px-4 py-3">Postnummer</th>
                              <th className="px-4 py-3">Ort</th>
                              <th className="px-4 py-3">Län / stat</th>
                              <th className="px-4 py-3">Order</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.users.map((user, index) => (
                              <tr key={index} className="border-b border-slate-200 bg-white">
                                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                                <td className="px-4 py-3 text-slate-600">{user.phone || '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{user.address || '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{user.postalCode || '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{user.city || '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{user.state || '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{user.orderCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>

                <div id="waitlist" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Waitlist</p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">Waiting List Emails</h2>
                      <p className="mt-2 text-sm text-slate-600">Alla emailadresser som har anmält sig för väntelistan.</p>
                    </div>
                    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                      {data?.waitlistEmails?.length ?? 0} emails
                    </span>
                  </div>

                  {data?.waitlistEmails?.length ? (
                    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2">
                      <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-[0.15em] text-xs">
                            <th className="px-4 py-3">E-post</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.waitlistEmails.map((email, index) => (
                            <tr key={`${email}-${index}`} className="border-b border-slate-200 bg-white">
                              <td className="px-4 py-3 text-slate-700 break-all">{email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
                      Inga e-postadresser hittades för väntelistan.
                    </div>
                  )}
                </div>

                <div id="newsletter" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Nyhetsbrev</p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">Nyhetsbrev-prenumeranter</h2>
                      <p className="mt-2 text-sm text-slate-600">Alla som anmält sig via popupen på sajten.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 whitespace-nowrap">
                        {data?.newsletterSubscribers?.length ?? 0} prenumeranter
                      </span>
                      {data?.newsletterSubscribers?.length ? (
                        <button
                          type="button"
                          onClick={() => {
                            const emails = (data.newsletterSubscribers || []).map((s) => s.email).join(', ');
                            navigator.clipboard?.writeText(emails);
                            alert('Alla e-postadresser kopierade.');
                          }}
                          className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white whitespace-nowrap"
                        >
                          Kopiera alla
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {data?.newsletterSubscribers?.length ? (
                    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2">
                      <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-[0.15em] text-xs">
                            <th className="px-4 py-3">E-post</th>
                            <th className="px-4 py-3">Anmäld</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...data.newsletterSubscribers]
                            .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
                            .map((s, index) => (
                              <tr key={`${s.email}-${index}`} className="border-b border-slate-200 bg-white">
                                <td className="px-4 py-3 text-slate-700 break-all">{s.email}</td>
                                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{s.subscribedAt ? new Date(s.subscribedAt).toLocaleString('sv-SE') : '–'}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
                      Inga prenumeranter ännu.
                    </div>
                  )}
                </div>

                <div id="insights" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Analytics</p>
                      <h2 className="mt-1 text-2xl font-bold text-slate-900">Trafik &amp; besökare</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Välj period — allt nedanför räknas om: hur många som kom in, vilka sidor de var på och var de kom ifrån.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RANGE_TABS.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setRange(tab.key)}
                          className={RANGE_BTN(range === tab.key)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!summary ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
                      Laddar besöksdata…
                    </div>
                  ) : (
                    <>
                      {/* Headline numbers for the chosen period */}
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                          label="Besökare"
                          value={summary.visitors}
                          hint={'unika ' + (RANGE_TABS.find((t) => t.key === range)?.hint || '')}
                          accent
                        />
                        <StatCard label="Besök" value={summary.sessions} hint="separata sessioner" />
                        <StatCard
                          label="Sidvisningar"
                          value={summary.visits}
                          hint={(summary.visitors ? (summary.visits / summary.visitors).toFixed(1) : '0') + ' per besökare'}
                        />
                        <StatCard label="Ordrar" value={orderStat?.count ?? 0} hint={orderStat ? kr(orderStat.revenue) : '—'} />
                        <StatCard
                          label="Konvertering"
                          value={summary.visitors ? (((orderStat?.count ?? 0) / summary.visitors) * 100).toFixed(1) + ' %' : '—'}
                          hint="ordrar per besökare"
                        />
                      </div>

                      {/* Visits per day */}
                      {summary.daily.length > 1 && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                          <p className="text-sm font-semibold text-slate-700">Besök per dag</p>
                          <div className="mt-4 flex h-40 items-end gap-1">
                            {summary.daily.map((d) => (
                              <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end">
                                <div
                                  className="w-full rounded-t bg-slate-900/80 transition group-hover:bg-slate-900"
                                  style={{ height: Math.max(3, (d.visits / maxDaily) * 100) + '%' }}
                                />
                                <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white group-hover:block">
                                  {new Date(d.date).toLocaleDateString('sv-SE')}: {d.visits} visningar · {d.visitors} besökare
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-slate-500">
                            <span>{new Date(summary.daily[0].date).toLocaleDateString('sv-SE')}</span>
                            <span>{new Date(summary.daily[summary.daily.length - 1].date).toLocaleDateString('sv-SE')}</span>
                          </div>
                        </div>
                      )}

                      {/* Which pages they saw, and which one they came in on */}
                      <div className="mt-6 grid gap-4 xl:grid-cols-2">
                        <BreakdownCard
                          title="Sidor"
                          note="Alla sidor som visades i perioden."
                          rows={showAllPages ? summary.pages : summary.pages.slice(0, 8)}
                          unit="visningar"
                          footer={
                            summary.pages.length > 8 ? (
                              <button
                                onClick={() => setShowAllPages((v) => !v)}
                                className="mt-3 text-sm font-semibold text-slate-700 underline hover:text-slate-900"
                              >
                                {showAllPages ? 'Visa färre' : 'Visa alla ' + summary.pages.length + ' sidor'}
                              </button>
                            ) : null
                          }
                        />
                        <BreakdownCard
                          title="Ingångssidor"
                          note="Sidan besöket började på — alltså var de kom in."
                          rows={summary.entryPages.slice(0, 8)}
                          unit="besök"
                          primary="visitors"
                        />
                      </div>

                      <div className="mt-4 grid gap-4 xl:grid-cols-3">
                        <BreakdownCard title="Källa" note="Var trafiken kom ifrån." rows={summary.referrers.slice(0, 6)} unit="visningar" />
                        <BreakdownCard title="Land" note="Enligt IP-uppslag." rows={summary.countries.slice(0, 6)} unit="visningar" />
                        <BreakdownCard title="Enhet" note="Mobil, surfplatta eller dator." rows={summary.devices} unit="visningar" />
                      </div>

                      {/* Every visit in the period — scroll the card to see them all */}
                      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Senaste besök</p>
                            <p className="text-xs text-slate-500">
                              {rangeVisits.length} besök i listan{visitQuery ? ' (filtrerat)' : ''} · scrolla för att se alla
                            </p>
                          </div>
                          <input
                            value={visitQuery}
                            onChange={(e) => setVisitQuery(e.target.value)}
                            placeholder="Sök sida, land, e-post…"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none sm:w-72"
                          />
                        </div>

                        <div className="mt-4 max-h-[26rem] overflow-y-auto rounded-xl border border-slate-200">
                          {rangeVisits.length === 0 ? (
                            <p className="p-8 text-center text-sm text-slate-500">Inga besök i den här perioden.</p>
                          ) : (
                            <table className="w-full text-left text-sm">
                              <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
                                <tr>
                                  <th className="px-4 py-3">Tid</th>
                                  <th className="px-4 py-3">Sida</th>
                                  <th className="px-4 py-3">Plats</th>
                                  <th className="px-4 py-3">Källa</th>
                                  <th className="px-4 py-3">Besökare</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rangeVisits.map((v, i) => (
                                  <tr key={v.visitor + v.timestamp + i} className="border-t border-slate-100 bg-white">
                                    <td className="whitespace-nowrap px-4 py-2 text-slate-500">
                                      {range === 'today'
                                        ? new Date(v.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
                                        : new Date(v.timestamp).toLocaleString('sv-SE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                      <span className="ml-2 text-xs text-slate-400">{timeAgo(v.timestamp)}</span>
                                    </td>
                                    <td className="px-4 py-2 font-medium text-slate-900">{v.path}</td>
                                    <td className="px-4 py-2 text-slate-600">
                                      {[v.city, v.country].filter(Boolean).join(', ') || '—'}
                                    </td>
                                    <td className="px-4 py-2 text-slate-600">{v.referrer || '—'}</td>
                                    <td className="px-4 py-2 text-slate-600">
                                      {v.email !== 'anonymous' ? v.email : <span className="text-slate-400">anonym</span>}
                                      {v.device ? <span className="ml-2 text-xs text-slate-400">{v.device}</span> : null}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          Totalt {data?.metrics.totalPageViews ?? 0} sidvisningar registrerade sedan{' '}
                          {data?.metrics.firstPageView ? new Date(data.metrics.firstPageView).toLocaleDateString('sv-SE') : '—'}.
                          Listan visar de 500 senaste. Besökare räknas per webbläsare (cookie); besök som loggades
                          innan den räkningen fanns uppskattas per 30-minutersfönster.
                        </p>
                        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-slate-600">
                            {countingSelf ? (
                              <>Dina egna besök <span className="font-semibold text-slate-900">räknas just nu</span> i siffrorna ovan.</>
                            ) : (
                              <>
                                Dina egna besök från den här enheten räknas <span className="font-semibold text-slate-900">inte</span> — bara
                                kunder. {data?.analytics.excludedVisits ? `${data.analytics.excludedVisits} egna sidvisningar är dolda.` : ''}
                              </>
                            )}
                          </p>
                          <button
                            onClick={() => setOwnTracking(countingSelf)}
                            disabled={trackingBusy}
                            className="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                          >
                            {trackingBusy ? '…' : countingSelf ? 'Sluta räkna mina besök' : 'Räkna med mina besök igen'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


const RANGE_BTN = (active: boolean) =>
  'rounded-xl border px-4 py-2 text-sm font-bold transition ' +
  (active
    ? 'border-slate-900 bg-slate-900 text-white'
    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-white');

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? 'rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white' : 'rounded-2xl border border-slate-200 bg-slate-50 p-5'}>
      <p className={accent ? 'text-xs font-semibold uppercase tracking-widest text-slate-300' : 'text-xs font-semibold uppercase tracking-widest text-slate-500'}>{label}</p>
      <p className={accent ? 'mt-2 text-3xl font-bold text-white' : 'mt-2 text-3xl font-bold text-slate-900'}>{value}</p>
      {hint ? <p className={accent ? 'mt-1 text-xs text-slate-300' : 'mt-1 text-xs text-slate-500'}>{hint}</p> : null}
    </div>
  );
}

function BreakdownCard({
  title,
  note,
  rows,
  unit,
  primary = 'views',
  footer,
}: {
  title: string;
  note?: string;
  rows: CountRow[];
  unit: string;
  primary?: 'views' | 'visitors';
  footer?: React.ReactNode;
}) {
  const max = Math.max(1, ...rows.map((r) => (primary === 'views' ? r.views : r.visitors)));
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}
      <div className="mt-4 space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-400">Ingen data i perioden.</p>
        ) : (
          rows.map((row) => {
            const value = primary === 'views' ? row.views : row.visitors;
            return (
              <div key={row.key} className="relative overflow-hidden rounded-lg bg-white px-3 py-2">
                <div className="absolute inset-y-0 left-0 bg-slate-900/10" style={{ width: (value / max) * 100 + '%' }} />
                <div className="relative flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-slate-700">{row.key}</span>
                  <span className="whitespace-nowrap font-semibold text-slate-900">
                    {value} {unit}
                    {primary === 'views' && row.visitors ? (
                      <span className="ml-2 text-xs font-normal text-slate-500">{row.visitors} besökare</span>
                    ) : null}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {footer}
    </div>
  );
}
