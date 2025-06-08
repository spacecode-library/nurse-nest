
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, Mail, Phone, MapPin, Clock, User, Award, Shield, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Updated interface to match actual data structure
interface NurseProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  years_experience?: number;
  onboarding_completed?: boolean;
  specializations?: any;
  license_info?: any;
}

export default function NurseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState<'all' | 'new' | 'experienced' | 'expert'>('all');
  const [selectedNurse, setSelectedNurse] = useState<NurseProfile | null>(null);

  const { data: nurses = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-nurses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nurse_profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching nurses:', error);
        throw error;
      }
      
      // Return the data directly since we're not joining with profiles
      return data || [];
    },
  });

  const filteredNurses = nurses.filter(nurse => {
    const matchesSearch = 
      nurse.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterExperience === 'all' || 
      (filterExperience === 'new' && (nurse.years_experience || 0) < 2) ||
      (filterExperience === 'experienced' && (nurse.years_experience || 0) >= 2 && (nurse.years_experience || 0) < 10) ||
      (filterExperience === 'expert' && (nurse.years_experience || 0) >= 10);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: nurses.length,
    onboarded: nurses.filter(n => n.onboarding_completed).length,
    pending: nurses.filter(n => !n.onboarding_completed).length,
    newNurses: nurses.filter(n => (n.years_experience || 0) < 2).length,
    experienced: nurses.filter(n => (n.years_experience || 0) >= 2).length,
  };

  const getExperienceLevel = (years: number) => {
    if (years < 2) return { label: 'New', color: 'bg-blue-100 text-blue-800' };
    if (years < 10) return { label: 'Experienced', color: 'bg-green-100 text-green-800' };
    return { label: 'Expert', color: 'bg-purple-100 text-purple-800' };
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Onboarded</p>
                <p className="text-2xl font-bold text-green-600">{stats.onboarded}</p>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">New Nurses</p>
                <p className="text-2xl font-bold">{stats.newNurses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Experienced</p>
                <p className="text-2xl font-bold">{stats.experienced}</p>
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
            placeholder="Search nurses by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterExperience === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterExperience('all')}
            size="sm"
          >
            All Experience
          </Button>
          <Button
            variant={filterExperience === 'new' ? 'default' : 'outline'}
            onClick={() => setFilterExperience('new')}
            size="sm"
          >
            New (&lt;2 years)
          </Button>
          <Button
            variant={filterExperience === 'experienced' ? 'default' : 'outline'}
            onClick={() => setFilterExperience('experienced')}
            size="sm"
          >
            Experienced
          </Button>
          <Button
            variant={filterExperience === 'expert' ? 'default' : 'outline'}
            onClick={() => setFilterExperience('expert')}
            size="sm"
          >
            Expert (10+ years)
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
                        {nurse.years_experience !== undefined && (
                          <Badge className={getExperienceLevel(nurse.years_experience).color}>
                            {getExperienceLevel(nurse.years_experience).label}
                          </Badge>
                        )}
                        <Badge variant={nurse.onboarding_completed ? 'default' : 'destructive'}>
                          {nurse.onboarding_completed ? 'Complete' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          {nurse.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{nurse.email}</span>
                            </div>
                          )}
                          {nurse.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{nurse.phone_number}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          {nurse.years_experience !== undefined && (
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              <span>{nurse.years_experience} years experience</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNurse(nurse)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nurse Detail Modal */}
      {selectedNurse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedNurse.first_name} {selectedNurse.last_name}
              </h2>
              <Button variant="outline" onClick={() => setSelectedNurse(null)}>
                Close
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Onboarding Status</label>
                      <p className={`font-semibold ${selectedNurse.onboarding_completed ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedNurse.onboarding_completed ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  {selectedNurse.years_experience !== undefined ? (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Years of Experience</label>
                      <p className="font-semibold">{selectedNurse.years_experience} years</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No experience information available</p>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <p className="text-gray-500">Activity tracking coming soon...</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
