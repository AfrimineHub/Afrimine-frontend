import { Link } from 'react-router-dom';

interface PriorityAlertProps {
  type: string;
  title: string;
  description: string;
  time: string;
  actionText?: string | null;
  actionUrl?: string | null;
}

export const PriorityAlert = ({
  type,
  title,
  description,
  time,
  actionText,
  actionUrl,
}: PriorityAlertProps) => {
  const isDanger = type === 'danger';
  const borderColor = isDanger ? 'border-l-red-500' : 'border-l-yellow-500';
  const iconColor = isDanger ? 'text-red-500' : 'text-yellow-500';
  const btnColor = isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600';

  return (
    <div
      className={`bg-white p-4 rounded-r-xl border border-gray-200 border-l-4 ${borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColor}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 self-start sm:self-center">
        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
        {actionText ? (
          actionUrl ? (
            actionUrl.startsWith('/') ? (
              <Link
                to={actionUrl}
                className={`${btnColor} text-white text-xs font-bold py-1.5 px-4 rounded transition-colors whitespace-nowrap`}
              >
                {actionText}
              </Link>
            ) : (
              <a
                href={actionUrl}
                className={`${btnColor} text-white text-xs font-bold py-1.5 px-4 rounded transition-colors whitespace-nowrap`}
              >
                {actionText}
              </a>
            )
          ) : (
            <button
              type="button"
              className={`${btnColor} text-white text-xs font-bold py-1.5 px-4 rounded transition-colors whitespace-nowrap cursor-pointer`}
            >
              {actionText}
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};
