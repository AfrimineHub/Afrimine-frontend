import { Link } from 'react-router-dom';
import { Plus, UserRound } from 'lucide-react';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { useOperatorsQuery } from '@/features/supplier/operators/operatorsQueries';
import {
  normalizeOperatorsList,
  VETTING_STATUS_LABELS,
  VETTING_STATUS_STYLES,
} from '@/features/supplier/operators/operatorsUtils';
import { SUPPLIER_OPERATORS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function SupplierOperatorsPage() {
  const operatorsQuery = useOperatorsQuery();
  const operators = normalizeOperatorsList(operatorsQuery.data);

  return (
    <SupplierLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operators</h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Add certified operators, complete guarantor and vetting steps, then assign them to
            machines.
          </p>
        </div>
        <Link
          to={`${SUPPLIER_OPERATORS_PATH}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
        >
          <Plus size={18} aria-hidden />
          Add operator
        </Link>
      </div>

      {operatorsQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading operators…</p>
      ) : operatorsQuery.isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {getApiErrorMessage(operatorsQuery.error, 'Could not load operators.')}
        </p>
      ) : operators.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <UserRound className="mx-auto text-slate-300" size={36} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-slate-700">No operators yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Add an operator, attach 2 guarantors, submit vetting, then assign to a machine.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {operators.map((op) => (
            <Link
              key={op.id}
              to={`${SUPPLIER_OPERATORS_PATH}/${op.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#EAB308]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{op.fullName}</p>
                  <p className="text-sm text-slate-500">
                    {op.phoneNumber} · License {op.licenseNumber}
                    {op.licenseCategory ? ` (${op.licenseCategory})` : ''}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {op.yearsOfExperience} yrs experience · {op.guarantors.length}/2 guarantors
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${VETTING_STATUS_STYLES[op.vettingStatus]}`}
                >
                  {VETTING_STATUS_LABELS[op.vettingStatus]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SupplierLayout>
  );
}
