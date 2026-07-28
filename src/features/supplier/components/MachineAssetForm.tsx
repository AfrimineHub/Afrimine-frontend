import { Input } from '@/shared/inputs/Input';
import { Textarea } from '@/shared/inputs/Textarea';
import { Select } from '@/shared/Select';
import { ToggleSwitch } from '@/features/supplier/components/ToggleSwitch';
import { MACHINE_TYPES } from '@/features/supplier/constants';
import type { MachineAsset } from '@/features/supplier/types';
import { Trash2 } from 'lucide-react';

interface MachineAssetFormProps {
  machine: MachineAsset;
  index: number;
  canRemove: boolean;
  onChange: (machine: MachineAsset) => void;
  onRemove: () => void;
}

export function MachineAssetForm({
  machine,
  index,
  canRemove,
  onChange,
  onRemove,
}: MachineAssetFormProps) {
  const update = <K extends keyof MachineAsset>(key: K, value: MachineAsset[K]) => {
    onChange({ ...machine, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-1">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900">Machine {index + 1}</h3>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} aria-hidden />
            Remove
          </button>
        ) : null}
      </div>

      <Select
        label="Machine Type"
        placeholder="Select machine type"
        options={[...MACHINE_TYPES]}
        value={machine.machineType || undefined}
        onChange={(value) => update('machineType', value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
        <Input
          label="Brand"
          placeholder="e.g. Caterpillar"
          value={machine.brand}
          onChange={(e) => update('brand', e.target.value)}
          required
        />
        <Input
          label="Model"
          placeholder="e.g. 320D"
          value={machine.model}
          onChange={(e) => update('model', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
        <Input
          label="Year of Manufacture"
          placeholder="e.g. 2019"
          type="number"
          min={1980}
          max={new Date().getFullYear() + 1}
          value={machine.yearOfManufacture}
          onChange={(e) => update('yearOfManufacture', e.target.value)}
          required
        />
        <Input
          label="Current Engine Hours"
          placeholder="e.g. 4200"
          type="number"
          min={0}
          value={machine.engineHours}
          onChange={(e) => update('engineHours', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
        <Input
          label="Daily Rental Rate (NGN)"
          placeholder="e.g. 150000"
          type="number"
          min={0}
          value={machine.dailyRentalRate}
          onChange={(e) => update('dailyRentalRate', e.target.value)}
          required
        />
        <Input
          label="Mobilization Fee per KM (NGN)"
          placeholder="e.g. 500"
          type="number"
          min={0}
          value={machine.mobilizationFeePerKm}
          onChange={(e) => update('mobilizationFeePerKm', e.target.value)}
          required
        />
      </div>

      <Textarea
        label="Description (optional)"
        placeholder="Condition, attachments, transport notes…"
        value={machine.description ?? ''}
        onChange={(e) => update('description', e.target.value)}
      />

      <div className="pt-2 pb-1">
        <ToggleSwitch
          label="Certified operator included?"
          description="Does this machine come with its own certified operator?"
          checked={machine.includesOperator}
          onChange={(checked) => update('includesOperator', checked)}
        />
      </div>
    </div>
  );
}