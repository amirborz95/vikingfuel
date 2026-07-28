'use client';

import React from 'react';

/**
 * Self-contained payment-method badges (no network dependency).
 * Shows exactly the methods Viking Fuel accepts: Visa, Mastercard, Card,
 * PayPal, Apple Pay and Google Pay.
 */

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-9 min-w-[54px] items-center justify-center rounded-lg border border-border bg-white px-2.5 shadow-sm"
      role="img"
      aria-label={label}
    >
      {children}
    </span>
  );
}

function Visa() {
  return (
    <svg viewBox="0 0 48 16" className="h-3.5 w-auto" aria-hidden="true">
      <text x="0" y="13" fill="#1A1F71" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic" letterSpacing="0.5">
        VISA
      </text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 40 24" className="h-5 w-auto" aria-hidden="true">
      <circle cx="15" cy="12" r="9" fill="#EB001B" />
      <circle cx="25" cy="12" r="9" fill="#F79E1B" />
      <path d="M20 5a9 9 0 0 1 0 14 9 9 0 0 1 0-14z" fill="#FF5F00" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 32 22" className="h-5 w-auto" aria-hidden="true">
      <rect x="1" y="2" width="30" height="18" rx="3" fill="#334155" />
      <rect x="1" y="6" width="30" height="4" fill="#0f172a" />
      <rect x="4" y="14" width="9" height="3" rx="1" fill="#cbd5e1" />
      <rect x="22" y="13" width="6" height="4" rx="1" fill="#f59e0b" />
    </svg>
  );
}

function PayPal() {
  return (
    <svg viewBox="0 0 60 16" className="h-3.5 w-auto" aria-hidden="true">
      <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="800" fontStyle="italic">
        <tspan fill="#253B80">Pay</tspan><tspan fill="#179BD7">Pal</tspan>
      </text>
    </svg>
  );
}

function ApplePay() {
  return (
    <svg viewBox="0 0 62 22" className="h-4 w-auto" aria-hidden="true">
      <g fill="#000000">
        <path d="M11.7 6.1c-.6 0-1.5.7-2 .7-.5 0-1.3-.66-2.2-.65-1.13.02-2.17.66-2.74 1.67-1.17 2.03-.3 5.04.84 6.7.55.8 1.2 1.7 2.07 1.68.83-.03 1.15-.54 2.16-.54 1 0 1.29.54 2.17.52.9-.02 1.47-.82 2.02-1.63.64-.94.9-1.85.92-1.9-.02-.01-1.77-.68-1.78-2.7-.02-1.68 1.37-2.49 1.44-2.53-.79-1.16-2.01-1.28-2.44-1.31-.56-.05-1.03.22-1.63.22z"/>
        <path d="M12.64 4.42c.47-.56.78-1.34.7-2.11-.67.03-1.48.44-1.97 1.01-.43.49-.8 1.29-.7 2.05.75.06 1.5-.39 1.97-.95z"/>
      </g>
      <text x="19" y="16" fill="#000000" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600">Pay</text>
    </svg>
  );
}

function GooglePay() {
  return (
    <svg viewBox="0 0 66 24" className="h-4 w-auto" aria-hidden="true">
      <g transform="translate(0,1) scale(0.46)">
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
      </g>
      <text x="26" y="17" fill="#5F6368" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600">Pay</text>
    </svg>
  );
}

const methods: { label: string; render: () => React.ReactNode }[] = [
  { label: 'Visa', render: Visa },
  { label: 'Mastercard', render: Mastercard },
  { label: 'Card', render: CardIcon },
  { label: 'PayPal', render: PayPal },
  { label: 'Apple Pay', render: ApplePay },
  { label: 'Google Pay', render: GooglePay },
];

export default function PaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {methods.map((m) => (
        <Tile key={m.label} label={m.label}>
          {m.render()}
        </Tile>
      ))}
    </div>
  );
}
