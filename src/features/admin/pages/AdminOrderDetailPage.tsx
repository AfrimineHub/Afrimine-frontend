import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Circle, FileText } from 'lucide-react';
import { useAdminOrderQuery } from '@/features/admin/queries';
import {
  avatarColorClass,
  formatAdminAmount,
  formatAdminDate,
  formatAdminDateTime,
  formatFileSize,
  getInitials,
  titleCaseStatus,
} from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const AdminOrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const orderQuery = useAdminOrderQuery(orderId);

  const order = orderQuery.data;
  const loadError =
    orderQuery.isError && getApiErrorMessage(orderQuery.error, 'Could not load order details.');

  const buyerName = order?.buyerName ?? 'Buyer';
  const vendorName = order?.vendorName ?? 'Vendor';
  const statusLabel = titleCaseStatus(order?.status);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      <main className="max-w-[1200px] mx-auto py-8 px-6">
        <Link
          to="/admin/order-tracker"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        {orderQuery.isLoading ? (
          <div className="h-96 bg-white rounded-xl border border-slate-200 animate-pulse" />
        ) : order ? (
          <>
            <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{order.id}</h1>
                <p className="text-slate-500 font-medium">{order.listingTitle ?? order.description ?? '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-slate-800">
                    {formatAdminAmount(order.amount, order.currency)}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold border border-emerald-100 uppercase tracking-wide">
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Buyer</p>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border ${avatarColorClass(buyerName)}`}
                  >
                    {getInitials(buyerName)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{buyerName}</h4>
                    <p className="text-sm text-slate-400">{order.buyerEmail ?? '—'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vendor</p>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border ${avatarColorClass(vendorName)}`}
                  >
                    {getInitials(vendorName)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{vendorName}</h4>
                    <p className="text-sm text-slate-400">{order.vendorEmail ?? '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Order Timeline</h3>
                <div className="relative">
                  {(order.timeline ?? []).length === 0 ? (
                    <p className="text-sm text-slate-500">No timeline events yet.</p>
                  ) : (
                    order.timeline.map((item, index) => (
                      <div key={`${item.step}-${index}`} className="flex gap-4 mb-8 last:mb-0 relative">
                        {index !== order.timeline.length - 1 ? (
                          <div className="absolute left-3 top-6 w-[2px] h-[calc(100%-12px)] bg-slate-100" />
                        ) : null}
                        <div className="mt-1 z-10">
                          {item.status === 'completed' ? (
                            <CheckCircle2 size={24} className="text-emerald-500 bg-white" />
                          ) : item.status === 'current' ? (
                            <Clock size={24} className="text-blue-500 bg-white" />
                          ) : (
                            <Circle size={24} className="text-slate-200 bg-white" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-bold text-sm ${
                              item.status === 'completed' ? 'text-slate-800' : 'text-slate-400'
                            }`}
                          >
                            {item.step}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{formatAdminDateTime(item.occurredAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-10">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-blue-500" size={20} />
                    <h4 className="font-bold text-slate-800 text-sm">Shared Documents</h4>
                  </div>
                  {(order.documents ?? []).length === 0 ? (
                    <p className="text-sm text-slate-500">No documents attached.</p>
                  ) : (
                    order.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100 shadow-sm mb-3 last:mb-0"
                      >
                        <div>
                          <p className="text-sm font-bold text-blue-600">{doc.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatFileSize(doc.sizeBytes)} • Uploaded by {doc.uploadedBy ?? '—'} •{' '}
                            {formatAdminDateTime(doc.uploadedAt)}
                          </p>
                        </div>
                        {doc.downloadUrl ? (
                          <a
                            href={doc.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
                          >
                            Download
                          </a>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Order Information</h3>
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">Created</span>
                      <span className="font-medium text-slate-700">{formatAdminDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">Documents</span>
                      <span className="font-medium text-slate-700">{order.documents?.length ?? 0} file(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default AdminOrderDetailsPage;
