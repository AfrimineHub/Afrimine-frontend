import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  ShieldCheck,
  Download,
  ExternalLink,
  User,
} from 'lucide-react';
import {
  useAdminKycDetailQuery,
  useApproveAdminKycMutation,
  useRejectAdminKycMutation,
} from '@/features/admin/queries';
import { formatAdminDateTime, formatFileSize } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const KYCReviewDetail = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);

  const detailQuery = useAdminKycDetailQuery(submissionId);
  const approveMutation = useApproveAdminKycMutation();
  const rejectMutation = useRejectAdminKycMutation();

  const userData = detailQuery.data;
  const loadError =
    detailQuery.isError && getApiErrorMessage(detailQuery.error, 'Could not load KYC submission.');

  const handleApprove = async () => {
    if (!submissionId) return;
    setActionError(null);
    try {
      await approveMutation.mutateAsync(submissionId);
      navigate('/admin/kyc/verification-queue');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not approve KYC.'));
    }
  };

  const handleReject = async () => {
    if (!submissionId) return;
    const reason = window.prompt('Rejection reason (optional):') ?? undefined;
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({
        submissionId,
        reason: reason?.trim() || undefined,
      });
      navigate('/admin/kyc/verification-queue');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not reject KYC.'));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      <main className="p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link
              to="/admin/kyc/verification-queue"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest mb-4 transition-all"
            >
              <ArrowLeft size={14} /> Back to Queue
            </Link>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">KYC Review</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
              Submitted on {formatAdminDateTime(userData?.submittedAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReject}
              disabled={rejectMutation.isPending || detailQuery.isLoading}
              className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-60"
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={approveMutation.isPending || detailQuery.isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <CheckCircle size={16} /> Approve
            </button>
          </div>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        {actionError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {actionError}
          </p>
        ) : null}

        {detailQuery.isLoading ? (
          <div className="h-96 bg-white rounded-2xl border border-slate-100 animate-pulse" />
        ) : userData ? (
          <div className="grid grid-cols-1 gap-8">
            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <User size={120} />
              </div>

              <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-8 pb-4 border-b border-slate-50 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" /> Personal Information
              </h3>

              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl bg-slate-100 border-4 border-white shadow-md overflow-hidden">
                    {userData.profilePhotoUrl ? (
                      <img
                        src={userData.profilePhotoUrl}
                        alt={userData.fullName ?? 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  {userData.profilePhotoUrl ? (
                    <a
                      href={userData.profilePhotoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                  {[
                    { label: 'Full Name', value: userData.fullName ?? '—', icon: User },
                    { label: 'Date of Birth', value: userData.dateOfBirth ?? '—', icon: Calendar },
                    { label: 'Email Address', value: userData.email ?? '—', icon: Mail },
                    { label: 'Phone Number', value: userData.phone ?? '—', icon: Phone },
                    {
                      label: 'Residential Address',
                      value: userData.address ?? '—',
                      icon: MapPin,
                      fullWidth: true,
                    },
                  ].map((item) => (
                    <div key={item.label} className={item.fullWidth ? 'sm:col-span-2' : ''}>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <item.icon size={10} /> {item.label}
                      </p>
                      <p className="text-sm font-bold text-slate-700">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-2">
                <FileText size={18} className="text-amber-500" /> Document Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {[
                  { label: 'Document Type', value: userData.documentType ?? '—', icon: FileText },
                  { label: 'Document ID', value: userData.documentIdNumber ?? '—', icon: ShieldCheck },
                  { label: 'Issuing Country', value: userData.country ?? '—', icon: Globe },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <item.icon size={14} className="text-slate-400" /> {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50/30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-300">
                  <FileText size={32} />
                </div>
                <p className="text-sm font-bold text-slate-600 mb-1">
                  {userData.documentFileName ?? 'Submitted document'}
                </p>
                <p className="text-xs font-medium text-slate-400 mb-6">
                  {formatFileSize(userData.documentFileSizeBytes)}
                </p>
                {userData.documentDownloadUrl ? (
                  <a
                    href={userData.documentDownloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    <Download size={14} /> Download Document
                  </a>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default KYCReviewDetail;
