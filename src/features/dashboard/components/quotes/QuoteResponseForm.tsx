import React from 'react';
import { Upload } from 'lucide-react';

export const QuoteResponseForm: React.FC = () => {
  return (
    <div className="bg-[#FCFCFD] border border-gray-200 rounded-xl p-6 shadow-sm mt-8">
      <h3 className="text-base font-bold text-slate-900 mb-1">Quote Response Form</h3>
      <p className="text-xs text-gray-500 mb-6">Provide your quote details to the buyer</p>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Price (NGN) *</label>
            <input 
              type="text" 
              placeholder="e.g. ₦300,000 per kg"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Lead Time *</label>
            <input 
              type="text" 
              placeholder="e.g. 7 days"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Delivery Terms *</label>
            <input 
              type="text" 
              placeholder="e.g. Ikeja, Lagos"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Inspection Method *</label>
            <input 
              type="text" 
              placeholder="e.g. SGS Inspection"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-2">Notes / Terms & Conditions</label>
          <textarea 
            rows={3}
            placeholder="Add any additional terms, conditions, or notes..."
            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-2">Attachments</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 transition-colors cursor-pointer">
            <Upload size={24} className="text-gray-400 mb-3" />
            <p className="text-sm font-medium text-slate-600 mb-1">Upload lab reports, certificates, or other documents</p>
            <p className="text-xs text-gray-400">Click to upload</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button type="button" className="w-full sm:w-auto flex-1 px-8 py-3.5 bg-[#DE9D2B] hover:bg-[#c98e26] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
            Send Quote
          </button>
          <button type="button" className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-gray-500 hover:text-slate-900 transition-colors">
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};