'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  useEffect(() => {
    setHasMounted(true);
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
            <Link href="/products" className="btn-primary inline-flex">
              Handla nu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Det gick inte att skapa kassan. Försök igen senare.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container-wide">
        <h1 className="text-3xl font-bold text-foreground mb-8">Kassan</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Innan vi går vidare</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Ange din e-postadress nedan. När du klickar på “Gå till betalning” tar Stripe hand om betalning och leveransuppgifter, inklusive kort, Klarna eller Google Pay om de är tillgängliga.
                </p>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    E-postadress
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="din.email@example.com"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Bearbetar...' : 'Gå till betalning'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-4">Orderöversikt</h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      {(item.price * item.quantity).toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-foreground">Totalt</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString('sv-SE')} kr
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Frakt upp till 5 kg: 49 kr i Stockholm/Göteborg, 59 kr i övriga Sverige. Fri frakt för order över 500 kr.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
