import { type Order } from "../types";
import { StatusBadge } from "./OrderStatusBadge";
import { OrderActions } from "./OrderActions";

export const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      {/* Top */}
      <div className="flex justify-between items-center">
        <p className="font-medium">{order.id}</p>
        <StatusBadge status={order.status} />
      </div>

      {/* Buyer + Listing */}
      <div>
        <p className="text-sm text-gray-500">{order.buyer}</p>
        <p className="text-sm font-medium">{order.listing}</p>
      </div>

      {/* Amount + Date */}
      <div className="flex justify-between text-sm">
        <span className="font-semibold">
          ₦{order.amount.toLocaleString()}
        </span>
        <span className="text-gray-500">{order.date}</span>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t">
        <OrderActions status={order.status} />
      </div>
    </div>
  );
};