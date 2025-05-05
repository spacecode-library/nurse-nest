
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientApplicationSection() {
  const navigate = useNavigate();
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    startDate: '',
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

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (id.startsWith('addon-')) {
      const addonName = id.replace('addon-', '');
      setFormState(prev => ({
        ...prev,
        addOns: {
          ...prev.addOns,
          [addonName]: checked
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    
    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Client Application Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={formState.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={formState.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone"
            value={formState.phone}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Phone Number"
            required
          />
        </div>
        
        <div className="mb-4">
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
        
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={formState.startDate}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
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
        
        <div className="mb-4">
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
        
        <div className="mb-4">
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
        
        <div className="mb-4">
          <label htmlFor="hourlyRate" className="block text-gray-700 text-sm font-bold mb-2">
            Desired Hourly Rate: ${formState.hourlyRate}
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
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Brief Description of Needs:
          </label>
          <textarea
            id="description"
            value={formState.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Please describe the patient's condition and required care."
            required
          />
        </div>
        
        <div className="mb-4">
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
        
        <div className="flex items-center justify-between">
          <button
            className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
