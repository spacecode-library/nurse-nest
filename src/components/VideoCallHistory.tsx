// src/components/VideoCallHistory.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Copy, 
  Trash2,
  Play,
  Users,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  getConversationVideoCalls, 
  deleteVideoCall, 
  joinVideoCall,
  type VideoCall 
} from '@/supabase/api/zoomService';
import { supabase } from '@/integrations/supabase/client';

interface VideoCallHistoryProps {
  conversationId: string;
  currentUserId: string;
  onCallUpdate?: () => void;
}

export const VideoCallHistory: React.FC<VideoCallHistoryProps> = ({
  conversationId,
  currentUserId,
  onCallUpdate
}) => {
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoCalls();
    
    // Subscribe to video call changes
    const subscription = supabase
      .channel(`video-calls:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_calls',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchVideoCalls();
          onCallUpdate?.();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, onCallUpdate]);

  const fetchVideoCalls = async () => {
    try {
      const { data, error } = await getConversationVideoCalls(conversationId);
      if (error) {
        console.error('Error fetching video calls:', error);
        return;
      }
      setVideoCalls(data || []);
    } catch (error) {
      console.error('Error fetching video calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = async (call: VideoCall) => {
    try {
      // Update participant record
      await joinVideoCall(call.id!, currentUserId, 'attendee');
      
      // Open Zoom meeting
      window.open(call.zoom_join_url, '_blank');
      
      toast({
        title: "Joining meeting",
        description: "Opening Zoom meeting in new tab"
      });
    } catch (error) {
      console.error('Error joining call:', error);
      toast({
        title: "Error",
        description: "Failed to join the video call",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Video call link copied to clipboard"
    });
  };

  const handleDeleteCall = async (call: VideoCall) => {
    if (!confirm('Are you sure you want to delete this video call? This action cannot be undone.')) {
      return;
    }

    try {
      const { success, error } = await deleteVideoCall(call.id!);
      
      if (!success || error) {
        throw new Error('Failed to delete video call');
      }
      
      toast({
        title: "Video call deleted",
        description: "The video call has been removed"
      });
      
      fetchVideoCalls(); // Refresh the list
    } catch (error) {
      console.error('Error deleting call:', error);
      toast({
        title: "Error",
        description: "Failed to delete the video call",
        variant: "destructive"
      });
    }
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Not scheduled';
    
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: VideoCall['status']) => {
    const statusConfig = {
      scheduled: { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      active: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      completed: { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
      cancelled: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isCallActive = (call: VideoCall) => {
    if (call.status !== 'scheduled') return false;
    
    if (!call.scheduled_at) return true; // Instant meeting
    
    const scheduledTime = new Date(call.scheduled_at);
    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();
    
    // Allow joining 15 minutes before scheduled time and up to the duration after
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -(call.duration_minutes * 60 * 1000);
  };

  const canDeleteCall = (call: VideoCall) => {
    return call.initiated_by_user_id === currentUserId && call.status !== 'active';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (videoCalls.length === 0) {
    return (
      <div className="p-6 text-center">
        <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No video calls yet</h3>
        <p className="text-gray-600">
          Schedule a video call to start your consultation history.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {videoCalls.map((call) => (
          <Card key={call.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-gray-900">
                      {call.meeting_topic || 'Video Consultation'}
                    </h4>
                    {getStatusBadge(call.status)}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {call.scheduled_at 
                        ? formatDateTime(call.scheduled_at)
                        : 'Instant meeting'
                      }
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {call.duration_minutes} min
                    </div>

                    {call.zoom_meeting_password && (
                      <div className="flex items-center">
                        <span className="text-xs">Password: </span>
                        <code className="text-xs bg-gray-100 px-1 rounded ml-1">
                          {call.zoom_meeting_password}
                        </code>
                      </div>
                    )}
                  </div>

                  {call.recording_url && (
                    <div className="flex items-center text-sm text-blue-600 mt-2">
                      <Play className="h-3 w-3 mr-1" />
                      Recording available
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {isCallActive(call) && call.status !== 'cancelled' && (
                    <Button
                      size="sm"
                      onClick={() => handleJoinCall(call)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopyLink(call.zoom_join_url)}>
                        <Copy className="h-3 w-3 mr-2" />
                        Copy Join Link
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => window.open(call.zoom_join_url, '_blank')}>
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Open in Zoom
                      </DropdownMenuItem>

                      {call.recording_url && (
                        <DropdownMenuItem onClick={() => window.open(call.recording_url!, '_blank')}>
                          <Play className="h-3 w-3 mr-2" />
                          View Recording
                        </DropdownMenuItem>
                      )}

                      {canDeleteCall(call) && (
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCall(call)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {call.status === 'active' && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center text-green-800">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">Meeting in progress</span>
                  </div>
                </div>
              )}

              {call.status === 'scheduled' && call.scheduled_at && (
                <div className="mt-3">
                  {isCallActive(call) ? (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center text-blue-800">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Ready to join</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          Upcoming meeting - join {formatDateTime(call.scheduled_at)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {videoCalls.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Showing {videoCalls.length} video call{videoCalls.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};