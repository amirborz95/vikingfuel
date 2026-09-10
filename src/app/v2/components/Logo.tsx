import React from 'react';

/**
 * The mark + wordmark lockup. One component so the nav, preloader and footer
 * can never drift apart.
 */
export default function Logo({
  tone = 'forest',
  size = 'md',
  markOnly = false,
}: {
  tone?: 'forest' | 'birch';
  size?: 'sm' | 'md' | 'lg';
  markOnly?: boolean;
}) {
  const mark = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
  const type = { sm: 'text-[14px]', md: 'text-[19px]', lg: 'text-[28px]' }[size];
  const color = tone === 'birch' ? 'text-birch' : 'text-forest';

  return (
    <span className={`inline-flex items-center gap-3 ${color}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/viking_logo_nav.png"
        alt=""
        aria-hidden
        className={`${mark} shrink-0 object-contain ${tone === 'birch' ? 'brightness-0 invert' : ''}`}
      />
      {!markOnly && (
        <span className={`font-display uppercase leading-none tracking-[0.3em] ${type}`}>Viking&nbsp;Fuel</span>
      )}
    </span>
  );
}
