const apiKey = process.env.POSTNORD_API_KEY || '';
const rawApiBaseUrl = process.env.POSTNORD_API_BASE_URL || 'https://api2.postnord.com';
const apiBaseUrl = rawApiBaseUrl.replace(/\/rest\/?$/, '');

// PostNord shipment statuses that mean the parcel has NOT yet physically entered
// the network (label created / pre-advised only). Anything else = it has been
// scanned/handed in and is on its way => treat as "shipped".
const NOT_YET_SHIPPED = ['INFORMED', 'CREATED', 'OTHER', ''];

export interface TrackingStatus {
  found: boolean;
  status: string; // raw PostNord status, e.g. INFORMED / EN_ROUTE / DELIVERED
  shipped: boolean;
  statusText: string;
  latestEvent?: { time?: string; description?: string };
}

export async function getShipmentTrackingStatus(trackingNumber: string): Promise<TrackingStatus> {
  const empty: TrackingStatus = { found: false, status: '', shipped: false, statusText: '' };
  if (!apiKey || !trackingNumber) return empty;

  const url = `${apiBaseUrl}/rest/shipment/v5/trackandtrace/findByIdentifier.json?apikey=${encodeURIComponent(
    apiKey
  )}&id=${encodeURIComponent(trackingNumber)}&locale=sv`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch (e) {
    console.error('PostNord tracking fetch failed:', e);
    return empty;
  }

  if (!res.ok) {
    console.warn(`PostNord tracking HTTP ${res.status} for ${trackingNumber}`);
    return empty;
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    return empty;
  }

  const shipment = data?.TrackingInformationResponse?.shipments?.[0];
  if (!shipment) return empty;

  const status = String(shipment.status || '').toUpperCase();
  const shipped = !NOT_YET_SHIPPED.includes(status);

  const events = shipment.items?.[0]?.events || [];
  const latest = events[events.length - 1] || events[0];

  return {
    found: true,
    status,
    shipped,
    statusText: shipment.statusText?.header || '',
    latestEvent: latest
      ? { time: latest.eventTime, description: latest.eventDescription }
      : undefined,
  };
}
