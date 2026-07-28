'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getShippingCost } from '@/lib/shipping';
import { COUNTRIES } from '@/lib/countries';
import AppImage from '@/components/ui/AppImage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function kr(n: number) {
  return `${n.toLocaleString('sv-SE')} kr`;
}

function PaymentSection({ total, en, onBack }: { total: number; en: boolean; onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    });
    if (error) {
      setError(error.message || (en ? 'Payment failed.' : 'Betalningen misslyckades.'));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <PaymentElement />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-foreground px-5 py-4 text-base font-bold text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
      >
        {loading ? (en ? 'Processing...' : 'Bearbetar...') : `${en ? 'Pay' : 'Betala'} ${kr(total)}`}
      </button>
      <button type="button" onClick={onBack} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
        {en ? '← Back to details' : '← Tillbaka till uppgifter'}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        {en ? 'Secure payment powered by Stripe.' : 'Säker betalning via Stripe.'}
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice, totalUnits } = useCart();
  const { lang } = useLanguage();
  const en = lang === 'en';

  const [hasMounted, setHasMounted] = useState(false);
  const [country, setCountry] = useState('SE');
  const [method, setMethod] = useState<'pickup' | 'postnord'>('pickup');
  const [form, setForm] = useState({ email: '', name: '', phone: '', line1: '', line2: '', postcode: '', city: '' });
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setHasMounted(true), []);
  useEffect(() => {
    if (user?.email) setForm((p) => ({ ...p, email: user.email, name: p.name || user.name || '' }));
  }, [user]);

  // Pickup only exists for Sweden; force PostNord for other countries.
  useEffect(() => {
    if (country !== 'SE' && method === 'pickup') setMethod('postnord');
  }, [country, method]);

  const subtotal = totalPrice;
  const shippingCost = useMemo(() => getShippingCost(method, country, subtotal), [method, country, subtotal]);
  const total = subtotal + shippingCost;
  const vat = Math.round((total - total / 1.06) * 100) / 100;

  if (!hasMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container-wide">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">{en ? 'Your cart is empty' : 'Din varukorg är tom'}</h1>
            <p className="text-muted-foreground mb-8">{en ? 'Add some products to continue to checkout.' : 'Lägg till några produkter för att fortsätta till kassan.'}</p>
            <Link href="/products" className="inline-flex border border-foreground px-6 py-3 text-sm font-bold text-foreground hover:bg-slate-100 transition-colors">
              {en ? 'Shop now' : 'Handla nu'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const needsAddress = method === 'postnord';
  const canPay =
    !!form.email &&
    (!needsAddress || (form.name && form.line1 && form.postcode && form.city));

  const startPayment = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({ name: it.name, price: it.price, quantity: it.quantity, image: it.image })),
          customer: { email: form.email, name: form.name, phone: form.phone },
          shipping: { method, country, line1: form.line1, line2: form.line2, postcode: form.postcode, city: form.city },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to start payment');
      setClientSecret(data.clientSecret);
    } catch (e: any) {
      setError(e?.message || (en ? 'Something went wrong.' : 'Något gick fel.'));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-border bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-xl';

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">{en ? 'Checkout' : 'Kassa'}</p>
          <h1 className="text-4xl font-bold text-foreground">{en ? 'Complete your purchase' : 'Slutför ditt köp'}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2.5fr_1.5fr]">
          <div className="space-y-8">
            {!clientSecret ? (
              <section className="border border-border bg-slate-50 p-6 sm:p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-foreground mb-5">{en ? 'Your details' : 'Dina uppgifter'}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Email' : 'E-post'}</label>
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className={inputCls} placeholder="din.email@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Country' : 'Land'}</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Delivery method' : 'Leveranssätt'}</label>
                    <div className="space-y-3">
                      {country === 'SE' && (
                        <label className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${method === 'pickup' ? 'border-foreground bg-primary/5' : 'border-border'}`}>
                          <input type="radio" checked={method === 'pickup'} onChange={() => setMethod('pickup')} className="h-4 w-4" />
                          <div>
                            <div className="font-semibold text-foreground">{en ? 'Pickup on location' : 'Hämta varan på plats'}</div>
                            <div className="text-sm text-muted-foreground">{en ? 'Always free.' : 'Alltid gratis.'}</div>
                          </div>
                        </label>
                      )}
                      <label className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${method === 'postnord' ? 'border-foreground bg-primary/5' : 'border-border'}`}>
                        <input type="radio" checked={method === 'postnord'} onChange={() => setMethod('postnord')} className="h-4 w-4" />
                        <div>
                          <div className="font-semibold text-foreground">{en ? 'PostNord shipping' : 'PostNord frakt'}</div>
                          <div className="text-sm text-muted-foreground">{shippingCost === 0 ? (en ? 'Free' : 'Gratis') : kr(shippingCost)}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {needsAddress && (
                    <div className="space-y-4 border-t border-border pt-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Full name' : 'Namn'}</label>
                        <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder={en ? 'Your name' : 'Ditt namn'} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Phone' : 'Telefon'}</label>
                        <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+46 70 123 45 67" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Street address' : 'Gatuadress'}</label>
                        <input value={form.line1} onChange={(e) => set('line1', e.target.value)} className={inputCls} placeholder={en ? 'Street and number' : 'Gata och nummer'} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'Postcode' : 'Postnummer'}</label>
                          <input value={form.postcode} onChange={(e) => set('postcode', e.target.value)} className={inputCls} placeholder="123 45" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">{en ? 'City' : 'Ort'}</label>
                          <input value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} placeholder="Stockholm" />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-sm text-rose-600">{error}</p>}

                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={!canPay || loading}
                    className="w-full bg-primary px-5 py-4 text-base font-bold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                  >
                    {loading ? (en ? 'Loading...' : 'Laddar...') : (en ? 'Continue to payment' : 'Fortsätt till betalning')}
                  </button>
                </div>
              </section>
            ) : (
              <section className="border border-border bg-slate-50 p-6 sm:p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-foreground mb-5">{en ? 'Payment' : 'Betalning'}</h2>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <PaymentSection total={total} en={en} onBack={() => setClientSecret('')} />
                </Elements>
              </section>
            )}

            <section className="border border-border bg-slate-50 p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">{en ? 'Your cart' : 'Din varukorg'}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden border border-border bg-white rounded-lg flex-shrink-0">
                      <AppImage src={item.image} alt={item.name} width={56} height={56} className="h-full w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size} · × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground whitespace-nowrap">{kr(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="border border-border bg-slate-50 p-8 rounded-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{en ? 'Order details' : 'Orderdetaljer'}</p>
              <div className="mt-4 space-y-4 text-sm text-foreground">
                <div className="flex justify-between border-b border-border pb-3">
                  <span>{en ? 'Subtotal' : 'Delbelopp'}</span>
                  <span>{kr(subtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span>{en ? 'Shipping' : 'Frakt'}</span>
                  <span>{shippingCost === 0 ? (en ? 'Free' : 'Gratis') : kr(shippingCost)}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span>{en ? 'VAT (6%)' : 'Moms (6%)'}</span>
                  <span>{vat.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr</span>
                </div>
                <div className="flex justify-between pt-3 text-lg font-semibold text-foreground">
                  <span>{en ? 'Total' : 'Total'}</span>
                  <span>{kr(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
