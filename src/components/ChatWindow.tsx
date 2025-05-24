// import React, { useState, useEffect, useRef } from 'react'
// import { supabase } from '@/integrations/supabase/client.js'
// import { Send, Phone, Video } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'

// const ChatWindow = ({ conversation, currentUserId, userType }) => {
//     const [messages, setMessages] = useState([])
//     const [newMessage, setNewMessage] = useState('')
//     const [loading, setLoading] = useState(false)
//     const [isTyping, setIsTyping] = useState(false)
//     const messagesEndRef = useRef(null)

//     useEffect(() => {
//         if (conversation?.id) {
//             fetchMessages()
//             subscribeToMessages()
//             markMessagesAsRead()
//         }
//         console.log('Conversation ID:', conversation?.id)
//         console.log(currentUserId)
//     }, [conversation?.id])

//     useEffect(() => {
//         scrollToBottom()
//     }, [messages])

//     const fetchMessages = async () => {
//         try {
//             const { data: messages, error } = await supabase
//                 .from('messages')
//                 .select('*')
//                 .eq('conversation_id', conversation.id)
//                 .order('created_at', { ascending: true });

//             if (error) throw error;

//             const enrichedMessages = await Promise.all(
//                 (messages || []).map(async (msg) => {
//                     let profile = null;

//                     // Try fetching from client_profiles
//                     let { data: client, error: clientErr } = await supabase
//                         .from('client_profiles')
//                         .select('first_name, last_name, name')
//                         .eq('user_id', msg.sender_id)
//                         .single();

//                     if (client) profile = client;
                    
//                     // If not found in client_profiles, try nurse_profiles
//                     if (!profile) {
//                         const { data: nurse, error: nurseErr } = await supabase
//                             .from('nurse_profiles')
//                             .select('first_name, last_name')
//                             .eq('user_id', msg.sender_id)
//                             .single();

//                         if (nurse) profile = nurse;
//                     }

//                     return {
//                         ...msg,
//                         sender_profile: profile,
//                     };
//                 })
//             );

//             setMessages(enrichedMessages);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     };


//     const subscribeToMessages = () => {
//         const subscription = supabase
//             .channel(`conversation:${conversation.id}`)
//             .on(
//                 'postgres_changes',
//                 {
//                     event: 'INSERT',
//                     schema: 'public',
//                     table: 'messages',
//                     filter: `conversation_id=eq.${conversation.id}`,
//                 },
//                 async (payload) => {
//                     // Fetch the complete message with sender info
//                     const { data, error } = await supabase
//                         .from('messages')
//                         .select(`
//               *,
//               sender_profile:sender_id(first_name, last_name, name),
//               recipient_profile:recipient_id(first_name, last_name, name)
//             `)
//                         .eq('id', payload.new.id)
//                         .single()
//                     if (!error && data) {
//                         setMessages(prev => [...prev, data])

//                         // Mark as read if it's not from current user
//                         if (data.sender_id !== currentUserId) {
//                             markMessageAsRead(data.id)
//                         }

//                         // Update conversation's last_message_at
//                         await supabase
//                             .from('conversations')
//                             .update({ last_message_at: new Date().toISOString() })
//                             .eq('id', conversation.id)
//                     }
//                 }
//             )
//             .subscribe()
//         return () => {
//             subscription.unsubscribe()
//         }
//     }

//     const markMessagesAsRead = async () => {
//         try {
//             await supabase
//                 .from('messages')
//                 .update({ is_read: true })
//                 .eq('conversation_id', conversation.id)
//                 .eq('recipient_id', currentUserId)
//                 .eq('is_read', false)
//         } catch (error) {
//             console.error('Error marking messages as read:', error)
//         }
//     }

//     const markMessageAsRead = async (messageId) => {
//         try {
//             await supabase
//                 .from('messages')
//                 .update({ is_read: true })
//                 .eq('id', messageId)
//         } catch (error) {
//             console.error('Error marking message as read:', error)
//         }
//     }

//     const sendMessage = async (e) => {
//         e.preventDefault()
//         if (!newMessage.trim() || loading) return

//         setLoading(true)
//         try {
//             const recipientId = userType === 'client' ? conversation.nurse_id : conversation.client_id
//             let recipientProfile = null;

//             if (userType === 'client') {
//                 const { data, error } = await supabase
//                     .from('nurse_profiles')
//                     .select('user_id')
//                     .eq('id', recipientId)
//                     .single();

//                 if (error) throw error;
//                 recipientProfile = data;
//             } else {
//                 const { data, error } = await supabase
//                     .from('client_profiles')
//                     .select('user_id')
//                     .eq('id', recipientId)
//                     .single();

//                 if (error) throw error;
//                 recipientProfile = data;
//             }
//             const { error } = await supabase
//                 .from('messages')
//                 .insert({
//                     conversation_id: conversation.id,
//                     sender_id: currentUserId,
//                     recipient_id: recipientProfile.user_id,
//                     message_content: newMessage.trim(),
//                     is_read: false
//                 })

//             if (error) throw error
//                fetchMessages()
//             setNewMessage('')
//         } catch (error) {
//             console.error('Error sending message:', error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//     }

//     const formatTime = (timestamp) => {
//         return new Date(timestamp).toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: '2-digit',
//             hour12: true
//         })
//     }

//     const formatDate = (timestamp) => {
//         const date = new Date(timestamp)
//         const today = new Date()
//         const yesterday = new Date(today)
//         yesterday.setDate(yesterday.getDate() - 1)

//         if (date.toDateString() === today.toDateString()) {
//             return 'Today'
//         } else if (date.toDateString() === yesterday.toDateString()) {
//             return 'Yesterday'
//         } else {
//             return date.toLocaleDateString('en-US', {
//                 month: 'short',
//                 day: 'numeric',
//                 year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
//             })
//         }
//     }

//     // Group messages by date
//     const groupMessagesByDate = () => {
//         const groups = []
//         let currentDate = null
//         let currentGroup = []

//         messages.forEach((message) => {
//             const messageDate = new Date(message.created_at).toDateString()

//             if (messageDate !== currentDate) {
//                 if (currentGroup.length > 0) {
//                     groups.push({ date: currentDate, messages: currentGroup })
//                 }
//                 currentDate = messageDate
//                 currentGroup = [message]
//             } else {
//                 currentGroup.push(message)
//             }
//         })

//         if (currentGroup.length > 0) {
//             groups.push({ date: currentDate, messages: currentGroup })
//         }

//         return groups
//     }

//     const messageGroups = groupMessagesByDate()

//     return (
//         <div className="flex flex-col h-full">
//             {/* Chat Header */}
//             <div className="flex items-center justify-between p-4 border-b bg-white">
//                 <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
//                         {conversation.otherParticipant?.profile_photo_url ? (
//                             <img
//                                 src={conversation.otherParticipant.profile_photo_url}
//                                 alt=""
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
//                                 {conversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'N'}
//                             </div>
//                         )}
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-900">
//                             {conversation.otherParticipant?.name || 'Unknown User'}
//                         </h3>
//                         {conversation.job_postings && (
//                             <p className="text-sm text-gray-500">
//                                 {conversation.job_postings.job_code} - {conversation.job_postings.care_type}
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                     <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
//                         <Phone className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
//                         <Video className="h-4 w-4" />
//                     </Button>
//                 </div>
//             </div>

//             {/* Messages Container */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//                 {messageGroups.length === 0 ? (
//                     <div className="text-center py-8">
//                         <div className="text-gray-500">
//                             <p className="mb-2">Start a conversation with {conversation.otherParticipant?.name}</p>
//                             <p className="text-sm">
//                                 {userType === 'client'
//                                     ? 'Ask questions about their experience and availability.'
//                                     : 'Introduce yourself and discuss the job requirements.'
//                                 }
//                             </p>
//                         </div>
//                     </div>
//                 ) : (
//                     messageGroups.map((group, groupIndex) => (
//                         <div key={groupIndex}>
//                             {/* Date Separator */}
//                             <div className="flex justify-center mb-4">
//                                 <Badge variant="outline" className="bg-white text-gray-600 text-xs">
//                                     {formatDate(group.messages[0].created_at)}
//                                 </Badge>
//                             </div>

//                             {/* Messages */}
//                             {group.messages.map((message, index) => {
//                                 const isOwn = message.sender_id === currentUserId
//                                 const showAvatar = index === 0 ||
//                                     group.messages[index - 1].sender_id !== message.sender_id

//                                 return (
//                                     <div
//                                         key={message.id}
//                                         className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
//                                     >
//                                         {!isOwn && showAvatar && (
//                                             <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2 flex-shrink-0">
//                                                 {conversation.otherParticipant?.profile_photo_url ? (
//                                                     <img
//                                                         src={conversation.otherParticipant.profile_photo_url}
//                                                         alt=""
//                                                         className="w-full h-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
//                                                         {conversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'N'}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}

//                                         {!isOwn && !showAvatar && (
//                                             <div className="w-8 mr-2 flex-shrink-0"></div>
//                                         )}

//                                         <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-4' : 'mr-4'}`}>
//                                             <div
//                                                 className={`px-4 py-2 rounded-2xl ${isOwn
//                                                         ? 'bg-blue-600 text-white rounded-br-sm'
//                                                         : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
//                                                     }`}
//                                             >
//                                                 <p className="text-sm">{message.message_content}</p>
//                                             </div>

//                                             <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                                                 <span className="text-xs text-gray-500">
//                                                     {formatTime(message.created_at)}
//                                                 </span>
//                                                 {isOwn && (
//                                                     <span className={`text-xs ${message.is_read ? 'text-blue-500' : 'text-gray-400'}`}>
//                                                         {message.is_read ? '✓✓' : '✓'}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     ))
//                 )}

//                 {isTyping && (
//                     <div className="flex justify-start">
//                         <div className="bg-gray-200 rounded-2xl px-4 py-2">
//                             <div className="flex space-x-1">
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="border-t bg-white p-4">
//                 <form onSubmit={sendMessage} className="flex items-center space-x-2">
//                     <Input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type your message..."
//                         disabled={loading}
//                         className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     />
//                     <Button
//                         type="submit"
//                         disabled={loading || !newMessage.trim()}
//                         className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
//                     >
//                         <Send className="h-4 w-4" />
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default ChatWindow
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client.js'
import { Send, Phone, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const ChatWindow = ({ conversation, currentUserId, userType }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [profilesCache, setProfilesCache] = useState({}) // Cache for user profiles
    const messagesEndRef = useRef(null)
    const subscriptionRef = useRef(null) // Store subscription reference

    // Fetch user profile with caching
    const fetchUserProfile = useCallback(async (userId) => {
        // Check cache first
        if (profilesCache[userId]) {
            return profilesCache[userId];
        }

        let profile = null;

        // Try fetching from client_profiles first
        const { data: client, error: clientErr } = await supabase
            .from('client_profiles')
            .select('first_name, last_name')
            .eq('user_id', userId)
            .single();

        if (client && !clientErr) {
            profile = {
                ...client,
                name: `${client.first_name} ${client.last_name}`
            };
        } else {
            // If not found in client_profiles, try nurse_profiles
            const { data: nurse, error: nurseErr } = await supabase
                .from('nurse_profiles')
                .select('first_name, last_name, profile_photo_url')
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
            setProfilesCache(prev => ({ ...prev, [userId]: profile }));
        }

        return profile;
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

    const markMessageAsRead = useCallback(async (messageId) => {
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
                    
                    const newMsg = payload.new;
                    
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

                    // Mark as read if it's not from current user
                    if (newMsg.sender_id !== currentUserId) {
                        await markMessageAsRead(newMsg.id);
                    }

                    // Update conversation's last_message_at
                    await supabase
                        .from('conversations')
                        .update({ last_message_at: new Date().toISOString() })
                        .eq('id', conversation.id);
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        subscriptionRef.current = channel;

        // Cleanup function
        return () => {
            console.log('Unsubscribing from real-time messages');
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
    }, [conversation?.id, currentUserId, fetchUserProfile, markMessageAsRead]);

    // Initial data fetch
    useEffect(() => {
        if (conversation?.id) {
            fetchMessages();
            markMessagesAsRead();
        }
    }, [conversation?.id, fetchMessages, markMessagesAsRead]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || loading) return;

        const messageText = newMessage.trim();
        setNewMessage(''); // Clear input immediately
        setLoading(true);

        try {
            // Get recipient user_id (with caching to avoid repeated calls)
            let recipientUserId = null;

            if (userType === 'client') {
                // Get nurse's user_id from nurse_profiles
                const { data: nurse, error } = await supabase
                    .from('nurse_profiles')
                    .select('user_id')
                    .eq('id', conversation.nurse_id)
                    .single();

                if (error) throw error;
                recipientUserId = nurse.user_id;
            } else {
                // Get client's user_id from client_profiles
                const { data: client, error } = await supabase
                    .from('client_profiles')
                    .select('user_id')
                    .eq('id', conversation.client_id)
                    .single();

                if (error) throw error;
                recipientUserId = client.user_id;
            }

            console.log('Sending message to recipient:', recipientUserId);

            // Get current user's profile for optimistic update
            const senderProfile = await fetchUserProfile(currentUserId);

            // Create optimistic message for immediate UI update
            const optimisticMessage = {
                id: `temp-${Date.now()}`, // Temporary ID
                conversation_id: conversation.id,
                sender_id: currentUserId,
                recipient_id: recipientUserId,
                message_content: messageText,
                created_at: new Date().toISOString(),
                is_read: false,
                sender_profile: senderProfile,
            };

            // Add message to UI immediately (optimistic update)
            setMessages(prev => [...prev, optimisticMessage]);

            // Send message to database
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversation.id,
                    sender_id: currentUserId,
                    recipient_id: recipientUserId,
                    message_content: messageText,
                    is_read: false
                })
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic message with real message
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === optimisticMessage.id 
                        ? { ...data, sender_profile: senderProfile }
                        : msg
                )
            );

            console.log('Message sent successfully:', data);

        } catch (error) {
            console.error('Error sending message:', error);
            
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => !msg.id?.toString().startsWith('temp-')));
            
            // Restore message text
            setNewMessage(messageText);
            
            alert('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    // Group messages by date
    const groupMessagesByDate = () => {
        const groups = [];
        let currentDate = null;
        let currentGroup = [];

        messages.forEach((message) => {
            const messageDate = new Date(message.created_at).toDateString();

            if (messageDate !== currentDate) {
                if (currentGroup.length > 0) {
                    groups.push({ date: currentDate, messages: currentGroup });
                }
                currentDate = messageDate;
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
        });

        if (currentGroup.length > 0) {
            groups.push({ date: currentDate, messages: currentGroup });
        }

        return groups;
    };

    const messageGroups = groupMessagesByDate();

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {conversation.otherParticipant?.profile_photo_url ? (
                            <img
                                src={conversation.otherParticipant.profile_photo_url}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {conversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'N'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {conversation.otherParticipant?.name || 'Unknown User'}
                        </h3>
                        {conversation.job_postings && (
                            <p className="text-sm text-gray-500">
                                {conversation.job_postings.job_code} - {conversation.job_postings.care_type}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                        <Video className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messageGroups.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500">
                            <p className="mb-2">Start a conversation with {conversation.otherParticipant?.name}</p>
                            <p className="text-sm">
                                {userType === 'client'
                                    ? 'Ask questions about their experience and availability.'
                                    : 'Introduce yourself and discuss the job requirements.'
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    messageGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {/* Date Separator */}
                            <div className="flex justify-center mb-4">
                                <Badge variant="outline" className="bg-white text-gray-600 text-xs">
                                    {formatDate(group.messages[0].created_at)}
                                </Badge>
                            </div>

                            {/* Messages */}
                            {group.messages.map((message, index) => {
                                const isOwn = message.sender_id === currentUserId;
                                const showAvatar = index === 0 ||
                                    group.messages[index - 1].sender_id !== message.sender_id;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                                    >
                                        {!isOwn && showAvatar && (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2 flex-shrink-0">
                                                {conversation.otherParticipant?.profile_photo_url ? (
                                                    <img
                                                        src={conversation.otherParticipant.profile_photo_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                                        {conversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'N'}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!isOwn && !showAvatar && (
                                            <div className="w-8 mr-2 flex-shrink-0"></div>
                                        )}

                                        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-4' : 'mr-4'}`}>
                                            <div
                                                className={`px-4 py-2 rounded-2xl ${isOwn
                                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                                                    } ${message.id?.toString().startsWith('temp-') ? 'opacity-70' : ''}`}
                                            >
                                                <p className="text-sm">{message.message_content}</p>
                                            </div>

                                            <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(message.created_at)}
                                                </span>
                                                {isOwn && (
                                                    <span className={`text-xs ${message.is_read ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        {message.id?.toString().startsWith('temp-') ? '⏳' : (message.is_read ? '✓✓' : '✓')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl px-4 py-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t bg-white p-4">
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;