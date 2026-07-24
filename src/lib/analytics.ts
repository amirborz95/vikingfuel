import path from 'path';
import { readData, writeData } from './dataStore';

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
  return readData<T>(path.basename(filePath), [] as unknown as T);
}

async function writeJson(filePath: string, data: any) {
  await writeData(path.basename(filePath), data);
}

export async function readAnalytics(): Promise<AnalyticsVisit[]> {
  return await readJson<AnalyticsVisit[]>(analyticsFile);
}

export async function appendAnalyticsVisit(entry: AnalyticsVisit) {
  const visits = await readAnalytics();
  visits.push(entry);
  await writeJson(analyticsFile, visits);
}
