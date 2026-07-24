import { NextRequest, NextResponse } from 'next/server';
import { pollAndUpdateShipments } from '@/lib/shipmentPolling';

const CRON_SECRET = process.env.CRON_SECRET || '';

/**
 * Checks PostNord tracking for un-shipped orders and auto-marks shipped +
 * emails the customer. Called on a schedule by the Netlify scheduled function,
 * and can also be triggered on-demand from the admin panel.
 */
async function handle(req: NextRequest) {
  const provided =
    req.headers.get('x-cron-secret') ||
    new URL(req.url).searchParams.get('secret') ||
    '';

  if (CRON_SECRET && provided !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pollAndUpdateShipments();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    console.error('poll-shipments error:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'poll failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}
