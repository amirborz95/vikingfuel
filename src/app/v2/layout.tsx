import React from 'react';
import type { Metadata } from 'next';
import './v2.css';

export const metadata: Metadata = {
  title: 'Viking Fuel — +Testo-Support | Nordiskt premiumtillskott',
  description:
    'Kraft som byggs varje dag. +Testo-Support — 60 kapslar med zink, magnesium och D-vitamin för energi, hormonbalans och prestation. Tillverkad i EU.',
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className="vf-root vf-grain font-ui antialiased">{children}</div>;
}
