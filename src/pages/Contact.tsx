
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send the form data to your backend
    console.log('Form submitted:', formState);
    setFormSubmitted(true);
    
    // Reset form after submission
    setFormState({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Contact <span className="text-nurse-dark">Nurse Nest</span>
          </h1>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-700 mb-6">
              We're here to assist you! At Nurse Nest, we value your inquiries and are committed to providing prompt, personalized responses. As a dedicated small business, we strive to respond to all messages within one business day.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 text-nurse-dark mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email:</p>
                      <a 
                        href="mailto:contact@nursenest.us" 
                        className="text-nurse-dark hover:underline"
                      >
                        contact@nursenest.us
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-nurse-dark mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Phone:</p>
                      <a 
                        href="tel:+14259543381" 
                        className="text-nurse-dark hover:underline"
                      >
                        (425) 954-3381
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-medium mb-4">Our Commitment</h3>
                  <p className="text-gray-600">
                    As a dedicated small business, we strive to respond to all messages within one business day. Your questions and concerns are important to us!
                  </p>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6">Contact Form</h2>
                
                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
                    Thank you for your message! We'll get back to you within one business day.
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-nurse-dark"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-nurse-dark"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-nurse-dark"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-nurse-dark"
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="bg-nurse-dark hover:bg-primary-700 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
