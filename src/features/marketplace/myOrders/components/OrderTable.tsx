import { type Order } from "../types";
import { OrderRow } from "./OrderRow";

export const OrderTable = ({
  orders,
  counterpartyLabel = "Buyer",
  isBuyer,
}: {
  orders: Order[];
  counterpartyLabel?: string;
  isBuyer: boolean;
}) => {
  return (
    <div className="hidden md:block">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th>{counterpartyLabel}</th>
              <th>Listing</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} isBuyer={isBuyer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};