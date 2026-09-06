import { useState } from 'react';
import { Button } from '@/shared/buttons/Button';
import {
  useDailyCheckMutation,
  useDispatchBookingMutation,
  useReturnClearanceMutation,
  useSiteArrivalMutation,
  useTriggerInsuranceMutation,
} from '@/features/supplier/bookings/bookingsQueries';
import { normalizeLogisticsStage, type BookingDetail } from '@/features/supplier/bookings/bookingsUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

interface BookingLifecycleActionsProps {
  booking: BookingDetail;
  role: 'supplier' | 'miner';
  operatorId?: string;
  logisticsStatus?: string | null;
  gitInsuranceActive?: boolean;
  parInsuranceActive?: boolean;
}

const DAILY_CHECK_ITEMS = [
  { key: 'engineOilChecked', label: 'Engine oil' },
  { key: 'hydraulicFluidChecked', label: 'Hydraulic fluid' },
  { key: 'coolingSystemChecked', label: 'Cooling system' },
  { key: 'undercarriageChecked', label: 'Undercarriage' },
  { key: 'greaseChecked', label: 'Grease' },
] as const;

type DailyCheckKey = (typeof DAILY_CHECK_ITEMS)[number]['key'];

export function BookingLifecycleActions({
  booking,
  role,
  operatorId,
  logisticsStatus,
  gitInsuranceActive,
  parInsuranceActive,
}: BookingLifecycleActionsProps) {
  const stage = normalizeLogisticsStage(logisticsStatus ?? booking.logisticsStatus);
  const dispatchMutation = useDispatchBookingMutation();
  const arrivalMutation = useSiteArrivalMutation();
  const returnMutation = useReturnClearanceMutation();
  const dailyCheckMutation = useDailyCheckMutation();
  const insuranceMutation = useTriggerInsuranceMutation();

  const [error, setError] = useState<string | null>(null);
  const [dailyCheckOpen, setDailyCheckOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [checks, setChecks] = useState<Record<DailyCheckKey, boolean>>({
    engineOilChecked: false,
    hydraulicFluidChecked: false,
    coolingSystemChecked: false,
    undercarriageChecked: false,
    greaseChecked: false,
  });

  const run = async (fn: () => Promise<unknown>, fallback: string) => {
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(getApiErrorMessage(err, fallback));
    }
  };

  const isSupplier = role === 'supplier';
  const canDispatch = isSupplier && booking.status === 'approved';
  const canConfirmArrival =
    booking.status === 'active' && (stage === 'Dispatched' || stage === 'EnRoute');
  const canDailyCheck = isSupplier && booking.status === 'active' && stage === 'Arrived';
  const canReturnClearance = booking.status === 'active' && stage === 'Arrived';
  const canInsureGit =
    isSupplier &&
    (booking.status === 'approved' || booking.status === 'active') &&
    !gitInsuranceActive &&
    !booking.gitInsuranceActive;
  const canInsurePar =
    isSupplier && booking.status === 'active' && !parInsuranceActive && !booking.parInsuranceActive;

  const hasAnyAction =
    canDispatch || canConfirmArrival || canDailyCheck || canReturnClearance || canInsureGit || canInsurePar;

  if (!hasAnyAction && !dailyCheckOpen) return null;

  const handleDailyCheck = async () => {
    if (!operatorId) {
      setError('Could not identify the operator submitting this check.');
      return;
    }
    const allChecked = DAILY_CHECK_ITEMS.every((item) => checks[item.key]);
    if (!allChecked) {
      setError('Confirm all safety checklist items before submitting.');
      return;
    }
    await run(
      () =>
        dailyCheckMutation.mutateAsync({
          bookingId: booking.id,
          ...checks,
          notes: notes.trim() || null,
          checkedByOperatorId: operatorId,
        }),
      'Could not submit daily check.',
    );
    setDailyCheckOpen(false);
    setNotes('');
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-900">Lease actions</h2>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {canDispatch ? (
          <Button
            type="button"
            onClick={() =>
              run(() => dispatchMutation.mutateAsync(booking.id), 'Could not confirm dispatch.')
            }
            disabled={dispatchMutation.isPending}
          >
            {dispatchMutation.isPending ? 'Dispatching…' : 'Confirm dispatch'}
          </Button>
        ) : null}

        {canConfirmArrival ? (
          <Button
            type="button"
            onClick={() =>
              run(() => arrivalMutation.mutateAsync(booking.id), 'Could not confirm site arrival.')
            }
            disabled={arrivalMutation.isPending}
          >
            {arrivalMutation.isPending ? 'Confirming…' : 'Confirm site arrival'}
          </Button>
        ) : null}

        {canReturnClearance ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              run(
                () => returnMutation.mutateAsync(booking.id),
                'Could not confirm return clearance.',
              )
            }
            disabled={returnMutation.isPending}
          >
            {returnMutation.isPending ? 'Submitting…' : 'Confirm return clearance'}
          </Button>
        ) : null}

        {canDailyCheck && !dailyCheckOpen ? (
          <Button type="button" variant="outline" onClick={() => setDailyCheckOpen(true)}>
            Submit daily check
          </Button>
        ) : null}

        {canInsureGit ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              run(
                () => insuranceMutation.mutateAsync({ bookingId: booking.id, type: 'GIT' }),
                'Could not activate GIT insurance.',
              )
            }
            disabled={insuranceMutation.isPending}
          >
            Activate GIT insurance
          </Button>
        ) : null}

        {canInsurePar ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              run(
                () => insuranceMutation.mutateAsync({ bookingId: booking.id, type: 'PAR' }),
                'Could not activate PAR insurance.',
              )
            }
            disabled={insuranceMutation.isPending}
          >
            Activate PAR insurance
          </Button>
        ) : null}
      </div>

      {dailyCheckOpen ? (
        <div className="rounded-lg border border-slate-200 p-3 space-y-3">
          <p className="text-xs text-slate-500">
            Operator pre-start checklist. Milestone 2 auto-releases on Day 5 if there are no open disputes.
          </p>
          <ul className="space-y-2">
            {DAILY_CHECK_ITEMS.map((item) => (
              <li key={item.key}>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={checks[item.key]}
                    onChange={(e) =>
                      setChecks((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                  />
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
          <textarea
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDailyCheckOpen(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleDailyCheck} disabled={dailyCheckMutation.isPending}>
              {dailyCheckMutation.isPending ? 'Submitting…' : 'Submit checklist'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
