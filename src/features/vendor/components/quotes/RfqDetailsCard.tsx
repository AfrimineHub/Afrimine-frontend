import React from 'react';
import { Download, MessageSquare } from 'lucide-react';

export const RfqDetailsCard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* RFQ Details Block */}
      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-slate-900 mb-1">RFQ Details</h3>
        <p className="text-xs text-gray-500 mb-6">Request from Global Mining Corp</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Quantity</p>
            <p className="text-sm font-bold text-slate-900">50 kg</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Delivery Terms</p>
            <p className="text-sm font-bold text-slate-900">Ikeja, Lagos</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Inspection Required</p>
            <p className="text-sm font-bold text-slate-900">SGS Inspection</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Expiry Date</p>
            <p className="text-sm font-bold text-slate-900">April 15, 2026</p>
          </div>
        </div>
      </div>

      {/* Attachments Block */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">Attachments</h3>
        <p className="text-xs text-gray-500 mb-4">Documents from buyer</p>
        <div className="space-y-3">
          {['Purchase_Order.pdf', 'Company_Profile.pdf'].map((doc, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded text-gray-400"><FileText size={16} /></div>
                <span className="text-sm text-gray-600">{doc}</span>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-slate-900 transition-colors">
                <Download size={14} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Context Block */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">Message / Context</h3>
        <p className="text-xs text-gray-500 mb-4">Communication with buyer</p>
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
          <p className="text-xs font-bold text-slate-700 mb-1">Global Mining Corp</p>
          <p className="text-sm text-slate-600">We need this urgently for our refinery operation.</p>
        </div>
        <div className="mt-3 flex justify-center border-b border-gray-100 pb-8">
           <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-slate-900 transition-colors">
             <MessageSquare size={14} /> Open Full Chat
           </button>
        </div>
      </div>
    </div>
  );
};

// Simple icon for the attachment list
const FileText = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
)