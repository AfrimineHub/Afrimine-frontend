import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { SUPPLIER_BASE_CITIES } from '@/features/supplier/constants';
import type { SupplierLocation } from '@/features/supplier/types';

interface Step2LocationProps {
  value: SupplierLocation;
  onChange: (value: SupplierLocation) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2Location({ value, onChange, onContinue, onBack }: Step2LocationProps) {
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const update = <K extends keyof SupplierLocation>(key: K, next: SupplierLocation[K]) => {
    onChange({ ...value, [key]: next });
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
        onChange({
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

  const handleContinue = () => {
    setError(null);
    if (!value.baseCity || !value.yardAddress.trim()) {
      setError('Select a base city and enter your physical yard address.');
      return;
    }
    onContinue();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Location & operations</h2>
      <p className="text-sm text-slate-500 mb-6">
        Pinpoint your yard so we can match nearby miners and logistics partners.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Select
        label="Primary Base City"
        placeholder="Select city"
        options={[...SUPPLIER_BASE_CITIES]}
        value={value.baseCity || undefined}
        onChange={(city) => update('baseCity', city)}
      />

      <Input
        label="Physical Yard Address"
        placeholder="Street, landmark, area"
        value={value.yardAddress}
        onChange={(e) => update('yardAddress', e.target.value)}
        required
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-white p-2 shadow-sm">
              <MapPin className="text-[#CA8A04]" size={18} aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Locate Me on Map</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {value.lat != null && value.lng != null
                  ? `Pinned: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
                  : 'Optional GPS pin for your yard'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            fullWidth={false}
            className="shrink-0"
            onClick={handleLocate}
            disabled={locating}
          >
            {locating ? 'Locating…' : 'Locate Me'}
          </Button>
        </div>
        <div className="mt-4 h-28 rounded-xl bg-slate-200/80 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500">
          Map preview — GPS coordinates saved when available
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
