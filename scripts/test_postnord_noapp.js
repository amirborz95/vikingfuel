const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
envText.split(/\r?\n/).forEach((line) => {
  const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
  if (m) {
    const key = m[1];
    let val = m[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
});

const apiKey = process.env.POSTNORD_API_KEY;
const rawApiBaseUrl = process.env.POSTNORD_API_BASE_URL || 'https://api2.postnord.com';
const apiBaseUrl = rawApiBaseUrl.replace(/\/rest\/?$/, '');
const consignorCustomerNumber = process.env.POSTNORD_CUSTOMER_NUMBER || '';
const consignorIssuerCode = process.env.POSTNORD_CONSIGNOR_ISSUER_CODE || 'Z12';
const consignorPartyIdType = process.env.POSTNORD_CONSIGNOR_PARTY_ID_TYPE || '160';
const senderName = process.env.POSTNORD_SENDER_NAME || 'Vikingfuel';
const senderAddressLine1 = process.env.POSTNORD_SENDER_ADDRESS_LINE1 || '';
const senderPostalCode = process.env.POSTNORD_SENDER_POSTCODE || '';
const senderCity = process.env.POSTNORD_SENDER_CITY || '';
const senderCountry = process.env.POSTNORD_SENDER_COUNTRY || 'SE';

async function run() {
  if (!apiKey) {
    console.error('Missing POSTNORD_API_KEY in .env.local');
    process.exit(1);
  }
  if (!consignorCustomerNumber) {
    console.error('Missing POSTNORD_CUSTOMER_NUMBER in .env.local');
    process.exit(1);
  }

  const orderId = `test-noapp-${Date.now()}`;

  const payload = {
    messageDate: new Date().toISOString(),
    messageFunction: 'Instruction',
    messageId: `order-${orderId}`,
    updateIndicator: 'Original',
    shipment: [
      {
        shipmentIdentification: { shipmentId: orderId },
        dateAndTimes: { loadingDate: new Date().toISOString() },
        service: { basicServiceCode: '19' },
        references: [{ referenceNo: orderId, referenceType: 'CU' }],
        numberOfPackages: { value: 1 },
        totalGrossWeight: { value: 1.0, unit: 'KGM' },
        parties: {
          consignor: {
            issuerCode: consignorIssuerCode,
            partyIdentification: { partyId: consignorCustomerNumber, partyIdType: consignorPartyIdType },
            party: {
              nameIdentification: { name: senderName },
              address: { streets: [senderAddressLine1], postalCode: senderPostalCode, city: senderCity, countryCode: senderCountry },
            },
          },
          consignee: {
            party: {
              nameIdentification: { name: 'Test Recipient' },
              address: { streets: ['Kundgatan 1'], postalCode: '11122', city: 'Stockholm', countryCode: 'SE' },
              contact: { contactName: 'Test', emailAddress: 'test@example.com', smsNo: '' },
            },
          },
        },
        goodsItem: [
          {
            packageTypeCode: 'PC',
            items: [
              { itemIdentification: { itemId: '0', itemIdType: 'SSCC' }, grossWeight: { value: 1.0, unit: 'KGM' } },
            ],
          },
        ],
      },
    ],
  };

  const url = `${apiBaseUrl}/rest/shipment/v3/edi?apikey=${encodeURIComponent(apiKey)}`;
  console.log('Request URL:', url.replace(apiKey, '***REDACTED***'));
  console.log('Payload:', JSON.stringify(payload));

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    console.log('Status:', resp.status, resp.statusText);
    try {
      console.log('Body JSON:', JSON.stringify(JSON.parse(text), null, 2));
    } catch (e) {
      console.log('Body RAW:', text);
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
}

run();
