
import React from 'react';

export default function BlogArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-blue min-w-0 max-w-3xl">
      {children}
    </article>
  );
}
