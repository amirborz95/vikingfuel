#!/bin/bash

echo "🚀 Deploying Viking Fuel Checkout API to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying API..."
vercel --prod

echo "✅ API deployed! Update your checkout page with the new URL."
echo "Copy the deployment URL and update src/app/checkout/page.tsx"