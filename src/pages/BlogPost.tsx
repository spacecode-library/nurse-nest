
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';

const blogMetadata = {
  'private-elderly-care-cost': {
    metaTitle: 'Private Elderly Care at Home Cost | Transparent Rates by Nurse Nest',
    metaDescription: 'Get a complete breakdown of private elderly care at home costs. Understand pricing for RNs, LPNs, and caregivers with Nurse Nest\'s vetted nurse network.'
  },
  'private-duty-nurse-vs-home-health-aide': {
    metaTitle: 'Private Duty Nurse vs Home Health Aide | Which Is Right for You?',
    metaDescription: 'Compare the services of private duty nurses vs. home health aides. Learn the key differences in care level, cost, and licensing to make the right hire.'
  },
  'hire-postpartum-private-nurse': {
    metaTitle: 'Hire a Postpartum Nurse Near You | Concierge Newborn Care',
    metaDescription: 'Looking for postpartum help? Hire a vetted private duty nurse near you for overnight infant care, breastfeeding support, and healing after birth.'
  },
  'private-nurse-near-me-guide': {
    metaTitle: 'Private Nurse Near Me | What to Know Before You Hire',
    metaDescription: 'Find a trusted private nurse near you. Learn how Nurse Nest makes hiring safe with license verification, background checks, and secure payments.'
  },
  'understanding-private-duty-nursing': {
    metaTitle: 'Understanding Private Duty Nursing | What You Need to Know',
    metaDescription: 'Discover what private duty nursing is, who it benefits, and why it\'s a growing choice for in-home care. Learn about Nurse Nest\'s vetted nurse network.'
  },
  'choose-right-private-duty-nurse': {
    metaTitle: 'How to Choose the Right Private Duty Nurse | Expert Tips',
    metaDescription: 'Learn how to hire a private duty nurse with our expert tips on finding qualified, compatible care for your specific needs.'
  },
  'nurse-nest-difference': {
    metaTitle: 'The Nurse Nest Difference | Top Choice for Private Duty Nursing',
    metaDescription: 'Discover why Nurse Nest is the preferred choice for private duty nursing with our vetted nurses and personalized matching process.'
  }
};

export default function BlogPost() {
  const { postId } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set page metadata for SEO
    const metadata = blogMetadata[postId as keyof typeof blogMetadata] || {
      metaTitle: 'Nurse Nest Blog | Private Duty Nursing Insights',
      metaDescription: 'Explore insights, tips, and industry updates on private duty nursing and in-home care from Nurse Nest.'
    };
    
    document.title = metadata.metaTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metadata.metaDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metadata.metaDescription;
      document.head.appendChild(meta);
    }
  }, [postId]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link to="/blog" className="text-primary-500 hover:underline">&larr; Back to All Posts</Link>
          </div>
          
          <BlogContent postId={postId} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
