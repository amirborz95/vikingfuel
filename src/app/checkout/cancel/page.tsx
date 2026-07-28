'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutCancelPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <Icon name="XCircle" size={32} className="text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">{t('checkoutResult.cancelTitle')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('checkoutResult.cancelSub')}
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/checkout" className="btn-primary">
              {t('checkoutResult.tryAgain')}
            </Link>
            <Link href="/products" className="btn-outline">
              {t('checkoutResult.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
