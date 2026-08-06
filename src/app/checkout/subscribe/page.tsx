'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { availableCarriers, carrierCost, getCarrier, carrierBrand, type CarrierDef } from '@/lib/carriers';
import { COUNTRIES } from '@/lib/countries';
import { SUB_PLANS, ALLOWED_SUB_PRICE_IDS } from '@/lib/subscriptions';
import { fbqTrack } from '@/lib/fbpixel';
import AppImage from '@/components/ui/AppImage';
import PostNordLogo from '@/components/ui/PostNordLogo';
import PaymentMethods from '@/components/ui/PaymentMethods';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Pack artwork by number of bottles — matches the product page bundles.
const PACK_IMG: Record<number, string> = {
  1: 'https://i.postimg.cc/5t5mBGsQ/neuralpony.png',
  3: 'https://i.postimg.cc/pdQBf7sR/neuralpony3.png',
  6: 'https://i.postimg.cc/zfwkCMxg/neuralpony6.png',
};

function kr(n: number) {
  return `${n.toLocaleString('sv-SE')} kr`;
}

function PaymentSection({ monthly, en, subscriptionId, onBack }: { monthly: number; en: boolean; subscriptionId: string; onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    const returnUrl = `${window.location.origin}/checkout/success?subscription=1${subscriptionId ? `&sub=${encodeURIComponent(subscriptionId)}` : ''}`;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
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
        {loading
          ? (en ? 'Processing...' : 'Bearbetar...')
          : `${en ? 'Start subscription' : 'Starta prenumeration'} · ${kr(monthly)}/${en ? 'mo' : 'mån'}`}
      </button>
      <button type="button" onClick={onBack} className="w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        {en ? '← Back to details' : '← Tillbaka till uppgifter'}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {en ? 'Secure recurring payment via Stripe. Cancel anytime.' : 'Säker återkommande betalning via Stripe. Avsluta när du vill.'}
      </p>
    </form>
  );
}

function SubscribeInner() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const en = lang === 'en';
  const params = useSearchParams();

  const priceId = params.get('plan') || '';
  const qty = Math.max(1, Math.min(10, Number(params.get('qty')) || 1));
  const planEntry = useMemo(
    () => Object.entries(SUB_PLANS).find(([, p]) => p.priceId === priceId),
    [priceId]
  );
  const valid = ALLOWED_SUB_PRICE_IDS.includes(priceId) && !!planEntry;
  const bottlesPerPack = planEntry ? Number(planEntry[0]) : 1;
  const monthly = planEntry ? planEntry[1].monthly : 0;
  const packLabel = bottlesPerPack === 1 ? 'Testo-support' : `Testo-support ${bottlesPerPack}-pack`;
  const packSub = `${bottlesPerPack * 60} ${en ? 'capsules' : 'kapslar'}`;

  const [hasMounted, setHasMounted] = useState(false);
  const [country, setCountry] = useState('SE');
  const [carrierId, setCarrierId] = useState('');
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', phone: '', line1: '', line2: '', postcode: '', city: '' });
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const carriers = useMemo(() => availableCarriers(country), [country]);
  const carrier = getCarrier(carrierId);
  const methodChosen = !!carrier;

  useEffect(() => setHasMounted(true), []);
  useEffect(() => {
    if (user?.email) setForm((p) => ({ ...p, email: user.email, name: p.name || user.name || '' }));
  }, [user]);

  useEffect(() => {
    if (carrierId && !carriers.some((c) => c.id === carrierId)) setCarrierId('');
  }, [carriers, carrierId]);

  // Monthly product subtotal, plus shipping computed exactly like the one-time
  // checkout (PostNord: free over 700 kr, otherwise 49 kr). Shipping recurs with
  // the subscription and is charged every month alongside the plan.
  const monthlySubtotal = monthly * qty;
  const shippingCost = useMemo(
    () => (carrierId ? carrierCost(carrierId, country, monthlySubtotal) : 0),
    [carrierId, country, monthlySubtotal]
  );
  const monthlyTotal = monthlySubtotal + shippingCost;

  if (!hasMounted) return null;

  if (!valid) {
    return (
      <div className="min-h-screen bg-muted pt-24">
        <div className="container-wide">
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-10 text-center shadow-card">
            <h1 className="mb-3 text-2xl font-bold text-foreground">{en ? 'Invalid subscription' : 'Ogiltig prenumeration'}</h1>
            <p className="mb-8 text-muted-foreground">{en ? 'This subscription plan could not be found.' : 'Den här prenumerationen kunde inte hittas.'}</p>
            <Link href="/products" className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-95">
              {en ? 'Back to shop' : 'Tillbaka till butiken'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const needsAddress = carrier?.needsAddress ?? false;

  const startPayment = async () => {
    setError('');

    const missing: string[] = [];
    if (!form.name.trim()) missing.push(en ? 'name' : 'namn');
    if (!form.email.trim()) missing.push(en ? 'email' : 'e-post');
    if (!form.phone.trim()) missing.push(en ? 'phone' : 'telefon');
    if (needsAddress) {
      if (!form.line1.trim()) missing.push(en ? 'street address' : 'gatuadress');
      if (!form.postcode.trim()) missing.push(en ? 'postcode' : 'postnummer');
      if (!form.city.trim()) missing.push(en ? 'city' : 'ort');
    }

    const parts: string[] = [];
    if (missing.length) parts.push((en ? 'fill in ' : 'fyll i ') + missing.join(', '));
    if (!methodChosen) {
      parts.push(en ? 'select a delivery method' : 'välj leveranssätt');
      setDeliveryOpen(true);
    }
    if (parts.length) {
      const joined = parts.join(en ? ' and ' : ' och ');
      setError((en ? 'Please ' : 'Vänligen ') + joined + '.');
      return;
    }

    fbqTrack('InitiateCheckout', {
      value: monthlyTotal,
      currency: 'SEK',
      num_items: qty,
      content_type: 'product_group',
    });

    setLoading(true);
    try {
      const res = await fetch('/api/create-subscription-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          quantity: qty,
          customer: { email: form.email, name: form.name, phone: form.phone },
          shipping: { carrier: carrierId, country, line1: form.line1, line2: form.line2, postcode: form.postcode, city: form.city },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to start subscription');
      setSubscriptionId(data.subscriptionId || '');
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
            <span className="font-medium text-foreground">{en ? 'Subscription' : 'Prenumeration'}</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{en ? 'Start your subscription' : 'Starta din prenumeration'}</h1>
          <p className="mt-2 text-muted-foreground">
            {en
              ? 'Enter your details, choose delivery and start your monthly subscription securely.'
              : 'Fyll i dina uppgifter, välj leverans och starta din månadsprenumeration säkert.'}
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

                {/* Delivery method */}
                <section className={`rounded-2xl border bg-white p-6 shadow-card transition-colors sm:p-8 ${!carrier && !deliveryOpen ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'}`}>
                  <button
                    type="button"
                    onClick={() => setDeliveryOpen((o) => !o)}
                    aria-expanded={deliveryOpen}
                    className="group -m-2 flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted/60"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-bold text-foreground">{en ? 'Monthly delivery' : 'Månadsleverans'}</span>
                      {!deliveryOpen && (
                        carrier ? (
                          <span className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center"><CarrierMark carrier={carrier} /></span>
                            <span className="font-semibold text-foreground">{carrierBrand(carrier, en)}</span>
                            <span>·</span>
                            {carrier.provider === 'pickup' ? (
                              <span className="font-semibold text-foreground">Alvesta</span>
                            ) : (
                              <span className={shippingCost === 0 ? 'font-semibold text-primary' : 'font-semibold text-foreground'}>
                                {shippingCost === 0 ? (en ? 'Free' : 'Fri frakt') : kr(shippingCost)}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="mt-0.5 block text-sm font-medium text-muted-foreground">
                            {en ? 'Choose how you want your order delivered' : 'Välj hur du vill få din order levererad'}
                          </span>
                        )
                      )}
                    </span>
                    {/* Obvious action chip so it's clear you tap here to choose. */}
                    {!deliveryOpen ? (
                      carrier ? (
                        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                          {en ? 'Change' : 'Ändra'}
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </span>
                      ) : (
                        <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-[1.03]">
                          {en ? 'Choose delivery' : 'Välj leverans'}
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </span>
                      )
                    ) : (
                      <svg className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    )}
                  </button>

                  {/* Professional note: this is the recurring monthly delivery. */}
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-primary/5 px-4 py-3 text-sm text-foreground ring-1 ring-primary/15">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    <span>
                      {en
                        ? 'This will be your recurring monthly delivery — we automatically ship a new package to this address every month for as long as your subscription is active. Cancel anytime.'
                        : 'Detta blir din återkommande månadsleverans – vi skickar automatiskt en ny försändelse till denna adress varje månad så länge din prenumeration är aktiv. Avsluta när du vill.'}
                    </span>
                  </div>

                  {deliveryOpen && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {carriers.map((c) => {
                        const cost = carrierCost(c.id, country, monthlySubtotal);
                        return (
                          <DeliveryOption
                            key={c.id}
                            selected={carrierId === c.id}
                            onSelect={() => { setCarrierId(c.id); setDeliveryOpen(false); }}
                            en={en}
                            icon={<CarrierMark carrier={c} />}
                            title={carrierBrand(c, en)}
                            desc={en ? c.descEn : c.descSv}
                            priceLabel={cost === 0 ? (en ? 'Free' : 'Fri frakt') : `${kr(cost)}/${en ? 'mo' : 'mån'}`}
                            free={cost === 0}
                          />
                        );
                      })}
                    </div>
                  )}

                  {error && (
                    <p className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={loading}
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
                  <PaymentSection monthly={monthlyTotal} en={en} subscriptionId={subscriptionId} onBack={() => setClientSecret('')} />
                </Elements>
              </section>
            )}
          </div>

          {/* RIGHT: subscription summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="text-lg font-bold text-foreground">{en ? 'Order summary' : 'Ordersammanfattning'}</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {en ? 'Subscription' : 'Prenumeration'}
                </span>
              </div>

              {/* Item */}
              <div className="space-y-4 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <AppImage src={PACK_IMG[bottlesPerPack] || PACK_IMG[1]} alt={packLabel} width={64} height={64} className="h-full w-full object-contain p-1" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-white">
                      {qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">Viking Energy — {packLabel}</p>
                    <p className="text-xs text-muted-foreground">{packSub} · {en ? 'billed monthly' : 'debiteras varje månad'}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-foreground">
                    {kr(monthlySubtotal)}<span className="text-xs font-medium text-muted-foreground">/{en ? 'mo' : 'mån'}</span>
                  </p>
                </div>
              </div>

              {/* Subscription details */}
              <div className="border-t border-border bg-primary/5 px-6 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  {en ? 'Save 20% every month' : 'Spara 20% varje månad'}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {en
                    ? 'Renews automatically each month. Skip or cancel anytime — no lock-in.'
                    : 'Förnyas automatiskt varje månad. Hoppa över eller avsluta när du vill — ingen bindningstid.'}
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-border px-6 py-5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{en ? 'Monthly price' : 'Månadspris'}</span>
                  <span className="font-medium text-foreground">{kr(monthlySubtotal)}/{en ? 'mo' : 'mån'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{en ? 'Shipping' : 'Frakt'}{carrier ? ` · ${carrierBrand(carrier, en)}` : ''}</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-primary' : 'text-foreground'}`}>
                    {!carrier
                      ? (en ? 'Choose method' : 'Välj sätt')
                      : shippingCost === 0
                        ? (en ? 'Free' : 'Fri frakt')
                        : `${kr(shippingCost)}/${en ? 'mo' : 'mån'}`}
                  </span>
                </div>
                {carrier && shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {en ? 'Free shipping on orders over 700 kr.' : 'Fri frakt vid order över 700 kr.'}
                  </p>
                )}
                <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
                  <span className="text-base font-bold text-foreground">{en ? 'Due today' : 'Att betala nu'}</span>
                  <span className="text-2xl font-bold text-foreground">
                    {kr(monthlyTotal)}
                  </span>
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  {en ? `then ${kr(monthlyTotal)}/mo` : `därefter ${kr(monthlyTotal)}/mån`}
                </p>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-2 border-t border-border bg-muted/50 px-6 py-4 text-center">
                <Trust en={en} label={en ? 'Secure' : 'Säkert'} sub={en ? 'checkout' : 'köp'} icon="lock" />
                <Trust en={en} label="PostNord" sub={en ? 'delivery' : 'leverans'} icon="truck" />
                <Trust en={en} label={en ? 'Cancel' : 'Avsluta'} sub={en ? 'anytime' : 'när du vill'} icon="return" />
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

export default function SubscribeCheckoutPage() {
  return (
    <Suspense fallback={<div className="container-wide pt-28 text-muted-foreground">…</div>}>
      <SubscribeInner />
    </Suspense>
  );
}

/* ── Carrier icon/badge ──────────────────────────────────────────────── */
function CarrierMark({ carrier }: { carrier: CarrierDef }) {
  if (carrier.id === 'postnord') return <PostNordLogo />;
  if (carrier.provider === 'pickup') {
    return (
      <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l1-5h16l1 5" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M9 13h6" />
      </svg>
    );
  }
  const styles: Record<string, string> = {
    dhl: 'bg-[#FFCC00] text-[#D40511]',
    earlybird: 'bg-slate-900 text-white',
    budbee: 'bg-[#0A1D3B] text-white',
    schenker: 'bg-[#00A5A7] text-white',
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-extrabold shadow-sm ${styles[carrier.id] || 'bg-foreground text-white'}`}>
      {carrier.brand}
    </span>
  );
}

/* ── Delivery option card ─────────────────────────────────────────────── */
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
