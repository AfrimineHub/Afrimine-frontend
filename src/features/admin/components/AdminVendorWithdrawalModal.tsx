import { 
  X, CreditCard, Landmark, FileText, 
  Check, PauseCircle, Ban 
} from 'lucide-react';

/**
 * WithdrawalModal Component
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Closes the modal
 * @param {object} data - The vendor/withdrawal data object
 */
const WithdrawalModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Backdrop click handler to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Close Icon */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Vendor Identity Section */}
          <div className="flex items-center justify-between mb-10 pr-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border ${data.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {data.initials}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 leading-tight">{data.vendor}</h3>
                <p className="text-sm text-slate-400 font-medium">{data.email}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100">
              {data.status}
            </span>
          </div>

          <div className="space-y-8">
            {/* 1. Amount Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-slate-300" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Withdrawal Amount</span>
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">{data.amount}</p>
            </div>

            {/* 2. Bank Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark size={14} className="text-slate-300" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bank Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Name</p>
                  <p className="text-sm font-bold text-slate-700">{data.bank || 'Commerce Bank'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Account Number</p>
                  <p className="text-sm font-bold text-slate-700">****7832</p>
                </div>
              </div>
            </div>

            {/* 3. Request Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-slate-300" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Request Information</span>
              </div>
              <div className="space-y-4 px-1">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Request Date</span>
                  <span className="text-sm font-semibold text-slate-700">{data.date}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Invoice Number</span>
                  <span className="text-sm font-semibold text-slate-700">INV-2024-8735</span>
                </div>
                <div className="flex flex-col py-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Description</span>
                  <span className="text-sm text-slate-500 font-medium italic leading-relaxed">
                    Shipping services - March 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Administrative Action Footer */}
          <div className="mt-12 space-y-4">
            <button 
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              <Check size={18} strokeWidth={3} />
              Approve Withdrawal
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                <PauseCircle size={16} />
                Put on Hold
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                <Ban size={16} />
                Reject Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;