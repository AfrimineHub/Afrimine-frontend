import { type Order } from "../types";
import { StatusBadge } from "./OrderStatusBadge";
import { OrderActions } from "./OrderActions";

export const OrderRow = ({ order }: { order: Order }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{order.id}</td>
      <td>{order.buyer}</td>
      <td>{order.listing}</td>
      <td>₦{order.amount.toLocaleString()}</td>
      <td>
        <StatusBadge status={order.status} />
      </td>
      <td>{order.date}</td>
      <td>
        <OrderActions status={order.status} />
      </td>
    </tr>
  );
};