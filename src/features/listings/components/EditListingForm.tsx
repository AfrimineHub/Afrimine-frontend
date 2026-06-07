import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Textarea } from '@/shared/inputs/Textarea';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { LISTING_CATEGORY_OPTIONS, type ListingCategoryType } from '@/features/listings/constants';
import { useUpdateListingMutation, useVendorListingQuery } from '@/features/listings/queries';
import type { UpdateListingPayload, VendorListing } from '@/features/listings/types';
import { getApiErrorMessage } from '@/lib/api/errors';

type FormErrors = Partial<Record<string, string>>;

interface EditListingFormProps {
  listingId: string;
}

function buildInitialForm(listing: VendorListing) {
  return {
    title: listing.title ?? '',
    description: listing.description ?? '',
    location: listing.location ?? '',
    country: listing.country ?? '',
    priceDescription: listing.priceDisplay ?? '',
    contactInfo: listing.contactInfo ?? '',
    category: String(listing.categoryType),
  };
}

export const EditListingForm: React.FC<EditListingFormProps> = ({ listingId }) => {
  const navigate = useNavigate();
  const listingQuery = useVendorListingQuery(listingId);
  const updateMutation = useUpdateListingMutation();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    country: '',
    priceDescription: '',
    contactInfo: '',
    category: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (listingQuery.data) {
      setForm(buildInitialForm(listingQuery.data));
    }
  }, [listingQuery.data]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.country.trim()) next.country = 'Country is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (!form.category) next.category = 'Category is required';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const payload: UpdateListingPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      country: form.country.trim(),
      location: form.location.trim(),
      category: Number(form.category) as unknown as ListingCategoryType,
    };

    if (form.priceDescription.trim()) payload.priceDescription = form.priceDescription.trim();
    if (form.contactInfo.trim()) payload.contactInfo = form.contactInfo.trim();

    try {
      await updateMutation.mutateAsync({ id: listingId, payload });
      navigate('/my-ad', { state: { listingUpdated: true } });
    } catch (error) {
      setErrors({ form: getApiErrorMessage(error, 'Could not update listing. Try again.') });
    }
  };

  if (listingQuery.isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (listingQuery.isError) {
    return (
      <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
        {getApiErrorMessage(listingQuery.error, 'Could not load listing details.')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <Select
          label="Category"
          placeholder="Select category"
          options={LISTING_CATEGORY_OPTIONS.map((option) => ({
            label: option.label,
            value: String(option.value),
          }))}
          value={form.category}
          onChange={(value) => updateField('category', String(value))}
        />
        {errors.category ? <p className="text-xs text-red-500">{errors.category}</p> : null}

        <Input
          label="Listing title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          error={errors.description}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => updateField('country', e.target.value)}
            error={errors.country}
            required
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
            error={errors.location}
            required
          />
        </div>

        <Input
          label="Price description"
          placeholder="e.g. ₦900,000 per ton"
          value={form.priceDescription}
          onChange={(e) => updateField('priceDescription', e.target.value)}
        />

        <Input
          label="Contact info (optional)"
          placeholder="Phone, email, or preferred contact method"
          value={form.contactInfo}
          onChange={(e) => updateField('contactInfo', e.target.value)}
        />
      </section>

      {errors.form ? (
        <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="outline" onClick={() => navigate('/my-ad')}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};
