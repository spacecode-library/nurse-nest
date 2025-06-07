
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  nurse_name: string;
  last_message: string;
  timestamp: string;
  status: 'active' | 'pending' | 'completed';
  unread_count: number;
}

export default function ClientConversationList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    // Fetch conversations when component mounts
    fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // This would typically fetch from a conversations table
      // For now, we'll use mock data that matches the expected structure
      const mockConversations: Conversation[] = [
        {
          id: '1',
          nurse_name: 'Sarah Johnson, RN',
          last_message: 'Thank you for choosing our services. I look forward to working with you.',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'active',
          unread_count: 2
        },
        {
          id: '2',
          nurse_name: 'Michael Chen, RN',
          last_message: 'I have availability for the dates you mentioned. Should we schedule a call?',
          timestamp: '2024-01-14T15:45:00Z',
          status: 'pending',
          unread_count: 1
        },
        {
          id: '3',
          nurse_name: 'Emily Rodriguez, RN',
          last_message: 'Thank you for the positive feedback! It was a pleasure working with your family.',
          timestamp: '2024-01-12T09:15:00Z',
          status: 'completed',
          unread_count: 0
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-health-green" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-attention-amber" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-professional-gray" />;
      default:
        return <MessageCircle className="h-4 w-4 text-professional-gray" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-success';
      case 'pending':
        return 'status-warning';
      case 'completed':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleStartConversation = () => {
    console.log('Starting new conversation...');
    // Implementation would go here
  };

  const handleScheduleCall = () => {
    console.log('Scheduling call...');
    // Implementation would go here
  };

  return (
    <Card className="card-brand">
      <CardHeader className="card-header-brand">
        <CardTitle className="heading-secondary text-brand-navy flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-brand-primary" />
          Nurse Communications
        </CardTitle>
      </CardHeader>
      <CardContent className="padding-md">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-brand-gray mx-auto mb-4" />
            <p className="text-body text-brand-gray mb-4">No conversations yet</p>
            <Button onClick={handleStartConversation} className="btn-primary">
              Start Your First Conversation
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Conversation List */}
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedConversation === conversation.id
                      ? 'border-brand-primary bg-brand-cloud-white'
                      : 'border-gray-200 hover:border-brand-primary hover:bg-brand-slate'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-brand-navy">{conversation.nurse_name}</h4>
                        {getStatusIcon(conversation.status)}
                        <span className={`text-small px-2 py-1 rounded-full ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                      </div>
                      <p className="text-small text-brand-gray line-clamp-2 mb-2">
                        {conversation.last_message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-small text-brand-gray">
                          {formatTimestamp(conversation.timestamp)}
                        </span>
                        {conversation.unread_count > 0 && (
                          <span className="bg-brand-primary text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={handleStartConversation}
                  className="btn-secondary flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  New Message
                </Button>
                <Button 
                  onClick={handleScheduleCall}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Schedule Call
                </Button>
              </div>
            </div>

            {/* Selected Conversation Actions */}
            {selectedConversation && (
              <div className="bg-brand-slate p-4 rounded-lg border">
                <h5 className="font-medium text-brand-navy mb-3">Quick Actions</h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="btn-primary flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    Reply
                  </Button>
                  <Button size="sm" className="btn-secondary flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video Call
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
