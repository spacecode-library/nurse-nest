// components/dashboard/client/ClientConversationsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  ChevronLeft,
  User,
  Calendar,
  ArrowRight,
  Bell,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ChatWindow from '@/components/ChatWindow';

interface ClientConversationsListProps {
  clientId: string;
  userId: string;
  onBack: () => void;
}

const ClientConversationsList: React.FC<ClientConversationsListProps> = ({ 
  clientId, 
  userId, 
  onBack 
}) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);

  // Fetch all conversations for the client
  const fetchConversations = useCallback(async () => {
    if (!clientId) return;

    try {
      setLoading(true);

      // Fetch all conversations where client is a participant
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
          nurse_profiles!conversations_nurse_id_fkey (
            id,
            user_id,
            first_name,
            last_name,
            profile_photo_url
          )
        `)
        .eq('client_id', clientId)
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

          // Get unread count (messages sent to the client user)
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
              ...convo.nurse_profiles,
              name: `${convo.nurse_profiles.first_name} ${convo.nurse_profiles.last_name}`
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
  }, [clientId, userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!clientId) return;

    fetchConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`client_conversations:${clientId}`)
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
  }, [clientId, fetchConversations]);

  const formatTime = (timestamp: string) => {
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

  const getFilteredCategories = () => {
    let categories = faqCategories;
    
    if (activeCategory) {
      categories = categories.filter(cat => cat.id === activeCategory);
    }
    
    if (searchTerm.trim() === "") return categories;
    
    return categories.map(category => ({
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.faqs.length > 0);
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

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsSidebarOpen(false);
    
    // Smooth scroll to category
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If a conversation is selected, show the chat window
  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col">
        <div className="card-header-brand flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Conversations
          </Button>
          <h2 className="heading-secondary text-brand-navy">Chat with {selectedConversation.otherParticipant?.name}</h2>
        </div>
        <div className="flex-1">
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={userId}
            userType="client"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-light">
      {/* Header */}
      <div className="main-navigation">
        <div className="container mx-auto padding-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center text-brand-slate"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <h1 className="heading-secondary text-brand-slate">Messages</h1>
              {totalUnread > 0 && (
                <span className="status-error">
                  {totalUnread} unread
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchConversations}
              className="text-brand-slate border-brand-slate"
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto padding-md">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-brand-blue" />
                Conversations with Nurses
                {totalUnread > 0 && (
                  <span className="ml-2 status-error">
                    {totalUnread} unread
                  </span>
                )}
              </CardTitle>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-gray" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-brand-gray padding-md">
                <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {conversations.length === 0 ? 'No conversations yet' : 'No matching conversations'}
                </p>
                <p className="text-small mt-2 text-center">
                  {conversations.length === 0 
                    ? 'When nurses apply for your jobs and you start chatting, conversations will appear here'
                    : 'Try adjusting your search terms'
                  }
                </p>
                {conversations.length === 0 && (
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="mt-4"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Post a Job to Get Started
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Unread Messages Alert */}
                {totalUnread > 0 && (
                  <div className="padding-sm bg-brand-cloud-white border-b border-brand-soft-sky">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-brand-blue mr-2 animate-pulse" />
                      <span className="font-medium text-brand-navy">
                        You have {totalUnread} unread message{totalUnread !== 1 ? 's' : ''} from nurses
                      </span>
                    </div>
                  </div>
                )}

                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`padding-sm hover:bg-brand-slate cursor-pointer transition-colors ${
                      conversation.unreadCount > 0 ? 'bg-brand-cloud-white border-l-4 border-l-brand-blue' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-brand-slate overflow-hidden">
                          {conversation.otherParticipant?.profile_photo_url ? (
                            <img
                              src={conversation.otherParticipant.profile_photo_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-blue flex items-center justify-center text-white font-medium">
                              {conversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'N'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-brand-navy flex items-center">
                              {conversation.otherParticipant?.name || 'Unknown Nurse'}
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 status-error text-xs animate-pulse">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </h4>
                            <p className="text-small text-brand-gray flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {conversation.job_postings?.job_code} - {conversation.job_postings?.care_type}
                            </p>
                          </div>
                          <span className="text-small text-brand-gray ml-2">
                            {formatTime(conversation.lastMessage?.created_at || conversation.created_at)}
                          </span>
                        </div>

                        {conversation.lastMessage && (
                          <p className={`text-small mt-2 truncate ${
                            conversation.unreadCount > 0 ? 'font-medium text-brand-navy' : 'text-brand-gray'
                          }`}>
                            {conversation.lastMessage.sender_id === userId && (
                              <span className="text-brand-gray mr-1">You:</span>
                            )}
                            {conversation.lastMessage.message_content}
                          </p>
                        )}

                        <div className="flex items-center mt-2 space-x-3 text-small text-brand-gray">
                          {conversation.lastMessage?.sender_id === userId && (
                            <span className="flex items-center">
                              {conversation.lastMessage.is_read ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1 text-brand-blue" />
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
                          {conversation.unreadCount === 0 && conversation.lastMessage?.sender_id !== userId && (
                            <span className="text-brand-green">
                              Conversation up to date
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
      </div>
    </div>
  );
};

export default ClientConversationsList;

const faqCategories = [];
const setActiveCategory = () => {};
const setIsSidebarOpen = () => {};
const setIsOpen = () => {};
const activeCategory = "";
