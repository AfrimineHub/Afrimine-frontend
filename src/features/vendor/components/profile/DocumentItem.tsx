import { File } from "lucide-react";
import { StatusTag } from "./StatusTag";

interface Props {
  title: string;
  status: "pending" | "approved" | "rejected";
  fileName?: string;
  error?: string;
}

export const DocumentItem = ({
  title,
  status,
  fileName,
  error,
}: Props) => {
  return (
    <div className="space-y-2">
      {/* Top row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <StatusTag status={status} />
          <p className="text-sm font-medium">{title}</p>
        </div>

        <button className="text-sm border px-3 py-1 rounded-lg">
          Replace
        </button>
      </div>

      {/* File */}
      {fileName && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          <File size={14} />
          {fileName}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};