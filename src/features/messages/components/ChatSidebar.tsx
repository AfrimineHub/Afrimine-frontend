import { Search } from 'lucide-react';

export interface ChatSidebarItem {
  id: string;
  name: string;
  avatarUrl: string;
  preview: string;
  timeAgo: string;
  unreadCount: number;
}

interface ChatSidebarProps {
  conversations: ChatSidebarItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

export const ChatSidebar = ({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  isLoading,
}: ChatSidebarProps) => (
  <aside className="w-full md:w-80 bg-white flex flex-col md:h-auto max-h-[40vh] md:max-h-none min-h-0">
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Messages</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Search conversations"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-yellow-500"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 space-y-3" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500 text-center">No conversations yet.</p>
      ) : (
        conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full p-4 flex gap-3 text-left hover:bg-gray-50 transition-colors ${
              selectedId === conversation.id ? 'bg-gray-50' : ''
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={conversation.avatarUrl}
                className="w-10 h-10 rounded-full object-cover"
                alt={conversation.name}
              />
              {conversation.unreadCount > 0 ? (
                <div className="absolute -top-1 -right-1 min-w-4 h-4 bg-blue-600 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white font-bold px-1">
                  {conversation.unreadCount}
                </div>
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-bold text-gray-900 truncate">{conversation.name}</h4>
                <span className="text-[10px] text-gray-400 shrink-0 ml-2">{conversation.timeAgo}</span>
              </div>
              <p className="text-[10px] text-gray-500 truncate italic">{conversation.preview || 'No messages yet'}</p>
            </div>
          </button>
        ))
      )}
    </div>
  </aside>
);
