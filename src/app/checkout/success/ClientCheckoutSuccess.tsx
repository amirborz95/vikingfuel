"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { fbqTrack } from '@/lib/fbpixel';
import { UPSELL, UPSELL_TOTAL } from '@/lib/upsell';

interface Props {
  sessionId?: string | null;
  paymentIntentId?: string | null;
  isSubscription?: boolean;
  subscriptionId?: string | null;
}

export default function ClientCheckoutSuccess({ sessionId, paymentIntentId, isSubscription, subscriptionId }: Props) {
  const { clearCart } = useCart();
  const { t, lang } = useLanguage();
  const en = lang === 'en';
  const [confirmationStatus, setConfirmationStatus] = useState<string>('');
  const [confirmationError, setConfirmationError] = useState<string>('');

  // Upsell: only for one-time embedded (PaymentIntent) orders — never for
  // subscriptions (a one-off extra charge doesn't belong on a subscription).
  const upsellKey = paymentIntentId ? `upsell_${paymentIntentId}` : '';
  const [upsellPhase, setUpsellPhase] = useState<'na' | 'offer' | 'processing' | 'accepted' | 'declined'>('na');
  const [upsellError, setUpsellError] = useState('');

  useEffect(() => {
    clearCart();
    sessionStorage.setItem('checkoutCompleted', 'true');
    if (paymentIntentId && !isSubscription && !sessionStorage.getItem(upsellKey)) {
      setUpsellPhase('offer');
    }
  }, [clearCart, paymentIntentId, isSubscription, upsellKey]);

  useEffect(() => {
    if (!sessionId && !paymentIntentId && !subscriptionId) return;
    async function sendConfirmation() {
      try {
        const payload = isSubscription && subscriptionId
          ? { subscriptionId }
          : paymentIntentId
            ? { paymentIntentId }
            : { sessionId };
        const response = await fetch('/api/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
          setConfirmationError(result.error || t('checkoutResult.confErr'));
          return;
        }
        setConfirmationStatus(result.message || t('checkoutResult.confOk'));
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
  }, [sessionId, paymentIntentId, isSubscription, subscriptionId]);

  async function acceptUpsell() {
    setUpsellError('');
    setUpsellPhase('processing');
    try {
      const res = await fetch('/api/upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem(upsellKey, 'accepted');
        setUpsellPhase('accepted');
      } else {
        setUpsellError(data.message || (en ? 'Could not add — card was not charged.' : 'Kunde inte lägga till — kortet debiterades inte.'));
        setUpsellPhase('offer');
      }
    } catch {
      setUpsellError(en ? 'Something went wrong.' : 'Något gick fel.');
      setUpsellPhase('offer');
    }
  }

  function declineUpsell() {
    if (upsellKey) sessionStorage.setItem(upsellKey, 'declined');
    setUpsellPhase('declined');
  }

  // ── Upsell offer (shown before the thank-you) ──
  if (upsellPhase === 'offer' || upsellPhase === 'processing') {
    const busy = upsellPhase === 'processing';
    return (
      <div className="min-h-screen bg-muted pt-24 pb-12">
        <div className="container-wide">
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-card">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
              🎉 {en ? 'Payment complete' : 'Betalning klar'}
            </p>
            <h1 className="mt-3 text-2xl font-extrabold text-foreground">
              {en ? 'Wait — one last offer!' : 'Vänta — ett sista erbjudande!'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {en
                ? `Add ${UPSELL.bottles} more bottles for just ${UPSELL.pricePerBottle} kr each. One click — no new payment needed.`
                : `Lägg till ${UPSELL.bottles} burkar till för bara ${UPSELL.pricePerBottle} kr styck. Ett klick — ingen ny betalning behövs.`}
            </p>

            <div className="my-6 flex items-center justify-center gap-4 rounded-xl bg-muted p-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                <Image src={UPSELL.image} alt={UPSELL.productName} width={80} height={80} className="h-full w-full object-contain p-1" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">{UPSELL.bottles}× {en ? 'extra bottles' : 'extra burkar'}</p>
                <p className="text-sm">
                  <span className="font-bold text-primary">{UPSELL.pricePerBottle} kr/{en ? 'ea' : 'st'}</span>{' '}
                  <span className="text-muted-foreground line-through">{UPSELL.normalPerBottle} kr</span>
                </p>
                <p className="text-xs text-muted-foreground">{en ? 'Total' : 'Totalt'}: {UPSELL_TOTAL} kr</p>
              </div>
            </div>

            {upsellError && <p className="mb-3 text-sm text-rose-600">{upsellError}</p>}

            <button
              onClick={acceptUpsell}
              disabled={busy}
              className="w-full rounded-xl bg-primary px-5 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95 disabled:opacity-50"
            >
              {busy
                ? (en ? 'Adding…' : 'Lägger till…')
                : (en ? `Yes, add for ${UPSELL_TOTAL} kr` : `Ja tack, lägg till för ${UPSELL_TOTAL} kr`)}
            </button>
            <button onClick={declineUpsell} disabled={busy} className="mt-3 w-full text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50">
              {en ? 'No thanks, continue' : 'Nej tack, fortsätt'}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Icon name="LockClosedIcon" size={12} /> {en ? 'Charged to the card you just used.' : 'Debiteras kortet du precis använde.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Thank-you ──
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
          <p className="text-muted-foreground mb-6">{t('checkoutResult.thankYou')}</p>

          {isSubscription && (
            <div className="mb-4 rounded-lg bg-accent p-3 text-sm font-semibold text-primary">
              {en
                ? 'Your subscription is active — we ship a new package every month. Cancel anytime from your account.'
                : 'Din prenumeration är aktiv — vi skickar en ny försändelse varje månad. Avsluta när du vill från ditt konto.'}
            </div>
          )}

          {upsellPhase === 'accepted' && (
            <div className="mb-4 rounded-lg bg-accent p-3 text-sm font-semibold text-primary">
              {en ? `${UPSELL.bottles} extra bottles added to your order! 🎉` : `${UPSELL.bottles} extra burkar tillagda i din order! 🎉`}
            </div>
          )}

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
