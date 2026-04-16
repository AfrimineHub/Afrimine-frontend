import { Eye, CircleCheck, MessageSquareIcon } from "lucide-react";
import { type OrderStatus } from "../types";

export const OrderActions = ({
  status,
}: {
  status: OrderStatus;
}) => {
  return (
    <div className="flex items-center gap-3 text-sm">
      <button className="flex items-center gap-1 text-gray-600 hover:text-black">
        <Eye size={16} /> 
        View
      </button>

      {/* Mark Delivered */}
      {status === "paid" && (
        <button className="flex items-center gap-1 text-green-600 hover:underline">
          <CircleCheck size={14} />
          Mark Delivered
        </button>
      )}

      {/* Message icon */}
      <button className="text-gray-500 hover:text-black">
        <MessageSquareIcon size={16} />
      </button>
    </div>
  );
};