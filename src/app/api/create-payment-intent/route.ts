import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { type ShippingMethod } from '@/lib/shipping';
import { getCarrier, carrierCost, type CarrierId } from '@/lib/carriers';
import { totalUnits } from '@/lib/inventory';
import { getInventoryState, reserveUnits } from '@/lib/inventory.server';
import { savePendingOrder } from '@/lib/orders';
import { computeDiscount } from '@/lib/discount';

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
    const shippingCost = carrierCost(carrierId, country, subtotal, orderedUnits);

    // Discount code (e.g. VIKING10 → 10% off single bottle only).
    const discount = computeDiscount(String(body.discountCode || ''), items);
    const discountAmount = discount.valid ? discount.amount : 0;

    // Affiliate attribution — read the ref cookie set by the /<code> link.
    const affiliateCode = req.cookies.get('vf_ref')?.value || null;

    const total = Math.round((subtotal + shippingCost - discountAmount) * 100) / 100;
    const amountInCents = Math.round(Math.max(0, total) * 100);

    // Find or create a Stripe customer so the card can be reused for the
    // one-click post-purchase upsell (setup_future_usage saves the card).
    let customerId: string | undefined;
    try {
      const existing = await stripe.customers.list({ email: customer.email, limit: 1 });
      const cust = existing.data[0] || (await stripe.customers.create({ email: customer.email, name: customer.name || undefined }));
      customerId = cust.id;
    } catch (e) {
      console.error('Customer lookup/create failed (non-fatal):', e);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'sek',
      automatic_payment_methods: { enabled: true },
      receipt_email: customer.email,
      description: `Vikingfuel order — ${customer.email}`,
      ...(customerId ? { customer: customerId, setup_future_usage: 'off_session' as const } : {}),
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
        units: Number(it.units) || 1,
        image: it.image,
      })),
      discountCode: discountAmount > 0 ? discount.code : undefined,
      discountAmount,
      affiliateCode: affiliateCode || undefined,
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
