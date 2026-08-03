import { Link } from 'react-router-dom';

interface SubscriptionRequiredNoticeProps {
  title?: string;
  description: string;
  ctaLabel?: string;
}

export function SubscriptionRequiredNotice({
  title = 'Subscription required',
  description,
  ctaLabel = 'View subscription plans',
}: SubscriptionRequiredNoticeProps) {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-slate-700">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <p className="mt-2">{description}</p>
      <Link
        to="/dashboard/my-subscription"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
