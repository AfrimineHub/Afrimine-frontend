import { Paperclip, Send } from 'lucide-react';
export const ChatWindow = () => (
    <section className="flex-1 flex flex-col bg-white min-h-0">
      {/* Header */}
      <div className="bg-[#1C2126] p-3 flex items-center gap-3 text-white">
        <img src="/images/categories/buyer.png" className="w-8 h-8 rounded-full" alt="Seller" />
        <div>
          <h4 className="text-xs font-bold">Zinc Mining Corp</h4>
          <p className="text-[10px] text-gray-400">Nigeria</p>
        </div>
      </div>
  
      {/* Messages Area */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6">
        {/* Order Context Box */}
        <div className="bg-[#F4F7FF] border border-[#DCE4FF] p-4 rounded-xl self-center w-full max-w-md">
          <h5 className="text-xs font-bold text-gray-900 mb-3">Order #37333772 Gold Dore Bars</h5>
          <ul className="space-y-2 text-[10px] text-gray-600">
            <li className="flex items-center gap-2">📦 5 kg initially</li>
            <li className="flex items-center gap-2">🚢 FOB Harare - $55,000/kg</li>
          </ul>
        </div>
  
        <span className="text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">Yesterday</span>
  
        {/* Received Message */}
        <div className="max-w-[90%] sm:max-w-[70%] bg-gray-100 p-4 rounded-2xl rounded-tl-none self-start">
          <p className="text-xs text-gray-700 leading-relaxed">
            Hey, what can be the price if we reduce the quantity to 10kg? please provide a quote and include your delivery timeline as well.
          </p>
          <span className="block text-[9px] text-gray-400 mt-2 text-right">Just now</span>
        </div>
      </div>
  
      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t">
         <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
         <button className="text-gray-400 hover:text-gray-600 p-1 transition-colors cursor-pointer">
          <Paperclip size={20} />
         </button>
         <input type="text" placeholder="Write message..." className="flex-1 bg-transparent border-none outline-none text-xs px-2" />
         <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-sm transition-all flex items-center justify-center cursor-pointer">
          <Send size={18} />
         </button>
         </div>
      </div>
    </section>
  );