import React from 'react';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Quote {
  id: string;
  details: string;
  date: string;
  deadline: string;
  count: number;
  status: 'Active' | 'Completed' | 'Draft';
}

interface QuotesTableProps {
  quotes: Quote[];
}

export const QuotesTable: React.FC<QuotesTableProps> = ({ quotes }) => {
  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'Active': return 'bg-orange-100 text-orange-600';
      case 'Completed': return 'bg-emerald-100 text-emerald-600';
      case 'Draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
          <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 font-medium">
            <tr>
              <th className="py-4 px-6">Quote ID</th>
              <th className="py-4 px-6">Quote Details</th>
              <th className="py-4 px-6">Date Requested</th>
              <th className="py-4 px-6">Deadline</th>
              <th className="py-4 px-6 text-center">Quotes</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{quote.id}</td>
                <td className="py-4 px-6 text-gray-600 truncate max-w-xs">{quote.details}</td>
                <td className="py-4 px-6 text-gray-600">{quote.date}</td>
                <td className="py-4 px-6 text-gray-600">{quote.deadline}</td>
                <td className="py-4 px-6 text-center font-medium text-slate-900">{quote.count}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <Link to={`/dashboard/my-quotes/${quote.id}`} className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                      <Eye size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};