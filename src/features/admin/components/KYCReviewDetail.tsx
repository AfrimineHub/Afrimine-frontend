import { 
  ArrowLeft, Bell, User, CheckCircle, XCircle, 
  Calendar, Mail, Phone, MapPin, FileText, 
  Globe, ShieldCheck, Download, ExternalLink 
} from 'lucide-react';

const KYCReviewDetail = () => {
  // Mock data based on the provided "KYC Review" design
  const userData = {
    fullName: "Sarah Johnson",
    dob: "March 15, 1995",
    email: "sarahjohnson@email.com",
    phone: "+234 903-123-4567",
    address: "45b Festac Town, Apapa, Lagos",
    documentType: "Passport",
    idNumber: "P123456789",
    country: "Nigeria",
    submittedDate: "April 07, 2026 at 14:30"
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">

      {/* --- Main Content --- */}
      <main className="p-8 max-w-4xl mx-auto">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest mb-4 transition-all"
            >
              <ArrowLeft size={14} /> Back to Queue
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">KYC Review</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
              Submitted on {userData.submittedDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all">
              <XCircle size={16} /> Reject
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]">
              <CheckCircle size={16} /> Approve
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* 1. Personal Information Section */}
          <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <User size={120} />
            </div>
            
            <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-8 pb-4 border-b border-slate-50 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-500" /> Personal Information
            </h3>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-slate-100 border-4 border-white shadow-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-blue-600 hover:text-blue-700 transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>

              {/* Info Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                {[
                  { label: "Full Name", value: userData.fullName, icon: User },
                  { label: "Date of Birth", value: userData.dob, icon: Calendar },
                  { label: "Email Address", value: userData.email, icon: Mail },
                  { label: "Phone Number", value: userData.phone, icon: Phone },
                  { label: "Residential Address", value: userData.address, icon: MapPin, fullWidth: true }
                ].map((item, idx) => (
                  <div key={idx} className={item.fullWidth ? "sm:col-span-2" : ""}>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <item.icon size={10} /> {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Document Information Section */}
          <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-2">
              <FileText size={18} className="text-amber-500" /> Document Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                { label: "Document Type", value: userData.documentType, icon: FileText },
                { label: "Document ID", value: userData.idNumber, icon: ShieldCheck },
                { label: "Issuing Country", value: userData.country, icon: Globe }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <item.icon size={14} className="text-slate-400" /> {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Document Preview Placeholder */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50/30 group hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-300 group-hover:text-blue-500 transition-all">
                <FileText size={32} />
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">Passport_Sarah_Johnson.jpg</p>
              <p className="text-xs font-medium text-slate-400 mb-6">High Quality Scan • 2.4 MB</p>
              <button className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                <Download size={14} /> Download Document
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default KYCReviewDetail;