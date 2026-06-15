import { type Order } from "../types";
import { StatusBadge } from "./OrderStatusBadge";
import { OrderActions } from "./OrderActions";
import { formatBuyerAmount } from "@/features/buyer/dashboardUtils";

export const OrderRow = ({
  order,
  isBuyer,
}: {
  order: Order;
  isBuyer: boolean;
}) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{order.id}</td>
      <td>{order.counterparty}</td>
      <td>{order.listing}</td>
      <td>{formatBuyerAmount(order.amount, order.currency)}</td>
      <td>
        <StatusBadge status={order.status} />
      </td>
      <td>{order.date}</td>
      <td>
        <OrderActions orderId={order.id} status={order.status} isBuyer={isBuyer} />
      </td>
    </tr>
  );
};