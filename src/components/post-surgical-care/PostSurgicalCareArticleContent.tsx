
import React from 'react';
import { Shield, Pill, Activity, CheckCircle, Clock, Heart, AlertTriangle, Users, Stethoscope, Home, Calendar, FileText } from 'lucide-react';
import { LuxIcon } from './LuxIcon';
import AnimatedSection from '@/components/AnimatedSection';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';

// Card data for responsibilities
const responsibilities = [
  {
    Icon: Pill,
    iconClass: "text-blue-500",
    title: "Pain and Medication Management",
    description: "A post-surgical nurse ensures you take the right medications at the right times, monitors for side effects, and provides comfort and support as you recover.",
  },
  {
    Icon: Shield,
    iconClass: "text-green-500",
    title: "Wound Care & Infection Prevention",
    description: "Proper wound cleaning, dressing changes, and monitoring for signs of infection are essential. Your nurse will safeguard your health by catching any complications early.",
  },
  {
    Icon: Activity,
    iconClass: "text-red-500",
    title: "Monitoring Vital Signs",
    description: "Frequent checks of temperature, blood pressure, and more help track your healing process and alert to any concerning changes that might need a doctor.",
  },
  {
    Icon: CheckCircle,
    iconClass: "text-purple-500",
    title: "Family Education and Recovery Support",
    description: "Nurses provide clear instructions on mobility, nutrition, warning signs, and help relieve anxiety for both patient and loved ones during recovery.",
  },
];

// Recovery timeline phases
const recoveryPhases = [
  {
    Icon: Clock,
    iconClass: "text-orange-500",
    phase: "First 24-48 Hours",
    title: "Immediate Post-Op Care",
    description: "Critical monitoring period focusing on pain control, vital signs, and initial wound assessment.",
    keyPoints: [
      "Pain assessment and medication administration",
      "Vital sign monitoring every 2-4 hours",
      "Initial wound inspection and dressing changes",
      "Nausea and vomiting management",
      "Early mobility as tolerated"
    ]
  },
  {
    Icon: Heart,
    iconClass: "text-pink-500",
    phase: "Days 3-7",
    title: "Early Recovery",
    description: "Establishing routines and monitoring for complications while gradually increasing activity.",
    keyPoints: [
      "Transition to oral pain medications",
      "Progressive increase in physical activity",
      "Wound healing assessment",
      "Diet advancement as tolerated",
      "Patient and family education"
    ]
  },
  {
    Icon: Home,
    iconClass: "text-teal-500",
    phase: "Weeks 1-4",
    title: "Home Recovery",
    description: "Focus on independence, preventing complications, and following up with healthcare providers.",
    keyPoints: [
      "Self-care skill development",
      "Medication compliance monitoring",
      "Activity progression and physical therapy",
      "Follow-up appointment coordination",
      "Warning sign recognition"
    ]
  }
];

// Warning signs
const warningSignsData = [
  {
    Icon: AlertTriangle,
    iconClass: "text-red-600",
    category: "Immediate Emergency",
    signs: [
      "Severe chest pain or difficulty breathing",
      "Heavy bleeding that won't stop",
      "Signs of severe allergic reaction",
      "Loss of consciousness",
      "Severe abdominal pain"
    ]
  },
  {
    Icon: Stethoscope,
    iconClass: "text-yellow-600",
    category: "Call Doctor Within 24 Hours",
    signs: [
      "Temperature over 101°F (38.3°C)",
      "Increasing pain not relieved by medication",
      "Signs of wound infection (redness, warmth, pus)",
      "Persistent nausea and vomiting",
      "Swelling in legs or ankles"
    ]
  }
];

export default function PostSurgicalCareArticleContent() {
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroReveal = useStaggeredReveal(3, { step: 150, initialDelay: 70, disabled: prefersReducedMotion });
  const cardReveal = useStaggeredReveal(responsibilities.length, { step: 130, initialDelay: 180, disabled: prefersReducedMotion });
  const phaseReveal = useStaggeredReveal(recoveryPhases.length, { step: 120, initialDelay: 200, disabled: prefersReducedMotion });
  const warningReveal = useStaggeredReveal(warningSignsData.length, { step: 100, initialDelay: 150, disabled: prefersReducedMotion });

  return (
    <div className="prose prose-lg max-w-none">
      <AnimatedSection delay={0} animation="fade-up">
        <p className={
          `lead text-xl text-gray-600 transition-opacity duration-700
            ${heroReveal[0] ? "opacity-100" : "opacity-0 translate-y-7"}`
        }>
          Successful surgery is just the beginning of your healing journey. The quality of post-operative care you receive at home can dramatically impact your recovery speed, comfort level, and overall outcomes. Professional in-home post-surgical nursing care provides the expertise, monitoring, and support needed for optimal healing while allowing you to recover in the comfort of your own home.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={80} animation="fade-up" id="what-is-post-surgical-care" className="mb-12">
        <h2 className={
          `text-2xl font-bold text-gray-800 transition-opacity duration-700 mb-6
            ${heroReveal[1] ? "opacity-100" : "opacity-0 translate-y-9"}`
        }>
          What is Post-Surgical Care?
        </h2>
        <p className="text-lg mb-4">
          Post-surgical care, also known as post-operative care, encompasses the comprehensive medical and supportive services provided after a surgical procedure. This specialized care focuses on promoting healing, preventing complications, managing pain, and helping patients safely transition back to their normal activities.
        </p>
        <p className="mb-6">
          Post-surgical nursing care is particularly valuable because it bridges the gap between hospital discharge and full recovery, providing professional oversight during the most vulnerable period of your healing process.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Essential Components of Post-Surgical Care</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>24/7 professional monitoring and assessment</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Advanced wound care and infection prevention</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Comprehensive pain management</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Medication administration and monitoring</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Mobility assistance and physical therapy support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Nutritional guidance and meal planning</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Family education and caregiver training</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Coordination with your healthcare team</span>
              </li>
            </ul>
          </div>
        </div>
      </AnimatedSection>

      <section id="recovery-timeline" className="mb-12">
        <AnimatedSection delay={150} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recovery Timeline and Care Phases</h2>
          <p className="text-lg mb-8 text-gray-600">
            Understanding what to expect during each phase of recovery helps you prepare mentally and physically for the healing process. Every surgery is different, but most follow a predictable pattern of recovery milestones.
          </p>
          
          <div className="space-y-8">
            {recoveryPhases.map((phase, i) => (
              <div
                key={phase.phase}
                className={`bg-white rounded-lg p-6 shadow-sm border transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)] hover:shadow-lg hover-lux-scale
                  ${phaseReveal[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <LuxIcon>
                    <phase.Icon className={`w-8 h-8 ${phase.iconClass}`} />
                  </LuxIcon>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {phase.phase}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{phase.title}</h3>
                    <p className="text-gray-600 mb-4">{phase.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Key Focus Areas:</h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {phase.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section id="key-responsibilities" className="mb-12">
        <AnimatedSection delay={250} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Key Responsibilities of a Post-Surgical Nurse
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            A skilled post-surgical nurse brings specialized expertise to your recovery, providing both clinical care and emotional support during this critical healing period.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {responsibilities.map((card, i) => (
              <div
                key={card.title}
                className={`bg-white rounded-lg p-6 shadow-sm border transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)] hover:shadow-lg hover-lux-scale
                  ${cardReveal[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <LuxIcon>
                    <card.Icon className={`w-6 h-6 ${card.iconClass}`} />
                  </LuxIcon>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                </div>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section id="pain-management" className="mb-12">
        <AnimatedSection delay={350} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comprehensive Pain Management</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
            <p className="text-lg mb-4">
              Effective pain management is crucial for healing and quality of life during recovery. Your post-surgical nurse will work with you to implement a multi-modal approach to pain control.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Medication Management</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Scheduled pain medication administration</li>
                  <li>• Monitoring for side effects and effectiveness</li>
                  <li>• Gradual tapering as healing progresses</li>
                  <li>• Breakthrough pain management strategies</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Non-Pharmacological Approaches</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Ice therapy and heat application</li>
                  <li>• Positioning and mobility techniques</li>
                  <li>• Relaxation and breathing exercises</li>
                  <li>• Distraction and comfort measures</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="wound-care" className="mb-12">
        <AnimatedSection delay={400} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Advanced Wound Care and Infection Prevention</h2>
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <p className="text-lg mb-4">
              Proper wound care is essential for preventing infections and promoting optimal healing. Your nurse will provide expert care tailored to your specific surgical site and healing needs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Assessment</h4>
                <ul className="text-sm space-y-1">
                  <li>• Daily wound inspection</li>
                  <li>• Monitoring healing progress</li>
                  <li>• Identifying complications early</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Care Techniques</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sterile dressing changes</li>
                  <li>• Appropriate cleansing methods</li>
                  <li>• Drainage management</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Education</h4>
                <ul className="text-sm space-y-1">
                  <li>• Teaching proper home care</li>
                  <li>• Recognizing infection signs</li>
                  <li>• When to seek medical attention</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="warning-signs" className="mb-12">
        <AnimatedSection delay={450} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Warning Signs and When to Seek Help</h2>
          <p className="text-lg mb-6 text-gray-600">
            Knowing what to watch for can help prevent complications and ensure prompt treatment when issues arise. Your nurse will educate you and your family about these important warning signs.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {warningSignsData.map((category, i) => (
              <div
                key={category.category}
                className={`bg-white rounded-lg p-6 shadow-sm border-l-4 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                  ${category.category.includes('Emergency') ? 'border-red-500' : 'border-yellow-500'}
                  ${warningReveal[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <LuxIcon>
                    <category.Icon className={`w-6 h-6 ${category.iconClass}`} />
                  </LuxIcon>
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.signs.map((sign, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section id="nutrition-activity" className="mb-12">
        <AnimatedSection delay={500} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Nutrition and Activity Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">Nutritional Support</h3>
              <p className="mb-4">Proper nutrition accelerates healing and supports your immune system during recovery.</p>
              <ul className="space-y-2 text-sm">
                <li>• High-protein foods for tissue repair</li>
                <li>• Adequate hydration (8-10 glasses daily)</li>
                <li>• Vitamin C and zinc for wound healing</li>
                <li>• Fiber-rich foods to prevent constipation</li>
                <li>• Avoiding alcohol and limiting caffeine</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Activity Progression</h3>
              <p className="mb-4">Gradual return to activity helps prevent complications while building strength.</p>
              <ul className="space-y-2 text-sm">
                <li>• Early mobilization to prevent blood clots</li>
                <li>• Progressive walking and movement</li>
                <li>• Breathing exercises for lung health</li>
                <li>• Gentle stretching as tolerated</li>
                <li>• Following surgeon's activity restrictions</li>
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <AnimatedSection delay={550} animation="fade-in">
        <div className="lux-floating-insight bg-blue-50 border-l-4 border-blue-400 p-6 my-8 relative shadow-sm rounded-r-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Expert Insight</h3>
          <p className="text-gray-700">
            <strong>Research shows</strong> that patients who receive professional in-home post-operative care have 40% fewer complications, recover 25% faster, and report significantly higher satisfaction scores compared to those who rely solely on family caregivers. Professional nursing support provides both clinical expertise and peace of mind during the vulnerable recovery period.
          </p>
        </div>
      </AnimatedSection>

      <section id="family-education" className="mb-12">
        <AnimatedSection delay={600} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Family Education and Support</h2>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6">
            <p className="text-lg mb-6">
              Your post-surgical nurse will ensure that both you and your family members are well-prepared to manage care effectively and recognize when professional help is needed.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-teal-800 mb-3">
                  <Users className="w-5 h-5 inline mr-2" />
                  Caregiver Training
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Proper handwashing and infection control</li>
                  <li>• Safe patient transfer techniques</li>
                  <li>• Medication administration assistance</li>
                  <li>• Basic wound care and dressing changes</li>
                  <li>• Equipment use and maintenance</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-800 mb-3">
                  <FileText className="w-5 h-5 inline mr-2" />
                  Education Resources
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Written care instructions and schedules</li>
                  <li>• Emergency contact information</li>
                  <li>• Medication schedules and side effects</li>
                  <li>• Activity and dietary guidelines</li>
                  <li>• Follow-up appointment coordination</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="insurance-costs" className="mb-12">
        <AnimatedSection delay={650} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Insurance Coverage and Cost Considerations</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg mb-4">
              Understanding your insurance benefits and coverage options for post-surgical care helps you make informed decisions about your recovery support.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Medicare Coverage</h4>
                <p className="text-sm text-gray-600">
                  Medicare may cover skilled nursing care at home if you meet specific criteria and have a physician's order for medically necessary services.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Private Insurance</h4>
                <p className="text-sm text-gray-600">
                  Many private insurance plans cover home health nursing services. Check your specific policy for coverage details and prior authorization requirements.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Private Pay Options</h4>
                <p className="text-sm text-gray-600">
                  Private pay allows you to choose your preferred nurse and schedule, providing maximum flexibility and personalized care during recovery.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <AnimatedSection delay={700} animation="fade-up" id="finding-care" className="mb-12">
        <h2 className={
          `text-2xl font-bold text-gray-800 transition-opacity duration-700 mb-6
            ${heroReveal[2] ? "opacity-100" : "opacity-0 translate-y-7"}`
        }>
          Finding the Right Post-Surgical Nurse
        </h2>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
          <p className="text-lg mb-4">
            Selecting the right post-surgical nurse is crucial for your recovery success. Look for professionals with specific experience in your type of surgery and a proven track record of excellent patient outcomes.
          </p>
          
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Essential Qualifications to Look For:</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ul className="space-y-2 text-sm">
              <li>• Current RN license in your state</li>
              <li>• Post-operative care experience</li>
              <li>• Specialized training in your surgery type</li>
              <li>• CPR and emergency response certification</li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li>• Strong communication skills</li>
              <li>• Professional liability insurance</li>
              <li>• Background check and references</li>
              <li>• Comfort with home-based care environment</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium text-purple-800 mb-2">Nurse Nest Advantage:</p>
            <p className="text-sm text-gray-700">
              Nurse Nest connects you with rigorously vetted, experienced post-surgical nurses who specialize in home-based recovery care. Our platform ensures all nurses are licensed, insured, and have demonstrated expertise in post-operative patient care, giving you confidence in your recovery support.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={750} animation="fade-up">
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-teal-800 mb-3">Ready to Ensure a Smooth Recovery?</h3>
          <p className="text-gray-700 mb-4">
            Don't leave your post-surgical recovery to chance. Professional nursing care can make the difference between a complicated recovery and a smooth return to your normal life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/apply"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Find a Post-Surgical Nurse
            </a>
            <a
              href="/pricing"
              className="inline-block px-6 py-3 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
              View Pricing Options
            </a>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
