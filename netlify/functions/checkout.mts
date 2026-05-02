import Stripe from 'stripe';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const secretKey = Netlify.env.get('STRIPE_SECRET_KEY');
  if (!secretKey) {
    return Response.json(
      { error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { items, customer } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Cart is empty' }, { status: 400 });
  }

  if (!customer?.email) {
    return Response.json({ error: 'Customer email is required' }, { status: 400 });
  }

  const origin =
    Netlify.env.get('NEXT_PUBLIC_SITE_URL') ||
    req.headers.get('origin') ||
    new URL(req.url).origin;

  const line_items = items.map((item: any) => ({
    price_data: {
      currency: 'sek',
      product_data: {
        name: item.name,
        ...(item.image ? { images: [item.image] } : {}),
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      customer_email: customer.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['SE', 'NO', 'DK', 'FI'],
      },
      metadata: {
        customer_name: customer.name || '',
        customer_phone: customer.phone || '',
      },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return Response.json(
      { error: error?.message || 'Checkout failed' },
      { status: 500 },
    );
  }
};

export const config = {
  path: '/api/checkout',
  method: 'POST',
};
