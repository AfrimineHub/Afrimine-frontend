import { Button } from '@/shared/buttons/Button';
import type { BookingDetail } from '@/features/supplier/bookings/bookingsUtils';

type PaymentState = 'paid' | 'awaiting-link' | 'awaiting-payment';

function getPaymentState(
  booking: Pick<BookingDetail, 'paymentLink' | 'payscrowTransactionNumber'>,
): PaymentState {
  if (booking.payscrowTransactionNumber) return 'paid';
  if (booking.paymentLink) return 'awaiting-payment';
  return 'awaiting-link';
}

export function BookingPaymentCta({ booking }: { booking: BookingDetail }) {
  const state = getPaymentState(booking);

  if (state === 'paid') {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
        Payment received
      </span>
    );
  }

  if (state === 'awaiting-link') {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
        Generating payment link…
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
        Payment pending
      </span>
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
    </div>
  );
}