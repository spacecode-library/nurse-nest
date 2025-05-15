
import React from "react";
import ScreeningCard from "./ScreeningCard";
import { Search, FileText, Car } from "lucide-react";

type CategoryIcon = "search" | "file-text" | "car";

const iconMap: Record<CategoryIcon, React.ReactNode> = {
  "search": <Search className="w-6 h-6 text-primary-500" />,
  "file-text": <FileText className="w-6 h-6 text-primary-500" />,
  "car": <Car className="w-6 h-6 text-primary-500" />,
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
}

export default function ScreeningCategoryGroup({
  icon,
  title,
  cards,
}: ScreeningCategoryGroupProps) {
  // To center last row if less than 3 items, use grid and grid-auto-rows for card consistency
  const colCount = 3; // For desktop grid
  const needSpacer = cards.length % colCount !== 0;
  const spacers = needSpacer ? Array(colCount - (cards.length % colCount)).fill(0) : [];

  return (
    <section className="mb-2">
      <div className="flex items-center gap-3 mb-2 mt-2">
        {iconMap[icon]}
        <h3 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">{title}</h3>
      </div>
      <div className="h-px bg-gray-200 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 place-items-stretch">
        {cards.map((c, idx) => (
          <ScreeningCard key={c.name} title={c.name} price={c.price} bullets={c.bullets} />
        ))}
        {/* Add empty divs as spacers to center the last row if needed (desktop only) */}
        {spacers.map((_, idx) => (
          <div key={`spacer-${idx}`} className="hidden md:block" />
        ))}
      </div>
    </section>
  );
}
