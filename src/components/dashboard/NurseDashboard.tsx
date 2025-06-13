
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star,
  Search,
  FileText,
  Calendar
} from 'lucide-react';

const NurseDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Earnings This Month</p>
                <p className="text-2xl font-bold">$3,200</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold">4.9</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center space-y-2">
              <Search className="h-6 w-6" />
              <span>Find Jobs</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Submit Timecard</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>View Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Available Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">Postpartum Care Assistant</h3>
                <p className="text-sm text-gray-600">Full-time • Live-in • San Francisco, CA</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">Newborn Care</Badge>
                  <Badge variant="outline">$45/hour</Badge>
                </div>
              </div>
              <Button size="sm">Apply</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">Night Nurse</h3>
                <p className="text-sm text-gray-600">Part-time • Overnight • Los Angeles, CA</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">Sleep Training</Badge>
                  <Badge variant="outline">$50/hour</Badge>
                </div>
              </div>
              <Button size="sm">Apply</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">Newborn Care Specialist</h3>
                <p className="text-sm text-gray-600">Full-time • Day shift • New York, NY</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">Twins</Badge>
                  <Badge variant="outline">$55/hour</Badge>
                </div>
              </div>
              <Button size="sm">Apply</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Timecard approved</p>
                <p className="text-sm text-gray-600">Your March 15 timecard has been approved</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">New job match</p>
                <p className="text-sm text-gray-600">A new job matching your preferences is available</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Profile viewed</p>
                <p className="text-sm text-gray-600">Your profile was viewed by 3 potential clients</p>
              </div>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NurseDashboard;
