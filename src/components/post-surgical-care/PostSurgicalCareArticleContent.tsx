
import React from 'react';
import { Shield, Pill, Activity, CheckCircle } from 'lucide-react';
import { LuxIcon } from './LuxIcon';
import AnimatedSection from '@/components/AnimatedSection';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';

// Card data for responsibilities (restored original wording)
const cards = [
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

export default function PostSurgicalCareArticleContent() {
  // Detect reduce motion
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // For hero: 3 elements (lead, What is header, Finding Care header)
  const heroReveal = useStaggeredReveal(3, { step: 150, initialDelay: 70, disabled: prefersReducedMotion });
  const cardReveal = useStaggeredReveal(cards.length, { step: 130, initialDelay: 180, disabled: prefersReducedMotion });

  return (
    <div className="prose prose-lg max-w-none">
      <AnimatedSection delay={0} animation="fade-up">
        <p className={
          `lead text-xl text-gray-600 transition-opacity duration-700
            ${heroReveal[0] ? "opacity-100" : "opacity-0 translate-y-7"}`
        }>
          Having surgery is only the first step—what happens at home after is just as important. High-quality post-operative care can make the difference between a smooth recovery and unwanted complications. That’s why many families turn to skilled, in-home nurses for post-surgical support.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={80} animation="fade-up" id="what-is-post-surgical-care" className="mb-12">
        <h2 className={
          `text-2xl font-bold text-gray-800 transition-opacity duration-700
            ${heroReveal[1] ? "opacity-100" : "opacity-0 translate-y-9"}`
        }>
          What is Post-Surgical Care?
        </h2>
        <p>
          Post-surgical care, also known as post-operative care, refers to the specialized support and medical oversight you receive after your surgery. This care is focused on helping you heal comfortably, monitoring your health, managing pain, and reducing your risk of infection or other setbacks.
        </p>
        <ul>
          <li>Daily health checks and vital sign monitoring</li>
          <li>Pain management guidance</li>
          <li>Help with bathing, dressing, and mobility</li>
          <li>Professional wound care</li>
          <li>Family education and reassurance</li>
        </ul>
      </AnimatedSection>

      <section id="key-responsibilities" className="mb-12">
        <AnimatedSection delay={150} animation="fade-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Key Responsibilities of a Post-Surgical Nurse
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
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

      <AnimatedSection delay={350} animation="fade-in">
        <div className="lux-floating-insight bg-blue-50 border-l-4 border-blue-400 p-4 my-8 relative shadow-sm">
          <p className="text-gray-700">
            <strong>Insider Tip:</strong> Patients who receive attentive in-home post-op care often recover faster, avoid re-hospitalization, and feel more secure during the crucial first weeks after surgery.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={450} animation="fade-up" id="finding-care" className="mb-12">
        <h2 className={
          `text-2xl font-bold text-gray-800 transition-opacity duration-700
            ${heroReveal[2] ? "opacity-100" : "opacity-0 translate-y-7"}`
        }>
          Finding the Right Nurse for Your Needs
        </h2>
        <p>
          It’s essential to hire a post-surgical nurse with the right expertise for your specific procedure. Ask about their experience, licensing, and comfort with home-based care. There are platforms, like Nurse Nest, where you can connect with background-checked, specialized nurses ready to support your safe recovery.
        </p>
      </AnimatedSection>
    </div>
  );
}
