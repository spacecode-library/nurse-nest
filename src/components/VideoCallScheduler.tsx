// src/components/VideoCallScheduler.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Video, 
  Calendar, 
  Clock, 
  Copy, 
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  createVideoCall, 
  type VideoCall 
} from '@/supabase/api/zoomService';

interface VideoCallSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  currentUserId: string;
  otherParticipantName: string;
  onCallScheduled: (call: VideoCall) => void;
}

export const VideoCallScheduler: React.FC<VideoCallSchedulerProps> = ({
  isOpen,
  onClose,
  conversationId,
  currentUserId,
  otherParticipantName,
  onCallScheduled
}) => {
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [topic, setTopic] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledCall, setScheduledCall] = useState<VideoCall | null>(null);

  const handleScheduleCall = async (isInstant: boolean = false) => {
    setIsScheduling(true);
    
    try {
      const callData = {
        conversationId,
        initiatedByUserId: currentUserId,
        scheduledAt: isInstant ? undefined : scheduledTime,
        duration,
        topic: topic || `Video consultation with ${otherParticipantName}`
      };

      const { data, error } = await createVideoCall(callData);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setScheduledCall(data);
        onCallScheduled(data);
        
        toast({
          title: "Video call scheduled!",
          description: isInstant ? "Instant meeting created" : "Meeting scheduled successfully",
          action: (
            <Button size="sm" onClick={() => copyJoinUrl(data.zoom_join_url)}>
              Copy Link
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error('Error scheduling video call:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule video call",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const copyJoinUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Video call link copied to clipboard"
    });
  };

  const openZoomMeeting = (url: string) => {
    window.open(url, '_blank');
  };

  const resetForm = () => {
    setScheduledTime('');
    setDuration(60);
    setTopic('');
    setScheduledCall(null);
    setIsScheduling(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDateTime = (dateTimeString: string) => {
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

  const isScheduledTimeValid = () => {
    if (!scheduledTime) return false;
    const selectedDate = new Date(scheduledTime);
    const now = new Date();
    return selectedDate > now;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2 text-blue-600" />
            {scheduledCall ? 'Video Call Scheduled' : 'Schedule Video Call'}
          </DialogTitle>
        </DialogHeader>

        {scheduledCall ? (
          // Show call details after scheduling
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Meeting Ready!</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span>
                    {scheduledCall.scheduled_at 
                      ? formatDateTime(scheduledCall.scheduled_at)
                      : 'Instant meeting'
                    }
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-600" />
                  <span>{scheduledCall.duration_minutes} minutes</span>
                </div>

                <div className="text-gray-700 font-medium">
                  {scheduledCall.meeting_topic}
                </div>
              </div>

              {scheduledCall.zoom_meeting_password && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <div className="text-xs text-gray-600 mb-1">Meeting Password:</div>
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {scheduledCall.zoom_meeting_password}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyJoinUrl(scheduledCall.zoom_meeting_password || '')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Button 
                  onClick={() => openZoomMeeting(scheduledCall.zoom_join_url)}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => copyJoinUrl(scheduledCall.zoom_join_url)}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Join Link
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Show scheduling form
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Meeting Topic (optional)</Label>
              <Input
                id="topic"
                type="text"
                placeholder={`Video consultation with ${otherParticipantName}`}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isScheduling}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="300"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                disabled={isScheduling}
              />
            </div>

            <div>
              <Label htmlFor="scheduled-time">Scheduled Time (optional)</Label>
              <Input
                id="scheduled-time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                disabled={isScheduling}
              />
              <p className="text-xs text-gray-600 mt-1">
                Leave empty for instant meeting
              </p>
            </div>

            {scheduledTime && !isScheduledTimeValid() && (
              <div className="flex items-center text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Please select a future date and time
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={() => handleScheduleCall(true)}
                disabled={isScheduling}
                className="flex-1"
              >
                {isScheduling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Start Now
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleScheduleCall(false)}
                disabled={isScheduling || !scheduledTime || !isScheduledTimeValid()}
                variant="outline"
                className="flex-1"
              >
                {isScheduling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-600 pt-2">
              <div className="flex items-center mb-1">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                Meeting links work on desktop and mobile
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                No Zoom account required for participants
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};