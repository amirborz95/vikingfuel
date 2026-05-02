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

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const secretKey = Netlify.env.get('STRIPE_SECRET_KEY');
  if (!secretKey) {
    return Response.json(
      { error: 'Stripe is not configured (missing STRIPE_SECRET_KEY)' },
      { status: 500 },
    );
  }

  let body: { items?: CheckoutItem[]; customer?: CheckoutCustomer };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { items, customer } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Cart is empty' }, { status: 400 });
  }

  if (!customer?.email) {
    return Response.json({ error: 'Customer email is required' }, { status: 400 });
  }

  const origin =
    req.headers.get('origin') ||
    Netlify.env.get('NEXT_PUBLIC_SITE_URL') ||
    Netlify.env.get('URL') ||
    'https://vikingfuel.se';

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => {
        const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
          name: item.name,
        };
        if (item.image && /^https?:\/\//i.test(item.image)) {
          productData.images = [item.image];
        }
        return {
          price_data: {
            currency: 'sek',
            product_data: productData,
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      }),
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
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config = {
  path: '/api/checkout',
  method: 'POST',
};
