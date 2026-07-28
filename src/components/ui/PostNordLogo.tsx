'use client';

import React from 'react';

/**
 * Self-contained PostNord carrier badge (no network dependency).
 * Brand blue rounded tile with the "postnord" wordmark — used to brand the
 * PostNord shipping option in checkout.
 */
export default function PostNordLogo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-[#0099D8] px-3 py-2 shadow-sm ${className}`}
      aria-label="PostNord"
    >
      <svg
        viewBox="0 0 168 30"
        role="img"
        aria-hidden="true"
        className="h-4 w-auto"
      >
        <text
          x="0"
          y="24"
          fill="#ffffff"
          fontFamily="var(--font-plus-jakarta-sans), Arial, sans-serif"
          fontSize="30"
          fontWeight="800"
          letterSpacing="-1.2"
        >
          postnord
        </text>
      </svg>
    </span>
  );
}
