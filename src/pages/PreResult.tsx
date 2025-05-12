
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function PreResult() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const answer = params.get("answer");

    if (answer) {
      // Store the answer in local storage
      localStorage.setItem("nurseAnswer", answer);
      // Add a half-second delay to ensure the answer is saved
      const timer = setTimeout(() => {
        // Redirect to the protected page
        navigate("/salary-result");
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // If no answer is present, redirect back to calculator
      // Note that the URL should be /salary-calculator to match our routes
      navigate("/salary-calculator");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
            <h1 className="text-2xl font-bold mb-4">Processing your results</h1>
            <p className="text-gray-600 mb-6">Please wait while we prepare your salary information...</p>
            <Button 
              onClick={() => navigate("/salary-calculator")}
              variant="outline"
            >
              Return to Calculator
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
