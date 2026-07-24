// Netlify Scheduled Function — runs automatically on a schedule and asks the
// app to check PostNord tracking for all un-shipped orders. When a parcel has
// been scanned/handed in, the app auto-marks it shipped and emails the customer.

export default async function handler() {
  const base = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se';
  const secret = process.env.CRON_SECRET || '';

  try {
    const res = await fetch(`${base}/api/cron/poll-shipments`, {
      method: 'POST',
      headers: { 'x-cron-secret': secret },
    });
    const body = await res.json().catch(() => ({}));
    console.log('poll-shipments:', res.status, JSON.stringify(body));
  } catch (e) {
    console.error('poll-shipments scheduled call failed:', e);
  }

  return new Response('ok');
}

// Every 15 minutes.
export const config = {
  schedule: '*/15 * * * *',
};
