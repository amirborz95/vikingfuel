import fs from 'fs/promises';
import path from 'path';
import { getStore } from '@netlify/blobs';
import { MAX_STOCK } from './inventory';

// Inventory is a single stock counter that must persist across requests and
// deploys. Netlify's serverless filesystem is read-only, so it cannot be stored
// in a local JSON file — it lives in Netlify Blobs with strong consistency so
// reservations are visible immediately after they are written.
const STORE_NAME = 'inventory';
const INVENTORY_KEY = 'state';

// Legacy seed value from the file-based store, used only to initialise the blob
// the first time so the previously tracked stock count carries over.
const dataDir = path.join(process.cwd(), 'data');
const inventoryFile = path.join(dataDir, 'inventory.json');

export interface InventoryState {
  remainingUnits: number;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_STOCK, value));
}

function getInventoryStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

async function readSeedFromFile(): Promise<number> {
  try {
    const raw = await fs.readFile(inventoryFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.remainingUnits === 'number') {
      return clamp(parsed.remainingUnits);
    }
  } catch {
    // No legacy file (or unreadable) — fall back to full stock.
  }
  return MAX_STOCK;
}

export async function getInventoryState(): Promise<InventoryState> {
  const store = getInventoryStore();
  const saved = await store.get(INVENTORY_KEY, { type: 'json' });

  if (saved && typeof (saved as InventoryState).remainingUnits === 'number') {
    return { remainingUnits: clamp((saved as InventoryState).remainingUnits) };
  }

  // First run: seed the blob from the legacy file value (or full stock).
  const seeded = { remainingUnits: await readSeedFromFile() };
  await store.setJSON(INVENTORY_KEY, seeded);
  return seeded;
}

export async function adjustInventoryUnits(delta: number): Promise<InventoryState> {
  const store = getInventoryStore();
  const current = await getInventoryState();
  const nextValue = current.remainingUnits + delta;

  if (nextValue < 0) {
    throw new Error('Inte tillräckligt lager kvar');
  }

  const nextInventory = { remainingUnits: clamp(nextValue) };
  await store.setJSON(INVENTORY_KEY, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
