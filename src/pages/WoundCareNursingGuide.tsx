
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WoundCareNursingGuide() {
  return (
    <>
      <Helmet>
        <title>Wound Care Nursing Guide | Expert Care for Healing</title>
        <meta
          name="description"
          content="Comprehensive wound care nursing guide covering assessment, treatment, and healing protocols for optimal patient outcomes."
        />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Professional Wound Care Nursing
                </h1>
                <p className="text-xl mb-8">
                  Expert wound assessment, treatment, and healing protocols for optimal patient recovery
                </p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                
                {/* Wound Assessment */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Comprehensive Wound Assessment
                  </h2>
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <p className="text-gray-700 mb-6">
                      Proper wound assessment is the foundation of effective wound care. Our nurses are trained in:
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Visual inspection and documentation
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Measurement and staging protocols
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Pain assessment and management
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Infection monitoring and prevention
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Progress tracking and reporting
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Treatment Protocols */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Advanced Treatment Protocols
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Chronic Wound Care
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Pressure ulcer management</li>
                        <li>• Diabetic wound care</li>
                        <li>• Venous ulcer treatment</li>
                        <li>• Arterial wound care</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Acute Wound Management
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Surgical site care</li>
                        <li>• Trauma wound treatment</li>
                        <li>• Burn care protocols</li>
                        <li>• Emergency wound response</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Specialized Equipment */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Specialized Equipment & Techniques
                  </h2>
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Advanced Dressings
                        </h4>
                        <p className="text-gray-700 text-sm">
                          Hydrocolloid, foam, alginate, and silver-based dressings
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Negative Pressure
                        </h4>
                        <p className="text-gray-700 text-sm">
                          VAC therapy setup and monitoring
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Compression Therapy
                        </h4>
                        <p className="text-gray-700 text-sm">
                          Multi-layer bandaging and compression systems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Education */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Patient & Family Education
                  </h2>
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <p className="text-gray-700 mb-4">
                      Education is crucial for successful wound healing. Our nurses provide comprehensive training on:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <ul className="space-y-2 text-gray-700">
                        <li>• Proper wound cleaning techniques</li>
                        <li>• Dressing change procedures</li>
                        <li>• Signs of infection to watch for</li>
                        <li>• Nutrition for wound healing</li>
                      </ul>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Activity modifications</li>
                        <li>• When to contact healthcare providers</li>
                        <li>• Medication management</li>
                        <li>• Prevention strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-blue-50 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Need Expert Wound Care?
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Our certified wound care nurses provide specialized treatment and education for optimal healing outcomes.
                  </p>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Request Wound Care Services
                  </button>
                </div>

              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
