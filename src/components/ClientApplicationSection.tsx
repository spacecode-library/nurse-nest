
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import ClickwrapAgreement from './ClickwrapAgreement';

export default function ClientApplicationSection() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState(false);
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    startDate: undefined as Date | undefined,
    duration: '',
    location: '',
    hoursPerWeek: '',
    hourlyRate: 45,
    description: '',
    certifications: '',
    addOns: {
      drugTest: false,
      drivingHistory: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    if (id.startsWith('addon-')) {
      const addonName = id.replace('addon-', '');
      setFormState(prev => ({
        ...prev,
        addOns: {
          ...prev.addOns,
          [addonName]: (e.target as HTMLInputElement).checked
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormState(prev => ({
      ...prev,
      startDate: date
    }));
  };
  
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 4 && !agreed) {
      setAgreementError(true);
      return;
    }
    
    if (currentStep === 4) {
      // Calculate total price based on base fee and add-ons
      const basePrice = 1000;
      let totalPrice = basePrice;
      
      if (formState.addOns.drugTest) {
        totalPrice += 100;
      }
      
      if (formState.addOns.drivingHistory) {
        totalPrice += 50;
      }
      
      // Store form data and price in session storage for payment page
      sessionStorage.setItem('applicationData', JSON.stringify({
        formData: formState,
        pricing: {
          basePrice,
          totalPrice,
          discountApplied: true
        }
      }));
      
      // Navigate to payment success page
      navigate('/payment-success');
    } else {
      nextStep();
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full ${
                    currentStep >= step ? 'bg-nurse-dark text-white' : 'bg-gray-200 text-gray-500'
                  } flex items-center justify-center font-bold`}
                >
                  {step}
                </div>
                <div className="text-xs mt-2">{getStepName(step)}</div>
              </div>
              
              {step < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? 'bg-nurse-dark' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const getStepName = (step: number) => {
    switch (step) {
      case 1: return 'Personal Info';
      case 2: return 'Service Details';
      case 3: return 'Requirements';
      case 4: return 'Review & Pay';
      default: return '';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Client Application Form</h2>
      
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Name, Email, Phone */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Full Name:
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your Full Name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                value={formState.phone}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="(123) 456-7890"
                required
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Specialty, Start Date, Duration, Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="specialty" className="block text-gray-700 text-sm font-bold mb-2">
                Specialty Needed:
              </label>
              <input
                type="text"
                id="specialty"
                value={formState.specialty}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Night Nurse for newborn, Post-Surgery, etc."
                required
              />
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                Start Date:
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formState.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.startDate ? format(formState.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formState.startDate}
                    onSelect={handleDateChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
                Duration of Service:
              </label>
              <input
                type="text"
                id="duration"
                value={formState.duration}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., 2 weeks, 3 months, ongoing"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                Location of Service:
              </label>
              <input
                type="text"
                id="location"
                value={formState.location}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="City, State"
                required
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Hours, Hourly Rate, Description, Certifications */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="hoursPerWeek" className="block text-gray-700 text-sm font-bold mb-2">
                Approximate Hours Per Week:
              </label>
              <input
                type="number"
                id="hoursPerWeek"
                value={formState.hoursPerWeek}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., 20, 40"
                required
              />
            </div>
            
            <div>
              <label htmlFor="hourlyRate" className="block text-gray-700 text-sm font-bold mb-2">
                Nurse Hourly Rate: ${formState.hourlyRate}
              </label>
              <input
                type="range"
                id="hourlyRate"
                min="45"
                max="115"
                step="5"
                value={formState.hourlyRate}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$45</span>
                <span>$115</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Brief Description of Needs:
              </label>
              <textarea
                id="description"
                value={formState.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Please describe the patient's condition and required care."
                rows={4}
                required
              />
            </div>
            
            <div>
              <label htmlFor="certifications" className="block text-gray-700 text-sm font-bold mb-2">
                Additional certifications or requirements?
              </label>
              <input
                type="text"
                id="certifications"
                value={formState.certifications}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="example: NICU experience, covid vaccine"
              />
            </div>
          </div>
        )}
        
        {/* Step 4: Review & Payment */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review Your Application</h3>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{formState.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{formState.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{formState.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Specialty:</p>
                  <p>{formState.specialty}</p>
                </div>
                <div>
                  <p className="font-semibold">Start Date:</p>
                  <p>{formState.startDate ? format(formState.startDate, "PPP") : 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-semibold">Duration:</p>
                  <p>{formState.duration}</p>
                </div>
                <div>
                  <p className="font-semibold">Location:</p>
                  <p>{formState.location}</p>
                </div>
                <div>
                  <p className="font-semibold">Hours per week:</p>
                  <p>{formState.hoursPerWeek}</p>
                </div>
                <div>
                  <p className="font-semibold">Hourly rate:</p>
                  <p>${formState.hourlyRate}</p>
                </div>
                <div>
                  <p className="font-semibold">Certifications:</p>
                  <p>{formState.certifications || 'None specified'}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-semibold">Description of needs:</p>
                <p>{formState.description}</p>
              </div>
            </div>
            
            <div className="border-t border-b py-4 my-6">
              <h4 className="text-md font-semibold mb-2">Pricing</h4>
              <div className="flex justify-between mb-2">
                <span>Base Matching Fee:</span>
                <span>$1,000.00</span>
              </div>
              
              <div className="space-y-2 mb-2">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="addon-drugTest"
                      checked={formState.addOns.drugTest}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    10-panel drug test (+$100.00)
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="addon-drivingHistory"
                      checked={formState.addOns.drivingHistory}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Driving history report (+$50.00)
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${1000 + (formState.addOns.drugTest ? 100 : 0) + (formState.addOns.drivingHistory ? 50 : 0)}.00</span>
              </div>
            </div>
            
            <ClickwrapAgreement 
              checked={agreed}
              onCheckedChange={setAgreed}
              error={agreementError}
            />
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={prevStep}
            >
              Back
            </Button>
          )}
          
          {currentStep === 1 && <div></div>}
          
          <Button 
            type="submit"
            className="bg-primary-500 hover:bg-primary-700 text-white"
          >
            {currentStep === 4 ? 'Complete Payment' : 'Next'}
          </Button>
        </div>
      </form>
    </div>
  );
}
