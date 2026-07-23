import { readData, writeData } from './store';

const ANALYTICS_KEY = 'analytics';

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

export async function readAnalytics(): Promise<AnalyticsVisit[]> {
  return await readData<AnalyticsVisit[]>(ANALYTICS_KEY, []);
}

export async function appendAnalyticsVisit(entry: AnalyticsVisit) {
  const visits = await readAnalytics();
  visits.push(entry);
  await writeData(ANALYTICS_KEY, visits);
}
