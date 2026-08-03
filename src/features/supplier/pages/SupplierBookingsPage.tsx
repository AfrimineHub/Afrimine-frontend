import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { Button } from '@/shared/buttons/Button';
import {
  useApproveBookingMutation,
  useDeclineBookingMutation,
  useBookingsQuery,
} from '@/features/supplier/bookings/bookingsQueries';
import {
  BOOKING_STATUS_STYLES,
  normalizeBookingsList,
} from '@/features/supplier/bookings/bookingsUtils';
import { SUPPLIER_BOOKINGS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function SupplierBookingsPage() {
  const bookingsQuery = useBookingsQuery();
  const approveMutation = useApproveBookingMutation();
  const declineMutation = useDeclineBookingMutation();

  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const bookings = normalizeBookingsList(bookingsQuery.data);

  const handleApprove = async (id: string) => {
    setError(null);
    try {
      await approveMutation.mutateAsync(id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not approve this booking.'));
    }
  };

  const handleDecline = async (id: string) => {
    setError(null);
    if (!declineReason.trim()) {
      setError('Enter a reason before declining.');
      return;
    }
    try {
      await declineMutation.mutateAsync({ bookingId: id, reason: declineReason.trim() });
      setDecliningId(null);
      setDeclineReason('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not decline this booking.'));
    }
  };

  return (
    <SupplierLayout>
      <h1 className="text-2xl font-bold text-slate-900">Booking requests</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xl">
        Approve or decline rental requests from miners.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {bookingsQuery.isLoading ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-slate-700">Loading booking requests…</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-slate-700">No booking requests yet</p>
          <p className="mt-1 text-xs text-slate-500">
            New requests will show here with miner details, lease period, and approve / decline
            actions.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    to={`${SUPPLIER_BOOKINGS_PATH}/${booking.id}`}
                    className="font-semibold text-slate-900 hover:text-[#CA8A04] hover:underline"
                  >
                    {booking.machineName}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {booking.minerName} · {booking.leasePeriod}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Next: {booking.nextMilestone}</p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${BOOKING_STATUS_STYLES[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>

              {booking.status === 'pending' && (
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                  {decliningId === booking.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                        placeholder="Reason for declining (required)"
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setDecliningId(null);
                            setDeclineReason('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDecline(booking.id)}
                          disabled={declineMutation.isPending}
                        >
                          {declineMutation.isPending ? 'Declining…' : 'Confirm decline'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant="outline" onClick={() => setDecliningId(booking.id)}>
                        Decline
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleApprove(booking.id)}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? 'Approving…' : 'Approve'}
                      </Button>
                      <Link
                        to={`${SUPPLIER_BOOKINGS_PATH}/${booking.id}`}
                        className="inline-flex items-center text-sm font-semibold text-[#CA8A04] hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {booking.status !== 'pending' && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Link
                    to={`${SUPPLIER_BOOKINGS_PATH}/${booking.id}`}
                    className="text-sm font-semibold text-[#CA8A04] hover:underline"
                  >
                    View details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SupplierLayout>
  );
}
