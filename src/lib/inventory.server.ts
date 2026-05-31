import fs from 'fs/promises';
import path from 'path';
import { getStore } from '@netlify/blobs';
import { MAX_STOCK } from './inventory';

// Inventory is a single small counter document that is read and written as a
// whole, so it lives in Netlify Blobs. The previous implementation wrote to a
// local JSON file, which fails at runtime because the serverless filesystem is
// read-only — that failure was what made checkout return
// "Kunde inte reservera lagret. Försök igen.".
const STORE_NAME = 'inventory';
const STATE_KEY = 'state';

export interface InventoryState {
  remainingUnits: number;
}

function clamp(value: number) {
  return Math.max(0, Math.min(MAX_STOCK, value));
}

function getInventoryStore() {
  // Strong consistency so a read immediately reflects the last reservation.
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

// First-run seed: preserve the stock level previously committed in
// data/inventory.json so existing sold counts carry over to the blob store.
async function readSeedValue(): Promise<number> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), 'data', 'inventory.json'),
      'utf-8'
    );
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.remainingUnits === 'number') {
      return clamp(parsed.remainingUnits);
    }
  } catch {
    // Ignore — fall back to full stock below.
  }
  return MAX_STOCK;
}

export async function getInventoryState(): Promise<InventoryState> {
  const store = getInventoryStore();
  const saved = (await store.get(STATE_KEY, { type: 'json' })) as
    | InventoryState
    | null;

  if (!saved || typeof saved.remainingUnits !== 'number') {
    return { remainingUnits: await readSeedValue() };
  }

  return { remainingUnits: clamp(saved.remainingUnits) };
}

export async function adjustInventoryUnits(delta: number): Promise<InventoryState> {
  const store = getInventoryStore();
  const inventory = await getInventoryState();
  const nextValue = inventory.remainingUnits + delta;

  if (nextValue < 0) {
    throw new Error('Inte tillräckligt lager kvar');
  }

  const nextInventory = { remainingUnits: clamp(nextValue) };
  await store.setJSON(STATE_KEY, nextInventory);
  return nextInventory;
}

export async function reserveUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(-units);
}

export async function restoreUnits(units: number): Promise<InventoryState> {
  return await adjustInventoryUnits(units);
}
