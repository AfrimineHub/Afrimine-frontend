// features/supplier/pages/SupplierAccountRestrictedPage.tsx

import { Link } from 'react-router-dom';
import { Ban, Lock, PauseCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSupplierStatusQuery } from '../onboarding/onboardingQueries';
import { getAccountStatus } from '../onboarding/onboardingNormalize';
import { ACCOUNT_STATUS } from '@/features/supplier/constants';

const SUPPORT_EMAIL = 'support@afrimine.com'; // confirm the real inbox before shipping

const STATUS_CONTENT: Record<number, { icon: typeof Ban; title: string; body: string; tone: string }
> = {
  [ACCOUNT_STATUS.Suspended]: {
    icon: PauseCircle,
    title: 'Your account is suspended',
    body: 'Your supplier account has been temporarily suspended. This is usually tied to a compliance or policy review. Contact support to find out what\u2019s needed to lift it.',
    tone: 'text-amber-600 bg-amber-50',
  },
  [ACCOUNT_STATUS.Banned]: {
    icon: Ban,
    title: 'Your account has been banned',
    body: 'Your supplier account has been permanently banned from Afrimine. If you believe this is a mistake, contact support with your account details.',
    tone: 'text-red-600 bg-red-50',
  },
  [ACCOUNT_STATUS.Deactivated]: {
    icon: Lock,
    title: 'Your account is deactivated',
    body: 'Your supplier account is currently deactivated. Contact support if you\u2019d like to reactivate it.',
    tone: 'text-slate-600 bg-slate-100',
  },
};

const FALLBACK_CONTENT = {
  icon: Lock,
  title: 'Account access restricted',
  body: 'Your supplier account currently doesn\u2019t have dashboard access. Contact support for details.',
  tone: 'text-slate-600 bg-slate-100',
};

export default function SupplierAccountRestrictedPage() {
  const { logout } = useAuth();
  const statusQuery = useSupplierStatusQuery();
  const status = getAccountStatus(statusQuery.data);
  const content = (status != null && STATUS_CONTENT[status]) || FALLBACK_CONTENT;
  const Icon = content.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${content.tone}`}>
          <Icon size={28} aria-hidden />
        </div>

        <h1 className="text-xl font-bold text-slate-900">{content.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{content.body}</p>

        <div className="mt-8 flex flex-col gap-3">
          
          <a href={`mailto:${SUPPORT_EMAIL}`}
            className="w-full rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
          >
            Contact Support
          </a>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <LogOut size={16} aria-hidden />
            Log out
          </button>
        </div>

        <Link to="/home" className="mt-6 inline-block text-xs font-semibold text-slate-400 hover:text-slate-600">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}