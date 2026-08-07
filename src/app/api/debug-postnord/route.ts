import { NextRequest, NextResponse } from 'next/server';
import { postnordServiceCode } from '@/lib/postnord.server';

// TEMPORARY diagnostic — shows which PostNord service code the live code picks.
// Gated by the admin password. Remove after debugging.
export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export async function GET(req: NextRequest) {
  if ((req.nextUrl.searchParams.get('key') || '') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    env: {
      POSTNORD_SERVICE_CODE: process.env.POSTNORD_SERVICE_CODE || '(not set → auto)',
      POSTNORD_APPLICATION_ID: process.env.POSTNORD_APPLICATION_ID || '(not set → 2624)',
    },
    computed: {
      SE_1bottle_0_17kg: postnordServiceCode('SE', 0.17),
      SE_6pack_0_57kg: postnordServiceCode('SE', 0.57),
      SE_heavy_4kg: postnordServiceCode('SE', 4),
      NO_0_17kg: postnordServiceCode('NO', 0.17),
    },
    note: '30 = MyPack Home Small (home/letterbox), 19 = MyPack Collect (service point)',
  });
}
