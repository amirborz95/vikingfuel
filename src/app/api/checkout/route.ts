import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { MAX_STOCK, totalUnits } from '@/lib/inventory';
import { getInventoryState, reserveUnits, restoreUnits } from '@/lib/inventory.server';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecret) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
}
const stripe = new Stripe(stripeSecret);

async function getOrCreateTaxRate() {
  const existingRates = await stripe.taxRates.list({ limit: 100 });
  const found = existingRates.data.find(
    (rate) =>
      rate.display_name === 'Moms' &&
      rate.percentage === 6 &&
      rate.inclusive === true &&
      rate.country === 'SE'
  );
  if (found) {
    return found;
  }

  return await stripe.taxRates.create({
    display_name: 'Moms',
    description: '6% moms inklusive',
    country: 'SE',
    jurisdiction: 'Sweden',
    percentage: 6,
    inclusive: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, shippingOption, shippingPostcode } = body;

    if (!items || !customer || !shippingOption || !shippingPostcode) {
      return NextResponse.json(
        { error: 'Missing items, customer info, or shipping option' },
        { status: 400 }
      );
    }

    if (!['pickup', 'postnord'].includes(shippingOption)) {
      return NextResponse.json(
        { error: 'Invalid shipping option' },
        { status: 400 }
      );
    }

    const totalOrderedUnits = totalUnits(items);
    const inventory = await getInventoryState();

    if (totalOrderedUnits > inventory.remainingUnits) {
      return NextResponse.json(
        {
          error: `Det finns endast ${inventory.remainingUnits} burkar kvar i lager. Din order försöker reservera ${totalOrderedUnits} burkar.`,
        },
        { status: 400 }
      );
    }

    if (!stripeSecret) {
      return NextResponse.json(
        { error: 'Stripe not configured on server (STRIPE_SECRET_KEY missing)' },
        { status: 500 }
      );
    }

    const taxRate = await getOrCreateTaxRate();

    // Ensure Stripe images are full URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se';
    function toAbsoluteImageUrl(img: string) {
      if (!img) return '';
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      if (img.startsWith('/')) return siteUrl.replace(/\/$/, '') + img;
      return siteUrl.replace(/\/$/, '') + '/' + img;
    }

    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'sek',
        product_data: {
          name: item.name,
          images: [toAbsoluteImageUrl(item.image)],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
        tax_behavior: 'inclusive',
      },
      quantity: item.quantity,
      tax_rates: [taxRate.id],
    }));

    const subtotalInCents = line_items.reduce(
      (sum, item) => sum + (item.price_data.unit_amount || 0) * item.quantity,
      0
    );
    const shippingAmountInCents = subtotalInCents >= 70000 ? 0 : 4900;

    if (shippingAmountInCents > 0) {
      line_items.push({
        price_data: {
          currency: 'sek',
          product_data: {
            name: 'Frakt 49 kr',
            description: 'Fraktkostnad för beställningar under 700 kr',
            tax_code: 'txcd_92010001',
          },
          unit_amount: shippingAmountInCents,
          tax_behavior: 'inclusive',
        },
        quantity: 1,
        tax_rates: [taxRate.id],
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: customer.email,
      payment_intent_data: {
        receipt_email: customer.email,
      },
      billing_address_collection: 'required',
      ...(shippingOption === 'postnord'
        ? { shipping_address_collection: { allowed_countries: ['SE', 'NO', 'DK', 'FI'] } }
        : {}),
      metadata: {
        ...(customer.name ? { customer_name: customer.name } : {}),
        ...(customer.phone ? { customer_phone: customer.phone } : {}),
        shipping_option: shippingOption,
        shipping_option_label: shippingOption === 'postnord' ? 'PostNord' : 'Uthämtning',
        shipping_postcode: shippingPostcode,
      },
    });

    try {
      await reserveUnits(totalOrderedUnits);
    } catch (inventoryError: any) {
      console.error('Inventory reserve failed:', inventoryError);
      return NextResponse.json(
        { error: 'Kunde inte reservera lagret. Försök igen.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    const message = error?.message || 'Checkout failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
