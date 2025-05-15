
import React from "react";
import { Check } from "lucide-react";

interface ScreeningCardProps {
  title: string;
  price: string;
  bullets: string[];
}

export default function ScreeningCard({ title, price, bullets }: ScreeningCardProps) {
  return (
    <div
      className="rounded-xl shadow-md border border-gray-100 bg-white px-7 py-7 flex flex-col
        min-h-[230px] md:min-h-[260px] relative transition duration-200
        hover:shadow-lg"
    >
      {/* Title & Price */}
      <div className="mb-2 flex items-baseline gap-2 min-h-[42px]">
        <h4 className="font-semibold text-md md:text-lg text-gray-800 flex-1">{title}</h4>
        <span className="font-bold text-base md:text-lg text-gray-900">{price}</span>
      </div>
      {/* Divider */}
      <div className="h-px w-full bg-gray-100 mb-2" />
      {/* Bullet List */}
      <ul className="mt-1 flex-1 flex flex-col gap-2 text-sm text-gray-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center">
            {b.startsWith("✅") ? (
              <Check className="text-green-600 w-5 h-5 mr-2" aria-label="Instant" />
            ) : null}
            {b.startsWith("⏱️") ? (
              <span className="inline-block mr-2 text-blue-400 text-lg" aria-hidden="true">⏱️</span>
            ) : null}
            {b.startsWith("❗") ? (
              <span className="inline-block mr-2 text-red-500 text-lg" aria-hidden="true">❗</span>
            ) : null}
            <span className="">
              {b.replace(/^✅|^⏱️ |^❗ /, "")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
