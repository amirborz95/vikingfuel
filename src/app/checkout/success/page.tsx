'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    sessionStorage.setItem('checkoutCompleted', 'true');
  }, [clearCart]);

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

          <div className="bg-muted rounded-lg p-4 mb-8 text-sm text-muted-foreground">
            <p>Kontrollera din inkorg för e-post från Stripe eller Vikingfuel.</p>
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

