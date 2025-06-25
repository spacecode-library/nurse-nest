
import React from 'react';

interface NavLink {
  href: string;
  text: string;
}

interface BlogSidebarProps {
  quickNavLinks: NavLink[];
  relatedResources: NavLink[];
}

export default function BlogSidebar({ quickNavLinks, relatedResources }: BlogSidebarProps) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 mt-8 lg:mt-0">
      {/* Quick Navigation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
        <h3 className="font-semibold text-blue-800 mb-1">Quick Navigation</h3>
        <ul className="list-disc ml-6 space-y-1 text-blue-700 text-base">
          {quickNavLinks.map(link => (
            <li key={link.href}><a href={link.href}>{link.text}</a></li>
          ))}
        </ul>
      </div>
      {/* Related Resources */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-1 text-gray-800">Related Resources</h3>
        <ul className="list-inside list-disc text-blue-700">
          {relatedResources.map(link => (
            <li key={link.href}><a href={link.href}>{link.text}</a></li>
          ))}
        </ul>
      </div>
      {/* CTA Box */}
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Ready to Apply?</h3>
        <p className="text-blue-700 text-sm mb-3">Join our network of skilled nurses providing quality newborn care.</p>
        <a
          href="/apply"
          className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Apply Now
        </a>
      </div>
    </aside>
  );
}
