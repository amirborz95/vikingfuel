import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
declare module '../styles/tailwind.css';
import '../styles/tailwind.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import NewsletterPopup from '@/app/components/NewsletterPopup';
import MetaPixel from '@/components/MetaPixel';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo';

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
  title: 'Viking Fuel — Kosttillskott för Energi & Testo-support',
  description:
    'Viking Fuel — naturligt energitillskott och testo-support för energi, uthållighet och fokus. Slut på att vara trött på eftermiddagen. Tillverkat i EU. Fri frakt över 700 kr.',
  keywords: [
    'energitillskott',
    'kosttillskott energi',
    'testo support',
    'energy boost',
    'naturligt kosttillskott',
    'trött på eftermiddagen',
    'kosttillskott utan koffein',
    'Viking Fuel',
    'maca ashwagandha ginseng',
  ],
  icons: {
    icon: [{ url: '/viking_logo_nav.png', type: 'image/png' }],
  },
  verification: {
    google: 'DDAyKo3-3mG30fkdenXj22Md4pecav43TqSZINU9SEU',
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
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <MetaPixel />
              <AnalyticsTracker />
              {children}
              <NewsletterPopup />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
