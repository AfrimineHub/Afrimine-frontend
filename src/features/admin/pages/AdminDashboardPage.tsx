import { 
  statCardsData, 
  priorityAlerts, 
  liveActivityFeed, 
  ongoingTransactions 
} from '../data/adminData';
import { StatCard } from '../components/AdminStatsCard';
import { PriorityAlert } from '../components/PriorityAlertComponent';
import { ActivityItem } from '../components/AdminActivityItem';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboardPage = () => {

  return (
    <div className="flex w-full h-full bg-[#F4F5F7] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statCardsData.map((stat) => (
                <StatCard key={stat.id} {...stat} />
              ))}
            </div>

            {/* Priority Alerts */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Priority Alerts</h2>
              <div className="space-y-3">
                {priorityAlerts.map(alert => (
                  <PriorityAlert key={alert.id} {...alert} />
                ))}
              </div>
            </section>

            {/* Bottom Split Section: Feed & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Live Activity Feed */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Live Activity Feed</h2>
                  <button className="text-xs font-bold text-[#B89047] hover:text-[#9A7639] cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {liveActivityFeed.map(activity => (
                    <ActivityItem key={activity.id} {...activity} />
                  ))}
                </div>
              </section>

              {/* Ongoing Transactions Table */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Ongoing Transactions</h2>
                  <button className="text-xs font-bold text-[#B89047] hover:text-[#9A7639] cursor-pointer">
                    View All Orders
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Buyer</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Vendor</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ongoingTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="py-3 text-sm font-medium text-gray-900">{tx.id}</td>
                          <td className="py-3 text-sm text-gray-600">{tx.buyer}</td>
                          <td className="py-3 text-sm text-gray-600">{tx.vendor}</td>
                          <td className="py-3 text-sm font-bold text-gray-900">{tx.amount}</td>
                          <td className="py-3 text-xs font-medium">
                            <span className={tx.status === 'In Dispute' ? 'text-red-500' : 'text-yellow-600'}>
                              {tx.status}
                            </span>
                          </td>
                          <td 
                            className="py-3 text-xs font-bold text-blue-500 cursor-pointer hover:text-blue-700 cursor-pointer"
                          >
                            View Details
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;