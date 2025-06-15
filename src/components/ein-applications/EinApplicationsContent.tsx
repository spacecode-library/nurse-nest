import React from "react";
import ApplicationMethodsComparison from "./ApplicationMethodsComparison";
import CommonEinMistakes from "./CommonEinMistakes";

export default function EinApplicationsContent() {
  return (
    <article className="flex-1 max-w-2xl mx-auto font-sans text-neutral-dark">
      {/* Introduction */}
      <div className="mb-14">
        <p className="mb-5 text-lg md:text-xl leading-relaxed">
          Are you an independent contract nurse wondering whether you need an EIN? Over 78% of contract nurses working as independent contractors benefit from obtaining an Employer Identification Number (EIN) for tax purposes and business legitimacy.
        </p>
        <p className="mb-10 text-lg md:text-xl leading-relaxed">
          This comprehensive guide explains when you need an EIN, how to apply, and what benefits it provides for your contract nursing work.
        </p>
      </div>
      {/* What is an EIN and Why Do Nurses Need One */}
      <section className="mb-12 pb-8 border-b border-neutral-light/40">
        <h2 id="what-is-ein" className="!text-2xl md:!text-3xl pt-2 mb-3">What is an EIN and Why Nurses Need One</h2>
        <div className="mb-8">
          <div className="border border-[#e2e8f0] shadow-lg mb-8 rounded-lg overflow-hidden">
            <div className="p-8 bg-[#f0f9ff] rounded-t-lg">
              <p className="text-lg text-[#475569] leading-relaxed mb-6">
                An Employer Identification Number (EIN), also called a Federal Tax ID, is a unique nine-digit number assigned by the IRS to identify your business for tax purposes.
                Think of it as a Social Security Number for your nursing business—even if you don’t hire employees!
              </p>
              <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Format: XX-XXXXXXX</h3>
                <p className="text-[#475569]">
                  Example: 12-3456789
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 p-8 bg-white">
              <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                <span className="text-lg font-semibold text-[#1e293b] mb-2">Privacy Protection</span>
                <span className="text-[#475569]">
                  Use your EIN instead of your Social Security Number on contracts, invoices, and tax forms.&nbsp;
                </span>
              </div>
              <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                <span className="text-lg font-semibold text-[#1e293b] mb-2">Business Banking</span>
                <span className="text-[#475569]">
                  Required to open business bank accounts, apply for business credit cards, and establish business credit.
                </span>
              </div>
              <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                <span className="text-lg font-semibold text-[#1e293b] mb-2">Professional Image</span>
                <span className="text-[#475569]">
                  Clients and healthcare facilities view businesses with EINs as more professional and established.
                </span>
              </div>
              <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                <span className="text-lg font-semibold text-[#1e293b] mb-2">Tax Benefits</span>
                <span className="text-[#475569]">
                  Simplifies tax filing and allows better organization of business finances.
                </span>
              </div>
            </div>
          </div>
        </div>
        <p>
          For independent contract nurses, the EIN provides privacy, professional credibility, and is often required by contract agencies, banks, and clients.
        </p>
      </section>
      {/* EIN vs SSN */}
      <section className="mb-12 pb-8 border-b border-neutral-light/40" id="ein-vs-ssn">
        <h2 className="!text-2xl md:!text-3xl pt-2 mb-3">EIN vs SSN: Key Differences for Nurses</h2>
        <p className="mb-3">
          For nurses running their own contract business, understanding the distinction between an EIN and SSN is critical:
        </p>
        <div className="overflow-x-auto rounded-xl shadow border mb-5 bg-white/95">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-blue-50 text-[#1e293b]">
                <th className="p-3">SSN</th>
                <th className="p-3">EIN</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-light">
                <td className="p-3">Issued to individuals</td>
                <td className="p-3">Issued to businesses (including sole proprietors/freelancers)</td>
              </tr>
              <tr className="border-b border-neutral-light">
                <td className="p-3">Used for personal taxes</td>
                <td className="p-3">Used for business taxes</td>
              </tr>
              <tr>
                <td className="p-3">Should be kept private</td>
                <td className="p-3">Can be shared on invoices, contracts, W-9s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Independent contract nurses benefit from using an EIN to avoid exposing their SSN to agencies, facilities, and clients.
        </p>
      </section>
      {/* When Independent Contract Nurses Need an EIN */}
      <section className="mb-12 pb-8 border-b border-neutral-light/40" id="when-you-need-ein">
        <h2 className="!text-2xl md:!text-3xl pt-2 mb-3">When Independent Contract Nurses Need an EIN</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>You operate as an LLC, corporation, or partnership—even single-member LLCs</li>
          <li>You hire other nurses or assistants</li>
          <li>You open a business bank account</li>
          <li>You want to protect your SSN on W-9s or contracts</li>
          <li>Your contract agency or client requests an EIN</li>
        </ul>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded mb-4">
          <strong>Tip:</strong> Even if you file as a sole proprietor with your legal name, an EIN is highly recommended for privacy.
        </div>
      </section>
      {/* Benefits of Having an EIN */}
      <section className="mb-12 pb-8 border-b border-neutral-light/40" id="benefits-ein">
        <h2 className="!text-2xl md:!text-3xl pt-2 mb-3">Benefits of Having an EIN</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Enhanced privacy (don’t give out your SSN)</li>
          <li>Required for most business bank accounts and business credit cards</li>
          <li>Professional credibility (clients trust nurses with business credentials)</li>
          <li>Enables better record-keeping and tax separation</li>
          <li>Can make hiring and payroll easier in the future</li>
        </ul>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <strong>Bottom line:</strong> While not every nurse absolutely needs an EIN, it makes operating as a professional significantly smoother and safer.
        </div>
      </section>
      {/* Table of Contents */}
      <nav className="mb-14 bg-blue-50/70 rounded-xl p-6 border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-xl mb-4 text-[#1e293b]">Table of Contents</h3>
        <ul className="space-y-2 text-blue-700 text-base list-none pl-0">
          {[
            ["EIN vs SSN: Key Differences for Nurses", "#ein-vs-ssn"],
            ["When Independent Contract Nurses Need an EIN", "#when-you-need-ein"],
            ["Benefits of Having an EIN", "#benefits-ein"],
            ["Step-by-Step EIN Application Process", "#application-process"],
            ["Application Methods Comparison", "#application-methods"],
            ["Online EIN Application Guide", "#online-application"],
            ["Phone Application Process", "#phone-application"],
            ["Mail and Fax Applications", "#mail-fax-application"],
            ["Required Information", "#required-information"],
            ["Choosing Your Business Structure", "#business-structure"],
            ["After Receiving Your EIN", "#after-receiving-ein"],
            ["Tax Implications for Contract Nurses", "#tax-implications"],
            ["Common EIN Application Mistakes", "#common-mistakes"],
            ["Troubleshooting EIN Issues", "#troubleshooting"],
          ].map(([label, href]) => (
            <li key={href} className="transition-all">
              <a
                href={href}
                className="block hover:bg-blue-100 rounded px-2 py-1 transition-colors duration-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* ... Main Article Content continues here ... */}
      {/* For brevity, other sections would go below */}
      {/* FAQ Section */}
      <section className="mb-20">
        <h2 className="font-extrabold !text-2xl md:!text-3xl pt-2 mb-6 mt-12 text-neutral-dark">Frequently Asked Questions</h2>
        <div className="grid gap-8">
          {[
            {
              q: "Do I need an EIN if I'm working through a staffing agency?",
              a: "If you are an employee of the agency, you don't need an EIN. If you are an independent contractor, an EIN is often beneficial for privacy, professional, and banking purposes.",
            },
            {
              q: "Can I use the same EIN for multiple nursing specialties?",
              a: "Yes, you can use the same EIN for all your contract nursing work under the same business entity.",
            },
            {
              q: "How long does it take to get an EIN?",
              a: "Online and phone applications provide immediate results. Fax takes about 4 business days, mail about 4–6 weeks.",
            },
            {
              q: "Is there a cost to get an EIN?",
              a: "No. EIN applications are completely free when submitted directly through the IRS.",
            },
            {
              q: "Do I need an EIN for each state I work in?",
              a: "No. A federal EIN serves your business in all states, though you may have to register your business with each state government.",
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="border border-neutral-light rounded-xl bg-white/95 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-2 text-[#1e293b]">{q}</h3>
              <p className="text-base text-neutral-dark">{a}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Disclaimer */}
      <div className="mt-14 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-bold mb-2 text-lg">Important Disclaimer</h3>
        <p>
          <strong>This guide is for educational purposes only and does not constitute legal, tax, or business advice.</strong> EIN requirements and tax obligations vary based on individual circumstances and business structures. Always consult qualified tax and legal professionals before making decisions about business structure or applying for an EIN.
        </p>
        <p>
          Nurse Nest provides educational resources and connects nurses with opportunities but does not provide tax, legal, or business formation services. Always verify current requirements with the IRS (irs.gov).
        </p>
        <p>
          IRS requirements and tax laws can change. Confirm current details with official sources before applying.
        </p>
      </div>
    </article>
  );
}
