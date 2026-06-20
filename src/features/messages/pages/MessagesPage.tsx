import { useEffect, useMemo, useState } from 'react';
import { Home } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { OrderContextCard } from '../components/OrderContextCard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useConversationContextQuery,
  useConversationMessagesQuery,
  useConversationsQuery,
  useMarkConversationReadMutation,
  useSendConversationMessageMutation,
} from '@/features/buyer/dashboardQueries';
import { mapConversationToSidebarItem, mapMessageToChat } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const MessagesPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>(
    searchParams.get('conversationId') ?? undefined,
  );

  const conversationsQuery = useConversationsQuery();
  const markReadMutation = useMarkConversationReadMutation();

  const conversations = useMemo(() => {
    const items = (conversationsQuery.data?.items ?? []).map(mapConversationToSidebarItem);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;

    return items.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query) ||
        (conversation.subtitle?.toLowerCase().includes(query) ?? false),
    );
  }, [conversationsQuery.data?.items, searchQuery]);

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId) {
      setSelectedId(conversationId);
      return;
    }
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, searchParams, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    markReadMutation.mutate(selectedId);
  }, [selectedId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const messagesQuery = useConversationMessagesQuery(selectedId);
  const contextQuery = useConversationContextQuery(selectedId);
  const sendMessageMutation = useSendConversationMessageMutation();

  const messages = useMemo(
    () => (messagesQuery.data?.items ?? []).map((message) => mapMessageToChat(message, user?.id)),
    [messagesQuery.data?.items, user?.id],
  );

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
          messages={messages}
          isLoading={messagesQuery.isLoading}
          isSending={sendMessageMutation.isPending}
          onSend={(content) => {
            if (!selectedId) return;
            sendMessageMutation.mutate({ conversationId: selectedId, content });
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
