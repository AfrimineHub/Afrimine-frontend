import { 
  ArrowLeft,
  CheckCircle2, Clock, Circle, FileText, Send 
} from 'lucide-react';

const AdminOrderDetailsPage = () => {
  const orderData = {
    id: 'ORD-2024-002',
    title: 'Brand identity design package',
    totalAmount: '₦800,450',
    status: 'Completed',
    buyer: { name: 'Michael Chen', email: 'michael.chen@example.com', initials: 'MC' },
    vendor: { name: 'Creative Designs Studio', email: 'hello@creativedesigns.com', initials: 'CD' },
    timeline: [
      { step: 'Order Created', date: 'Mar 28, 2024, 09:12 AM', status: 'completed' },
      { step: 'Payment Received', date: 'Mar 28, 2024, 10:45 AM', status: 'completed' },
      { step: 'Work in Progress', date: 'Mar 29, 2024, 11:11 AM', status: 'completed' },
      { step: 'Delivery Completed', date: 'Apr 2, 2024, 12:30 PM', status: 'completed' },
      { step: 'Funds Released', date: 'Apr 5, 2024, 03:00 PM', status: 'current' },
    ],
    documents: [
      { name: 'Brand_Guidelines.pdf', size: '5.2 MB', uploadedBy: 'Creative Designs Studio', date: 'Apr 2, 2024, 12:30 PM' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">

      <main className="max-w-[1200px] mx-auto py-8 px-6">
        {/* --- Back Navigation & Header --- */}
        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors">
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">{orderData.id}</h1>
            <p className="text-slate-500 font-medium">{orderData.title}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-slate-800">{orderData.totalAmount}</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold border border-emerald-100 uppercase tracking-wide">
                {orderData.status}
              </span>
            </div>
          </div>
        </div>

        {/* --- Stakeholder Info Grid --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Buyer */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Buyer</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                {orderData.buyer.initials}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{orderData.buyer.name}</h4>
                <p className="text-sm text-slate-400">{orderData.buyer.email}</p>
              </div>
            </div>
          </div>
          {/* Vendor */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vendor</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">
                {orderData.vendor.initials}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{orderData.vendor.name}</h4>
                <p className="text-sm text-slate-400">{orderData.vendor.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Order Content Body --- */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Timeline - Left 1/3 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Order Timeline</h3>
            <div className="relative">
              {orderData.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 mb-8 last:mb-0 relative">
                  {/* Vertical Line Connector */}
                  {index !== orderData.timeline.length - 1 && (
                    <div className="absolute left-3 top-6 w-[2px] h-[calc(100%-12px)] bg-slate-100" />
                  )}
                  <div className="mt-1 z-10">
                    {item.status === 'completed' ? (
                      <CheckCircle2 size={24} className="text-emerald-500 bg-white" />
                    ) : item.status === 'current' ? (
                      <Clock size={24} className="text-blue-500 bg-white" />
                    ) : (
                      <Circle size={24} className="text-slate-200 bg-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${item.status === 'completed' ? 'text-slate-800' : 'text-slate-400'}`}>
                      {item.step}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Documents - Right 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            {/* Documents */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-500" size={20} />
                <h4 className="font-bold text-slate-800 text-sm">Shared Documents</h4>
              </div>
              {orderData.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-blue-600">{doc.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {doc.size} • Uploaded by {doc.uploadedBy} • {doc.date}
                    </p>
                  </div>
                  <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider">
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* Order Info Table */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Order Information</h3>
              <div className="space-y-4 border-t border-slate-100 pt-4">
                {[
                  { label: 'Created', value: 'Mar 28, 2024' },
                  { label: 'Last Updated', value: 'Apr 5, 2024' },
                  { label: 'Messages', value: '12 Messages' },
                  { label: 'Documents', value: '1 File' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-500">{row.label}</span>
                    <span className="font-medium text-slate-700">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6">Communication</h3>
              <div className="space-y-6 mb-6">
                <div className="flex flex-col items-start max-w-[80%]">
                  <span className="text-[11px] font-bold text-slate-400 mb-1">Creative Designs Studio</span>
                  <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-200 text-sm text-slate-700 shadow-sm">
                    Initial concepts are ready for review. I'll send them shortly.
                  </div>
                </div>
                <div className="flex flex-col items-end ml-auto max-w-[80%]">
                  <span className="text-[11px] font-bold text-slate-400 mb-1">Michael Chen</span>
                  <div className="bg-blue-600 p-3 rounded-tl-xl rounded-br-xl rounded-bl-xl text-white text-sm shadow-sm">
                    Looks great! Please proceed with option 2.
                  </div>
                </div>
              </div>
              {/* Message Input Box */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your message as admin..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderDetailsPage;