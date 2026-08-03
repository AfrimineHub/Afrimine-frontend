import { Link } from 'react-router-dom';
import {
  useBookingsQuery,
} from '@/features/supplier/bookings/bookingsQueries';
import {
  BOOKING_STATUS_STYLES,
  normalizeBookingsList,
} from '@/features/supplier/bookings/bookingsUtils';
import { BUYER_BOOKINGS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function MyBookingsPage() {
  const bookingsQuery = useBookingsQuery();
  const bookings = normalizeBookingsList(bookingsQuery.data);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track equipment rental requests and lease status.
        </p>

        {bookingsQuery.isLoading ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">Loading bookings…</p>
          </div>
        ) : bookingsQuery.isError ? (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {getApiErrorMessage(bookingsQuery.error, 'Could not load your bookings.')}
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">No bookings yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Browse the marketplace and request equipment to get started.
            </p>
            <Link
              to="/marketplace"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
            >
              Browse marketplace
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                to={`${BUYER_BOOKINGS_PATH}/${booking.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#EAB308]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{booking.machineName}</p>
                    <p className="text-sm text-slate-500">{booking.leasePeriod}</p>
                    <p className="mt-1 text-xs text-slate-400">Next: {booking.nextMilestone}</p>
                  </div>
                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${BOOKING_STATUS_STYLES[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
