import ClientCheckoutSuccess from './ClientCheckoutSuccess';

export default function Page({
  searchParams,
}: {
  searchParams?: { session_id?: string; payment_intent?: string; subscription?: string; sub?: string };
}) {
  const sessionId = searchParams?.session_id || null;
  const paymentIntentId = searchParams?.payment_intent || null;
  const isSubscription = searchParams?.subscription === '1';
  const subscriptionId = searchParams?.sub || null;

  return (
    <ClientCheckoutSuccess
      sessionId={sessionId}
      paymentIntentId={paymentIntentId}
      isSubscription={isSubscription}
      subscriptionId={subscriptionId}
    />
  );
}
