import path from 'path';
import { readData, writeData } from './dataStore';

const dataDir = path.join(process.cwd(), 'data');
const analyticsFile = path.join(dataDir, 'analytics.json');

/** Keep the log bounded — old visits are already summarised in the dashboard. */
const MAX_VISITS = 50000;

export interface AnalyticsVisit {
  type: 'page-view';
  page: string;
  path: string;
  email: string;
  timestamp: string;
  /** Anonymous per-browser id (cookie) so unique visitors can be counted. */
  visitorId?: string;
  referrer?: string;
  device?: 'mobile' | 'tablet' | 'desktop';
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
  await writeJson(analyticsFile, visits.length > MAX_VISITS ? visits.slice(-MAX_VISITS) : visits);
}
