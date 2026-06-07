import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Textarea } from '@/shared/inputs/Textarea';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { ListingImageUpload } from '@/features/listings/components/ListingImageUpload';
import {
  CURRENCIES,
  EQUIPMENT_CONDITIONS,
  LEASE_TYPES,
  LISTING_CATEGORY_OPTIONS,
  LISTING_CATEGORY_TYPES,
  MINERAL_TYPES,
  PRICE_UNITS,
  type ListingCategoryType,
} from '@/features/listings/constants';
import { useCreateListingMutation } from '@/features/listings/queries';
import type { CreateListingPayload } from '@/features/listings/types';
import { getApiErrorMessage } from '@/lib/api/errors';

type FormErrors = Partial<Record<string, string>>;

const initialForm = {
  title: '',
  description: '',
  country: '',
  stateOrRegion: '',
  location: '',
  priceAmount: '',
  priceCurrency: 'NGN',
  priceUnit: 'per_ton',
  quantity: '',
  mineralType: '',
  gradeOrPurity: '',
  equipmentType: '',
  yearManufactured: '',
  condition: '',
  acreageHectares: '',
  leaseType: '',
  manpowerRole: '',
  availability: '',
};

export const CreateListingForm: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateListingMutation();

  const [categoryType, setCategoryType] = useState<ListingCategoryType | null>(null);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitMode, setSubmitMode] = useState<'draft' | 'publish'>('publish');

  const categoryMeta = useMemo(
    () => LISTING_CATEGORY_OPTIONS.find((c) => c.value === categoryType),
    [categoryType],
  );

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (mode: 'draft' | 'publish'): FormErrors => {
    const next: FormErrors = {};
    if (!categoryType) next.categoryType = 'Select a listing category';
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.country.trim()) next.country = 'Country is required';
    if (!form.stateOrRegion.trim()) next.stateOrRegion = 'State or region is required';
    if (!form.location.trim()) next.location = 'Location details are required';
    if (!form.priceAmount.trim() || Number.isNaN(Number(form.priceAmount)) || Number(form.priceAmount) <= 0) {
      next.priceAmount = 'Enter a valid price';
    }
    if (mode === 'publish' && images.length === 0) {
      next.images = 'Add at least one photo before submitting for review';
    }
    return next;
  };

  const buildPayload = (): CreateListingPayload => {
    const payload: CreateListingPayload = {
      categoryType: categoryType!,
      title: form.title.trim(),
      description: form.description.trim(),
      country: form.country.trim(),
      stateOrRegion: form.stateOrRegion.trim(),
      location: form.location.trim(),
      priceAmount: Number(form.priceAmount),
      priceCurrency: form.priceCurrency,
      priceUnit: form.priceUnit,
    };

    if (form.quantity.trim()) payload.quantity = form.quantity.trim();

    if (categoryType === LISTING_CATEGORY_TYPES.mineral) {
      if (form.mineralType) payload.mineralType = form.mineralType;
      if (form.gradeOrPurity.trim()) payload.gradeOrPurity = form.gradeOrPurity.trim();
    }

    if (categoryType === LISTING_CATEGORY_TYPES.equipment) {
      if (form.equipmentType.trim()) payload.equipmentType = form.equipmentType.trim();
      if (form.yearManufactured.trim()) payload.yearManufactured = Number(form.yearManufactured);
      if (form.condition) payload.condition = form.condition;
    }

    if (categoryType === LISTING_CATEGORY_TYPES.miningSite) {
      if (form.acreageHectares.trim()) payload.acreageHectares = Number(form.acreageHectares);
      if (form.leaseType) payload.leaseType = form.leaseType;
    }

    if (categoryType === LISTING_CATEGORY_TYPES.manpower) {
      if (form.manpowerRole.trim()) payload.manpowerRole = form.manpowerRole.trim();
      if (form.availability.trim()) payload.availability = form.availability.trim();
    }

    return payload;
  };

  const submitListing = async (mode: 'draft' | 'publish') => {
    setSubmitMode(mode);
    const validation = validate(mode);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const payload = buildPayload();
    payload.publish = mode === 'publish';

    try {
      await createMutation.mutateAsync({ payload, images });
      navigate('/my-ad', { state: { listingCreated: true } });
    } catch (error) {
      setErrors({ form: getApiErrorMessage(error, 'Could not create listing. Try again.') });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitListing(submitMode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-1">What are you listing?</h2>
        <p className="text-sm text-gray-500 mb-4">Choose the type that best describes your asset or offering.</p>
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

      {categoryType ? (
        <>
          <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {categoryMeta?.label} details
            </h2>

            <Input
              label="Listing title"
              placeholder="e.g. Premium Gold Ore - High Grade"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              error={errors.title}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe grade, quantity, terms, certifications, and anything buyers should know."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              error={errors.description}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Input
                label="Country"
                placeholder="e.g. Nigeria"
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                error={errors.country}
                required
              />
              <Input
                label="State / Region"
                placeholder="e.g. Osun State"
                value={form.stateOrRegion}
                onChange={(e) => updateField('stateOrRegion', e.target.value)}
                error={errors.stateOrRegion}
                required
              />
            </div>

            <Input
              label="Location details"
              placeholder="Mine name, city, coordinates, or site address"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              error={errors.location}
              required
            />

            <Input
              label="Available quantity (optional)"
              placeholder="e.g. 500 MT, 50 kg, 1 unit"
              value={form.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
            />
          </section>

          {categoryType === LISTING_CATEGORY_TYPES.mineral ? (
            <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Mineral specifics</h3>
              <Select
                label="Mineral type"
                placeholder="Select mineral"
                options={MINERAL_TYPES}
                onChange={(value) => updateField('mineralType', String(value))}
              />
              <Input
                label="Grade / purity (optional)"
                placeholder="e.g. 24K, 99.5% Cu"
                value={form.gradeOrPurity}
                onChange={(e) => updateField('gradeOrPurity', e.target.value)}
              />
            </section>
          ) : null}

          {categoryType === LISTING_CATEGORY_TYPES.equipment ? (
            <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Equipment specifics</h3>
              <Input
                label="Equipment type"
                placeholder="e.g. Hydraulic excavator, rock crusher"
                value={form.equipmentType}
                onChange={(e) => updateField('equipmentType', e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Input
                  label="Year manufactured (optional)"
                  type="number"
                  min={1950}
                  max={new Date().getFullYear() + 1}
                  value={form.yearManufactured}
                  onChange={(e) => updateField('yearManufactured', e.target.value)}
                />
                <Select
                  label="Condition"
                  placeholder="Select condition"
                  options={EQUIPMENT_CONDITIONS}
                  onChange={(value) => updateField('condition', String(value))}
                />
              </div>
            </section>
          ) : null}

          {categoryType === LISTING_CATEGORY_TYPES.miningSite ? (
            <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Mining site specifics</h3>
              <Select
                label="Offering type"
                placeholder="Lease, sale, or JV"
                options={LEASE_TYPES}
                onChange={(value) => updateField('leaseType', String(value))}
              />
              <Input
                label="Site size (hectares, optional)"
                type="number"
                min={0}
                value={form.acreageHectares}
                onChange={(e) => updateField('acreageHectares', e.target.value)}
              />
            </section>
          ) : null}

          {categoryType === LISTING_CATEGORY_TYPES.manpower ? (
            <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Manpower specifics</h3>
              <Input
                label="Role / service"
                placeholder="e.g. Geologists, drill operators, safety officers"
                value={form.manpowerRole}
                onChange={(e) => updateField('manpowerRole', e.target.value)}
              />
              <Input
                label="Availability"
                placeholder="e.g. Immediate, 30-day contract"
                value={form.availability}
                onChange={(e) => updateField('availability', e.target.value)}
              />
            </section>
          ) : null}

          <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <Input
                label="Price"
                type="number"
                min={0}
                step="any"
                placeholder="900000"
                value={form.priceAmount}
                onChange={(e) => updateField('priceAmount', e.target.value)}
                error={errors.priceAmount}
                required
              />
              <Select
                label="Currency"
                options={[...CURRENCIES]}
                onChange={(value) => updateField('priceCurrency', String(value))}
              />
              <Select
                label="Price unit"
                options={[...PRICE_UNITS]}
                onChange={(value) => updateField('priceUnit', String(value))}
              />
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Photos</h2>
            <ListingImageUpload
              files={images}
              previews={previews}
              onChange={(f, p) => {
                setImages(f);
                setPreviews(p);
                setErrors((prev) => ({ ...prev, images: undefined }));
              }}
              error={errors.images}
            />
          </section>

          {errors.form ? (
            <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => void submitListing('draft')}
            >
              Save as draft
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              onClick={() => setSubmitMode('publish')}
            >
              {createMutation.isPending ? 'Submitting…' : 'Submit for review'}
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Submitted listings are reviewed before they appear on the marketplace.
          </p>
        </>
      ) : null}
    </form>
  );
};
