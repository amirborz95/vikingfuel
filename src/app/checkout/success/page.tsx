import ClientCheckoutSuccess from './ClientCheckoutSuccess';

export default function Page({ searchParams }: { searchParams?: { session_id?: string } }) {
  const sessionId = searchParams?.session_id || null;

  return <ClientCheckoutSuccess sessionId={sessionId} />;
}
