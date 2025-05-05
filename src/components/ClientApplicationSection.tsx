
import React from 'react';

export default function ClientApplicationSection() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Client Application Form</h2>
      
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Email"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Phone Number"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="nurseType" className="block text-gray-700 text-sm font-bold mb-2">
            Type of Nurse Needed:
          </label>
          <select
            id="nurseType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option>Registered Nurse (RN)</option>
            <option>Licensed Practical Nurse (LPN)</option>
            <option>Certified Nursing Assistant (CNA)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="specialty" className="block text-gray-700 text-sm font-bold mb-2">
            Specialty Needed:
          </label>
          <input
            type="text"
            id="specialty"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., Geriatric Care, Post-Surgery, etc."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
            Duration of Service:
          </label>
          <input
            type="text"
            id="duration"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 2 weeks, 3 months, ongoing"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
            Location of Service:
          </label>
          <input
            type="text"
            id="location"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="City, State"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="hoursPerWeek" className="block text-gray-700 text-sm font-bold mb-2">
            Approximate Hours Per Week:
          </label>
          <input
            type="number"
            id="hoursPerWeek"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 20, 40"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="hourlyRate" className="block text-gray-700 text-sm font-bold mb-2">
            Desired Hourly Rate:
          </label>
          <input
            type="number"
            id="hourlyRate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 45, 60"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Brief Description of Needs:
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Please describe the patient's condition and required care."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="certifications" className="block text-gray-700 text-sm font-bold mb-2">
            Additional certifications or requirements?
          </label>
          <input
            type="text"
            id="certifications"
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
