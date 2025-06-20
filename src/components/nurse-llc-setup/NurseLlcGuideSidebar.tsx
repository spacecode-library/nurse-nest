
import React from "react";

const relatedArticles = [
  {
    href: "/business-bank-account-for-nurses",
    title: "Business Banking Setup Guide",
    description: "Essential guide for setting up business banking after LLC formation.",
    readTime: "11 min read",
  },
  {
    href: "/blog/ein-applications-independent-contract-nurses",
    title: "EIN Applications Guide",
    description: "A complete guide for contract nurses on when and how to apply for an EIN.",
    readTime: "10 min read",
  },
  {
    href: "/blog/nurse-llc-formation-guide",
    title: "Complete Guide to LLC Formation",
    description: "Comprehensive walkthrough of forming an LLC as a nurse.",
    readTime: "12 min read",
  },
];


export default function NurseLlcGuideSidebar() {
  return (
    <aside className="w-full lg:max-w-xs flex-shrink-0 pt-2">
      {/* Related Resources */}
      <div className="mb-10 p-6 bg-blue-50 border-l-4 border-[#9bcbff] rounded-xl shadow-md">
        <h3 className="font-bold mb-5 text-[#1e293b] text-lg">Related Resources</h3>
        <ul className="space-y-3 text-base text-blue-700">
          <li><a href="/nurse-llc-setup-guide" className="hover:underline font-medium">Complete LLC Setup Guide</a></li>
          <li><a href="/get-ein-nurse-business" className="hover:underline font-medium">EIN Application Guide</a></li>
          <li><a href="/business-bank-account-for-nurses" className="hover:underline font-medium">Business Banking Guide</a></li>
          <li><a href="/malpractice-insurance-for-nurses" className="hover:underline font-medium">Insurance Requirements</a></li>
          <li><a href="/blog/ein-vs-ssn-what-nurses-need-to-know" className="hover:underline font-medium">EIN vs SSN Guide</a></li>
        </ul>
      </div>

      {/* Related Articles */}
      <div className="mb-10 p-6 bg-green-50 border-l-4 border-green-300 rounded-xl shadow-md">
        <h3 className="font-bold mb-5 text-gray-800 text-lg">Related Articles</h3>
        <div className="space-y-4">
          {relatedArticles.map((article) => (
            <a
              href={article.href}
              key={article.href}
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h4 className="font-semibold text-blue-800 mb-1 text-base">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {article.description}
              </p>
              <span className="text-xs text-gray-500">{article.readTime}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Professional Services */}
      <div className="p-6 bg-gray-100 rounded-xl shadow-md">
        <h3 className="font-bold mb-5 text-[#1e293b] text-lg">Professional Services</h3>
        <div className="flex flex-col gap-4">
          <a href="https://legalzoomcominc.pxf.io/aOYdEN" target="_blank" rel="noopener" className="w-full text-center px-4 py-2 bg-[#9bcbff] text-white rounded-md font-medium transition hover:bg-[#3b82f6] hover:shadow-lg">LegalZoom LLC Services</a>
          <a href="http://shrsl.com/2qj12-1hzb-kp67" target="_blank" rel="noopener" className="w-full text-center px-4 py-2 bg-[#1e293b] text-white rounded-md font-medium transition hover:bg-[#3b82f6] hover:shadow-lg">Northwest Registered Agent</a>
        </div>
      </div>
    </aside>
  );
}
