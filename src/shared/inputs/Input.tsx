import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input 
        className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all
          ${error ? 'border-red-500' : 'border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};