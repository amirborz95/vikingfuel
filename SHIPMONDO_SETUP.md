# Multi-carrier shipping via Shipmondo

Adds DHL, Earlybird, Budbee/Instabox and DB Schenker alongside PostNord + pickup,
with labels printed straight from the admin panel — the same flow as PostNord.

## How it works
- Customer picks a carrier at checkout (`src/lib/carriers.ts` is the catalog).
- On paid order, the shipment is booked automatically:
  - PostNord → existing `postnord.server.ts`
  - DHL / Earlybird / Budbee / Schenker → `shipmondo.server.ts` (Shipmondo API v3)
- Admin → "Skriv ut fraktsedel" opens the label. PostNord uses its public URL;
  Shipmondo labels are streamed through `/api/admin/label` (auth stays server-side).

## Turn it on
The new carriers are hidden until you set the flag below, so nothing changes in
the live store until everything is configured.

Set these environment variables (Netlify → Site settings → Environment variables):

```
# Show the Shipmondo carriers in checkout
NEXT_PUBLIC_SHIPMONDO_ENABLED=true

# Shipmondo credentials (Shipmondo → Settings → API)
SHIPMONDO_API_USER=your-api-user
SHIPMONDO_API_KEY=your-api-key

# Sender (falls back to POSTNORD_SENDER_* if unset)
SHIPMONDO_SENDER_NAME=Viking Fuel
SHIPMONDO_SENDER_ADDRESS1=Storgatan 1
SHIPMONDO_SENDER_POSTCODE=11122
SHIPMONDO_SENDER_CITY=Stockholm
SHIPMONDO_SENDER_COUNTRY=SE
SHIPMONDO_SENDER_EMAIL=info@vikingfuel.se
SHIPMONDO_SENDER_PHONE=+46...

# Per-carrier product codes — look these up in the Shipmondo web portal
# (or via the /products API) for YOUR agreements, then paste them here:
SHIPMONDO_PRODUCT_DHL=...
SHIPMONDO_PRODUCT_EARLYBIRD=...
SHIPMONDO_PRODUCT_BUDBEE=...
SHIPMONDO_PRODUCT_SCHENKER=...

# Optional
SHIPMONDO_OWN_AGREEMENT=false      # true = use your own carrier agreements
SHIPMONDO_SERVICE_CODES=           # e.g. EMAIL_NT (comma-separated)
```

## What still needs your input
1. A Shipmondo account + API credentials.
2. The exact `product_code` for each carrier (merchant-specific) — from the
   Shipmondo portal or `/products` endpoint. Prices in `carriers.ts` are
   placeholders; adjust to your real rates.
3. Verify one live test order per carrier — the label endpoint
   (`GET /shipments/{id}/label`) is implemented per Shipmondo's docs but wasn't
   testable here without live credentials.
