
import React from "react";
import { Plus, Minus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQCategory } from "./luxuriousFaqData";

interface FaqAccordionProps {
  selectedCategory: FAQCategory | null;
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function FaqAccordion({
  selectedCategory,
  openKey,
  setOpenKey,
  searchTerm,
  setSearchTerm,
}: FaqAccordionProps) {
  return (
    <>
      {/* Search input */}
      <div className="relative max-w-lg mb-8">
        <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-base focus:outline-none focus-visible:outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search questions..."
          aria-label="Search questions"
          data-testid="faq-search"
        />
      </div>
      {/* FAQ: Only show active category */}
      <div>
        {selectedCategory && selectedCategory.faqs.length > 0 ? (
          <ul className="divide-y divide-gray-200 bg-white">
            {selectedCategory.faqs.map((faq, qIdx) => {
              const key = `${selectedCategory.id}_${qIdx}`;
              const isOpen = openKey === key;
              return (
                <li key={key}>
                  <div className="border-b last:border-b-0">
                    <button
                      className={cn(
                        "w-full text-left flex items-start py-5 px-0 md:px-1 focus:outline-none focus-visible:outline-none transition-colors group",
                        isOpen ? "text-[#9bcbff]" : "text-gray-900",
                        "hover:text-[#9bcbff] focus:text-[#9bcbff]"
                      )}
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <span className="mr-4 mt-0.5">
                        {isOpen ? (
                          <Minus className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-base md:text-lg font-bold md:font-extrabold group-hover:text-[#9bcbff] transition-colors",
                          isOpen && "text-[#9bcbff]"
                        )}
                      >
                        {faq.question}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="text-gray-700 px-9 pb-6 -mt-2 text-base whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-12 text-center text-gray-500">
            No results found. Try a different search.
          </div>
        )}
      </div>
    </>
  );
}
