
import React from 'react';
import { Shield, Pill, Activity, CheckCircle } from 'lucide-react';
import { LuxIcon } from './LuxIcon';
import AnimatedSection from '@/components/AnimatedSection';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';

// Card data for responsibilities
const cards = [
  {
    Icon: Pill,
    iconClass: "text-blue-500",
    title: "Pain & Medication Management",
    description: "Administering medications on schedule, monitoring for side effects, and managing pain levels effectively.",
  },
  {
    Icon: Shield,
    iconClass: "text-green-500",
    title: "Wound Care & Infection Prevention",
    description: "Properly cleaning and dressing surgical wounds, and monitoring for signs of infection like redness or swelling.",
  },
  {
    Icon: Activity,
    iconClass: "text-red-500",
    title: "Monitoring Vital Signs",
    description: "Regularly checking blood pressure, heart rate, temperature, and breathing to ensure stability.",
  },
  {
    Icon: CheckCircle,
    iconClass: "text-purple-500",
    title: "Patient & Family Education",
    description: "Instructing on proper recovery techniques, dietary needs, and when to contact a doctor.",
  },
];

export default function PostSurgicalCareArticleContent() {
  // Detect reduce motion
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // For hero: 3 elements (title, subtitle, meta)
  const heroReveal = useStaggeredReveal(3, { step: 150, initialDelay: 70, disabled: prefersReducedMotion });
  // For cards
  const cardReveal = useStaggeredReveal(cards.length, { step: 130, initialDelay: 180, disabled: prefersReducedMotion });

  return (
    <div className="prose prose-lg max-w-none">
      <AnimatedSection delay={0} animation="fade-up">
        <p className={
          `lead text-xl text-gray-600 transition-opacity duration-700
          ${heroReveal[0] ? "opacity-100" : "opacity-0 translate-y-7"}`
        }>
          Effective post-surgical care is crucial for a smooth and speedy recovery. A dedicated nurse ensures that patients receive the professional medical attention, support, and monitoring they need after a procedure, right in the comfort of their own home.
        </p>
      </AnimatedSection>

      {/* WHAT IS section */}
      <AnimatedSection delay={80} animation="fade-up" id="what-is-post-surgical-care" className="mb-12">
        <h2 className={
          `text-2xl font-bold text-gray-800 transition-opacity duration-700
            ${heroReveal[1] ? "opacity-100" : "opacity-0 translate-y-9"}`
        }>
          What is Post-Surgical Care?
        </h2>
        <p>
          Post-surgical care, or post-operative care, is the care a patient receives after a surgical procedure. The goal is to monitor for complications, manage pain and symptoms, and support the body’s healing process. This care is critical in preventing infections and ensuring the best possible outcome.
        </p>
      </AnimatedSection>

      {/* Responsibilities with staggered grid */}
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

      {/* Floating Insight */}
      <AnimatedSection delay={350} animation="fade-in">
        <div className="lux-floating-insight bg-blue-50 border-l-4 border-blue-400 p-4 my-8 relative shadow-sm">
          <p className="text-gray-700">
            <strong>Key Insight:</strong> In-home post-surgical nursing care can significantly reduce the risk of hospital readmission by providing professional oversight during the critical initial recovery period.
          </p>
        </div>
      </AnimatedSection>

      {/* FINDING CARE section */}
      <AnimatedSection delay={450} animation="fade-up" id="finding-care" className="mb-12">
        <h2 className={
          `text-2xl font-bold text-gray-800 transition-opacity duration-700
            ${heroReveal[2] ? "opacity-100" : "opacity-0 translate-y-7"}`
        }>
          Finding the Right Care
        </h2>
        <p>
          When looking for a post-surgical care nurse, it's important to find someone with experience relevant to the specific type of surgery performed. Platforms like Nurse Nest connect families with qualified, vetted nurses who specialize in providing compassionate and skilled post-operative support.
        </p>
      </AnimatedSection>
    </div>
  );
}
