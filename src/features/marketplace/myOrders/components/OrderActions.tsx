import { Link } from 'react-router-dom';
import { Eye, CircleCheck, MessageSquareIcon } from 'lucide-react';
import { type OrderStatus } from '../types';

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  isBuyer: boolean;
}

export const OrderActions = ({ orderId, status, isBuyer }: OrderActionsProps) => {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Link
        to={`/my-order/${orderId}`}
        className="flex items-center gap-1 text-gray-600 hover:text-black"
      >
        <Eye size={16} />
        View
      </Link>

      {!isBuyer && status === 'paid' ? (
        <Link
          to={`/my-order/${orderId}`}
          className="flex items-center gap-1 text-green-600 hover:underline"
        >
          <CircleCheck size={14} />
          Mark Delivered
        </Link>
      ) : null}

      {isBuyer && status === 'delivered' ? (
        <Link
          to={`/my-order/${orderId}`}
          className="flex items-center gap-1 text-green-600 hover:underline"
        >
          <CircleCheck size={14} />
          Confirm Delivery
        </Link>
      ) : null}

      {isBuyer && status === 'pending' ? (
        <Link
          to={`/my-order/${orderId}`}
          className="flex items-center gap-1 text-yellow-700 hover:underline font-medium"
        >
          Fund Escrow
        </Link>
      ) : null}

      <Link
        to={`/messages?orderId=${orderId}`}
        className="text-gray-500 hover:text-black"
        aria-label="Message"
      >
        <MessageSquareIcon size={16} />
      </Link>
    </div>
  );
};
