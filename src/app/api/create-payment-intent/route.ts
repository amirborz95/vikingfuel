import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getShippingCost, type ShippingMethod } from '@/lib/shipping';
import { totalUnits } from '@/lib/inventory';
import { getInventoryState, reserveUnits } from '@/lib/inventory.server';
import { savePendingOrder } from '@/lib/orders';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, shipping } = body || {};

    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    if (!Array.isArray(items) || items.length === 0 || !customer?.email || !shipping?.method) {
      return NextResponse.json({ error: 'Missing items, customer email or shipping option' }, { status: 400 });
    }

    const method: ShippingMethod = shipping.method === 'postnord' ? 'postnord' : 'pickup';
    const country = (shipping.country || 'SE').toUpperCase();

    // Pickup is only valid within Sweden.
    if (method === 'pickup' && country !== 'SE') {
      return NextResponse.json({ error: 'Pickup is only available in Sweden' }, { status: 400 });
    }
    // For PostNord we need a delivery address.
    if (method === 'postnord' && (!shipping.line1 || !shipping.postcode || !shipping.city)) {
      return NextResponse.json({ error: 'Missing delivery address' }, { status: 400 });
    }

    // Inventory check.
    const orderedUnits = totalUnits(items);
    const inventory = await getInventoryState();
    if (orderedUnits > inventory.remainingUnits) {
      return NextResponse.json(
        { error: `Only ${inventory.remainingUnits} cans left in stock.` },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, it: any) => sum + Number(it.price) * Number(it.quantity),
      0
    );
    const shippingCost = getShippingCost(method, country, subtotal);
    const total = Math.round((subtotal + shippingCost) * 100) / 100;
    const amountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'sek',
      automatic_payment_methods: { enabled: true },
      receipt_email: customer.email,
      description: `Vikingfuel order — ${customer.email}`,
      metadata: {
        email: customer.email,
        name: (customer.name || '').slice(0, 200),
        shipping_method: method,
        shipping_country: country,
        source: 'onsite-checkout',
      },
    });

    // Store the full draft so the webhook can build the order once paid.
    await savePendingOrder(paymentIntent.id, {
      items: items.map((it: any) => ({
        name: it.name,
        price: Number(it.price),
        quantity: Number(it.quantity),
        image: it.image,
      })),
      customer: {
        email: customer.email,
        name: customer.name || '',
        phone: customer.phone || '',
      },
      shipping: {
        method,
        country,
        line1: shipping.line1 || '',
        line2: shipping.line2 || '',
        postcode: shipping.postcode || '',
        city: shipping.city || '',
      },
      subtotal,
      shippingCost,
      total,
    });

    // Reserve stock (as the old checkout did).
    try {
      await reserveUnits(orderedUnits);
    } catch (e) {
      console.error('Inventory reserve failed:', e);
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amounts: { subtotal, shippingCost, total },
    });
  } catch (error: any) {
    console.error('create-payment-intent error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create payment' }, { status: 500 });
  }
}
