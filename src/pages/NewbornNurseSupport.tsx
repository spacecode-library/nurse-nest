
import React from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";
import { Baby } from "lucide-react";

export default function NewbornNurseSupport() {
  return (
    <>
      <NurseNestNavbar isHomePage={false} />
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-blue-200 pt-24 pb-16">
        {/* Hero section */}
        <section className="text-center py-12 bg-gradient-to-b from-white/60 to-blue-100/60 border-b">
          <div className="container mx-auto px-4 max-w-xl">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center rounded-full bg-[#e0f2fe] p-4">
                <Baby className="text-blue-400" size={48} />
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-nurse-dark">
              Newborn Nurse Support Services
            </h1>
            <p className="text-lg text-gray-700 mb-5">
              Compassionate, evidence-based in-home newborn care and parent coaching—empowering families and ensuring safety during your baby’s first days.
            </p>
            <a
              href="/blog/complete-newborn-care-guide-for-nurses"
              className="inline-block px-6 py-3 rounded-lg bg-[#3577d8] text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Read Our Essential Newborn Care Guide
            </a>
          </div>
        </section>

        {/* Services overview */}
        <section className="py-10">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-nurse-dark mb-4 text-center">
              What We Offer
            </h2>
            <ul className="grid md:grid-cols-2 gap-6">
              <li className="bg-white shadow p-5 rounded-lg border text-left">
                <h3 className="font-semibold text-blue-700 mb-1">Expert Newborn Assessment</h3>
                <p className="text-gray-600 text-sm">
                  APGAR scoring, vital sign monitoring, growth tracking, and safe transition after delivery.
                </p>
              </li>
              <li className="bg-white shadow p-5 rounded-lg border text-left">
                <h3 className="font-semibold text-blue-700 mb-1">Feeding Support & Education</h3>
                <p className="text-gray-600 text-sm">
                  Breastfeeding and formula guidance tailored to your needs. Feeding cues, bottle education, and hands-on assistance.
                </p>
              </li>
              <li className="bg-white shadow p-5 rounded-lg border text-left">
                <h3 className="font-semibold text-blue-700 mb-1">Hygiene and Cord Care</h3>
                <p className="text-gray-600 text-sm">
                  Safe cord care, bathing tips, and diapering best practices for healthy skin.
                </p>
              </li>
              <li className="bg-white shadow p-5 rounded-lg border text-left">
                <h3 className="font-semibold text-blue-700 mb-1">Family Coaching</h3>
                <p className="text-gray-600 text-sm">
                  Sleep safety, recognizing warning signs, and expert answers to all your newborn questions.
                </p>
              </li>
            </ul>
            <div className="mt-8 text-center">
              <a
                href="/apply"
                className="inline-block bg-[#9bcbff] text-[#26548f] font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-200 transition"
              >
                Request a Nurse Consultation
              </a>
            </div>
          </div>
        </section>

        {/* Resource links */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-xl">
            <div className="bg-white/90 border border-blue-100 rounded-xl p-6 shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">More Newborn Resources</h3>
              <ul className="list-inside list-disc text-blue-700 space-y-2">
                <li>
                  <a href="/blog/complete-newborn-care-guide-for-nurses" className="underline hover:text-blue-900">
                    Complete Newborn Care Guide for Nurses
                  </a>
                </li>
                <li>
                  <a href="/malpractice-insurance" className="underline hover:text-blue-900">
                    Nurses: Insurance & Licensing Requirements
                  </a>
                </li>
                <li>
                  <a href="/nurse-llc-setup-guide" className="underline hover:text-blue-900">
                    Setting Up Your Nurse LLC
                  </a>
                </li>
                <li>
                  <a href="/best-products-for-home-healthcare" className="underline hover:text-blue-900">
                    Best Products for Home Healthcare
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
