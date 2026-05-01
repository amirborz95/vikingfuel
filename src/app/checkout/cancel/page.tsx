'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <Icon name="XCircle" size={32} className="text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Betalning avbruten</h1>
          <p className="text-muted-foreground mb-6">
            Betalningen avbröts. Dina varor finns kvar i varukorgen.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/checkout" className="btn-primary">
              Försök igen
            </Link>
            <Link href="/products" className="btn-outline">
              Fortsätt handla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
