import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

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
  /** Show a search field and filter options by label as the user types. */
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const Select = <T extends SelectValue>({
  label,
  options,
  placeholder,
  value,
  onChange,
  searchable = false,
  searchPlaceholder = 'Search…',
}: SelectProps<T>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Option<T> | null>(
    value != null ? (options.find((option) => option.value === value) ?? null) : null,
  );

  useEffect(() => {
    if (value == null) {
      setSelected(null);
      return;
    }
    setSelected(options.find((option) => option.value === value) ?? null);
  }, [value, options]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    if (searchable) {
      // Focus search when the menu opens so typing filters immediately.
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!searchable || !q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const handleSelect = (option: Option<T>) => {
    setSelected(option);
    setIsOpen(false);
    setQuery('');
    onChange(option.value);
  };

  return (
    <div ref={rootRef} className="relative mb-4 flex w-full flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 text-left outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <span className={selected ? 'text-gray-900' : 'text-sm text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[100%] z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
          {searchable ? (
            <div className="sticky top-0 border-b border-gray-100 bg-white px-3 pb-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Search size={16} className="shrink-0 text-gray-400" aria-hidden />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  aria-label={`Search ${label.toLowerCase()}`}
                />
              </div>
            </div>
          ) : null}

          <div className="max-h-60 overflow-auto py-1" role="listbox">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">
                {query.trim()
                  ? `No results matching “${query.trim()}”`
                  : 'No options available'}
              </p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={selected?.value === option.value}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-yellow-50 hover:text-yellow-700 ${
                    selected?.value === option.value ? 'bg-yellow-50 font-semibold text-yellow-800' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
