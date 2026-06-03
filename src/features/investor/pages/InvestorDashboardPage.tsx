import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Bookmark } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

const InvestorDashboardPage = () => {
  const { user } = useAuth();
  const displayName = user?.fullName ?? user?.companyName ?? 'Investor';

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {displayName}</h1>
        <p className="text-sm text-gray-500 mt-2">
          Track mining opportunities, saved projects, and investment insights.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Briefcase className="text-yellow-600 mb-3" size={22} aria-hidden />
            <p className="text-sm text-gray-500">Active opportunities</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">—</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Bookmark className="text-yellow-600 mb-3" size={22} aria-hidden />
            <p className="text-sm text-gray-500">Saved projects</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">—</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <TrendingUp className="text-yellow-600 mb-3" size={22} aria-hidden />
            <p className="text-sm text-gray-500">Portfolio value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">—</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Marketplace', path: '/marketplace' },
            { label: 'Messages', path: '/messages' },
            { label: 'Notifications', path: '/notification' },
            { label: 'Market trends', path: '/marketplace' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-yellow-500 hover:text-yellow-700 text-center"
            >
              {action.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-slate-700 font-medium mb-2">Investor dashboard coming soon</p>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Browse the marketplace while we finish portfolio tracking and deal alerts for investors.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-yellow-600 rounded-xl hover:bg-yellow-700"
          >
            Browse marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardPage;
