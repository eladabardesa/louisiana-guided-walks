'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { formatPriceDkk, formatTourDate } from '@/lib/format';

type Order = {
  id: string;
  orderNumber: string;
  quantity: number;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  fullName: string;
  email: string;
  phone: string;
  note: string | null;
  createdAt: string;
  tour: { name: string; venue?: { shortName: string } | null };
  tourDate: { startsAt: string; language: string | null } | null;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const res = await fetch('/api/admin/orders');
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <AdminShell>
      <h2 className="text-xl font-light text-gray-900 mb-6">Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.fullName} · {order.email}
                  {order.phone ? ` · ${order.phone}` : ''}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-gray-500">{order.status}</span>
            </div>
            <p className="text-sm text-gray-700">
              {order.quantity}× {order.tour.name}
              {order.tour.venue?.shortName ? ` @ ${order.tour.venue.shortName}` : ''}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {order.tourDate
                ? formatTourDate(order.tourDate.startsAt, order.tourDate.language)
                : 'Flexible / TBA'}{' '}
              · {formatPriceDkk(order.totalAmount)}
              {order.paymentMethod ? ` · ${order.paymentMethod}` : ''}
            </p>
            {order.note && <p className="text-sm text-gray-500 mt-2">Note: {order.note}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              {['PAID', 'PENDING', 'CANCELLED', 'REFUNDED'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order.id, status)}
                  className={`px-3 py-1 text-xs border ${
                    order.status === status
                      ? 'border-gray-900 text-gray-900'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
      </div>
    </AdminShell>
  );
}
