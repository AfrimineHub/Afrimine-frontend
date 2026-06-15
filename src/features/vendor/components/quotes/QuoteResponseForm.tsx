import { useState, type FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { useSubmitVendorQuoteMutation } from '@/features/escrow/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

interface QuoteResponseFormProps {
  rfqId?: string;
  listingId?: string;
}

export const QuoteResponseForm: React.FC<QuoteResponseFormProps> = ({ rfqId, listingId }) => {
  const [price, setPrice] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [inspectionMethod, setInspectionMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitQuoteMutation = useSubmitVendorQuoteMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const amount = Number(price.replace(/[₦$,]/g, ''));
    if (!amount || amount <= 0) {
      setError('Enter a valid price.');
      return;
    }

    if (!rfqId && !listingId) {
      setError('Missing RFQ or listing context for this quote.');
      return;
    }

    const noteParts = [
      notes.trim(),
      leadTime.trim() ? `Lead time: ${leadTime.trim()}` : '',
      deliveryTerms.trim() ? `Delivery: ${deliveryTerms.trim()}` : '',
      inspectionMethod.trim() ? `Inspection: ${inspectionMethod.trim()}` : '',
    ].filter(Boolean);

    try {
      await submitQuoteMutation.mutateAsync({
        rfqId,
        listingId,
        amount,
        currency: 'NGN',
        note: noteParts.join('\n') || undefined,
        leadTime: leadTime.trim() || undefined,
        deliveryTerms: deliveryTerms.trim() || undefined,
        inspectionMethod: inspectionMethod.trim() || undefined,
      });
      setMessage('Quote sent to the buyer.');
      setPrice('');
      setLeadTime('');
      setDeliveryTerms('');
      setInspectionMethod('');
      setNotes('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not send quote.'));
    }
  };

  return (
    <div className="bg-[#FCFCFD] border border-gray-200 rounded-xl p-6 shadow-sm mt-8">
      <h3 className="text-base font-bold text-slate-900 mb-1">Quote Response Form</h3>
      <p className="text-xs text-gray-500 mb-6">Provide your quote details to the buyer</p>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Price (NGN) *</label>
            <input 
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 300000"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Lead Time *</label>
            <input 
              type="text"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              placeholder="e.g. 7 days"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Delivery Terms *</label>
            <input 
              type="text"
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(e.target.value)}
              placeholder="e.g. Ikeja, Lagos"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">Inspection Method *</label>
            <input 
              type="text"
              value={inspectionMethod}
              onChange={(e) => setInspectionMethod(e.target.value)}
              placeholder="e.g. SGS Inspection"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-2">Notes / Terms & Conditions</label>
          <textarea 
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional terms, conditions, or notes..."
            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-2">Attachments</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 transition-colors cursor-pointer">
            <Upload size={24} className="text-gray-400 mb-3" />
            <p className="text-sm font-medium text-slate-600 mb-1">Upload lab reports, certificates, or other documents</p>
            <p className="text-xs text-gray-400">Coming soon</p>
          </div>
        </div>

        {message ? (
          <p className="text-sm text-green-700 rounded-lg border border-green-100 bg-green-50 px-4 py-3" role="status">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitQuoteMutation.isPending}
            className="w-full sm:w-auto flex-1 px-8 py-3.5 bg-[#DE9D2B] hover:bg-[#c98e26] text-white text-sm font-bold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            {submitQuoteMutation.isPending ? 'Sending…' : 'Send Quote'}
          </button>
        </div>
      </form>
    </div>
  );
};
