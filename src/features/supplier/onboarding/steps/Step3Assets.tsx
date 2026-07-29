import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { MachineAssetForm } from '@/features/supplier/components/MachineAssetForm';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { createEmptyMachine, type MachineAsset } from '@/features/supplier/types';
import {
  useCreateAssetMutation,
  useUploadAssetPhotosMutation,
} from '@/features/supplier/onboarding/assetsQueries';
import {
  MACHINE_TYPE_ENUM,
  type AssetPhotosPayload,
  type CreateAssetPayload,
} from '@/features/supplier/onboarding/assetsApi';
import { getApiErrorMessage } from '@/lib/api/errors';

interface Step3AssetsProps {
  initialValue: MachineAsset[];
  onContinue: () => void;
  onBack: () => void;
}

function isMachineValid(machine: MachineAsset): boolean {
  return Boolean(
    machine.machineType &&
      machine.brand.trim() &&
      machine.model.trim() &&
      machine.yearOfManufacture &&
      machine.engineHours &&
      machine.dailyRentalRate &&
      machine.mobilizationFeePerKm &&
      machine.frontPhotoName &&
      machine.sidePhotoName &&
      machine.serialPhotoName,
  );
}

function extractCreatedAssetId(created: unknown): string | undefined {
  if (created && typeof created === 'object' && 'id' in created) {
    const id = (created as { id?: unknown }).id;
    return typeof id === 'string' ? id : undefined;
  }
  return undefined;
}

export function Step3Assets({ initialValue, onContinue, onBack }: Step3AssetsProps) {
  const [machinesState, setMachinesState] = useState<MachineAsset[]>(
    initialValue.length > 0 ? initialValue : [createEmptyMachine()],
  );
  const [error, setError] = useState<string | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const createAsset = useCreateAssetMutation();
  const uploadPhotos = useUploadAssetPhotosMutation();
  const machines = machinesState.length > 0 ? machinesState : [createEmptyMachine()];

  const photoFilesRef = useRef<Record<number, AssetPhotosPayload>>({});

  const updateAt = (index: number, machine: MachineAsset) => {
    const next = [...machines];
    next[index] = machine;
    setMachinesState(next);
  };

  const removeAt = (index: number) => {
    delete photoFilesRef.current[index];
    setMachinesState(machines.filter((_, i) => i !== index));
  };

  const addMachine = () => {
    setMachinesState([...machines, createEmptyMachine()]);
  };

  const setPhoto = (
    index: number,
    photoKey: keyof AssetPhotosPayload,
    nameKey: 'frontPhotoName' | 'sidePhotoName' | 'serialPhotoName',
    file: File,
  ) => {
    photoFilesRef.current[index] = { ...photoFilesRef.current[index], [photoKey]: file };
    updateAt(index, { ...machines[index], [nameKey]: file.name });
  };

  const handleContinue = async () => {
    setError(null);

    if (!machines.every(isMachineValid)) {
      setError(
        'Complete machine type, brand, model, year, engine hours, pricing, and all three photos for each asset.',
      );
      return;
    }

    const unmapped = machines.find((m) => !(m.machineType in MACHINE_TYPE_ENUM));
    if (unmapped) {
      setError(
        `Unrecognized machine type "${unmapped.machineType}" — check MACHINE_TYPE_ENUM matches the backend MachineType enum.`
      );
      return;
    }

    const next = [...machines];
    try {
      for (let i = 0; i < next.length; i++) {
        setSavingIndex(i);
        let machine = next[i];

        if (!machine.remoteId) {
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
          const created = await createAsset.mutateAsync(payload);
          const createdId = extractCreatedAssetId(created);
          if (!createdId) {
            throw new Error(
              `Asset ${i + 1} was created but no id came back in the expected shape — check the real response payload.`,
            );
          }
          machine = { ...machine, remoteId: createdId };
          next[i] = machine;
          setMachinesState(next);
        }

        const pendingPhotos = photoFilesRef.current[i];
        if (machine.remoteId && pendingPhotos && Object.keys(pendingPhotos).length > 0) {
          await uploadPhotos.mutateAsync({ assetId: machine.remoteId, photos: pendingPhotos });
          delete photoFilesRef.current[i];
        }
      }

      setSavingIndex(null);
      onContinue();
    } catch (err) {
      setSavingIndex(null);
      setError(
        getApiErrorMessage(
          err,
          'Could not save one or more machines. Machines already saved are kept — fix the error above and try again.',
        ),
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Asset details</h2>
      <p className="text-sm text-slate-500 mb-6">
        List the heavy machinery available in your yard, with photos for field verification. You
        can add more later from the dashboard.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4 mb-4">
        {machines.map((machine, index) => (
          <div key={machine.id} className="space-y-3">
            <MachineAssetForm
              machine={machine}
              index={index}
              canRemove={machines.length > 1}
              onChange={(next) => updateAt(index, next)}
              onRemove={() => removeAt(index)}
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Machine photos
              </p>
              <FileDropzone
                label="Front photo"
                accept="image/*"
                fileName={machine.frontPhotoName}
                onFile={(file) => setPhoto(index, 'frontPhoto', 'frontPhotoName', file)}
              />
              <FileDropzone
                label="Side photo"
                accept="image/*"
                fileName={machine.sidePhotoName}
                onFile={(file) => setPhoto(index, 'sidePhoto', 'sidePhotoName', file)}
              />
              <FileDropzone
                label="Serial number plate"
                accept="image/*"
                fileName={machine.serialPhotoName}
                onFile={(file) => setPhoto(index, 'serialPlatePhoto', 'serialPhotoName', file)}
              />
            </div>

            {savingIndex === index && (
              <p className="text-xs font-medium text-[#CA8A04]">Saving this machine…</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMachine}
        className="mb-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-[#EAB308] hover:text-[#CA8A04]"
      >
        <Plus size={16} aria-hidden />
        Add more machines
      </button>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleContinue} disabled={savingIndex !== null}>
          {savingIndex !== null ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}