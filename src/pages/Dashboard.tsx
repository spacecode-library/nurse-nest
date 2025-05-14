
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, Settings, Check, AlertCircle, Users, FileCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Interface for user profile data
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
}

// Interface for client purchase data
interface Purchase {
  id: string;
  type: string;
  status: "In Progress" | "Match Found" | "Refund Eligible";
  purchaseDate: string;
  expiresAt: string;
}

// Interface for timesheet data
interface Timesheet {
  id: string;
  date: string;
  nurseName?: string;
  clientName?: string;
  totalHours: number;
  status: "Pending" | "Approved" | "Paid";
}

// Interface for nurse submission data
interface NurseSubmission {
  id: string;
  nurseId: string;
  nurseName: string;
  specialty: string;
  experience: number;
  availability: string;
  status: "New" | "Under Review" | "Approved" | "Rejected";
  submittedAt: string;
}

// Interface for vetting option
interface VettingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [nurseSubmissions, setNurseSubmissions] = useState<NurseSubmission[]>([]);
  const [vettingOptions, setVettingOptions] = useState<VettingOption[]>([]);
  const [selectedNurse, setSelectedNurse] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [userRole, setUserRole] = useState<"nurse" | "client" | null>(null);
  const [showVettingOptions, setShowVettingOptions] = useState(false);
  const [totalVettingCost, setTotalVettingCost] = useState(0);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // For demo, we'll set a role based on email
        // In a real app, this would come from your database
        const role = data.email?.includes('nurse') ? 'nurse' : 'client';
        setUserRole(role);
        setProfile({
          ...data,
          role: role
        });
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Mock data loading - in a real app, fetch from your database
  useEffect(() => {
    if (userRole === 'client') {
      // Mock client purchases
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          type: 'Nurse Search Fee',
          status: 'In Progress',
          purchaseDate: '2025-05-01',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
        }
      ];
      setPurchases(mockPurchases);
      
      // Mock client timesheets to approve
      const mockTimesheets: Timesheet[] = [
        {
          id: '101',
          date: '2025-05-10',
          nurseName: 'Sarah Johnson',
          totalHours: 8,
          status: 'Pending'
        }
      ];
      setTimesheets(mockTimesheets);
      
      // Mock nurse submissions
      const mockSubmissions: NurseSubmission[] = [
        {
          id: '201',
          nurseId: '1001',
          nurseName: 'Rebecca Thompson',
          specialty: 'Pediatric Nurse',
          experience: 8,
          availability: 'Weekdays, evenings',
          status: 'New',
          submittedAt: '2025-05-10'
        },
        {
          id: '202',
          nurseId: '1002',
          nurseName: 'Michael Chen',
          specialty: 'Geriatric Care',
          experience: 12,
          availability: 'Weekends, nights',
          status: 'Under Review',
          submittedAt: '2025-05-09'
        }
      ];
      setNurseSubmissions(mockSubmissions);
      
      // Mock vetting options
      const mockVettingOptions: VettingOption[] = [
        {
          id: '1',
          name: 'Drug Test (10-panel)',
          description: 'Additional verification for peace of mind',
          price: 100,
          selected: false
        },
        {
          id: '2',
          name: 'Driving History Report',
          description: 'For nurses who will provide transportation',
          price: 50,
          selected: false
        },
        {
          id: '3',
          name: 'Background Check',
          description: 'Detailed national background check',
          price: 50,
          selected: false
        },
        {
          id: '4',
          name: 'TB Test Clearance',
          description: 'Proof of recent negative TB test',
          price: 250,
          selected: false
        },
        {
          id: '5',
          name: 'Gold Vetting Package',
          description: 'Includes Background Check, Drug Test, and Driving History Report',
          price: 150,
          selected: false
        }
      ];
      setVettingOptions(mockVettingOptions);
    } else if (userRole === 'nurse') {
      // Mock nurse timesheets
      const mockTimesheets: Timesheet[] = [
        {
          id: '201',
          date: '2025-05-09',
          clientName: 'Smith Family',
          totalHours: 12,
          status: 'Pending'
        },
        {
          id: '202',
          date: '2025-05-08',
          clientName: 'Johnson Clinic',
          totalHours: 8,
          status: 'Approved'
        },
        {
          id: '203',
          date: '2025-05-01',
          clientName: 'Williams Family',
          totalHours: 10,
          status: 'Paid'
        }
      ];
      setTimesheets(mockTimesheets);
    }
  }, [userRole]);

  // Calculate total vetting cost whenever options change
  useEffect(() => {
    const total = vettingOptions
      .filter(option => option.selected)
      .reduce((sum, option) => sum + option.price, 0);
    
    setTotalVettingCost(total);
  }, [vettingOptions]);

  // Countdown timer for client purchases
  useEffect(() => {
    if (userRole !== 'client' || purchases.length === 0) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const expiryDate = new Date(purchases[0].expiresAt);
      const diffTime = expiryDate.getTime() - now.getTime();
      
      if (diffTime <= 0) {
        setTimeLeft("Expired");
        return;
      }
      
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${diffDays}d ${diffHours}h ${diffMinutes}m`);
    };
    
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [purchases, userRole]);

  // Handle toggling a vetting option
  const toggleVettingOption = (id: string) => {
    setVettingOptions(prev => 
      prev.map(option => {
        // Handle special case for Gold Package which includes multiple services
        if (id === '5' && !option.selected) {
          // If selecting Gold Package, deselect drug test, driving history, and background check
          if (option.id === '5') return { ...option, selected: true };
          if (['1', '2', '3'].includes(option.id)) return { ...option, selected: false };
          return option;
        }
        
        // If selecting an individual service that's part of Gold Package, deselect Gold Package
        if (['1', '2', '3'].includes(id) && option.id === '5') {
          return { ...option, selected: false };
        }
        
        if (option.id === id) {
          return { ...option, selected: !option.selected };
        }
        return option;
      })
    );
  };

  // Handle proceeding with vetting
  const handleProceedVetting = () => {
    // In a real app, this would call an API to initiate the vetting process
    toast({
      title: "Vetting process initiated",
      description: `Selected vetting options for ${selectedNurse ? nurseSubmissions.find(n => n.id === selectedNurse)?.nurseName : ''} have been ordered.`,
    });
    
    // Update the nurse submission status
    setNurseSubmissions(prev =>
      prev.map(submission => {
        if (submission.id === selectedNurse) {
          return { ...submission, status: 'Under Review' };
        }
        return submission;
      })
    );
    
    // Reset the UI
    setShowVettingOptions(false);
    setSelectedNurse(null);
    setVettingOptions(prev => prev.map(option => ({ ...option, selected: false })));
  };

  // Handle viewing nurse options
  const handleViewNurseOptions = (nurseId: string) => {
    setSelectedNurse(nurseId);
    setShowVettingOptions(true);
    // Reset options
    setVettingOptions(prev => prev.map(option => ({ ...option, selected: false })));
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-nurse-dark border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom max-w-6xl">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {profile.first_name || 'User'}
              </h1>
              <p className="text-gray-600 mt-1">
                Dashboard • <span className="font-medium text-nurse-dark capitalize">{userRole}</span>
              </p>
            </div>
            <Button className="mt-4 md:mt-0 bg-nurse-dark hover:bg-primary-700">
              Edit Account Details
            </Button>
          </div>
          
          {/* Client-specific sections */}
          {userRole === 'client' && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-nurse-dark" />
                    Your Active Searches
                  </CardTitle>
                  <CardDescription>Track your nurse matching progress and status</CardDescription>
                </CardHeader>
                <CardContent>
                  {purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between mb-2">
                            <h3 className="text-lg font-medium">{purchase.type}</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <p className="font-medium">{purchase.status}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Purchase Date</p>
                              <p className="font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Time Remaining</p>
                              <p className="font-medium text-nurse-dark">{timeLeft}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No active searches found</p>
                      <Button className="mt-4 bg-nurse-dark hover:bg-primary-700">
                        Request a Nurse
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Nurse Submissions Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-nurse-dark" />
                    Nurse Submissions
                  </CardTitle>
                  <CardDescription>
                    Review and vet nurse candidates who match your requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {nurseSubmissions.length > 0 ? (
                    showVettingOptions ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div>
                            <h3 className="font-medium text-lg">
                              {nurseSubmissions.find(n => n.id === selectedNurse)?.nurseName}
                            </h3>
                            <p className="text-gray-600">
                              {nurseSubmissions.find(n => n.id === selectedNurse)?.specialty} • 
                              {nurseSubmissions.find(n => n.id === selectedNurse)?.experience} years experience
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            Ready for Vetting
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Select Vetting Options:</h4>
                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {vettingOptions.slice(0, 4).map((option) => (
                              <div 
                                key={option.id} 
                                className={`border rounded-lg p-4 transition-all ${
                                  option.selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                                }`}
                                onClick={() => toggleVettingOption(option.id)}
                              >
                                <div className="flex items-start">
                                  <Checkbox 
                                    id={`option-${option.id}`}
                                    checked={option.selected}
                                    onCheckedChange={() => toggleVettingOption(option.id)}
                                    className="mt-1"
                                  />
                                  <div className="ml-3">
                                    <label 
                                      htmlFor={`option-${option.id}`}
                                      className="font-medium block cursor-pointer"
                                    >
                                      {option.name}
                                    </label>
                                    <p className="text-sm text-gray-600">{option.description}</p>
                                    <p className="font-bold text-gray-800 mt-1">${option.price}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border rounded-lg p-4 mb-6 bg-amber-50 border-amber-200">
                            <div className="flex items-start">
                              <Checkbox 
                                id="option-gold"
                                checked={vettingOptions.find(o => o.id === '5')?.selected}
                                onCheckedChange={() => toggleVettingOption('5')}
                                className="mt-1"
                              />
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <label 
                                    htmlFor="option-gold"
                                    className="font-medium block cursor-pointer"
                                  >
                                    Gold Vetting Package
                                  </label>
                                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                    Save $50
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Includes Background Check, Drug Test, and Driving History Report
                                </p>
                                <p className="font-bold text-gray-800 mt-1">$150</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 text-xl font-bold">${totalVettingCost}</span>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowVettingOptions(false);
                                setSelectedNurse(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="bg-nurse-dark hover:bg-primary-700"
                              onClick={handleProceedVetting}
                              disabled={totalVettingCost === 0}
                            >
                              Proceed with Vetting
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nurse Name</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {nurseSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell className="font-medium">{submission.nurseName}</TableCell>
                              <TableCell>{submission.specialty}</TableCell>
                              <TableCell>{submission.experience} years</TableCell>
                              <TableCell>
                                <Badge className={`
                                  ${submission.status === 'New' ? 'bg-green-100 text-green-800' : 
                                    submission.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : 
                                    submission.status === 'Approved' ? 'bg-purple-100 text-purple-800' :
                                    'bg-red-100 text-red-800'}
                                `}>
                                  {submission.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {submission.status === 'New' ? (
                                  <Button 
                                    size="sm" 
                                    className="bg-nurse-dark hover:bg-primary-700"
                                    onClick={() => handleViewNurseOptions(submission.id)}
                                  >
                                    View & Vet
                                  </Button>
                                ) : submission.status === 'Under Review' ? (
                                  <Button size="sm" variant="outline">
                                    <FileCheck className="h-4 w-4 mr-1" /> Vetting in Progress
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No nurse submissions yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        We're actively searching for nurses that match your requirements
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          
          {/* Timesheet Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-nurse-dark" />
                {userRole === 'nurse' ? 'Your Timesheets' : 'Timesheets to Approve'}
              </CardTitle>
              <CardDescription>
                {userRole === 'nurse' 
                  ? 'Submit and track your working hours' 
                  : 'Review and approve nurse working hours'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userRole === 'nurse' && (
                <div className="mb-6">
                  <Button className="bg-nurse-dark hover:bg-primary-700">
                    Submit New Timesheet
                  </Button>
                </div>
              )}
              
              {timesheets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>{userRole === 'nurse' ? 'Client' : 'Nurse'}</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timesheets.map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {userRole === 'nurse' ? timesheet.clientName : timesheet.nurseName}
                        </TableCell>
                        <TableCell>{timesheet.totalHours}</TableCell>
                        <TableCell>
                          <Badge className={`
                            ${timesheet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              timesheet.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}
                          `}>
                            {timesheet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {userRole === 'client' && timesheet.status === 'Pending' && (
                            <Button size="sm" className="bg-nurse-dark hover:bg-primary-700">
                              Approve & Pay
                            </Button>
                          )}
                          {userRole === 'nurse' && timesheet.status === 'Pending' && (
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          )}
                          {timesheet.status === 'Paid' && (
                            <Button size="sm" variant="outline">
                              View Receipt
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No timesheets found</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-nurse-dark" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                  <p className="font-medium">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="font-medium">{profile.email}</p>
                </div>
                
                {userRole === 'nurse' && (
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <Separator className="mb-4" />
                    <h3 className="font-medium mb-2">RN License</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">Upload your RN license for verification</p>
                      <Button variant="outline">Upload License</Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
