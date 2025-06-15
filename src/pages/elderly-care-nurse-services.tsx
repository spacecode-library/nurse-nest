
import React from "react";
import { Check } from "lucide-react";
import NurseNestNavbar from "@/components/NurseNestNavbar";

export default function ElderlyCareBlog() {
  return (
    <>
      <NurseNestNavbar isHomePage={false} />
      <div className="bg-white min-h-screen pt-24">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-gray-50 via-sky-50 to-blue-100 py-12 border-b">
          <div className="container mx-auto px-4 max-w-3xl md:max-w-4xl lg:max-w-5xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-5 text-nurse-dark">
              Navigating Elderly Care: A Family’s Guide to Quality Support
            </h1>
            <div className="flex items-center justify-center gap-3 text-gray-500 text-sm mb-3">
              <span>June 15, 2025</span>
              <span>•</span>
              <span>13 min read</span>
            </div>
            <p className="text-lg text-gray-700">
              By 2030, 1 in 5 Americans will be over 65. This guide empowers families to find, evaluate, and navigate the full spectrum of modern senior care options.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row gap-12 items-start max-w-7xl">
            <article className="prose prose-blue min-w-0 flex-1">
              {/* Introduction */}
              <p>
                With the rapid growth of the senior population, understanding the array of care solutions—and how to evaluate them—has never been more important for families. This guide covers in-home care, residential communities, care plan creation, technology solutions, insurance, cost, and crucial checklists for making confident decisions.
              </p>

              {/* Table of Contents */}
              <div className="not-prose mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-700 mb-2">Table of Contents</h2>
                <ul className="list-inside list-disc space-y-1 text-blue-700">
                  <li><a href="#modern-options">Understanding Modern Care Options</a></li>
                  <li><a href="#financial-planning">Financial Planning Essentials</a></li>
                  <li><a href="#evaluation">Choosing Quality Care: 5-Step Evaluation</a></li>
                  <li><a href="#technology">Technology Enhancing Senior Wellbeing</a></li>
                  <li><a href="#cultural-care">Culturally Sensitive Care Solutions</a></li>
                  <li><a href="#future-trends">Future-Forward Care Trends</a></li>
                  <li><a href="#checklist">Action Checklist for Families</a></li>
                  <li><a href="#care-planning">Creating a Comprehensive Care Plan</a></li>
                  <li><a href="#medical-management">Medical Care Management</a></li>
                  <li><a href="#safety-considerations">Safety and Home Modifications</a></li>
                  <li><a href="#family-support">Supporting Family Caregivers</a></li>
                  <li><a href="#cost-considerations">Cost and Insurance Considerations</a></li>
                  <li><a href="#finding-services">Finding Quality Care Services</a></li>
                  <li><a href="#disclaimer">Important Disclaimer</a></li>
                </ul>
              </div>

              {/* Modern Care Options */}
              <h2 id="modern-options" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Understanding Modern Care Options</h2>
              <ol className="space-y-4">
                <li>
                  <span className="font-semibold text-blue-700">In-Home Support Services</span>
                  <ul className="list-disc ml-6">
                    <li><b>Personal Care Assistance:</b> Help with bathing, dressing, medication</li>
                    <li><b>Specialized Home Health:</b> Nursing, physical therapy, or dementia care at home</li>
                    <li><b>Cost:</b> Avg $5,000/month for 40 hours/week care</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold text-blue-700">Residential Communities</span>
                  <div className="overflow-x-auto mb-3">
                    <table className="min-w-[320px] text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border font-semibold text-gray-700">Type</th>
                          <th className="p-2 border font-semibold text-gray-700">Best For</th>
                          <th className="p-2 border font-semibold text-gray-700">Average Monthly Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">Independent Living</td>
                          <td className="border p-2">Active seniors, minimal support</td>
                          <td className="border p-2">$2,500-$3,500</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Assisted Living</td>
                          <td className="border p-2">Help with daily tasks/medication</td>
                          <td className="border p-2">$4,000-$6,000</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Memory Care</td>
                          <td className="border p-2">Advanced dementia support</td>
                          <td className="border p-2">$5,000-$8,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
                <li>
                  <span className="font-semibold text-blue-700">Specialized Medical Care</span>
                  <ul className="list-disc ml-6">
                    <li>Rehabilitation after hospital stays</li>
                    <li>Hospice and palliative services</li>
                    <li>Chronic condition management (e.g., diabetes, Parkinson’s)</li>
                  </ul>
                </li>
              </ol>

              {/* Financial Planning */}
              <h2 id="financial-planning" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Financial Planning Essentials</h2>
              <ul className="space-y-2">
                <li><b>Medicare:</b> Short-term skilled nursing (up to 100 days)</li>
                <li><b>Medicaid:</b> Long-term care for low-income seniors (state-specific)</li>
                <li><b>Veteran Programs:</b> Aid & Attendance pension benefits</li>
                <li><b>Long-Term Care Insurance:</b> Compare policies</li>
              </ul>
              <p className="text-sm text-blue-900">
                <b>Practical Tip:</b> 73% of families use 3+ funding sources. Consult an elder law attorney for personalized guidance.
              </p>

              {/* 5-Step Evaluation */}
              <h2 id="evaluation" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Choosing Quality Care: 5-Step Evaluation</h2>
              <ol className="list-decimal ml-4 space-y-2">
                <li><b>Verify Credentials:</b> Licensing, state reports, accreditations</li>
                <li><b>Assess Safety & Accessibility:</b> Fall prevention, emergency protocols</li>
                <li><b>Evaluate Staff Engagement:</b> Ratios, training</li>
                <li><b>Review Personalized Care Plans:</b> Activities, family involvement</li>
                <li><b>Understand Transition Policies:</b> Health decline and discharge procedures</li>
              </ol>

              {/* Technology Section */}
              <h2 id="technology" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Technology Enhancing Senior Wellbeing</h2>
              <ul className="list-disc ml-6">
                <li>Remote health monitoring (wearables, fall alerts)</li>
                <li>Cognitive support tablets and video calls</li>
                <li>Medication dispensers with alerts</li>
                <li>Virtual access to geriatric specialists</li>
              </ul>

              {/* Cultural Sensitivity */}
              <h2 id="cultural-care" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Culturally Sensitive Care Solutions</h2>
              <ul className="mb-2">
                <li>
                  <b>For Hispanic Families:</b>
                  <ul className="ml-6 list-disc">
                    <li>Bilingual staff, meals matching traditions</li>
                    <li>Multigenerational programs</li>
                  </ul>
                </li>
                <li>
                  <b>Asian-American Communities:</b>
                  <ul className="ml-6 list-disc">
                    <li>Respect for family hierarchy</li>
                    <li>Tai chi, mahjong, Buddhist/ancestral accommodations</li>
                  </ul>
                </li>
              </ul>

              {/* Future trends */}
              <h2 id="future-trends" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Future-Forward Care Trends (2025–2030)</h2>
              <ul>
                <li>Intergenerational living (student-senior homes)</li>
                <li>Robotic companions and lift devices</li>
                <li>DNA-based dementia prevention</li>
                <li>Grief-informed bereavement support</li>
              </ul>

              {/* Family Checklist */}
              <h2 id="checklist" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Action Checklist for Families</h2>
              <ul className="list-disc ml-6">
                <li>Compare with the <a href="https://eldercare.acl.gov" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Aging.gov Eldercare Locator</a></li>
                <li>Tour facilities during active hours (10 AM–2 PM)</li>
                <li>Try respite care before full commitment</li>
                <li>Create a shared family decision doc</li>
                <li>Consult advisors: Medicaid asset planning</li>
              </ul>

              {/* SECTION 5: CARE PLAN (user provided code adapted) */}
              <section id="care-planning" className="mb-12">
                <h2 className="text-2xl font-bold text-nurse-dark mb-6">Creating a Comprehensive Care Plan</h2>
                <div className="prose max-w-none mb-8">
                  <p>
                    A structured care plan is essential. The SPICES framework (Sleep disorders, Problems with eating, Incontinence, Confusion, Evidence of falls, Skin breakdown) helps identify senior needs.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Components</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Health Assessment:</b> Physical, cognitive, and psychosocial evaluation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Personal Goals:</b> Quality of life & independence priorities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Daily Routine:</b> Clear schedule for meds, meals, activities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Emergency Protocols:</b> Step-by-step guides for unexpected events</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Person-Centered Care</h3>
                    <p className="mb-4">
                      Start every care plan by understanding former passions—personalization is proven to improve mental wellbeing. Review plans quarterly to keep them relevant.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Care Coordination</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Communication</h4>
                      <p className="text-sm">Schedule updates among family/caregivers/providers</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Documentation</h4>
                      <p className="text-sm">Shared logs for meds & symptoms</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tech Integration</h4>
                      <p className="text-sm">Secure portals for real-time updates</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: MEDICAL MANAGEMENT */}
              <section id="medical-management" className="mb-12">
                <h2 className="text-2xl font-bold text-nurse-dark mb-6">Medical Care Management</h2>
                <div className="prose max-w-none mb-8">
                  <p>
                    Medical management for seniors addresses changed metabolism and chronic risks. Key strategies:
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Medication Management</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Polypharmacy Risks:</b> 4+ meds = higher interaction risk</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Tech Solutions:</b> MedMinder, automated dispensers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Regular Review:</b> Review all meds every 3–6 months with pharmacist</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Chronic Condition Management</h3>
                    <ul className="space-y-3">
                      <li>
                        <b>Dementia Care:</b> Routines, clear communication, safe environment
                      </li>
                      <li>
                        <b>Cardiac:</b> Monitor weight/vitals, reduce sodium
                      </li>
                      <li>
                        <b>Diabetes:</b> Track glucose, daily foot care, diet coordination
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
                  <h3 className="text-lg font-semibold mb-4">Technology in Medical Management</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold text-2xl">🩺</span>
                      </div>
                      <h4 className="font-medium">Telehealth</h4>
                      <p className="text-xs">Video consults with specialists</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-bold text-2xl">📊</span>
                      </div>
                      <h4 className="font-medium">Remote Monitoring</h4>
                      <p className="text-xs">Wearable sensors track vitals/activity</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-600 font-bold text-2xl">🗄️</span>
                      </div>
                      <h4 className="font-medium">Digital Records</h4>
                      <p className="text-xs">Centralized health info</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 7: SAFETY & HOME MODS */}
              <section id="safety-considerations" className="mb-12">
                <h2 className="text-2xl font-bold text-nurse-dark mb-6">Safety and Home Modifications</h2>
                <div className="prose max-w-none mb-8">
                  <p>
                    Falls cause 1 in 4 injuries in older adults yearly. Smart home mods cut risk by 60%.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Essential Home Safety</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Bathroom:</b> Grab bars, non-slip mats, walk-in showers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Lighting:</b> Motion-sensor, more light, night lights</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Flooring:</b> Remove rugs, clear pathways</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Smart Home:</b> Voice systems, auto lights, safety alerts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Emergency Response Systems</h3>
                    <p className="mb-4">LifeAlert/MobileHelp: fast emergency link. Floor alarms for wander risks.</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Room-by-Room Checklist</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Measures</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-4 font-medium text-gray-900">Bathroom</td>
                          <td className="px-4 py-4">Non-slip mats, grab bars, temp-controlled faucets</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-4 font-medium text-gray-900">Kitchen</td>
                          <td className="px-4 py-4">Shut-off appliances, fire extinguisher, accessible storage</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 font-medium text-gray-900">Bedroom</td>
                          <td className="px-4 py-4">Bed rails, night light, clear path to bathroom</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-4 font-medium text-gray-900">Stairs</td>
                          <td className="px-4 py-4">Handrails, non-slip treads, lighting</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* SECTION 8: FAMILY SUPPORT */}
              <section id="family-support" className="mb-12">
                <h2 className="text-2xl font-bold text-nurse-dark mb-6">Supporting Family Caregivers</h2>
                <div className="prose max-w-none mb-8">
                  <p>
                    Family caregivers provide $470B+ in unpaid care yearly, often facing burnout.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Support Strategies</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Respite Care:</b> Temporary relief with in-home care/adult day programs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Education:</b> How-to’s for dementia care, meds, mobility</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Support Networks:</b> Local/online caregiver groups</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Self-Care:</b> Breaks, health checks, set boundaries</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recognizing Burnout</h3>
                    <p className="mb-4">Symptoms: fatigue, sleep trouble, irritability, social withdrawal. Professional support can help families focus on connection, not just care tasks.</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Community Resources</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Area Agencies on Aging</h4>
                      <p className="text-sm">Local info & support</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Meal Delivery</h4>
                      <p className="text-sm">Nutritious, elder-appropriate meals</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Transportation</h4>
                      <p className="text-sm">Accessible rides for appointments/errands</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 9: COST & INSURANCE */}
              <section id="cost-considerations" className="mb-12">
                <h2 className="text-2xl font-bold text-nurse-dark mb-6">Cost and Insurance Considerations</h2>
                <div className="prose max-w-none mb-8">
                  <p>
                    The global elderly care market will hit $1.96T by 2032, with home care leading.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Funding Options</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Medicare:</b> Skilled nursing (100 days post-hospital)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Medicaid:</b> Long-term, needs-based, low asset seniors</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Long-Term Care Insurance:</b> Extended care policies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Veteran Benefits:</b> Aid & Attendance pension</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span><b>Reverse Mortgages:</b> Home equity conversion</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Cost Comparison</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Home Health Aide</span>
                        <span className="text-gray-600">$150-$250/day</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Adult Day Care</span>
                        <span className="text-gray-600">$75-$150/day</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Assisted Living</span>
                        <span className="text-gray-600">$4,000-$6,000/month</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Nursing Home</span>
                        <span className="text-gray-600">$8,000-$12,000/month</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Financial Planning Tips</h3>
                  <ul className="space-y-2 ml-5">
                    <li>Start early—before care is needed</li>
                    <li>Consult elder-law attorneys: Medicaid planning</li>
                    <li>Review state-specific programs</li>
                    <li>Make an inventory of all assets/income sources</li>
                    <li>Consider life insurance conversions for care</li>
                  </ul>
                </div>
              </section>

              {/* SECTION 10: FINDING SERVICES */}
              <section id="finding-services" className="mb-12">
                <h2 className="text-2xl font-bold text-nurse-dark mb-6">Finding Quality Care Services</h2>
                <div className="prose max-w-none mb-8">
                  <p>
                    There are over 28,000 assisted living communities in the US. Vetting quality is crucial.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">How to Vet Providers</h3>
                    <ol className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                        <span><b>Verify Credentials:</b> State licensing, history</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                        <span><b>Interview Providers:</b> Ask about training, matching process</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                        <span><b>Check References:</b> Speak to clients/families</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                        <span><b>Review Contracts:</b> Fee structures, cancellation</span>
                      </li>
                    </ol>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quality Indicators</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span>Low staff turnover rates (&lt;65%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span>Personalized, regularly updated care plans</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span>Active social programming</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span>Clean, safe environments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span>Transparent communication</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Community Resources Online</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span role="img" aria-label="Locator" className="text-blue-600 text-2xl">🔎</span>
                      </div>
                      <h4 className="font-medium">Eldercare Locator</h4>
                      <p className="text-xs">Nationwide directory</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span role="img" aria-label="agency" className="text-green-600 text-2xl">🏢</span>
                      </div>
                      <h4 className="font-medium">Area Agencies</h4>
                      <p className="text-xs">State/local aging programs</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span role="img" aria-label="ratings" className="text-purple-600 text-2xl">⭐</span>
                      </div>
                      <h4 className="font-medium">Medicare Care Compare</h4>
                      <p className="text-xs">Facility ratings/reviews</p>
                    </div>
                  </div>
                </div>
              </section>

              <h2 id="disclaimer" className="text-xl font-bold text-nurse-dark mt-10 mb-3">Important Disclaimer</h2>
              <div className="bg-amber-100 border-l-4 border-amber-400 rounded p-4 mt-2 mb-2">
                <p className="text-amber-700 text-sm">
                  <b>Disclaimer:</b> This guide is for general information only. It does not replace legal, financial, or healthcare advice. Consult qualified professionals for decisions about care, insurance, or business formation.
                </p>
              </div>
            </article>
            {/* Sidebar Section */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-6 mt-8 lg:mt-0 sticky top-24">
              {/* Quick Navigation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                <h3 className="font-semibold text-blue-800 mb-1">Quick Navigation</h3>
                <ul className="list-disc ml-6 space-y-1 text-blue-700 text-base">
                  <li><a href="#modern-options">Modern Care Options</a></li>
                  <li><a href="#financial-planning">Financial Planning</a></li>
                  <li><a href="#evaluation">5-Step Evaluation</a></li>
                  <li><a href="#technology">Tech for Wellbeing</a></li>
                  <li><a href="#future-trends">Future Trends</a></li>
                  <li><a href="#care-planning">Care Plan</a></li>
                  <li><a href="#cost-considerations">Cost</a></li>
                  <li><a href="#finding-services">Find Care</a></li>
                </ul>
              </div>
              {/* Related Links */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-1 text-gray-800">Related Resources</h3>
                <ul className="list-inside list-disc text-blue-700">
                  <li>
                    <a href="/blog/complete-newborn-care-guide-for-nurses">Newborn Care Guide</a>
                  </li>
                  <li>
                    <a href="/malpractice-insurance">Insurance & Licensing</a>
                  </li>
                  <li>
                    <a href="/nurse-llc-setup-guide">Nurse LLC Setup</a>
                  </li>
                  <li>
                    <a href="/best-products-for-home-healthcare">Best Home Healthcare Products</a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}
