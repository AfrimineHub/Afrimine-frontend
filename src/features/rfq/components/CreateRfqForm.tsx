import React, { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Textarea } from '@/shared/inputs/Textarea';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { useCreateBuyerRfqMutation } from '@/features/buyer/dashboardQueries';
import { getApiErrorMessage } from '@/lib/api/errors';
import {
  EQUIPMENT_CONDITIONS,
  LEASE_TYPES,
  LISTING_CATEGORY_OPTIONS,
  LISTING_CATEGORY_TYPES,
  MINERAL_TYPES,
  PRICE_UNITS,
  type ListingCategoryType,
} from '@/features/listings/constants';

type FormErrors = Partial<Record<string, string>>;

const CURRENCY_OPTIONS = [
  { label: 'NGN (₦)', value: 'NGN' },
  { label: 'USD ($)', value: 'USD' },
];

const initialForm = {
  title: '',
  description: '',
  country: '',
  location: '',
  quantity: '',
  unit: 'per_ton',
  targetPrice: '',
  budgetCurrency: 'NGN',
  // Mineral specifics
  mineralType: '',
  gradeOrPurity: '',
  // Equipment specifics
  equipmentType: '',
  yearManufactured: '',
  condition: '',
  // Mining Site specifics
  acreageHectares: '',
  leaseType: '',
  // Manpower specifics
  manpowerRole: '',
  availability: '',
};

interface CreateRfqFormProps {
  onSuccess?: () => void;
}

export const CreateRfqForm: React.FC<CreateRfqFormProps> = ({ onSuccess }) => {
  const createMutation = useCreateBuyerRfqMutation();

  const [categoryType, setCategoryType] = useState<ListingCategoryType | null>(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const categoryMeta = useMemo(
    () => LISTING_CATEGORY_OPTIONS.find((c) => c.value === categoryType),
    [categoryType]
  );

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!categoryType) next.categoryType = 'Select a request category';
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.country.trim()) next.country = 'Country is required';
    if (!form.location.trim()) next.location = 'Preferred location is required';
    if (!form.quantity.trim()) next.quantity = 'Quantity is required';
    
    if (form.targetPrice.trim() && (Number.isNaN(Number(form.targetPrice)) || Number(form.targetPrice) < 0)) {
      next.targetPrice = 'Enter a valid target price';
    }
    return next;
  };

  const buildPayload = () => {
    const payload: any = {
      categoryType: categoryType!,
      title: form.title.trim(),
      description: form.description.trim(),
      country: form.country.trim(),
      location: form.location.trim(),
      quantity: form.quantity.trim(),
      unit: form.unit,
      budgetCurrency: form.budgetCurrency,
    };

    if (form.targetPrice.trim()) payload.targetPrice = form.targetPrice.trim();

    // Category Specific Payload Construction
    if (categoryType === LISTING_CATEGORY_TYPES.mineral) {
      payload.mineralType = form.mineralType || form.title.trim();
      if (form.gradeOrPurity.trim()) payload.gradeOrPurity = form.gradeOrPurity.trim();
    }

    if (categoryType === LISTING_CATEGORY_TYPES.equipment) {
      payload.equipmentType = form.equipmentType.trim() || form.title.trim();
      if (form.yearManufactured.trim()) payload.yearManufactured = Number(form.yearManufactured);
      if (form.condition) payload.condition = form.condition;
    }

    if (categoryType === LISTING_CATEGORY_TYPES.miningSite) {
      if (form.acreageHectares.trim()) payload.acreageHectares = Number(form.acreageHectares);
      if (form.leaseType) payload.leaseType = form.leaseType;
    }

    if (categoryType === LISTING_CATEGORY_TYPES.manpower) {
      payload.manpowerRole = form.manpowerRole.trim() || form.title.trim();
      if (form.availability.trim()) payload.availability = form.availability.trim();
    }

    return payload;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const payload = buildPayload();

    createMutation.mutate(payload, {
      onSuccess: () => {
        setForm(initialForm);
        setCategoryType(null);
        setErrors({});
        onSuccess?.();
      },
      onError: (error) => {
        setErrors({ form: getApiErrorMessage(error, 'Could not post your request.') });
      },
    });
  };

  const errorMessage = errors.form || (createMutation.isError && getApiErrorMessage(createMutation.error, 'Could not post your request.'));

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
      {/* Introduction Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Post a buying request</h2>
        <p className="text-sm text-gray-500 mt-1">
          Can&apos;t find what you need in the{' '}
          <Link to="/marketplace" className="text-yellow-700 font-medium hover:underline">
            marketplace
          </Link>
          ? Describe it here and vendors who have it will message you.
        </p>
      </div>

      {/* Step 1: Category Selector */}
      <section>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">What type of requirement do you have?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LISTING_CATEGORY_OPTIONS.map((option) => {
            const selected = categoryType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setCategoryType(option.value);
                  setErrors((prev) => ({ ...prev, categoryType: undefined }));
                }}
                className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selected
                    ? 'border-yellow-500 bg-yellow-50/50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <p className="font-bold text-slate-900">{option.label}</p>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </button>
            );
          })}
        </div>
        {errors.categoryType ? <p className="text-xs text-red-500 mt-2">{errors.categoryType}</p> : null}
      </section>

      {/* Dynamic Sections Rendered Only After Category Selection */}
      {categoryType ? (
        <>
          {/* Step 2: Shared Fields */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-gray-50 pb-2">
              {categoryMeta?.label} Requirement Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Request title"
                placeholder="e.g. Looking for High-Grade Lithium Ore"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                error={errors.title}
                required
              />
              <Input
                label="Destination / Target Country"
                placeholder="e.g. Nigeria"
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                error={errors.country}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preferred collection location"
                placeholder="e.g. Apapa Port, Lagos or Ex-Mine Osun"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                error={errors.location}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantity needed"
                  placeholder="e.g. 500"
                  value={form.quantity}
                  onChange={(e) => updateField('quantity', e.target.value)}
                  error={errors.quantity}
                  required
                />
                <Select
                  label="Unit"
                  options={[...PRICE_UNITS]}
                  value={form.unit}
                  onChange={(value) => updateField('unit', String(value))}
                />
              </div>
            </div>
          </section>

          {/* Step 3: Category Specific Fields */}
          {categoryType === LISTING_CATEGORY_TYPES.mineral && (
            <section className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mineral Specifics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Mineral type"
                  placeholder="Select mineral"
                  options={MINERAL_TYPES}
                  value={form.mineralType}
                  onChange={(value) => updateField('mineralType', String(value))}
                />
                <Input
                  label="Required Grade / Purity"
                  placeholder="e.g. Li2O > 6%, 99.9% purity"
                  value={form.gradeOrPurity}
                  onChange={(e) => updateField('gradeOrPurity', e.target.value)}
                />
              </div>
            </section>
          )}

          {categoryType === LISTING_CATEGORY_TYPES.equipment && (
            <section className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Equipment Requirements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Equipment type"
                  placeholder="e.g. Rock Crusher"
                  value={form.equipmentType}
                  onChange={(e) => updateField('equipmentType', e.target.value)}
                />
                <Input
                  label="Year Manufactured (Min)"
                  type="number"
                  placeholder="e.g. 2018"
                  value={form.yearManufactured}
                  onChange={(e) => updateField('yearManufactured', e.target.value)}
                />
                <Select
                  label="Acceptable Condition"
                  placeholder="Select condition"
                  options={EQUIPMENT_CONDITIONS}
                  value={form.condition}
                  onChange={(value) => updateField('condition', String(value))}
                />
              </div>
            </section>
          )}

          {categoryType === LISTING_CATEGORY_TYPES.miningSite && (
            <section className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mining Site preferences</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Preferred arrangement"
                  placeholder="Lease, sale, or JV"
                  options={LEASE_TYPES}
                  value={form.leaseType}
                  onChange={(value) => updateField('leaseType', String(value))}
                />
                <Input
                  label="Minimum Size (Hectares)"
                  type="number"
                  placeholder="e.g. 50"
                  value={form.acreageHectares}
                  onChange={(e) => updateField('acreageHectares', e.target.value)}
                />
              </div>
            </section>
          )}

          {categoryType === LISTING_CATEGORY_TYPES.manpower && (
            <section className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Manpower Profile Requirements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Role / Service Type"
                  placeholder="e.g. Core Drill Operator"
                  value={form.manpowerRole}
                  onChange={(e) => updateField('manpowerRole', e.target.value)}
                />
                <Input
                  label="Required Engagement Timeline"
                  placeholder="e.g. 6-month contract, Immediate deployment"
                  value={form.availability}
                  onChange={(e) => updateField('availability', e.target.value)}
                />
              </div>
            </section>
          )}

          {/* Step 4: Budget Details & Description */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-gray-50 pb-2">Target Pricing & Additional Data</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Target Price (optional)"
                  placeholder="e.g. 450000"
                  type="number"
                  min="0"
                  value={form.targetPrice}
                  onChange={(e) => updateField('targetPrice', e.target.value)}
                  error={errors.targetPrice}
                />
              </div>
              <Select
                label="Currency"
                value={form.budgetCurrency}
                onChange={(value) => updateField('budgetCurrency', String(value))}
                options={CURRENCY_OPTIONS}
              />
            </div>

            <Textarea
              label="Comprehensive Scope / Additional Requirements"
              placeholder="Provide context regarding required compliance documentations, certifications, preferred payment milestones, or inspection parameters..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
            />
          </section>

          {/* Error Banner */}
          {errorMessage ? (
            <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {/* Form Actions */}
          <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
            {createMutation.isPending ? 'Posting…' : 'Post request'}
          </Button>
        </>
      ) : null}
    </form>
  );
};