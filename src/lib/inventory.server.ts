import fs from 'fs/promises';
import path from 'path';
import { MAX_STOCK } from './inventory';

const dataDir = path.join(process.cwd(), 'data');
const inventoryFile = path.join(dataDir, 'inventory.json');

export interface InventoryState {
  remainingUnits: number;
}

async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null as unknown as T;
  }
}

async function writeJson(filePath: string, data: any) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
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
