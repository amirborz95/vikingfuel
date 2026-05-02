'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const { user, logout, getAuthLogs, getAllUsers } = useAuth();

  // Only show logs for admin users
  const adminEmails = ['info@vikingfuel.com'];
  const isAdmin = user && adminEmails.includes(user.email);

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="max-w-3xl mx-auto">
                {!user ? (
                  <div className="bg-muted/30 rounded-3xl p-10 text-center">
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">Logga in på ditt konto</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      Du måste vara inloggad för att komma åt denna sida.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link href="/login" className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                        Logga in
                      </Link>
                      <Link href="/register" className="rounded-2xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors">
                        Registrera dig
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-3xl p-10">
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">Välkommen tillbaka, {user.name}!</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      Du är inloggad som {user.email}.
                    </p>
                    <div className="rounded-3xl border border-border p-6 bg-white shadow-sm">
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Kontoinformation</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        Namn: <span className="text-foreground font-medium">{user.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-6">
                        E-post: <span className="text-foreground font-medium">{user.email}</span>
                      </p>
                      <button
                        type="button"
                        onClick={logout}
                        className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-bold text-white hover:bg-rose-600 transition-colors"
                      >
                        Logga ut
                      </button>
                    </div>
                    {isAdmin && (
                      <div className="rounded-3xl border border-border p-6 bg-white shadow-sm mt-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Registrerade användare</h2>
                        <div className="space-y-2">
                          {getAllUsers().length === 0 ? (
                            <p className="text-sm text-muted-foreground">Inga registrerade användare ännu.</p>
                          ) : (
                            getAllUsers().map((registeredUser, index) => (
                              <div key={index} className="text-sm bg-muted/50 p-3 rounded-lg">
                                <span className="font-medium">{registeredUser.name}</span> - {registeredUser.email}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    {isAdmin && (
                      <div className="rounded-3xl border border-border p-6 bg-white shadow-sm mt-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Inloggningslogg</h2>
                        <div className="space-y-2">
                          {getAuthLogs().length === 0 ? (
                            <p className="text-sm text-muted-foreground">Inga inloggningshändelser ännu.</p>
                          ) : (
                            getAuthLogs().map((log, index) => (
                              <div key={index} className="text-sm bg-muted/50 p-3 rounded-lg">
                                <span className="font-medium capitalize">{log.action}</span> - {log.email} - {new Date(log.timestamp).toLocaleString('sv-SE')}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}

