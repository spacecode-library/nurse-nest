// components/ContractNotifications.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Bell,
  X,
  Eye,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContractNotification {
  id: string;
  type: 'contract_created' | 'contract_accepted' | 'contract_completed' | 'contract_pending';
  title: string;
  message: string;
  contractId: string;
  jobCode: string;
  nurseOrClientName: string;
  timestamp: string;
  isRead: boolean;
  userType: 'nurse' | 'client';
}

interface ContractNotificationsProps {
  userId: string;
  userType: 'nurse' | 'client';
  profileId?: string;
  onNotificationClick?: (contractId: string) => void;
}

export default function ContractNotifications({ 
  userId, 
  userType, 
  profileId,
  onNotificationClick 
}: ContractNotificationsProps) {
  const [notifications, setNotifications] = useState<ContractNotification[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Subscribe to contract status changes
  const subscribeToContractUpdates = useCallback(() => {
    if (!profileId) return;

    const subscription = supabase
      .channel(`contract_updates:${userType}:${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contracts',
          filter: userType === 'nurse' ? `nurse_id=eq.${profileId}` : `client_id=eq.${profileId}`,
        },
        async (payload) => {
          await handleContractUpdate(payload);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [profileId, userType]);

  const handleContractUpdate = async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    try {
      // Get contract details with related data
      const { data: contractData, error } = await supabase
        .from('contracts')
        .select(`
          *,
          nurse_profiles(id, first_name, last_name),
          client_profiles(id, first_name, last_name),
          job_postings(id, job_code, care_type)
        `)
        .eq('id', newRecord?.id || oldRecord?.id)
        .single();

      if (error) throw error;

      let notification: Partial<ContractNotification> | null = null;
      const otherPartyName = userType === 'nurse' 
        ? `${contractData.client_profiles.first_name} ${contractData.client_profiles.last_name}`
        : `${contractData.nurse_profiles.first_name} ${contractData.nurse_profiles.last_name}`;

      switch (eventType) {
        case 'INSERT':
          // New contract created
          notification = {
            type: 'contract_created',
            title: userType === 'nurse' ? 'New Contract Received' : 'Contract Created',
            message: userType === 'nurse' 
              ? `You have received a new contract from ${otherPartyName} for ${contractData.job_postings.job_code}`
              : `Contract created and sent to ${otherPartyName} for ${contractData.job_postings.job_code}`,
            contractId: contractData.id,
            jobCode: contractData.job_postings.job_code,
            nurseOrClientName: otherPartyName
          };
          break;

        case 'UPDATE':
          // Contract status changed
          if (oldRecord?.status !== newRecord?.status) {
            if (newRecord.status === 'active') {
              notification = {
                type: 'contract_accepted',
                title: userType === 'client' ? 'Contract Accepted!' : 'Contract Activated',
                message: userType === 'client'
                  ? `${otherPartyName} has accepted your contract for ${contractData.job_postings.job_code}. Work can now begin!`
                  : `Your contract for ${contractData.job_postings.job_code} is now active. You can start working!`,
                contractId: contractData.id,
                jobCode: contractData.job_postings.job_code,
                nurseOrClientName: otherPartyName
              };
            } else if (newRecord.status === 'completed') {
              notification = {
                type: 'contract_completed',
                title: 'Contract Completed',
                message: `Contract for ${contractData.job_postings.job_code} has been completed. Thank you for your ${userType === 'nurse' ? 'excellent care' : 'trust in our platform'}!`,
                contractId: contractData.id,
                jobCode: contractData.job_postings.job_code,
                nurseOrClientName: otherPartyName
              };
            }
          }
          break;
      }

      if (notification) {
        const fullNotification: ContractNotification = {
          id: `${Date.now()}-${Math.random()}`,
          ...notification,
          timestamp: new Date().toISOString(),
          isRead: false,
          userType
        } as ContractNotification;

        setNotifications(prev => [fullNotification, ...prev.slice(0, 9)]); // Keep last 10
        setHasNewNotifications(true);

        // Show toast notification
        showToastNotification(fullNotification);

        // Browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(fullNotification.title, {
            body: fullNotification.message,
            icon: '/favicon.ico',
            tag: fullNotification.contractId
          });
        }
      }
    } catch (error) {
      console.error('Error handling contract update:', error);
    }
  };

  const showToastNotification = (notification: ContractNotification) => {
    const icon = getNotificationIcon(notification.type);
    
    toast({
      title: notification.title,
      description: notification.message,
      duration: 8000,
      action: onNotificationClick ? (
        <Button
          size="sm"
          onClick={() => onNotificationClick(notification.contractId)}
        >
          View Contract
        </Button>
      ) : undefined,
    });
  };

  const getNotificationIcon = (type: ContractNotification['type']) => {
    switch (type) {
      case 'contract_created':
        return <FileText className="h-4 w-4" />;
      case 'contract_accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'contract_completed':
        return <Award className="h-4 w-4" />;
      case 'contract_pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: ContractNotification['type']) => {
    switch (type) {
      case 'contract_created':
        return 'text-blue-600';
      case 'contract_accepted':
        return 'text-green-600';
      case 'contract_completed':
        return 'text-purple-600';
      case 'contract_pending':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setHasNewNotifications(false);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Initialize subscription
  useEffect(() => {
    if (profileId) {
      const unsubscribe = subscribeToContractUpdates();
      
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      return unsubscribe;
    }
  }, [profileId, subscribeToContractUpdates]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Contract Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No contract notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`m-0 border-0 rounded-none cursor-pointer hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (onNotificationClick) {
                        onNotificationClick(notification.contractId);
                      }
                      setShowNotifications(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-1">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {notification.jobCode}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Navigate to contracts page
                  setShowNotifications(false);
                  const contractsTab = document.querySelector('[value="contracts"]') as HTMLElement;
                  contractsTab?.click();
                }}
              >
                View All Contracts
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}