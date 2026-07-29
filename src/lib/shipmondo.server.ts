// ─────────────────────────────────────────────────────────────────────────
// SHIPMONDO CLIENT — books shipments and fetches labels via the Shipmondo
// public API v3 (one integration, many carriers: DHL, Earlybird, Budbee/
// Instabox, DB Schenker, …).
//
// Docs: https://shipmondo.dev  ·  Base: https://app.shipmondo.com/api/public/v3
// Auth: HTTP Basic (API user + API key from Shipmondo → Settings → API).
//
// Required env vars:
//   SHIPMONDO_API_USER, SHIPMONDO_API_KEY
//   SHIPMONDO_SENDER_NAME, SHIPMONDO_SENDER_ADDRESS1, SHIPMONDO_SENDER_POSTCODE,
//   SHIPMONDO_SENDER_CITY, SHIPMONDO_SENDER_COUNTRY (default SE),
//   SHIPMONDO_SENDER_EMAIL, SHIPMONDO_SENDER_PHONE
//     (sender falls back to POSTNORD_SENDER_* when the SHIPMONDO_* ones are unset)
//   SHIPMONDO_PRODUCT_<CARRIER>  — per-carrier product_code (see carriers.ts)
// Optional:
//   SHIPMONDO_OWN_AGREEMENT (true/false, default false — use Shipmondo's rates)
//   SHIPMONDO_SERVICE_CODES  — comma-separated default service codes (e.g. EMAIL_NT)
// ─────────────────────────────────────────────────────────────────────────

const API_BASE = 'https://app.shipmondo.com/api/public/v3';

const apiUser = process.env.SHIPMONDO_API_USER || '';
const apiKey = process.env.SHIPMONDO_API_KEY || '';

const sender = {
  name: process.env.SHIPMONDO_SENDER_NAME || process.env.POSTNORD_SENDER_NAME || '',
  address1: process.env.SHIPMONDO_SENDER_ADDRESS1 || process.env.POSTNORD_SENDER_ADDRESS_LINE1 || '',
  postcode: process.env.SHIPMONDO_SENDER_POSTCODE || process.env.POSTNORD_SENDER_POSTCODE || '',
  city: process.env.SHIPMONDO_SENDER_CITY || process.env.POSTNORD_SENDER_CITY || '',
  country: process.env.SHIPMONDO_SENDER_COUNTRY || process.env.POSTNORD_SENDER_COUNTRY || 'SE',
  email: process.env.SHIPMONDO_SENDER_EMAIL || '',
  phone: process.env.SHIPMONDO_SENDER_PHONE || '',
};

const ownAgreement = process.env.SHIPMONDO_OWN_AGREEMENT === 'true';
const defaultServiceCodes = process.env.SHIPMONDO_SERVICE_CODES || '';

export function isShipmondoConfigured(): boolean {
  return Boolean(apiUser && apiKey);
}

function authHeader(): string {
  return 'Basic ' + Buffer.from(`${apiUser}:${apiKey}`).toString('base64');
}

export interface CreateShipmondoShipmentArgs {
  orderId: string;
  productCode: string; // Shipmondo product_code for the chosen carrier
  serviceCodes?: string;
  weightGrams?: number;
  customerEmail: string;
  recipient: {
    name?: string | null;
    phone?: string | null;
    address: {
      line1?: string | null;
      line2?: string | null;
      postal_code?: string | null;
      city?: string | null;
      country?: string | null;
    };
  };
}

export interface ShipmondoShipmentResult {
  shipmentId: string;
  trackingNumber?: string;
  rawResponse: any;
}

/**
 * Book a shipment through Shipmondo. Returns the shipment id + tracking number,
 * or null if Shipmondo isn't configured. The label PDF is fetched separately
 * (auth-protected) via getShipmondoLabelPdf().
 */
export async function createShipmondoShipment(
  args: CreateShipmondoShipmentArgs
): Promise<ShipmondoShipmentResult | null> {
  if (!isShipmondoConfigured()) {
    console.warn('Shipmondo not configured (SHIPMONDO_API_USER / SHIPMONDO_API_KEY missing).');
    return null;
  }
  if (!args.productCode) {
    throw new Error('Missing Shipmondo product_code for the selected carrier.');
  }
  if (!sender.name || !sender.address1 || !sender.postcode || !sender.city) {
    throw new Error('Shipmondo sender address is not configured via environment variables.');
  }

  const body: any = {
    own_agreement: ownAgreement,
    product_code: args.productCode,
    reference: `Order ${args.orderId}`,
    parcels: [{ weight: args.weightGrams && args.weightGrams > 0 ? args.weightGrams : 1000 }],
    parties: [
      {
        type: 'sender',
        name: sender.name,
        address1: sender.address1,
        postal_code: sender.postcode,
        city: sender.city,
        country_code: sender.country,
        email: sender.email || undefined,
        phone: sender.phone || undefined,
      },
      {
        type: 'receiver',
        name: args.recipient.name || 'Kund',
        address1: args.recipient.address.line1 || '',
        address2: args.recipient.address.line2 || undefined,
        postal_code: args.recipient.address.postal_code || '',
        city: args.recipient.address.city || '',
        country_code: args.recipient.address.country || 'SE',
        email: args.customerEmail || undefined,
        phone: args.recipient.phone || undefined,
      },
    ],
  };

  const serviceCodes = args.serviceCodes || defaultServiceCodes;
  if (serviceCodes) body.service_codes = serviceCodes;

  const res = await fetch(`${API_BASE}/shipments`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not JSON */
  }

  if (!res.ok) {
    console.error('❌ Shipmondo create shipment failed:', res.status, text);
    throw new Error((json && (json.message || json.error)) || `Shipmondo API error: ${res.status}`);
  }

  // Defensive extraction — Shipmondo returns the created shipment object.
  const shipmentId = String(json?.id ?? json?.shipment?.id ?? '');
  const trackingNumber =
    json?.package_number ||
    json?.tracking_number ||
    json?.shipment?.package_number ||
    (Array.isArray(json?.parcels) ? json.parcels[0]?.package_number : undefined) ||
    undefined;

  if (!shipmentId) {
    console.error('❌ Shipmondo response missing shipment id:', json ?? text);
    throw new Error('Shipmondo did not return a shipment id.');
  }

  return { shipmentId, trackingNumber, rawResponse: json ?? text };
}

/**
 * Download a shipment's label as a PDF (Buffer). Auth-protected, so it must be
 * proxied through our own server route — never linked directly to the client.
 */
export async function getShipmondoLabelPdf(shipmentId: string): Promise<Buffer> {
  if (!isShipmondoConfigured()) throw new Error('Shipmondo not configured.');

  const res = await fetch(
    `${API_BASE}/shipments/${encodeURIComponent(shipmentId)}/label?file_format=pdf`,
    {
      method: 'GET',
      headers: { Authorization: authHeader(), Accept: 'application/pdf' },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('❌ Shipmondo label fetch failed:', res.status, text);
    throw new Error(`Shipmondo label error: ${res.status}`);
  }

  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}
