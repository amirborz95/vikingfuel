'use client';

import React, { useEffect, useState } from 'react';

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  savedEmail?: string;
}

export default function NewsletterModal({ open, onClose, onSubmit, savedEmail }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (savedEmail) {
      setSuccess(true);
    }
  }, [savedEmail]);

  useEffect(() => {
    if (!open) {
      setError('');
      setEmail('');
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Vänligen ange en giltig e-postadress.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const text = await response.text();
      let result: any = {};

      if (text) {
        try {
          result = JSON.parse(text);
        } catch (parseError) {
          console.warn('Could not parse newsletter response JSON:', parseError, text);
        }
      }

      if (!response.ok) {
        setError(
          result?.error || 'Kunde inte skicka e-postadressen. Försök igen senare.'
        );
        return;
      }

      onSubmit(trimmedEmail);
      setSuccess(true);
    } catch (fetchError: any) {
      setError(
        fetchError?.message || 'Kunde inte spara e-postadressen. Kontrollera din uppkoppling och försök igen.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">
              Nyhetsbrev
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              Få exklusiva erbjudanden och nyheter
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Anmäl dig till vårt nyhetsbrev för att få produktuppdateringar och specialerbjudanden direkt i din inkorg.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-foreground/70 hover:bg-muted transition-colors"
            aria-label="Stäng"
          >
            ✕
          </button>
        </div>

        <div className="mt-6">
          {success ? (
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 text-sm text-foreground">
              Tack! Du är prenumererad på nyhetsbrevet.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-foreground">
                E-postadress
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@exempel.se"
                className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Spelar in...' : 'Prenumerera'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-3xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Ingen tack
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
