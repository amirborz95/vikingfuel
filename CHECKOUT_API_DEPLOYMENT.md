# Stripe Checkout API - Deployment Guide

## Overview
Since your frontend is on static hosting (hostup.se), the Stripe API server needs to be deployed separately. This guide shows how to deploy the `checkout-api.js` server.

## Quick Deploy Options

### Option 1: Deploy to Vercel (RECOMMENDED - Free)
1. Go to https://vercel.com and sign up/login
2. Click "Add New..." → "Project"
3. Import this GitHub repo or upload files
4. Set environment variables in Vercel dashboard:
   - `STRIPE_SECRET_KEY` = sk_live_your_secret_key_here
   - `STRIPE_WEBHOOK_SECRET` = whsec_... (from your Stripe Dashboard)
5. Vercel will auto-deploy
6. Your API URL will be: `https://your-project.vercel.app`

Update in `src/app/checkout/page.tsx`:
```javascript
const response = await fetch('https://your-project.vercel.app/checkout', {
```

### Option 2: Deploy to Heroku (Free/Paid)
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Run: `heroku login`
3. Create Procfile:
```
web: node checkout-api.js
```
4. Deploy:
```bash
heroku create your-app-name
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
git push heroku main
```
5. Your API URL will be: `https://your-app-name.herokuapp.com`

### Option 3: Deploy to Railway (Simple)
1. Go to https://railway.app
2. Sign up and connect your GitHub/GitLab
3. Create new project from repo
4. Add environment variables (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
5. Deploy - Railway handles it automatically

### Option 4: Local Development (Testing)
```bash
npm install -g nodemon
npm install  # Install dependencies for checkout-api
npm run dev  # Run locally on localhost:3001
```

## Environment Variables Needed
```
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe Dashboard → Webhooks)
PORT=3001
```

## Update Frontend After Deployment
Once you have your API URL, update `src/app/checkout/page.tsx` line 60:
```typescript
const response = await fetch('https://your-api-url.com/checkout', {
```

Replace `https://your-api-url.com` with your actual API endpoint.

## Files to Deploy
- `checkout-api.js` - Main API server
- `checkout-api-package.json` - Rename to `package.json` when deploying
- `.env` file with environment variables

## How It Works
1. User fills checkout form on vikingfuel.se
2. Frontend sends cart items to your API server
3. API server creates Stripe Checkout Session
4. User is redirected to Stripe's hosted checkout page
5. After payment, redirects to success/cancel page
6. Works with any cart amount - Stripe handles pricing automatically

## API Endpoints

### POST /checkout
Creates a Stripe checkout session
```json
{
  "items": [
    { "priceId": "price_...", "quantity": 1 }
  ],
  "customer": {
    "name": "John",
    "email": "john@example.com",
    "phone": "+46701234567",
    "address": "Storgatan 1",
    "city": "Stockholm",
    "postalCode": "10001"
  },
  "successUrl": "https://vikingfuel.se/checkout/success",
  "cancelUrl": "https://vikingfuel.se/checkout/cancel"
}
```

Returns:
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_..."
}
```

### GET /health
Health check endpoint

## Troubleshooting

### "CORS error"
Make sure your Stripe API URL is correctly set in checkout/page.tsx

### "Invalid price ID"
Verify price IDs in `checkout-api.js` match your Stripe products

### "Webhook signature verification failed"
Ensure `STRIPE_WEBHOOK_SECRET` is correct from Stripe Dashboard

## Questions?
- Stripe Docs: https://docs.stripe.com/checkout
- Vercel Deployment: https://vercel.com/docs
- Heroku Deployment: https://devcenter.heroku.com
