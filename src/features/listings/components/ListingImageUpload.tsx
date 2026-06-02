import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ListingImageUploadProps {
  files: File[];
  previews: string[];
  onChange: (files: File[], previews: string[]) => void;
  error?: string;
  maxFiles?: number;
}

export const ListingImageUpload: React.FC<ListingImageUploadProps> = ({
  files,
  previews,
  onChange,
  error,
  maxFiles = 6,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selected: FileList | null) => {
    if (!selected?.length) return;

    const nextFiles = [...files];
    const nextPreviews = [...previews];

    Array.from(selected).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (nextFiles.length >= maxFiles) return;
      nextFiles.push(file);
      nextPreviews.push(URL.createObjectURL(file));
    });

    onChange(nextFiles, nextPreviews);
  };

  const removeAt = (index: number) => {
    const preview = previews[index];
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    onChange(
      files.filter((_, i) => i !== index),
      previews.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-gray-700 block mb-2">
        Photos <span className="font-normal text-gray-400">(up to {maxFiles})</span>
      </label>

      <div className="flex flex-wrap gap-3 mb-3">
        {previews.map((src, index) => (
          <div key={src} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {files.length < maxFiles ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-500 hover:text-yellow-600 transition-colors"
          >
            <ImagePlus size={22} />
            <span className="text-[10px] mt-1">Add</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <p className="text-xs text-gray-400">JPG or PNG. First image is used as the cover photo.</p>
      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
};
