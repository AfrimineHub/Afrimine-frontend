export const RfqFilter = ({ icon, placeholder, value, onChange }) => (
    <div className="relative flex-1">
      {icon && (
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-2.5 bg-[#F4F5F7] border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CBA052] focus:border-transparent transition-all ${
          icon ? 'pl-10' : 'pl-4'
        } pr-4`}
      />
    </div>
  );