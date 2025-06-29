// src/components/ChatWindow.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send, Phone, Video, MoreVertical, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { VideoCallScheduler } from './VideoCallScheduler';
import { VideoCallHistory } from './VideoCallHistory';
import { BackgroundCheckButton } from './BackgroundCheckButton';
import { 
  type VideoCall 
} from '@/supabase/api/zoomService';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string | null;
  message_content: string;
  is_read: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
    name?: string;
  } | null;
}

interface UserProfile {
  first_name?: string;
  last_name?: string;
  name?: string;
}

interface Conversation {
  id: string;
  client_id: string | null;
  nurse_id: string | null;
  job_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_message_at: string | null;
  client_profiles?:{user_id:string} | null;
  nurse_profiles?:{user_id:string} | null;
}

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
  userType: 'nurse' | 'client' | 'admin';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUserId, userType }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [profilesCache, setProfilesCache] = useState<Record<string, UserProfile>>({});
  const [otherParticipant, setOtherParticipant] = useState<UserProfile | null>(null);
  const [showVideoCallScheduler, setShowVideoCallScheduler] = useState(false);
  const [showVideoCallHistory, setShowVideoCallHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  // Fetch user profile and cache it
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (profilesCache[userId]) {
      return profilesCache[userId];
    }

    let profile: UserProfile | null = null;

    try {
      // Try client_profiles first
      const { data: client, error: clientErr } = await supabase
        .from('client_profiles')
        .select('first_name, last_name')
        .eq('user_id', userId)
        .single();
      console.log('Fetched client profile:', client,userId, 'Error:', clientErr);
      if (client && !clientErr) {
        profile = {
          ...client,
          name: `${client.first_name} ${client.last_name}`
        };
      }

      // If not found in client_profiles, try nurse_profiles
      if (!profile) {
        const { data: nurse, error: nurseErr } = await supabase
          .from('nurse_profiles')
          .select('first_name, last_name')
          .eq('user_id', userId)
          .single();
        
        if (nurse && !nurseErr) {
          profile = {
            ...nurse,
            name: `${nurse.first_name} ${nurse.last_name}`
          };
        }
      }

      // Update cache
      if (profile) {
        setProfilesCache(prev => ({ ...prev, [userId]: profile! }));
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [profilesCache]);

  const fetchMessages = useCallback(async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get unique sender IDs
      const uniqueSenderIds = [...new Set((messages || []).map(msg => msg.sender_id))];
      
      // Fetch all profiles at once
      const profilePromises = uniqueSenderIds.map(id => fetchUserProfile(id));
      await Promise.all(profilePromises);

      // Enrich messages with cached profile data
      const enrichedMessages = (messages || []).map(msg => ({
        ...msg,
        sender_profile: profilesCache[msg.sender_id] || null
      }));

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [conversation.id, fetchUserProfile, profilesCache]);

  const markMessagesAsRead = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversation.id)
        .eq('recipient_id', currentUserId)
        .eq('is_read', false);
      
      if (error) console.error('Error marking messages as read:', error);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [conversation.id, currentUserId]);

  const markMessageAsRead = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', currentUserId);
        
      if (error) console.error('Error marking message as read:', error);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [currentUserId]);

  // Set up subscription
  useEffect(() => {
    if (!conversation?.id) return;

    console.log('Setting up real-time subscription for conversation:', conversation.id);
    
    // Clean up any existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const channel = supabase
      .channel(`conversation:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          console.log('Received real-time message:', payload);
          
          const newMsg = payload.new as Message;
          
          // Fetch sender profile (will use cache if available)
          const profile = await fetchUserProfile(newMsg.sender_id);

          const enrichedMessage = {
            ...newMsg,
            sender_profile: profile
          };

          // Add message to state
          setMessages(prevMessages => {
            // Check if message already exists (prevent duplicates)
            const exists = prevMessages.some(m => m.id === newMsg.id);
            if (exists) return prevMessages;
            return [...prevMessages, enrichedMessage];
          });

          // Mark as read if not from current user
          if (newMsg.sender_id !== currentUserId) {
            markMessageAsRead(newMsg.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    subscriptionRef.current = channel;

    return () => {
      console.log('Unsubscribing from real-time messages');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [conversation.id, currentUserId, fetchUserProfile, markMessageAsRead]);

  // Initial setup
  useEffect(() => {
    if (conversation?.id) {
      fetchMessages();
      markMessagesAsRead();
      console.log('Fetching messages for conversation:', conversation);
      // Determine other participant
      const otherUserId = conversation?.nurse_profiles?.user_id === currentUserId ? conversation.client_profiles.user_id : conversation?.nurse_profiles?.user_id;
      if (otherUserId) {
        fetchUserProfile(otherUserId).then(setOtherParticipant);
      }
    }
  }, [conversation?.id, currentUserId, fetchMessages, markMessagesAsRead, fetchUserProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const recipientId = conversation?.nurse_profiles?.user_id === currentUserId ? conversation?.client_profiles?.user_id : conversation?.nurse_profiles?.user_id;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: currentUserId,
          recipient_id: recipientId,
          message_content: newMessage.trim(),
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      setNewMessage('');
      
      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string | null) => {
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
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleVideoCallScheduled = (call: VideoCall) => {
    console.log('Video call scheduled:', call);
    setShowVideoCallScheduler(false);
    toast({
      title: "Video call scheduled",
      description: "You can join the meeting using the link provided"
    });
  };

  const getOtherParticipantId = () => {
    return conversation.nurse_id === currentUserId ? conversation.client_id : conversation.nurse_id;
  };

  const getNurseId = () => {
    return userType === 'nurse' ? currentUserId : conversation.nurse_id;
  };

  const getClientId = () => {
    return userType === 'client' ? currentUserId : conversation.client_id;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {otherParticipant?.name?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {otherParticipant?.name || 'Loading...'}
            </h3>
            <p className="text-sm text-gray-600">
              {userType === 'nurse' ? 'Client' : 'Nurse'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Video Call Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVideoCallScheduler(true)}
          >
            <Video className="h-4 w-4 mr-1" />
            Video Call
          </Button>

          {/* Background Check Button (only for clients) */}
          {userType === 'client' && getNurseId() && getClientId() && (
            <BackgroundCheckButton
              nurseId={getNurseId()!}
              clientId={getClientId()!}
              jobPostingId={conversation.job_id || undefined}
            />
          )}

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowVideoCallHistory(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Call History
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="h-4 w-4 mr-2" />
                Audio Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromCurrentUser = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isFromCurrentUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message_content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.created_at)}
                    {/* {!message.is_read && !isFromCurrentUser && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        New
                      </Badge>
                    )} */}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isTyping && (
          <p className="text-xs text-gray-500 mt-1">
            {otherParticipant?.name || 'Someone'} is typing...
          </p>
        )}
      </div>

      {/* Video Call Scheduler Modal */}
      <VideoCallScheduler
        isOpen={showVideoCallScheduler}
        onClose={() => setShowVideoCallScheduler(false)}
        conversationId={conversation.id}
        currentUserId={currentUserId}
        otherParticipantName={otherParticipant?.name || 'the other participant'}
        onCallScheduled={handleVideoCallScheduled}
      />

      {/* Video Call History Modal */}
      {showVideoCallHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Video Call History</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVideoCallHistory(false)}
              >
                Close
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <VideoCallHistory
                conversationId={conversation.id}
                currentUserId={currentUserId}
                onCallUpdate={() => {
                  // Refresh call history if needed
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;