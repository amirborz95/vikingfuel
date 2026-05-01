const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Viking Fuel Checkout API is running!' });
});

// Checkout session endpoint
app.post('/checkout', async (req, res) => {
  try {
    const { items, customer, successUrl, cancelUrl } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate customer email
    if (!customer?.email) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      customer_email: customer.email,
      client_reference_id: `${customer.email}_${Date.now()}`,
      metadata: {
        customer_name: customer.name || '',
        customer_phone: customer.phone || '',
        customer_address: customer.address || '',
        customer_city: customer.city || '',
        customer_postal_code: customer.postalCode || '',
      },
      success_url: successUrl || 'https://vikingfuel.se/checkout/success',
      cancel_url: cancelUrl || 'https://vikingfuel.se/checkout/cancel',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
    });

    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
});

// Webhook endpoint for Stripe events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Payment successful:', session.id);
      // TODO: Update your database, send confirmation email, etc.
    }

    // Handle charge.failed
    if (event.type === 'charge.failed') {
      const charge = event.data.object;
      console.log('❌ Payment failed:', charge.id);
      // TODO: Handle failed payment
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Viking Fuel Checkout API running on port ${PORT}`);
});

module.exports = app;