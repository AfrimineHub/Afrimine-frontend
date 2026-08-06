import { Link, useParams } from 'react-router-dom';
import { useBookingQuery } from '@/features/supplier/bookings/bookingsQueries';
import { normalizeBooking } from '@/features/supplier/bookings/bookingsUtils';
import { BookingDetailView } from '@/features/supplier/components/BookingDetailView';
import { BookingPaymentCta } from '@/features/supplier/components/BookingPaymentCta';
import { BUYER_BOOKINGS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function MyBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookingQuery = useBookingQuery(id);
  const booking = normalizeBooking(bookingQuery.data);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <div className="mx-auto max-w-3xl">
        {bookingQuery.isLoading ? (
          <p className="text-sm text-slate-500">Loading booking…</p>
        ) : !booking ? (
          <div>
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {getApiErrorMessage(bookingQuery.error, 'Could not load this booking.')}
            </p>
            <Link
              to={BUYER_BOOKINGS_PATH}
              className="mt-4 inline-block text-sm font-semibold text-[#CA8A04]"
            >
              Back to My Bookings
            </Link>
          </div>
        ) : (
          <>
            {booking.status !== 'declined' && (
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <BookingPaymentCta booking={booking} />
              </div>
            )}
            <BookingDetailView
              booking={booking}
              backTo={BUYER_BOOKINGS_PATH}
              backLabel="Back to My Bookings"
              counterpartLabel="Supplier contact"
            />
          </>
        )}
      </div>
    </div>
  );
}