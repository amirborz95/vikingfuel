import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!items || !customer) {
      return NextResponse.json(
        { error: 'Missing items or customer info' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'sek',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const orderAmount = line_items.reduce(
      (sum, item) => sum + (item.price_data.unit_amount || 0) * item.quantity,
      0
    );

    const freeShipping = orderAmount >= 50000;
    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: freeShipping ? 0 : 5900,
            currency: 'sek',
          },
          display_name: freeShipping ? 'Fri frakt över 500 kr' : 'Standardfrakt upp till 5 kg',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 5 },
          },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: customer.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['SE', 'NO', 'DK', 'FI'],
      },
      shipping_options: shippingOptions,
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
