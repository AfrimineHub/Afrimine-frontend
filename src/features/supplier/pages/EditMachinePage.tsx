import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { MachineAssetForm } from '@/features/supplier/components/MachineAssetForm';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { ToggleSwitch } from '@/features/supplier/components/ToggleSwitch';
import { AssignOperatorPanel } from '@/features/supplier/components/AssignOperatorPanel';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { createEmptyMachine, type MachineAsset } from '@/features/supplier/types';
import {
  isAssetAvailable,
  SUPPLIER_MACHINES_PATH,
  toAssetStatusEnum,
} from '@/features/supplier/constants';
import {
  useSupplierAssetQuery,
  useUpdateAssetMutation,
  useUploadAssetPhotosMutation,
} from '@/features/supplier/onboarding/assetsQueries';
import { normalizeMachineAsset } from '@/features/supplier/onboarding/onboardingNormalize';
import {
  MACHINE_TYPE_ENUM,
  type AssetPhotosPayload,
  type UpdateAssetPayload,
} from '@/features/supplier/onboarding/assetsApi';
import { getApiErrorMessage } from '@/lib/api/errors';

function toUpdatePayload(machine: MachineAsset): UpdateAssetPayload {
  return {
    machineType: MACHINE_TYPE_ENUM[machine.machineType],
    brand: machine.brand.trim(),
    model: machine.model.trim(),
    yearOfManufacture: Number(machine.yearOfManufacture),
    engineHours: Number(machine.engineHours),
    hasCertifiedOperator: machine.includesOperator,
    dailyRentalRate: Number(machine.dailyRentalRate),
    mobilizationFeePerKm: Number(machine.mobilizationFeePerKm),
    description: machine.description,
    status: toAssetStatusEnum(machine.status),
  };
}

export default function EditMachinePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const assetQuery = useSupplierAssetQuery(id);
  const updateAsset = useUpdateAssetMutation();
  const uploadPhotos = useUploadAssetPhotosMutation();

  const [machine, setMachine] = useState<MachineAsset>(createEmptyMachine);
  const [photos, setPhotos] = useState<AssetPhotosPayload>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!assetQuery.data || hydrated) return;
    const normalized = normalizeMachineAsset(assetQuery.data);
    if (normalized) {
      setMachine(normalized);
      setHydrated(true);
    }
  }, [assetQuery.data, hydrated]);

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

    if (!id) return;

    if (
      !machine.machineType ||
      !machine.brand.trim() ||
      !machine.model.trim() ||
      !machine.yearOfManufacture ||
      !machine.engineHours ||
      !machine.dailyRentalRate ||
      !machine.mobilizationFeePerKm
    ) {
      setError('Complete all machine fields before saving.');
      return;
    }
    if (!(machine.machineType in MACHINE_TYPE_ENUM)) {
      setError('Selected machine type is not recognized. Please re-select it.');
      return;
    }

    setSubmitting(true);
    try {
      await updateAsset.mutateAsync({ assetId: id, payload: toUpdatePayload(machine) });

      if (photos.frontPhoto || photos.sidePhoto || photos.serialPlatePhoto) {
        await uploadPhotos.mutateAsync({ assetId: id, photos });
      }

      navigate(SUPPLIER_MACHINES_PATH);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update machine listing'));
    } finally {
      setSubmitting(false);
    }
  };

  if (assetQuery.isLoading) {
    return (
      <SupplierLayout>
        <p className="text-sm text-slate-500">Loading machine…</p>
      </SupplierLayout>
    );
  }

  if (assetQuery.isError || (!hydrated && !assetQuery.isLoading)) {
    return (
      <SupplierLayout>
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {getApiErrorMessage(assetQuery.error, 'Could not load this machine.')}
        </p>
        <Link to={SUPPLIER_MACHINES_PATH} className="mt-4 inline-block text-sm font-semibold text-[#CA8A04]">
          Back to My Machines
        </Link>
      </SupplierLayout>
    );
  }

  const available = isAssetAvailable(machine.status);

  return (
    <SupplierLayout>
      <Link
        to={SUPPLIER_MACHINES_PATH}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#CA8A04]"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to My Machines
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-slate-900">Edit Machine</h1>
      <p className="mb-6 text-sm text-slate-500">
        Update pricing, details, photos, or marketplace availability.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <ToggleSwitch
            label="Available in marketplace"
            description="Turn off to hide this machine from buyers while keeping it in your yard."
            checked={available}
            onChange={(checked) =>
              setMachine((prev) => ({
                ...prev,
                status: checked ? 'Available' : 'Inactive',
              }))
            }
          />
        </div>

        <MachineAssetForm
          machine={machine}
          index={0}
          canRemove={false}
          onChange={setMachine}
          onRemove={() => undefined}
        />

        {id ? <AssignOperatorPanel assetId={id} /> : null}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Replace photos (optional)
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
          {submitting ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </SupplierLayout>
  );
}
