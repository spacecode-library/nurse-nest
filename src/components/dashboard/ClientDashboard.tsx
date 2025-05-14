
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Shield, User } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Timesheet } from "@/types/dashboard";
import TimesheetsCard from "./TimesheetsCard";
import { toast } from "@/hooks/use-toast";

interface ClientDashboardProps {
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
  };
}

export default function ClientDashboard({ profile }: ClientDashboardProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [nurseSubmissions, setNurseSubmissions] = useState([
    {
      id: '1',
      name: 'Jane Smith, RN',
      status: 'New Match',
      specialties: ['Pediatric', 'Home Care'],
      experience: '5 years',
      availability: 'Full-time',
      vetted: false,
    },
    {
      id: '2',
      name: 'Robert Johnson, LPN',
      status: 'New Match',
      specialties: ['Geriatric', 'Rehabilitation'],
      experience: '8 years',
      availability: 'Part-time',
      vetted: false,
    }
  ]);

  // Vetting add-ons from the pricing page
  const [vettingOptions, setVettingOptions] = useState([
    {
      id: 'background',
      name: 'Background Check',
      description: 'Criminal history and identity verification',
      price: 75,
      selected: false,
    },
    {
      id: 'license',
      name: 'License Verification',
      description: 'Confirm active nursing license and good standing',
      price: 50,
      selected: false,
    },
    {
      id: 'references',
      name: 'Reference Check',
      description: 'Contact and verify professional references',
      price: 100,
      selected: false,
    },
    {
      id: 'skills',
      name: 'Skills Assessment',
      description: 'Evaluate clinical knowledge and skills',
      price: 150,
      selected: false,
    }
  ]);

  // State to track which nurse's vetting modal is open
  const [activeNurseId, setActiveNurseId] = useState<string | null>(null);

  // Mock data loading - in a real app, fetch from your database
  useEffect(() => {
    // Mock client timesheets
    const mockTimesheets: Timesheet[] = [
      {
        id: '101',
        date: '2025-05-10',
        nurseName: 'Sarah Johnson',
        totalHours: 8,
        status: 'Pending'
      },
      {
        id: '102',
        date: '2025-05-09',
        nurseName: 'Michael Brown',
        totalHours: 12,
        status: 'Approved'
      },
      {
        id: '103',
        date: '2025-05-02',
        nurseName: 'Jessica Miller',
        totalHours: 10,
        status: 'Paid'
      }
    ];
    setTimesheets(mockTimesheets);
  }, []);

  const handleVettingOptionToggle = (optionId: string) => {
    setVettingOptions(vettingOptions.map(option => 
      option.id === optionId ? { ...option, selected: !option.selected } : option
    ));
  };

  const calculateTotalVettingCost = () => {
    return vettingOptions
      .filter(option => option.selected)
      .reduce((total, option) => total + option.price, 0);
  };

  const handleVettingSubmit = (nurseId: string) => {
    // In a real app, you'd submit this to your backend
    const selectedOptions = vettingOptions.filter(option => option.selected);
    
    if (selectedOptions.length === 0) {
      toast({
        title: "No options selected",
        description: "Please select at least one vetting option",
        variant: "destructive"
      });
      return;
    }
    
    // Update the nurse as being vetted
    setNurseSubmissions(nurseSubmissions.map(nurse => 
      nurse.id === nurseId ? { ...nurse, vetted: true } : nurse
    ));
    
    // Reset selections
    setVettingOptions(vettingOptions.map(option => ({ ...option, selected: false })));
    
    // Close modal
    setActiveNurseId(null);
    
    toast({
      title: "Vetting requested",
      description: "Your nurse vetting request has been submitted",
    });
  };

  return (
    <>
      {/* Nurse Submissions Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-nurse-dark" />
            Nurse Submissions
          </CardTitle>
          <CardDescription>
            Review and vet your matched nurses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nurseSubmissions.length > 0 ? (
            <div className="space-y-4">
              {nurseSubmissions.map((nurse) => (
                <div key={nurse.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="font-medium text-lg">{nurse.name}</div>
                      <div className="text-sm text-gray-500">
                        <span className="inline-flex items-center mr-3">
                          <Star className="h-3 w-3 mr-1" />
                          {nurse.experience}
                        </span>
                        <span>{nurse.availability}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {nurse.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {nurse.vetted ? (
                        <div className="flex items-center text-green-600">
                          <Shield className="h-4 w-4 mr-1" />
                          Vetting in Progress
                        </div>
                      ) : (
                        <Button 
                          className="bg-nurse-dark hover:bg-primary-700"
                          onClick={() => setActiveNurseId(nurse.id)}
                        >
                          Select Vetting Options
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No nurse matches found</p>
            </div>
          )}
          
          {/* Vetting Options Modal */}
          {activeNurseId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Select Vetting Options</h3>
                <div className="space-y-3 mb-6">
                  {vettingOptions.map((option) => (
                    <div key={option.id} className="flex items-start">
                      <input
                        type="checkbox"
                        id={option.id}
                        checked={option.selected}
                        onChange={() => handleVettingOptionToggle(option.id)}
                        className="mt-1"
                      />
                      <label htmlFor={option.id} className="ml-2">
                        <div className="font-medium">{option.name} - ${option.price}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium">Total:</div>
                  <div className="font-bold">${calculateTotalVettingCost()}</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setActiveNurseId(null)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-nurse-dark hover:bg-primary-700"
                    onClick={() => handleVettingSubmit(activeNurseId)}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Timesheets Card */}
      <TimesheetsCard timesheets={timesheets} userRole="client" />
    </>
  );
}
