import { getStore } from '@netlify/blobs';

// Seed data imported statically so Next.js's file tracer bundles it into the
// serverless function. (A dynamic fs read of `data/*.json` would not be traced
// and the files could be missing at runtime — losing the existing inventory
// count and user accounts.) These committed JSON files represent the state at
// the time of migration and are only used the first time a key is read, before
// anything has been written to Blobs.
import usersSeed from '../../data/users.json';
import inventorySeed from '../../data/inventory.json';
import sessionsSeed from '../../data/sessions.json';
import authLogsSeed from '../../data/authLogs.json';
import waitlistSeed from '../../data/waitlist.json';
import analyticsSeed from '../../data/analytics.json';

/**
 * Persistent JSON store backed by Netlify Blobs.
 *
 * The app previously read and wrote JSON files under `data/`. That works in
 * local development, but on Netlify the serverless filesystem is read-only
 * (except `/tmp`) and ephemeral, so every write threw and nothing persisted —
 * which is why checkout, order saving and the admin panel silently failed.
 *
 * Netlify Blobs is a zero-config, site-scoped object store that persists across
 * deploys. Each logical collection (users, sessions, inventory, …) is stored as
 * a single JSON document, matching how the rest of the code reads/modifies/writes
 * the whole collection at once. Strong consistency is used so a write is
 * immediately visible to the next read (important for the inventory counter and
 * for reading an order back right after it is saved).
 */

const STORE_NAME = 'vikingfuel-data';

const SEEDS: Record<string, unknown> = {
  users: usersSeed,
  inventory: inventorySeed,
  sessions: sessionsSeed,
  authLogs: authLogsSeed,
  waitlist: waitlistSeed,
  analytics: analyticsSeed,
};

function getDataStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

/**
 * Read a JSON document from the store. Falls back to the committed seed data the
 * first time (before anything has been written), then to `fallback`.
 */
export async function readData<T>(key: string, fallback: T): Promise<T> {
  try {
    const store = getDataStore();
    const value = await store.get(key, { type: 'json' });
    if (value !== null && value !== undefined) {
      return value as T;
    }
  } catch (err) {
    // Blobs may be unavailable in some contexts (e.g. plain `next dev` without
    // the Netlify dev server). Fall through to the seed / fallback so the app
    // keeps working in development.
    console.warn(`Blobs read failed for "${key}", falling back to seed data:`, err);
  }

  const seed = SEEDS[key];
  return (seed !== undefined ? (seed as T) : fallback);
}

/** Write a JSON document to the store. */
export async function writeData(key: string, data: unknown): Promise<void> {
  const store = getDataStore();
  await store.setJSON(key, data);
}
