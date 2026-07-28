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
import PostNordLogo from '@/components/ui/PostNordLogo';
import PaymentMethods from '@/components/ui/PaymentMethods';

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
      <PaymentElement options={{ layout: 'tabs', wallets: { applePay: 'auto', googlePay: 'auto' } }} />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {loading ? (en ? 'Processing...' : 'Bearbetar...') : `${en ? 'Pay' : 'Betala'} ${kr(total)}`}
      </button>
      <button type="button" onClick={onBack} className="w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        {en ? '← Back to details' : '← Tillbaka till uppgifter'}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {en ? 'Secure payment powered by Stripe.' : 'Säker betalning via Stripe.'}
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
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
      <div className="min-h-screen bg-muted pt-24">
        <div className="container-wide">
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-10 text-center shadow-card">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-foreground">{en ? 'Your cart is empty' : 'Din varukorg är tom'}</h1>
            <p className="mb-8 text-muted-foreground">{en ? 'Add some products to continue to checkout.' : 'Lägg till några produkter för att fortsätta till kassan.'}</p>
            <Link href="/products" className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-95">
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

  const inputCls =
    'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';
  const labelCls = 'mb-2 block text-sm font-semibold text-foreground';

  return (
    <div className="min-h-screen bg-muted pb-16 pt-24">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/products" className="transition-colors hover:text-foreground">{en ? 'Shop' : 'Butik'}</Link>
            <span>/</span>
            <span className="font-medium text-foreground">{en ? 'Checkout' : 'Kassa'}</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{en ? 'Complete your purchase' : 'Slutför ditt köp'}</h1>
          <p className="mt-2 text-muted-foreground">
            {en ? 'Enter your details, choose delivery and pay securely.' : 'Fyll i dina uppgifter, välj leverans och betala säkert.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          {/* LEFT: form / payment */}
          <div className="space-y-6">
            {!clientSecret ? (
              <>
                {/* Contact + address */}
                <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
                    <h2 className="text-xl font-bold text-foreground">{en ? 'Your details' : 'Dina uppgifter'}</h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>{en ? 'Email' : 'E-post'}</label>
                      <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className={inputCls} placeholder="din.email@example.com" />
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Full name' : 'Namn'}</label>
                      <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder={en ? 'Your name' : 'Ditt namn'} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>{en ? 'Phone' : 'Telefon'}</label>
                        <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+46 70 123 45 67" />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Country' : 'Land'}</label>
                        <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Street address' : 'Gatuadress'}</label>
                      <input value={form.line1} onChange={(e) => set('line1', e.target.value)} className={inputCls} placeholder={en ? 'Street and number' : 'Gata och nummer'} />
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Apartment, suite, etc. (optional)' : 'Lägenhet, c/o m.m. (valfritt)'}</label>
                      <input value={form.line2} onChange={(e) => set('line2', e.target.value)} className={inputCls} placeholder={en ? 'Apartment, floor…' : 'Lägenhet, våning…'} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>{en ? 'Postcode' : 'Postnummer'}</label>
                        <input value={form.postcode} onChange={(e) => set('postcode', e.target.value)} className={inputCls} placeholder="123 45" />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'City' : 'Ort'}</label>
                        <input value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} placeholder="Stockholm" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Delivery method — under postcode/address */}
                <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
                    <h2 className="text-xl font-bold text-foreground">{en ? 'Delivery method' : 'Leveranssätt'}</h2>
                  </div>

                  <div className="space-y-4">
                    {country === 'SE' && (
                      <DeliveryOption
                        selected={method === 'pickup'}
                        onSelect={() => setMethod('pickup')}
                        en={en}
                        icon={
                          <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l1-5h16l1 5" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M9 13h6" />
                          </svg>
                        }
                        title={en ? 'Pickup on location' : 'Hämta varan på plats'}
                        desc={en ? 'Collect your order at our warehouse.' : 'Hämta din order på vårt lager.'}
                        priceLabel={en ? 'Free' : 'Gratis'}
                        free
                      />
                    )}

                    <DeliveryOption
                      selected={method === 'postnord'}
                      onSelect={() => setMethod('postnord')}
                      en={en}
                      icon={<PostNordLogo />}
                      title={en ? 'PostNord home delivery' : 'PostNord hemleverans'}
                      desc={en ? 'Delivered to your door in 2–4 business days.' : 'Levereras hem till dig på 2–4 arbetsdagar.'}
                      priceLabel={shippingCost === 0 ? (en ? 'Free' : 'Gratis') : kr(shippingCost)}
                      free={shippingCost === 0}
                    />
                  </div>

                  {needsAddress && !canPay && (
                    <p className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      {en ? 'Fill in name, address, postcode and city for PostNord delivery.' : 'Fyll i namn, adress, postnummer och ort för PostNord-leverans.'}
                    </p>
                  )}

                  {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={!canPay || loading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (en ? 'Loading...' : 'Laddar...') : (en ? 'Continue to payment' : 'Fortsätt till betalning')}
                    {!loading && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    )}
                  </button>
                </section>
              </>
            ) : (
              <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span>
                  <h2 className="text-xl font-bold text-foreground">{en ? 'Payment' : 'Betalning'}</h2>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <PaymentSection total={total} en={en} onBack={() => setClientSecret('')} />
                </Elements>
              </section>
            )}
          </div>

          {/* RIGHT: order summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-lg font-bold text-foreground">{en ? 'Order summary' : 'Ordersammanfattning'}</h2>
              </div>

              {/* Items */}
              <div className="space-y-4 px-6 py-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                      <AppImage src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-contain p-1" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold text-foreground">{kr(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-border px-6 py-5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{en ? 'Subtotal' : 'Delbelopp'}</span>
                  <span className="font-medium text-foreground">{kr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{en ? 'Shipping' : 'Frakt'}</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-primary' : 'text-foreground'}`}>
                    {shippingCost === 0 ? (en ? 'Free' : 'Gratis') : kr(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{en ? 'incl. VAT (6%)' : 'varav moms (6%)'}</span>
                  <span className="font-medium text-foreground">
                    {vat.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
                  <span className="text-base font-bold text-foreground">{en ? 'Total' : 'Total'}</span>
                  <span className="text-2xl font-bold text-foreground">{kr(total)}</span>
                </div>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-2 border-t border-border bg-muted/50 px-6 py-4 text-center">
                <Trust en={en} label={en ? 'Secure' : 'Säkert'} sub={en ? 'checkout' : 'köp'} icon="lock" />
                <Trust en={en} label={en ? 'Fast' : 'Snabb'} sub={en ? 'delivery' : 'leverans'} icon="truck" />
                <Trust en={en} label={en ? 'Easy' : 'Enkla'} sub={en ? 'returns' : 'returer'} icon="return" />
              </div>

              {/* Accepted payment methods */}
              <div className="border-t border-border px-6 py-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {en ? 'We accept' : 'Vi accepterar'}
                </p>
                <PaymentMethods />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Delivery option card with "Välj" button ─────────────────────────── */
function DeliveryOption({
  selected,
  onSelect,
  en,
  icon,
  title,
  desc,
  priceLabel,
  free,
}: {
  selected: boolean;
  onSelect: () => void;
  en: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  priceLabel: string;
  free?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center ${
        selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-foreground">{title}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${free ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              {priceLabel}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div className="flex-shrink-0 sm:pl-4">
        {selected ? (
          <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white sm:w-auto">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            {en ? 'Selected' : 'Vald'}
          </span>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="w-full rounded-xl border border-foreground px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-white sm:w-auto"
          >
            {en ? 'Select' : 'Välj'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Trust badge ─────────────────────────────────────────────────────── */
function Trust({ label, sub, icon }: { en: boolean; label: string; sub: string; icon: 'lock' | 'truck' | 'return' }) {
  const paths: Record<string, React.ReactNode> = {
    lock: (<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
    truck: (<><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>),
    return: (<><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></>),
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[icon]}
      </svg>
      <span className="text-[11px] font-semibold leading-tight text-foreground">{label}</span>
      <span className="text-[10px] leading-tight text-muted-foreground">{sub}</span>
    </div>
  );
}
