import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = ({ label, error, ...props }: TextareaProps) => {
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        className={`w-full min-h-[120px] p-3 bg-gray-50 border rounded-xl outline-none transition-all resize-y
          ${error ? 'border-red-500' : 'border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
