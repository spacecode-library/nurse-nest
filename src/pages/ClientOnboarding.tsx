import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/supabase/auth/authService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClientProfile, getClientProfileByUserId, updateClientProfile, updateOnboardingProgress } from '@/supabase/api/clientProfileService';
import { addCareLocation, getCareLocations, updateCareLocation } from '@/supabase/api/careLocationService';
import { addCareNeeds, getCareNeeds, updateCareNeeds } from '@/supabase/api/careNeedsService';
import { supabase } from '@/integrations/supabase/client';

// Constants for form options
const CLIENT_TYPES = [
  'individual',
  'family'
];

const RELATIONSHIP_TYPES = [
  'Parent',
  'Child',
  'Spouse',
  'Sibling',
  'Other Family Member',
  'Guardian',
  'Caretaker'
];

const HOME_ENVIRONMENTS = [
  'House',
  'Apartment',
  'Assisted Living Facility',
  'Nursing Home',
  'Rehabilitation Center',
  'Other'
];

const CARE_TYPES = [
  'Adult Care',
  'Pediatric Care',
  'Newborn Night Nurse',
  'Post-Partum Care',
  'Elderly Care', 
  'Dementia/Alzheimer\'s Care',
  'Medication Management',
  'Diabetes Management',
  'Respiratory Care (Oxygen/Tracheostomy Management)',
  'IV Therapy',
  'Feeding Tube Management',
  'Wound Care',
  'Post-Surgical Care',
  'Stroke Recovery Care',
  'Catheter Care',
  'Ostomy Care',
  'Hospice/Palliative Care',
  'ADL Care (Activities of Daily Living)',
  'Rehabilitation',
  'Special Needs Care'
];

const CARE_SCHEDULES = [
  'Day Shift',
  'Night Shift',
  'Evening Shift',
  'Weekend',
  'Weekday',
  '24/7 Care',
  '12-Hour Shifts',
  '8-Hour Shifts'
];

const SPECIAL_SKILLS = [
  'IV Therapy',
  'Wound Care',
  'Ventilator Management',
  'Tracheostomy Care',
  'Feeding Tube Management',
  'Medication Administration',
  'Dementia Care',
  'Pediatric Experience',
  'Neonatal Experience',
  'Physical Therapy',
  'Occupational Therapy',
  'Oxygen Therapy',
  'Catheter Care',
  'Ostomy Care',
  'Diabetes Management',
  'Stroke Recovery Care',
  'Hospice/Palliative Care',
  'ADL Assistance'
];

const HEALTH_CONDITIONS = [
  'Diabetes',
  'Hypertension', 
  'COPD',
  'Stroke Recovery',
  'Heart Disease',
  'Alzheimer\'s/Dementia',
  'Cancer',
  'Parkinson\'s Disease',
  'Mobility Issues',
  'Post-Surgery',
  'Developmental Disability',
  'Mental Health Condition',
  'Premature Infant',
  'Respiratory Conditions',
  'Feeding Difficulties',
  'Catheter/Ostomy Needs',
  'End-of-Life Care'
];

// Define the onboarding steps
const ONBOARDING_STEPS = [
  'Client Type',
  'Personal Information',
  'Care Location',
  'Care Needs',
  'Payment Info',
  'Review & Submit'
];

export default function ClientOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [clientProfileId, setClientProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [careLocationId, setCareLocationId] = useState<string | null>(null);
  const [careNeedsId, setCareNeedsId] = useState<string | null>(null);

  // Client Type (Step 0)
  const [clientType, setClientType] = useState<string>('individual');
  const [relationshipToRecipient, setRelationshipToRecipient] = useState('');

  // Personal Information (Step 1)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  // Care Recipient (conditional for family type)
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientAge, setRecipientAge] = useState('');

  // Care Location (Step 2)
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [homeEnvironment, setHomeEnvironment] = useState('');

  // Care Needs (Step 3)
  const [careTypes, setCareTypes] = useState<string[]>([]);
  const [careSchedule, setCareSchedule] = useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [specialSkills, setSpecialSkills] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Payment (Step 4)
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [billingAddress, setBillingAddress] = useState('');
  const [sameAsHome, setSameAsHome] = useState(true);

  // Calculate onboarding progress percentage
  const calculateProgress = (step: number): number => {
    const stepPercentage = 100 / ONBOARDING_STEPS.length;
    return Math.round(stepPercentage * (step + 1));
  };

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          const userId = data.user.id;
          setUserId(userId);
          
          const { data: profileData, error } = await getClientProfileByUserId(userId);
          
          if (profileData) {
            setClientProfileId(profileData.id);
            setClientType(profileData.client_type || 'individual');
            setRelationshipToRecipient(profileData.relationship_to_recipient || '');
            setFirstName(profileData.first_name || '');
            setLastName(profileData.last_name || '');
            setPhoneNumber(profileData.phone_number || '');
            
            if (!profileData.onboarding_completed) {
              const percentage = profileData.onboarding_completion_percentage;
              if (percentage >= 80) setCurrentStep(5);
              else if (percentage >= 60) setCurrentStep(4);
              else if (percentage >= 40) setCurrentStep(3);
              else if (percentage >= 20) setCurrentStep(2);
              else if (percentage >= 10) setCurrentStep(1);
              else setCurrentStep(0);
              
              // Fetch care recipient if client type is family
              if (profileData.client_type === 'family') {
                const { data: recipientData } = await supabase
                  .from('care_recipients')
                  .select('*')
                  .eq('client_id', profileData.id)
                  .single();
                  
                if (recipientData) {
                  setRecipientFirstName(recipientData.first_name || '');
                  setRecipientLastName(recipientData.last_name || '');
                  setRecipientAge(recipientData.age?.toString() || '');
                }
              }
              
              // Fetch care location if we're at step 2 or beyond
              if (percentage >= 20) {
                const { data: locationData } = await supabase
                  .from('care_locations')
                  .select('*')
                  .eq('client_id', profileData.id)
                  .single();
                  
                if (locationData) {
                  setCareLocationId(locationData.id);
                  setStreetAddress(locationData.street_address || '');
                  setCity(locationData.city || '');
                  setState(locationData.state || '');
                  setZipCode(locationData.zip_code || '');
                  setHomeEnvironment(locationData.home_environment || '');
                }
              }
              
              // Fetch care needs if we're at step 3 or beyond
              if (percentage >= 40) {
                const { data: needsData } = await supabase
                  .from('care_needs')
                  .select('*')
                  .eq('client_id', profileData.id)
                  .single();
                  
                if (needsData) {
                  setCareNeedsId(needsData.id);
                  setCareTypes(needsData.care_types || []);
                  setCareSchedule(needsData.care_schedule || []);
                  setHoursPerWeek(needsData.hours_per_week?.toString() || '');
                  setSpecialSkills(needsData.special_skills || []);
                  setHealthConditions(needsData.health_conditions || []);
                  setAdditionalNotes(needsData.additional_notes || '');
                }
              }
              
              // Fetch payment info if we're at step 4 or beyond
              if (percentage >= 60) {
                // In a real implementation, we'd fetch payment data
                // For now we'll simulate with default values
                setPaymentMethod('credit_card');
                setSameAsHome(true);
                if (streetAddress) {
                  setBillingAddress(streetAddress + ', ' + city + ', ' + state + ' ' + zipCode);
                }
              }
            }
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndProfile();
  }, [navigate]);

  useEffect(() => {
    // Update billing address when sameAsHome changes or home address changes
    if (sameAsHome && streetAddress) {
      setBillingAddress(streetAddress + ', ' + city + ', ' + state + ' ' + zipCode);
    } else if (sameAsHome) {
      setBillingAddress('');
    }
  }, [sameAsHome, streetAddress, city, state, zipCode]);

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const progressPercentage = calculateProgress(currentStep);
      
      switch (currentStep) {
        case 0: // Client Type
          if (clientProfileId) {
            await updateClientProfile(clientProfileId, {
              client_type: clientType as any,
              relationship_to_recipient: clientType === 'family' ? relationshipToRecipient : null
            });
            await updateOnboardingProgress(clientProfileId, progressPercentage);
          } else if (userId) {
            const { data, error } = await createClientProfile({
              user_id: userId,
              client_type: clientType as "individual" | "family",
              first_name: firstName || '', // Default empty string to satisfy required field
              last_name: lastName || '',   // Default empty string to satisfy required field
              phone_number: phoneNumber || '', // Default empty string to satisfy required field
              relationship_to_recipient: clientType === 'family' ? relationshipToRecipient : null,
              onboarding_completed: false,
              onboarding_completion_percentage: progressPercentage
            });
            
            if (error) throw error;
            if (data) {
              setClientProfileId(data.id);
            }
          }
          break;
          
        case 1: // Personal Information
          if (!clientProfileId) throw new Error("Client profile not found");
          
          // Update client profile
          await updateClientProfile(clientProfileId, {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber
          });
          
          // If family type, create or update care recipient
          if (clientType === 'family') {
            const { data: existingRecipient } = await supabase
              .from('care_recipients')
              .select('id')
              .eq('client_id', clientProfileId)
              .maybeSingle();
              
            if (existingRecipient?.id) {
              await supabase
                .from('care_recipients')
                .update({
                  first_name: recipientFirstName,
                  last_name: recipientLastName,
                  age: parseInt(recipientAge) || 0,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existingRecipient.id);
            } else {
              await supabase
                .from('care_recipients')
                .insert({
                  client_id: clientProfileId,
                  first_name: recipientFirstName,
                  last_name: recipientLastName,
                  age: parseInt(recipientAge) || 0
                });
            }
          }
          
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;
          
        case 2: // Care Location
          if (!clientProfileId) throw new Error("Client profile not found");
          
          if (careLocationId) {
            await updateCareLocation(careLocationId, {
              street_address: streetAddress,
              city: city,
              state: state,
              zip_code: zipCode,
              home_environment: homeEnvironment
            });
          } else {
            const { data } = await addCareLocation({
              client_id: clientProfileId,
              street_address: streetAddress,
              city: city,
              state: state,
              zip_code: zipCode,
              home_environment: homeEnvironment
            });
            
            if (data) {
              setCareLocationId(data.id);
            }
          }
          
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;
          
        case 3: // Care Needs
          if (!clientProfileId) throw new Error("Client profile not found");
          
          if (careNeedsId) {
            await updateCareNeeds(careNeedsId, {
              care_types: careTypes,
              care_schedule: careSchedule,
              hours_per_week: parseInt(hoursPerWeek) || 0,
              special_skills: specialSkills,
              health_conditions: healthConditions,
              additional_notes: additionalNotes
            });
          } else {
            const { data } = await addCareNeeds({
              client_id: clientProfileId,
              care_types: careTypes,
              care_schedule: careSchedule,
              hours_per_week: parseInt(hoursPerWeek) || 0,
              special_skills: specialSkills,
              health_conditions: healthConditions,
              additional_notes: additionalNotes
            });
            
            if (data) {
              setCareNeedsId(data.id);
            }
          }
          
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;
          
        case 4: // Payment Information
          if (!clientProfileId) throw new Error("Client profile not found");
          
          // In a real implementation, we'd save payment data
          // Since we're not using Stripe as mentioned, we'll just update progress
          
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      
      toast({
        title: "Progress saved",
        description: `Successfully saved your ${ONBOARDING_STEPS[currentStep]} information`,
        variant: "default"
      });
      
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Error saving data",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Client Type
        if (clientType === 'family' && !relationshipToRecipient) {
          toast({
            title: "Required field missing",
            description: "Please specify your relationship to the care recipient",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 1: // Personal Information
        if (!firstName || !lastName || !phoneNumber) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all required fields",
            variant: "destructive"
          });
          return false;
        }
        
        if (clientType === 'family' && (!recipientFirstName || !recipientLastName || !recipientAge)) {
          toast({
            title: "Care recipient information missing",
            description: "Please complete the care recipient's information",
            variant: "destructive"
          });
          return false;
        }
        
        return true;
      
      case 2: // Care Location
        if (!streetAddress || !city || !state || !zipCode || !homeEnvironment) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all required fields for the care location",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 3: // Care Needs
        if (careTypes.length === 0 || careSchedule.length === 0 || !hoursPerWeek) {
          toast({
            title: "Required fields missing",
            description: "Please select care types, care schedule, and hours per week",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 4: // Payment Information
        if (!paymentMethod) {
          toast({
            title: "Required field missing",
            description: "Please select a payment method",
            variant: "destructive"
          });
          return false;
        }
        
        if (!sameAsHome && !billingAddress) {
          toast({
            title: "Billing address missing",
            description: "Please provide a billing address",
            variant: "destructive"
          });
          return false;
        }
        
        return true;
      
      default:
        return true;
    }
  };

  const toggleCareType = (type: string) => {
    setCareTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const toggleCareSchedule = (schedule: string) => {
    setCareSchedule(prev => 
      prev.includes(schedule) 
        ? prev.filter(s => s !== schedule) 
        : [...prev, schedule]
    );
  };

  const toggleSpecialSkill = (skill: string) => {
    setSpecialSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() || !termsAccepted || !userId || !clientProfileId) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await updateOnboardingProgress(clientProfileId, 100, true);
      
      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully submitted.",
        variant: "default"
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error submitting profile:', error);
      toast({
        title: "Profile submission failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Client Onboarding</h1>
            <p className="text-gray-600 mb-8 text-center">Complete your profile to find the perfect care provider</p>
            
            <div className="mb-8">
              <div className="flex justify-between">
                {ONBOARDING_STEPS.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                      currentStep === index 
                        ? 'bg-primary-600 text-white border-primary-600'
                        : currentStep > index
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-400 border-gray-300'
                    }`}>
                      {currentStep > index ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      currentStep === index ? 'text-primary-600 font-medium' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
                <div 
                  className="absolute top-0 left-0 h-1 bg-primary-600 transition-all duration-300"
                  style={{ width: `${(currentStep / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="clientType">I am seeking care as a: <span className="text-red-500">*</span></Label>
                      <RadioGroup value={clientType} onValueChange={setClientType}>
                        <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                          <RadioGroupItem value="individual" id="individual" />
                          <Label htmlFor="individual" className="flex-1 cursor-pointer">
                            <div className="font-medium">Individual</div>
                            <div className="text-sm text-gray-500">I'm seeking care for myself</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                          <RadioGroupItem value="family" id="family" />
                          <Label htmlFor="family" className="flex-1 cursor-pointer">
                            <div className="font-medium">Family Member</div>
                            <div className="text-sm text-gray-500">I'm seeking care for a family member</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {clientType === 'family' && (
                      <div className="space-y-3 p-4 bg-blue-50 border border-blue-100 rounded-md">
                        <Label htmlFor="relationshipToRecipient">
                          Your relationship to the care recipient: <span className="text-red-500">*</span>
                        </Label>
                        <Select value={relationshipToRecipient} onValueChange={setRelationshipToRecipient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {RELATIONSHIP_TYPES.map(relation => (
                              <SelectItem key={relation} value={relation}>{relation}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex">
                        <HelpCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Why we need this information</p>
                          <p>We use this to personalize your experience and ensure we match you with the right care provider.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Your first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Your last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        disabled // Email should come from auth
                      />
                      <p className="text-xs text-gray-500">This is the email address you registered with</p>
                    </div>
                    
                    {clientType === 'family' && (
                      <>
                        <div className="border-t pt-6 mt-6">
                          <h3 className="font-medium text-lg mb-4">Care Recipient Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientFirstName">First Name <span className="text-red-500">*</span></Label>
                              <Input
                                id="recipientFirstName"
                                value={recipientFirstName}
                                onChange={(e) => setRecipientFirstName(e.target.value)}
                                placeholder="Care recipient's first name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientLastName">Last Name <span className="text-red-500">*</span></Label>
                              <Input
                                id="recipientLastName"
                                value={recipientLastName}
                                onChange={(e) => setRecipientLastName(e.target.value)}
                                placeholder="Care recipient's last name"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <Label htmlFor="recipientAge">Age <span className="text-red-500">*</span></Label>
                            <Input
                              id="recipientAge"
                              type="number"
                              min="0"
                              max="120"
                              value={recipientAge}
                              onChange={(e) => setRecipientAge(e.target.value)}
                              placeholder="Care recipient's age"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="streetAddress"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></Label>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP Code"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="homeEnvironment">Home Environment <span className="text-red-500">*</span></Label>
                      <Select value={homeEnvironment} onValueChange={setHomeEnvironment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home environment" />
                        </SelectTrigger>
                        <SelectContent>
                          {HOME_ENVIRONMENTS.map(env => (
                            <SelectItem key={env} value={env}>{env}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">This helps us match care providers familiar with your environment</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Privacy Notice</p>
                          <p>Your address information will be shared only with matched care providers once you approve them.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Type of Care Needed <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {CARE_TYPES.map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`type-${type}`}
                              checked={careTypes.includes(type)}
                              onCheckedChange={() => toggleCareType(type)}
                            />
                            <Label 
                              htmlFor={`type-${type}`}
                              className="text-sm cursor-pointer"
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Care Schedule <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {CARE_SCHEDULES.map(schedule => (
                          <div key={schedule} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`schedule-${schedule}`}
                              checked={careSchedule.includes(schedule)}
                              onCheckedChange={() => toggleCareSchedule(schedule)}
                            />
                            <Label 
                              htmlFor={`schedule-${schedule}`}
                              className="text-sm cursor-pointer"
                            >
                              {schedule}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hoursPerWeek">Hours of Care Needed Per Week <span className="text-red-500">*</span></Label>
                      <Input
                        id="hoursPerWeek"
                        type="number"
                        min="1"
                        max="168"
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(e.target.value)}
                        placeholder="Hours per week"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Required Special Skills</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {SPECIAL_SKILLS.map(skill => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`skill-${skill}`}
                              checked={specialSkills.includes(skill)}
                              onCheckedChange={() => toggleSpecialSkill(skill)}
                            />
                            <Label 
                              htmlFor={`skill-${skill}`}
                              className="text-sm cursor-pointer"
                            >
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Health Conditions</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {HEALTH_CONDITIONS.map(condition => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`condition-${condition}`}
                              checked={healthConditions.includes(condition)}
                              onCheckedChange={() => toggleHealthCondition(condition)}
                            />
                            <Label 
                              htmlFor={`condition-${condition}`}
                              className="text-sm cursor-pointer"
                            >
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Care Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Any specific requirements or additional information about care needs..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                )}
                
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md mb-6">
                      <div className="flex">
                        <HelpCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Payment Information</p>
                          <p>We securely store your payment method to simplify the payment process. You will only be charged when you approve and receive nursing services.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="paymentMethod">Preferred Payment Method <span className="text-red-500">*</span></Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, American Express, Discover</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                          <RadioGroupItem value="bank_account" id="bank_account" />
                          <Label htmlFor="bank_account" className="flex-1 cursor-pointer">
                            <div className="font-medium">Bank Account (ACH)</div>
                            <div className="text-sm text-gray-500">Direct from your checking account</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sameAsHome"
                          checked={sameAsHome}
                          onCheckedChange={(checked) => setSameAsHome(!!checked)}
                        />
                        <Label 
                          htmlFor="sameAsHome"
                          className="text-sm cursor-pointer"
                        >
                          Billing address is the same as care location
                        </Label>
                      </div>
                      
                      {!sameAsHome && (
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="billingAddress">Billing Address <span className="text-red-500">*</span></Label>
                          <Textarea
                            id="billingAddress"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            placeholder="Enter your billing address"
                            required
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium mb-3">Payment Process</h3>
                      <p className="text-sm text-gray-600 mb-2">Here's how payments work:</p>
                      <ol className="text-sm text-gray-600 space-y-2 pl-5 list-decimal">
                        <li>Nurse Nest holds a 15% platform fee</li>
                        <li>Your matched nurse is paid the remaining 85% directly</li>
                        <li>You will approve all timesheets before payment is processed</li>
                        <li>Invoices are generated weekly based on approved time</li>
                      </ol>
                    </div>
                  </div>
                )}
                
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-6">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Almost there!</p>
                          <p>Please review your information before final submission. You can go back to previous steps to make changes if needed.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Client Information</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Client Type</p>
                            <p className="font-medium capitalize">{clientType}</p>
                          </div>
                          {clientType === 'family' && (
                            <div>
                              <p className="text-sm text-gray-500">Relationship</p>
                              <p className="font-medium">{relationshipToRecipient}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{firstName} {lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{phoneNumber || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        {clientType === 'family' && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="font-medium mb-2">Care Recipient</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{recipientFirstName} {recipientLastName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Age</p>
                                <p className="font-medium">{recipientAge}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Care Location</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                              {streetAddress ? `${streetAddress}, ${city}, ${state} ${zipCode}` : 'Not provided'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Home Environment</p>
                            <p className="font-medium">{homeEnvironment || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Care Needs</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Types of Care</p>
                            <p className="font-medium">
                              {careTypes.length > 0 
                                ? careTypes.join(', ') 
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Care Schedule</p>
                            <p className="font-medium">
                              {careSchedule.length > 0 
                                ? careSchedule.join(', ') 
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Hours Per Week</p>
                            <p className="font-medium">{hoursPerWeek || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Required Skills</p>
                            <p className="font-medium">
                              {specialSkills.length > 0 
                                ? specialSkills.join(', ') 
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Health Conditions</p>
                            <p className="font-medium">
                              {healthConditions.length > 0 
                                ? healthConditions.join(', ') 
                                : 'None selected'}
                            </p>
                          </div>
                          {additionalNotes && (
                            <div>
                              <p className="text-sm text-gray-500">Additional Notes</p>
                              <p className="font-medium">{additionalNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Payment Information</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium">
                              {paymentMethod === 'credit_card' 
                                ? 'Credit/Debit Card' 
                                : 'Bank Account (ACH)'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Billing Address</p>
                            <p className="font-medium">{billingAddress || 'Same as care location'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-6 border-t pt-6">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => {
                            setTermsAccepted(checked === true);
                          }}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I confirm that all information provided is accurate and complete. I understand the payment structure and agree to Nurse Nest's <span className="text-primary-600 cursor-pointer">Terms of Service</span> and <span className="text-primary-600 cursor-pointer">Privacy Policy</span>.
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 0 ? () => navigate('/dashboard') : prevStep}
                  disabled={submitting}
                >
                  {currentStep === 0 ? 'Cancel' : 'Previous'}
                </Button>
                
                {currentStep < ONBOARDING_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={submitting || !termsAccepted}
                    className="min-w-[120px]"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      'Complete Profile'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <div className="max-w-3xl mx-auto mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help with your profile setup? <span className="text-primary-600 cursor-pointer hover:underline">Contact support</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}