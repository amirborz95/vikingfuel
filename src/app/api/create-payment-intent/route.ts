import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { type ShippingMethod } from '@/lib/shipping';
import { getCarrier, carrierCost, type CarrierId } from '@/lib/carriers';
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
    const carrierId = (shipping?.carrier || shipping?.method) as CarrierId | undefined;
    if (!Array.isArray(items) || items.length === 0 || !customer?.email || !carrierId) {
      return NextResponse.json({ error: 'Missing items, customer email or shipping option' }, { status: 400 });
    }

    const carrier = getCarrier(carrierId);
    if (!carrier) {
      return NextResponse.json({ error: 'Unknown shipping option' }, { status: 400 });
    }
    // Legacy field kept for downstream code that still expects pickup/postnord.
    const method: ShippingMethod = carrier.provider === 'pickup' ? 'pickup' : 'postnord';
    const country = (shipping.country || 'SE').toUpperCase();

    // Some carriers are only offered within Sweden.
    if (carrier.seOnly && country !== 'SE') {
      return NextResponse.json({ error: `${carrier.brand} is only available in Sweden` }, { status: 400 });
    }
    // Carriers that ship to an address need one.
    if (carrier.needsAddress && (!shipping.line1 || !shipping.postcode || !shipping.city)) {
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
    const shippingCost = carrierCost(carrierId, country, subtotal);
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
        shipping_carrier: carrierId,
        shipping_option_label: carrier.brand,
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
        carrier: carrierId,
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
