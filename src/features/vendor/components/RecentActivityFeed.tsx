import React from 'react';
import { FileText, MessageSquare, ShieldCheck, CheckCircle, CreditCard } from 'lucide-react';

const activities = [
  { id: 1, title: 'New quote request for Gold Ore', time: '5 minutes ago', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 2, title: 'Message from BuyerCorp Ltd', time: '1 hour ago', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, title: 'Order #12345 moved to escrow', time: '3 hours ago', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 4, title: 'Quote accepted for Copper Concentrate', time: '5 hours ago', icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 5, title: 'Payment received for Order #12340', time: '1 day ago', icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' },
];

export const RecentActivityFeed: React.FC = () => {
  return (
    <div className="col-span-1 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm min-w-0">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="flex gap-3 sm:gap-4 min-w-0">
            <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${act.bg} ${act.color}`}>
              <act.icon size={16} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 break-words">{act.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};