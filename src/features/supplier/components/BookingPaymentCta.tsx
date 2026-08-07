import { Button } from '@/shared/buttons/Button';
import type { BookingDetail } from '@/features/supplier/bookings/bookingsUtils';
import { BUYER_BOOKINGS_PATH } from '../constants';
import { useNavigate } from 'react-router-dom';

type PaymentState = 'awaiting-link' | 'awaiting-payment' | 'paid';

function getPaymentState(
  booking: Pick<BookingDetail, 'paymentStatus'| 'paymentLink'>,
): PaymentState {
   if (booking.paymentStatus === 'Paid') {
    return 'paid';
  }
   if (booking.paymentLink) {
    return 'awaiting-payment';
  }

  return 'awaiting-link';
}

export function BookingPaymentCta({ booking }: { booking: BookingDetail }) {
  const state = getPaymentState(booking);
  const navigate = useNavigate();

  if (state === 'awaiting-link') {
    return (
      <>
      <h3 className="font-semibold">
        Preparing your payment
      </h3>
      <p className="text-sm text-slate-500">
        We're generating your secure payment link.
        This usually takes only a few moments.
      </p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <h3 className="font-semibold">
          Complete your payment
      </h3>
      <p className="text-sm text-slate-500">
          Your booking has been created successfully.
          Complete payment now to continue processing your booking.
      </p>
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(booking.paymentLink as string, '_blank', 'noopener,noreferrer');
        }}
      >
        Complete payment
      </Button>
      <Button
          variant="secondary"
          onClick={() => navigate(BUYER_BOOKINGS_PATH)}
      >
          Pay later
      </Button>
    </div>
  );
}