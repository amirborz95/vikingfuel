'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SubscriptionPage() {
  const { isAuthenticated, login } = useAuth();
  const { lang } = useLanguage();
  const en = lang === 'en';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  async function openPortal() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/customer-portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        data.message ||
          (en ? 'Could not open the portal.' : 'Kunde inte öppna portalen.')
      );
    } catch {
      setError(en ? 'Something went wrong.' : 'Något gick fel.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoggingIn(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.success) setError(res.message || (en ? 'Login failed.' : 'Inloggning misslyckades.'));
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="container-wide py-16">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="section-label">{en ? 'Subscription' : 'Prenumeration'}</p>
            <h1 className="mt-3 text-4xl font-bold text-foreground">
              {en ? 'Manage your subscription' : 'Hantera din prenumeration'}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {en
                ? 'Update your payment method, pause or cancel — anytime.'
                : 'Uppdatera betalmetod, pausa eller avsluta — när du vill.'}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
            {isAuthenticated ? (
              <>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  {en
                    ? 'Open the secure Stripe portal to manage your subscription.'
                    : 'Öppna den säkra Stripe-portalen för att hantera din prenumeration.'}
                </p>
                <button
                  onClick={openPortal}
                  disabled={loading}
                  className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95 disabled:opacity-50"
                >
                  {loading ? (en ? 'Opening…' : 'Öppnar…') : (en ? 'Manage subscription' : 'Hantera prenumeration')}
                </button>
                {error && <p className="mt-3 text-center text-sm text-rose-600">{error}</p>}
              </>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <p className="mb-2 text-center text-sm text-muted-foreground">
                  {en ? 'Log in to manage your subscription.' : 'Logga in för att hantera din prenumeration.'}
                </p>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder={en ? 'Email' : 'E-post'}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder={en ? 'Password' : 'Lösenord'}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button type="submit" disabled={loggingIn || !email || !password} className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95 disabled:opacity-50">
                  {loggingIn ? (en ? 'Logging in…' : 'Loggar in…') : (en ? 'Log in' : 'Logga in')}
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  {en ? 'No account?' : 'Inget konto?'}{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">{en ? 'Create one' : 'Skapa konto'}</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
