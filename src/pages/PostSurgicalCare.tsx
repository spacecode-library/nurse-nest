
import React from 'react';
import NurseNestNavbar from '@/components/NurseNestNavbar';
import { Heart, Shield, Clock, Users, CheckCircle, AlertTriangle, Phone, FileText, Calendar, Home } from 'lucide-react';

export default function PostSurgicalCare() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <NurseNestNavbar isHomePage={false} />
        
        {/* Hero Section */}
        <div className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Complete Guide to Post-Surgical Care at Home: Recovery, Safety & Professional Support
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Expert strategies for safe, effective recovery in the comfort of your home environment
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>15 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>Recovery Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Safety First</span>
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
                      <a href="#understanding-post-surgical-care" className="block text-blue-600 hover:text-blue-800 transition-colors">Understanding Post-Surgical Care</a>
                      <a href="#immediate-recovery-phase" className="block text-blue-600 hover:text-blue-800 transition-colors">Immediate Recovery Phase</a>
                      <a href="#wound-care-management" className="block text-blue-600 hover:text-blue-800 transition-colors">Wound Care Management</a>
                      <a href="#medication-management" className="block text-blue-600 hover:text-blue-800 transition-colors">Medication Management</a>
                      <a href="#mobility-rehabilitation" className="block text-blue-600 hover:text-blue-800 transition-colors">Mobility & Rehabilitation</a>
                      <a href="#nutrition-recovery" className="block text-blue-600 hover:text-blue-800 transition-colors">Nutrition for Recovery</a>
                      <a href="#complications-warning-signs" className="block text-blue-600 hover:text-blue-800 transition-colors">Warning Signs</a>
                      <a href="#professional-support" className="block text-blue-600 hover:text-blue-800 transition-colors">Professional Support</a>
                    </nav>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-800 mb-2">Related Resources</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/newborn-nurse-support-guide" className="text-purple-600 hover:text-purple-800">Newborn Care Support</a></li>
                      <li><a href="/blog/home-health-aide-services" className="text-purple-600 hover:text-purple-800">Home Health Services</a></li>
                      <li><a href="/blog/medication-management-elderly" className="text-purple-600 hover:text-purple-800">Medication Management</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Main Article */}
              <div className="lg:col-span-3">
                <article className="bg-white rounded-xl shadow-lg p-8">
                  
                  {/* Introduction */}
                  <div className="mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      Post-surgical care at home has become increasingly common as healthcare systems focus on reducing hospital stays while maintaining quality patient outcomes. Whether you're recovering from minor outpatient surgery or a major procedure, proper home care is crucial for optimal healing, complication prevention, and successful recovery.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      This comprehensive guide covers everything you need to know about managing post-surgical recovery at home, from immediate post-operative care to long-term rehabilitation strategies. We'll explore professional support options, safety protocols, and evidence-based practices that ensure the best possible outcomes for surgical patients recovering in home environments.
                    </p>
                  </div>

                  {/* Understanding Post-Surgical Care */}
                  <section id="understanding-post-surgical-care" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Heart className="h-8 w-8 text-blue-600" />
                      Understanding Post-Surgical Care at Home
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Post-surgical home care encompasses all aspects of recovery management that occur outside the hospital setting. This includes wound care, pain management, medication administration, mobility assistance, and monitoring for potential complications. The transition from hospital to home requires careful planning and often involves multiple healthcare professionals working together to ensure continuity of care.
                    </p>

                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">Key Components of Home Surgical Recovery</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Wound Management</h4>
                            <p className="text-gray-600 text-sm">Proper cleaning, dressing changes, and infection prevention</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Pain Control</h4>
                            <p className="text-gray-600 text-sm">Medication management and non-pharmacological comfort measures</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Activity Management</h4>
                            <p className="text-gray-600 text-sm">Gradual return to daily activities and physical therapy</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Complication Monitoring</h4>
                            <p className="text-gray-600 text-sm">Recognizing and responding to potential post-surgical complications</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Benefits of Home-Based Recovery</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Research consistently shows that patients who recover at home experience better outcomes when proper support systems are in place. Home recovery offers familiar surroundings, reduced risk of hospital-acquired infections, improved sleep quality, and often faster return to normal activities. Family involvement in care also tends to be higher, which can significantly impact emotional well-being and recovery motivation.
                    </p>
                  </section>

                  {/* Immediate Recovery Phase */}
                  <section id="immediate-recovery-phase" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Clock className="h-8 w-8 text-purple-600" />
                      The Immediate Post-Surgical Recovery Phase (First 24-48 Hours)
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      The first 24 to 48 hours after surgery are critical for establishing a safe recovery pattern at home. During this period, patients are most vulnerable to complications and require close monitoring. Professional nursing support during this phase can make the difference between smooth recovery and potential complications requiring readmission.
                    </p>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Essential Monitoring Parameters</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Vital Signs Monitoring</h4>
                        <p className="text-gray-700">Temperature, blood pressure, heart rate, and respiratory rate should be monitored according to your surgeon's instructions. Fever above 101°F (38.3°C) or significant changes in vital signs warrant immediate medical attention.</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Pain Assessment</h4>
                        <p className="text-gray-700">Pain levels should be assessed regularly using a 0-10 scale. Effective pain management is crucial for proper healing and prevents complications such as pneumonia from shallow breathing or blood clots from immobility.</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Surgical Site Assessment</h4>
                        <p className="text-gray-700">Regular inspection of the surgical site for signs of bleeding, drainage, swelling, or infection. Documentation of any changes helps healthcare providers make informed decisions about care modifications.</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">Critical First 48 Hours Checklist</h4>
                          <ul className="space-y-2 text-yellow-700">
                            <li>• Take vital signs every 4-6 hours or as directed</li>
                            <li>• Monitor surgical site for bleeding or unusual drainage</li>
                            <li>• Ensure adequate pain control without oversedation</li>
                            <li>• Maintain proper positioning to prevent complications</li>
                            <li>• Encourage deep breathing and gentle movement as allowed</li>
                            <li>• Monitor fluid intake and urination patterns</li>
                            <li>• Watch for signs of allergic reactions to medications</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Wound Care Management */}
                  <section id="wound-care-management" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Shield className="h-8 w-8 text-green-600" />
                      Professional Wound Care Management
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Proper wound care is fundamental to successful surgical recovery and preventing infections that could lead to serious complications. Different types of surgical wounds require specific care protocols, and understanding these differences is crucial for optimal healing outcomes.
                    </p>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Types of Surgical Wounds and Care Requirements</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-800 mb-3">Clean Surgical Wounds</h4>
                        <p className="text-green-700 text-sm mb-3">Examples: Joint replacements, hernia repairs, appendectomies</p>
                        <ul className="space-y-1 text-green-700 text-sm">
                          <li>• Usually closed with sutures, staples, or surgical glue</li>
                          <li>• May require daily dressing changes initially</li>
                          <li>• Should show steady healing without drainage</li>
                          <li>• Risk of infection is relatively low (2-5%)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-800 mb-3">Complex Surgical Wounds</h4>
                        <p className="text-blue-700 text-sm mb-3">Examples: Abdominal surgeries, cardiac procedures, organ transplants</p>
                        <ul className="space-y-1 text-blue-700 text-sm">
                          <li>• May have drains or specialized closure methods</li>
                          <li>• Require more frequent monitoring and care</li>
                          <li>• Higher risk of complications</li>
                          <li>• Often need professional nursing oversight</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Step-by-Step Wound Care Protocol</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Preparation</h4>
                          <p className="text-gray-700">Wash hands thoroughly with soap and water for at least 20 seconds. Gather all necessary supplies including clean dressings, tape, normal saline or prescribed cleaning solution, and clean gloves.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Remove Old Dressing</h4>
                          <p className="text-gray-700">Carefully remove the old dressing, noting any drainage amount, color, or odor. If the dressing sticks to the wound, moisten it with normal saline before removal to prevent tissue damage.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Clean the Wound</h4>
                          <p className="text-gray-700">Clean the wound and surrounding skin with prescribed solution or normal saline, working from the cleanest area (the wound center) outward. Never reuse cleaning materials or go back over already cleaned areas.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Apply New Dressing</h4>
                          <p className="text-gray-700">Apply the appropriate dressing as instructed by your healthcare provider. Ensure the dressing extends beyond the wound edges and is secured properly without being too tight or too loose.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Signs Requiring Immediate Medical Attention
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-red-700">
                          <li>• Increased redness extending beyond wound edges</li>
                          <li>• Pus or foul-smelling drainage</li>
                          <li>• Fever above 101°F (38.3°C)</li>
                          <li>• Wound edges separating (dehiscence)</li>
                        </ul>
                        <ul className="space-y-2 text-red-700">
                          <li>• Excessive bleeding or drainage</li>
                          <li>• Increased pain despite proper medication</li>
                          <li>• Red streaking from the wound site</li>
                          <li>• Swelling that continues to worsen</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Medication Management */}
                  <section id="medication-management" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <FileText className="h-8 w-8 text-indigo-600" />
                      Comprehensive Medication Management
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Post-surgical medication management involves more than just pain control. Patients often receive multiple medications including antibiotics, anti-inflammatory drugs, blood thinners, and other specialized medications depending on their procedure. Proper medication management prevents complications and supports optimal healing.
                    </p>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Common Post-Surgical Medications</h3>
                    
                    <div className="space-y-6 mb-8">
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-800 mb-3">Pain Management Medications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-purple-700 mb-2">Opioid Medications</h5>
                            <p className="text-purple-600 text-sm mb-2">Used for moderate to severe pain</p>
                            <ul className="space-y-1 text-purple-600 text-sm">
                              <li>• Take exactly as prescribed</li>
                              <li>• Monitor for side effects (nausea, constipation)</li>
                              <li>• Avoid alcohol and driving</li>
                              <li>• Taper gradually as directed</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-purple-700 mb-2">Non-Opioid Alternatives</h5>
                            <p className="text-purple-600 text-sm mb-2">Acetaminophen, NSAIDs, topical treatments</p>
                            <ul className="space-y-1 text-purple-600 text-sm">
                              <li>• Often used in combination with opioids</li>
                              <li>• May help reduce opioid requirements</li>
                              <li>• Consider contraindications</li>
                              <li>• Monitor for effectiveness</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-800 mb-3">Antibiotic Therapy</h4>
                        <p className="text-green-700 mb-3">Prescribed to prevent or treat infections</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <h5 className="font-medium text-green-700 mb-1">Complete Course</h5>
                            <p className="text-green-600 text-sm">Take all prescribed antibiotics even if feeling better</p>
                          </div>
                          <div className="text-center">
                            <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                              <Clock className="h-6 w-6" />
                            </div>
                            <h5 className="font-medium text-green-700 mb-1">Timing Matters</h5>
                            <p className="text-green-600 text-sm">Take at evenly spaced intervals as directed</p>
                          </div>
                          <div className="text-center">
                            <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                              <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h5 className="font-medium text-green-700 mb-1">Watch for Reactions</h5>
                            <p className="text-green-600 text-sm">Monitor for allergic reactions or side effects</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Medication Safety Protocols</h3>
                    
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-blue-800 mb-4">The Five Rights of Medication Administration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-3 mb-2">
                            <h5 className="font-semibold">Right Patient</h5>
                          </div>
                          <p className="text-blue-700 text-sm">Verify identity before taking medication</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-3 mb-2">
                            <h5 className="font-semibold">Right Drug</h5>
                          </div>
                          <p className="text-blue-700 text-sm">Check medication name and strength</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-3 mb-2">
                            <h5 className="font-semibold">Right Dose</h5>
                          </div>
                          <p className="text-blue-700 text-sm">Verify correct amount prescribed</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-3 mb-2">
                            <h5 className="font-semibold">Right Time</h5>
                          </div>
                          <p className="text-blue-700 text-sm">Take at prescribed intervals</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-lg p-3 mb-2">
                            <h5 className="font-semibold">Right Route</h5>
                          </div>
                          <p className="text-blue-700 text-sm">Use correct method of administration</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Mobility and Rehabilitation */}
                  <section id="mobility-rehabilitation" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Users className="h-8 w-8 text-orange-600" />
                      Mobility and Rehabilitation Support
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Early mobilization and appropriate rehabilitation are crucial for preventing complications such as blood clots, pneumonia, and muscle weakness. However, the approach must be tailored to the specific surgery performed and the individual patient's condition and capabilities.
                    </p>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Progressive Mobility Stages</h3>
                    
                    <div className="space-y-6 mb-8">
                      <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                        <h4 className="font-semibold text-orange-800 mb-3">Stage 1: Bed Mobility (Day 1-2)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">Exercises</h5>
                            <ul className="space-y-1 text-orange-600 text-sm">
                              <li>• Deep breathing exercises</li>
                              <li>• Ankle pumps and circles</li>
                              <li>• Gentle leg slides</li>
                              <li>• Arm raises and shoulder rolls</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">Goals</h5>
                            <ul className="space-y-1 text-orange-600 text-sm">
                              <li>• Prevent blood clots</li>
                              <li>• Maintain circulation</li>
                              <li>• Prevent pneumonia</li>
                              <li>• Reduce stiffness</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                        <h4 className="font-semibold text-yellow-800 mb-3">Stage 2: Sitting and Standing (Day 2-5)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-yellow-700 mb-2">Activities</h5>
                            <ul className="space-y-1 text-yellow-600 text-sm">
                              <li>• Sitting at bedside</li>
                              <li>• Transfer to chair</li>
                              <li>• Standing with support</li>
                              <li>• Short-distance walking</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-yellow-700 mb-2">Safety Considerations</h5>
                            <ul className="space-y-1 text-yellow-600 text-sm">
                              <li>• Use assistive devices as needed</li>
                              <li>• Have help available</li>
                              <li>• Move slowly to prevent dizziness</li>
                              <li>• Monitor for pain or fatigue</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-800 mb-3">Stage 3: Progressive Activity (Week 1-2)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">Increased Activities</h5>
                            <ul className="space-y-1 text-green-600 text-sm">
                              <li>• Walking longer distances</li>
                              <li>• Climbing stairs (if appropriate)</li>
                              <li>• Light household activities</li>
                              <li>• Gradual return to daily tasks</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">Monitoring</h5>
                            <ul className="space-y-1 text-green-600 text-sm">
                              <li>• Track progress daily</li>
                              <li>• Note energy levels</li>
                              <li>• Monitor pain response</li>
                              <li>• Adjust pace as needed</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Physical Therapy Integration</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Many post-surgical patients benefit from professional physical therapy to ensure proper movement patterns, prevent complications, and optimize functional recovery. Home health physical therapists can provide personalized exercise programs and monitor progress while ensuring safety in the home environment.
                    </p>
                  </section>

                  {/* Nutrition for Recovery */}
                  <section id="nutrition-recovery" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Heart className="h-8 w-8 text-pink-600" />
                      Nutrition for Optimal Surgical Recovery
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Proper nutrition plays a fundamental role in surgical wound healing, immune function, and overall recovery. Post-surgical patients have increased nutritional needs, particularly for protein, vitamins, and minerals that support tissue repair and immune function.
                    </p>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Essential Nutrients for Healing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-pink-50 rounded-lg p-6">
                        <h4 className="font-semibold text-pink-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Protein Requirements
                        </h4>
                        <p className="text-pink-700 mb-3">Increased protein needs for tissue repair and immune function</p>
                        <ul className="space-y-2 text-pink-600 text-sm">
                          <li>• Aim for 1.2-1.5 grams per kg body weight</li>
                          <li>• Include lean meats, fish, eggs, dairy</li>
                          <li>• Plant proteins: beans, quinoa, nuts</li>
                          <li>• Consider protein supplements if needed</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Vitamins and Minerals
                        </h4>
                        <p className="text-blue-700 mb-3">Critical micronutrients for wound healing</p>
                        <ul className="space-y-2 text-blue-600 text-sm">
                          <li>• Vitamin C: citrus fruits, berries, leafy greens</li>
                          <li>• Vitamin A: carrots, sweet potatoes, spinach</li>
                          <li>• Zinc: meat, shellfish, seeds, nuts</li>
                          <li>• Iron: lean red meat, beans, fortified cereals</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Hydration and Recovery</h3>
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <p className="text-blue-700 mb-4">
                        Adequate hydration is essential for proper circulation, nutrient transport, and waste removal. Post-surgical patients should aim for 8-10 glasses of water daily unless otherwise restricted by their healthcare provider.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl font-bold">8-10</span>
                          </div>
                          <p className="text-blue-700 font-medium">Glasses per day</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                            <Clock className="h-8 w-8" />
                          </div>
                          <p className="text-blue-700 font-medium">Regular intervals</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="h-8 w-8" />
                          </div>
                          <p className="text-blue-700 font-medium">Monitor urine color</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Managing Post-Surgical Appetite Changes</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Many patients experience decreased appetite, nausea, or digestive changes after surgery. These are normal responses but can impact nutritional intake when healing demands are highest. Strategies to maintain adequate nutrition include eating smaller, frequent meals, focusing on nutrient-dense foods, and staying hydrated.
                    </p>
                  </section>

                  {/* Warning Signs and Complications */}
                  <section id="complications-warning-signs" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      Recognizing Complications and Warning Signs
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      While most surgical recoveries proceed without major complications, it's crucial to recognize warning signs that require immediate medical attention. Early identification and intervention can prevent minor issues from becoming serious problems that threaten recovery or require readmission.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                        <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          Call 911 Immediately
                        </h3>
                        <ul className="space-y-2 text-red-700">
                          <li>• Chest pain or difficulty breathing</li>
                          <li>• Signs of stroke (facial drooping, weakness, speech changes)</li>
                          <li>• Severe allergic reaction (hives, swelling, breathing difficulty)</li>
                          <li>• Uncontrolled bleeding from surgical site</li>
                          <li>• Loss of consciousness or severe confusion</li>
                          <li>• Signs of blood clot (sudden leg pain/swelling)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                        <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          Contact Healthcare Provider
                        </h3>
                        <ul className="space-y-2 text-orange-700">
                          <li>• Fever above 101°F (38.3°C)</li>
                          <li>• Increased pain not relieved by prescribed medication</li>
                          <li>• Signs of wound infection (redness, warmth, drainage)</li>
                          <li>• Persistent nausea/vomiting</li>
                          <li>• Inability to urinate or changes in urination</li>
                          <li>• Unexpected swelling or bruising</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Common Post-Surgical Complications</h3>
                    
                    <div className="space-y-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Surgical Site Infections (SSI)</h4>
                        <p className="text-gray-700 mb-3">
                          Infections at the surgical site occur in 2-5% of surgeries and can range from superficial skin infections to deep tissue or organ space infections.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Early Signs</h5>
                            <ul className="space-y-1 text-gray-600 text-sm">
                              <li>• Increased redness around incision</li>
                              <li>• Warmth at surgical site</li>
                              <li>• Increased tenderness or pain</li>
                              <li>• Swelling beyond normal healing</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Later Signs</h5>
                            <ul className="space-y-1 text-gray-600 text-sm">
                              <li>• Pus or unusual drainage</li>
                              <li>• Foul odor from wound</li>
                              <li>• Fever and chills</li>
                              <li>• Red streaking from wound</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-800 mb-3">Blood Clots (Venous Thromboembolism)</h4>
                        <p className="text-blue-700 mb-3">
                          Blood clots can form in the legs (deep vein thrombosis) or travel to the lungs (pulmonary embolism), representing a serious complication requiring immediate treatment.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-blue-700 mb-2">Leg Blood Clot Signs</h5>
                            <ul className="space-y-1 text-blue-600 text-sm">
                              <li>• Sudden leg pain or cramping</li>
                              <li>• Swelling in one leg</li>
                              <li>• Warmth in affected area</li>
                              <li>• Red or discolored skin</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-700 mb-2">Lung Blood Clot Signs</h5>
                            <ul className="space-y-1 text-blue-600 text-sm">
                              <li>• Sudden shortness of breath</li>
                              <li>• Chest pain (worse with breathing)</li>
                              <li>• Rapid heart rate</li>
                              <li>• Coughing up blood</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Professional Support */}
                  <section id="professional-support" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Users className="h-8 w-8 text-green-600" />
                      Professional Home Care Support Services
                    </h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Professional home care services can significantly improve post-surgical outcomes by providing skilled nursing care, therapy services, and support with daily activities. These services help ensure safe recovery while allowing patients to heal in the comfort of their own homes.
                    </p>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Types of Home Care Services</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Skilled Nursing Services
                        </h4>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• Wound care and dressing changes</li>
                          <li>• Medication management and administration</li>
                          <li>• Vital signs monitoring</li>
                          <li>• IV therapy and injections</li>
                          <li>• Patient and family education</li>
                          <li>• Coordination with physicians</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Therapy Services
                        </h4>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• Physical therapy for mobility and strength</li>
                          <li>• Occupational therapy for daily activities</li>
                          <li>• Speech therapy if needed</li>
                          <li>• Pain management techniques</li>
                          <li>• Safety assessments and modifications</li>
                          <li>• Equipment training and setup</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">When to Consider Professional Support</h3>
                    
                    <div className="bg-purple-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-purple-800 mb-4">Indicators for Professional Home Care</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-purple-700 mb-3">Medical Complexity</h5>
                          <ul className="space-y-1 text-purple-600 text-sm">
                            <li>• Complex wound care requirements</li>
                            <li>• Multiple medications to manage</li>
                            <li>• Chronic conditions requiring monitoring</li>
                            <li>• Recent hospitalization or complications</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-700 mb-3">Support System Needs</h5>
                          <ul className="space-y-1 text-purple-600 text-sm">
                            <li>• Limited family support available</li>
                            <li>• Caregiver needs education and training</li>
                            <li>• Safety concerns in home environment</li>
                            <li>• Mobility or cognitive limitations</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Finding Quality Home Care Providers</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      When selecting home care services, it's important to choose providers with proper licensing, insurance, and experience with post-surgical care. Look for agencies that offer comprehensive assessments, develop individualized care plans, and maintain communication with your surgical team.
                    </p>

                    <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                      <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Questions to Ask Potential Providers
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-yellow-700 text-sm">
                          <li>• Are nurses licensed and experienced with post-surgical care?</li>
                          <li>• How do you coordinate with my surgical team?</li>
                          <li>• What is your emergency response protocol?</li>
                          <li>• Can you provide references from other patients?</li>
                        </ul>
                        <ul className="space-y-2 text-yellow-700 text-sm">
                          <li>• What insurance plans do you accept?</li>
                          <li>• How often will care be provided?</li>
                          <li>• What happens if my regular nurse is unavailable?</li>
                          <li>• How do you ensure continuity of care?</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Recovery Timeline */}
                  <section id="recovery-timeline" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-teal-600" />
                      General Recovery Timeline
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      While every recovery is unique, understanding a general timeline can help set expectations. This is a general guide and your surgeon will provide specific instructions.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-teal-500 bg-teal-50 rounded-lg">
                        <h4 className="font-semibold text-teal-800">First Week</h4>
                        <p className="text-teal-700">Focus on rest, pain management, and gentle mobilization as tolerated. Follow wound care instructions strictly.</p>
                      </div>
                      <div className="p-4 border-l-4 border-teal-500 bg-teal-50 rounded-lg">
                        <h4 className="font-semibold text-teal-800">Weeks 2-4</h4>
                        <p className="text-teal-700">Gradual increase in activity. Stitches or staples may be removed. You may feel more energy but it's important not to overdo it.</p>
                      </div>
                      <div className="p-4 border-l-4 border-teal-500 bg-teal-50 rounded-lg">
                        <h4 className="font-semibold text-teal-800">Months 1-3</h4>
                        <p className="text-teal-700">Most patients return to many of their normal activities, though strenuous exercise may still be limited. Physical therapy is often a key component during this phase.</p>
                      </div>
                      <div className="p-4 border-l-4 border-teal-500 bg-teal-50 rounded-lg">
                        <h4 className="font-semibold text-teal-800">Beyond 3 Months</h4>
                        <p className="text-teal-700">Continued healing and strengthening. Full recovery can take six months to a year for major surgeries.</p>
                      </div>
                    </div>
                  </section>

                   {/* Conclusion */}
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 text-center mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Partner in Recovery</h2>
                    <p className="text-gray-700 mb-4">
                      Successful post-surgical recovery at home is achievable with careful planning, vigilance, and the right professional support. By understanding the key aspects of care and knowing when to seek help, patients and their families can navigate the recovery process confidently.
                    </p>
                  </div>
                </article>
              </div>
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
              This guide is for informational and educational purposes only and does not constitute medical advice. Post-surgical care requirements vary significantly based on the type of surgery and individual patient factors. Always consult with your surgeon and qualified healthcare professionals for personalized medical advice and before implementing any care protocol. The author and publisher assume no responsibility for any adverse outcomes from actions based on this content.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
