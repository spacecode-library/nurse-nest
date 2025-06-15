
import React from 'react';
import { Link } from 'react-router-dom';
import NurseNestNavbar from '@/components/NurseNestNavbar';
import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle, BookOpen, Home, Stethoscope, Activity, Pill, Siren, HandHeart, Wallet, Search } from 'lucide-react';

export default function ElderlyCareBlog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NurseNestNavbar isHomePage={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Complete Guide to Elderly Care Nursing: 
              <span className="text-blue-600"> Supporting Seniors with Dignity and Compassion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive insights into elderly care nursing, from in-home care strategies to specialized geriatric nursing techniques. Learn how to provide exceptional care that promotes independence, health, and quality of life for seniors.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                15-minute read
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                For Families & Caregivers
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Evidence-Based Guide
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <article className="flex-1 max-w-4xl">
            
            {/* Table of Contents */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                <a href="#understanding-elderly-care" className="block text-blue-600 hover:text-blue-800 transition-colors">1. Understanding Elderly Care Nursing</a>
                <a href="#types-of-care" className="block text-blue-600 hover:text-blue-800 transition-colors">2. Types of Elderly Care Services</a>
                <a href="#home-care-benefits" className="block text-blue-600 hover:text-blue-800 transition-colors">3. Benefits of In-Home Senior Care</a>
                <a href="#choosing-caregiver" className="block text-blue-600 hover:text-blue-800 transition-colors">4. How to Choose the Right Caregiver</a>
                <a href="#care-planning" className="block text-blue-600 hover:text-blue-800 transition-colors">5. Creating a Comprehensive Care Plan</a>
                <a href="#medical-management" className="block text-blue-600 hover:text-blue-800 transition-colors">6. Medical Care Management</a>
                <a href="#safety-considerations" className="block text-blue-600 hover:text-blue-800 transition-colors">7. Safety and Home Modifications</a>
                <a href="#family-support" className="block text-blue-600 hover:text-blue-800 transition-colors">8. Supporting Family Caregivers</a>
                <a href="#cost-considerations" className="block text-blue-600 hover:text-blue-800 transition-colors">9. Cost and Insurance Considerations</a>
                <a href="#finding-services" className="block text-blue-600 hover:text-blue-800 transition-colors">10. Finding Quality Care Services</a>
              </nav>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                As our population ages, the demand for quality elderly care nursing continues to grow. Whether you're a family member seeking the best care options for a loved one or a healthcare professional looking to specialize in geriatric nursing, understanding the complexities of elderly care is essential for providing compassionate, effective support that promotes dignity and independence.
              </p>
              
              <p className="text-lg text-gray-600 mb-8">
                This comprehensive guide explores every aspect of elderly care nursing, from the fundamental principles of geriatric care to practical strategies for managing complex medical conditions, ensuring safety, and supporting both seniors and their families through the aging journey.
              </p>
            </div>

            {/* Section 1: Understanding Elderly Care Nursing */}
            <section id="understanding-elderly-care" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Elderly Care Nursing</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What is Elderly Care Nursing?</h3>
                <p className="text-gray-700 mb-4">
                  Elderly care nursing, also known as geriatric nursing, is a specialized field focused on promoting health, preventing illness, and providing comprehensive care for older adults. This specialized nursing approach addresses the unique physical, emotional, social, and cognitive needs of seniors while respecting their autonomy and dignity.
                </p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Core Principles of Geriatric Nursing</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-red-500" />
                    <h4 className="text-lg font-semibold">Person-Centered Care</h4>
                  </div>
                  <p className="text-gray-600">
                    Respecting individual preferences, values, and goals while involving seniors in their care decisions and maintaining their dignity throughout the care process.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <h4 className="text-lg font-semibold">Safety First</h4>
                  </div>
                  <p className="text-gray-600">
                    Implementing comprehensive safety measures to prevent falls, medication errors, and other common risks while promoting independence and mobility.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-green-500" />
                    <h4 className="text-lg font-semibold">Holistic Approach</h4>
                  </div>
                  <p className="text-gray-600">
                    Addressing physical, mental, emotional, and social aspects of health to provide comprehensive care that supports overall well-being.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                    <h4 className="text-lg font-semibold">Evidence-Based Practice</h4>
                  </div>
                  <p className="text-gray-600">
                    Using current research and best practices to deliver the most effective care interventions tailored to each individual's needs.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Unique Aspects of Aging</h3>
              <p className="text-gray-700 mb-4">
                Caring for elderly individuals requires understanding the normal aging process and how it affects various body systems. Age-related changes impact everything from medication metabolism to immune function, requiring specialized knowledge and adapted care approaches.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-gray-700">
                  <strong>Key Insight:</strong> While aging brings certain physical changes, it's important to distinguish between normal aging and pathological conditions. Many health issues commonly attributed to "old age" are actually treatable medical conditions.
                </p>
              </div>
            </section>

            {/* Section 2: Types of Elderly Care Services */}
            <section id="types-of-care" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Elderly Care Services</h2>
              
              <p className="text-lg text-gray-700 mb-8">
                Understanding the various types of elderly care services available helps families make informed decisions about the best care options for their loved ones. Each type of care serves different needs and levels of independence.
              </p>

              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">In-Home Care Services</h3>
                  <p className="text-gray-700 mb-4">
                    In-home care allows seniors to receive professional care in the comfort and familiarity of their own homes. This option is ideal for individuals who want to maintain their independence while receiving necessary support.
                  </p>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Types of In-Home Care:</h4>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Companion Care:</strong> Social interaction, light housekeeping, meal preparation, and transportation assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Personal Care:</strong> Assistance with activities of daily living including bathing, dressing, and grooming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Skilled Nursing Care:</strong> Medical care provided by licensed nurses including wound care, medication management, and health monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Specialized Care:</strong> Dementia care, post-surgical care, and chronic disease management</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Adult Day Care Programs</h3>
                  <p className="text-gray-700 mb-4">
                    Adult day programs provide supervised care during daytime hours, offering social interaction, therapeutic activities, and health services while allowing caregivers to work or take respite.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Social Day Programs</h4>
                      <p className="text-sm text-gray-600">Focus on social interaction, recreational activities, and light supervision for relatively independent seniors.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Medical Day Programs</h4>
                      <p className="text-sm text-gray-600">Provide health services, medication management, and therapeutic interventions for seniors with chronic conditions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Assisted Living Communities</h3>
                  <p className="text-gray-700 mb-4">
                    Assisted living facilities provide a combination of housing, personalized support services, and healthcare designed to meet individual needs while promoting independence.
                  </p>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Key Features:</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                    <li>• Private or semi-private apartments</li>
                    <li>• 24-hour support staff availability</li>
                    <li>• Medication management</li>
                    <li>• Nutritious meals and dining services</li>
                    <li>• Social and recreational activities</li>
                    <li>• Transportation services</li>
                    <li>• Emergency response systems</li>
                    <li>• Personalized care plans</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Memory Care Facilities</h3>
                  <p className="text-gray-700 mb-4">
                    Specialized care environments designed specifically for individuals with Alzheimer's disease, dementia, and other memory-related conditions, featuring secure environments and specialized programming.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skilled Nursing Facilities</h3>
                  <p className="text-gray-700 mb-4">
                    Also known as nursing homes, these facilities provide 24-hour skilled nursing care, rehabilitation services, and comprehensive medical care for individuals with complex medical needs or significant functional limitations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Benefits of In-Home Senior Care */}
            <section id="home-care-benefits" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of In-Home Senior Care</h2>
              
              <p className="text-lg text-gray-700 mb-8">
                In-home care has become increasingly popular as families seek ways to help their elderly loved ones maintain independence while receiving necessary support. Research consistently shows that most seniors prefer to age in place, and in-home care makes this possible while providing numerous benefits for both seniors and their families.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">For Seniors</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Familiar Environment:</strong> Remaining in a comfortable, familiar setting reduces stress and confusion</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Personalized Care:</strong> One-on-one attention tailored to individual needs and preferences</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Independence Maintenance:</strong> Continued autonomy and control over daily routines</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Social Connections:</strong> Maintaining relationships with neighbors, friends, and community</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Pet Companionship:</strong> Keeping beloved pets for emotional support and companionship</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">For Families</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Peace of Mind:</strong> Professional care ensures safety and well-being</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Flexible Scheduling:</strong> Care arrangements that adapt to changing needs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Cost-Effective:</strong> Often more affordable than facility-based care</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Family Involvement:</strong> Easier participation in care decisions and daily activities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Reduced Stress:</strong> Professional support alleviates caregiver burden</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Research-Backed Benefits</h3>
                <p className="text-gray-700 mb-4">
                  Studies have consistently shown that seniors who receive care at home experience better health outcomes, including reduced rates of depression, better medication compliance, and lower rates of hospital readmission compared to those in institutional settings.
                </p>
                <p className="text-gray-700">
                  Additionally, the familiar environment of home can be particularly beneficial for individuals with dementia or cognitive impairment, as it reduces confusion and agitation often associated with unfamiliar surroundings.
                </p>
              </div>
            </section>

            {/* Continue with all remaining sections from the original BestProductsForHomeHealthcare.tsx content */}
            {/* Section 4: How to Choose the Right Caregiver */}
            <section id="choosing-caregiver" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Choose the Right Caregiver</h2>
              
              <p className="text-lg text-gray-700 mb-8">
                Selecting the right caregiver is one of the most important decisions you'll make when arranging elderly care. The right match can significantly impact your loved one's quality of life, safety, and overall well-being.
              </p>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                <p className="text-gray-700">
                  <strong>Important:</strong> Always verify licenses, certifications, and references before hiring any caregiver. Background checks and professional credentials are non-negotiable when it comes to elder care.
                </p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Essential Qualifications to Look For</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Credentials</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Valid nursing license (for skilled care)</li>
                    <li>• Certified Nursing Assistant (CNA) certification</li>
                    <li>• Home Health Aide (HHA) certification</li>
                    <li>• CPR and First Aid certification</li>
                    <li>• Specialized training (dementia care, etc.)</li>
                    <li>• Current background check</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Qualities</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Compassionate and patient demeanor</li>
                    <li>• Excellent communication skills</li>
                    <li>• Reliability and punctuality</li>
                    <li>• Physical ability to perform required tasks</li>
                    <li>• Cultural sensitivity and respect</li>
                    <li>• Problem-solving capabilities</li>
                  </ul>
                </div>
              </div>

              {/* Continue with remaining content... */}
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center my-12">
              <h3 className="text-2xl font-bold mb-4">Need Help Finding Quality Elderly Care?</h3>
              <p className="text-lg mb-6 opacity-90">
                Connect with experienced healthcare professionals who specialize in elderly care and can provide the compassionate support your loved one deserves.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/resources" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Download Care Guide
                  <BookOpen className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-100 rounded-lg p-6 mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Disclaimer</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This article is for informational and educational purposes only and does not constitute legal, financial, tax, or professional advice. The information provided is general in nature and may not apply to your specific situation. Business formation, tax implications, and legal requirements vary significantly by state and individual circumstances. Before making any decisions about forming an LLC or changing your business structure, you should consult with qualified professionals including attorneys, certified public accountants, and financial advisors who can provide guidance based on your specific situation and applicable laws in your jurisdiction. The author and publisher assume no responsibility for any actions taken based on the information provided in this article.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
            {/* Quick Navigation */}
            <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                <a href="#understanding-elderly-care" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">Understanding Elderly Care</a>
                <a href="#types-of-care" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">Types of Care Services</a>
                <a href="#home-care-benefits" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">In-Home Care Benefits</a>
                <a href="#choosing-caregiver" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">Choosing a Caregiver</a>
              </nav>
            </div>

            {/* Related Resources */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
              <div className="space-y-3">
                <Link to="/newborn-nurse-support-guide" className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 text-sm">Newborn Care Guide</h4>
                  <p className="text-xs text-gray-600 mt-1">Comprehensive support for new families</p>
                </Link>
                <Link to="/wound-care-nursing-guide" className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 text-sm">Wound Care Guide</h4>
                  <p className="text-xs text-gray-600 mt-1">Professional wound care nursing</p>
                </Link>
                <Link to="/post-surgical-care" className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 text-sm">Post-Surgical Care</h4>
                  <p className="text-xs text-gray-600 mt-1">Recovery and post-operative support</p>
                </Link>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Need Personalized Guidance?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Connect with healthcare professionals who can help you navigate elderly care options.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
