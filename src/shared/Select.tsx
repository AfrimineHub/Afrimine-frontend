import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectValue = string | number;

export interface Option<T extends SelectValue> {
  label: string;
  value: T;
}

interface SelectProps<T extends SelectValue> {
  label: string;
  options: Option<T>[];
  placeholder?: string;
  value?: T;
  onChange: (value: T) => void;
}

export const Select = <T extends SelectValue>({
  label, options, placeholder, value, onChange 
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option<T> | null>(
    value != null ? options.find((option) => option.value === value) ?? null : null,
  );

  useEffect(() => {
    if (value == null) {
      setSelected(null);
      return;
    }
    setSelected(options.find((option) => option.value === value) ?? null);
  }, [value, options]);

  const handleSelect = (option: Option<T>) => {
    setSelected(option);
    setIsOpen(false);
    onChange(option.value);
  };

  return (
    <div className="flex flex-col gap-1 w-full mb-4 relative">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-left focus:ring-2 focus:ring-yellow-500 outline-none"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400 text-sm"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-sm text-left hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};