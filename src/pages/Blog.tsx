
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const blogPosts = [
  {
    id: 'private-elderly-care-cost',
    title: 'How Much Does Private Elderly Care at Home Cost?',
    excerpt: "Get a complete breakdown of private elderly care at home costs for RNs, LPNs, and caregivers with our transparent pricing guide.",
    date: 'May 16, 2025',
    image: '/lovable-uploads/04b8dbb6-ac67-4547-89ff-f4564c30f2ec.png',
    readTime: '6 min read'
  },
  {
    id: 'private-duty-nurse-vs-home-health-aide',
    title: "Private Duty Nurse vs Home Health Aide: What's the Difference?",
    excerpt: 'Compare services, qualifications and costs between private duty nurses and home health aides to make the right choice for your loved ones.',
    date: 'May 12, 2025',
    image: '/lovable-uploads/24d6dd5c-dd41-4a60-88eb-f70d46f03ae9.png',
    readTime: '7 min read'
  },
  {
    id: 'hire-postpartum-private-nurse',
    title: 'How to Hire a Private Nurse for Postpartum Support Near You',
    excerpt: 'Learn how to find and hire a vetted private nurse for overnight infant care, breastfeeding support, and postpartum recovery.',
    date: 'May 9, 2025',
    image: '/lovable-uploads/77ddc10d-2117-4745-8bba-2347c09f1bb7.png',
    readTime: '5 min read'
  },
  {
    id: 'private-nurse-near-me-guide',
    title: 'Private Nurse Near Me: What You Should Know Before Hiring',
    excerpt: 'Discover the essential steps to safely find and hire a qualified private nurse in your area with our comprehensive guide.',
    date: 'May 7, 2025',
    image: '/lovable-uploads/4ef081e3-1c5e-4e3b-a36f-40a679b96779.png',
    readTime: '8 min read'
  },
  {
    id: 'understanding-private-duty-nursing',
    title: 'Understanding Private Duty Nursing: What You Need to Know',
    excerpt: "Discover what private duty nursing is, who it benefits, and why it's a growing choice for in-home care.",
    date: 'May 5, 2025',
    image: '/lovable-uploads/b17982c9-ea7e-4528-b267-637fbf419566.png',
    readTime: '6 min read'
  },
  {
    id: 'choose-right-private-duty-nurse',
    title: 'How to Choose the Right Private Duty Nurse for Your Needs',
    excerpt: 'Learn how to hire a private duty nurse with our expert tips on finding qualified, compatible care.',
    date: 'May 3, 2025',
    image: '/lovable-uploads/489a6911-f667-4946-9075-6fd326c7b384.png',
    readTime: '5 min read'
  },
  {
    id: 'nurse-nest-difference',
    title: 'The Nurse Nest Difference: Why Choose Us for Your Private Duty Nursing Needs',
    excerpt: 'Discover why Nurse Nest is the top choice for private duty nursing with our vetted nurses and personalized matching.',
    date: 'April 29, 2025',
    image: '/lovable-uploads/a1e4fb69-0c92-4952-a6c4-835053c1b7c6.png',
    readTime: '4 min read'
  },
];

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Our <span className="text-nurse-dark">Blog</span>
          </h1>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Insights, tips, and industry updates on private duty nursing and in-home care
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 flex-grow">{post.excerpt}</p>
                    <div className="mt-4">
                      <span className="text-primary-500 font-medium">Read more &rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
