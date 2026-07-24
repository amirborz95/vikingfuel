// Branded, email-client-safe HTML templates for Vikingfuel.
// Inline styles + table layout for maximum compatibility (Gmail, Outlook, Apple Mail).

const BRAND = {
  black: '#0b0b0d',
  green: '#16a34a', // site primary green
  greenBright: '#22c55e', // pops on the dark header
  greenLight: '#86efac', // light green text on dark backgrounds
  text: '#1f2430',
  muted: '#6b7280',
  border: '#e5e7eb',
  bg: '#f4f4f5',
  site: process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se',
};

function esc(s: any): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatKr(amountInCents: number): string {
  return (amountInCents / 100).toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export interface EmailItem {
  name: string;
  quantity: number;
  price: number; // per unit, in SEK
}

function itemsRows(items: EmailItem[]): string {
  return (items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.text};font-size:15px;">
          ${esc(it.name)} <span style="color:${BRAND.muted};">× ${esc(it.quantity)}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.text};font-size:15px;text-align:right;white-space:nowrap;">
          ${formatKr((it.price || 0) * (it.quantity || 1) * 100)} kr
        </td>
      </tr>`
    )
    .join('');
}

interface ShellArgs {
  preheader: string;
  heading: string;
  intro: string;
  bodyHtml: string;
}

function shell({ preheader, heading, intro, bodyHtml }: ShellArgs): string {
  return `<!DOCTYPE html>
<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- header -->
        <tr><td style="background:${BRAND.black};padding:28px 32px;text-align:center;">
          <div style="font-size:26px;font-weight:800;letter-spacing:4px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
            VIKING<span style="color:${BRAND.greenBright};">FUEL</span>
          </div>
          <div style="margin-top:4px;font-size:11px;letter-spacing:3px;color:${BRAND.greenLight};text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Premium Kosttillskott</div>
        </td></tr>
        <!-- body -->
        <tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;">
          <h1 style="margin:0 0 8px;font-size:22px;color:${BRAND.text};">${esc(heading)}</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${intro}</p>
          ${bodyHtml}
        </td></tr>
        <!-- footer -->
        <tr><td style="background:#fafafa;padding:24px 32px;border-top:1px solid ${BRAND.border};font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 6px;font-size:13px;color:${BRAND.muted};">Tack för att du handlar hos Vikingfuel.</p>
          <p style="margin:0;font-size:12px;color:${BRAND.muted};">
            <a href="${BRAND.site}" style="color:${BRAND.green};text-decoration:none;">vikingfuel.se</a>
            &nbsp;·&nbsp; Frågor? Svara på detta mejl så hjälper vi dig.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function summaryTable(opts: {
  orderId: string;
  items: EmailItem[];
  totalInCents: number;
  taxInCents?: number;
  shippingLabel: string;
  shippingDetail: string;
}): string {
  const taxRow =
    typeof opts.taxInCents === 'number'
      ? `<tr><td style="padding:6px 0;color:${BRAND.muted};font-size:14px;">Varav moms (6%)</td>
         <td style="padding:6px 0;color:${BRAND.muted};font-size:14px;text-align:right;">${formatKr(opts.taxInCents)} kr</td></tr>`
      : '';
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr><td style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};padding-bottom:6px;">Ordernummer</td></tr>
    <tr><td style="font-size:13px;color:${BRAND.text};word-break:break-all;padding-bottom:16px;">${esc(opts.orderId)}</td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${itemsRows(opts.items)}
    ${taxRow}
    <tr>
      <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:${BRAND.text};">Totalt</td>
      <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:${BRAND.text};text-align:right;">${formatKr(opts.totalInCents)} kr</td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
    <tr><td style="padding:16px 18px;">
      <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.green};margin-bottom:6px;">Leverans</div>
      <div style="font-size:15px;font-weight:600;color:${BRAND.text};">${esc(opts.shippingLabel)}</div>
      <div style="font-size:14px;color:${BRAND.muted};margin-top:2px;white-space:pre-line;">${esc(opts.shippingDetail)}</div>
    </td></tr>
  </table>`;
}

export function buildOrderConfirmationHtml(opts: {
  orderId: string;
  customerName?: string;
  items: EmailItem[];
  totalInCents: number;
  taxInCents?: number;
  shippingLabel: string;
  shippingDetail: string;
}): string {
  const hi = opts.customerName ? `Hej ${esc(opts.customerName)},` : 'Hej,';
  return shell({
    preheader: 'Tack för din beställning – vi förbereder din order.',
    heading: 'Tack för din beställning! 🛡️',
    intro: `${hi} vi har tagit emot din order och börjar förbereda den. Din vara skickas inom kort – du får ett nytt mejl med spårningsnummer så snart paketet är på väg.`,
    bodyHtml: summaryTable({
      orderId: opts.orderId,
      items: opts.items,
      totalInCents: opts.totalInCents,
      taxInCents: opts.taxInCents,
      shippingLabel: opts.shippingLabel,
      shippingDetail: opts.shippingDetail,
    }),
  });
}

export function buildShippingHtml(opts: {
  orderId: string;
  customerName?: string;
  items: EmailItem[];
  totalInCents: number;
  shippingLabel: string;
  shippingDetail: string;
  tracking?: string | null;
  isPostNord: boolean;
}): string {
  const hi = opts.customerName ? `Hej ${esc(opts.customerName)},` : 'Hej,';
  const trackingBox =
    opts.isPostNord && opts.tracking
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:${BRAND.black};border-radius:10px;">
           <tr><td style="padding:20px 22px;text-align:center;">
             <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.greenLight};margin-bottom:8px;">Spårningsnummer</div>
             <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;word-break:break-all;">${esc(opts.tracking)}</div>
             <a href="https://www.postnord.se/vara-verktyg/spara-brev-och-paket?shipmentId=${encodeURIComponent(opts.tracking)}" style="display:inline-block;margin-top:14px;background:${BRAND.green};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 22px;border-radius:8px;">Spåra ditt paket</a>
           </td></tr>
         </table>`
      : opts.isPostNord
        ? `<p style="font-size:14px;color:${BRAND.muted};margin:0 0 20px;">Ditt spårningsnummer läggs till så snart det är tillgängligt.</p>`
        : `<p style="font-size:15px;color:${BRAND.text};margin:0 0 20px;">Din order är redo för uthämtning enligt överenskommelse.</p>`;

  return shell({
    preheader: 'Din order är på väg!',
    heading: 'Din order är skickad! 📦',
    intro: `${hi} goda nyheter – din beställning har lämnat oss och är nu på väg till dig.`,
    bodyHtml:
      trackingBox +
      summaryTable({
        orderId: opts.orderId,
        items: opts.items,
        totalInCents: opts.totalInCents,
        shippingLabel: opts.shippingLabel,
        shippingDetail: opts.shippingDetail,
      }),
  });
}
