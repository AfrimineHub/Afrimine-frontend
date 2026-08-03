import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Truck } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { getApiErrorMessage } from '@/lib/api/errors';
import { useAssetDetailQuery, useAssetPricingQuery, useCreateBookingMutation } from '../equipmentQueries';
import { LOGISTICS_TYPE_OPTIONS } from '../equipmentTypes';

const DEFAULT_CURRENCY = 'NGN'; // the asset endpoints don't return a currency field yet

function toIsoDateTime(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toISOString();
}

function daysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY): string {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const assetQuery = useAssetDetailQuery(id ?? '');
  const asset = assetQuery.data;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [minerPhone, setMinerPhone] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [logisticsType, setLogisticsType] = useState<number>(LOGISTICS_TYPE_OPTIONS[0].value);
  const [formError, setFormError] = useState<string | null>(null);

  const totalDays = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);

  const pricingQuery = useAssetPricingQuery(id ?? '', {
    totalDays,
    distanceKm: distanceKm ? Number(distanceKm) : undefined,
  });

  const createBooking = useCreateBookingMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!id || !asset) return;

    if (!startDate || !endDate || totalDays <= 0) {
      setFormError('Choose a valid start and end date.');
      return;
    }
    if (!siteAddress.trim()) {
      setFormError('Site address is required.');
      return;
    }
    if (!minerPhone.trim()) {
      setFormError('A contact phone number is required.');
      return;
    }

    createBooking.mutate({
      assetId: id,
      startDate: toIsoDateTime(startDate),
      endDate: toIsoDateTime(endDate),
      siteAddress: siteAddress.trim(),
      distanceKm: distanceKm ? Number(distanceKm) : 0,
      currency: DEFAULT_CURRENCY,
      minerPhone: minerPhone.trim(),
      logisticsType,
    });
  };

  if (assetQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-64 rounded-2xl bg-gray-100" />
          <div className="h-8 w-1/2 rounded bg-gray-100" />
          <div className="h-40 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (assetQuery.isError || !asset) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {getApiErrorMessage(assetQuery.error, "Couldn't load this equipment listing.")}
        </div>
      </div>
    );
  }

  const isAvailable = asset.status?.toLowerCase() === 'available';
  const isBuyer = user?.type === USER_TYPES.buyer;
  const bookingError =
    createBooking.isError && getApiErrorMessage(createBooking.error, 'Could not submit your booking request.');

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 sm:h-80">
            {asset.frontPhotoUrl ? (
              <img
                src={asset.frontPhotoUrl}
                alt={`${asset.brand} ${asset.model}`}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-amber-600 px-2 py-1 text-[10px] font-bold text-white">
                {asset.machineType}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                  isAvailable ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {asset.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {asset.brand} {asset.model}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={14} className="text-gray-300" />
              {asset.location ?? 'Location not set'}
              {asset.supplierName ? <span>· {asset.supplierName}</span> : null}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-400">Year</dt>
                <dd className="text-sm font-bold text-gray-900">{asset.yearOfManufacture}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-400">Engine hours</dt>
                <dd className="text-sm font-bold text-gray-900">{asset.engineHours.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-400">Operator</dt>
                <dd className="text-sm font-bold text-gray-900">
                  {asset.hasCertifiedOperator ? 'Certified operator included' : 'Self-operated'}
                </dd>
              </div>
            </dl>

            {asset.description ? (
              <p className="mt-6 text-sm leading-relaxed text-gray-600">{asset.description}</p>
            ) : null}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase text-gray-400">Daily rate</div>
            <div className="text-2xl font-extrabold text-gray-900">
              {formatCurrency(asset.dailyRentalRate)}
              <span className="text-sm font-medium text-gray-400">/day</span>
            </div>
          </div>

          {!user ? (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              <Link to="/auth/login" className="font-bold text-yellow-700 hover:underline">
                Log in
              </Link>{' '}
              as a buyer to request this equipment.
            </div>
          ) : !isBuyer ? (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              Only buyer accounts can request equipment bookings.
            </div>
          ) : !isAvailable ? (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              This machine isn&apos;t currently available to book.
            </div>
          ) : createBooking.isSuccess ? (
            <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Booking request sent. The supplier has 24 hours to approve it — track it from{' '}
              <Link
                to={
                  createBooking.data?.bookingId
                    ? `/my-bookings/${createBooking.data.bookingId}`
                    : '/my-bookings'
                }
                className="font-bold hover:underline"
              >
                My Bookings
              </Link>
              .
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-600">
                  Start date
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  End date
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold text-gray-600">
                Site address
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="Where should the equipment be delivered?"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </label>

              <label className="block text-xs font-semibold text-gray-600">
                Contact phone
                <input
                  type="tel"
                  value={minerPhone}
                  onChange={(e) => setMinerPhone(e.target.value)}
                  placeholder="e.g. 0803 000 0000"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-600">
                  Distance (km)
                  <input
                    type="number"
                    min={0}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    placeholder="Optional"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Logistics
                  <select
                    value={logisticsType}
                    onChange={(e) => setLogisticsType(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {LOGISTICS_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {totalDays > 0 ? (
                <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                  <div className="mb-1 flex items-center gap-1 font-semibold text-gray-700">
                    <Truck size={14} /> {totalDays} day{totalDays > 1 ? 's' : ''}
                  </div>
                  {pricingQuery.isLoading ? (
                    <p>Calculating price…</p>
                  ) : pricingQuery.data ? (
                    <p className="text-sm font-bold text-gray-900">
                      Estimated total: {formatCurrency(pricingQuery.data.totalAmount, pricingQuery.data.currency)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {formError ? <p className="text-xs font-semibold text-red-600">{formError}</p> : null}
              {bookingError ? <p className="text-xs font-semibold text-red-600">{bookingError}</p> : null}

              <button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createBooking.isPending ? 'Sending request…' : 'Request to Book'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}