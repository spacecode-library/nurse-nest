import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  User, 
  Home, 
  Heart, 
  CreditCard,
  FileText,
  Users,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser, completeOnboarding } from '@/supabase/auth/authService';
import { getClientProfileByUserId, createClientProfile, updateClientProfile } from '@/supabase/api/clientProfileService';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import ClickwrapAgreement from '@/components/ui/ClickwrapAgreement';

// Constants for form options
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const CLIENT_TYPES = ['individual', 'family'];
const RELATIONSHIP_OPTIONS = ['Parent', 'Spouse', 'Child', 'Sibling', 'Other'];

const CARE_TYPES = [
  'Adult Care',
  'Pediatric Care', 
  'Elderly Care',
  'Postpartum Care',
  'Post-Surgery Recovery Care',
  'Chronic Illness Management',
  'Wound Care',
  'IV Therapy',
  'Medication Management',
  'Physical Therapy Support',
  'Dementia/Alzheimer\'s Care',
  'Respite Care',
  'End-of-Life Care',
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

const HOME_ENVIRONMENTS = ['House', 'Apartment', 'Condo', 'Assisted Living', 'Other'];

// Define the onboarding steps - Updated to include Legal Agreements
const ONBOARDING_STEPS = [
  'Client Type',
  'Personal Information',
  'Care Location',
  'Care Needs',
  'Payment Info',
  'Legal Agreements',
  'Review & Submit'
];

export default function ClientOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [clientProfileId, setClientProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [careLocationId, setCareLocationId] = useState<string | null>(null);
  const [careNeedsId, setCareNeedsId] = useState<string | null>(null);
  
  // Clickwrap agreement state
  const [allAgreementsAccepted, setAllAgreementsAccepted] = useState(false);

  // Client Type (Step 0)
  const [clientType, setClientType] = useState<'individual' | 'family'>('individual');
  const [relationshipToRecipient, setRelationshipToRecipient] = useState('');

  // Personal Information (Step 1)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Care recipient info (for family clients)
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

  // Payment Info (Step 4) - Simplified for now
  const [paymentMethodAdded, setPaymentMethodAdded] = useState(false);

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
          
          // Get metadata from auth user
          const metadata = data.user.user_metadata;
          if (metadata?.first_name) setFirstName(metadata.first_name);
          if (metadata?.last_name) setLastName(metadata.last_name);
          
          const { data: profileData, error } = await getClientProfileByUserId(userId);
          
          if (profileData) {
            setClientProfileId(profileData.id);
            setClientType(profileData.client_type || 'individual');
            setFirstName(profileData.first_name || metadata?.first_name || '');
            setLastName(profileData.last_name || metadata?.last_name || '');
            setPhoneNumber(profileData.phone_number || '');
            setRelationshipToRecipient(profileData.relationship_to_recipient || '');
            
            if (!profileData.onboarding_completed) {
              const percentage = profileData.onboarding_completion_percentage;
              if (percentage >= 85) setCurrentStep(6); // Updated for 7 steps
              else if (percentage >= 71) setCurrentStep(5);
              else if (percentage >= 57) setCurrentStep(4);
              else if (percentage >= 42) setCurrentStep(3);
              else if (percentage >= 28) setCurrentStep(2);
              else if (percentage >= 14) setCurrentStep(1);
              else setCurrentStep(0);
            } else {
              navigate('/dashboard');
            }
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndProfile();
  }, [navigate]);

  const toggleCareType = (careType: string) => {
    setCareTypes(prev => 
      prev.includes(careType) 
        ? prev.filter(c => c !== careType) 
        : [...prev, careType]
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

  const updateOnboardingProgress = async (profileId: string, percentage: number, completed = false) => {
    try {
      await updateClientProfile(profileId, {
        onboarding_completion_percentage: percentage,
        onboarding_completed: completed,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) return;
    
    setSubmitting(true);
    
    try {
      const progressPercentage = calculateProgress(currentStep);
      
      switch (currentStep) {
        case 0: // Client Type
          if (!clientProfileId) {
            // Create new profile
            const { data: newProfile } = await createClientProfile({
              user_id: userId!,
              client_type: clientType,
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber || '',
              relationship_to_recipient: clientType === 'family' ? relationshipToRecipient : null,
              onboarding_completion_percentage: progressPercentage
            });
            setClientProfileId(newProfile.id);
          } else {
            // Update existing profile
            await updateClientProfile(clientProfileId, {
              client_type: clientType,
              relationship_to_recipient: clientType === 'family' ? relationshipToRecipient : null,
              onboarding_completion_percentage: progressPercentage
            });
          }
          break;

        case 1: // Personal Information
          if (!clientProfileId) throw new Error("Client profile not found");
          
          await updateClientProfile(clientProfileId, {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            onboarding_completion_percentage: progressPercentage
          });
          
          // Handle care recipient for family clients
          if (clientType === 'family') {
            const { data: existingRecipient } = await supabase
              .from('care_recipients')
              .select('id')
              .eq('client_id', clientProfileId)
              .single();
              
            if (existingRecipient) {
              await supabase
                .from('care_recipients')
                .update({
                  first_name: recipientFirstName,
                  last_name: recipientLastName,
                  age: parseInt(recipientAge),
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
                  age: parseInt(recipientAge)
                });
            }
          }
          break;

        case 2: // Care Location
          if (!clientProfileId) throw new Error("Client profile not found");
          
          const { data: existingLocation } = await supabase
            .from('care_locations')
            .select('id')
            .eq('client_id', clientProfileId)
            .single();
            
          if (existingLocation) {
            await supabase
              .from('care_locations')
              .update({
                street_address: streetAddress,
                city: city,
                state: state,
                zip_code: zipCode,
                home_environment: homeEnvironment,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingLocation.id);
            setCareLocationId(existingLocation.id);
          } else {
            const { data: newLocation } = await supabase
              .from('care_locations')
              .insert({
                client_id: clientProfileId,
                street_address: streetAddress,
                city: city,
                state: state,
                zip_code: zipCode,
                home_environment: homeEnvironment
              })
              .select('id')
              .single();
            setCareLocationId(newLocation.id);
          }
          
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;

        case 3: // Care Needs
          if (!clientProfileId) throw new Error("Client profile not found");
          
          const { data: existingNeeds } = await supabase
            .from('care_needs')
            .select('id')
            .eq('client_id', clientProfileId)
            .single();
            
          if (existingNeeds) {
            await supabase
              .from('care_needs')
              .update({
                care_types: careTypes,
                care_schedule: careSchedule,
                hours_per_week: parseInt(hoursPerWeek),
                special_skills: specialSkills,
                health_conditions: healthConditions,
                additional_notes: additionalNotes,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingNeeds.id);
            setCareNeedsId(existingNeeds.id);
          } else {
            const { data: newNeeds } = await supabase
              .from('care_needs')
              .insert({
                client_id: clientProfileId,
                care_types: careTypes,
                care_schedule: careSchedule,
                hours_per_week: parseInt(hoursPerWeek),
                special_skills: specialSkills,
                health_conditions: healthConditions,
                additional_notes: additionalNotes
              })
              .select('id')
              .single();
            setCareNeedsId(newNeeds.id);
          }
          
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;

        case 4: // Payment Info
          if (!clientProfileId) throw new Error("Client profile not found");
          // For now, just mark as completed - payment integration would go here
          setPaymentMethodAdded(true);
          await updateOnboardingProgress(clientProfileId, progressPercentage);
          break;

        case 5: // Legal Agreements
          if (!clientProfileId) throw new Error("Client profile not found");
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
      case 0:
        if (clientType === 'family' && !relationshipToRecipient) {
          toast({
            title: "Required field missing",
            description: "Please specify your relationship to the care recipient",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 1:
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
            title: "Care recipient information required",
            description: "Please provide care recipient details",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 2:
        if (!streetAddress || !city || !state || !zipCode || !homeEnvironment) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all care location fields",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 3:
        if (careTypes.length === 0 || careSchedule.length === 0 || !hoursPerWeek || 
            specialSkills.length === 0 || healthConditions.length === 0) {
          toast({
            title: "Required fields missing",
            description: "Please fill out all care needs information",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 4:
        // Payment validation would go here
        return true;

      case 5: // Legal Agreements step
        if (!allAgreementsAccepted) {
          toast({
            title: "Legal agreements required",
            description: "Please accept all legal agreements to continue",
            variant: "destructive"
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() || !allAgreementsAccepted || !userId || !clientProfileId) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await updateOnboardingProgress(clientProfileId, 100, true);
      
      // Complete onboarding in auth metadata
      await completeOnboarding();
      
      toast({
        title: "🎉 Profile completed!",
        description: "Your profile has been successfully created. You can now start posting care needs and finding nurses.",
        variant: "default"
      });
      
      // Redirect to dashboard
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
      <div className="min-h-screen flex flex-col bg-medical-gradient-primary">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full shadow-medical-soft mx-auto flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-medical-primary border-t-transparent rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-6 w-6 text-medical-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-medical-text-primary">Loading your profile...</h3>
              <p className="text-medical-text-secondary">Setting up your care profile</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-medical-gradient-primary">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-text-primary via-medical-primary to-medical-accent bg-clip-text text-transparent mb-4">
                Client Care Profile Setup
              </h1>
              <p className="text-xl text-medical-text-secondary max-w-2xl mx-auto">
                Tell us about your care needs so we can connect you with the perfect nursing professional
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {ONBOARDING_STEPS.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      currentStep === index 
                        ? 'bg-medical-primary border-medical-primary text-white shadow-medical-elevated' 
                        : currentStep > index 
                          ? 'bg-medical-success border-medical-success text-white' 
                          : 'bg-white border-medical-border text-medical-text-muted'
                    }`}>
                      {currentStep > index ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center px-2 transition-colors duration-300 ${
                      currentStep >= index ? 'text-medical-text-primary font-medium' : 'text-medical-text-muted'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-medical-neutral-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-medical-primary to-medical-accent h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${calculateProgress(currentStep)}%` }}
                ></div>
              </div>
              <div className="text-right mt-2">
                <span className="text-sm text-medical-text-secondary font-medium">
                  {calculateProgress(currentStep)}% Complete
                </span>
              </div>
            </div>

            {/* Main Form Card */}
            <Card className="shadow-medical-elevated border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Step 0: Client Type */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-accent rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Client Type</h2>
                        <p className="text-medical-text-secondary">Let us know who needs care</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-medical-text-primary font-medium">
                          Who needs care? *
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            clientType === 'individual' 
                              ? 'border-medical-primary bg-medical-primary/5' 
                              : 'border-medical-border hover:border-medical-primary/50'
                          }`}>
                            <input
                              type="radio"
                              name="clientType"
                              value="individual"
                              checked={clientType === 'individual'}
                              onChange={(e) => setClientType(e.target.value as 'individual' | 'family')}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <User className="h-12 w-12 mx-auto mb-3 text-medical-primary" />
                              <h3 className="text-lg font-semibold text-medical-text-primary mb-2">Individual</h3>
                              <p className="text-sm text-medical-text-secondary">I need care for myself</p>
                            </div>
                          </label>

                          <label className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            clientType === 'family' 
                              ? 'border-medical-primary bg-medical-primary/5' 
                              : 'border-medical-border hover:border-medical-primary/50'
                          }`}>
                            <input
                              type="radio"
                              name="clientType"
                              value="family"
                              checked={clientType === 'family'}
                              onChange={(e) => setClientType(e.target.value as 'individual' | 'family')}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <Users className="h-12 w-12 mx-auto mb-3 text-medical-primary" />
                              <h3 className="text-lg font-semibold text-medical-text-primary mb-2">Family Member</h3>
                              <p className="text-sm text-medical-text-secondary">I need care for a family member</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {clientType === 'family' && (
                        <div className="space-y-2">
                          <Label htmlFor="relationship" className="text-medical-text-primary font-medium">
                            Your relationship to the care recipient *
                          </Label>
                          <select
                            id="relationship"
                            value={relationshipToRecipient}
                            onChange={(e) => setRelationshipToRecipient(e.target.value)}
                            className="w-full h-11 px-3 border border-medical-border focus:border-medical-primary rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-medical-primary/20"
                            required
                          >
                            <option value="">Select relationship</option>
                            {RELATIONSHIP_OPTIONS.map(relationship => (
                              <option key={relationship} value={relationship}>{relationship}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-accent rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Personal Information</h2>
                        <p className="text-medical-text-secondary">Your contact information</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Client Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-medical-text-primary mb-4">Your Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-medical-text-primary font-medium">
                              First Name *
                            </Label>
                            <Input
                              id="firstName"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                              required
                              placeholder="Your first name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-medical-text-primary font-medium">
                              Last Name *
                            </Label>
                            <Input
                              id="lastName"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                              required
                              placeholder="Your last name"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="phoneNumber" className="text-medical-text-primary font-medium">
                              Phone Number *
                            </Label>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                              required
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Care Recipient Information (for family clients) */}
                      {clientType === 'family' && (
                        <div>
                          <h3 className="text-lg font-semibold text-medical-text-primary mb-4">Care Recipient Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientFirstName" className="text-medical-text-primary font-medium">
                                First Name *
                              </Label>
                              <Input
                                id="recipientFirstName"
                                type="text"
                                value={recipientFirstName}
                                onChange={(e) => setRecipientFirstName(e.target.value)}
                                className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                                required
                                placeholder="Recipient's first name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="recipientLastName" className="text-medical-text-primary font-medium">
                                Last Name *
                              </Label>
                              <Input
                                id="recipientLastName"
                                type="text"
                                value={recipientLastName}
                                onChange={(e) => setRecipientLastName(e.target.value)}
                                className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                                required
                                placeholder="Recipient's last name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="recipientAge" className="text-medical-text-primary font-medium">
                                Age *
                              </Label>
                              <Input
                                id="recipientAge"
                                type="number"
                                value={recipientAge}
                                onChange={(e) => setRecipientAge(e.target.value)}
                                className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                                required
                                min="0"
                                max="120"
                                placeholder="Age"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Care Location */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-accent rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Care Location</h2>
                        <p className="text-medical-text-secondary">Where will care be provided?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="streetAddress" className="text-medical-text-primary font-medium">
                          Street Address *
                        </Label>
                        <Input
                          id="streetAddress"
                          type="text"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                          required
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-medical-text-primary font-medium">
                          City *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                          required
                          placeholder="Your city"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-medical-text-primary font-medium">
                          State *
                        </Label>
                        <select
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full h-11 px-3 border border-medical-border focus:border-medical-primary rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-medical-primary/20"
                          required
                        >
                          <option value="">Select State</option>
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-medical-text-primary font-medium">
                          ZIP Code *
                        </Label>
                        <Input
                          id="zipCode"
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white"
                          required
                          placeholder="12345"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="homeEnvironment" className="text-medical-text-primary font-medium">
                          Home Environment *
                        </Label>
                        <select
                          id="homeEnvironment"
                          value={homeEnvironment}
                          onChange={(e) => setHomeEnvironment(e.target.value)}
                          className="w-full h-11 px-3 border border-medical-border focus:border-medical-primary rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-medical-primary/20"
                          required
                        >
                          <option value="">Select environment</option>
                          {HOME_ENVIRONMENTS.map(env => (
                            <option key={env} value={env}>{env}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Care Needs */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-accent rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Care Needs</h2>
                        <p className="text-medical-text-secondary">Tell us about the specific care requirements</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Care Types */}
                      <div className="space-y-4">
                        <Label className="text-medical-text-primary font-medium">
                          Type of Care Needed * (Select all that apply)
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {CARE_TYPES.map(careType => (
                            <label key={careType} className="flex items-center space-x-3 p-3 border border-medical-border rounded-lg hover:bg-medical-neutral-50 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={careTypes.includes(careType)}
                                onChange={() => toggleCareType(careType)}
                                className="rounded border-medical-border text-medical-primary focus:ring-medical-primary/20"
                              />
                              <span className="text-sm text-medical-text-primary">{careType}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Care Schedule */}
                      <div className="space-y-4">
                        <Label className="text-medical-text-primary font-medium">
                          Preferred Schedule * (Select all that apply)
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {CARE_SCHEDULES.map(schedule => (
                            <label key={schedule} className="flex items-center space-x-3 p-3 border border-medical-border rounded-lg hover:bg-medical-neutral-50 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={careSchedule.includes(schedule)}
                                onChange={() => toggleCareSchedule(schedule)}
                                className="rounded border-medical-border text-medical-primary focus:ring-medical-primary/20"
                              />
                              <span className="text-sm text-medical-text-primary">{schedule}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Hours per week */}
                      <div className="space-y-2">
                        <Label htmlFor="hoursPerWeek" className="text-medical-text-primary font-medium">
                          Hours per Week *
                        </Label>
                        <Input
                          id="hoursPerWeek"
                          type="number"
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(e.target.value)}
                          className="h-11 border-medical-border focus:border-medical-primary rounded-lg bg-white max-w-xs"
                          required
                          min="1"
                          max="168"
                          placeholder="Hours needed per week"
                        />
                      </div>

                      {/* Special Skills */}
                      <div className="space-y-4">
                        <Label className="text-medical-text-primary font-medium">
                          Special Skills Required * (Select all that apply)
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {SPECIAL_SKILLS.map(skill => (
                            <label key={skill} className="flex items-center space-x-3 p-3 border border-medical-border rounded-lg hover:bg-medical-neutral-50 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={specialSkills.includes(skill)}
                                onChange={() => toggleSpecialSkill(skill)}
                                className="rounded border-medical-border text-medical-primary focus:ring-medical-primary/20"
                              />
                              <span className="text-sm text-medical-text-primary">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Health Conditions */}
                      <div className="space-y-4">
                        <Label className="text-medical-text-primary font-medium">
                          Health Conditions * (Select all that apply)
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {HEALTH_CONDITIONS.map(condition => (
                            <label key={condition} className="flex items-center space-x-3 p-3 border border-medical-border rounded-lg hover:bg-medical-neutral-50 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={healthConditions.includes(condition)}
                                onChange={() => toggleHealthCondition(condition)}
                                className="rounded border-medical-border text-medical-primary focus:ring-medical-primary/20"
                              />
                              <span className="text-sm text-medical-text-primary">{condition}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="additionalNotes" className="text-medical-text-primary font-medium">
                          Additional Notes (Optional)
                        </Label>
                        <textarea
                          id="additionalNotes"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          className="w-full h-32 p-3 border border-medical-border focus:border-medical-primary rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-medical-primary/20 resize-none"
                          placeholder="Any additional information about care needs, preferences, or special requirements..."
                          maxLength={500}
                        />
                        <p className="text-xs text-medical-text-muted text-right">{additionalNotes.length}/500 characters</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment Info */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-accent rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Payment Information</h2>
                        <p className="text-medical-text-secondary">Set up your payment method for care services</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-medical-info/10 border border-medical-info/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <CreditCard className="h-5 w-5 text-medical-info mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-medical-info mb-1">Secure Payment Setup</p>
                            <p className="text-medical-text-secondary">
                              Your payment information is securely processed through our payment partner. 
                              You'll only be charged for approved services after they're completed.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center py-8">
                        <CreditCard className="h-16 w-16 mx-auto text-medical-text-muted mb-4" />
                        <h3 className="text-lg font-semibold text-medical-text-primary mb-2">Payment Method Setup</h3>
                        <p className="text-medical-text-secondary mb-6">
                          Payment integration will be set up here. For now, you can continue with your profile setup.
                        </p>
                        <Button
                          type="button"
                          onClick={() => setPaymentMethodAdded(true)}
                          className="bg-gradient-to-r from-medical-primary to-medical-accent text-white"
                        >
                          Continue Setup Later
                        </Button>
                      </div>

                      {paymentMethodAdded && (
                        <div className="flex items-center space-x-2 p-3 bg-medical-success/10 border border-medical-success/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-medical-success" />
                          <span className="text-sm text-medical-success font-medium">
                            Payment setup marked for completion
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Legal Agreements */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-accent rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Legal Agreements</h2>
                        <p className="text-medical-text-secondary">Please review and accept our terms to continue</p>
                      </div>
                    </div>

                    <ClickwrapAgreement 
                      userType="client" 
                      onAllAccepted={setAllAgreementsAccepted}
                    />
                  </div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-success to-medical-accent rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-medical-text-primary">Review & Submit</h2>
                        <p className="text-medical-text-secondary">Review your care profile before submitting</p>
                      </div>
                    </div>

                    <div className="p-4 bg-medical-info/10 border border-medical-info/20 rounded-lg mb-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-medical-info mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-medical-info mb-1">Almost there!</p>
                          <p className="text-medical-text-secondary">
                            Please review your information before final submission. You can go back to previous steps to make changes if needed.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-medical-text-primary">Client Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Client Type:</span> {clientType}</p>
                          {clientType === 'family' && (
                            <p><span className="font-medium">Relationship:</span> {relationshipToRecipient}</p>
                          )}
                          <p><span className="font-medium">Name:</span> {firstName} {lastName}</p>
                          <p><span className="font-medium">Phone:</span> {phoneNumber}</p>
                        </div>
                        
                        {clientType === 'family' && (
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Care Recipient</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {recipientFirstName} {recipientLastName}</p>
                              <p><span className="font-medium">Age:</span> {recipientAge}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-medical-text-primary">Care Location</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Address:</span> {streetAddress}</p>
                          <p><span className="font-medium">City:</span> {city}, {state} {zipCode}</p>
                          <p><span className="font-medium">Environment:</span> {homeEnvironment}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-medical-text-primary">Care Needs</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Care Types:</span> {careTypes.slice(0, 3).join(', ')}{careTypes.length > 3 && '...'}</p>
                          <p><span className="font-medium">Schedule:</span> {careSchedule.slice(0, 2).join(', ')}{careSchedule.length > 2 && '...'}</p>
                          <p><span className="font-medium">Hours/Week:</span> {hoursPerWeek}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-medical-text-primary">Requirements</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Special Skills:</span> {specialSkills.slice(0, 2).join(', ')}{specialSkills.length > 2 && '...'}</p>
                          <p><span className="font-medium">Health Conditions:</span> {healthConditions.slice(0, 2).join(', ')}{healthConditions.length > 2 && '...'}</p>
                          <p><span className="font-medium">Agreements:</span> {allAgreementsAccepted ? 'Accepted' : 'Pending'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Final confirmation */}
                    <div className="p-4 bg-medical-warning/10 border border-medical-warning/20 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-medical-warning mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-medical-warning mb-1">Final Confirmation</p>
                          <p className="text-medical-text-secondary">
                            By submitting this profile, I confirm that all information provided is accurate and complete. 
                            I understand that I can start posting care needs and connecting with qualified nurses immediately after submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6 px-8 pb-8 bg-medical-neutral-50 border-t border-medical-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 0 ? () => navigate('/dashboard') : prevStep}
                  disabled={submitting}
                  className="border-medical-border hover:border-medical-primary hover:bg-medical-primary/5"
                >
                  {currentStep === 0 ? 'Cancel' : 'Previous'}
                </Button>
                
                {currentStep < ONBOARDING_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={submitting}
                    className="bg-gradient-to-r from-medical-primary to-medical-accent hover:shadow-medical-elevated text-white min-w-[120px]"
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
                    disabled={submitting || !allAgreementsAccepted}
                    className="bg-gradient-to-r from-medical-success to-medical-accent hover:shadow-medical-elevated text-white min-w-[160px]"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <div className="text-center mt-8">
              <p className="text-sm text-medical-text-secondary">
                Need help with your profile setup? Contact our support team at{' '}
                <a href="mailto:support@nursenest.com" className="text-medical-primary hover:text-medical-primary-dark">
                  support@nursenest.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}