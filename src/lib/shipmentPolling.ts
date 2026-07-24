import { readUsers, writeUsers } from './auth';
import { getShipmentTrackingStatus } from './postnordTracking';
import { sendShippingNotificationForStoredOrder } from './orderConfirmation';

export interface PollResult {
  checked: number;
  shippedNow: number;
  emailed: number;
  details: Array<{ orderId: string; email: string; status: string }>;
}

/**
 * Polls PostNord tracking for every PostNord order that has a tracking number
 * but isn't marked shipped yet. When PostNord reports the parcel has physically
 * entered the network (i.e. it was scanned at drop-off), the order is
 * auto-marked "shipped", the shipping confirmation email is sent to the customer
 * (once), and the latest status is stored for the admin view.
 */
export async function pollAndUpdateShipments(): Promise<PollResult> {
  const users = await readUsers();
  const result: PollResult = { checked: 0, shippedNow: 0, emailed: 0, details: [] };
  let mutated = false;

  for (const user of users as any[]) {
    for (const order of user.orders || []) {
      const isPostNord = String(order.shippingOption || '').toLowerCase().includes('postnord');
      if (!isPostNord) continue;
      if (order.status === 'shipped') continue;
      if (!order.postnordTracking) continue;

      result.checked++;
      let tracking;
      try {
        tracking = await getShipmentTrackingStatus(order.postnordTracking);
      } catch (e) {
        console.error(`Tracking check failed for order ${order.id}:`, e);
        continue;
      }
      if (!tracking.found) continue;

      // Always store the latest raw status so the admin can see progress.
      if (order.postnordStatus !== tracking.status) {
        order.postnordStatus = tracking.status;
        mutated = true;
      }

      if (tracking.shipped) {
        order.status = 'shipped';
        order.shippedAt = order.shippedAt || new Date().toISOString();
        mutated = true;
        result.shippedNow++;

        if (!order.shippingEmailSent) {
          try {
            await sendShippingNotificationForStoredOrder(order, user.email, order.postnordTracking);
            order.shippingEmailSent = true;
            result.emailed++;
          } catch (e) {
            console.error(`Shipping email failed for order ${order.id}:`, e);
          }
        }

        result.details.push({ orderId: order.id, email: user.email, status: tracking.status });
        console.log(`Order ${order.id} auto-marked shipped (PostNord status: ${tracking.status})`);
      }
    }
  }

  if (mutated) await writeUsers(users);
  return result;
}
