'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (async () => {
      const result = await register(name, email, password);
      setFeedback({ text: result.message, isError: !result.success });
      if (result.success) {
        router.push('/account');
      }
    })();
  };

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-extrabold text-foreground mb-4">Registrera dig</h1>
                  <p className="text-lg text-muted-foreground">
                    Skapa ett konto med din e-postadress och ett lösenord.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-3xl p-8 shadow-sm">
                  {user ? (
                    <div className="space-y-6 text-center">
                      <p className="text-foreground text-lg font-medium">Du är redan inloggad som {user.name}.</p>
                      <Link href="/account" className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                        Gå till mitt konto
                      </Link>
                    </div>
                  ) : (
                    <>
                      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Namn</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                            className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Ditt namn"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">E-post</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="example@exempel.se"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Lösenord</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Ditt lösenord"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Registrera dig
                        </button>
                      </form>
                      {feedback && (
                        <div
                          className={`mt-6 rounded-2xl border p-4 text-sm ${
                            feedback.isError
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}
                        >
                          {feedback.text}
                        </div>
                      )}
                      <div className="mt-8 text-center text-sm text-muted-foreground">
                        Har du redan ett konto?{' '}
                        <Link href="/login" className="font-bold text-foreground hover:text-primary">
                          Logga in
                        </Link>
                      </div>
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Eller fortsätt som{' '}
                        <Link href="/" className="font-bold text-foreground hover:text-primary">
                          gäst
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
