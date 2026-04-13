import React from 'react';

const performanceData = [
  { id: 1, name: 'Gold Ore - High Grade', views: '1,243', saves: '87', inq: '23' },
  { id: 2, name: 'Copper Concentrate', views: '1,956', saves: '64', inq: '18' },
  { id: 3, name: 'Diamond Rough - Premium', views: '2,156', saves: '85', inq: '45' },
  { id: 4, name: 'Lithium Carbonate', views: '1,834', saves: '98', inq: '31' },
];

export const ListingPerformanceTable: React.FC = () => {
  return (
    <div className="col-span-1 lg:col-span-2 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden min-w-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">Listing Performance</h3>
        <button className="text-xs font-medium text-yellow-600 hover:text-yellow-700">View All →</button>
      </div>
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-6 px-6">
        <table className="w-full text-sm text-left min-w-[500px]">
          <thead className="text-gray-500 border-b border-gray-100">
            <tr>
              <th className="pb-3 font-medium">Listing Name</th>
              <th className="pb-3 font-medium text-center">Views</th>
              <th className="pb-3 font-medium text-center">Saves</th>
              <th className="pb-3 font-medium text-center">Inquiries</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {performanceData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-medium text-slate-900">{item.name}</td>
                <td className="py-4 text-center text-gray-600">👁️ {item.views}</td>
                <td className="py-4 text-center text-gray-600">♡ {item.saves}</td>
                <td className="py-4 text-center text-gray-600">✉️ {item.inq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};