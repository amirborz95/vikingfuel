"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';

interface Props {
  sessionId?: string | null;
}

export default function ClientCheckoutSuccess({ sessionId }: Props) {
  const { clearCart } = useCart();
  const [confirmationStatus, setConfirmationStatus] = useState<string>('');
  const [confirmationError, setConfirmationError] = useState<string>('');

  useEffect(() => {
    clearCart();
    sessionStorage.setItem('checkoutCompleted', 'true');
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) return;

    async function sendConfirmation() {
      try {
        const response = await fetch('/api/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();

        if (!response.ok) {
          setConfirmationError(result.error || 'Kunde inte skicka orderbekräftelse.');
          return;
        }

        setConfirmationStatus(result.message || 'Orderbekräftelse har skickats till din e-post.');
      } catch (error: any) {
        setConfirmationError(error?.message || 'Något gick fel vid försök att skicka orderbekräftelse.');
      }
    }

    sendConfirmation();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <Icon name="CheckCircle2" size={32} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Beställning genomförd!</h1>
          <p className="text-muted-foreground mb-6">
            Tack för ditt köp. Stripe skickar automatiskt orderbekräftelse och kvitto till din e-post.
          </p>

          <div className="bg-muted rounded-lg p-4 mb-4 text-sm text-muted-foreground">
            <p>Kontrollera din inkorg för e-post från Stripe eller Vikingfuel.</p>
            {confirmationStatus && <p className="mt-2 text-sm text-emerald-700">{confirmationStatus}</p>}
            {confirmationError && <p className="mt-2 text-sm text-rose-600">{confirmationError}</p>}
          </div>

          <Link href="/" className="btn-primary inline-flex gap-2">
            Tillbaka till startsida
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
