
import { useState } from "react";
import { FaqCategorySidebar } from "./luxurious-faq/FaqCategorySidebar";
import { FaqAccordion } from "./luxurious-faq/FaqAccordion";
import { faqCategories, FAQCategory } from "./luxurious-faq/luxuriousFaqData";

interface LuxuriousFaqSectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function LuxuriousFaqSection({
  isVisible,
  onClose,
}: LuxuriousFaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic for categories and questions
  const filteredCategories =
    searchTerm.trim() === ""
      ? faqCategories
      : faqCategories
          .map((cat) => ({
            ...cat,
            faqs: cat.faqs.filter(
              (faq) =>
                faq.question
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            ),
          }))
          .filter((cat) => cat.faqs.length > 0);

  // Get the selected/active category (or the first found with results if not found)
  const selected =
    filteredCategories.find((cat) => cat.id === activeCategory) ||
    filteredCategories[0] ||
    null;

  if (!isVisible) return null;

  return (
    <section
      className="bg-white pt-24 md:pt-32 pb-16 md:pb-24 border-t border-gray-100"
      id="faq-section"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
            Got Questions?
          </h2>
          <div className="text-lg text-gray-500 mb-0">
            Can’t find an answer? Email{" "}
            <a
              href="mailto:contact@nursenest.us"
              className="underline hover:text-blue-700"
            >
              contact@nursenest.us
            </a>
            !
          </div>
          <button
            className="mt-8 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-6 py-2 rounded-lg shadow-sm font-semibold transition focus:outline-none focus-visible:outline-none"
            onClick={onClose}
            data-testid="close-faq-button"
          >
            Close FAQ
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:gap-8">
          <FaqCategorySidebar
            categories={faqCategories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setOpenKey={setOpenKey}
            setSearchTerm={setSearchTerm}
          />
          <div className="w-full md:w-3/4">
            <FaqAccordion
              selectedCategory={selected}
              openKey={openKey}
              setOpenKey={setOpenKey}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
