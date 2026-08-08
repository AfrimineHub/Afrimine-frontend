const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Credit', value: 'credit' },
  { label: 'Debit', value: 'debit' },
];

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const TransactionsHistoryFilter = ({ value, onChange }: FilterProps) => {
  return (
    <div className="bg-gray-100 rounded-full h-9 flex items-center text-sm overflow-hidden w-full">
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;
        return (
          <button
            key={filter.value}
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
  );
};