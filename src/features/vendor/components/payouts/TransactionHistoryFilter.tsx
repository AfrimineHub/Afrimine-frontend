const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Credit', value: 'credit' },
  { label: 'Debit', value: 'debit' },
];

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const TransactionsHistoryFilter = ({
  value,
  onChange,
  from,
  to,
  onFromChange,
  onToChange,
  onReset,
  hasActiveFilters,
}: FilterProps) => {
  const invalidRange = Boolean(from && to && new Date(from) > new Date(to));

  return (
    <div className="space-y-3">
      <div className="bg-gray-100 rounded-full h-9 flex items-center text-sm overflow-hidden w-full">
        {FILTERS.map((filter) => {
          const isActive = value === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChange(filter.value)}
              className={`flex-1 flex items-center justify-center h-full transition-all duration-200 ${
                isActive ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          From
          <input
            type="datetime-local"
            value={from}
            max={to || undefined}
            onChange={(e) => onFromChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          To
          <input
            type="datetime-local"
            value={to}
            min={from || undefined}
            onChange={(e) => onToChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-800"
          />
        </label>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-[#CA8A04] hover:underline sm:pb-2"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {invalidRange ? (
        <p className="text-xs text-red-600" role="alert">
          "From" is later than "To", so no transactions can match.
        </p>
      ) : null}
    </div>
  );
};