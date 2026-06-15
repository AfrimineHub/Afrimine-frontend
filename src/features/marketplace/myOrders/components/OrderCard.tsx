import { type Order } from "../types";
import { StatusBadge } from "./OrderStatusBadge";
import { OrderActions } from "./OrderActions";
import { formatBuyerAmount } from "@/features/buyer/dashboardUtils";

export const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-medium">{order.id}</p>
        <StatusBadge status={order.status} />
      </div>

      <div>
        <p className="text-sm text-gray-500">{order.counterparty}</p>
        <p className="text-sm font-medium">{order.listing}</p>
      </div>

      <div className="flex justify-between text-sm">
        <span className="font-semibold">
          {formatBuyerAmount(order.amount, order.currency)}
        </span>
        <span className="text-gray-500">{order.date}</span>
      </div>

      <div className="pt-2 border-t">
        <OrderActions status={order.status} />
      </div>
    </div>
  );
};