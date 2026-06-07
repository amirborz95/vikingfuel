import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';
import {
  sendOrderConfirmationEmailForSessionId,
  sendOrderConfirmationEmailForStoredOrder,
  sendShippingNotificationForSessionId,
  sendShippingNotificationForStoredOrder,
} from '@/lib/orderConfirmation';

const USERS_FILE = path.join(process.cwd(), 'data/users.json');
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2026-04-22.dahlia' }) : null;

export async function GET(req: NextRequest) {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);

    const orders: Array<any> = [];
    users.forEach((u: any) => {
      (u.orders || []).forEach((o: any) => {
        orders.push({ userEmail: u.email, userName: u.name || null, order: o });
      });
    });

    // sort by createdAt desc
    orders.sort((a, b) => {
      const da = a.order?.createdAt ? new Date(a.order.createdAt).getTime() : 0;
      const db = b.order?.createdAt ? new Date(b.order.createdAt).getTime() : 0;
      return db - da;
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userEmail, orderId, tracking } = body;

    if (!userEmail || !orderId) {
      return NextResponse.json({ error: 'userEmail and orderId are required' }, { status: 400 });
    }

    const usersRaw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(usersRaw);
    const user = users.find((u: any) => u.email === userEmail);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const order = (user.orders || []).find((o: any) => o.id === orderId || o.sessionId === orderId);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (action === 'sendConfirmation') {
      const customerEmail = user.email;
      if (order.sessionId) {
        try {
          await sendOrderConfirmationEmailForSessionId(order.sessionId);
          return NextResponse.json({ success: true });
        } catch (e: any) {
          console.warn('Stripe session confirmation failed, falling back to stored order email:', e?.message || e);
        }
      }

      try {
        await sendOrderConfirmationEmailForStoredOrder(order, customerEmail);
        return NextResponse.json({ success: true, fallback: true });
      } catch (e: any) {
        console.error('Failed to send stored order confirmation:', e);
        return NextResponse.json({ error: e.message || 'Failed to send confirmation' }, { status: 500 });
      }
    }

    if (action === 'markShipped') {
      // tracking is optional but recommended
      order.status = 'shipped';
      order.shippedAt = new Date().toISOString();
      if (tracking) {
        order.postnordTracking = tracking;
      }

      // persist
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

      // update stripe session metadata if possible
      if (stripe && order.sessionId) {
        try {
          await stripe.checkout.sessions.update(order.sessionId, {
            metadata: {
              ...(order.metadata || {}),
              postnord_tracking: order.postnordTracking || '',
              shipped: 'true',
            },
          });
        } catch (e) {
          console.error('Failed to update Stripe session metadata on ship:', e);
        }
      }

      if (order.sessionId) {
        try {
          await sendShippingNotificationForSessionId(order.sessionId);
          return NextResponse.json({ success: true, order });
        } catch (e: any) {
          console.warn('Stripe session shipping notification failed, falling back to stored order email:', e?.message || e);
        }
      }

      try {
        await sendShippingNotificationForStoredOrder(order, user.email, tracking);
      } catch (e: any) {
        console.error('Failed to send stored order shipping notification:', e);
        return NextResponse.json({ error: e.message || 'Failed to send shipping notification' }, { status: 500 });
      }

      return NextResponse.json({ success: true, order, fallback: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin orders POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to manage order' }, { status: 500 });
  }
}
