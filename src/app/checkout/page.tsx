'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { MAX_STOCK } from '@/lib/inventory';
import AppImage from '@/components/ui/AppImage';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice, totalUnits, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [inventoryState, setInventoryState] = useState<{ remainingUnits: number; maxStock: number } | null>(null);
  const [shippingOption, setShippingOption] = useState<'pickup' | 'postnord'>('pickup');
  const [postcode, setPostcode] = useState('');
  const [isPostcodeValid, setIsPostcodeValid] = useState(false);
  const [postcodeChecking, setPostcodeChecking] = useState(false);
  const [postcodeError, setPostcodeError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data?.remainingUnits != null && data?.maxStock != null) {
          setInventoryState({ remainingUnits: data.remainingUnits, maxStock: data.maxStock });
        }
      })
      .catch(() => {
        setInventoryState(null);
      });
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container-wide">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Din varukorg är tom</h1>
            <p className="text-muted-foreground mb-8">Lägg till några produkter i din varukorg för att fortsätta till kassan.</p>
            <Link href="/products" className="inline-flex border border-foreground px-6 py-3 text-sm font-bold text-foreground hover:bg-slate-100 transition-colors">
              Handla nu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingCost = shippingOption === 'pickup' ? 0 : totalPrice >= 700 ? 0 : 49;
  const totalWithShipping = totalPrice + shippingCost;
  const totalWithShippingCents = Math.round(totalWithShipping * 100);
  const taxAmount = Math.round(totalWithShippingCents - totalWithShippingCents / 1.06) / 100;
  const outOfStock = inventoryState
    ? totalUnits > inventoryState.remainingUnits
    : totalUnits > MAX_STOCK;
  const stockRemaining = inventoryState
    ? Math.max(0, inventoryState.remainingUnits)
    : Math.max(0, MAX_STOCK - totalUnits);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customer: {
            email: formData.email,
          },
          shippingOption,
          shippingPostcode: postcode.replace(/\s+/g, ''),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        const msg = err?.error || 'Misslyckades med att skapa checkout-session';
        throw new Error(msg);
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Inget checkout-url mottogs');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Det gick inte att skapa kassan. ${error.message || 'Försök igen senare.'}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">Kassa</p>
          <h1 className="text-4xl font-bold text-foreground">Slutför ditt köp</h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            Börja med din e-postadress. Därefter ser du din varukorg och totalsumma innan du går vidare till Stripe-betalningen.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2.5fr_1.5fr]">
          <div className="space-y-8">
            <section className="border border-border bg-slate-50 p-8">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Steg 1</p>
                <h2 className="mt-2 text-3xl font-semibold text-foreground">Din e-post</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ange den e-postadress du vill få orderbekräftelsen skickad till. Om du är inloggad fylls den i automatiskt.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    E-postadress
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full border border-border bg-white px-5 py-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="din.email@example.com"
                  />
                </div>

                {/* Postcode input with auto-validation */}
                <div>
                  <label htmlFor="postcode" className="block text-sm font-semibold text-foreground mb-2">
                    Postnummer
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    inputMode="text"
                    maxLength={20}
                    value={postcode}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\s+/g, '');
                      setPostcode(cleaned);
                      setPostcodeError('');

                      const isSwedishPostcode = /^\d{5}$/.test(cleaned);
                      if (isSwedishPostcode) {
                        setIsPostcodeValid(true);
                      } else if (cleaned.length > 0) {
                        setIsPostcodeValid(false);
                      } else {
                        setIsPostcodeValid(false);
                      }
                    }}
                    placeholder="12345"
                    className="w-full border border-border bg-white px-5 py-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {postcodeError && <p className="mt-2 text-sm text-rose-600">{postcodeError}</p>}
                  {isPostcodeValid && <p className="mt-2 text-sm text-emerald-700">✓ Postnummer godkänt</p>}
                  {postcode.length > 0 && !isPostcodeValid && (
                    <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-800">
                        Om du inte har ett svenskt postnummer kan du kontakta oss direkt för hjälp.
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
                        >
                          Kontakta oss
                        </Link>
                        <a
                          href="https://t.me/Vikinfuel_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-foreground px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
                        >
                          Kontakta via Telegram
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping options shown after postcode validation */}
                {isPostcodeValid && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Leveransalternativ
                    </label>
                    <div className="space-y-3">
                      <label className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${shippingOption === 'pickup' ? 'border-foreground bg-primary/5' : 'border-border'}`}>
                        <input
                          type="radio"
                          name="shippingOption"
                          value="pickup"
                          checked={shippingOption === 'pickup'}
                          onChange={() => setShippingOption('pickup')}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-semibold text-foreground">Uthämtning</div>
                          <div className="text-sm text-muted-foreground">Gratis alltid vid uthämtning.</div>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${shippingOption === 'postnord' ? 'border-foreground bg-primary/5' : 'border-border'}`}>
                        <input
                          type="radio"
                          name="shippingOption"
                          value="postnord"
                          checked={shippingOption === 'postnord'}
                          onChange={() => setShippingOption('postnord')}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-semibold text-foreground">PostNord</div>
                          <div className="text-sm text-muted-foreground">49 kr frakt under 700 kr. Gratis vid 700 kr eller mer.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  När du klickar på “Gå till betalning” skickas du vidare till säker Stripe-betalning.
                </p>
              </form>
            </section>

            <section className="border border-border bg-slate-50 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Steg 2</p>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">Din varukorg</h2>
                </div>
                <div className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? 'vara' : 'varor'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3 text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground uppercase tracking-[0.15em]">
                      <th className="px-4 py-3">Produkt</th>
                      <th className="px-4 py-3">Pris</th>
                      <th className="px-4 py-3">Antal</th>
                      <th className="px-4 py-3">Summa</th>
                      <th className="px-4 py-3">Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    {items.map((item) => (
                      <tr key={item.id} className="border-t border-border bg-white">
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-16 overflow-hidden border border-border bg-slate-100">
                              <AppImage
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{item.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">{item.price.toLocaleString('sv-SE')} kr</td>
                        <td className="px-4 py-4 align-top">
                          <div className="inline-flex items-center border border-border">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-sm text-muted-foreground hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 text-sm text-foreground">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-sm text-muted-foreground hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top font-semibold">{(item.price * item.quantity).toLocaleString('sv-SE')} kr</td>
                        <td className="px-4 py-4 align-top">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-rose-600 hover:text-rose-700"
                          >
                            Ta bort
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="border border-border bg-slate-50 p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Orderdetaljer</p>
              <div className="mt-4 space-y-4 text-sm text-foreground">
                <div className="flex justify-between border-b border-border pb-3">
                  <span>Delbelopp</span>
                  <span>{totalPrice.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span>Frakt</span>
                  <span>{shippingCost === 0 ? 'Gratis' : `${shippingCost.toLocaleString('sv-SE')} kr`}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span>Moms (6%)</span>
                  <span>{taxAmount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr</span>
                </div>
                <div className="flex justify-between pt-3 text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>{totalWithShipping.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>
            </div>

            <div className="border border-border bg-slate-50 p-8">
              <h3 className="text-base font-semibold text-foreground mb-3">Vad händer härnäst</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>1. Ange din e-postadress för orderbekräftelse.</li>
                <li>2. Gå vidare till säker Stripe-betalning.</li>
                <li>3. Få kvitto och bekräftelse till din e-post.</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Om du är inloggad fylls din e-post automatiskt i fältet ovan.
              </p>
              {outOfStock ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  Lager är slut. Du kan inte lägga ordern eftersom du försöker köpa fler än 300 burkar. Resterande tillgängligt: {stockRemaining} burkar.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  Tillgängligt lager: {stockRemaining} burkar kvar av 300.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
                disabled={loading || !formData.email || outOfStock || !isPostcodeValid}
              className="w-full border border-border bg-foreground px-5 py-4 text-base font-bold text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bearbetar...' : 'Gå till betalning'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
