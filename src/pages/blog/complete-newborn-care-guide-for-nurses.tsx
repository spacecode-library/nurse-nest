import React from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";

// This file is very long (over 350 lines). Consider asking Lovable to refactor it into focused components for maintainability.

export default function NewbornCareGuideBlog() {
  return (
    <>
      <NurseNestNavbar isHomePage={false} />
      <div className="bg-white min-h-screen pt-24">
        {/* Hero Section */}
        <section
          className="w-full bg-gradient-to-br from-sky-50 via-blue-50 to-blue-100 py-12 border-b"
          style={{ background: "linear-gradient(135deg,#f1f5f9 0%,#e0f2fe 100%)" }}
        >
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-5 text-nurse-dark">
              Complete Newborn Care Guide for Nurses: Essential Skills and Best Practices
            </h1>
            <div className="flex items-center justify-center gap-3 text-gray-500 text-sm mb-3">
              <span>June 15, 2025</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
            <p className="text-lg text-gray-700">
              Ultimate, evidence-based newborn care resource for nurses: from APGAR assessment, feeding, and hygiene to sleep safety and advanced parent guidance.
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-10 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row gap-10 justify-between max-w-6xl">
            {/* Article Content */}
            <article className="prose prose-blue min-w-0 max-w-3xl">
              {/* Introduction */}
              <p>
                Caring for newborns requires specialized knowledge, gentle techniques, and unwavering attention to detail. Nurses play a crucial role in ensuring the health and safety of the most vulnerable patients. This comprehensive guide covers essential newborn care practices, from initial assessments to ongoing monitoring and family education.
              </p>
              <p>
                Whether you’re a new graduate entering neonatal care or an experienced RN refreshing your knowledge, this guide offers actionable, evidence-based strategies for delivering exceptional newborn care.
              </p>

              {/* Table of Contents */}
              <div className="not-prose mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-700 mb-2">Table of Contents</h2>
                <ul className="list-inside list-disc space-y-1 text-blue-700">
                  <li><a href="#initial-assessment">Initial Newborn Assessment</a></li>
                  <li><a href="#vital-signs">Monitoring Vital Signs</a></li>
                  <li><a href="#feeding-support">Feeding Support and Guidance</a></li>
                  <li><a href="#hygiene-care">Hygiene &amp; Skin Care</a></li>
                  <li><a href="#safety-measures">Safety Measures &amp; Prevention</a></li>
                  <li><a href="#parent-education">Parent Education &amp; Support</a></li>
                  <li><a href="#warning-signs">Recognizing Warning Signs</a></li>
                  <li><a href="#best-practices">Professional Best Practices</a></li>
                  <li><a href="#faq">FAQs</a></li>
                  <li><a href="#conclusion">Conclusion</a></li>
                </ul>
              </div>

              <h2 id="initial-assessment" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
                Initial Newborn Assessment
              </h2>
              <p>
                The first hours after birth are critical for establishing baseline health and identifying concerns. A thorough initial assessment includes APGAR scoring and a full physical. 
              </p>
              <h3 className="text-xl font-semibold mb-2">APGAR Score Assessment</h3>
              <p>
                Assess Appearance, Pulse, Grimace, Activity, and Respiration at 1 and 5 minutes post-birth. A score of 7–10 is normal.
              </p>
              <h3 className="text-xl font-semibold mb-2">Physical Examination Components</h3>
              <p>
                Systematic head-to-toe exam: check facial features, airway patency, heart/lung sounds, abdomen, limbs, and reflexes.
              </p>

              <h2 id="vital-signs" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
                Monitoring Vital Signs
              </h2>
              <p>Newborns have unique vital sign norms. Assess and recognize early deviations with these ranges:</p>
              <ul>
                <li><b>Heart Rate:</b> 120–160 bpm</li>
                <li><b>Respiratory Rate:</b> 30–60 breaths/min</li>
                <li><b>Temperature:</b> 97.7–99.5°F (36.5–37.5°C)</li>
                <li><b>BP:</b> 60–90/20–60 mmHg</li>
              </ul>
              <h3 className="text-xl font-semibold mb-2">Tips</h3>
              <p>
                Use axillary temps for routine checks; count respirations for a full minute, and assess for murmurs/rhythm abnormalities.
              </p>

              <h2 id="feeding-support" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
                Feeding Support and Guidance
              </h2>
              <p>
                Whether supporting breastfeeding or formula feeding, nurses are key to healthy nutrition and parental confidence.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-[320px] text-sm border-collapse mb-3">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border font-semibold text-gray-700">Breastfeeding</th>
                      <th className="p-2 border font-semibold text-gray-700">Formula Feeding</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">8–12x/day</td>
                      <td className="border p-2">2–3 oz every 3 hours</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Listen for swallowing</td>
                      <td className="border p-2">Pace slow to avoid gas</td>
                    </tr>
                    <tr>
                      <td className="border p-2">6+ wet diapers/24hr = hydrated</td>
                      <td className="border p-2">Increase by 1oz/month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-blue-900">
                <strong>Pro Tip:</strong> Burp baby upright after every ounce to reduce spit-up.
              </p>

              <h2 id="hygiene-care" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
                Hygiene &amp; Skin Care
              </h2>
              <h3 className="text-xl font-semibold mb-2">Cord &amp; Bathing</h3>
              <ul>
                <li>
                  <b>Cord Care:</b> Wipe with water; avoid baths until the cord falls off (7–21 days).
                </li>
                <li>
                  <b>Bathing:</b> Sponge bath only until the cord is gone; pH-neutral soap 2–3×/week.
                </li>
                <li>
                  <b>Diapering:</b> Wipe front-to-back, dry before a new diaper.
                </li>
              </ul>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded">
                <span className="font-semibold text-amber-900">Warning Signs Requiring Pediatrician Attention:</span>
                <ul className="list-disc ml-5 text-amber-800 text-base">
                  <li>Fever &gt;100.4°F (38°C)</li>
                  <li>No wet diaper in 8+ hours</li>
                  <li>Yellow skin (jaundice) or any labored breathing</li>
                </ul>
              </div>

              <h2 id="safety-measures" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
                Safety Measures &amp; Prevention
              </h2>
              <h3 className="text-xl font-semibold mb-2">Sleep Safety</h3>
              <ul>
                <li>
                  <b>Back-to-Sleep Rule:</b> Reduces SIDS risk by 50% (AAP).
                </li>
                <li>
                  <b>Crib:</b> Firm mattress, fitted sheet only, no loose bedding.
                </li>
                <li>
                  <b>Room Temp:</b> 68–72°F (20–22°C).</li>
                <li>
                  <b>Swaddling:</b> Ok until rolling, then switch to sleep sacks.
                </li>
              </ul>
              <h3 className="text-xl font-semibold mb-2">Infection Prevention</h3>
              <ul>
                <li>Strict hand hygiene</li>
                <li>Limit visitors, monitor for illness</li>
                <li>Watch for: temp instability, feeding issues, behavior changes</li>
              </ul>

              <h2 id="parent-education" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
                Parent Education &amp; Support
              </h2>
              <ul>
                <li>Feeding cues and schedules</li>
                <li>How to diaper/bathe safely</li>
                <li>Safe sleep positioning</li>
                <li>What's normal vs when to call the doctor</li>
                <li>Car seat safety</li>
              </ul>
              <p>
                Use clear, non-medical language. Demonstrate and then have parents perform a return demo. Provide written handouts and respect cultural differences.
              </p>

              <h2 id="warning-signs" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Recognizing Warning Signs</h2>
              <ul>
                <li>
                  <b>Respiratory</b>: {'>'}60 breaths/min, nasal flaring, retractions, grunting, cyanosis
                </li>
                <li>
                  <b>Feeding</b>: Poor suck, excessive spit up, less than 6 wet diapers/day after day 6
                </li>
              </ul>

              <h2 id="best-practices" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Professional Best Practices</h2>
              <ul>
                <li>Document thoroughly, use standardized medical terminology</li>
                <li>Stay current with continuing education &amp; certifications</li>
              </ul>

              {/* FAQ Section */}
              <h2 id="faq" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">FAQs</h2>
              <div className="space-y-3">
                <div className="border rounded bg-blue-50 px-4 py-3">
                  <h3 className="font-medium text-base mb-1">How often should newborns feed during the first week?</h3>
                  <p>8–12 feeds per 24 hours—including overnight—to support healthy growth and milk supply.</p>
                </div>
                <div className="border rounded bg-blue-50 px-4 py-3">
                  <h3 className="font-medium text-base mb-1">What temperature indicates fever for a newborn?</h3>
                  <p>100.4°F (38°C) or higher warrants immediate medical attention.</p>
                </div>
                <div className="border rounded bg-blue-50 px-4 py-3">
                  <h3 className="font-medium text-base mb-1">When does the umbilical cord stump fall off?</h3>
                  <p>1–3 weeks after birth, keep it clean and dry.</p>
                </div>
                <div className="border rounded bg-blue-50 px-4 py-3">
                  <h3 className="font-medium text-base mb-1">How much weight loss is normal after birth?</h3>
                  <p>Up to 10% by day 3–5, should be back to birthweight by 10–14 days.</p>
                </div>
                <div className="border rounded bg-blue-50 px-4 py-3">
                  <h3 className="font-medium text-base mb-1">Normal newborn sleep patterns?</h3>
                  <p>14–17 hours/day, short periods, maturing over the first months.</p>
                </div>
              </div>

              {/* Conclusion */}
              <h2 id="conclusion" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">Conclusion</h2>
              <p>
                Newborn care is equal parts science and empathy. Trust your training, monitor carefully, and never hesitate to educate parents—it makes all the difference. For more guides, browse the related resources.
              </p>
              {/* Important Disclaimer */}
              <div className="bg-amber-100 border-l-4 border-amber-400 rounded p-4 mt-6 mb-2">
                <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
                <p className="text-amber-700 text-sm">
                  <strong>Educational Content Only:</strong> This guide is for informational and educational purposes only. It does not replace medical advice, diagnosis, or treatment. Always consult professionals for health-related concerns, and follow facility-specific policies and protocols.
                </p>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 mt-8 lg:mt-0">
              {/* Quick Navigation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                <h3 className="font-semibold text-blue-800 mb-1">Quick Navigation</h3>
                <ul className="list-disc ml-6 space-y-1 text-blue-700 text-base">
                  <li><a href="#initial-assessment">Initial Assessment</a></li>
                  <li><a href="#vital-signs">Vital Signs</a></li>
                  <li><a href="#feeding-support">Feeding Support</a></li>
                  <li><a href="#hygiene-care">Hygiene</a></li>
                  <li><a href="#safety-measures">Safety</a></li>
                  <li><a href="#parent-education">Parent Education</a></li>
                  <li><a href="#warning-signs">Warning Signs</a></li>
                  <li><a href="#best-practices">Best Practices</a></li>
                </ul>
              </div>
              {/* Related Resources */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-1 text-gray-800">Related Resources</h3>
                <ul className="list-inside list-disc text-blue-700">
                  <li>
                    <a href="/newborn-nurse-support-guide">Newborn Care Services</a>
                  </li>
                  <li>
                    <a href="/nurse-llc-setup-guide">Business Setup Guide</a>
                  </li>
                  <li>
                    <a href="/malpractice-insurance">Insurance Requirements</a>
                  </li>
                  <li>
                    <a href="/best-products-for-home-healthcare">Essential Supplies</a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
        {/* CTA Section */}
        <section
          className="py-12"
          style={{ background: "linear-gradient(135deg,#9bcbff 0%,#3b82f6 100%)" }}
        >
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Advance Your Nursing Career?
            </h2>
            <p className="text-blue-100 mb-6">
              Explore more evidence-based resources for newborn care and connect with professional development opportunities.
            </p>
            <a
              href="/newborn-nurse-support-guide"
              className="inline-block px-8 py-3 rounded-lg bg-white text-[#3577d8] font-semibold shadow hover:bg-blue-100 transition"
            >
              Learn More
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
