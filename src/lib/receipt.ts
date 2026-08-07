import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { COMPANY } from './company';
import { readData, writeData } from './dataStore';

// ── Formatting helpers ──────────────────────────────────────────────────────
function formatKr(n: number): string {
  const [int, dec] = (Math.round((n || 0) * 100) / 100).toFixed(2).split('.');
  const intSpaced = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${intSpaced},${dec} kr`;
}

const SV_MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
function svDateTime(d = new Date()): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${SV_MONTHS[d.getMonth()]} ${d.getFullYear()} ${hh}:${mm}`;
}

// Sequential kvitto number (starts at 14 to match the existing series).
async function nextReceiptNumber(): Promise<number> {
  const cur = await readData<{ n: number }>('receipt_counter.json', { n: 13 });
  const n = (cur?.n || 13) + 1;
  await writeData('receipt_counter.json', { n });
  return n;
}

// ── Receipt lines from a stored order ───────────────────────────────────────
interface ReceiptLine { label: string; qty: number; unit: number; total: number }

function receiptLines(order: any): ReceiptLine[] {
  const lines: ReceiptLine[] = (order.items || []).map((it: any) => ({
    label: String(it.name || 'Produkt'),
    qty: Number(it.quantity) || 1,
    unit: Number(it.price) || 0,
    total: (Number(it.price) || 0) * (Number(it.quantity) || 1),
  }));
  if (Number(order.shippingCost) > 0) {
    lines.push({ label: 'Frakt', qty: 1, unit: Number(order.shippingCost), total: Number(order.shippingCost) });
  }
  return lines;
}

const BLACK = rgb(0.11, 0.11, 0.13);
const GRAY = rgb(0.45, 0.47, 0.5);
const BLUE = rgb(0.16, 0.4, 0.85);
const LINE = rgb(0.86, 0.87, 0.89);

/** Build a Swedish kvitto PDF for a stored order. Returns bytes + the number. */
export async function buildReceiptPdf(order: any): Promise<{ bytes: Uint8Array; receiptNo: number }> {
  const receiptNo = await nextReceiptNumber();
  const lines = receiptLines(order);
  const total = Number(order.totalAmount) || lines.reduce((s, l) => s + l.total, 0);
  const vat = Math.round((total - total / (1 + COMPANY.vatRate)) * 100) / 100;
  const paymentLabel = order.isSubscription ? 'Prenumeration (kort)' : 'Betalat med kort';

  const W = 360;
  const H = 560 + Math.max(0, lines.length - 1) * 30;
  const M = 32; // side margin

  const doc = await PDFDocument.create();
  const page = doc.addPage([W, H]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Cursor from top; drawText uses bottom-left origin so we convert with (H - y).
  let y = 30;
  const T = (yTop: number) => H - yTop;
  const text = (s: string, x: number, yTop: number, size: number, f: PDFFont, color = BLACK) =>
    page.drawText(s, { x, y: T(yTop), size, font: f, color });
  const center = (s: string, yTop: number, size: number, f: PDFFont, color = BLACK) => {
    const w = f.widthOfTextAtSize(s, size);
    text(s, (W - w) / 2, yTop, size, f, color);
  };
  const right = (s: string, xRight: number, yTop: number, size: number, f: PDFFont, color = BLACK) => {
    const w = f.widthOfTextAtSize(s, size);
    text(s, xRight - w, yTop, size, f, color);
  };
  const rule = (yTop: number, x1 = M, x2 = W - M) =>
    page.drawLine({ start: { x: x1, y: T(yTop) }, end: { x: x2, y: T(yTop) }, thickness: 1, color: LINE });

  // Header
  text(`Kvitto #${receiptNo}`, M, y + 4, 12, bold);
  right(svDateTime(), W - M, y + 4, 9.5, font, GRAY);
  y += 22;
  rule(y);
  y += 22;

  // Logo (best-effort — falls back to text if the file isn't bundled)
  try {
    const logoBytes = fs.readFileSync(path.join(process.cwd(), 'public/viking_logo_nav.png'));
    const logo = await doc.embedPng(logoBytes);
    const lw = 70;
    const lh = (logo.height / logo.width) * lw;
    page.drawImage(logo, { x: (W - lw) / 2, y: T(y + lh), width: lw, height: lh });
    y += lh + 12;
  } catch {
    center('VIKING FUEL', y + 10, 16, bold);
    y += 26;
  }

  // Company block
  center(COMPANY.name, y + 12, 15, bold);
  y += 24;
  center(COMPANY.addressLine, y + 10, 10, font, GRAY);
  y += 20;
  center(COMPANY.website, y + 10, 10, font, BLUE);
  y += 22;
  rule(y);
  y += 26;

  // Line items
  for (const l of lines) {
    const label = l.label.length > 30 ? l.label.slice(0, 29) + '…' : l.label;
    text(label, M, y, 11, font, BLACK);
    right(formatKr(l.total), W - M, y, 11, bold, BLACK);
    y += 15;
    text(`${l.qty} x ${formatKr(l.unit).replace(' kr', '')}`, M, y, 9.5, font, GRAY);
    y += 22;
  }
  rule(y);
  y += 26;

  // Totals (right aligned)
  right(`Totalt: ${formatKr(total)}`, W - M, y, 14, bold, BLACK);
  y += 22;
  right(`Total moms: ${formatKr(vat)}`, W - M, y, 11, bold, BLACK);
  y += 17;
  right(`Moms (6%): ${formatKr(vat)}`, W - M, y, 10, font, GRAY);
  y += 26;

  // Payment box
  const boxH = 52;
  page.drawRectangle({ x: M, y: T(y + boxH), width: W - 2 * M, height: boxH, borderColor: LINE, borderWidth: 1, color: rgb(0.98, 0.98, 0.99) });
  text('KÖP', M + 12, y + 16, 8, bold, GRAY);
  text(`${paymentLabel}:`, M + 12, y + 34, 11, bold, BLACK);
  right(formatKr(total), W - M - 12, y + 34, 11, bold, BLACK);
  y += boxH + 26;

  center('Välkommen åter', y + 12, 13, bold);
  y += 26;
  rule(y);
  y += 22;

  // Footer — company legal details, wrapped across up to 3 lines.
  const footerParts = [
    COMPANY.name,
    COMPANY.addressLine,
    COMPANY.phone,
    COMPANY.email,
    `Org. nr: ${COMPANY.orgNr}`,
    `Momsreg.nr: ${COMPANY.vatNr}`,
  ];
  const footerLines: string[] = [];
  let cur = '';
  const maxW = W - 2 * M;
  for (const part of footerParts) {
    const candidate = cur ? `${cur}  •  ${part}` : part;
    if (font.widthOfTextAtSize(candidate, 8) > maxW && cur) {
      footerLines.push(cur);
      cur = part;
    } else {
      cur = candidate;
    }
  }
  if (cur) footerLines.push(cur);
  for (const fl of footerLines) {
    center(fl, y + 8, 8, font, GRAY);
    y += 13;
  }
  y += 8;
  center('Elektroniskt kassakvitto', y + 8, 8.5, font, GRAY);

  const bytes = await doc.save();
  return { bytes, receiptNo };
}
