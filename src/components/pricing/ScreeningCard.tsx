
import React from "react";

interface ScreeningCardProps {
  title: string;
  price: string;
  bullets: string[];
}

export default function ScreeningCard({ title, price, bullets }: ScreeningCardProps) {
  return (
    <div
      className="rounded-2xl shadow-lg border border-gray-100 bg-white px-7 py-6 flex flex-col
        min-h-[230px] md:min-h-[260px] relative transition duration-200 hover:shadow-xl
        "
    >
      {/* Header: Title & price */}
      <div className="flex flex-row justify-between items-center mb-4">
        <h4 className="font-bold text-md md:text-lg text-gray-800">{title}</h4>
        <span className="font-bold text-base md:text-lg text-gray-900">{price}</span>
      </div>
      <ul className="mt-1 flex-1 flex flex-col gap-2 text-sm text-gray-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center">
            <span className="inline-block mr-2 text-green-600 text-lg" aria-hidden="true">
              {b.startsWith("✅") ? "✔" : b.startsWith("⏱️") || b.startsWith("❗") ? "" : ""}
            </span>
            <span>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
