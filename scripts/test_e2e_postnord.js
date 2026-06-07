const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
envText.split(/\r?\n/).forEach((line) => {
  const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
  if (m) {
    const key = m[1];
    let val = m[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
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

if (!apiKey) {
  console.error('Missing POSTNORD_API_KEY');
  process.exit(1);
}
if (!consignorCustomerNumber) {
  console.error('Missing POSTNORD_CUSTOMER_NUMBER');
  process.exit(1);
}

(async function run() {
  const orderId = `e2e-test-${Date.now()}`;
  const recipientEmail = 'amirborzlaev@gmail.com';

  const payload = {
    messageDate: new Date().toISOString(),
    messageFunction: 'Instruction',
    messageId: `order-${orderId}`,
    application: {
      applicationId: Number(process.env.POSTNORD_APPLICATION_ID || 1438),
      name: process.env.POSTNORD_APPLICATION_NAME || 'PostNord',
      version: process.env.POSTNORD_APPLICATION_VERSION || '1.0',
    },
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
              contact: { contactName: 'Test', emailAddress: recipientEmail, smsNo: '' },
            },
          },
        },
        goodsItem: [
          { packageTypeCode: 'PC', items: [{ itemIdentification: { itemId: '0', itemIdType: 'SSCC' }, grossWeight: { value: 1.0, unit: 'KGM' } }] },
        ],
      },
    ],
  };

  const url = `${apiBaseUrl}/rest/shipment/v3/edi?apikey=${encodeURIComponent(apiKey)}`;
  console.log('Posting to PostNord:', url.replace(apiKey, '***REDACTED***'));

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) { }

    console.log('Status:', resp.status, resp.statusText);
    console.log('Response:', json || text);

    // Extract bookingId and tracking
    let bookingId = json?.bookingId || '';
    let tracking = '';
    if (!tracking && Array.isArray(json?.idInformation) && json.idInformation[0]) {
      const idInfo = json.idInformation[0];
      if (Array.isArray(idInfo.ids) && idInfo.ids[0]?.value) tracking = idInfo.ids[0].value;
      if (!tracking && Array.isArray(idInfo.urls)) {
        const turl = idInfo.urls.find((u) => (u.type||'').toUpperCase() === 'TRACKING')?.url;
        if (turl) {
          const m = turl.match(/[?&]id=([^&]+)/);
          tracking = m ? decodeURIComponent(m[1]) : turl;
        }
      }
      if (!bookingId) {
        const ref = idInfo.references?.shipment?.find((r) => r.referenceType === 'IL');
        if (ref) bookingId = ref.referenceNo;
      }
    }

    console.log('Extracted bookingId:', bookingId, 'tracking:', tracking);

    // Save to data/users.json
    const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
    const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')) : [];
    let user = users.find(u => u.email === recipientEmail);
    if (!user) { user = { email: recipientEmail, name: null, orders: [] }; users.push(user); }
    const order = {
      id: orderId,
      sessionId: `test-session-${Date.now()}`,
      items: [{ name: 'E2E Test Item', quantity: 1, price: 3 }],
      totalAmount: 3,
      currency: 'SEK',
      status: 'completed',
      paymentMethod: 'test',
      shippingAddress: { name: 'Test Recipient', address: { line1: 'Kundgatan 1', postal_code: '11122', city: 'Stockholm', country: 'SE' } },
      shippingOption: 'postnord',
      shippingPostcode: '11122',
      postnordShipmentId: bookingId || null,
      postnordLabelUrl: null,
      postnordLabelPdfUrl: null,
      postnordTracking: tracking || null,
      createdAt: new Date().toISOString(),
    };
    user.orders.push(order);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('Saved test order to', USERS_FILE);

    // Send test emails via SMTP
    const smtpHost = process.env.SMTP_HOST || '';
    const smtpPort = Number(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP not fully configured; skipping email send');
      return;
    }

    const transporter = nodemailer.createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user: smtpUser, pass: smtpPass } });

    const orderText = `Hej!\n\nTack för din beställning.\nOrdernummer: ${orderId}\nPostNord-nummer: ${bookingId || 'Ej tillgängligt'}\nSpårningsnummer: ${tracking || 'Ej tillgängligt'}\n\nMed vänlig hälsning,\nVikingfuel`;

    console.log('Sending order confirmation to', recipientEmail);
    await transporter.sendMail({ from: process.env.ORDER_CONFIRMATION_SENDER || smtpUser, to: recipientEmail, subject: 'Test Orderbekräftelse — Vikingfuel', text: orderText });
    console.log('Order confirmation sent');

    if (tracking) {
      const shipText = `Hej!\n\nDin beställning ${orderId} har skickats via PostNord.\nPostNord-nummer: ${bookingId}\nSpårningsnummer: ${tracking}\n\nMed vänlig hälsning,\nVikingfuel`;
      console.log('Sending shipping notification to', recipientEmail);
      await transporter.sendMail({ from: process.env.ORDER_CONFIRMATION_SENDER || smtpUser, to: recipientEmail, subject: 'Din beställning har skickats — spårningsnummer', text: shipText });
      console.log('Shipping notification sent');
    }

    console.log('E2E test finished');
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
