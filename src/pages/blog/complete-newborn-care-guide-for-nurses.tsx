
import React from "react";
import { Helmet } from "react-helmet-async";

export default function NewbornCareGuideBlog() {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>
          Complete Newborn Care Guide for Nurses: Essential Skills and Best Practices
        </title>
        <meta
          name="description"
          content="Ultimate Newborn Care Guide—nursing assessment, feeding, sleep safety, hygiene, and parental support. Pediatrician-backed, SEO-optimized with key practices for nurses."
        />
        <meta
          name="keywords"
          content="Newborn Care, Newborn Sleep Safety, Breastfeeding Tips, Formula Feeding, Umbilical Cord Care, New Parent Support, Newborn Essentials"
        />
      </Helmet>

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
            Evidence-based, actionable strategies for every nurse and new parent: from initial assessment, sleep safety, and feeding mastery, to developmental milestones and parent wellness.
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
              Bringing home a newborn is life-changing—and overwhelming. With 72% of new parents reporting anxiety about infant care basics (CDC, 2023), this evidence-based guide delivers step-by-step practices pediatricians recommend. From feeding to sleep safety, we cover everything without overwhelming you.
            </p>

            {/* Table of Contents */}
            <div className="not-prose mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Table of Contents</h2>
              <ul className="list-inside list-disc space-y-1 text-blue-700">
                <li><a href="#essentials">Newborn Care Essentials</a></li>
                <li><a href="#development">Newborn Development & Routines</a></li>
                <li><a href="#parent-support">New Parent Support</a></li>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="#conclusion">Conclusion</a></li>
              </ul>
            </div>

            <h2 id="essentials" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
              Newborn Care Essentials
            </h2>
            <p>
              Establishing strong newborn care habits sets the foundation for lifelong health. Follow these pediatrician-recommended best practices for sleep, feeding, hygiene, and recognizing warning signs early.
            </p>

            {/* Sleep Safety Section */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="newborn-sleep-safety">Newborn Sleep Safety</h3>
              <ul className="list-disc ml-6 text-base">
                <li>
                  <span className="font-semibold">Back-to-Sleep Rule:</span>{" "}
                  Always place babies on their backs to sleep—reduces SIDS risk by 50% (AAP).
                </li>
                <li>
                  <span className="font-semibold">Crib Setup:</span>{" "}
                  Firm mattress, fitted sheet only; no bumpers, toys, or blankets.
                </li>
                <li>
                  <span className="font-semibold">Temperature Control:</span>{" "}
                  68–72°F (20–22°C). Avoid overheating; monitor for sweating or rapid breathing.
                </li>
                <li>
                  <span className="font-semibold">Swaddling:</span>{" "}
                  Use for calming (first 8 weeks); stop if baby rolls or resists, then switch to sleep sacks.
                </li>
              </ul>
            </div>

            {/* Feeding Section */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="feeding-mastery">Feeding Mastery</h3>
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
            </div>

            {/* Hygiene Section */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="hygiene-protocols">Hygiene &amp; Health Protocols</h3>
              <ul className="list-disc ml-6 text-base">
                <li>
                  <span className="font-semibold">Cord Care:</span>{" "}
                  Wipe base with water; avoid baths until cord falls off (7–21 days).
                </li>
                <li>
                  <span className="font-semibold">Bathing:</span>{" "}
                  Sponge baths only until cord heals; pH-neutral soap 2–3×/week.
                </li>
                <li>
                  <span className="font-semibold">Diapering:</span>{" "}
                  Wipe front-to-back, air-dry skin before new diaper.
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded">
              <span className="font-semibold text-amber-900">Warning Signs Requiring Pediatrician Attention:</span>
              <ul className="list-disc ml-5 text-amber-800 text-base">
                <li>Fever &gt;100.4°F (38°C)</li>
                <li>No wet diaper in 8+ hours</li>
                <li>Yellow skin (jaundice) or labored breathing</li>
              </ul>
            </div>

            {/* Section: Development */}
            <h2 id="development" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
              Newborn Development & Daily Routines
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="milestones">Stimulating Growth: Month 1 Milestones</h3>
              <ul className="list-disc ml-6 text-base">
                <li><span className="font-semibold">Tummy Time:</span> Start week 2: 3 mins, 5x/day. Builds neck strength.</li>
                <li><span className="font-semibold">Visual Engagement:</span> High-contrast toys (8–12" away) hold attention.</li>
                <li><span className="font-semibold">Verbal Bonding:</span> Narrate diaper changes/feedings for early language skills.</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="soothing">Soothing Techniques for Fussy Babies</h3>
              <ul className="list-disc ml-6 text-base">
                <li>5 S’s Method (Karp): Swaddle, Side, Shush, Swing, Suck</li>
                <li>White Noise: 50–60 decibels mimics the womb</li>
                <li>Gas Relief: Bicycle legs, clockwise tummy massage</li>
              </ul>
            </div>

            {/* Section: Parent Wellness */}
            <h2 id="parent-support" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
              New Parent Support & Self-Care
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="caregiver-selfcare">Self-Care for Exhausted Caregivers</h3>
              <ul className="list-disc ml-6 text-base">
                <li>
                  <span className="font-semibold">Sleep Shifts:</span> Split nights with partner (e.g., 9pm–2am / 2am–7am).
                </li>
                <li>
                  <span className="font-semibold">Meal Prep:</span> Prep & freeze meals for postpartum weeks; say yes to help!
                </li>
                <li>
                  <span className="font-semibold">PPD Signs:</span> Withdrawal, crying, or rage &gt;2 weeks—seek professional help.
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" id="must-haves">Must-Have Newborn Products</h3>
              <ul className="list-disc ml-6 text-base">
                <li>Car seat (always certified, rear-facing)</li>
                <li>Bassinet or crib (JPMA certified)</li>
                <li>Rectal thermometer for accurate fevers</li>
                <li>Nasal aspirator</li>
              </ul>
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> Look for the JPMA seal when choosing any newborn gear.
              </p>
            </div>

            {/* FAQ */}
            <h2 id="faq" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <div className="border rounded bg-blue-50 px-4 py-3">
                <h3 className="font-medium text-base mb-1">How often should newborns feed during the first week?</h3>
                <p>
                  8–12 feeds per 24 hours—every 2–3 hours, including nights—to establish supply and ensure growth.
                </p>
              </div>
              <div className="border rounded bg-blue-50 px-4 py-3">
                <h3 className="font-medium text-base mb-1">What temperature is considered a fever for newborns?</h3>
                <p>
                  A rectal temperature of 100.4°F (38°C) or higher—contact your pediatrician immediately.
                </p>
              </div>
              <div className="border rounded bg-blue-50 px-4 py-3">
                <h3 className="font-medium text-base mb-1">When does the umbilical cord stump fall off?</h3>
                <p>
                  Usually within 1–3 weeks. Keep area dry and clean; call if you see redness or discharge.
                </p>
              </div>
              <div className="border rounded bg-blue-50 px-4 py-3">
                <h3 className="font-medium text-base mb-1">How much weight loss is normal after birth?</h3>
                <p>
                  Up to 7–10% of birth weight lost is typical; regain by day 14. More than 10% requires prompt assessment.
                </p>
              </div>
              <div className="border rounded bg-blue-50 px-4 py-3">
                <h3 className="font-medium text-base mb-1">What are normal newborn sleep patterns?</h3>
                <p>
                  14–17 hours a day, waking every 2–4 hours. Sleep patterns mature over the first three months.
                </p>
              </div>
            </div>

            {/* Conclusion and Disclaimer */}
            <h2 id="conclusion" className="text-2xl font-bold text-nurse-dark mt-10 mb-3">
              Conclusion: Embracing the Journey
            </h2>
            <p>
              Newborn care is equal parts science and instinct. Trust your pediatrician, track your baby's personal milestones, and remember: there’s no "perfect" parent—only a present, caring one!
            </p>
            <div className="bg-amber-100 border-l-4 border-amber-400 rounded p-4 mt-6 mb-2">
              <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
              <p className="text-amber-700 text-sm">
                <strong>Educational Content Only:</strong> This guide is for informational and educational purposes only. It does not replace medical advice, diagnosis, or treatment. Always consult professionals for health-related concerns, and follow facility-specific policies and protocols.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            {/* Quick Navigation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
              <h3 className="font-semibold text-blue-800 mb-1">Quick Navigation</h3>
              <ul className="list-disc ml-6 space-y-1 text-blue-700">
                <li><a href="#essentials">Care Essentials</a></li>
                <li><a href="#development">Development</a></li>
                <li><a href="#parent-support">Parent Support</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#conclusion">Conclusion</a></li>
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
            Explore even more opportunities in specialized newborn care and connect with families who need your expertise.
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
  );
}
