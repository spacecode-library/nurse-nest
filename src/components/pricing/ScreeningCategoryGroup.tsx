
import React from "react";
import ScreeningCard from "./ScreeningCard";
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
}

export default function ScreeningCategoryGroup({
  icon,
  title,
  cards,
}: ScreeningCategoryGroupProps) {
  // Always 2-column grid (desktop/tablet), 1 on mobile
  // If odd number, center last row
  const colCount = 2;
  const needSpacer = cards.length % colCount !== 0;
  const spacers = needSpacer ? Array(colCount - (cards.length % colCount)).fill(0) : [];

  return (
    <section className="mb-2">
      <div className="flex items-center gap-3 mb-3 mt-2">
        <span className="relative flex items-center">{iconMap[icon]}</span>
        <h3 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">{title}</h3>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-blue-100 via-blue-200 to-transparent mb-8 w-24" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 place-items-stretch">
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
