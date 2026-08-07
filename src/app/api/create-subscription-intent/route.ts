import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SUB_PLANS, ALLOWED_SUB_PRICE_IDS } from '@/lib/subscriptions';
import { getCarrier, carrierCost, type CarrierId } from '@/lib/carriers';
import { getInventoryState, reserveUnits } from '@/lib/inventory.server';
import { savePendingSubscriptionOrder } from '@/lib/orders';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret);

// Reusable Stripe product for the recurring shipping line item. Cached per
// server instance; found by metadata, created once if missing.
let cachedShippingProductId: string | null = null;
async function getShippingProductId(): Promise<string> {
  if (cachedShippingProductId) return cachedShippingProductId;
  if (process.env.STRIPE_SHIPPING_PRODUCT_ID) {
    cachedShippingProductId = process.env.STRIPE_SHIPPING_PRODUCT_ID;
    return cachedShippingProductId;
  }
  try {
    const found = await stripe.products.search({ query: "metadata['vf_role']:'shipping'", limit: 1 });
    if (found.data[0]) {
      cachedShippingProductId = found.data[0].id;
      return cachedShippingProductId;
    }
  } catch (e) {
    console.error('Shipping product search failed (will create):', e);
  }
  const created = await stripe.products.create({ name: 'Frakt', metadata: { vf_role: 'shipping' } });
  cachedShippingProductId = created.id;
  return cachedShippingProductId;
}

/**
 * On-site subscription checkout. Mirrors the one-time embedded checkout: the
 * customer fills in their details + delivery on our own page, then pays the
 * first month with the Stripe PaymentElement. We create a Stripe subscription
 * with `default_incomplete` and return the first invoice's client secret so the
 * card can be confirmed on-site. Stripe then bills the card automatically every
 * month; each paid invoice becomes an order + shipment via the webhook.
 */
export async function POST(req: NextRequest) {
  try {
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const body = await req.json();
    const priceId = String(body.priceId || '');
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));
    const customer = body.customer || {};
    const shipping = body.shipping || {};
    const email = String(customer.email || '').trim();

    // Only allow our own subscription prices.
    if (!ALLOWED_SUB_PRICE_IDS.includes(priceId)) {
      return NextResponse.json({ error: 'Ogiltig prenumeration.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Ange en giltig e-postadress.' }, { status: 400 });
    }

    const carrierId = (shipping?.carrier || shipping?.method) as CarrierId | undefined;
    const carrier = carrierId ? getCarrier(carrierId) : undefined;
    if (!carrier) {
      return NextResponse.json({ error: 'Välj ett leveranssätt.' }, { status: 400 });
    }
    const country = (shipping.country || 'SE').toUpperCase();
    if (carrier.seOnly && country !== 'SE') {
      return NextResponse.json({ error: `${carrier.brand} är endast tillgängligt i Sverige.` }, { status: 400 });
    }
    if (carrier.needsAddress && (!shipping.line1 || !shipping.postcode || !shipping.city)) {
      return NextResponse.json({ error: 'Fyll i leveransadress.' }, { status: 400 });
    }

    // Plan → number of bottles (units) per month.
    const planEntry = Object.entries(SUB_PLANS).find(([, p]) => p.priceId === priceId);
    const bottlesPerPack = planEntry ? Number(planEntry[0]) : 1;
    const monthly = planEntry ? planEntry[1].monthly : 0;
    const orderedUnits = bottlesPerPack * quantity;

    // Inventory check for the first shipment.
    const inventory = await getInventoryState();
    if (orderedUnits > inventory.remainingUnits) {
      return NextResponse.json(
        { error: `Endast ${inventory.remainingUnits} burkar kvar i lager.` },
        { status: 400 }
      );
    }

    // Find or create the Stripe customer with the collected details.
    const method = carrier.provider === 'pickup' ? 'pickup' : 'postnord';
    const addressForStripe = carrier.needsAddress
      ? {
          line1: shipping.line1 || undefined,
          line2: shipping.line2 || undefined,
          postal_code: shipping.postcode || undefined,
          city: shipping.city || undefined,
          country,
        }
      : undefined;

    const existing = await stripe.customers.list({ email, limit: 1 });
    const stripeCustomer =
      existing.data[0] ||
      (await stripe.customers.create({
        email,
        name: customer.name || undefined,
        phone: customer.phone || undefined,
        ...(addressForStripe ? { address: addressForStripe, shipping: { name: customer.name || email, phone: customer.phone || undefined, address: addressForStripe } } : {}),
      }));

    // Shipping — same rule as the one-time checkout (PostNord: free over 700 kr,
    // otherwise 49 kr). Charged recurring, alongside the plan, every month.
    const subtotal = monthly * quantity;
    const shippingCost = carrierCost(carrierId as string, country, subtotal, orderedUnits);

    const items: Stripe.SubscriptionCreateParams.Item[] = [{ price: priceId, quantity }];
    if (shippingCost > 0) {
      const shippingProduct = await getShippingProductId();
      items.push({
        price_data: {
          currency: 'sek',
          product: shippingProduct,
          unit_amount: Math.round(shippingCost * 100),
          recurring: { interval: 'month' },
        },
        quantity: 1,
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.confirmation_secret'],
      metadata: {
        source: 'onsite-subscription',
        email,
        name: (customer.name || '').slice(0, 200),
        shipping_carrier: carrierId || '',
        shipping_country: country,
        shipping_cost: String(shippingCost),
      },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice | null;
    const clientSecret = invoice?.confirmation_secret?.client_secret;
    if (!clientSecret) {
      return NextResponse.json({ error: 'Kunde inte starta betalningen.' }, { status: 500 });
    }

    // Affiliate attribution — read the ref cookie set by the /<code> link.
    const affiliateCode = req.cookies.get('vf_ref')?.value || null;

    // Store the draft so the webhook can build an order + shipment for every
    // paid invoice (first month and each renewal).
    await savePendingSubscriptionOrder(subscription.id, {
      items: [
        {
          name: `Viking Energy — Prenumeration (${bottlesPerPack}-pack)`,
          price: monthly,
          quantity,
          units: bottlesPerPack,
        },
      ],
      affiliateCode: affiliateCode || undefined,
      customer: {
        email,
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
      total: subtotal + shippingCost,
      isSubscription: true,
      subscriptionId: subscription.id,
      billingInterval: 'month',
    });

    // Reserve stock for the first shipment (as the one-time checkout does).
    try {
      await reserveUnits(orderedUnits);
    } catch (e) {
      console.error('Inventory reserve failed (subscription):', e);
    }

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
      amounts: { subtotal, shippingCost, total: subtotal + shippingCost },
    });
  } catch (error: any) {
    console.error('create-subscription-intent error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to start subscription' }, { status: 500 });
  }
}
