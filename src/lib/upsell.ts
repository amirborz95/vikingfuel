// Post-purchase one-click upsell shown right after payment, before the thank-you
// page. Charges the card that was just used — no re-entry (Stripe off_session).

export const UPSELL = {
  bottles: 2, // extra bottles offered
  pricePerBottle: 249, // SEK (genuine discount off the normal single price)
  normalPerBottle: 349, // real single-bottle price (truthful reference)
  productName: 'Viking Fuel — Testo-support',
  image: '/assets/images/viking-energy-1e.png',
};

// Authoritative total in SEK, computed server-side — never trust the client.
export const UPSELL_TOTAL = UPSELL.bottles * UPSELL.pricePerBottle; // 498
export const UPSELL_TOTAL_CENTS = UPSELL_TOTAL * 100;
