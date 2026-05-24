import { 
  Search,  
  Filter, AlertCircle,
  FileBadge, Globe, Mail, Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KYCVerificationQueue = () => {
  const navigate = useNavigate();

  // Mock data based on the provided screen design
  const pendingUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+234 803 123 4567", docType: "Passport", country: "Nigeria", submitted: "25 Apr 2026, 10:30", avatar: "SJ" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+234 803 123 4567", docType: "Passport", country: "Nigeria", submitted: "25 Apr 2026, 09:15", avatar: "SJ" },
    { id: 3, name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+234 803 123 4567", docType: "Passport", country: "Nigeria", submitted: "24 Apr 2026, 16:45", avatar: "SJ" },
    { id: 4, name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+234 803 123 4567", docType: "Public ID", country: "Nigeria", submitted: "24 Apr 2026, 14:20", avatar: "SJ" },
    { id: 5, name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+234 803 123 4567", docType: "Passport", country: "Nigeria", submitted: "24 Apr 2026, 11:05", avatar: "SJ" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">

      {/* --- Main Content --- */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">KYC Verification Queue</h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" /> 
              5 pending verifications
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-64 shadow-sm"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* --- Verification Table --- */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {user.avatar}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} className="text-slate-300" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={12} className="text-slate-300" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <FileBadge size={16} className="text-amber-500" />
                      <span className="text-sm font-medium text-slate-600">{user.docType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Globe size={16} className="text-slate-300" /> {user.country}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{user.submitted}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/10 transition-all active:scale-95 cursor-pointer"
                      onClick={() => navigate('/admin/kyc/review')}
                      >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Pagination/Empty State Info */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase">Showing 5 of 5 entries</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-200 rounded text-xs font-bold text-slate-400 bg-white" disabled>Prev</button>
              <button className="px-3 py-1 border border-slate-200 rounded text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KYCVerificationQueue;