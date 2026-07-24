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
