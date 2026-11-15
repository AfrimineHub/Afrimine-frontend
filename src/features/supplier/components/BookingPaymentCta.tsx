import { Button } from '@/shared/buttons/Button';
import type { BookingDetail } from '@/features/supplier/bookings/bookingsUtils';
import { BUYER_BOOKINGS_PATH } from '../constants';
import { useNavigate } from 'react-router-dom';

type PaymentState =
  | 'hidden'
  | 'awaiting-approval'
  | 'awaiting-link'
  | 'awaiting-payment'
  | 'paid';

function getPaymentState(
  booking: Pick<BookingDetail, 'paymentStatus' | 'paymentLink' | 'status'>,
): PaymentState {
  if (booking.paymentStatus === 'Paid') return 'paid';

  if (
    booking.status === 'declined' ||
    booking.status === 'cancelled' ||
    booking.status === 'completed' ||
    booking.status === 'active' ||
    booking.status === 'disputed'
  ) {
    return 'hidden';
  }

  // Buyer can only fund escrow after the supplier has approved.
  if (booking.status === 'pending') return 'awaiting-approval';

  if (booking.status === 'approved') {
    if (booking.paymentLink) return 'awaiting-payment';
    return 'awaiting-link';
  }

  return 'hidden';
}

/** True when the payment panel should render (message and/or pay actions). */
export function shouldShowPaymentCta(
  booking: Pick<BookingDetail, 'paymentStatus' | 'paymentLink' | 'status'>,
): boolean {
  const state = getPaymentState(booking);
  return (
    state === 'awaiting-approval' ||
    state === 'awaiting-link' ||
    state === 'awaiting-payment' ||
    state === 'paid'
  );
}

export function BookingPaymentCta({ booking }: { booking: BookingDetail }) {
  const state = getPaymentState(booking);
  const navigate = useNavigate();

  if (state === 'hidden') return null;

  if (state === 'paid') {
    return (
      <p className="text-sm text-emerald-700">
        Escrow funded. Your payment is complete for this booking.
      </p>
    );
  }

  if (state === 'awaiting-approval') {
    return (
      <div className="flex flex-col items-start gap-1">
        <h3 className="font-semibold">Awaiting supplier approval</h3>
        <p className="text-sm text-slate-500">
          Your booking is awaiting approval. Once the supplier approves it, you can pay into the
          escrow account.
        </p>
      </div>
    );
  }

  if (state === 'awaiting-link') {
    return (
      <>
        <h3 className="font-semibold">Preparing your payment</h3>
        <p className="text-sm text-slate-500">
          Your booking is approved. We&apos;re generating your secure PayScrow payment link — this
          usually takes only a few moments.
        </p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <h3 className="font-semibold">Complete payment to continue</h3>
      <p className="text-sm text-slate-500">
        Your booking has been approved. Fund escrow via PayScrow to continue processing.
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
