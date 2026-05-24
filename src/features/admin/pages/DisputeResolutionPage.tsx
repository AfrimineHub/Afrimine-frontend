import { 
  FileText, ShieldAlert, Clock, CheckCircle2, 
  Lock, Unlock, Gavel, Upload, User, 
  ArrowLeft, Download, ExternalLink, ChevronRight
} from 'lucide-react';

const DisputeResolutionPage = () => {
  // Mock Data from the provided screens
  const transaction = {
    id: "#ESC-2026-0421",
    listing: "Gold - Osun",
    quantity: "50kg",
    price: "₦50,000,000",
    status: "Escrow Funded",
    deliveryDate: "Apr 15, 2026"
  };

  const documents = [
    { name: "NDA.pdf", author: "Admin", date: "Apr 5, 2026", type: "Legal" },
    { name: "Lab_Report.pdf", author: "Vendor", date: "Apr 7, 2026", type: "Technical" },
    { name: "Inspection_Certificate.pdf", author: "Third Party", date: "Apr 8, 2026", type: "Verification" }
  ];

  const timeline = [
    { title: "Dispute Opened", time: "Apr 5, 2026 • 9:00 AM", status: "completed" },
    { title: "Evidence Submitted", time: "Apr 6, 2026 • 11:30 AM", status: "completed" },
    { title: "Awaiting Admin Review", time: "Current Status", status: "active" }
  ];

  const participants = [
    { name: "John Doe", role: "Buyer", initials: "JD" },
    { name: "Cold Merchant Ltd", role: "Vendor", initials: "CM" },
    { name: "Afrimine Admin", role: "Moderator", initials: "AA" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest mb-6 transition-all">
            <ArrowLeft size={16} /> Back to Disputes
          </button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Dispute Resolution</h1>
          <p className="text-slate-400 font-medium">Manage and review the dispute for transaction <span className="text-slate-600 font-bold">{transaction.id}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Summary and Documents */}
          <div className="md:col-span-2 space-y-8">
            
            {/* 1. Transaction Summary Card */}
            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="font-black text-slate-800 uppercase tracking-tighter">Transaction Summary</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-y-8">
                {[
                  { label: "Listing", value: transaction.listing },
                  { label: "Quantity", value: transaction.quantity },
                  { label: "Price", value: transaction.price, highlight: true },
                  { label: "Status", value: transaction.status, badge: true },
                  { label: "Escrow ID", value: transaction.id },
                  { label: "Expected Delivery", value: transaction.deliveryDate }
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                    {item.badge ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase">
                        {item.value}
                      </span>
                    ) : (
                      <p className={`text-sm font-bold ${item.highlight ? 'text-blue-600' : 'text-slate-700'}`}>{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Documents Vault */}
            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tighter">Documentation</h3>
                </div>
                <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                  <Upload size={14} /> Upload Document
                </button>
              </div>

              <div className="space-y-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{doc.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                          {doc.author} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600"><Download size={18} /></button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Timeline and Actions */}
          <div className="space-y-8">
            
            {/* 3. Dispute Timeline */}
            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Dispute Timeline
              </h3>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      {step.status === 'completed' ? <CheckCircle2 size={12} className="text-white" /> : <Clock size={12} className="text-white" />}
                    </div>
                    <p className="text-sm font-black text-slate-800 leading-tight">{step.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{step.time}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Admin Actions */}
            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Admin Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all font-bold text-xs text-left">
                  <Lock size={16} /> Freeze Funds
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all font-bold text-xs text-left">
                  <Unlock size={16} /> Release Funds
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-all font-bold text-xs text-left">
                  <ExternalLink size={16} /> Open Dispute
                </button>
                <button className="w-full mt-4 py-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <Gavel size={16} /> Request Arbitration
                </button>
              </div>
            </section>

            {/* 5. Participants */}
            <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Participants</h3>
              <div className="space-y-6">
                {participants.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                      {person.initials}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{person.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DisputeResolutionPage;