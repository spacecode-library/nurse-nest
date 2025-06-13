
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Blog8 } from '@/components/ui/blog8';

const blogPosts = [
  {
    id: 'private-elderly-care-cost',
    title: 'How Much Does Private Elderly Care at Home Cost?',
    summary: "Get a complete breakdown of private elderly care at home costs for RNs, LPNs, and caregivers with our transparent pricing guide.",
    label: 'Healthcare',
    author: 'Nurse Nest Team',
    published: 'May 16, 2025',
    url: '/blog/private-elderly-care-cost',
    image: '/lovable-uploads/04b8dbb6-ac67-4547-89ff-f4564c30f2ec.png',
    tags: ['Healthcare', 'Pricing']
  },
  {
    id: 'private-duty-nurse-vs-home-health-aide',
    title: "Private Duty Nurse vs Home Health Aide: What's the Difference?",
    summary: 'Compare services, qualifications and costs between private duty nurses and home health aides to make the right choice for your loved ones.',
    label: 'Healthcare',
    author: 'Nurse Nest Team',
    published: 'May 12, 2025',
    url: '/blog/private-duty-nurse-vs-home-health-aide',
    image: '/lovable-uploads/24d6dd5c-dd41-4a60-88eb-f70d46f03ae9.png',
    tags: ['Healthcare', 'Comparison']
  },
  {
    id: 'hire-postpartum-private-nurse',
    title: 'How to Hire a Private Nurse for Postpartum Support Near You',
    summary: 'Learn how to find and hire a vetted private nurse for overnight infant care, breastfeeding support, and postpartum recovery.',
    label: 'Postpartum Care',
    author: 'Nurse Nest Team',
    published: 'May 9, 2025',
    url: '/blog/hire-postpartum-private-nurse',
    image: '/lovable-uploads/77ddc10d-2117-4745-8bba-2347c09f1bb7.png',
    tags: ['Postpartum', 'Newborn Care']
  },
  {
    id: 'private-nurse-near-me-guide',
    title: 'Private Nurse Near Me: What You Should Know Before Hiring',
    summary: 'Discover the essential steps to safely find and hire a qualified private nurse in your area with our comprehensive guide.',
    label: 'Hiring Guide',
    author: 'Nurse Nest Team',
    published: 'May 7, 2025',
    url: '/blog/private-nurse-near-me-guide',
    image: '/lovable-uploads/4ef081e3-1c5e-4e3b-a36f-40a679b96779.png',
    tags: ['Hiring', 'Safety']
  },
  {
    id: 'understanding-private-duty-nursing',
    title: 'Understanding Private Duty Nursing: What You Need to Know',
    summary: "Discover what private duty nursing is, who it benefits, and why it's a growing choice for in-home care.",
    label: 'Education',
    author: 'Nurse Nest Team',
    published: 'May 5, 2025',
    url: '/blog/understanding-private-duty-nursing',
    image: '/lovable-uploads/b17982c9-ea7e-4528-b267-637fbf419566.png',
    tags: ['Education', 'Healthcare']
  },
  {
    id: 'choose-right-private-duty-nurse',
    title: 'How to Choose the Right Private Duty Nurse for Your Needs',
    summary: 'Learn how to hire a private duty nurse with our expert tips on finding qualified, compatible care.',
    label: 'Hiring Guide',
    author: 'Nurse Nest Team',
    published: 'May 3, 2025',
    url: '/blog/choose-right-private-duty-nurse',
    image: '/lovable-uploads/489a6911-f667-4946-9075-6fd326c7b384.png',
    tags: ['Hiring', 'Tips']
  },
  {
    id: 'nurse-nest-difference',
    title: 'The Nurse Nest Difference: Why Choose Us for Your Private Duty Nursing Needs',
    summary: 'Discover why Nurse Nest is the top choice for private duty nursing with our vetted nurses and personalized matching.',
    label: 'Company',
    author: 'Nurse Nest Team',
    published: 'April 29, 2025',
    url: '/blog/nurse-nest-difference',
    image: '/lovable-uploads/a1e4fb69-0c92-4952-a6c4-835053c1b7c6.png',
    tags: ['Company', 'Platform']
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
        <Blog8 
          heading="Our Blog"
          description="Insights, tips, and industry updates on private duty nursing and in-home care"
          posts={blogPosts}
        />
      </main>
      
      <Footer />
    </div>
  );
}
