import React from 'react';

interface PaymentIconProps {
  name: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function PaymentIcon({ name, className = '', width = 72, height = 28 }: PaymentIconProps) {
  const key = (name || '').toLowerCase();

  if (key === 'visa') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 72 28"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Visa"
      >
        <rect width="72" height="28" rx="6" fill="#0B5EA6" />
        <g transform="translate(6,4)">
          <path d="M6 18 L12 6 L18 18 Z" fill="#fff" opacity="0.95" />
          <text x="26" y="17.5" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700">VISA</text>
        </g>
      </svg>
    );
  }

  if (key === 'mastercard') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 72 28"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Mastercard"
      >
        <rect width="72" height="28" rx="6" fill="#ffffff" />
        <g transform="translate(10,4)">
          <circle cx="14" cy="10" r="8" fill="#EB001B" />
          <circle cx="26" cy="10" r="8" fill="#F79E1B" />
        </g>
        <text x="44" y="18" fill="#111827" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="600">mastercard</text>
      </svg>
    );
  }

  if (key === 'klarna') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 72 28"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Klarna"
      >
        <rect width="72" height="28" rx="6" fill="#FF53A0" />
        <text x="12" y="19" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700">klarna</text>
      </svg>
    );
  }

  if (key === 'google pay' || key === 'googlepay' || key === 'gpay' || key === 'google') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 28"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Google Pay"
      >
        <rect width="100" height="28" rx="6" fill="transparent" />
        <g transform="translate(6,4) scale(0.9)">
          <g>
            <path d="M6.5 8.2c0-1.1.9-2 2-2h1.8v1.8H9.1c-.6 0-1.1.5-1.1 1.1s.5 1.1 1.1 1.1h2.7c0 .7-.1 1.3-.3 1.8-.2.5-.5.9-.9 1.2-.4.3-.9.5-1.6.5-1 0-1.8-.4-2.5-1.2l1.1-1.2c.3.4.6.6 1.1.6.3 0 .6-.1.8-.3.2-.2.4-.5.4-.9V8.2H6.5z" fill="#4285F4" />
            <path d="M15 3.4c1.2 0 2.1.4 2.8 1.2l-1.1 1.3c-.4-.3-.9-.6-1.6-.6-1 0-1.8.4-2.5 1.2l-1.1-1.2C12 4 13.3 3.4 15 3.4z" fill="#34A853" />
            <path d="M15 3.4c1.2 0 2.1.4 2.8 1.2l1.4-1.6C18.4 2 16.9 1.6 15 1.6 13.3 1.6 12 2 11 3l1.1 1.2C12.9 3 14 3.4 15 3.4z" fill="#FBBC05" />
            <path d="M6.5 8.2l1.9 0c0 0 0 0 0 0l.1.1c.2.6.4 1 .9 1.4.5.4 1.1.6 1.8.6.7 0 1.3-.2 1.8-.6.5-.4.7-.8.9-1.4H6.5z" fill="#EA4335" opacity="0" />
          </g>
        </g>
        <text x="44" y="19" fill="#111827" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="600">Pay</text>
      </svg>
    );
  }

  // Fallback neutral badge
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 72 28"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={name}
    >
      <rect width="72" height="28" rx="6" fill="#F3F4F6" />
      <text x="12" y="18" fill="#111827" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700">{name}</text>
    </svg>
  );
}
