import { MAX_STOCK } from './inventory';
import { readData, writeData } from './store';

const INVENTORY_KEY = 'inventory';

export interface InventoryState {
  remainingUnits: number;
}

export async function getInventoryState(): Promise<InventoryState> {
  const saved = await readData<InventoryState | null>(INVENTORY_KEY, null);
  if (!saved || typeof saved.remainingUnits !== 'number') {
    return { remainingUnits: MAX_STOCK };
  }
  return { remainingUnits: Math.max(0, Math.min(MAX_STOCK, saved.remainingUnits)) };
}

export async function adjustInventoryUnits(delta: number): Promise<InventoryState> {
  const inventory = await getInventoryState();
  const nextValue = inventory.remainingUnits + delta;

  if (nextValue < 0) {
    throw new Error('Inte tillräckligt lager kvar');
  }

  const nextInventory = {
    remainingUnits: Math.max(0, Math.min(MAX_STOCK, nextValue)),
  };
  await writeData(INVENTORY_KEY, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
