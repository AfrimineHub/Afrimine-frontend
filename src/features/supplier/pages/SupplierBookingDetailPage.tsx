import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import {
  BookingDetailView,
  BookingPendingActions,
} from '@/features/supplier/components/BookingDetailView';
import {
  useApproveBookingMutation,
  useBookingQuery,
  useDeclineBookingMutation,
} from '@/features/supplier/bookings/bookingsQueries';
import { normalizeBooking } from '@/features/supplier/bookings/bookingsUtils';
import { SUPPLIER_BOOKINGS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function SupplierBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingQuery = useBookingQuery(id);
  const approveMutation = useApproveBookingMutation();
  const declineMutation = useDeclineBookingMutation();

  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const booking = normalizeBooking(bookingQuery.data);

  const handleApprove = async () => {
    if (!id) return;
    setError(null);
    try {
      await approveMutation.mutateAsync(id);
      await bookingQuery.refetch();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not approve this booking.'));
    }
  };

  const handleDecline = async () => {
    if (!id) return;
    setError(null);
    if (!declineReason.trim()) {
      setError('Enter a reason before declining.');
      return;
    }
    try {
      await declineMutation.mutateAsync({ bookingId: id, reason: declineReason.trim() });
      setDeclineOpen(false);
      setDeclineReason('');
      await bookingQuery.refetch();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not decline this booking.'));
    }
  };

  return (
    <SupplierLayout>
      {bookingQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading booking…</p>
      ) : !booking ? (
        <div>
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {getApiErrorMessage(bookingQuery.error, 'Could not load this booking.')}
          </p>
          <button
            type="button"
            onClick={() => navigate(SUPPLIER_BOOKINGS_PATH)}
            className="mt-4 text-sm font-semibold text-[#CA8A04]"
          >
            Back to bookings
          </button>
        </div>
      ) : (
        <>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <BookingDetailView
            booking={booking}
            backTo={SUPPLIER_BOOKINGS_PATH}
            backLabel="Back to bookings"
            counterpartLabel="Miner"
            actions={
              booking.status === 'pending' ? (
                <BookingPendingActions
                  onApprove={handleApprove}
                  onStartDecline={() => setDeclineOpen(true)}
                  approving={approveMutation.isPending}
                  declining={declineMutation.isPending}
                  declineOpen={declineOpen}
                  declineReason={declineReason}
                  onDeclineReasonChange={setDeclineReason}
                  onCancelDecline={() => {
                    setDeclineOpen(false);
                    setDeclineReason('');
                  }}
                  onConfirmDecline={handleDecline}
                />
              ) : null
            }
          />
        </>
      )}
    </SupplierLayout>
  );
}
