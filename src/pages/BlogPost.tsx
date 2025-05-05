
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';

export default function BlogPost() {
  const { postId } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
