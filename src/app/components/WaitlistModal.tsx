'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function WaitlistModal({ isOpen, onClose, productName = 'Produkten' }: WaitlistModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError(t('waitlist.invalid'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || t('waitlist.error'));
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err?.message || t('waitlist.error'));
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
              <h3 className="text-2xl font-bold text-foreground mb-2">{t('waitlist.thanks')}</h3>
              <p className="text-muted-foreground">
                {t('waitlist.thanksBody1')} <strong>{email}</strong> {t('waitlist.thanksBody2')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{t('waitlist.title')}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t('waitlist.subtitle')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={t('waitlist.close')}
                >
                  <Icon name="XMarkIcon" size={24} />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                {productName} {t('waitlist.body')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-semibold text-foreground mb-2">
                    {t('waitlist.emailLabel')}
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('waitlist.placeholder')}
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
                      {t('waitlist.saving')}
                    </>
                  ) : (
                    <>
                      <Icon name="HeartIcon" size={16} />
                      {t('waitlist.watch')}
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  {t('waitlist.noSpamShort')}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
