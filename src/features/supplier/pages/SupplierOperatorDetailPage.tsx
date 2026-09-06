import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { Input } from '@/shared/inputs/Input';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import {
  useAddGuarantorMutation,
  useOperatorVettingStatusQuery,
  useOperatorsQuery,
  useSubmitVettingMutation,
  useUpdateOperatorMutation,
} from '@/features/supplier/operators/operatorsQueries';
import {
  DEFAULT_LICENSE_CATEGORY,
  GUARANTOR_ID_TYPES,
  normalizeOperatorsList,
  normalizeVettingStatusResponse,
  VETTING_STATUS_LABELS,
  VETTING_STATUS_STYLES,
} from '@/features/supplier/operators/operatorsUtils';
import { SUPPLIER_OPERATORS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function SupplierOperatorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const operatorsQuery = useOperatorsQuery();
  const vettingQuery = useOperatorVettingStatusQuery(id);
  const updateMutation = useUpdateOperatorMutation();
  const guarantorMutation = useAddGuarantorMutation();
  const vettingMutation = useSubmitVettingMutation();

  const operator = useMemo(() => {
    const list = normalizeOperatorsList(operatorsQuery.data);
    return list.find((o) => o.id === id) ?? null;
  }, [operatorsQuery.data, id]);

  const vetting = normalizeVettingStatusResponse(vettingQuery.data);
  const status = vettingQuery.isSuccess ? vetting.status : (operator?.vettingStatus ?? 'NotStarted');
  const feedback = vetting.feedback ?? operator?.feedback ?? null;
  const guarantorCount = operator?.guarantors.length ?? 0;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile edit
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState(DEFAULT_LICENSE_CATEGORY);
  const [yearsOfExperience, setYearsOfExperience] = useState('3');
  const [licenseDocument, setLicenseDocument] = useState<File | null>(null);
  const [profileHydrated, setProfileHydrated] = useState(false);

  useEffect(() => {
    if (!operator || profileHydrated) return;
    setFullName(operator.fullName);
    setPhoneNumber(operator.phoneNumber === '—' ? '' : operator.phoneNumber);
    setLicenseNumber(operator.licenseNumber === '—' ? '' : operator.licenseNumber);
    setLicenseCategory(operator.licenseCategory ?? DEFAULT_LICENSE_CATEGORY);
    setYearsOfExperience(String(operator.yearsOfExperience || 3));
    setProfileHydrated(true);
  }, [operator, profileHydrated]);

  // Guarantor form
  const [gFullName, setGFullName] = useState('');
  const [gPhone, setGPhone] = useState('');
  const [gOccupation, setGOccupation] = useState('');
  const [gIdType, setGIdType] = useState<string>(GUARANTOR_ID_TYPES[0]);
  const [gIdNumber, setGIdNumber] = useState('');

  // Vetting form
  const [terrainAnswer, setTerrainAnswer] = useState('');
  const [maintenanceAnswer, setMaintenanceAnswer] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSuccess(null);
    const years = Number(yearsOfExperience);
    if (!fullName.trim() || !phoneNumber.trim() || !licenseNumber.trim()) {
      setError('Name, phone, and license number are required.');
      return;
    }
    if (!Number.isFinite(years) || years < 0) {
      setError('Enter a valid years of experience.');
      return;
    }
    try {
      await updateMutation.mutateAsync({
        operatorId: id,
        fields: {
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          licenseNumber: licenseNumber.trim(),
          licenseCategory: licenseCategory.trim() || DEFAULT_LICENSE_CATEGORY,
          yearsOfExperience: years,
          licenseDocument,
        },
      });
      setLicenseDocument(null);
      setSuccess('Operator details updated.');
      await operatorsQuery.refetch();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update operator.'));
    }
  };

  const handleAddGuarantor = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSuccess(null);
    if (guarantorCount >= 2) {
      setError('Each operator can have at most 2 guarantors.');
      return;
    }
    if (!gFullName.trim() || !gPhone.trim() || !gOccupation.trim() || !gIdNumber.trim()) {
      setError('Complete all guarantor fields.');
      return;
    }
    try {
      await guarantorMutation.mutateAsync({
        operatorId: id,
        payload: {
          fullName: gFullName.trim(),
          phoneNumber: gPhone.trim(),
          occupation: gOccupation.trim(),
          idType: gIdType,
          idNumber: gIdNumber.trim(),
        },
      });
      setGFullName('');
      setGPhone('');
      setGOccupation('');
      setGIdNumber('');
      setSuccess('Guarantor added.');
      await operatorsQuery.refetch();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not add guarantor.'));
    }
  };

  const handleSubmitVetting = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSuccess(null);
    if (guarantorCount < 2) {
      setError('Add 2 guarantors before submitting vetting.');
      return;
    }
    if (terrainAnswer.trim().length < 20) {
      setError('Terrain knowledge answer must be at least 20 characters.');
      return;
    }
    if (!maintenanceAnswer.trim()) {
      setError('Daily maintenance answer is required.');
      return;
    }
    try {
      await vettingMutation.mutateAsync({
        operatorId: id,
        payload: {
          terrainKnowledgeAnswer: terrainAnswer.trim(),
          dailyMaintenanceAnswer: maintenanceAnswer.trim(),
          additionalNotes: additionalNotes.trim() || null,
        },
      });
      setSuccess('Vetting submitted. Check the status badge for the result.');
      await Promise.all([operatorsQuery.refetch(), vettingQuery.refetch()]);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not submit vetting.'));
    }
  };

  if (operatorsQuery.isLoading) {
    return (
      <SupplierLayout>
        <p className="text-sm text-slate-500">Loading operator…</p>
      </SupplierLayout>
    );
  }

  if (!operator) {
    return (
      <SupplierLayout>
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {getApiErrorMessage(operatorsQuery.error, 'Could not find this operator.')}
        </p>
        <Link
          to={SUPPLIER_OPERATORS_PATH}
          className="mt-4 inline-block text-sm font-semibold text-[#CA8A04]"
        >
          Back to operators
        </Link>
      </SupplierLayout>
    );
  }

  const canSubmitVetting =
    guarantorCount >= 2 && (status === 'NotStarted' || status === 'Failed');

  return (
    <SupplierLayout>
      <Link
        to={SUPPLIER_OPERATORS_PATH}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#CA8A04]"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to operators
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{operator.fullName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete guarantors and vetting before assigning to a machine.
          </p>
        </div>
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${VETTING_STATUS_STYLES[status]}`}
        >
          {VETTING_STATUS_LABELS[status]}
        </span>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          {success}
        </p>
      ) : null}
      {feedback && status === 'Failed' ? (
        <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          Vetting feedback: {feedback}
        </p>
      ) : null}

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">Operator details</h2>
          <p className="mt-1 text-xs text-slate-500">
            Update experience or license after a failed vetting, then resubmit.
          </p>
          <form onSubmit={handleUpdateProfile} className="mt-4 space-y-2">
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <Input
              label="Phone number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <Input
              label="License number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
            <Input
              label="License category"
              value={licenseCategory}
              onChange={(e) => setLicenseCategory(e.target.value)}
            />
            <Input
              label="Years of experience"
              type="number"
              min={0}
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              required
            />
            <FileDropzone
              label="Replace license document (optional)"
              accept="image/*,.pdf"
              fileName={licenseDocument?.name}
              onFile={setLicenseDocument}
            />
            <Button type="submit" disabled={updateMutation.isPending} fullWidth={false} className="mt-2">
              {updateMutation.isPending ? 'Saving…' : 'Save details'}
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Guarantors ({guarantorCount}/2)
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Exactly 2 guarantors are required before vetting can be submitted.
          </p>

          {operator.guarantors.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {operator.guarantors.map((g, idx) => (
                <li
                  key={g.id ?? `${g.fullName}-${idx}`}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <p className="font-semibold text-slate-900">{g.fullName}</p>
                  <p className="text-slate-500">
                    {g.phoneNumber} · {g.occupation} · {g.idType} {g.idNumber}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No guarantors added yet.</p>
          )}

          {guarantorCount < 2 ? (
            <form onSubmit={handleAddGuarantor} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              <Input
                label="Guarantor full name"
                value={gFullName}
                onChange={(e) => setGFullName(e.target.value)}
                required
              />
              <Input
                label="Phone number"
                type="tel"
                value={gPhone}
                onChange={(e) => setGPhone(e.target.value)}
                required
              />
              <Input
                label="Occupation"
                value={gOccupation}
                onChange={(e) => setGOccupation(e.target.value)}
                required
              />
              <div className="mb-4 flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">ID type</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-yellow-500"
                  value={gIdType}
                  onChange={(e) => setGIdType(e.target.value)}
                >
                  {GUARANTOR_ID_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="ID number"
                value={gIdNumber}
                onChange={(e) => setGIdNumber(e.target.value)}
                required
              />
              <Button type="submit" disabled={guarantorMutation.isPending} fullWidth={false}>
                {guarantorMutation.isPending ? 'Adding…' : 'Add guarantor'}
              </Button>
            </form>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">Terrain vetting</h2>
          <p className="mt-1 text-xs text-slate-500">
            Passing needs 3+ years experience and a detailed terrain answer (20+ characters). Result
            is immediate after submit.
          </p>

          {status === 'Passed' ? (
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              This operator passed vetting and can be assigned to machines.
            </p>
          ) : canSubmitVetting ? (
            <form onSubmit={handleSubmitVetting} className="mt-4 space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Terrain knowledge answer
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-yellow-500"
                  rows={4}
                  value={terrainAnswer}
                  onChange={(e) => setTerrainAnswer(e.target.value)}
                  placeholder="Describe how you handle soft ground, slopes, and site hazards…"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Daily maintenance answer
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-yellow-500"
                  rows={3}
                  value={maintenanceAnswer}
                  onChange={(e) => setMaintenanceAnswer(e.target.value)}
                  placeholder="Outline daily pre-start checks and routine maintenance…"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Additional notes</label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-yellow-500"
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={vettingMutation.isPending} fullWidth={false}>
                {vettingMutation.isPending ? 'Submitting…' : 'Submit vetting'}
              </Button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              {guarantorCount < 2
                ? 'Add both guarantors to unlock vetting submission.'
                : 'Vetting is already in progress or completed.'}
            </p>
          )}
        </section>
      </div>
    </SupplierLayout>
  );
}
