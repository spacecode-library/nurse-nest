
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Send, Check } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the form data to a server
    console.log("Form submitted:", formData);
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact Nurse Nest</h1>
            <p className="text-gray-600 mb-8 text-center">
              We're here to assist you! At Nurse Nest, we value your inquiries and are committed to providing prompt, personalized responses. As a dedicated small business, we strive to respond to all messages within one business day.
            </p>
            
            <div className="bg-white shadow-md rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a href="mailto:contact@nursenest.us" className="text-primary-500 hover:underline">
                      contact@nursenest.us
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a href="tel:4259543381" className="text-primary-500 hover:underline">
                      (425) 954-3381
                    </a>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below, and we'll get back to you within one business day.
              </p>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message*</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We'll get back to you within one business day.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
