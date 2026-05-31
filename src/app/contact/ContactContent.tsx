'use client';

import React, { useState } from 'react';

export default function ContactContent() {
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

    // Submit to Netlify Forms. The POST must target the static skeleton path
    // (/__forms.html) so it reaches Netlify's form handler instead of the
    // Next.js server, and must be url-encoded with the matching form-name.
    const payload = new URLSearchParams({
      'form-name': 'contact',
      subject: `Ny kontaktförfrågan från ${name}`,
      name,
      email,
      message,
    });

    fetch('/__forms.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    })
      .then((res) => {
        setIsLoading(false);
        if (!res.ok) {
          throw new Error('Ett fel uppstod när meddelandet skulle skickas.');
        }
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Ett fel uppstod. Försök igen senare.');
      });
  };

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Kontakt</h1>
          <p className="text-lg text-muted-foreground">Fyll i ditt namn, e-post och meddelande så skickas det direkt till info@vikingfuel.se.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-muted/30 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="name">
                  Namn
                </label>
                <input
                  id="name"
                  name="Namn"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Ditt namn"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="email">
                  E-post
                </label>
                <input
                  id="email"
                  name="E-post"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="info@exempel.se"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="message">
                  Beskrivning
                </label>
                <textarea
                  id="message"
                  name="Meddelande"
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Skriv ditt meddelande här"
                />
              </div>
              {isSubmitted && (
                <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Tack för ditt meddelande, vi återkommer så snart som möjligt.
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
                  {isLoading ? 'Skickar...' : 'Skicka'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}