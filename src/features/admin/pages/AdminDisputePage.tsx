import { useState } from 'react';
import { 
   User, Search, Send, 
  FileText, ShieldAlert, CheckCircle2, ChevronRight, 
  Paperclip, Plus 
} from 'lucide-react';

const AdminDisputePage = () => {
  const [activeTab, setActiveTab] = useState('Dispute - #233');

  const conversations = [
    { id: 1, title: 'RFQ - Gold', sub: 'John', status: 'DISPUTE', statusColor: 'text-rose-500 bg-rose-50', time: '2h ago' },
    { id: 2, title: 'RFQ - Lithium', sub: 'Sarah', status: 'RFQ', statusColor: 'text-blue-500 bg-blue-50', time: '1h ago' },
    { id: 3, title: 'Dispute - #233', sub: 'Alex', status: 'DISPUTE', statusColor: 'text-rose-500 bg-rose-50', time: 'Just now' },
    { id: 4, title: 'Silver Deal', sub: 'Mike', status: 'ESCROW', statusColor: 'text-emerald-500 bg-emerald-50', time: '1d ago' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-slate-900 font-sans overflow-hidden">
      
      <div className="flex flex-1 overflow-hidden">
        {/* --- Left Sidebar: Conversations List --- */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-4">Conversations</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => setActiveTab(chat.title)}
                className={`w-full text-left p-6 border-b border-slate-50 transition-all flex justify-between items-start hover:bg-slate-50 ${activeTab === chat.title ? 'bg-slate-50 border-l-4 border-l-blue-600' : ''}`}
              >
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">{chat.title}</h4>
                  <p className="text-xs text-slate-400 font-medium mb-3">{chat.sub}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${chat.statusColor}`}>
                    {chat.status}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase">{chat.time}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* --- Right Main Area: Chat Interface --- */}
        <main className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <User size={14} /> <span>Buyer</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <User size={14} className="text-blue-500" /> <span className="text-blue-600">Vendor</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <ShieldAlert size={14} className="text-amber-500" /> <span className="text-amber-600">Admin</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-wider">RFQ</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-wider">Escrow</span>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded text-[10px] font-black uppercase tracking-wider">Dispute</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
            {/* System Info */}
            <div className="flex justify-center">
              <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                RFQ Initiated by Buyer • Apr 28, 2026
              </span>
            </div>

            {/* Buyer Message */}
            <div className="flex flex-col items-start max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Buyer • 10:30 AM</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                I need 50kg gold, what's your price?
              </div>
            </div>

            {/* Admin Message */}
            <div className="flex flex-col items-start max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black text-amber-600 uppercase tracking-tighter italic">Admin Intervention • 10:35 AM</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-amber-900 leading-relaxed italic">
                Please confirm inspection terms before proceeding.
              </div>
            </div>

            {/* Vendor Message */}
            <div className="flex flex-col items-end ml-auto max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black text-blue-600 uppercase tracking-tighter">Vendor • 10:45 AM</span>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed">
                N50M, delivery in 7 days.
              </div>
            </div>

            {/* Attachment Example */}
            <div className="flex flex-col items-end ml-auto max-w-2xl">
              <div className="bg-white border border-blue-100 p-3 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div className="pr-4">
                  <p className="text-xs font-bold text-slate-800">Report.pdf</p>
                  <p className="text-[10px] text-slate-400 uppercase">2.4 MB • Uploaded by Vendor</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          {/* Chat Footer / Input */}
          <div className="p-6 border-t border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Type your message as admin..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-16 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Paperclip size={18} /></button>
                  <button className="bg-blue-600 text-white p-2.5 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Quick Actions:</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Plus size={14} /> Send Quote
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <CheckCircle2 size={14} className="text-emerald-500" /> Create Escrow
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <FileText size={14} className="text-blue-500" /> Request NDA
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDisputePage;