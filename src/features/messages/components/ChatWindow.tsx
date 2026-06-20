import { useState, type FormEvent } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';
import type { ChatMessage } from '@/features/buyer/dashboardTypes';

interface ChatWindowProps {
  participantName?: string;
  participantLocation?: string;
  participantAvatarUrl?: string;
  messages: ChatMessage[];
  isLoading?: boolean;
  isSending?: boolean;
  onSend: (content: string) => void;
}

export const ChatWindow = ({
  participantName,
  participantLocation,
  participantAvatarUrl,
  messages,
  isLoading,
  isSending,
  onSend,
}: ChatWindowProps) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || isSending) return;
    onSend(body);
    setDraft('');
  };

  if (!participantName) {
    return (
      <section className="flex-1 flex flex-col bg-white min-h-0 items-center justify-center">
        <p className="text-sm text-gray-500">Select a conversation to start messaging.</p>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-white min-h-0">
      <div className="bg-[#1C2126] p-3 flex items-center gap-3 text-white">
        <img
          src={participantAvatarUrl || '/images/categories/buyer.png'}
          className="w-8 h-8 rounded-full object-cover"
          alt={participantName}
        />
        <div>
          <h4 className="text-xs font-bold">{participantName}</h4>
          {participantLocation ? (
            <p className="text-[10px] text-gray-400">{participantLocation}</p>
          ) : null}
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6">
        {isLoading ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No messages in this conversation yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[90%] sm:max-w-[70%] p-4 rounded-2xl ${
                message.isOwn
                  ? 'bg-yellow-50 self-end rounded-tr-none'
                  : 'bg-gray-100 self-start rounded-tl-none'
              }`}
            >
              <p className="text-xs text-gray-700 leading-relaxed">{message.body}</p>
              <span className="block text-[9px] text-gray-400 mt-2 text-right">
                {formatRelativeTime(message.sentAt) || 'Just now'}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors cursor-pointer"
            aria-label="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Write message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs px-2"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white p-2 rounded-lg shadow-sm transition-all flex items-center justify-center cursor-pointer"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </section>
  );
};
