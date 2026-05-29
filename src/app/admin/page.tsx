'use client';

import React, { useMemo, useState } from 'react';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DashboardUser {
  name: string;
  email: string;
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
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

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
      const response = await fetch('/api/admin/dashboard/', {
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
    } catch (err) {
      setError('Misslyckades med att hämta admindata.');
    } finally {
      setLoading(false);
    }
  };

  const loginEmails = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.logs.filter((log) => log.action === 'login').map((log) => log.email))).sort();
  }, [data]);

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main className="py-20">
        <div className="container-wide">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-bold text-foreground">Vikingfuel Backoffice</h1>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground">
                Ange ditt adminlösenord för att se serverdata, användarloggar, aktiva sessioner och andra insikter om sajten.
              </p>
            </div>

            {!unlocked ? (
              <section className="border border-border bg-slate-50 p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Skriv in administratörslösenord</h2>
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-semibold text-foreground mb-2">
                      Lösenord
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full border border-border bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ange lösenord"
                    />
                  </div>
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={!canUnlock || loading}
                    className="inline-flex items-center justify-center rounded-none bg-foreground px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Kontrollerar...' : 'Öppna adminpanelen'}
                  </button>
                </form>
              </section>
            ) : (
              <section className="space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="border border-border bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Användare</p>
                    <p className="mt-4 text-3xl font-bold text-foreground">{data ? data.metrics.totalUsers : '...'}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Registrerade konton</p>
                  </div>
                  <div className="border border-border bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Live</p>
                    <p className="mt-4 text-3xl font-bold text-foreground">{data ? data.metrics.activeSessions : '...'}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Aktiva sessioner / live users</p>
                  </div>
                  <div className="border border-border bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Inloggningar</p>
                    <p className="mt-4 text-3xl font-bold text-foreground">{data ? data.metrics.totalLogins : '...'}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Totalt antal loggningar</p>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                  <div className="border border-border bg-slate-50 p-6">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">Användarlista</h2>
                        <p className="text-sm text-muted-foreground mt-2">Registrerade konton och e-postadresser.</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {data ? data.users.length : '...'} totalt
                      </span>
                    </div>
                    {loading ? (
                      <p className="text-sm text-muted-foreground">Laddar...</p>
                    ) : !data ? (
                      <p className="text-sm text-muted-foreground">Inga data hittades.</p>
                    ) : (
                      <div className="space-y-3 text-sm text-foreground">
                        {data.users.map((user, index) => (
                          <div key={index} className="flex items-center justify-between border-t border-border py-3">
                            <span>{user.name}</span>
                            <span className="text-muted-foreground">{user.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border border-border bg-slate-50 p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Senaste logins</h2>
                    <div className="space-y-3 text-sm text-foreground">
                      {loading ? (
                        <p className="text-sm text-muted-foreground">Laddar...</p>
                      ) : !data ? (
                        <p className="text-sm text-muted-foreground">Inga loggar tillgängliga.</p>
                      ) : (
                        data.logs
                          .filter((log) => log.action === 'login')
                          .slice(-10)
                          .reverse()
                          .map((item, index) => (
                            <div key={index} className="border-t border-border pt-3">
                              <p className="font-medium text-foreground">{item.email}</p>
                              <p className="text-muted-foreground text-xs">
                                {new Date(item.timestamp).toLocaleString('sv-SE')}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                  <div className="border border-border bg-slate-50 p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">All loggdata</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground uppercase tracking-[0.15em] text-xs">
                            <th className="px-4 py-3">Typ</th>
                            <th className="px-4 py-3">E-post</th>
                            <th className="px-4 py-3">Tid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.logs.slice(-20).reverse().map((log, index) => (
                            <tr key={index} className="border-b border-border bg-white">
                              <td className="px-4 py-3 font-semibold text-foreground">{log.action}</td>
                              <td className="px-4 py-3 text-muted-foreground">{log.email}</td>
                              <td className="px-4 py-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString('sv-SE')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-border bg-slate-50 p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">Live-användare</h2>
                      <p className="mt-3 text-sm text-muted-foreground">Sessioner som finns lagrade just nu.</p>
                      <div className="mt-4 space-y-3 text-sm text-foreground">
                        {data?.sessions.length ? (
                          data.sessions.map((session, index) => (
                            <div key={index} className="border-t border-border pt-3">
                              <p className="font-medium">{session.email}</p>
                              <p className="text-muted-foreground text-xs">Skapad: {new Date(session.createdAt).toLocaleString('sv-SE')}</p>
                              <p className="text-muted-foreground text-xs">Upphör: {new Date(session.expiresAt).toLocaleString('sv-SE')}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Inga aktiva sessioner.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">E-post loggade in</h2>
                      <div className="mt-4 space-y-2 text-sm text-foreground">
                        {loginEmails.length ? (
                          loginEmails.map((email) => (
                            <div key={email} className="border-t border-border pt-3">{email}</div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Inga inloggade e-postadresser hittades.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border bg-slate-50 p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Insikter</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-border bg-white p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Geografi</p>
                      {data?.metrics.geoPageViews ? (
                        <>
                          <p className="mt-3 text-sm text-foreground">
                            {data.metrics.geoPageViews} platsbaserade besök från {data.metrics.geoCountries} länder.
                          </p>
                          <div className="mt-4 space-y-2 text-sm text-foreground">
                            {data.pageViewsByCountry.length ? (
                              data.pageViewsByCountry.map((item) => (
                                <div key={item.country} className="flex items-center justify-between border-t border-border py-2">
                                  <span>{item.country}</span>
                                  <span className="font-semibold">{item.count} visningar</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Inga landdata hittades ännu.</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="mt-3 text-sm text-foreground">Ingen plats- eller landsspårning är aktiverad ännu.</p>
                      )}
                    </div>
                    <div className="border border-border bg-white p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Sidvisningar</p>
                      <p className="mt-3 text-sm text-foreground">
                        Totalt <span className="font-semibold">{data ? data.metrics.totalPageViews : '...'}</span> sidvisningar från <span className="font-semibold">{data ? data.metrics.uniquePageViewUsers : '...'}</span> besökare över <span className="font-semibold">{data ? data.metrics.uniquePages : '...'}</span> unika sidor.
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Senaste besöket: {data ? (data.metrics.latestPageView ? new Date(data.metrics.latestPageView).toLocaleString('sv-SE') : 'Ingen data ännu') : '...'}.
                      </p>
                      <div className="mt-4 text-sm text-foreground space-y-3">
                        {data?.pageViewsByPage.length ? (
                          data.pageViewsByPage.slice(0, 5).map((item) => (
                            <div key={item.path} className="flex items-center justify-between border-t border-border py-2">
                              <span>{item.path}</span>
                              <span className="font-semibold">{item.count} visningar</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Inga sidvisningsdata ännu.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border bg-slate-50 p-6 mt-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Per person</h2>
                  <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <div className="border border-border bg-white p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Toppbesökare</p>
                      <div className="mt-4 space-y-2 text-sm text-foreground">
                        {data?.pageViewsByUser.length ? (
                          data.pageViewsByUser.map((item) => (
                            <div key={item.email} className="flex items-center justify-between border-t border-border py-2">
                              <span>{item.email}</span>
                              <span className="font-semibold">{item.count} visningar</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Inga besöksdata per användare ännu.</p>
                        )}
                      </div>
                    </div>

                    <div className="border border-border bg-white p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Senaste sidbesök</p>
                      <div className="mt-4 space-y-3 text-sm text-foreground">
                        {data?.pageViews.length ? (
                          data.pageViews.slice(0, 6).map((visit, index) => (
                            <div key={`${visit.email}-${index}`} className="border-t border-border py-2">
                              <p className="font-medium text-foreground">{visit.email}</p>
                              <p className="text-muted-foreground text-xs">{visit.path}</p>
                              <p className="text-muted-foreground text-xs">{new Date(visit.timestamp).toLocaleString('sv-SE')}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Inga sidbesök registrerade ännu.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
