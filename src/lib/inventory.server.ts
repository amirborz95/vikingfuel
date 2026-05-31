import { getStore } from '@netlify/blobs';
import { MAX_STOCK } from './inventory';

// Inventory is persisted in Netlify Blobs. The previous implementation wrote to
// the local filesystem, which is read-only in Netlify's serverless runtime and
// caused checkout to fail with "Kunde inte reservera lagret". Blobs is durable
// across deploys and writable at runtime.
const STORE_NAME = 'vikingfuel-inventory';
const KEY = 'state';

// Stock level at the time of migration, used to seed the store on first read.
const INITIAL_REMAINING_UNITS = 294;

export interface InventoryState {
  remainingUnits: number;
}

function getInventoryStore() {
  // Strong consistency so a reserve immediately reflects the latest value.
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_STOCK, value));
}

export async function getInventoryState(): Promise<InventoryState> {
  try {
    const store = getInventoryStore();
    const saved = await store.get(KEY, { type: 'json' });
    if (!saved || typeof saved.remainingUnits !== 'number') {
      return { remainingUnits: INITIAL_REMAINING_UNITS };
    }
    return { remainingUnits: clamp(saved.remainingUnits) };
  } catch (error) {
    console.error('Failed to read inventory from Blobs:', error);
    return { remainingUnits: INITIAL_REMAINING_UNITS };
  }
}

export async function adjustInventoryUnits(delta: number): Promise<InventoryState> {
  const store = getInventoryStore();
  const current = await getInventoryState();
  const nextValue = current.remainingUnits + delta;

  if (nextValue < 0) {
    throw new Error('Inte tillräckligt lager kvar');
  }

  const nextInventory: InventoryState = { remainingUnits: clamp(nextValue) };
  await store.setJSON(KEY, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
