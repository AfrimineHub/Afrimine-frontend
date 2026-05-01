export const InputField = ({
    label,
    value,
    placeholder,
  }: any) => {
    return (
      <div className="space-y-1">
        <label className="text-sm text-gray-600">{label}</label>
        <input
          defaultValue={value}
          placeholder={placeholder}
          className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>
    );
  };