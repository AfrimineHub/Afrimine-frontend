import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { MachineAssetForm } from '@/features/supplier/components/MachineAssetForm';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { SubscriptionRequiredNotice } from '@/features/subscription/components/SubscriptionRequiredNotice';
import { canCreateNewListing, getListingQuota } from '@/features/subscription/listingAccess';
import { useVendorSubscriptionQuery } from '@/features/vendor/dashboardQueries';
import { createEmptyMachine } from '@/features/supplier/types';
import { SUPPLIER_MACHINES_PATH } from '@/features/supplier/constants';
import {
  useCreateAssetMutation,
  useUploadAssetPhotosMutation,
} from '@/features/supplier/onboarding/assetsQueries';
import { MACHINE_TYPE_ENUM, type AssetPhotosPayload, type CreateAssetPayload } from '@/features/supplier/onboarding/assetsApi';
import { getApiErrorMessage } from '@/lib/api/errors';

function extractCreatedAssetId(created: unknown): string | undefined {
  if (created && typeof created === 'object' && 'id' in created) {
    const id = (created as { id?: unknown }).id;
    return typeof id === 'string' ? id : undefined;
  }
  return undefined;
}

export default function CreateMachinePage() {
  const navigate = useNavigate();
  const subscriptionQuery = useVendorSubscriptionQuery();
  const createAsset = useCreateAssetMutation();
  const uploadPhotos = useUploadAssetPhotosMutation();

  const [machine, setMachine] = useState(createEmptyMachine);
  const [photos, setPhotos] = useState<AssetPhotosPayload>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subscription = subscriptionQuery.data;
  const canCreateListing = canCreateNewListing(subscription);
  const quota = getListingQuota(subscription);
  const planLabel = subscription?.planName?.trim() || 'current';

  const setPhoto = (
    key: keyof AssetPhotosPayload,
    nameKey: 'frontPhotoName' | 'sidePhotoName' | 'serialPhotoName',
    file: File,
  ) => {
    setPhotos((prev) => ({ ...prev, [key]: file }));
    setMachine((prev) => ({ ...prev, [nameKey]: file.name }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !machine.machineType ||
      !machine.brand.trim() ||
      !machine.model.trim() ||
      !machine.yearOfManufacture ||
      !machine.engineHours ||
      !machine.dailyRentalRate ||
      !machine.mobilizationFeePerKm
    ) {
      setError('Complete all machine fields, including daily rate and mobilization fee, before listing.');
      return;
    }
    if (!(machine.machineType in MACHINE_TYPE_ENUM)) {
      setError('Selected machine type is not recognized. Please re-select it.');
      return;
    }
    if (!machine.frontPhotoName || !machine.sidePhotoName || !machine.serialPhotoName) {
      setError('Upload front, side, and serial number plate photos.');
      return;
    }

    const payload: CreateAssetPayload = {
      machineType: MACHINE_TYPE_ENUM[machine.machineType],
      brand: machine.brand.trim(),
      model: machine.model.trim(),
      yearOfManufacture: Number(machine.yearOfManufacture),
      engineHours: Number(machine.engineHours),
      hasCertifiedOperator: machine.includesOperator,
      dailyRentalRate: Number(machine.dailyRentalRate),
      mobilizationFeePerKm: Number(machine.mobilizationFeePerKm),
      description: machine.description,
    };

    setSubmitting(true);
    try {
      const created = await createAsset.mutateAsync(payload);
      const assetId = extractCreatedAssetId(created);
      if (!assetId) {
        throw new Error('Machine was created but no id came back in the expected shape.');
      }

      if (photos.frontPhoto || photos.sidePhoto || photos.serialPlatePhoto) {
        await uploadPhotos.mutateAsync({ assetId, photos });
      }

      navigate(SUPPLIER_MACHINES_PATH);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not create machine listing'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SupplierLayout>
      <Link
        to={SUPPLIER_MACHINES_PATH}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#CA8A04]"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to My Machines
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-slate-900">List New Machine</h1>
      <p className="mb-6 text-sm text-slate-500">
        Add heavy equipment to your yard catalog for miners to discover.
      </p>

      {subscriptionQuery.isLoading ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm sm:p-8">
          Loading subscription…
        </div>
      ) : subscriptionQuery.isError ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-red-50 p-5 text-sm text-red-600 shadow-sm sm:p-8" role="alert">
          <p>{getApiErrorMessage(subscriptionQuery.error, 'Could not load your subscription.')}</p>
          <button
            type="button"
            onClick={() => subscriptionQuery.refetch()}
            className="mt-3 text-sm font-semibold text-red-700 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      ) : !canCreateListing ? (
        <div className="mx-auto max-w-2xl">
          <SubscriptionRequiredNotice
            title="Listing limit reached"
            description={`You've used all ${quota.used} of ${quota.limit} listing${quota.limit === 1 ? '' : 's'} on your ${planLabel} plan. Upgrade to list more machines.`}
            ctaLabel="Upgrade plan"
          />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <MachineAssetForm
            machine={machine}
            index={0}
            canRemove={false}
            onChange={setMachine}
            onRemove={() => undefined}
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Machine photos
            </p>
            <FileDropzone
              label="Front photo"
              accept="image/*"
              fileName={machine.frontPhotoName}
              onFile={(file) => setPhoto('frontPhoto', 'frontPhotoName', file)}
            />
            <FileDropzone
              label="Side photo"
              accept="image/*"
              fileName={machine.sidePhotoName}
              onFile={(file) => setPhoto('sidePhoto', 'sidePhotoName', file)}
            />
            <FileDropzone
              label="Serial number plate"
              accept="image/*"
              fileName={machine.serialPhotoName}
              onFile={(file) => setPhoto('serialPlatePhoto', 'serialPhotoName', file)}
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Listing…' : 'List Machine'}
          </Button>
        </form>
      )}
    </SupplierLayout>
  );
}