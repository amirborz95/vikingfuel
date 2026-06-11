'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function WaitlistModal({ isOpen, onClose, productName = 'Produkten' }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Store email in localStorage or send to API if needed
      const existingEmails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
        localStorage.setItem('waitlistEmails', JSON.stringify(existingEmails));
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Något gick fel. Försök igen.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-in zoom-in-95 fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-border">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="CheckIcon" size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Tack!</h3>
              <p className="text-muted-foreground">
                Vi skickar ett meddelande till <strong>{email}</strong> så fort produkterna är tillgängliga.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Produkten kommer snart</h2>
                  <p className="text-sm text-muted-foreground mt-1">Låt oss veta när du vill köpa</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Stäng"
                >
                  <Icon name="XMarkIcon" size={24} />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                {productName} är snart tillgänglig igen! Skriv din e-postadress nedan så kontaktar vi dig så fort vi får stock. Vi skickar ett email när produkten är redo att beställa.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-semibold text-foreground mb-2">
                    Din e-postadress
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din.email@example.com"
                    required
                    className="w-full border border-border bg-white px-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    disabled={loading}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-rose-600">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Sparar...
                    </>
                  ) : (
                    <>
                      <Icon name="HeartIcon" size={16} />
                      Bevaka produkt
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Vi skickar endast ett email när produkten är tillgänglig. Inget spam.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
