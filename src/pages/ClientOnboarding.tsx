import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, User, Heart, MapPin, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser, completeOnboarding } from '@/supabase/auth/authService';
import { getClientProfileByUserId, createClientProfile, updateClientProfile } from '@/supabase/api/clientProfileService';
import { supabase } from '@/integrations/supabase/client';

// Types
interface OnboardingStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Client Information",
    icon: <User className="h-5 w-5" />,
    description: "Tell us about yourself"
  },
  {
    id: 2,
    title: "Care Recipient",
    icon: <Heart className="h-5 w-5" />,
    description: "Who needs care?"
  },
  {
    id: 3,
    title: "Care Needs",
    icon: <Clock className="h-5 w-5" />,
    description: "What type of care is needed?"
  },
  {
    id: 4,
    title: "Care Location",
    icon: <MapPin className="h-5 w-5" />,
    description: "Where will care be provided?"
  },
  {
    id: 5,
    title: "Review & Submit",
    icon: <CheckCircle className="h-5 w-5" />,
    description: "Review your information"
  }
];

export default function ClientOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [clientProfileId, setClientProfileId] = useState<string>('');

  // Step 1: Client Information
  const [clientType, setClientType] = useState<'individual' | 'family'>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [relationshipToRecipient, setRelationshipToRecipient] = useState('');

  // Step 2: Care Recipient
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientAge, setRecipientAge] = useState('');

  // Step 3: Care Needs
  const [careTypes, setCareTypes] = useState<string[]>([]);
  const [careSchedule, setCareSchedule] = useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [specialSkills, setSpecialSkills] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 4: Care Location
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [homeEnvironment, setHomeEnvironment] = useState('');

  // Step 5: Review
  const [allAgreementsAccepted, setAllAgreementsAccepted] = useState(false);

  // Data for dropdowns
  const relationshipOptions = ['Parent', 'Spouse', 'Child', 'Sibling', 'Other'];
  const careTypeOptions = ['Adult', 'Pediatric', 'Elderly', 'Postpartum'];
  const careScheduleOptions = ['Day', 'Night', 'Weekend', '24/7'];
  const specialSkillsOptions = ['IV Therapy', 'Wound Care', 'Ventilator Care', 'Dementia Care', 'Medication Management', 'Physical Therapy Support'];
  const healthConditionsOptions = ['Diabetes', 'Alzheimer\'s', 'Heart Disease', 'Mobility Issues', 'Post-Surgery Recovery', 'Chronic Pain'];
  const homeEnvironmentOptions = ['House', 'Apartment', 'Assisted Living', 'Nursing Home'];
  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Load existing user data and profile
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data } = await getCurrentUser();
        if (!data?.user) {
          navigate('/auth');
          return;
        }

        const userId = data.user.id;
        setUserId(userId);
        
        // Get metadata from auth user
        const metadata = data.user.user_metadata;
        if (metadata?.first_name) setFirstName(metadata.first_name);
        if (metadata?.last_name) setLastName(metadata.last_name);
        setEmail(data.user.email || '');
        
        const { data: profileData, error } = await getClientProfileByUserId(userId);
        
        if (profileData) {
          setClientProfileId(profileData.id);
          setClientType(profileData.client_type || 'individual');
          setFirstName(profileData.first_name || metadata?.first_name || '');
          setLastName(profileData.last_name || metadata?.last_name || '');
          setPhoneNumber(profileData.phone_number || '');
          setEmail(profileData.email || data.user.email || '');
          setRelationshipToRecipient(profileData.relationship_to_recipient || '');
          
          if (!profileData.onboarding_completed) {
            const percentage = profileData.onboarding_completion_percentage || 0;
            const stepIndex = Math.floor((percentage / 100) * ONBOARDING_STEPS.length);
            setCurrentStep(Math.min(stepIndex, ONBOARDING_STEPS.length - 1));
          } else {
            // If already completed, redirect to dashboard
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [navigate]);

  const updateOnboardingProgress = async (profileId: string, percentage: number, completed: boolean = false) => {
    await updateClientProfile(profileId, {
      onboarding_completion_percentage: percentage,
      onboarding_completed: completed,
      updated_at: new Date().toISOString()
    });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Client Information
        if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !email.trim()) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return false;
        }
        if (clientType === 'family' && !relationshipToRecipient) {
          toast({
            title: "Relationship Required",
            description: "Please specify your relationship to the care recipient.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 1: // Care Recipient
        if (clientType === 'family') {
          if (!recipientFirstName.trim() || !recipientLastName.trim() || !recipientAge) {
            toast({
              title: "Care Recipient Information Required",
              description: "Please provide information about the care recipient.",
              variant: "destructive"
            });
            return false;
          }
        }
        break;
      case 2: // Care Needs
        if (!careTypes.length || !careSchedule.length || !hoursPerWeek || !specialSkills.length || !healthConditions.length) {
          toast({
            title: "Care Needs Required",
            description: "Please specify the care needs and requirements.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3: // Care Location
        if (!streetAddress.trim() || !city.trim() || !state || !zipCode.trim() || !homeEnvironment) {
          toast({
            title: "Location Information Required",
            description: "Please provide the care location details.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 4: // Review & Submit
        if (!allAgreementsAccepted) {
          toast({
            title: "Agreement Required",
            description: "Please accept the terms and conditions to proceed.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

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

  const nextStep = async () => {
    if (!validateCurrentStep()) return;
    
    setSubmitting(true);
    try {
      const progressPercentage = Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100);
      
      if (currentStep === 0) {
        // Save client information
        const profileData = {
          user_id: userId,
          client_type: clientType,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email: email,
          relationship_to_recipient: clientType === 'family' ? relationshipToRecipient : null,
          onboarding_completion_percentage: progressPercentage
        };

        if (clientProfileId) {
          await updateClientProfile(clientProfileId, profileData);
        } else {
          const { data: newProfile } = await createClientProfile(profileData);
          setClientProfileId(newProfile.id);
        }
      } else if (currentStep === 1) {
        // Save care recipient information
        if (clientProfileId) {
          await updateClientProfile(clientProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          if (clientType === 'family') {
            // Save care recipient data
            await supabase.from('care_recipients').upsert({
              client_id: clientProfileId,
              first_name: recipientFirstName,
              last_name: recipientLastName,
              age: parseInt(recipientAge)
            });
          }
        }
      } else if (currentStep === 2) {
        // Save care needs
        if (clientProfileId) {
          await updateClientProfile(clientProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          await supabase.from('care_needs').upsert({
            client_id: clientProfileId,
            care_types: careTypes,
            care_schedule: careSchedule,
            hours_per_week: parseInt(hoursPerWeek),
            special_skills: specialSkills,
            health_conditions: healthConditions,
            additional_notes: additionalNotes
          });
        }
      } else if (currentStep === 3) {
        // Save care location
        if (clientProfileId) {
          await updateClientProfile(clientProfileId, {
            onboarding_completion_percentage: progressPercentage
          });

          await supabase.from('care_locations').upsert({
            client_id: clientProfileId,
            street_address: streetAddress,
            city: city,
            state: state,
            zip_code: zipCode,
            home_environment: homeEnvironment
          });
        }
      } else if (currentStep === 4) {
        // Complete onboarding
        if (clientProfileId) {
          await updateClientProfile(clientProfileId, {
            onboarding_completion_percentage: 100,
            onboarding_completed: true
          });

          // Update user metadata to mark onboarding as complete with active status (clients don't need approval)
          await completeOnboarding('client');

          toast({
            title: "Profile Complete!",
            description: "Welcome to Nurse Nest! You can now access your dashboard and start posting jobs.",
            variant: "default"
          });

          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving step data:', error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">Client Registration</h1>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {ONBOARDING_STEPS.length}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-2">
              {ONBOARDING_STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center space-y-1 ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {ONBOARDING_STEPS[currentStep].icon}
              <span>{ONBOARDING_STEPS[currentStep].title}</span>
            </CardTitle>
            <p className="text-gray-600">{ONBOARDING_STEPS[currentStep].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: Client Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <Label>I am seeking care for: *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <Card 
                      className={`cursor-pointer border-2 transition-all ${
                        clientType === 'individual' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setClientType('individual')}
                    >
                      <CardContent className="p-4 text-center">
                        <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold">Myself</h3>
                        <p className="text-sm text-gray-600 mt-1">I need care for myself</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer border-2 transition-all ${
                        clientType === 'family' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setClientType('family')}
                    >
                      <CardContent className="p-4 text-center">
                        <Heart className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-semibold">Family Member</h3>
                        <p className="text-sm text-gray-600 mt-1">I need care for a loved one</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {clientType === 'family' && (
                  <div>
                    <Label htmlFor="relationshipToRecipient">Relationship to Care Recipient *</Label>
                    <Select value={relationshipToRecipient} onValueChange={setRelationshipToRecipient} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map(relationship => (
                          <SelectItem key={relationship} value={relationship}>{relationship}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Care Recipient */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {clientType === 'individual' ? (
                  <div className="text-center py-8">
                    <User className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      You are the care recipient
                    </h3>
                    <p className="text-gray-600">
                      Since you're seeking care for yourself, we'll use your information from the previous step.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Heart className="h-12 w-12 mx-auto text-green-600 mb-3" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Tell us about your loved one
                      </h3>
                      <p className="text-gray-600">
                        Please provide information about the person who will be receiving care.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="recipientFirstName">Care Recipient First Name *</Label>
                        <Input
                          id="recipientFirstName"
                          value={recipientFirstName}
                          onChange={(e) => setRecipientFirstName(e.target.value)}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipientLastName">Care Recipient Last Name *</Label>
                        <Input
                          id="recipientLastName"
                          value={recipientLastName}
                          onChange={(e) => setRecipientLastName(e.target.value)}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="recipientAge">Age *</Label>
                      <Input
                        id="recipientAge"
                        type="number"
                        min="0"
                        max="120"
                        value={recipientAge}
                        onChange={(e) => setRecipientAge(e.target.value)}
                        placeholder="Enter age"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Care Needs */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Type of Care Needed *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {careTypeOptions.map(careType => (
                      <div key={careType} className="flex items-center space-x-2">
                        <Checkbox
                          id={careType}
                          checked={careTypes.includes(careType)}
                          onCheckedChange={() => toggleCareType(careType)}
                        />
                        <Label htmlFor={careType} className="text-sm">{careType}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Care Schedule *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {careScheduleOptions.map(schedule => (
                      <div key={schedule} className="flex items-center space-x-2">
                        <Checkbox
                          id={schedule}
                          checked={careSchedule.includes(schedule)}
                          onCheckedChange={() => toggleCareSchedule(schedule)}
                        />
                        <Label htmlFor={schedule} className="text-sm">{schedule}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="hoursPerWeek">Hours per Week *</Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    min="1"
                    max="168"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    placeholder="40"
                    required
                  />
                </div>

                <div>
                  <Label>Special Skills Required *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {specialSkillsOptions.map(skill => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={specialSkills.includes(skill)}
                          onCheckedChange={() => toggleSpecialSkill(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Health Conditions *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {healthConditionsOptions.map(condition => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={healthConditions.includes(condition)}
                          onCheckedChange={() => toggleHealthCondition(condition)}
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional information about care needs, preferences, or special requirements..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Care Location */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input
                    id="streetAddress"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={state} onValueChange={setState} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateOptions.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="homeEnvironment">Home Environment *</Label>
                  <Select value={homeEnvironment} onValueChange={setHomeEnvironment} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select home environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {homeEnvironmentOptions.map(env => (
                        <SelectItem key={env} value={env}>{env}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-4">Profile Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                      <p><strong>Name:</strong> {firstName} {lastName}</p>
                      <p><strong>Phone:</strong> {phoneNumber}</p>
                      <p><strong>Email:</strong> {email}</p>
                      {clientType === 'family' && (
                        <p><strong>Relationship:</strong> {relationshipToRecipient}</p>
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Care Recipient</h5>
                      {clientType === 'individual' ? (
                        <p>Self-care</p>
                      ) : (
                        <>
                          <p><strong>Name:</strong> {recipientFirstName} {recipientLastName}</p>
                          <p><strong>Age:</strong> {recipientAge}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Care Requirements</h5>
                      <p><strong>Type:</strong> {careTypes.join(', ')}</p>
                      <p><strong>Schedule:</strong> {careSchedule.join(', ')}</p>
                      <p><strong>Hours/Week:</strong> {hoursPerWeek}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Location</h5>
                      <p><strong>Address:</strong> {streetAddress}</p>
                      <p><strong>City:</strong> {city}, {state} {zipCode}</p>
                      <p><strong>Environment:</strong> {homeEnvironment}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Special Skills Needed</h5>
                    <div className="flex flex-wrap gap-1">
                      {specialSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Health Conditions</h5>
                    <div className="flex flex-wrap gap-1">
                      {healthConditions.map(condition => (
                        <Badge key={condition} variant="outline" className="text-xs">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">What Happens Next?</h4>
                  <div className="text-sm text-green-800 space-y-2">
                    <p>1. Your profile will be activated immediately</p>
                    <p>2. You can start posting job opportunities for nurses</p>
                    <p>3. Qualified nurses will apply to your postings</p>
                    <p>4. You can review applications and hire the best fit</p>
                    <p>5. Payment methods can be set up later in your dashboard</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreement"
                    checked={allAgreementsAccepted}
                    onCheckedChange={setAllAgreementsAccepted}
                    required
                  />
                  <Label htmlFor="agreement" className="text-sm">
                    I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and 
                    <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a> *
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <Button
                type="button"
                onClick={nextStep}
                disabled={submitting}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Profile' : 'Next'}</span>
                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}