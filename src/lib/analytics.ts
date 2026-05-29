import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const analyticsFile = path.join(dataDir, 'analytics.json');

export interface AnalyticsVisit {
  type: 'page-view';
  page: string;
  path: string;
  email: string;
  timestamp: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return [] as unknown as T;
  }
}

async function writeJson(filePath: string, data: any) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readAnalytics(): Promise<AnalyticsVisit[]> {
  return await readJson<AnalyticsVisit[]>(analyticsFile);
}

export async function appendAnalyticsVisit(entry: AnalyticsVisit) {
  const visits = await readAnalytics();
  visits.push(entry);
  await writeJson(analyticsFile, visits);
}
