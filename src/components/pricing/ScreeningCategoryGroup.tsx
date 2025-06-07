import React from "react";
import { ScreeningCard } from "./ScreeningCard";
import { Search, FileText, Car } from "lucide-react";

type CategoryIcon = "search" | "file-text" | "car";

const iconMap: Record<CategoryIcon, React.ReactNode> = {
  "search": <Search className="w-5 h-5 text-primary-400 mr-2 opacity-60" />,
  "file-text": <FileText className="w-5 h-5 text-primary-400 mr-2 opacity-60" />,
  "car": <Car className="w-5 h-5 text-primary-400 mr-2 opacity-60" />,
};

interface ScreeningCardData {
  name: string;
  price: string;
  bullets: string[];
}

interface ScreeningCategoryGroupProps {
  icon: CategoryIcon;
  title: string;
  cards: ScreeningCardData[];
  layout?: "auto" | "2+1";
}

export default function ScreeningCategoryGroup({
  icon,
  title,
  cards,
  layout = "auto"
}: ScreeningCategoryGroupProps) {
  // Add tighter vertical spacers between category sections (use less mb/mt)
  // Handle custom "2+1" card layout for 3 cards (used for Driving & Drug Testing section)

  // For 2+1 layout: two cards on top row, one centered below
  if (layout === "2+1" && cards.length === 3) {
    return (
      <section className="mb-7">
        <div className="flex items-center gap-3 mb-2 mt-2">
          <span className="relative flex items-center">{iconMap[icon]}</span>
          <h3 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">{title}</h3>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-blue-100 via-blue-200 to-transparent mb-7 w-24" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 place-items-stretch">
          {/* First two cards in top row */}
          <ScreeningCard key={cards[0].name} title={cards[0].name} price={cards[0].price} bullets={cards[0].bullets} />
          <ScreeningCard key={cards[1].name} title={cards[1].name} price={cards[1].price} bullets={cards[1].bullets} />
          {/* For the single bottom card - span two columns and center */}
          <div className="col-span-full flex justify-center mt-0 md:mt-2">
            <div className="w-full md:w-1/2 flex justify-center">
              <ScreeningCard key={cards[2].name} title={cards[2].name} price={cards[2].price} bullets={cards[2].bullets} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Normal two-column layout, tighter vertical spacing
  const colCount = 2;
  const needSpacer = cards.length % colCount !== 0;
  const spacers = needSpacer ? Array(colCount - (cards.length % colCount)).fill(0) : [];

  return (
    <section className="mb-7">
      <div className="flex items-center gap-3 mb-2 mt-2">
        <span className="relative flex items-center">{iconMap[icon]}</span>
        <h3 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">{title}</h3>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-blue-100 via-blue-200 to-transparent mb-7 w-24" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 place-items-stretch">
        {cards.map((c, idx) => (
          <ScreeningCard key={c.name} title={c.name} price={c.price} bullets={c.bullets} />
        ))}
        {spacers.map((_, idx) => (
          <div key={`spacer-${idx}`} className="hidden md:block" />
        ))}
      </div>
    </section>
  );
}
