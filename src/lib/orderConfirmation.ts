import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT || '587');
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const senderEmail = process.env.ORDER_CONFIRMATION_SENDER || `Vikingfuel <${smtpUser || 'info@vikingfuel.se'}>`;
const replyToEmail = process.env.ORDER_CONFIRMATION_REPLY_TO || smtpUser || 'info@vikingfuel.se';

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

export function isSmtpConfigured() {
  return Boolean(smtpHost && smtpUser && smtpPass);
}

const SMTP_MISSING_MESSAGE =
  'E-postutskick är inte konfigurerat. Lägg till miljövariablerna SMTP_HOST, SMTP_PORT, SMTP_USER och SMTP_PASS i Netlify för att aktivera order- och leveransmejl.';

function getTransporter() {
  if (!isSmtpConfigured()) {
    throw new Error(SMTP_MISSING_MESSAGE);
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
  const mailOptions = {
    from: senderEmail,
    to: session.customer_email,
    replyTo: replyToEmail,
    subject: 'Orderbekräftelse och kvitto från Vikingfuel',
    text: buildEmailText(session),
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

  const transporter = getTransporter();
  await transporter.sendMail({
    from: senderEmail,
    to: recipientEmail,
    replyTo: replyToEmail,
    subject: 'Orderbekräftelse och kvitto från Vikingfuel',
    text: buildOrderConfirmationTextFromStoredOrder(order, recipientEmail),
  });
  return { sent: true };
}

export function buildShippingNotificationTextFromStoredOrder(order: any, recipientEmail: string, tracking?: string) {
  const shippingMethod = normalizeShippingOption(order.shippingOption);
  if (shippingMethod !== 'postnord') {
    return `Hej!\n\nDin beställning ${order.id} är redo för uthämtning.\n\nOrdernummer: ${order.id}\nE-post: ${recipientEmail}\n\nHämtningsadress:\n${getPickupAddressText()}\n\nVänligen hämta din order enligt överenskommelse.\n\nMed vänlig hälsning,\nVikingfuel\n`;
  }

  const postNordShipmentId = order.postnordShipmentId || '';
  const trackingText = tracking || order.postnordTracking || 'Ej tillgängligt';
  return `Hej!\n\nDin beställning ${order.id} har skickats.\n\nOrdernummer: ${order.id}\nE-post: ${recipientEmail}\n${postNordShipmentId ? `PostNord-nummer: ${postNordShipmentId}\n` : ''}Spårningsnummer: ${trackingText}\n\nDu kan följa din försändelse på PostNords spårningssida med numret ovan.\n\nMed vänlig hälsning,\nVikingfuel\n`;
}

export async function sendShippingNotificationForStoredOrder(order: any, recipientEmail: string, tracking?: string) {
  if (!recipientEmail) {
    throw new Error('Recipient email is required for shipping notification');
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: senderEmail,
    to: recipientEmail,
    replyTo: replyToEmail,
    subject: 'Din beställning har skickats — spårningsnummer',
    text: buildShippingNotificationTextFromStoredOrder(order, recipientEmail, tracking),
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
