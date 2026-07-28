import ClientCheckoutSuccess from './ClientCheckoutSuccess';

export default function Page({
  searchParams,
}: {
  searchParams?: { session_id?: string; payment_intent?: string };
}) {
  const sessionId = searchParams?.session_id || null;
  const paymentIntentId = searchParams?.payment_intent || null;

  return <ClientCheckoutSuccess sessionId={sessionId} paymentIntentId={paymentIntentId} />;
}
