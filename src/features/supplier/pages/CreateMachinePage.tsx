import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/inputs/Input';
import { Textarea } from '@/shared/inputs/Textarea';
import { Button } from '@/shared/buttons/Button';
import { MachineAssetForm } from '@/features/supplier/components/MachineAssetForm';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { createEmptyMachine } from '@/features/supplier/types';
import { SUPPLIER_MACHINES_PATH } from '@/features/supplier/constants';
import { ListingImageUpload } from '@/features/listings/components/ListingImageUpload';
import { LISTING_CATEGORY_TYPES } from '@/features/listings/constants';
import { useCreateListingMutation } from '@/features/listings/queries';
import { getApiErrorMessage } from '@/lib/api/errors';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
} from '@/features/supplier/onboarding/onboardingStorage';
import { MACHINE_TYPES } from '@/features/supplier/constants';

export default function CreateMachinePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createMutation = useCreateListingMutation();

  const [machine, setMachine] = useState(createEmptyMachine);
  const [description, setDescription] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const typeLabel =
    MACHINE_TYPES.find((t) => t.value === machine.machineType)?.label ?? machine.machineType;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !machine.machineType ||
      !machine.brandModel.trim() ||
      !machine.yearOfManufacture ||
      !machine.engineHours
    ) {
      setError('Complete all machine fields before listing.');
      return;
    }
    if (!description.trim() || !location.trim() || !priceAmount.trim()) {
      setError('Add description, location, and rental price.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        payload: {
          categoryType: LISTING_CATEGORY_TYPES.equipment,
          title: machine.brandModel.trim(),
          description: [
            description.trim(),
            `Engine hours: ${machine.engineHours}.`,
            machine.includesOperator ? 'Certified operator included.' : 'Operator not included.',
          ].join(' '),
          country: 'Nigeria',
          stateOrRegion: location.trim(),
          location: location.trim(),
          priceAmount: Number(priceAmount),
          priceCurrency: 'NGN',
          priceUnit: 'per_month',
          equipmentType: typeLabel || machine.machineType,
          yearManufactured: Number(machine.yearOfManufacture),
          publish: true,
        },
        images,
      });

      const draft = loadOnboardingDraft(user?.id);
      saveOnboardingDraft(
        { ...draft, machines: [...draft.machines.filter((m) => m.brandModel), machine] },
        user?.id,
      );

      navigate(SUPPLIER_MACHINES_PATH);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not create machine listing'));
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

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm"
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

        <Textarea
          label="Description"
          placeholder="Condition, attachments, transport notes…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          label="Yard / pickup location"
          placeholder="City or yard address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <Input
          label="Monthly rental price (NGN)"
          type="number"
          min={0}
          placeholder="e.g. 2500000"
          value={priceAmount}
          onChange={(e) => setPriceAmount(e.target.value)}
          required
        />

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Photos
          </p>
          <ListingImageUpload
            images={images}
            previews={previews}
            onChange={(nextImages, nextPreviews) => {
              setImages(nextImages);
              setPreviews(nextPreviews);
            }}
          />
        </div>

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Listing…' : 'List Machine'}
        </Button>
      </form>
    </SupplierLayout>
  );
}
