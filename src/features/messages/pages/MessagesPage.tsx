import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { OrderContextCard } from '../components/OrderContextCard';
import { Home } from 'lucide-react';

const MessagesPage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-gray-50 gap-3">
      {/* Breadcrumbs */}
      <nav className="p-4 px-6 flex items-center gap-2 text-[10px] text-gray-400 bg-white">
        <span><Home size={16} /></span> <span>▶</span> <span className="text-gray-600">Messages</span>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0 gap-3 p-3 pt-0">
        <ChatSidebar />

        {/* Main Chat Area */}
        <ChatWindow />

        <aside className="hidden lg:block w-80 p-4 bg-white">
          <OrderContextCard />
        </aside>
      </div>
    </div>
  );
};

export default MessagesPage;;