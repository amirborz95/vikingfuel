import Stripe from 'stripe';

const allowedCountries = ['SE', 'NO', 'DK', 'FI'] as const;

type CheckoutSessionCreateParams = NonNullable<
  Parameters<Stripe['checkout']['sessions']['create']>[0]
>;
type CheckoutLineItem = NonNullable<CheckoutSessionCreateParams['line_items']>[number];

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Stripe is not configured');
  }

  return new Stripe(secretKey);
}

function getBaseUrl(req: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    if (configuredUrl) {
      return new URL(configuredUrl).origin;
    }
  } catch {
    // Fall back to the request origin below.
  }

  return new URL(req.url).origin;
}

function getAbsoluteImageUrl(image: unknown, baseUrl: string) {
  if (typeof image !== 'string' || !image) {
    return undefined;
  }

  try {
    const url = new URL(image, baseUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function createLineItem(item: any, baseUrl: string): CheckoutLineItem {
  const quantity = Math.max(1, Number(item.quantity) || 1);

  if (typeof item.priceId === 'string' && item.priceId.startsWith('price_')) {
    return {
      price: item.priceId,
      quantity,
    };
  }

  const name =
    typeof item.name === 'string' && item.name.trim() ? item.name.trim() : 'Viking Fuel produkt';
  const price = Number(item.price);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Invalid item price');
  }

  const imageUrl = getAbsoluteImageUrl(item.image, baseUrl);

  return {
    price_data: {
      currency: 'sek',
      product_data: {
        name,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
      unit_amount: Math.round(price * 100),
    },
    quantity,
  };
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!Array.isArray(items) || items.length === 0 || !customer?.email) {
      return json({ error: 'Missing items or customer info' }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = getBaseUrl(req);
    const country = allowedCountries.includes(customer.country) ? customer.country : 'SE';
    const lineItems = items.map((item: any) => createLineItem(item, baseUrl));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_email: customer.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [...allowedCountries],
      },
      metadata: {
        customer_name: customer.name || '',
        customer_phone: customer.phone || '',
        customer_address: customer.address || '',
        customer_city: customer.city || '',
        customer_postal_code: customer.postalCode || '',
        customer_country: country,
      },
    });

    return json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
};

export const config = {
  path: '/api/checkout',
  method: 'POST',
};
