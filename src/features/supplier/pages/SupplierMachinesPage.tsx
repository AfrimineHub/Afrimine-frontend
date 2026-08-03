import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2, Truck } from 'lucide-react';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { ToggleSwitch } from '@/features/supplier/components/ToggleSwitch';
import { canCreatePostOnboardingListing } from '@/features/subscription/listingAccess';
import { useVendorSubscriptionQuery } from '@/features/vendor/dashboardQueries';
import {
  useDeleteAssetMutation,
  useSupplierAssetsQuery,
  useUpdateAssetMutation,
} from '@/features/supplier/onboarding/assetsQueries';
import { normalizeAssetsList } from '@/features/supplier/onboarding/onboardingNormalize';
import {
  ASSET_STATUS_ENUM,
  isAssetAvailable,
  MACHINE_TYPES,
  SUPPLIER_MACHINES_PATH,
} from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

function machineTypeLabel(value: string): string {
  return MACHINE_TYPES.find((t) => t.value === value)?.label ?? value;
}

export default function SupplierMachinesPage() {
  const assetsQuery = useSupplierAssetsQuery();
  const subscriptionQuery = useVendorSubscriptionQuery();
  const deleteMutation = useDeleteAssetMutation();
  const updateMutation = useUpdateAssetMutation();

  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const machines = normalizeAssetsList(assetsQuery.data);
  const canCreateListing = canCreatePostOnboardingListing(subscriptionQuery.data);

  const handleDelete = async (assetId: string) => {
    if (!window.confirm('Remove this machine from your yard? This cannot be undone.')) return;
    setError(null);
    setDeletingId(assetId);
    try {
      await deleteMutation.mutateAsync(assetId);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not delete this machine.'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleAvailabilityToggle = async (assetId: string, nextAvailable: boolean) => {
    setError(null);
    setTogglingId(assetId);
    try {
      await updateMutation.mutateAsync({
        assetId,
        payload: {
          status: nextAvailable ? ASSET_STATUS_ENUM.Available : ASSET_STATUS_ENUM.Inactive,
        },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update availability.'));
    } finally {
      setTogglingId(null);
    }
  };

  if (assetsQuery.isLoading) {
    return (
      <SupplierLayout>
        <p className="text-sm text-slate-500">Loading your machines…</p>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Machines</h1>
          <p className="mt-1 text-sm text-slate-500">
            Equipment in your yard will be listed in the marketplace.
          </p>
        </div>
        {subscriptionQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500 shadow-sm">
            Loading subscription…
          </div>
        ) : canCreateListing ? (
          <Link
            to={`${SUPPLIER_MACHINES_PATH}/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
          >
            <Plus size={18} aria-hidden />
            List New Machine
          </Link>
        ) : (
          <Link
            to="/dashboard/my-subscription"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:border-[#EAB308] hover:text-[#CA8A04]"
          >
            <Plus size={18} aria-hidden />
            Upgrade to List More
          </Link>
        )}
      </div>

      {!subscriptionQuery.isLoading && !canCreateListing ? (
        <p className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
          Your first machine is created during onboarding. Upgrade your subscription before adding another one.
        </p>
      ) : null}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {machines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Truck className="mx-auto text-slate-300" size={36} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-slate-700">No machines listed yet</p>
          <p className="mt-1 text-xs text-slate-500">Add your first excavator, bulldozer, or loader.</p>
          {canCreateListing ? (
            <Link
              to={`${SUPPLIER_MACHINES_PATH}/new`}
              className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#EAB308]"
            >
              List New Machine
            </Link>
          ) : (
            <Link
              to="/dashboard/my-subscription"
              className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#EAB308]"
            >
              Upgrade to List
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {machines.map((machine) => {
            const assetId = machine.remoteId!;
            const available = isAssetAvailable(machine.status);

            return (
              <article
                key={assetId}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {machineTypeLabel(machine.machineType)}
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {machine.brand} {machine.model}
                </h2>
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-2">
                    <dt>Year</dt>
                    <dd className="font-semibold text-slate-900">{machine.yearOfManufacture}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Engine hours</dt>
                    <dd className="font-semibold text-slate-900">{machine.engineHours}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Daily rate</dt>
                    <dd className="font-semibold text-slate-900">
                      NGN {Number(machine.dailyRentalRate || 0).toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Operator</dt>
                    <dd className="font-semibold text-slate-900">
                      {machine.includesOperator ? 'Included' : 'Not included'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <ToggleSwitch
                    label={available ? 'Available' : 'Unavailable'}
                    description="Shown in marketplace when on"
                    checked={available}
                    onChange={(checked) => handleAvailabilityToggle(assetId, checked)}
                  />
                  {togglingId === assetId ? (
                    <p className="mt-1 text-xs text-slate-400">Updating…</p>
                  ) : null}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`${SUPPLIER_MACHINES_PATH}/${assetId}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#EAB308]"
                  >
                    <Pencil size={14} aria-hidden />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(assetId)}
                    disabled={deletingId === assetId}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={14} aria-hidden />
                    {deletingId === assetId ? '…' : 'Delete'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SupplierLayout>
  );
}
