// Small client-side helper for firing Meta Pixel standard events.
// No-ops safely if the pixel hasn't loaded (SSR, ad-blockers, etc.).

export function fbqTrack(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', event, params || {});
  }
}
