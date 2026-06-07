'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

interface OrdersSectionProps {
  userEmail: string;
  refreshTrigger: number;
  onDataUpdated: () => void;
}

interface Order {
  id: string;
  sessionId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress?: {
    name?: string;
    address?: any;
  };
  shippingOption?: string | null;
  shippingPostcode?: string | null;
  postnordLabelUrl?: string | null;
  postnordLabelPdfUrl?: string | null;
}

export default function OrdersSection({
  userEmail,
  refreshTrigger,
  onDataUpdated,
}: OrdersSectionProps) {
  const { addItem } = useCart();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/account/orders?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, [userEmail, refreshTrigger]);

  const handleBuyAgain = (order: Order) => {
    if (addItem) {
      order.items.forEach((item) => {
        addItem({
          id: item.name.toLowerCase().replace(/\s+/g, '-'),
          name: item.name,
          price: item.price,
          image: '/assets/images/viking-energy-1e.png', // Fallback image
          quantity: item.quantity,
        });
      });
      setMessage({ type: 'success', text: 'Beställning tillagd i varukorgen!' });
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna beställning?')) {
      return;
    }

    try {
      const res = await fetch('/api/account/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          action: 'delete',
          orderId,
        }),
      });

      if (!res.ok) {
        throw new Error('Misslyckades att ta bort beställning');
      }

      setMessage({ type: 'success', text: 'Beställning borttagen!' });
      fetchOrders();
      onDataUpdated();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Mina beställningar</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Laddar beställningar...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-lg text-muted-foreground font-medium">Du har inga beställningar än</p>
            <p className="text-sm text-muted-foreground mt-2">När du gör en beställning kommer den att visas här</p>
            <a
              href="/products"
              className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Börja handla
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      Beställning #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleDateString('sv-SE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {order.totalAmount.toFixed(2)} {order.currency}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-foreground text-sm mb-3">Produkter:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold text-foreground">
                          {(item.price * item.quantity).toFixed(2)} {order.currency}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.shippingAddress && (
                  <div className="bg-muted/20 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-foreground text-sm mb-2">Leveransadress:</h4>
                    <p className="text-sm text-foreground">{order.shippingAddress.name}</p>
                    {order.shippingAddress.address && (
                      <>
                        <p className="text-sm text-foreground">
                          {order.shippingAddress.address.line1}
                        </p>
                        <p className="text-sm text-foreground">
                          {order.shippingAddress.address.postal_code}{' '}
                          {order.shippingAddress.address.city}
                        </p>
                        <p className="text-sm text-foreground">
                          {order.shippingAddress.address.country}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {order.shippingOption && (
                  <div className="bg-muted/20 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-foreground text-sm mb-2">Leverans:</h4>
                    <p className="text-sm text-foreground">{order.shippingOption}</p>
                    {order.shippingPostcode && (
                      <p className="text-sm text-muted-foreground mt-1">Postnummer: {order.shippingPostcode}</p>
                    )}
                    {order.postnordLabelUrl && (
                      <a
                        href={order.postnordLabelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900"
                      >
                        Öppna fraktsedel
                      </a>
                    )}
                    {!order.postnordLabelUrl && order.shippingOption === 'PostNord' && (
                      <p className="mt-3 text-sm text-muted-foreground">Fraktsedel skapas inom kort.</p>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleBuyAgain(order)}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Köp igen
                  </button>
                  <button
                    onClick={() => handleRemoveOrder(order.id)}
                    className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
