
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BlogHeroProps {
  Icon: LucideIcon;
  title: string;
  date: string;
  readTime: string;
  description: string;
}

export default function BlogHero({ Icon, title, date, readTime, description }: BlogHeroProps) {
  return (
    <section
      className="w-full bg-gradient-to-br from-sky-50 via-blue-50 to-blue-100 py-12 border-b"
      style={{ background: "linear-gradient(135deg,#f1f5f9 0%,#e0f2fe 100%)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center rounded-full bg-[#e0f2fe] p-4">
            <Icon className="text-blue-400" size={48} />
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-5 text-nurse-dark">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-gray-500 text-sm mb-3">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <p className="text-lg text-gray-700">
          {description}
        </p>
      </div>
    </section>
  );
}
