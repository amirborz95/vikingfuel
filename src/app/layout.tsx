import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
declare module '../styles/tailwind.css';
import '../styles/tailwind.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import NewsletterPopup from '@/app/components/NewsletterPopup';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Viking Fuel — Premium Kosttillskott för Daglig Prestation',
  description:
    'Viking Fuel erbjuder premium kosttillskott med naturliga ingredienser för energi, uthållighet och prestationsstöd. Tillverkat i EU. Fri frakt över 700 kr.',
  icons: {
    icon: [{ url: '/viking_logo_nav.png', type: 'image/png' }],
  },
  openGraph: {
    title: 'Viking Fuel — Premium Kosttillskott',
    description: 'Nordiska premiumtillskott för daglig prestation.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <AuthProvider>
          <CartProvider>
            <AnalyticsTracker />
            {children}
            <NewsletterPopup />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
