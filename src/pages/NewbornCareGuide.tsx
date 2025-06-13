
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Heart, Clock, Shield, Baby, CheckCircle, AlertTriangle } from 'lucide-react';

export default function NewbornCareGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Essential Newborn Care Guide for New Parents: What Every Family Needs to Know | Nurse Nest</title>
        <meta name="description" content="Complete newborn care guide covering feeding, sleep, safety, and development. Expert tips from experienced nurses to help new parents feel confident." />
        <meta name="keywords" content="newborn care guide, baby care tips, newborn feeding, infant sleep safety, new parent guide" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16" style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)'}}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-light text-[#1e293b] mb-6">
                Essential Newborn Care Guide for New Parents: What Every Family Needs to Know
              </h1>
              <div className="flex items-center gap-6 text-[#475569] mb-8">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  June 12, 2025
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  14 min read
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                <article className="lg:col-span-3">
                  {/* Introduction */}
                  <div className="prose max-w-none mb-12">
                    <p className="text-lg text-[#475569] leading-relaxed mb-6">
                      Welcoming a newborn into your family is one of life's most precious moments, but it can also feel overwhelming for new parents. Understanding basic newborn care helps you feel confident in caring for your baby and recognizing when to seek professional support. This comprehensive guide provides essential information every new parent needs to navigate those crucial first weeks with their newborn.
                    </p>
                    
                    <p className="text-lg text-[#475569] leading-relaxed">
                      From feeding and sleeping to recognizing normal development and warning signs, this guide covers the fundamentals of newborn care with practical tips from experienced nurses and healthcare professionals. Remember, every baby is unique, and having access to professional newborn care support can provide invaluable peace of mind during this special time.
                    </p>
                  </div>

                  {/* Table of Contents */}
                  <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0] mb-12">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Table of Contents</h3>
                    <ul className="space-y-2 text-[#475569]">
                      <li><a href="#first-days-home" className="text-[#3b82f6] hover:underline">First Days at Home</a></li>
                      <li><a href="#feeding-your-newborn" className="text-[#3b82f6] hover:underline">Feeding Your Newborn</a></li>
                      <li><a href="#breastfeeding-basics" className="text-[#3b82f6] hover:underline">Breastfeeding Basics</a></li>
                      <li><a href="#bottle-feeding-guide" className="text-[#3b82f6] hover:underline">Bottle Feeding Guide</a></li>
                      <li><a href="#sleep-and-safety" className="text-[#3b82f6] hover:underline">Sleep Patterns and Safe Sleep</a></li>
                      <li><a href="#diaper-changes" className="text-[#3b82f6] hover:underline">Diaper Changes and Hygiene</a></li>
                      <li><a href="#bathing-newborn" className="text-[#3b82f6] hover:underline">Bathing Your Newborn</a></li>
                      <li><a href="#normal-newborn-behavior" className="text-[#3b82f6] hover:underline">Normal Newborn Behavior</a></li>
                      <li><a href="#crying-and-soothing" className="text-[#3b82f6] hover:underline">Understanding Crying and Soothing Techniques</a></li>
                      <li><a href="#growth-development" className="text-[#3b82f6] hover:underline">Growth and Development Milestones</a></li>
                      <li><a href="#health-monitoring" className="text-[#3b82f6] hover:underline">Health Monitoring and Warning Signs</a></li>
                      <li><a href="#common-concerns" className="text-[#3b82f6] hover:underline">Common Newborn Concerns</a></li>
                      <li><a href="#when-to-call" className="text-[#3b82f6] hover:underline">When to Call Healthcare Providers</a></li>
                      <li><a href="#bonding-attachment" className="text-[#3b82f6] hover:underline">Bonding and Attachment</a></li>
                      <li><a href="#sibling-adjustment" className="text-[#3b82f6] hover:underline">Helping Siblings Adjust</a></li>
                    </ul>
                  </div>

                  {/* Main Content */}
                  <div className="prose max-w-none">
                    <h2 id="first-days-home" className="text-3xl font-semibold text-[#1e293b] mb-6">First Days at Home</h2>
                    <p className="text-[#475569] leading-relaxed mb-4">
                      The transition from hospital to home with your newborn marks the beginning of your parenting journey. Understanding what to expect in those first days helps you feel prepared and confident in caring for your baby.
                    </p>

                    <h3 className="text-2xl font-semibold text-[#1e293b] mb-4">What to Expect</h3>
                    <ul className="list-disc pl-6 text-[#475569] mb-6">
                      <li><strong>Frequent Feeding:</strong> Newborns typically eat every 2-3 hours, including through the night</li>
                      <li><strong>Lots of Sleep:</strong> Newborns sleep 14-17 hours per day in short stretches</li>
                      <li><strong>Regular Crying:</strong> Crying is normal communication for babies</li>
                      <li><strong>Weight Changes:</strong> Most babies lose 5-10% of birth weight in the first week</li>
                      <li><strong>Frequent Diaper Changes:</strong> Expect 8-12 wet diapers and several soiled diapers daily</li>
                    </ul>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <div className="flex items-center mb-3">
                          <Baby className="h-6 w-6 text-[#3b82f6] mr-3" />
                          <h4 className="text-xl font-semibold text-[#1e293b]">Essential Supplies</h4>
                        </div>
                        <ul className="text-[#475569] space-y-1">
                          <li>• Diapers (newborn and size 1)</li>
                          <li>• Baby wipes and diaper cream</li>
                          <li>• Baby clothes in multiple sizes</li>
                          <li>• Swaddle blankets</li>
                          <li>• Feeding supplies</li>
                        </ul>
                      </div>

                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <div className="flex items-center mb-3">
                          <Shield className="h-6 w-6 text-[#3b82f6] mr-3" />
                          <h4 className="text-xl font-semibold text-[#1e293b]">Safe Environment</h4>
                        </div>
                        <ul className="text-[#475569] space-y-1">
                          <li>• Comfortable temperature (68-70°F)</li>
                          <li>• Minimize loud noises</li>
                          <li>• Easy access to supplies</li>
                          <li>• Quiet feeding spaces</li>
                          <li>• Accept help from others</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="feeding-your-newborn" className="text-3xl font-semibold text-[#1e293b] mb-6">Feeding Your Newborn</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Proper nutrition is essential for your baby's growth and development. Whether you choose breastfeeding, formula feeding, or a combination, understanding feeding basics ensures your baby thrives.
                    </p>

                    <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0] mb-8">
                      <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Feeding Frequency Guidelines</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#e2e8f0]">
                              <th className="text-left py-2 px-3 text-[#1e293b]">Age</th>
                              <th className="text-left py-2 px-3 text-[#1e293b]">Frequency</th>
                              <th className="text-left py-2 px-3 text-[#1e293b]">Daily Feedings</th>
                            </tr>
                          </thead>
                          <tbody className="text-[#475569]">
                            <tr className="border-b border-[#e2e8f0]">
                              <td className="py-2 px-3">0-2 weeks</td>
                              <td className="py-2 px-3">Every 2-3 hours</td>
                              <td className="py-2 px-3">8-12 times</td>
                            </tr>
                            <tr className="border-b border-[#e2e8f0]">
                              <td className="py-2 px-3">2-4 weeks</td>
                              <td className="py-2 px-3">Every 2-4 hours</td>
                              <td className="py-2 px-3">8-10 times</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-3">1-2 months</td>
                              <td className="py-2 px-3">Every 3-4 hours</td>
                              <td className="py-2 px-3">6-8 times</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <h2 id="breastfeeding-basics" className="text-3xl font-semibold text-[#1e293b] mb-6">Breastfeeding Basics</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Breastfeeding provides optimal nutrition for your baby and offers health benefits for both mother and child. Getting started successfully often requires patience and support.
                    </p>

                    <div className="space-y-6 mb-8">
                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Common Breastfeeding Positions</h3>
                        <ul className="space-y-2 text-[#475569]">
                          <li><strong>Cradle Hold:</strong> Classic position with baby's head in the crook of your arm</li>
                          <li><strong>Cross-Cradle:</strong> Support baby's head with opposite hand for better control</li>
                          <li><strong>Football Hold:</strong> Hold baby at your side, good for C-section recovery</li>
                          <li><strong>Side-Lying:</strong> Both mother and baby lie on their sides, good for night feeding</li>
                        </ul>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Signs of Good Latch</h3>
                        <ul className="space-y-2 text-[#475569]">
                          <li>• Baby's mouth covers most of the areola</li>
                          <li>• No clicking or smacking sounds</li>
                          <li>• Rhythmic sucking and swallowing</li>
                          <li>• No pain after initial latch</li>
                          <li>• Baby's cheeks remain rounded during sucking</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="sleep-and-safety" className="text-3xl font-semibold text-[#1e293b] mb-6">Sleep Patterns and Safe Sleep</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Understanding newborn sleep patterns and creating a safe sleep environment are crucial for your baby's health and development.
                    </p>

                    <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-8">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                        <h3 className="text-xl font-semibold text-red-800">Critical Safe Sleep Guidelines</h3>
                      </div>
                      <ul className="text-red-700 space-y-2">
                        <li><strong>Back Sleeping:</strong> Always place baby on back for sleep</li>
                        <li><strong>Firm Surface:</strong> Use firm mattress with tight-fitting sheet</li>
                        <li><strong>Empty Crib:</strong> No blankets, pillows, bumpers, or toys</li>
                        <li><strong>Room Sharing:</strong> Baby sleeps in parents' room but not in parents' bed</li>
                        <li><strong>Temperature:</strong> Keep room comfortable, dress baby lightly</li>
                      </ul>
                    </div>

                    <h2 id="health-monitoring" className="text-3xl font-semibold text-[#1e293b] mb-6">Health Monitoring and Warning Signs</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Regular monitoring helps ensure your baby stays healthy and identifies problems early when they're most treatable.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Normal Signs</h3>
                        <ul className="text-sm text-green-700">
                          <li>• Regular feeding and satisfaction</li>
                          <li>• 8-12 wet diapers daily</li>
                          <li>• Alert periods between feedings</li>
                          <li>• Steady weight gain after first week</li>
                          <li>• Normal skin color and temperature</li>
                        </ul>
                      </div>

                      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Call Doctor Immediately</h3>
                        <ul className="text-sm text-red-700">
                          <li>• Fever over 100.4°F (38°C)</li>
                          <li>• Difficulty breathing or blue coloring</li>
                          <li>• Severe vomiting or dehydration signs</li>
                          <li>• Extreme lethargy or difficulty waking</li>
                          <li>• Seizures or unusual movements</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="bonding-attachment" className="text-3xl font-semibold text-[#1e293b] mb-6">Bonding and Attachment</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Building a strong emotional connection with your baby supports healthy development and family relationships.
                    </p>

                    <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff] mb-8">
                      <div className="flex items-center mb-3">
                        <Heart className="h-6 w-6 text-[#3b82f6] mr-3" />
                        <h3 className="text-xl font-semibold text-[#1e293b]">Bonding Activities</h3>
                      </div>
                      <ul className="text-[#475569] space-y-2">
                        <li><strong>Skin-to-Skin Contact:</strong> Promotes bonding and regulates baby's systems</li>
                        <li><strong>Eye Contact:</strong> Look into baby's eyes during feeding and care</li>
                        <li><strong>Talking and Singing:</strong> Use soothing voice to communicate</li>
                        <li><strong>Gentle Touch:</strong> Massage, stroking, and cuddling</li>
                        <li><strong>Responsive Care:</strong> Respond promptly to baby's needs</li>
                      </ul>
                    </div>

                    <h2 id="when-to-call" className="text-3xl font-semibold text-[#1e293b] mb-6">When to Call Healthcare Providers</h2>
                    
                    <div className="space-y-6 mb-8">
                      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Call Immediately for:</h3>
                        <ul className="text-red-700 space-y-1">
                          <li>• Difficulty breathing or blue coloring</li>
                          <li>• Fever over 100.4°F (38°C)</li>
                          <li>• Severe vomiting or signs of dehydration</li>
                          <li>• Extreme lethargy or difficulty waking</li>
                          <li>• Seizures or unusual movements</li>
                        </ul>
                      </div>

                      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Call Within 24 Hours for:</h3>
                        <ul className="text-amber-700 space-y-1">
                          <li>• Persistent crying that can't be soothed</li>
                          <li>• Changes in feeding patterns</li>
                          <li>• Fewer wet diapers than usual</li>
                          <li>• Worsening jaundice</li>
                          <li>• Concerns about growth or development</li>
                        </ul>
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <h2 className="text-3xl font-semibold text-[#1e293b] mb-6">Frequently Asked Questions</h2>
                    
                    <div className="space-y-6 mb-12">
                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">How often should I feed my newborn?</h3>
                        <p className="text-[#475569]">Newborns typically need to eat every 2-3 hours, including overnight. Watch for hunger cues like rooting, sucking motions, or fussiness rather than strictly following a schedule.</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Is it normal for my baby to lose weight after birth?</h3>
                        <p className="text-[#475569]">Yes, most babies lose 5-10% of their birth weight in the first week. They should regain this weight by 2 weeks old. Your healthcare provider will monitor this closely.</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">When should I be concerned about my baby's crying?</h3>
                        <p className="text-[#475569]">Contact your healthcare provider if crying is high-pitched, persistent for over 3 hours despite comfort measures, or accompanied by fever, vomiting, or other concerning symptoms.</p>
                      </div>
                    </div>

                    {/* Conclusion */}
                    <h2 className="text-3xl font-semibold text-[#1e293b] mb-6">Conclusion</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Caring for a newborn is both rewarding and challenging. Remember that every baby is unique, and it's normal to feel overwhelmed at times. Trust your instincts, seek support when needed, and don't hesitate to contact healthcare professionals with concerns.
                    </p>

                    <p className="text-[#475569] leading-relaxed mb-8">
                      Professional newborn care support can provide invaluable assistance during this transition period. Whether you need help with feeding, sleep routines, or simply peace of mind, experienced nurses can help your family thrive during these precious early weeks.
                    </p>

                    {/* Important Disclaimer */}
                    <div className="bg-[#f8f9fa] p-6 rounded-lg border border-[#dee2e6] mb-8">
                      <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Important Disclaimer</h3>
                      <p className="text-[#475569] mb-4">
                        <strong>This guide is for educational purposes only and does not constitute medical advice.</strong> Always consult with qualified healthcare providers for medical concerns and follow your pediatrician's specific guidance for your baby's care.
                      </p>
                      
                      <p className="text-[#475569] mb-4">
                        Every baby is unique, and individual needs may vary. If you have concerns about your baby's health, feeding, sleep, or development, contact your healthcare provider promptly.
                      </p>
                      
                      <p className="text-[#475569]">
                        Nurse Nest provides educational resources and connects families with qualified newborn care professionals but does not provide medical services. Always seek professional medical advice for health-related concerns.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                  <div className="space-y-8">
                    {/* Related Resources */}
                    <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Related Resources</h3>
                      <ul className="space-y-3">
                        <li><a href="/blog/hire-postpartum-private-nurse" className="text-[#3b82f6] hover:underline text-sm">Postpartum Care Guide</a></li>
                        <li><a href="/blog/understanding-private-duty-nursing" className="text-[#3b82f6] hover:underline text-sm">Private Duty Nursing</a></li>
                        <li><a href="/blog/choose-right-private-duty-nurse" className="text-[#3b82f6] hover:underline text-sm">Choosing the Right Nurse</a></li>
                      </ul>
                    </div>

                    {/* Care Services */}
                    <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Professional Care Services</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full text-sm">
                          Find Newborn Care Nurses
                        </Button>
                        <Button variant="outline" className="w-full text-sm">
                          Postpartum Support Services
                        </Button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16" style={{background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'}}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need Professional Newborn Care Support?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with experienced nurses who can provide expert newborn care and support for your growing family.
            </p>
            <Button size="lg" className="bg-white text-[#3b82f6] hover:bg-gray-100 px-8 py-3">
              Find Care Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
