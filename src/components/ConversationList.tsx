import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  ChevronLeft,
  User,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ChatWindow from './ChatWindow';

const ConversationsList = ({ nurseId, userId, onBack }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);

  // Fetch all conversations for the nurse
  const fetchConversations = useCallback(async () => {
    if (!nurseId) return;

    try {
      setLoading(true);

      // Fetch all conversations where nurse is a participant
      const { data: convos, error } = await supabase
        .from('conversations')
        .select(`
          *,
          job_postings (
            id,
            job_code,
            care_type,
            client_id
          ),
          client_profiles!conversations_client_id_fkey (
            id,
            user_id,
            first_name,
            last_name
          )
        `)
        .eq('nurse_id', nurseId)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // For each conversation, fetch the last message and unread count
      const enrichedConversations = await Promise.all(
        (convos || []).map(async (convo) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convo.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', convo.id)
            .eq('recipient_id', userId)
            .eq('is_read', false);

          return {
            ...convo,
            lastMessage,
            unreadCount: unreadCount || 0,
            otherParticipant: {
              ...convo.client_profiles,
              name: `${convo.client_profiles.first_name} ${convo.client_profiles.last_name}`
            }
          };
        })
      );

      setConversations(enrichedConversations);
      
      // Calculate total unread
      const total = enrichedConversations.reduce((sum, convo) => sum + convo.unreadCount, 0);
      setTotalUnread(total);

    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [nurseId, userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!nurseId) return;

    fetchConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`nurse_conversations:${nurseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Refresh conversations when new message arrives
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [nurseId, fetchConversations]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredConversations = conversations.filter(convo => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      convo.otherParticipant?.name?.toLowerCase().includes(searchLower) ||
      convo.job_postings?.care_type?.toLowerCase().includes(searchLower) ||
      convo.job_postings?.job_code?.toLowerCase().includes(searchLower) ||
      convo.lastMessage?.message_content?.toLowerCase().includes(searchLower)
    );
  });

  // If a conversation is selected, show the chat window
  if (selectedConversation) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-white flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Conversations
          </Button>
          <h2 className="text-lg font-semibold">Chat</h2>
        </div>
        <div className="flex-1">
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={userId}
            userType="nurse"
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <CardTitle className="flex items-center">
              Messages
              {totalUnread > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white">
                  {totalUnread} unread
                </Badge>
              )}
            </CardTitle>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No conversations yet</p>
            <p className="text-sm mt-2">Messages from clients will appear here</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {conversation.otherParticipant?.profile_photo_url ? (
                        <img
                          src={conversation.otherParticipant.profile_photo_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {conversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          {conversation.otherParticipant?.name || 'Unknown Client'}
                          {conversation.unreadCount > 0 && (
                            <Badge className="ml-2 bg-blue-600 text-white text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {conversation.job_postings?.job_code} - {conversation.job_postings?.care_type}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTime(conversation.lastMessage?.created_at || conversation.created_at)}
                      </span>
                    </div>

                    {conversation.lastMessage && (
                      <p className={`text-sm mt-2 truncate ${
                        conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage.sender_id === userId && (
                          <span className="text-gray-500 mr-1">You:</span>
                        )}
                        {conversation.lastMessage.message_content}
                      </p>
                    )}

                    <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                      {conversation.lastMessage?.sender_id === userId && (
                        <span className="flex items-center">
                          {conversation.lastMessage.is_read ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1 text-blue-500" />
                              Read
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Delivered
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsList;