
import React from "react";
import { cn } from "@/lib/utils";
import { FAQCategory } from "./luxuriousFaqData";

interface FaqCategorySidebarProps {
  categories: FAQCategory[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  setOpenKey: (key: string | null) => void;
  setSearchTerm: (term: string) => void;
}

export function FaqCategorySidebar({
  categories,
  activeCategory,
  setActiveCategory,
  setOpenKey,
  setSearchTerm,
}: FaqCategorySidebarProps) {
  return (
    <div className="w-full md:w-[260px] md:pr-4 mb-10 md:mb-0 flex-shrink-0 flex flex-col items-center">
      {/* Table of Contents Heading */}
      <div className="mb-6 w-full flex flex-col items-center">
        <div
          className="text-2xl md:text-3xl font-black text-gray-900 whitespace-nowrap text-center tracking-tight"
          style={{
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          Table of Contents
        </div>
      </div>
      {/* Categories */}
      <nav aria-label="Table of Contents" className="w-full">
        <ul className="w-full flex flex-col items-center">
          {categories.map(cat => (
            <li key={cat.id} className="w-full">
              <button
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenKey(null);
                  setSearchTerm('');
                }}
                className={cn(
                  "w-full text-left py-1 px-2 rounded transition-colors font-semibold text-sm md:text-base tracking-tight focus:outline-none focus-visible:outline-none",
                  activeCategory === cat.id
                    ? "text-[#9bcbff] font-black"
                    : "text-gray-700",
                  "hover:text-[#9bcbff] focus:text-[#9bcbff]"
                )}
                aria-current={activeCategory === cat.id ? 'page' : undefined}
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
