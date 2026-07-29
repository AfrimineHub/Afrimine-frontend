import { Link } from 'react-router-dom';
import { Plus, Truck } from 'lucide-react';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { useSupplierAssetsQuery } from '@/features/supplier/onboarding/assetsQueries';
import { normalizeAssetsList } from '@/features/supplier/onboarding/onboardingNormalize';
import { MACHINE_TYPES, SUPPLIER_MACHINES_PATH } from '@/features/supplier/constants';
import { useVendorListingsQuery } from '@/features/listings/queries';
import { LISTING_CATEGORY_TYPES } from '@/features/listings/constants';

function machineTypeLabel(value: string): string {
  return MACHINE_TYPES.find((t) => t.value === value)?.label ?? value;
}

export default function SupplierMachinesPage() {
  const assetsQuery = useSupplierAssetsQuery();
  const listingsQuery = useVendorListingsQuery({
    page: 1,
    pageSize: 50,
    categoryType: LISTING_CATEGORY_TYPES.equipment,
  });

  const machines = normalizeAssetsList(assetsQuery.data);
  const apiListings = listingsQuery.data?.items ?? [];

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
            Equipment in your yard — from onboarding and marketplace listings.
          </p>
        </div>
        <Link
          to={`${SUPPLIER_MACHINES_PATH}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
        >
          <Plus size={18} aria-hidden />
          List New Machine
        </Link>
      </div>

      {machines.length === 0 && apiListings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Truck className="mx-auto text-slate-300" size={36} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-slate-700">No machines listed yet</p>
          <p className="mt-1 text-xs text-slate-500">Add your first excavator, bulldozer, or loader.</p>
          <Link
            to={`${SUPPLIER_MACHINES_PATH}/new`}
            className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#EAB308]"
          >
            List New Machine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {machines.map((machine) => (
            <article
              key={machine.remoteId ?? machine.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
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
                  <dt>Operator</dt>
                  <dd className="font-semibold text-slate-900">
                    {machine.includesOperator ? 'Included' : 'Not included'}
                  </dd>
                </div>
              </dl>
            </article>
          ))}

          {apiListings.map((listing) => (
            <article
              key={listing.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Equipment listing
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{listing.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{listing.description}</p>
              <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                {listing.status ?? 'Listed'}
              </span>
            </article>
          ))}
        </div>
      )}
    </SupplierLayout>
  );
}