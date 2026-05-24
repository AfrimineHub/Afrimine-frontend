import { Upload } from "lucide-react";

export const UploadZone = () => {
  return (
    <div className="border-2 border-dashed rounded-xl p-6 text-center text-gray-500 cursor-pointer">
      <Upload className="mx-auto mb-2" />
      <p className="text-sm">Drag & drop your file here</p>
      <p className="text-xs">or click to browse</p>
    </div>
  );
};