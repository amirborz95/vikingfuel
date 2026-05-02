import Stripe from 'stripe';

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutCustomer {
  name?: string;
  email?: string;
  phone?: string;
}

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const stripeSecretKey = Netlify.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    console.error('Missing STRIPE_SECRET_KEY');
    return Response.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  let body: { items?: CheckoutItem[]; customer?: CheckoutCustomer };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { items, customer } = body;

  if (!items || items.length === 0) {
    return Response.json({ error: 'Cart is empty' }, { status: 400 });
  }
  if (!customer?.email) {
    return Response.json({ error: 'Customer email is required' }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);

  const siteUrl =
    Netlify.env.get('NEXT_PUBLIC_SITE_URL') ||
    Netlify.env.get('URL') ||
    'https://vikingfuel.se';

  const line_items = items.map((item) => ({
    price_data: {
      currency: 'sek',
      product_data: {
        name: item.name,
        ...(item.image ? { images: [item.image] } : {}),
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel/`,
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
      { status: 500 }
    );
  }
};

export const config = {
  path: '/api/checkout',
  method: 'POST',
};
