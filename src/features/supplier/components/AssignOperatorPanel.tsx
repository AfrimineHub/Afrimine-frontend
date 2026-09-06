import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/buttons/Button';
import {
  useAssignOperatorMutation,
  useOperatorsQuery,
} from '@/features/supplier/operators/operatorsQueries';
import {
  normalizeOperatorsList,
  VETTING_STATUS_LABELS,
} from '@/features/supplier/operators/operatorsUtils';
import { SUPPLIER_OPERATORS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

interface AssignOperatorPanelProps {
  assetId: string;
}

export function AssignOperatorPanel({ assetId }: AssignOperatorPanelProps) {
  const operatorsQuery = useOperatorsQuery();
  const assignMutation = useAssignOperatorMutation();
  const [operatorId, setOperatorId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const operators = normalizeOperatorsList(operatorsQuery.data);
  const vetted = operators.filter((o) => o.vettingStatus === 'Passed' || o.passedVetting);

  const handleAssign = async () => {
    setError(null);
    setSuccess(null);
    if (!operatorId) {
      setError('Select a vetted operator to assign.');
      return;
    }
    try {
      await assignMutation.mutateAsync({ assetId, operatorId });
      setSuccess('Operator assigned to this machine.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not assign operator.'));
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Assign operator
      </p>
      <p className="mb-3 text-xs text-slate-500">
        Only operators who passed vetting can be linked. A machine may have multiple operators.
      </p>

      {operatorsQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading operators…</p>
      ) : vetted.length === 0 ? (
        <p className="text-sm text-slate-600">
          No vetted operators yet.{' '}
          <Link to={SUPPLIER_OPERATORS_PATH} className="font-semibold text-[#CA8A04] hover:underline">
            Manage operators
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          <select
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-yellow-500"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
          >
            <option value="">Select operator…</option>
            {vetted.map((op) => (
              <option key={op.id} value={op.id}>
                {op.fullName} · {VETTING_STATUS_LABELS[op.vettingStatus]}
              </option>
            ))}
          </select>
          <Button
            type="button"
            fullWidth={false}
            onClick={handleAssign}
            disabled={assignMutation.isPending}
          >
            {assignMutation.isPending ? 'Assigning…' : 'Assign to machine'}
          </Button>
        </div>
      )}

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-3 text-sm text-emerald-700" role="status">
          {success}
        </p>
      ) : null}
    </div>
  );
}
