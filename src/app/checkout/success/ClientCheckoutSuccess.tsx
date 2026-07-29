"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { fbqTrack } from '@/lib/fbpixel';

interface Props {
  sessionId?: string | null;
  paymentIntentId?: string | null;
}

export default function ClientCheckoutSuccess({ sessionId, paymentIntentId }: Props) {
  const { clearCart } = useCart();
  const { t } = useLanguage();
  const [confirmationStatus, setConfirmationStatus] = useState<string>('');
  const [confirmationError, setConfirmationError] = useState<string>('');

  useEffect(() => {
    clearCart();
    sessionStorage.setItem('checkoutCompleted', 'true');
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId && !paymentIntentId) return;

    async function sendConfirmation() {
      try {
        const response = await fetch('/api/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentIntentId ? { paymentIntentId } : { sessionId }),
        });

        const result = await response.json();

        if (!response.ok) {
          setConfirmationError(result.error || t('checkoutResult.confErr'));
          return;
        }

        setConfirmationStatus(result.message || t('checkoutResult.confOk'));

        // Fire the Meta Pixel Purchase event once per order.
        const orderKey = paymentIntentId || sessionId || '';
        const firedKey = `fb_purchase_${orderKey}`;
        if (orderKey && !sessionStorage.getItem(firedKey)) {
          fbqTrack('Purchase', {
            value: typeof result.value === 'number' ? result.value : undefined,
            currency: result.currency || 'SEK',
          });
          sessionStorage.setItem(firedKey, '1');
        }
      } catch (error: any) {
        setConfirmationError(error?.message || t('checkoutResult.confErrGeneric'));
      }
    }

    sendConfirmation();
  }, [sessionId, paymentIntentId]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <Icon name="CheckCircle2" size={32} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">{t('checkoutResult.orderDone')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('checkoutResult.thankYou')}
          </p>

          <div className="bg-muted rounded-lg p-4 mb-4 text-sm text-muted-foreground">
            <p>{t('checkoutResult.checkInbox')}</p>
            {confirmationStatus && <p className="mt-2 text-sm text-emerald-700">{confirmationStatus}</p>}
            {confirmationError && <p className="mt-2 text-sm text-rose-600">{confirmationError}</p>}
          </div>

          <Link href="/" className="btn-primary inline-flex gap-2">
            {t('checkoutResult.backHome')}
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
