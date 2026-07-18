import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { MachineAssetForm } from '@/features/supplier/components/MachineAssetForm';
import { createEmptyMachine, type MachineAsset } from '@/features/supplier/types';

interface Step3AssetsProps {
  value: MachineAsset[];
  onChange: (machines: MachineAsset[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

function isMachineValid(machine: MachineAsset): boolean {
  return Boolean(
    machine.machineType &&
      machine.brandModel.trim() &&
      machine.yearOfManufacture &&
      machine.engineHours,
  );
}

export function Step3Assets({ value, onChange, onContinue, onBack }: Step3AssetsProps) {
  const [error, setError] = useState<string | null>(null);
  const machines = value.length > 0 ? value : [createEmptyMachine()];

  const updateAt = (index: number, machine: MachineAsset) => {
    const next = [...machines];
    next[index] = machine;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(machines.filter((_, i) => i !== index));
  };

  const addMachine = () => {
    onChange([...machines, createEmptyMachine()]);
  };

  const handleContinue = () => {
    setError(null);
    if (!machines.every(isMachineValid)) {
      setError('Complete machine type, brand/model, year, and engine hours for each asset.');
      return;
    }
    onChange(machines);
    onContinue();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Asset details</h2>
      <p className="text-sm text-slate-500 mb-6">
        List the heavy machinery available in your yard. You can add more later from the dashboard.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4 mb-4">
        {machines.map((machine, index) => (
          <MachineAssetForm
            key={machine.id}
            machine={machine}
            index={index}
            canRemove={machines.length > 1}
            onChange={(next) => updateAt(index, next)}
            onRemove={() => removeAt(index)}
          />
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
        <Button type="button" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
