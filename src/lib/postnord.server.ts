import { orderWeightGrams } from './shipping';

const apiKey = process.env.POSTNORD_API_KEY || '';
const rawApiBaseUrl = process.env.POSTNORD_API_BASE_URL || 'https://api2.postnord.com';
const apiBaseUrl = rawApiBaseUrl.replace(/\/rest\/?$/, '');
const senderName = process.env.POSTNORD_SENDER_NAME || '';
const senderAddressLine1 = process.env.POSTNORD_SENDER_ADDRESS_LINE1 || '';
const senderPostalCode = process.env.POSTNORD_SENDER_POSTCODE || '';
const senderCity = process.env.POSTNORD_SENDER_CITY || '';
const senderCountry = process.env.POSTNORD_SENDER_COUNTRY || 'SE';
const consignorCustomerNumber = process.env.POSTNORD_CUSTOMER_NUMBER || '';
const consignorIssuerCode = process.env.POSTNORD_CONSIGNOR_ISSUER_CODE || 'Z12';
const consignorPartyIdType = process.env.POSTNORD_CONSIGNOR_PARTY_ID_TYPE || '160';
// applicationId 2624 was provisioned for Vikingfuel by PostNord API support
// (replaces 1438, which returned a LogMode fault and never produced real labels).
const postNordApplicationId = Number(process.env.POSTNORD_APPLICATION_ID || '2624');
const postNordApplicationName = process.env.POSTNORD_APPLICATION_NAME || 'PostNord';
const postNordApplicationVersion = process.env.POSTNORD_APPLICATION_VERSION || '1.0';
const forceNoApplication = process.env.POSTNORD_FORCE_NO_APPLICATION === 'true';

// PostNord basicServiceCodes (API still uses the old "MyPack" names; PostNord
// now markets these simply as Home Small / Collect / Home):
//   30 = Home Small — cheap letterbox home delivery, SE domestic, ≤3 kg
//   19 = Collect — service point / ombud (pricier)
//   17 = Home — door delivery
// Small domestic parcels ship as Home Small (30); heavier (>3 kg) or non-domestic
// fall back to Collect (19). Override everything with POSTNORD_SERVICE_CODE.
export function postnordServiceCode(countryCode: string | undefined, weightKg: number): string {
  const override = (process.env.POSTNORD_SERVICE_CODE || '').trim();
  if (override) return override;
  const isDomesticSE = (countryCode || 'SE').toUpperCase() === 'SE';
  return isDomesticSE && weightKg <= 3 ? '30' : '19';
}

if (!apiKey) {
  console.warn('POSTNORD_API_KEY is not configured. PostNord shipment creation will be disabled.');
}

if (!senderName || !senderAddressLine1 || !senderPostalCode || !senderCity) {
  console.warn('PostNord sender address is not fully configured. Set POSTNORD_SENDER_* env vars.');
}

export type PostNordShippingDetails =
  | {
      name?: string | null;
      phone?: string | null;
      address?: {
        line1?: string | null;
        line2?: string | null;
        postal_code?: string | null;
        city?: string | null;
        country?: string | null;
      } | null;
    }
  | null;

export interface CreatePostNordShipmentArgs {
  orderId: string;
  packageDescription: string;
  items: Array<{ name: string; quantity: number; price: number; units?: number }>;
  totalAmount: number;
  customerEmail: string;
  shippingDetails: PostNordShippingDetails;
}

export interface PostNordShipmentResult {
  shipmentId: string;
  labelUrl?: string;
  labelPdfUrl?: string;
  trackingNumber?: string;
  rawResponse: any;
}

export async function createPostNordShipment(
  args: CreatePostNordShipmentArgs
): Promise<PostNordShipmentResult | null> {
  if (!apiKey) {
    return null;
  }

  if (!args.shippingDetails || !args.shippingDetails.address) {
    throw new Error('Missing shipping address details for PostNord shipment');
  }

  if (!senderName || !senderAddressLine1 || !senderPostalCode || !senderCity) {
    throw new Error('PostNord sender address is not configured via environment variables');
  }

  const recipient = {
    name: args.shippingDetails.name || 'Kund',
    email: args.customerEmail,
    phone: args.shippingDetails.phone || '',
    addressLine1: args.shippingDetails.address?.line1 || '',
    addressLine2: args.shippingDetails.address?.line2 || '',
    postalCode: args.shippingDetails.address?.postal_code || '',
    city: args.shippingDetails.address?.city || '',
    countryCode: args.shippingDetails.address?.country || 'SE',
  };

  if (!consignorCustomerNumber) {
    throw new Error('Missing PostNord consignor customer number. Set POSTNORD_CUSTOMER_NUMBER in your environment.');
  }

  // Declare the real parcel weight so PostNord bills the correct (small) tier —
  // a hardcoded 1 kg pushed every parcel into a far pricier bracket.
  const totalBottles = (args.items || []).reduce(
    (sum, it) => sum + (it.units ?? 1) * (it.quantity || 1),
    0
  );
  const weightKg = Math.max(0.1, Math.round(orderWeightGrams(totalBottles)) / 1000);

  const serviceCode = postnordServiceCode(recipient.countryCode, weightKg);

  const buildPayload = (includeApplication = true) => {
    const data: any = {
      messageDate: new Date().toISOString(),
      messageFunction: 'Instruction',
      messageId: `order-${args.orderId}`,
      updateIndicator: 'Original',
      shipment: [
        {
          shipmentIdentification: {
            shipmentId: args.orderId,
          },
          dateAndTimes: {
            loadingDate: new Date().toISOString(),
          },
          service: {
            basicServiceCode: serviceCode,
          },
          references: [
            {
              referenceNo: args.orderId,
              referenceType: 'CU',
            },
          ],
          numberOfPackages: {
            value: 1,
          },
          totalGrossWeight: {
            value: weightKg,
            unit: 'KGM',
          },
          parties: {
            consignor: {
              issuerCode: consignorIssuerCode,
              partyIdentification: {
                partyId: consignorCustomerNumber,
                partyIdType: consignorPartyIdType,
              },
              party: {
                nameIdentification: {
                  name: senderName,
                },
                address: {
                  streets: [senderAddressLine1],
                  postalCode: senderPostalCode,
                  city: senderCity,
                  countryCode: senderCountry,
                },
              },
            },
            consignee: {
              party: {
                nameIdentification: {
                  name: recipient.name,
                },
                address: {
                  streets: [recipient.addressLine1, recipient.addressLine2].filter(Boolean),
                  postalCode: recipient.postalCode,
                  city: recipient.city,
                  countryCode: recipient.countryCode,
                },
                contact: {
                  contactName: recipient.name,
                  emailAddress: recipient.email,
                  smsNo: recipient.phone,
                },
              },
            },
          },
          goodsItem: [
            {
              packageTypeCode: 'PC',
              items: [
                {
                  itemIdentification: {
                    itemId: '0',
                    itemIdType: 'SSCC',
                  },
                  grossWeight: {
                    value: weightKg,
                    unit: 'KGM',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    if (includeApplication) {
      data.application = {
        applicationId: postNordApplicationId,
        name: postNordApplicationName,
        version: postNordApplicationVersion,
      };
    }

    return data;
  };

  const getCompositeFaults = (data: any) =>
    data?.compositeFault?.faults ||
    (Array.isArray(data?.idInformation) && data.idInformation[0]?.errorResponse?.compositeFault?.faults) ||
    null;

  const extractShipmentInfo = (data: any) => {
    const bookingId =
      data?.bookingId ||
      data?.shipmentId ||
      data?.id ||
      (Array.isArray(data?.idInformation) &&
        data.idInformation[0]?.references?.shipment?.find((r: any) => r.referenceType === 'IL')?.referenceNo) ||
      '';

    const idInfo = Array.isArray(data?.idInformation) ? data.idInformation[0] : null;
    let trackingNumber: string | undefined = undefined;
    if (idInfo) {
      if (Array.isArray(idInfo.ids) && idInfo.ids.length > 0 && idInfo.ids[0].value) {
        trackingNumber = idInfo.ids[0].value;
      }
      if (!trackingNumber && Array.isArray(idInfo.urls)) {
        const trackingUrl = idInfo.urls.find((u: any) => (u.type || '').toUpperCase() === 'TRACKING')?.url;
        if (trackingUrl) {
          const m = trackingUrl.match(/[?&]id=([^&]+)/);
          trackingNumber = m ? decodeURIComponent(m[1]) : trackingUrl;
        }
      }
    }

    // Find a printable label URL. PostNord tags it differently depending on
    // account/mode — LABEL / PDF / ZPL type, or a url that contains "label".
    const findLabel = (pred: (u: any) => boolean) =>
      idInfo && Array.isArray(idInfo.urls) ? idInfo.urls.find(pred)?.url : undefined;

    const labelUrl =
      data?.labelUrl ||
      data?.printLabelUrl ||
      findLabel((u: any) => /LABEL/i.test(u?.type || '')) ||
      findLabel((u: any) => /\b(PDF|ZPL)\b/i.test(u?.type || '')) ||
      findLabel((u: any) => /label/i.test(u?.url || '')) ||
      undefined;

    const labelPdfUrl =
      data?.labelPdfUrl ||
      findLabel((u: any) => /PDF/i.test(u?.type || '') && /label/i.test(u?.url || '')) ||
      undefined;

    return { bookingId, trackingNumber, labelUrl, labelPdfUrl, rawJson: data };
  };

  const executeRequest = async (payload: any) => {
    const url = `${apiBaseUrl}/rest/shipment/v3/edi?apikey=${encodeURIComponent(apiKey)}`;
    const payloadJson = JSON.stringify(payload);

    console.log('🚀 PostNord API Request URL:', url.replace(apiKey, '***REDACTED***'));
    console.log('🚀 PostNord API Request PAYLOAD:', payloadJson);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: payloadJson,
    });

    const responseText = await response.text();
    let json: any = null;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      // not JSON
    }

    console.log('📦 PostNord API Response STATUS:', response.status, response.statusText);
    console.log('📦 PostNord API Response RAW:', responseText);
    if (json) {
      console.log('📦 PostNord API Response JSON:', JSON.stringify(json, null, 2));
    }

    const faults = getCompositeFaults(json);
    if (faults) {
      console.log('📦 PostNord compositeFault.faults:', JSON.stringify(faults, null, 2));
    }

    return { response, json, responseText, faults };
  };

  const initialApplicationMode = forceNoApplication ? false : true;
  if (forceNoApplication) {
    console.warn('⚠️ POSTNORD_FORCE_NO_APPLICATION=true: sending PostNord payload without application block.');
  }

  const { response, json, faults, responseText } = await executeRequest(buildPayload(initialApplicationMode));

  if (!response.ok) {
    const message = (json && (json.error || json.message)) || `PostNord API error: ${response.status}`;
    console.error('❌ PostNord API Error:', {
      status: response.status,
      error: message,
      fullResponse: json || responseText,
    });
    throw new Error(JSON.stringify(json || { message: responseText }));
  }

  let shipmentInfo = extractShipmentInfo(json);

  const invalidApplicationFault = Array.isArray(faults)
    ? faults.some(
        (fault: any) =>
          fault.faultCode === 'SAE-BR-25062401' ||
          fault.explanationText?.includes('Invalid Customer Number for Application Id') ||
          fault.explanationText?.includes('ApplicationId: undefined is invalid')
      )
    : false;

  if (invalidApplicationFault) {
    if (shipmentInfo.bookingId || shipmentInfo.trackingNumber) {
      console.warn('⚠️ PostNord returned invalid application/customer fault but still provided booking/tracking info. Accepting the PostNord booking and avoiding duplicate retries.');
    } else if (initialApplicationMode) {
      console.warn('⚠️ PostNord returned invalid application/customer fault with no booking info. Retrying without application block.');
      const retryResult = await executeRequest(buildPayload(false));
      if (!retryResult.response.ok) {
        const message = (retryResult.json && (retryResult.json.error || retryResult.json.message)) || `PostNord API error: ${retryResult.response.status}`;
        console.error('❌ PostNord retry without application block failed:', {
          status: retryResult.response.status,
          error: message,
          fullResponse: retryResult.json || retryResult.responseText,
        });
        throw new Error(JSON.stringify(retryResult.json || { message: retryResult.responseText }));
      }
      shipmentInfo = extractShipmentInfo(retryResult.json);
      if (shipmentInfo.bookingId || shipmentInfo.trackingNumber) {
        console.log('✅ PostNord retry without application block succeeded.');
      }
    }
  }

  if (!shipmentInfo.bookingId && !shipmentInfo.trackingNumber) {
    console.error('❌ PostNord API did not return bookingId or tracking info', { json });
    throw new Error('PostNord API did not return bookingId or tracking info');
  }

  console.log('✅ PostNord booking accepted (may be LOG_MODE). BookingId:', shipmentInfo.bookingId, 'tracking:', shipmentInfo.trackingNumber);

  return {
    shipmentId: shipmentInfo.bookingId || args.orderId,
    labelUrl: shipmentInfo.labelUrl,
    labelPdfUrl: shipmentInfo.labelPdfUrl,
    trackingNumber: shipmentInfo.trackingNumber || undefined,
    rawResponse: shipmentInfo.rawJson || json || responseText,
  };
}
