import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/auth';
import { getShipmondoLabelPdf } from '@/lib/shipmondo.server';
import { verifyLabelToken } from '@/lib/adminAuth';

/**
 * Serves a shipment's printable label to the admin panel.
 *
 *   GET /api/admin/label?email=<userEmail>&order=<orderId>&t=<labelToken>
 *
 * PostNord labels are public URLs, so we redirect to them. Shipmondo labels are
 * auth-protected, so we fetch the PDF server-side (with the API credentials) and
 * stream it back — the credentials never reach the browser.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const orderId = searchParams.get('order');

    if (!email || !orderId) {
      return NextResponse.json({ error: 'email and order are required' }, { status: 400 });
    }

    // Labels carry the customer's name and address — only the admin panel's
    // per-order token opens them.
    if (!verifyLabelToken(orderId, searchParams.get('t'))) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const users = await readUsers();
    const user = users.find((u: any) => u.email === email);
    const order = user?.orders?.find((o: any) => o.id === orderId || o.sessionId === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // PostNord: public label URL → redirect.
    const postnordUrl = order.postnordLabelUrl || order.postnordLabelPdfUrl;
    if (postnordUrl) {
      return NextResponse.redirect(postnordUrl);
    }

    // Shipmondo: fetch the PDF with server-side auth and stream it.
    if (order.shipmondoShipmentId) {
      const pdf = await getShipmondoLabelPdf(order.shipmondoShipmentId);
      return new NextResponse(pdf as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="label-${orderId}.pdf"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    return NextResponse.json({ error: 'No label available for this order' }, { status: 404 });
  } catch (error: any) {
    console.error('Admin label route error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch label' }, { status: 500 });
  }
}
