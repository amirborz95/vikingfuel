'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactContent() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then(async (res) => {
        setIsLoading(false);
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || t('contact.errSend'));
        }
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((err) => {
        setError(err.message || t('contact.errGeneric'));
      });
  };

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">{t('contact.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('contact.sub')}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-muted/30 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="name">{t('contact.name')}</label>
                <input
                  id="name"
                  name="Namn"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.namePh')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="email">{t('contact.email')}</label>
                <input
                  id="email"
                  name="E-post"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.emailPh')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="message">{t('contact.message')}</label>
                <textarea
                  id="message"
                  name="Meddelande"
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.messagePh')}
                />
              </div>
              {isSubmitted && (
                <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {t('contact.success')}
                </p>
              )}
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </p>
              )}
              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? t('contact.sending') : t('contact.send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}