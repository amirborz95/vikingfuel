import type { Config } from "@netlify/functions";
import Stripe from "stripe";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripeKey = Netlify.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Stripe is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(stripeKey);

  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!items || !customer) {
      return new Response(
        JSON.stringify({ error: "Missing items or customer info" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item: { name: string; price: number; quantity: number; image: string }) => ({
        price_data: {
          currency: "sek",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

    const orderAmount = line_items.reduce(
      (sum, item) =>
        sum +
        (item.price_data?.unit_amount || 0) * (item.quantity || 1),
      0
    );

    const freeShipping = orderAmount >= 50000;
    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
      [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: freeShipping ? 0 : 5900,
              currency: "sek",
            },
            display_name: freeShipping
              ? "Fri frakt över 500 kr"
              : "Standardfrakt upp till 5 kg",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ];

    const siteUrl =
      Netlify.env.get("NEXT_PUBLIC_SITE_URL") || Netlify.env.get("URL") || "";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      line_items,
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      customer_email: customer.email,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI"],
      },
      shipping_options: shippingOptions,
      metadata: {
        ...(customer.name ? { customer_name: customer.name } : {}),
        ...(customer.phone ? { customer_phone: customer.phone } : {}),
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/checkout",
  method: "POST",
};
