'use client';

import React from 'react';

interface HistorySectionProps {
  userEmail: string;
  refreshTrigger: number;
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
}

export default function HistorySection({
  userEmail,
  refreshTrigger,
}: HistorySectionProps) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/account/orders?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        // Sort orders by date (newest first)
        const sortedOrders = (data.orders || []).sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
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

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: 'Kortbetalning',
      klarna: 'Klarna',
      stripe: 'Stripe',
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status: string) => {
    const badgeClasses: Record<string, string> = {
      completed: 'bg-green-100 text-green-800 border border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      failed: 'bg-red-100 text-red-800 border border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return badgeClasses[status] || 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Slutförd',
      pending: 'Väntar',
      failed: 'Misslyckad',
      cancelled: 'Avbruten',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Köphistorik</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Laddar historik...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-lg text-muted-foreground font-medium">Du har ingen köphistorik än</p>
            <p className="text-sm text-muted-foreground mt-2">Din köphistorik kommer att visas här</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              {orders.map((order, index) => (
                <div key={order.id} className="relative pb-8">
                  {/* Timeline line */}
                  {index < orders.length - 1 && (
                    <div className="absolute left-6 top-16 h-8 w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
                  )}

                  {/* Timeline item */}
                  <div className="flex gap-6">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 border-2 border-primary">
                        <svg
                          className="h-6 w-6 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Timeline content */}
                    <div className="flex-1 bg-muted/30 rounded-2xl p-6 border border-border">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            Beställning #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString('sv-SE', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className={`px-4 py-2 rounded-lg text-xs font-bold ${getStatusBadge(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="mb-4 bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-sm text-foreground mb-3">Produkter:</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span className="text-foreground">
                                {item.name}
                                <span className="text-muted-foreground ml-1">× {item.quantity}</span>
                              </span>
                              <span className="font-semibold text-foreground">
                                {(item.price * item.quantity).toFixed(2)} {order.currency}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-border mt-3 pt-3 flex justify-between">
                          <span className="font-bold text-foreground">Totalt:</span>
                          <span className="font-bold text-foreground text-lg">
                            {order.totalAmount.toFixed(2)} {order.currency}
                          </span>
                        </div>
                      </div>

                      {/* Additional info */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          <span className="font-semibold">Betalningsmetod:</span>{' '}
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </p>
                        {order.shippingAddress?.name && (
                          <p>
                            <span className="font-semibold">Mottakare:</span> {order.shippingAddress.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
