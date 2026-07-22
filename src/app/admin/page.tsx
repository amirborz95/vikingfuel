'use client';

import React, { useMemo, useState, useEffect } from 'react';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

interface DashboardSession {
  email: string;
  createdAt: string;
  expiresAt: string;
}

interface DashboardLog {
  action: string;
  email: string;
  timestamp: string;
}

interface DashboardPageView {
  page: string;
  path: string;
  email: string;
  timestamp: string;
}

interface PageViewSummary {
  path: string;
  count: number;
}

interface VisitorSummary {
  email: string;
  count: number;
}

interface DashboardMetrics {
  totalUsers: number;
  totalLogins: number;
  totalRegistrations: number;
  totalOrders: number;
  activeSessions: number;
  uniqueLoginEmails: number;
  latestLogin: string | null;
  latestSession: string | null;
  totalPageViews: number;
  uniquePages: number;
  uniquePageViewUsers: number;
  latestPageView: string | null;
  geoPageViews: number;
  geoCountries: number;
}

interface CountrySummary {
  country: string;
  count: number;
}

interface DashboardData {
  users: DashboardUser[];
  sessions: DashboardSession[];
  logs: DashboardLog[];
  metrics: DashboardMetrics;
  pageViews: DashboardPageView[];
  pageViewsByPage: PageViewSummary[];
  pageViewsByUser: VisitorSummary[];
  pageViewsByCountry: CountrySummary[];
  waitlistEmails: string[];
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
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
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
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

  async function resendConfirmation(userEmail: string, orderId: string) {
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendConfirmation', userEmail, orderId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      alert('Orderbekräftelse skickad');
    } catch (e) {
      console.error(e);
      alert('Kunde inte skicka orderbekräftelse');
    } finally {
      setActionLoading(null);
    }
  }

  async function markShipped(userEmail: string, orderId: string, tracking?: string | null) {
    setActionLoading(orderId);
    try {
      const body: any = { action: 'markShipped', userEmail, orderId };
      if (tracking) body.tracking = tracking;

      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      alert('Order markerad som skickad och kund mejlad');
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert('Kunde inte markera order som skickad');
    } finally {
      setActionLoading(null);
    }
  }
  
  useEffect(() => {
    if (unlocked) fetchOrders();
  }, [unlocked]);

  const normalizeShippingOption = (value?: string | null) => {
    if (!value) return 'pickup';
    const normalized = value.toLowerCase();
    return normalized === 'postnord' ? 'postnord' : 'pickup';
  };

  const getShippingSummary = (order: any) => {
    const shippingMethod = normalizeShippingOption(order?.shippingOption);

    if (shippingMethod === 'postnord') {
      const address = order?.shippingAddress?.address
        ? Object.values(order.shippingAddress.address).filter(Boolean).join(', ')
        : '';

      return {
        label: 'PostNord',
        detail: address || 'Ingen adress angiven',
      };
    }

    return {
      label: 'Uthämtning',
      detail: 'Ingen adress behövs – kunden hämtar själv',
    };
  };

  const authEvents = useMemo(() => {
    if (!data) return [];
    return data.logs
      .filter((log) => log.action === 'login' || log.action === 'register')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data]);

  const uniqueAuthEvents = useMemo(() => {
    const latestByEmail = new Map<string, DashboardLog>();
    authEvents.forEach((log) => {
      if (!latestByEmail.has(log.email)) {
        latestByEmail.set(log.email, log);
      }
    });
    return Array.from(latestByEmail.values());
  }, [authEvents]);

  const recentAuthEvents = uniqueAuthEvents.slice(0, 10);

  const loginEmails = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.logs.filter((log) => log.action === 'login').map((log) => log.email))).sort();
  }, [data]);

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
                      <a href="#auth-history" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Auth</a>
                      <a href="#live-users" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Live</a>
                      <a href="#waitlist" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Waitlist</a>
                      <a href="#insights" className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Insights</a>
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
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Logins</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.metrics.totalLogins : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">Authenticated</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">📊</div>
                      </div>
                    </div>
                    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Active</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.metrics.activeSessions : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">Sessions</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">⚡</div>
                      </div>
                    </div>
                    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Orders</p>
                          <p className="mt-4 text-4xl font-bold text-slate-900">{data ? data.metrics.totalOrders : '—'}</p>
                          <p className="mt-2 text-xs text-slate-500">Total</p>
                        </div>
                        <div className="text-3xl rounded-full bg-slate-100 p-3 text-slate-700 transition">📦</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="orders" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Management</p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">Orders</h2>
                      <p className="mt-2 text-sm text-slate-600 max-w-3xl">
                        Manage all customer orders with status tracking and fulfillment actions.
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                      {orders.length} Total
                    </span>
                  </div>

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
                          const statusLabel = o.status === 'shipped' ? 'Shipped' : 'Pending';
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
                                  <span className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap ${o.status === 'shipped' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                                    {statusLabel}
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

                              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-slate-600">
                                  <p className="font-semibold text-slate-900">Actions</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => resendConfirmation(row.userEmail, o.id)}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                  >
                                    Send Confirmation
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => markShipped(row.userEmail, o.id, o.postnordTracking)}
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                  >
                                    {isPostNord ? 'Mark Shipped' : 'Markera som redo för uthämtning'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                          })}
                        </div>

                      </div>
                    )}
                  </div>
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

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">Autentiseringshändelser</h2>
                    <p className="mb-4 text-sm text-slate-600">Visar de senaste unika registreringarna och inloggningarna per användare.</p>
                    <div className="list-scroll space-y-3 text-sm text-slate-700">
                      {loading ? (
                        <p className="text-sm text-slate-600">Laddar...</p>
                      ) : !data ? (
                        <p className="text-sm text-slate-600">Inga loggar tillgängliga.</p>
                      ) : recentAuthEvents.length === 0 ? (
                        <p className="text-sm text-slate-600">Inga autentiseringshändelser.</p>
                      ) : (
                        recentAuthEvents.map((item, index) => (
                          <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-slate-900">{item.email}</p>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">{item.action === 'register' ? 'Registrering' : 'Inloggning'}</span>
                            </div>
                            <p className="mt-2 text-slate-600 text-xs">{new Date(item.timestamp).toLocaleString('sv-SE')}</p>
                          </div>
                        ))
                      )}
                    </div>
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

                <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                  <div id="auth-history" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Track</p>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">Authentication History</h2>
                    <p className="text-sm text-slate-600 mt-3">Registrations and logins, unique per user.</p>
                    <div className="list-scroll overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2 mt-6">
                      <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-[0.15em] text-xs">
                            <th className="px-4 py-3">Typ</th>
                            <th className="px-4 py-3">E-post</th>
                            <th className="px-4 py-3">Tid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uniqueAuthEvents.map((log, index) => (
                            <tr key={index} className="border-b border-slate-200 bg-white">
                              <td className="px-4 py-3 font-semibold text-slate-900">{log.action === 'register' ? 'Registrering' : 'Inloggning'}</td>
                              <td className="px-4 py-3 text-slate-600">{log.email}</td>
                              <td className="px-4 py-3 text-slate-600">{new Date(log.timestamp).toLocaleString('sv-SE')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div id="live-users" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl space-y-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Real-time</p>
                      <h2 className="text-2xl font-bold text-slate-900 mt-1">Active Sessions</h2>
                      <p className="mt-2 text-sm text-slate-600">Sessions currently stored in the system.</p>
                      <div className="list-scroll mt-4 space-y-3 text-sm text-slate-700">
                        {data?.sessions.length ? (
                          data.sessions.map((session, index) => (
                            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="font-semibold text-slate-900">{session.email}</p>
                              <p className="text-slate-600 text-xs">Created: {new Date(session.createdAt).toLocaleString('en-US')}</p>
                              <p className="text-slate-600 text-xs">Expires: {new Date(session.expiresAt).toLocaleString('en-US')}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-600">No active sessions.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Connected</p>
                      <h2 className="text-2xl font-bold text-slate-900 mt-1">Logged In Emails</h2>
                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        {loginEmails.length ? (
                          loginEmails.map((email) => (
                            <div key={email} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700">{email}</div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-600">No logged-in emails found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div id="insights" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Analytics</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">Insights</h2>
                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Geografi</p>
                      {data?.metrics.geoPageViews ? (
                        <>
                          <p className="mt-3 text-sm text-slate-700">
                            {data.metrics.geoPageViews} platsbaserade besök från {data.metrics.geoCountries} länder.
                          </p>
                          <div className="mt-4 space-y-2 text-sm text-slate-700">
                            {data.pageViewsByCountry.length ? (
                              data.pageViewsByCountry.map((item) => (
                                <div key={item.country} className="flex items-center justify-between border-t border-slate-200 py-2">
                                  <span className="text-slate-700">{item.country}</span>
                                  <span className="font-semibold text-slate-900">{item.count} visningar</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-slate-400">Inga landdata hittades ännu.</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="mt-3 text-sm text-slate-600">Ingen plats- eller landsspårning är aktiverad ännu.</p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Sidvisningar</p>
                      <p className="mt-3 text-sm text-slate-700">
                        Totalt <span className="font-semibold text-slate-100">{data ? data.metrics.totalPageViews : '...'}</span> sidvisningar från <span className="font-semibold text-slate-100">{data ? data.metrics.uniquePageViewUsers : '...'}</span> besökare över <span className="font-semibold text-slate-100">{data ? data.metrics.uniquePages : '...'}</span> unika sidor.
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        Senaste besöket: {data ? (data.metrics.latestPageView ? new Date(data.metrics.latestPageView).toLocaleString('sv-SE') : 'Ingen data ännu') : '...'}.
                      </p>
                      <div className="mt-4 text-sm text-slate-700 space-y-3">
                        {data?.pageViewsByPage.length ? (
                          data.pageViewsByPage.slice(0, 5).map((item) => (
                            <div key={item.path} className="flex items-center justify-between border-t border-slate-200 py-2">
                              <span className="text-slate-700">{item.path}</span>
                              <span className="font-semibold text-slate-900">{item.count} visningar</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">Inga sidvisningsdata ännu.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 mt-6 shadow-xl">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Per person</h2>
                  <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Toppbesökare</p>
                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        {data?.pageViewsByUser.length ? (
                          data.pageViewsByUser.map((item) => (
                            <div key={item.email} className="flex items-center justify-between border-t border-slate-200 py-2">
                              <span className="text-slate-700">{item.email}</span>
                              <span className="font-semibold text-slate-900">{item.count} visningar</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">Inga besöksdata per användare ännu.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Senaste sidbesök</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-700">
                        {data?.pageViews.length ? (
                          data.pageViews.slice(0, 6).map((visit, index) => (
                            <div key={`${visit.email}-${index}`} className="border-t border-slate-200 py-2">
                              <p className="font-medium text-slate-900">{visit.email}</p>
                              <p className="text-slate-600 text-xs">{visit.path}</p>
                              <p className="text-slate-600 text-xs">{new Date(visit.timestamp).toLocaleString('sv-SE')}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">Inga sidbesök registrerade ännu.</p>
                        )}
                      </div>
                    </div>
                  </div>
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
