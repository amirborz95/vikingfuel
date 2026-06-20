import { getStore } from '@netlify/blobs';
import { MAX_STOCK } from './inventory';

const INVENTORY_STORE = 'inventory';
const INVENTORY_KEY = 'state';

export interface InventoryState {
  remainingUnits: number;
}

function getInventoryStore() {
  // Strong consistency so reserved stock is read back immediately (this is a counter).
  return getStore({ name: INVENTORY_STORE, consistency: 'strong' });
}

export async function getInventoryState(): Promise<InventoryState> {
  try {
    const store = getInventoryStore();
    const saved = (await store.get(INVENTORY_KEY, { type: 'json' })) as InventoryState | null;
    if (!saved || typeof saved.remainingUnits !== 'number') {
      return { remainingUnits: MAX_STOCK };
    }
    return { remainingUnits: Math.max(0, Math.min(MAX_STOCK, saved.remainingUnits)) };
  } catch (error) {
    console.error('Failed to read inventory state:', error);
    return { remainingUnits: MAX_STOCK };
  }
}

export async function adjustInventoryUnits(delta: number): Promise<InventoryState> {
  const store = getInventoryStore();
  const inventory = await getInventoryState();
  const nextValue = inventory.remainingUnits + delta;

  if (nextValue < 0) {
    throw new Error('Inte tillräckligt lager kvar');
  }

  const nextInventory = {
    remainingUnits: Math.max(0, Math.min(MAX_STOCK, nextValue)),
  };
  await store.setJSON(INVENTORY_KEY, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
