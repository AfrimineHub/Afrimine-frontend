import { Button } from '@/shared/buttons/Button';
import type { BookingDetail } from '@/features/supplier/bookings/bookingsUtils';
import { BUYER_BOOKINGS_PATH } from '../constants';
import { useNavigate } from 'react-router-dom';

type PaymentState = 'hidden' | 'awaiting-link' | 'awaiting-payment' | 'paid';

function getPaymentState(
  booking: Pick<BookingDetail, 'paymentStatus' | 'paymentLink' | 'status'>,
): PaymentState {
  if (booking.paymentStatus === 'Paid') return 'paid';
  if (
    booking.status === 'declined' ||
    booking.status === 'cancelled' ||
    booking.status === 'completed' ||
    booking.status === 'approved' ||
    booking.status === 'active' ||
    booking.status === 'disputed'
  ) {
    return 'hidden';
  }
  if (booking.paymentLink) return 'awaiting-payment';
  if (booking.status === 'pending') return 'awaiting-link';
  return 'hidden';
}

/** True when the buyer still needs to complete escrow payment. */
export function shouldShowPaymentCta(
  booking: Pick<BookingDetail, 'paymentStatus' | 'paymentLink' | 'status'>,
): boolean {
  const state = getPaymentState(booking);
  return state === 'awaiting-link' || state === 'awaiting-payment';
}

export function BookingPaymentCta({ booking }: { booking: BookingDetail }) {
  const state = getPaymentState(booking);
  const navigate = useNavigate();

  if (state === 'hidden' || state === 'paid') {
    if (state === 'paid') {
      return (
        <p className="text-sm text-emerald-700">
          Escrow funded. The supplier will review and approve your booking request.
        </p>
      );
    }
    return null;
  }

  if (state === 'awaiting-link') {
    return (
      <>
        <h3 className="font-semibold">Preparing your payment</h3>
        <p className="text-sm text-slate-500">
          We&apos;re generating your secure PayScrow payment link. This usually takes only a few moments.
        </p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <h3 className="font-semibold">Complete payment to continue</h3>
      <p className="text-sm text-slate-500">
        Fund escrow via PayScrow first. The supplier is notified after payment clears, then can approve
        your request.
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
      <Button variant="secondary" onClick={() => navigate(BUYER_BOOKINGS_PATH)}>
        Pay later
      </Button>
    </div>
  );
}
