
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Phone, MapPin, Clock, User, Star, Shield, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NurseProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  city?: string;
  state?: string;
  onboarding_completed?: boolean;
  onboarding_completion_percentage?: number;
  bio?: string;
  created_at: string;
}

export default function NurseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');

  const { data: nurses = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-nurses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nurse_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching nurses:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const filteredNurses = nurses.filter(nurse => {
    const matchesSearch = 
      nurse.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && nurse.onboarding_completed) ||
      (filterStatus === 'pending' && !nurse.onboarding_completed);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: nurses.length,
    active: nurses.filter(n => n.onboarding_completed).length,
    pending: nurses.filter(n => !n.onboarding_completed).length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Nurse Management</h1>
        <Button onClick={() => refetch()}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Nurses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search nurses by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All Nurses
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('pending')}
            size="sm"
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Nurses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nurse Directory ({filteredNurses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNurses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No nurses found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNurses.map((nurse) => (
                <div key={nurse.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {nurse.first_name} {nurse.last_name}
                        </h3>
                        <Badge variant={nurse.onboarding_completed ? 'default' : 'destructive'}>
                          {nurse.onboarding_completed ? 'Active' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          {nurse.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{nurse.phone_number}</span>
                            </div>
                          )}
                          {(nurse.city || nurse.state) && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{nurse.city}{nurse.city && nurse.state ? ', ' : ''}{nurse.state}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {nurse.onboarding_completion_percentage !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${nurse.onboarding_completion_percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{nurse.onboarding_completion_percentage}%</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
