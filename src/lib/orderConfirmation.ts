import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { getCarrier } from './carriers';
import {
  buildOrderConfirmationHtml,
  buildShippingHtml,
  type EmailItem,
} from './emailTemplates';

/**
 * Carrier-aware view of a stored order: is it a pickup, what's the brand label
 * and the tracking number (works for PostNord and every Shipmondo carrier).
 */
function orderShipping(order: any): { isPickup: boolean; brand: string; tracking: string | null } {
  const carrier = getCarrier(order?.carrier);
  const provider =
    order?.carrierProvider ||
    carrier?.provider ||
    (String(order?.shippingOption || '').toLowerCase() === 'postnord' ? 'postnord' : 'pickup');
  const brand = order?.shippingOption || carrier?.brand || (provider === 'postnord' ? 'PostNord' : 'Uthämtning');
  const tracking = order?.postnordTracking || order?.shipmondoTracking || null;
  return { isPickup: provider === 'pickup', brand, tracking };
}

function normalizeItems(items: any[]): EmailItem[] {
  return (items || []).map((it) => ({
    name: it.name || 'Produkt',
    quantity: it.quantity || 1,
    price: typeof it.price === 'number' ? it.price : 0,
  }));
}

function storedOrderShippingDetail(order: any, method: 'postnord' | 'pickup'): string {
  if (method !== 'postnord') return getPickupAddressText();
  const addr = order.shippingAddress?.address
    ? Object.values(order.shippingAddress.address).filter(Boolean).join(', ')
    : '';
  return addr || 'Adress enligt beställning';
}

// Some hosts (e.g. Netlify) keep the surrounding quotes when you paste an env
// value like "Vikingfuel <info@vikingfuel.se>", which produces a malformed
// From header that Gmail silently drops. Strip a single pair of wrapping quotes.
function unquote(v: string): string {
  const t = (v || '').trim();
  if (t.length >= 2 && ((t[0] === '"' && t.endsWith('"')) || (t[0] === "'" && t.endsWith("'")))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const smtpHost = unquote(process.env.SMTP_HOST || '');
const smtpPort = Number(unquote(process.env.SMTP_PORT || '587'));
const smtpUser = unquote(process.env.SMTP_USER || '');
const smtpPass = process.env.SMTP_PASS || '';
const senderEmail = unquote(process.env.ORDER_CONFIRMATION_SENDER || '') || `Vikingfuel <${smtpUser || 'info@vikingfuel.se'}>`;
const replyToEmail = unquote(process.env.ORDER_CONFIRMATION_REPLY_TO || '') || smtpUser || 'info@vikingfuel.se';
// Business owner gets a notification on every new order.
const orderNotificationRecipient = unquote(process.env.ORDER_NOTIFICATION_RECIPIENT || '') || 'smartval.se@gmail.com';

if (!stripeSecret) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2026-04-22.dahlia',
});

function formatAmount(amountInCents: number) {
  return (amountInCents / 100).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getPickupAddressText() {
  return 'Mältarevägen 31\n34235 Alvesta\nSweden';
}

function getLineItemName(item: Stripe.LineItem) {
  return (
    item.description ||
    item.price?.product?.name ||
    item.price?.product?.toString() ||
    item.price_data?.product_data?.name ||
    'Produkt'
  );
}

function normalizeShippingOption(value?: string | null) {
  if (!value) return 'pickup';
  const normalized = value.toLowerCase();
  return normalized === 'postnord' ? 'postnord' : 'pickup';
}

function buildEmailText(session: Stripe.Checkout.Session) {
  const lineItems = session.line_items?.data || [];
  const itemsText = lineItems
    .map((item) => {
      const name = getLineItemName(item);
      const quantity = item.quantity || 1;
      const total = item.amount_total || 0;
      return `• ${name} x${quantity} — ${formatAmount(total)} kr`;
    })
    .join('\n');

  const taxAmount = session.total_details?.amount_tax || 0;
  const totalAmount = session.amount_total || 0;
  const customerEmail = session.customer_email || 'Okänd e-post';
  const shippingMethod = normalizeShippingOption(
    session.metadata?.shipping_option || session.metadata?.shipping_option_label
  );
  const shippingOptionLabel = shippingMethod === 'postnord' ? 'PostNord' : 'Uthämtning';
  const shippingPostcode = session.metadata?.shipping_postcode || '';
  const shippingDetailsLine = shippingMethod === 'postnord'
    ? `Postnummer: ${shippingPostcode || 'Ej angivet'}`
    : `Hämtningsadress:\n${getPickupAddressText()}`;

  return `Hej!\n\nTack för din beställning hos Vikingfuel. Här är ditt kvitto och orderbekräftelse på svenska.\n\nOrdernummer: ${session.id}\nE-post: ${customerEmail}\n\nLeveransalternativ: ${shippingOptionLabel}\n${shippingDetailsLine}\nOrderdetaljer:\n${itemsText}\n\nMoms (6%): ${formatAmount(taxAmount)} kr\nTotal att betala: ${formatAmount(totalAmount)} kr\n\nVi meddelar dig när din order har skickats.\n\nTack för att du handlar hos Vikingfuel!\n\nMed vänlig hälsning,\nVikingfuel\n`;
}

function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP is not configured');
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function retrieveCheckoutSession(sessionId: string) {
  if (!stripeSecret) {
    throw new Error('Stripe is not configured');
  }

  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });
}

export async function sendOrderConfirmationEmail(session: Stripe.Checkout.Session) {
  if (!session.customer_email) {
    throw new Error('Customer email not found on session');
  }

  if (session.metadata?.confirmation_sent === 'true') {
    return { skipped: true };
  }

  const transporter = getTransporter();

  const method = normalizeShippingOption(
    session.metadata?.shipping_option || session.metadata?.shipping_option_label
  );
  const items: EmailItem[] = (session.line_items?.data || []).map((item) => ({
    name: getLineItemName(item),
    quantity: item.quantity || 1,
    price: (item.price?.unit_amount || 0) / 100,
  }));
  const shippingDetail =
    method === 'postnord'
      ? `Postnummer: ${session.metadata?.shipping_postcode || 'Ej angivet'}`
      : getPickupAddressText();

  const html = buildOrderConfirmationHtml({
    orderId: session.id,
    customerName: session.customer_details?.name || undefined,
    items,
    totalInCents: session.amount_total || 0,
    taxInCents: session.total_details?.amount_tax || 0,
    shippingLabel: method === 'postnord' ? 'PostNord' : 'Uthämtning',
    shippingDetail,
  });

  const mailOptions = {
    from: senderEmail,
    to: session.customer_email,
    replyTo: replyToEmail,
    subject: 'Tack för din beställning hos Vikingfuel',
    text: buildEmailText(session),
    html,
  };

  await transporter.sendMail(mailOptions);

  if (session.id) {
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        confirmation_sent: 'true',
      },
    });
  }

  return { skipped: false };
}

export async function sendOrderConfirmationEmailForSessionId(sessionId: string) {
  const session = await retrieveCheckoutSession(sessionId);
  return sendOrderConfirmationEmail(session);
}

/**
 * Notify the business owner that a new order has come in.
 * Sent once per order (from order creation).
 */
export async function sendNewOrderAdminNotification(order: any, customerEmail: string) {
  const transporter = getTransporter();

  const itemsText = (order.items || [])
    .map((it: any) => `• ${it.name} x${it.quantity} — ${formatAmount((it.price || 0) * (it.quantity || 1) * 100)} kr`)
    .join('\n');

  const { isPickup, brand } = orderShipping(order);
  const shippingLabel = brand;
  const address = order.shippingAddress?.address
    ? Object.values(order.shippingAddress.address).filter(Boolean).join(', ')
    : isPickup
      ? 'Uthämtning (ingen adress)'
      : 'Ingen adress angiven';

  const totalText = formatAmount((order.totalAmount || 0) * 100);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se';

  const text = `Ny order mottagen på Vikingfuel!\n\nOrdernummer: ${order.id}\nKund: ${order.shippingAddress?.name || 'Okänd'} <${customerEmail}>\nTelefon: ${order.shippingAddress?.phone || order.billingAddress?.phone || 'Ej angivet'}\nLeveranssätt: ${shippingLabel}\nAdress: ${address}\n\nProdukter:\n${itemsText}\n\nTotalt: ${totalText} kr\n\nHantera ordern i adminpanelen: ${siteUrl}/admin\n`;

  await transporter.sendMail({
    from: senderEmail,
    to: orderNotificationRecipient,
    replyTo: customerEmail,
    subject: `Ny order: ${totalText} kr — ${order.shippingAddress?.name || customerEmail}`,
    text,
  });

  return { sent: true };
}

export function buildOrderConfirmationTextFromStoredOrder(order: any, recipientEmail: string) {
  const itemsText = (order.items || [])
    .map((item: any) => `• ${item.name} x${item.quantity} — ${formatAmount(item.price * (item.quantity || 1) * 100)} kr`)
    .join('\n');

  const shippingMethod = normalizeShippingOption(order.shippingOption);
  const shippingOptionLabel = shippingMethod === 'postnord' ? 'PostNord' : 'Uthämtning';
  const shippingAddress = order.shippingAddress?.address
    ? Object.entries(order.shippingAddress.address)
        .filter(([, value]) => !!value)
        .map(([key, value]) => `${value}`)
        .join(', ')
    : '';
  const shippingDetailsLine = shippingMethod === 'postnord'
    ? `Leveransadress: ${shippingAddress || 'Ej angiven'}`
    : `Hämtningsadress:\n${getPickupAddressText()}`;

  return `Hej!\n\nTack för din beställning hos Vikingfuel. Här är din orderbekräftelse.\n\nOrdernummer: ${order.id}\nE-post: ${recipientEmail}\n\nLeveransalternativ: ${shippingOptionLabel}\n${shippingDetailsLine}\nOrderdetaljer:\n${itemsText}\n\nTotal att betala: ${formatAmount((order.totalAmount || 0) * 100)} kr\n\nVi meddelar dig när din order har skickats.\n\nMed vänlig hälsning,\nVikingfuel\n`;
}

export async function sendOrderConfirmationEmailForStoredOrder(order: any, recipientEmail: string) {
  if (!recipientEmail) {
    throw new Error('Recipient email is required for order confirmation');
  }

  const method = normalizeShippingOption(order.shippingOption);
  const transporter = getTransporter();
  await transporter.sendMail({
    from: senderEmail,
    to: recipientEmail,
    replyTo: replyToEmail,
    subject: 'Tack för din beställning hos Vikingfuel',
    text: buildOrderConfirmationTextFromStoredOrder(order, recipientEmail),
    html: buildOrderConfirmationHtml({
      orderId: order.id,
      customerName: order.shippingAddress?.name || undefined,
      items: normalizeItems(order.items),
      totalInCents: (order.totalAmount || 0) * 100,
      shippingLabel: method === 'postnord' ? 'PostNord' : 'Uthämtning',
      shippingDetail: storedOrderShippingDetail(order, method),
    }),
  });
  return { sent: true };
}

export function buildShippingNotificationTextFromStoredOrder(order: any, recipientEmail: string, tracking?: string) {
  const { isPickup, brand } = orderShipping(order);
  if (isPickup) {
    return `Hej!\n\nDin beställning ${order.id} är redo för uthämtning.\n\nOrdernummer: ${order.id}\nE-post: ${recipientEmail}\n\nHämtningsadress:\n${getPickupAddressText()}\n\nVänligen hämta din order enligt överenskommelse.\n\nMed vänlig hälsning,\nVikingfuel\n`;
  }

  const trackingText = tracking || orderShipping(order).tracking || 'Ej tillgängligt';
  return `Hej!\n\nDin beställning ${order.id} har skickats med ${brand}.\n\nOrdernummer: ${order.id}\nE-post: ${recipientEmail}\nSpårningsnummer: ${trackingText}\n\nDu kan följa din försändelse hos ${brand} med numret ovan.\n\nMed vänlig hälsning,\nVikingfuel\n`;
}

export async function sendShippingNotificationForStoredOrder(order: any, recipientEmail: string, tracking?: string) {
  if (!recipientEmail) {
    throw new Error('Recipient email is required for shipping notification');
  }

  const { isPickup, brand, tracking: orderTracking } = orderShipping(order);
  const detailMethod: 'postnord' | 'pickup' = isPickup ? 'pickup' : 'postnord';
  const transporter = getTransporter();
  await transporter.sendMail({
    from: senderEmail,
    to: recipientEmail,
    replyTo: replyToEmail,
    subject: isPickup
      ? 'Din beställning är redo för uthämtning'
      : 'Din beställning har skickats — spårningsnummer',
    text: buildShippingNotificationTextFromStoredOrder(order, recipientEmail, tracking),
    html: buildShippingHtml({
      orderId: order.id,
      customerName: order.shippingAddress?.name || undefined,
      items: normalizeItems(order.items),
      totalInCents: (order.totalAmount || 0) * 100,
      shippingLabel: brand,
      shippingDetail: storedOrderShippingDetail(order, detailMethod),
      tracking: tracking || orderTracking,
      isPostNord: !isPickup,
    }),
  });
  return { sent: true };
}

export async function sendShippingNotificationForSessionId(sessionId: string) {
  const session = await retrieveCheckoutSession(sessionId);
  const shippingMethod = normalizeShippingOption(session.metadata?.shipping_option || session.metadata?.shipping_option_label);

  if (shippingMethod !== 'postnord') {
    if (!session.customer_email) {
      throw new Error('Customer email not found on session');
    }

    const transporter = getTransporter();
    await transporter.sendMail({
      from: senderEmail,
      to: session.customer_email,
      replyTo: replyToEmail,
      subject: 'Din beställning är redo för uthämtning',
      text: `Hej!\n\nDin beställning ${session.id} är redo för uthämtning.\n\nVänligen hämta din order enligt överenskommelse.\n\nMed vänlig hälsning,\nVikingfuel`,
    });
    return { sent: true };
  }

  const postNordShipmentId = session.metadata?.postnord_shipment_id || '';
  const tracking = session.metadata?.postnord_tracking || '';
  const labelUrl = session.metadata?.postnord_label_url || session.metadata?.postnord_label_pdf_url || '';

  if (!session.customer_email) {
    throw new Error('Customer email not found on session');
  }

  const transporter = getTransporter();
  const mailOptions = {
    from: senderEmail,
    to: session.customer_email,
    replyTo: replyToEmail,
    subject: 'Din beställning har skickats — spårningsnummer',
    text: `Hej!\n\nDin beställning ${session.id} har skickats via PostNord.\n${postNordShipmentId ? `PostNord-nummer: ${postNordShipmentId}\n` : ''}${tracking ? `Spårningsnummer: ${tracking}\n` : 'Spårningsnummer: Ej tillgängligt\n'}${labelUrl ? `Fraktsedel: ${labelUrl}\n` : ''}Du kan följa din försändelse på PostNords spårningssida med detta nummer.\n\nMed vänlig hälsning,\nVikingfuel`,
  };

  await transporter.sendMail(mailOptions);
  return { sent: true };
}
