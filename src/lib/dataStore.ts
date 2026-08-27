import path from 'path';
import fs from 'fs/promises';

/**
 * Shared persistence layer.
 *
 * - On Netlify (production / `netlify dev`): data is stored in Netlify Blobs, which
 *   is shared across all serverless function instances and survives deploys.
 * - Locally (`next dev`): data is read/written to the `data/` folder on disk.
 *
 * On the first production read of a given key (before anything has been written to
 * Blobs), we seed from the committed `data/<name>.json` file that ships with the
 * deployment, so existing users / inventory / etc. are preserved.
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_NAME = 'vikingfuel-data';

// Netlify sets NETLIFY=true in its build + function runtime. NETLIFY_BLOBS_CONTEXT
// is present whenever a Blobs-capable context is injected (incl. `netlify dev`).
const useBlobs =
  process.env.NETLIFY === 'true' || !!process.env.NETLIFY_BLOBS_CONTEXT;

async function getBlobStore() {
  const { getStore } = await import('@netlify/blobs');
  return getStore(STORE_NAME);
}

/** Read the committed seed file that ships with the deployment (read-only in prod). */
async function readSeed<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, name), 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readData<T>(name: string, fallback: T): Promise<T> {
  if (useBlobs) {
    try {
      const store = await getBlobStore();
      const val = await store.get(name, { type: 'json' });
      if (val === null || val === undefined) {
        // Nothing written to Blobs yet — seed from the committed file.
        return await readSeed<T>(name, fallback);
      }
      return val as T;
    } catch (err) {
      console.error(`[dataStore] Blob read failed for "${name}", using seed:`, err);
      return await readSeed<T>(name, fallback);
    }
  }
  return await readSeed<T>(name, fallback);
}

export async function writeData(name: string, data: unknown): Promise<void> {
  if (useBlobs) {
    const store = await getBlobStore();
    await store.setJSON(name, data);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, name),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ONE-SHOT CLAIMS
//
// The Stripe webhook and the success page both finalize the same order, at
// almost the same moment. A plain "does the order exist yet?" check can't stop
// that: both read before either writes, so both booked a PostNord label and
// both mailed the owner. A claim lets exactly one of them do each side effect.
//
// Locally that's an atomic exclusive file create. On Blobs (no conditional
// writes in @netlify/blobs v8) we write our token, let a concurrent writer
// land, then read back with STRONG consistency — only the caller whose token
// survived owns the claim, everyone else backs off.
// ─────────────────────────────────────────────────────────────────────────

const CLAIM_SETTLE_MS = 1200;
/** How long a claim blocks retries. After this a failed attempt may retry. */
const CLAIM_TTL_MS = 10 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Try to claim `name` exactly once. Returns true for the single winner, false
 * for every other caller racing for the same claim.
 */
export async function claimOnce(name: string, ttlMs: number = CLAIM_TTL_MS): Promise<boolean> {
  const key = `claim_${name}.json`;
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (!useBlobs) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const file = path.join(DATA_DIR, key);
    try {
      // 'wx' fails if the file exists — atomic, so only one caller gets through.
      await fs.writeFile(file, JSON.stringify({ token, ts: Date.now() }), { flag: 'wx' });
      return true;
    } catch (err: any) {
      if (err?.code !== 'EEXIST') throw err;
      try {
        const prev = JSON.parse(await fs.readFile(file, 'utf-8'));
        if (Date.now() - (prev?.ts || 0) > ttlMs) {
          await fs.writeFile(file, JSON.stringify({ token, ts: Date.now() }), 'utf-8');
          return true;
        }
      } catch {
        /* unreadable claim — treat as held */
      }
      return false;
    }
  }

  try {
    const store = await getBlobStore();
    const held = await store
      .get(key, { type: 'json', consistency: 'strong' })
      .catch(() => null);
    if (held && Date.now() - (held.ts || 0) < ttlMs) return false;

    await store.setJSON(key, { token, ts: Date.now() });
    await sleep(CLAIM_SETTLE_MS);

    const after = await store
      .get(key, { type: 'json', consistency: 'strong' })
      .catch(() => null);
    return !!after && after.token === token;
  } catch (err) {
    // Never let claim bookkeeping break an order: fall through and do the work.
    console.error(`[dataStore] claim "${name}" failed, proceeding:`, err);
    return true;
  }
}
