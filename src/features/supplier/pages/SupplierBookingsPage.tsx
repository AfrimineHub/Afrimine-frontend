import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';

export default function SupplierBookingsPage() {
  return (
    <SupplierLayout>
      <h1 className="text-2xl font-bold text-slate-900">Booking requests</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xl">
        Approve or decline rental requests from miners. Full booking detail, operator vetting, and
        contract actions will connect once the booking API is available.
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-semibold text-slate-700">No booking requests yet</p>
        <p className="mt-1 text-xs text-slate-500">
          New requests will show here with miner details, lease period, and approve / decline actions.
        </p>
      </div>
    </SupplierLayout>
  );
}
