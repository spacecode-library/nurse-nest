import React from 'react';
import { Heart, Shield, Clock, Users, CheckCircle, AlertTriangle, Phone, FileText, Calendar, Home } from 'lucide-react';
import NurseNestNavbar from '@/components/NurseNestNavbar';

export default function PostSurgicalCare() {
  return (
    <>
      <NurseNestNavbar isHomePage={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        
        {/* Hero Section */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Post-Surgical Care at Home: Recovery & Safety Guide
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Expert strategies for safe, effective recovery at home
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>12 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>Recovery Focused</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Quick Navigation</h3>
                    <nav className="space-y-2">
                      <a href="#understanding" className="block text-blue-600 hover:text-blue-800 transition-colors">Understanding Care</a>
                      <a href="#immediate-recovery" className="block text-blue-600 hover:text-blue-800 transition-colors">Immediate Recovery</a>
                      <a href="#wound-care" className="block text-blue-600 hover:text-blue-800 transition-colors">Wound Care</a>
                      <a href="#medication" className="block text-blue-600 hover:text-blue-800 transition-colors">Medications</a>
                      <a href="#mobility" className="block text-blue-600 hover:text-blue-800 transition-colors">Mobility</a>
                      <a href="#nutrition" className="block text-blue-600 hover:text-blue-800 transition-colors">Nutrition</a>
                      <a href="#warning-signs" className="block text-blue-600 hover:text-blue-800 transition-colors">Warning Signs</a>
                      <a href="#professional-support" className="block text-blue-600 hover:text-blue-800 transition-colors">Professional Support</a>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Main Article */}
              <div className="lg:col-span-3">
                <article className="bg-white rounded-xl shadow-lg p-8">
                  
                  {/* Introduction */}
                  <div className="mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      Post-surgical home care encompasses all aspects of recovery management outside the hospital setting. This includes wound care, pain management, medication administration, mobility assistance, and monitoring for complications.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      This guide covers everything needed for managing post-surgical recovery at home, from immediate post-operative care to long-term rehabilitation strategies.
                    </p>
                  </div>

                  {/* Understanding Post-Surgical Care */}
                  <section id="understanding" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Heart className="h-8 w-8 text-blue-600" />
                      Understanding Post-Surgical Care at Home
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Post-surgical home care encompasses all aspects of recovery management outside the hospital setting. This includes wound care, pain management, medication administration, mobility assistance, and monitoring for complications.
                    </p>

                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">Key Components</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Wound Management</h4>
                            <p className="text-gray-600 text-sm">Proper cleaning, dressing changes, infection prevention</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Pain Control</h4>
                            <p className="text-gray-600 text-sm">Medication management and comfort measures</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Activity Management</h4>
                            <p className="text-gray-600 text-sm">Gradual return to activities and therapy</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Complication Monitoring</h4>
                            <p className="text-gray-600 text-sm">Recognizing and responding to complications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Immediate Recovery Phase */}
                  <section id="immediate-recovery" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Clock className="h-8 w-8 text-purple-600" />
                      First 24-48 Hours Recovery
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      The first 24-48 hours after surgery are critical. Patients are most vulnerable to complications and require close monitoring.
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Vital Signs</h4>
                        <p className="text-gray-700">Monitor temperature, blood pressure, heart rate. Fever above 101°F requires immediate attention.</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Pain Assessment</h4>
                        <p className="text-gray-700">Use 0-10 scale. Effective pain management prevents complications like pneumonia or blood clots.</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                      <h4 className="font-semibold text-yellow-800 mb-2">Critical 48-Hour Checklist</h4>
                      <ul className="space-y-1 text-yellow-700">
                        <li>• Take vital signs every 4-6 hours</li>
                        <li>• Monitor surgical site for bleeding</li>
                        <li>• Ensure adequate pain control</li>
                        <li>• Encourage deep breathing exercises</li>
                      </ul>
                    </div>
                  </section>

                  {/* Wound Care */}
                  <section id="wound-care" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Shield className="h-8 w-8 text-green-600" />
                      Wound Care Management
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Preparation</h4>
                          <p className="text-gray-700">Wash hands thoroughly. Gather clean supplies.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Clean Wound</h4>
                          <p className="text-gray-700">Use prescribed solution, work from center outward.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-800 mb-3">Emergency Signs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-1 text-red-700">
                          <li>• Spreading redness</li>
                          <li>• Foul-smelling drainage</li>
                          <li>• Fever above 101°F</li>
                        </ul>
                        <ul className="space-y-1 text-red-700">
                          <li>• Excessive bleeding</li>
                          <li>• Increased pain</li>
                          <li>• Red streaking</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Medications */}
                  <section id="medication" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <FileText className="h-8 w-8 text-indigo-600" />
                      Medication Management
                    </h2>
                    
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-800 mb-4">Five Rights of Medication</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-2 mb-1">
                            <h5 className="font-semibold text-sm">Right Patient</h5>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-2 mb-1">
                            <h5 className="font-semibold text-sm">Right Drug</h5>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-2 mb-1">
                            <h5 className="font-semibold text-sm">Right Dose</h5>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-2 mb-1">
                            <h5 className="font-semibold text-sm">Right Time</h5>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-2 mb-1">
                            <h5 className="font-semibold text-sm">Right Route</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Mobility */}
                  <section id="mobility" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Users className="h-8 w-8 text-orange-600" />
                      Mobility & Rehabilitation
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                        <h4 className="font-semibold text-orange-800 mb-2">Stage 1: Bed Mobility (Day 1-2)</h4>
                        <p className="text-orange-700 text-sm">Deep breathing, ankle pumps, gentle movement</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                        <h4 className="font-semibold text-yellow-800 mb-2">Stage 2: Sitting/Standing (Day 2-5)</h4>
                        <p className="text-yellow-700 text-sm">Bedside sitting, chair transfers, short walks</p>
                      </div>
                    </div>
                  </section>

                  {/* Nutrition */}
                  <section id="nutrition" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Heart className="h-8 w-8 text-red-600" />
                      Nutrition for Recovery
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">P</span>
                        </div>
                        <h4 className="font-semibold text-red-800">Protein</h4>
                        <p className="text-red-700 text-sm">1.5-2g/kg daily</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">C</span>
                        </div>
                        <h4 className="font-semibold text-yellow-800">Vitamin C</h4>
                        <p className="text-yellow-700 text-sm">100-200mg daily</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">Zn</span>
                        </div>
                        <h4 className="font-semibold text-blue-800">Zinc</h4>
                        <p className="text-blue-700 text-sm">15-30mg daily</p>
                      </div>
                    </div>
                  </section>

                  {/* Warning Signs */}
                  <section id="warning-signs" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      When to Seek Help
                    </h2>
                    
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <Phone className="h-8 w-8 mx-auto mb-2" />
                          <h4 className="font-bold">Call 911</h4>
                          <p className="text-sm opacity-90">Chest pain, breathing difficulty, uncontrolled bleeding</p>
                        </div>
                        <div className="text-center">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                          <h4 className="font-bold">Contact Surgeon</h4>
                          <p className="text-sm opacity-90">Fever &gt;101°F, wound separation, severe pain</p>
                        </div>
                        <div className="text-center">
                          <Calendar className="h-8 w-8 mx-auto mb-2" />
                          <h4 className="font-bold">Same-Day Visit</h4>
                          <p className="text-sm opacity-90">Moderate swelling, constipation &gt;3 days</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Professional Support */}
                  <section id="professional-support" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Users className="h-8 w-8 text-blue-600" />
                      Professional Support Options
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6 text-center">
                        <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-blue-800 mb-2">Skilled Nursing</h3>
                        <p className="text-blue-700 text-sm">Wound care, medication management, IV therapy</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-6 text-center">
                        <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-purple-800 mb-2">Rehabilitation</h3>
                        <p className="text-purple-700 text-sm">Physical therapy, occupational therapy</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-6 text-center">
                        <Home className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-green-800 mb-2">Support Care</h3>
                        <p className="text-green-700 text-sm">Personal care, meal prep, transportation</p>
                      </div>
                    </div>
                  </section>

                  {/* Conclusion */}
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Achieving Optimal Recovery</h2>
                    <p className="text-gray-700 mb-4">
                      Successful post-surgical recovery requires careful planning, professional support when needed, and vigilant monitoring for optimal outcomes.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Important Disclaimer</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This article is for informational purposes only and does not constitute medical advice. Post-surgical care requirements vary significantly. Consult with qualified healthcare professionals before implementing any care protocol. The author assumes no responsibility for adverse outcomes from actions based on this content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
