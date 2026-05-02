'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const { user, logout, getAuthLogs, getAllUsers } = useAuth();
  const { t } = useLanguage();

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
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">{t.account.unauthenticatedTitle}</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {t.account.unauthenticatedMessage}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link href="/login" className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                        {t.account.signIn}
                      </Link>
                      <Link href="/register" className="rounded-2xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors">
                        {t.account.register}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-3xl p-10">
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">{t.account.greeting.replace('{name}', user.name)}</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {t.account.loggedInMessage.replace('{email}', user.email)}
                    </p>
                    <div className="rounded-3xl border border-border p-6 bg-white shadow-sm">
                      <h2 className="text-2xl font-semibold text-foreground mb-4">{t.account.accountInfoTitle}</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t.account.nameLabel}: <span className="text-foreground font-medium">{user.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-6">
                        {t.account.emailLabel}: <span className="text-foreground font-medium">{user.email}</span>
                      </p>
                      <button
                        type="button"
                        onClick={logout}
                        className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-bold text-white hover:bg-rose-600 transition-colors"
                      >
                        {t.account.logout}
                      </button>
                    </div>
                    {isAdmin && (
                      <div className="rounded-3xl border border-border p-6 bg-white shadow-sm mt-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">{t.account.registeredUsersTitle}</h2>
                        <div className="space-y-2">
                          {getAllUsers().length === 0 ? (
                            <p className="text-sm text-muted-foreground">{t.account.noRegisteredUsers}</p>
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
                        <h2 className="text-2xl font-semibold text-foreground mb-4">{t.account.authLogsTitle}</h2>
                        <div className="space-y-2">
                          {getAuthLogs().length === 0 ? (
                            <p className="text-sm text-muted-foreground">{t.account.noAuthLogs}</p>
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
