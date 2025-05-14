
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, Settings, Check, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

// Interface for nurse submissions
interface NurseSubmission {
  id: string;
  nurseName: string;
  submittedDate: string;
  experience: string;
  hourlyRate: number;
  status: "New" | "Reviewing" | "Selected" | "Rejected";
  vettingAddOns: string[];
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [userRole, setUserRole] = useState<"nurse" | "client" | null>(null);
  const [nurseSubmissions, setNurseSubmissions] = useState<NurseSubmission[]>([]);
  const [selectedNurse, setSelectedNurse] = useState<NurseSubmission | null>(null);
  const [showVettingOptions, setShowVettingOptions] = useState<boolean>(false);
  
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
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
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
          nurseName: 'Sarah Johnson',
          submittedDate: '2025-05-08',
          experience: '5 years in pediatric care',
          hourlyRate: 45,
          status: 'New',
          vettingAddOns: []
        },
        {
          id: '202',
          nurseName: 'Michael Rivera',
          submittedDate: '2025-05-09',
          experience: '8 years in elder care',
          hourlyRate: 55,
          status: 'New',
          vettingAddOns: []
        }
      ];
      setNurseSubmissions(mockSubmissions);
      
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
  
  // Function to handle selecting a nurse
  const handleSelectNurse = (nurse: NurseSubmission) => {
    setSelectedNurse(nurse);
    setShowVettingOptions(true);
  };
  
  // Function to proceed to vetting options
  const goToVettingOptions = () => {
    navigate('/vetting-options');
  };
  
  // Function to finalize selection without vetting
  const finalizeSelection = (nurse: NurseSubmission) => {
    toast({
      title: "Nurse Selected!",
      description: `You've selected ${nurse.nurseName}. We'll reach out to finalize details.`,
      duration: 5000,
    });
    
    // Update nurse status in the mock data
    const updatedSubmissions = nurseSubmissions.map(n => 
      n.id === nurse.id 
        ? {...n, status: 'Selected' as 'Selected'} 
        : n.id !== nurse.id && n.status === 'New' 
          ? {...n, status: 'Rejected' as 'Rejected'} 
          : n
    );
    
    setNurseSubmissions(updatedSubmissions);
    setSelectedNurse(null);
    setShowVettingOptions(false);
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
          )}
          
          {/* Nurse Submissions Section - For Clients */}
          {userRole === 'client' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-nurse-dark" />
                  Nurse Submissions
                </CardTitle>
                <CardDescription>Review and select from available nurse candidates</CardDescription>
              </CardHeader>
              <CardContent>
                {nurseSubmissions.length > 0 ? (
                  <div className="space-y-6">
                    {nurseSubmissions.map((nurse) => (
                      <div key={nurse.id} className={`bg-white border rounded-lg shadow-sm ${nurse.status === 'Selected' ? 'border-green-500' : nurse.status === 'Rejected' ? 'opacity-50' : ''}`}>
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg mr-4">
                                {nurse.nurseName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">{nurse.nurseName}</h3>
                                <p className="text-sm text-gray-500">Submitted {new Date(nurse.submittedDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Badge className={
                              nurse.status === 'New' ? 'bg-blue-100 text-blue-800' :
                              nurse.status === 'Selected' ? 'bg-green-100 text-green-800' :
                              nurse.status === 'Rejected' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {nurse.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Experience</p>
                              <p className="font-medium">{nurse.experience}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Hourly Rate</p>
                              <p className="font-medium">${nurse.hourlyRate}/hour</p>
                            </div>
                            <div>
                              {nurse.vettingAddOns.length > 0 ? (
                                <div>
                                  <p className="text-xs text-gray-500">Vetting Add-ons</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {nurse.vettingAddOns.map((addon, index) => (
                                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <Check className="h-3 w-3 mr-1" /> {addon}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-xs text-gray-500">Vetting Add-ons</p>
                                  <p className="text-sm text-gray-400">None selected</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {nurse.status === 'New' && (
                            <div className="flex flex-col md:flex-row gap-2 mt-4">
                              <Button 
                                onClick={() => handleSelectNurse(nurse)}
                                className="bg-primary-500 hover:bg-primary-600"
                              >
                                Select This Nurse
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => goToVettingOptions()} 
                                className="text-primary-700 border-primary-300"
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Add Vetting Options First
                              </Button>
                            </div>
                          )}
                          
                          {nurse.status === 'Selected' && (
                            <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                              <div className="flex items-center text-green-700">
                                <Check className="h-5 w-5 mr-2" />
                                <p className="font-medium">
                                  Selected! We'll reach out to finalize the details.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No nurse submissions yet. We'll notify you when nurses apply.</p>
                  </div>
                )}
                
                {/* Selection confirmation dialog */}
                {selectedNurse && showVettingOptions && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Add Vetting Options?</h3>
                      <p className="mb-4 text-gray-600">
                        Would you like to add additional vetting options for {selectedNurse.nurseName} before confirming your selection?
                      </p>
                      <div className="flex flex-col md:flex-row gap-2">
                        <Button 
                          onClick={goToVettingOptions}
                          className="bg-primary-500 hover:bg-primary-600"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Add Vetting Options
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => finalizeSelection(selectedNurse)}
                          className="text-gray-700"
                        >
                          Continue Without Vetting
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setSelectedNurse(null);
                            setShowVettingOptions(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  <Link to="/vetting-options" className="text-primary-600 hover:underline">
                    Learn more about our vetting options
                  </Link>
                </p>
              </CardFooter>
            </Card>
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
