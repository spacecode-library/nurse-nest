
import React from "react";

interface ScreeningCardProps {
  title: string;
  price: string;
  bullets: string[];
}

export default function ScreeningCard({ title, price, bullets }: ScreeningCardProps) {
  return (
    <div
      className="rounded-2xl shadow-md border border-gray-100 bg-white px-6 py-5 flex flex-col
        min-h-[170px] md:min-h-[210px] relative transition
        hover:shadow-lg"
    >
      {/* Header: Title & price */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-md md:text-lg text-gray-800">{title}</h4>
        <span className="font-bold text-base md:text-lg text-gray-900">{price}</span>
      </div>
      <ul className="mt-1 flex-1 flex flex-col gap-2 text-sm text-gray-700">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
