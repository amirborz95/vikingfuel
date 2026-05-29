'use client';

import React from 'react';
import AppImage from './AppImage';

const logos = [
  {
    src: 'https://i.postimg.cc/Lnyyd6RK/9113e9f347e43eb67e9ff42779934451676342d8.png',
    alt: 'Säkra betalningar',
    width: 144,
    height: 26,
  },
  {
    src: 'https://i.postimg.cc/fJHH4TsG/Google-Pay-Logo-width-500-format-webp.webp',
    alt: 'Google Pay',
    width: 84,
    height: 24,
  },
  {
    src: 'https://i.postimg.cc/KR99XvFb/Logo-Visa.avif',
    alt: 'Visa',
    width: 72,
    height: 24,
  },
  {
    src: 'https://i.postimg.cc/KR99XvFX/Mastercard-Logo.png',
    alt: 'Mastercard',
    width: 72,
    height: 24,
  },
];

export default function PaymentLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
      {logos.map((logo) => (
        <AppImage
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="h-auto w-auto max-h-6 sm:max-h-7"
        />
      ))}
    </div>
  );
}
