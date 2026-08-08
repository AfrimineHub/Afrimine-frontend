import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Pencil, Pause, Ban, Trash2, RotateCcw } from 'lucide-react';

interface UserActionMenuProps {
  isActive: boolean;
  isBusy: boolean;
  onEdit: () => void;
  onSuspend: () => void;
  onBan: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

export const UserActionMenu = ({
  isActive,
  isBusy,
  onEdit,
  onSuspend,
  onBan,
  onReactivate,
  onDelete,
}: UserActionMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runAndClose = (action: () => void) => () => {
    setMenuOpen(false);
    action();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((previous) => !previous)}
        disabled={isBusy}
        aria-label="Open user actions"
        aria-expanded={menuOpen}
        className="cursor-pointer rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {isActive ? (
            <>
              <button
                type="button"
                onClick={runAndClose(onEdit)}
                disabled={isBusy}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <Pencil className="h-4 w-4 text-blue-600" />
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={runAndClose(onSuspend)}
                disabled={isBusy}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <Pause className="h-4 w-4 text-amber-600" />
                <span>Suspend</span>
              </button>
              <button
                type="button"
                onClick={runAndClose(onBan)}
                disabled={isBusy}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Ban className="h-4 w-4 text-red-600" />
                <span>Ban</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={runAndClose(onDelete)}
                disabled={isBusy}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={runAndClose(onReactivate)}
                disabled={isBusy}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4 text-emerald-600" />
                <span>Reactivate</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={runAndClose(onDelete)}
                disabled={isBusy}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};