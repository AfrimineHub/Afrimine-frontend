import { lazy, Suspense, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { SUPPLIER_BASE_CITIES } from '@/features/supplier/constants';
import type { SupplierLocation } from '@/features/supplier/types';
import { useSyncLocationMutation } from '../onboardingQueries';
import { getApiErrorMessage } from '@/lib/api/errors';

// Leaflet + react-leaflet are ~470 KB on their own. Loading them only when a
// supplier actually reaches this step (rather than in the main bundle) keeps
// them out of every other page's initial download.
const SupplierLocationMap = lazy(() =>
  import('./SupplierLocationMap').then((m) => ({ default: m.SupplierLocationMap })),
);

function MapSkeleton() {
  return (
    <div className="h-72 animate-pulse rounded-xl border border-slate-300 bg-slate-200" />
  );
}

interface Step2LocationProps {
  initialValue: SupplierLocation;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2Location({ initialValue, onContinue, onBack }: Step2LocationProps) {
  const [value, setValue] = useState<SupplierLocation>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const syncLocation = useSyncLocationMutation();

  const update = <K extends keyof SupplierLocation>(key: K, next: SupplierLocation[K]) => {
    setValue({ ...value, [key]: next });
  };

  const updateCoordinates = (latitude: number, longitude: number) => {
    // Address lookup happens server-side (see syncLocation) rather than
    // calling a geocoding provider directly from the client.
    setValue((current) => ({
      ...current,
      lat: latitude,
      lng: longitude,
    }));
  };

  const handleLocate = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue({
          ...value,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setError('Could not get your location. Enter the yard address manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const handleContinue = async () => {
    setError(null);
    if (!value.baseCity || !value.yardAddress.trim()) {
      setError('Select a base city and enter your physical yard address.');
      return;
    }
    try {
      await syncLocation.mutateAsync(value);
      onContinue();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your location. Please try again.'));
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        Location & operations
      </h2>


      <p className="text-sm text-slate-500 mb-6">
        Pinpoint your yard so we can match nearby miners and logistics partners.
      </p>


      {error && (
        <p
          className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}


      <Select
        label="Primary Base City"
        placeholder="Select city"
        options={[...SUPPLIER_BASE_CITIES]}
        value={value.baseCity || undefined}
        onChange={(city) =>
          update('baseCity', city)
        }
      />


      <Input
        label="Physical Yard Address"
        placeholder="Street, landmark, area"
        value={value.yardAddress}
        onChange={(event) =>
          update(
            'yardAddress',
            event.target.value,
          )
        }
        required
      />


      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-100 p-5">

        <div className="flex items-start gap-3 mb-4">

          <div className="rounded-full bg-white p-2 shadow-sm">
            <MapPin
              className="text-[#CA8A04]"
              size={18}
              aria-hidden
            />
          </div>


          <div>
            <p className="text-sm font-semibold text-slate-800">
              Yard Location
            </p>

            <p className="text-xs text-slate-500">
              {value.lat != null &&
              value.lng != null
                ? `Pinned: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
                : 'Click the map or use Locate Me'}
            </p>
          </div>

        </div>


        <Suspense fallback={<MapSkeleton />}>
          <SupplierLocationMap
            latitude={value.lat}
            longitude={value.lng}
            onLocationChange={
              updateCoordinates
            }
          />
        </Suspense>


        <Button
          type="button"
          variant="outline"
          fullWidth={false}
          className="mt-4"
          onClick={handleLocate}
          disabled={locating}
        >
          {locating
            ? 'Locating…'
            : 'Locate Me'}
        </Button>


      </div>


      <div className="flex flex-col-reverse sm:flex-row gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>


        <Button
          type="button"
          onClick={handleContinue}
        >
          Continue
        </Button>

      </div>


    </div>
  );
}