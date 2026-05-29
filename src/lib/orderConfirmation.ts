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
  apiVersion: '2022-11-15',
});

function formatAmount(amountInCents: number) {
  return (amountInCents / 100).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

  return `Hej!\n\nTack för din beställning hos Vikingfuel. Här är ditt kvitto och orderbekräftelse på svenska.\n\nOrdernummer: ${session.id}\nE-post: ${customerEmail}\n\nOrderdetaljer:\n${itemsText}\n\nMoms (6%): ${formatAmount(taxAmount)} kr\nTotal att betala: ${formatAmount(totalAmount)} kr\n\nVi meddelar dig när din order har skickats.\n\nTack för att du handlar hos Vikingfuel!\n\nMed vänlig hälsning,\nVikingfuel\n`;
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
