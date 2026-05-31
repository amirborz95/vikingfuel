import { NextResponse } from 'next/server';
import { getInventoryState } from '@/lib/inventory.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const inventory = await getInventoryState();
  return NextResponse.json({
    remainingUnits: inventory.remainingUnits,
    maxStock: 300,
    soldUnits: 300 - inventory.remainingUnits,
  });
}
