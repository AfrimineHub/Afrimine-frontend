import { type Order } from "../types";
import { OrderRow } from "./OrderRow";

export const OrderTable = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="hidden md:block">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Buyer</th>
              <th>Listing</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};