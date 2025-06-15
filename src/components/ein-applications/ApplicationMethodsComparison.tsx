
import React from "react";

export default function ApplicationMethodsComparison() {
  return (
    <div className="overflow-x-auto rounded-xl shadow border bg-white/95">
      <table className="min-w-full text-sm md:text-base">
        <thead>
          <tr className="bg-blue-50 text-[#1e293b]">
            <th className="p-3 text-left">Method</th>
            <th className="p-3 text-left">Who Can Use</th>
            <th className="p-3 text-left">Speed</th>
            <th className="p-3 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-light">
            <td className="p-3">Online</td>
            <td className="p-3">U.S. residents with SSN/ITIN</td>
            <td className="p-3">Instant</td>
            <td className="p-3">Fastest, easiest, recommended</td>
          </tr>
          <tr className="border-b border-neutral-light">
            <td className="p-3">Phone</td>
            <td className="p-3">International applicants</td>
            <td className="p-3">Immediate</td>
            <td className="p-3">English-language only, IRS helps over phone</td>
          </tr>
          <tr className="border-b border-neutral-light">
            <td className="p-3">Fax</td>
            <td className="p-3">U.S. residents, all entity types</td>
            <td className="p-3">~4 business days</td>
            <td className="p-3">Need IRS Form SS-4</td>
          </tr>
          <tr>
            <td className="p-3">Mail</td>
            <td className="p-3">U.S. residents, all entity types</td>
            <td className="p-3">4-6 weeks</td>
            <td className="p-3">Need IRS Form SS-4</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
