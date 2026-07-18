import { useRef, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  label: string;
  hint?: string;
  accept?: string;
  fileName?: string;
  onFile: (file: File) => void;
}

export function FileDropzone({
  label,
  hint = 'PDF or image up to 10MB',
  accept = 'image/*,.pdf',
  fileName,
  onFile,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (file?: File | null) => {
    if (file) onFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    pick(e.target.files?.[0]);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    pick(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="mb-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-[#EAB308] hover:bg-amber-50/40"
      >
        <Upload className="text-slate-400" size={22} aria-hidden />
        <span className="text-sm font-semibold text-slate-700">
          {fileName ? fileName : 'Take / Upload file'}
        </span>
        <span className="text-xs text-slate-400">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
