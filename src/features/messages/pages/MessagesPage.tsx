import { useEffect, useMemo, useState } from 'react';
import { Home } from 'lucide-react';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { OrderContextCard } from '../components/OrderContextCard';
import {
  useConversationContextQuery,
  useConversationMessagesQuery,
  useConversationsQuery,
  useSendConversationMessageMutation,
} from '@/features/buyer/dashboardQueries';
import { mapConversationToSidebarItem } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const MessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const conversationsQuery = useConversationsQuery({
    q: searchQuery || undefined,
    page: 1,
    pageSize: 50,
  });

  const conversations = useMemo(
    () => (conversationsQuery.data?.items ?? []).map(mapConversationToSidebarItem),
    [conversationsQuery.data?.items],
  );

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const messagesQuery = useConversationMessagesQuery(selectedId, { page: 1, pageSize: 100 });
  const contextQuery = useConversationContextQuery(selectedId);
  const sendMessageMutation = useSendConversationMessageMutation();

  const loadError =
    conversationsQuery.isError &&
    getApiErrorMessage(conversationsQuery.error, 'Could not load conversations.');

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-gray-50 gap-3">
      <nav className="p-4 px-6 flex items-center gap-2 text-[10px] text-gray-400 bg-white">
        <span><Home size={16} /></span> <span>▶</span> <span className="text-gray-600">Messages</span>
      </nav>

      {loadError ? (
        <p className="mx-3 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {loadError}
        </p>
      ) : null}

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0 gap-3 p-3 pt-0">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={conversationsQuery.isLoading}
        />

        <ChatWindow
          participantName={selectedConversation?.name}
          participantAvatarUrl={selectedConversation?.avatarUrl}
          messages={messagesQuery.data?.items ?? []}
          isLoading={messagesQuery.isLoading}
          isSending={sendMessageMutation.isPending}
          onSend={(body) => {
            if (!selectedId) return;
            sendMessageMutation.mutate({ conversationId: selectedId, body });
          }}
        />

        <aside className="hidden lg:block w-80 p-4 bg-white">
          <OrderContextCard context={contextQuery.data} isLoading={contextQuery.isLoading} />
        </aside>
      </div>
    </div>
  );
};

export default MessagesPage;
