
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
  return (
    <section className="mb-2">
      <div className="flex items-center gap-3 mb-2 mt-2">
        {iconMap[icon]}
        <h3 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">{title}</h3>
      </div>
      <div className="h-px bg-gray-200 mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, idx) => (
          <ScreeningCard key={c.name} title={c.name} price={c.price} bullets={c.bullets} />
        ))}
      </div>
    </section>
  );
}
