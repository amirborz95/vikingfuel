import path from 'path';
import { MAX_STOCK } from './inventory';
import { readData, writeData } from './dataStore';

const dataDir = path.join(process.cwd(), 'data');
const inventoryFile = path.join(dataDir, 'inventory.json');

export interface InventoryState {
  remainingUnits: number;
}

async function readJson<T = any>(filePath: string): Promise<T> {
  return readData<T>(path.basename(filePath), null as unknown as T);
}

async function writeJson(filePath: string, data: any) {
  await writeData(path.basename(filePath), data);
}

export async function getInventoryState(): Promise<InventoryState> {
  const saved = await readJson<InventoryState>(inventoryFile);
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
  await writeJson(inventoryFile, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
