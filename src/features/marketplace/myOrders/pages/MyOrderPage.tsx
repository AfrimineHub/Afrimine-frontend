import { useMemo, useState } from 'react';
import { OrderTable } from '@/features/marketplace/myOrders';
import { OrderFilters } from '@/features/marketplace/myOrders';
import { OrdersSummary } from '@/features/marketplace/myOrders';
import { OrderCard } from '@/features/marketplace/myOrders';
import { useVendorOrdersQuery } from '@/features/vendor/dashboardQueries';
import { mapVendorOrderToOrder } from '@/features/vendor/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const ORDER_STATUS_FILTER: Record<string, number | undefined> = {
  all: undefined,
  pending: 1,
  paid: 2,
  delivered: 3,
  completed: 3,
  disputed: 3,
  frozen: 3,
};

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');

  const ordersQuery = useVendorOrdersQuery({
    Page: 1,
    PageSize: 50,
    Status: ORDER_STATUS_FILTER[filter],
  });

  const orders = useMemo(
    () => (ordersQuery.data?.items ?? []).map(mapVendorOrderToOrder),
    [ordersQuery.data?.items],
  );

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  const loadError =
    ordersQuery.isError &&
    getApiErrorMessage(ordersQuery.error, 'Could not load orders.');

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">My Orders</h1>
          <p className="text-gray-500 text-sm">Track and manage all transactions</p>
        </div>

        <div className="overflow-x-auto">
          <OrderFilters active={filter} onChange={setFilter} />
        </div>
      </div>

      {loadError ? (
        <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {loadError}
        </p>
      ) : null}

      {ordersQuery.isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-12">No orders found.</p>
      ) : (
        <>
          <OrderTable orders={filteredOrders} />

          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <OrdersSummary orders={orders} />
        </>
      )}
    </div>
  );
}
