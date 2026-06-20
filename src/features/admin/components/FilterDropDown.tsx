interface FilterDropdownProps {
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export const FilterDropdown = ({ placeholder, value, options, onChange }: FilterDropdownProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="appearance-none bg-[#F4F5F7] border border-gray-200 text-gray-600 text-sm font-medium py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 w-40 cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value || 'all'} value={option.value}>
          {option.value ? option.label : placeholder}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
);
