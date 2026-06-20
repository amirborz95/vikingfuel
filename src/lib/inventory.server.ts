import { getStore } from '@netlify/blobs';
import { MAX_STOCK } from './inventory';
import seed from '../../data/inventory.json';

const STORE_NAME = 'inventory';
const STATE_KEY = 'state';

export interface InventoryState {
  remainingUnits: number;
}

function clamp(value: number) {
  return Math.max(0, Math.min(MAX_STOCK, value));
}

// Counter data: use strong consistency for immediate read-after-write.
function inventoryStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

function seedValue(): number {
  const fromSeed = (seed as { remainingUnits?: unknown })?.remainingUnits;
  return typeof fromSeed === 'number' ? clamp(fromSeed) : MAX_STOCK;
}

export async function getInventoryState(): Promise<InventoryState> {
  const saved = (await inventoryStore().get(STATE_KEY, {
    type: 'json',
  })) as InventoryState | null;

  if (!saved || typeof saved.remainingUnits !== 'number') {
    return { remainingUnits: seedValue() };
  }
  return { remainingUnits: clamp(saved.remainingUnits) };
}

export async function adjustInventoryUnits(delta: number): Promise<InventoryState> {
  const inventory = await getInventoryState();
  const nextValue = inventory.remainingUnits + delta;

  if (nextValue < 0) {
    throw new Error('Inte tillräckligt lager kvar');
  }

  const nextInventory = { remainingUnits: clamp(nextValue) };
  await inventoryStore().setJSON(STATE_KEY, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
