import type { AnalyticsVisit } from './analytics';

/**
 * Turns the raw page-view log into the numbers the admin dashboard shows:
 * how many people came in today / this week / this month, which pages they
 * looked at, and which page they landed on first.
 */

export type RangeKey = 'today' | 'week' | 'month' | 'all';

/** A new visit starts when a browser has been idle for this long. */
const SESSION_GAP_MS = 30 * 60 * 1000;

export interface CountRow {
  key: string;
  views: number;
  visitors: number;
}

export interface RangeSummary {
  key: RangeKey;
  label: string;
  from: string | null;
  visits: number;          // page views
  visitors: number;        // unique browsers
  sessions: number;        // separate visits (30 min idle = new one)
  pages: CountRow[];       // every page, most viewed first
  entryPages: CountRow[];  // the page each visit started on
  countries: CountRow[];
  referrers: CountRow[];
  devices: CountRow[];
  daily: { date: string; visits: number; visitors: number }[];
}

export interface RecentVisit {
  timestamp: string;
  path: string;
  page: string;
  email: string;
  visitor: string;
  country: string | null;
  city: string | null;
  device: string | null;
  referrer: string | null;
}

/**
 * One browser. Visits recorded before the visitor cookie existed have no id, so
 * they fall back to the logged-in email, and anonymous ones are approximated by
 * their 30-minute window — otherwise every old visit would collapse into a
 * single "visitor" and the historic numbers would read as 1.
 */
function visitorKey(v: AnalyticsVisit): string {
  if (v.visitorId) return v.visitorId;
  if (v.email && v.email !== 'anonymous') return `email:${v.email}`;
  const bucket = Math.floor(new Date(v.timestamp).getTime() / SESSION_GAP_MS);
  return `anon:${bucket}`;
}

function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function toRows(map: Map<string, { views: number; visitors: Set<string> }>): CountRow[] {
  return Array.from(map.entries())
    .map(([key, v]) => ({ key, views: v.views, visitors: v.visitors.size }))
    .sort((a, b) => b.views - a.views || a.key.localeCompare(b.key));
}

function bump(
  map: Map<string, { views: number; visitors: Set<string> }>,
  key: string,
  visitor: string
) {
  const row = map.get(key) || { views: 0, visitors: new Set<string>() };
  row.views += 1;
  row.visitors.add(visitor);
  map.set(key, row);
}

function summarise(key: RangeKey, label: string, from: Date | null, visits: AnalyticsVisit[]): RangeSummary {
  const inRange = from ? visits.filter((v) => new Date(v.timestamp) >= from) : visits;

  const pages = new Map<string, { views: number; visitors: Set<string> }>();
  const countries = new Map<string, { views: number; visitors: Set<string> }>();
  const referrers = new Map<string, { views: number; visitors: Set<string> }>();
  const devices = new Map<string, { views: number; visitors: Set<string> }>();
  const entries = new Map<string, { views: number; visitors: Set<string> }>();
  const daily = new Map<string, { visits: number; visitors: Set<string> }>();
  const visitors = new Set<string>();

  // Walk in time order so the first hit of each visit is the entry page.
  const ordered = [...inRange].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const lastSeen = new Map<string, number>();
  let sessions = 0;

  for (const v of ordered) {
    const visitor = visitorKey(v);
    const at = new Date(v.timestamp).getTime();
    visitors.add(visitor);

    bump(pages, v.path || '/', visitor);
    if (v.country) bump(countries, v.country, visitor);
    bump(referrers, v.referrer || 'Okänd', visitor);
    bump(devices, v.device || 'okänd', visitor);

    const prev = lastSeen.get(visitor);
    if (prev === undefined || at - prev > SESSION_GAP_MS) {
      sessions += 1;
      bump(entries, v.path || '/', visitor);
    }
    lastSeen.set(visitor, at);

    const d = dayKey(v.timestamp);
    const day = daily.get(d) || { visits: 0, visitors: new Set<string>() };
    day.visits += 1;
    day.visitors.add(visitor);
    daily.set(d, day);
  }

  return {
    key,
    label,
    from: from ? from.toISOString() : null,
    visits: inRange.length,
    visitors: visitors.size,
    sessions,
    pages: toRows(pages),
    entryPages: toRows(entries).sort((a, b) => b.visitors - a.visitors || b.views - a.views),
    countries: toRows(countries),
    referrers: toRows(referrers),
    devices: toRows(devices),
    daily: Array.from(daily.entries())
      .map(([date, v]) => ({ date, visits: v.visits, visitors: v.visitors.size }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export interface AnalyticsSummary {
  ranges: Record<RangeKey, RangeSummary>;
  recent: RecentVisit[];
  totalVisits: number;
  /** Our own visits, recorded but left out of every number above. */
  excludedVisits: number;
  firstVisit: string | null;
  lastVisit: string | null;
}

/** Our own browsing: flagged by the staff cookie, or anything under /admin. */
function isInternal(v: AnalyticsVisit): boolean {
  return v.internal === true || (v.path || '').startsWith('/admin');
}

export function buildAnalyticsSummary(visits: AnalyticsVisit[], recentLimit = 500): AnalyticsSummary {
  const all = visits.filter((v) => v.type === 'page-view' && v.timestamp);
  // The dashboard should show customers only — never the owner's own clicking.
  const pageViews = all.filter((v) => !isInternal(v));
  const excludedVisits = all.length - pageViews.length;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  weekAgo.setHours(0, 0, 0, 0);
  const monthAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  monthAgo.setHours(0, 0, 0, 0);

  const ordered = [...pageViews].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    ranges: {
      today: summarise('today', 'Idag', startOfToday, pageViews),
      week: summarise('week', '7 dagar', weekAgo, pageViews),
      month: summarise('month', '30 dagar', monthAgo, pageViews),
      all: summarise('all', 'Allt', null, pageViews),
    },
    recent: ordered.slice(0, recentLimit).map((v) => ({
      timestamp: v.timestamp,
      path: v.path || '/',
      page: v.page || v.path || '',
      email: v.email || 'anonymous',
      visitor: visitorKey(v),
      country: v.country || null,
      city: v.city || null,
      device: v.device || null,
      referrer: v.referrer || null,
    })),
    totalVisits: pageViews.length,
    excludedVisits,
    firstVisit: ordered.length ? ordered[ordered.length - 1].timestamp : null,
    lastVisit: ordered.length ? ordered[0].timestamp : null,
  };
}
