import { type OrderStatus } from "../types";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  delivered: "bg-purple-100 text-purple-700",
  completed: "bg-gray-200 text-gray-700",
  disputed: "bg-red-100 text-red-700",
  frozen: "bg-gray-900 text-gray-600",
};

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};