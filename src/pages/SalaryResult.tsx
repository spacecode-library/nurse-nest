
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LockKeyhole, LogIn, ArrowRight, FileText } from "lucide-react";

export default function SalaryResult() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get the answer from local storage first (for login-safe redirect)
    const storedAnswer = localStorage.getItem("nurseAnswer");
    
    if (storedAnswer) {
      setAnswer(decodeURIComponent(storedAnswer));
      setIsLoading(false);
      // Clear after use
      localStorage.removeItem("nurseAnswer");
    } else {
      // Fall back to URL parameters if not in local storage
      const params = new URLSearchParams(window.location.search);
      const answerParam = params.get('answer');
      
      if (answerParam) {
        try {
          const decodedAnswer = decodeURIComponent(answerParam);
          
          // Add a small delay for the loading animation
          const timer = setTimeout(() => {
            setAnswer(decodedAnswer);
            setIsLoading(false);
          }, 1000);
          
          return () => clearTimeout(timer);
        } catch (error) {
          console.error("Error decoding answer:", error);
          setAnswer("Error decoding your salary report. Please try again.");
          setIsLoading(false);
        }
      } else {
        setAnswer("No data found. Please resubmit your request.");
        setIsLoading(false);
      }
    }
  }, []);

  // This ensures we redirect only after auth state is confirmed
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center mb-4 text-amber-500">
                    <LockKeyhole className="h-12 w-12" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-center">Authentication Required</CardTitle>
                  <CardDescription className="text-center">
                    Please sign in or create an account to view your salary calculation results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-center">
                    Your salary calculation is ready, but you need to be logged in to view it.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <Button variant="default" className="w-full" asChild>
                    <Link to="/auth" className="flex items-center justify-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/apply" className="flex items-center justify-center">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Create Account
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Salary Calculation</CardTitle>
                <CardDescription>
                  Here are your personalized salary insights based on your inputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-gray-600">Generating your personalized salary report...</p>
                    </div>
                  ) : (
                    <div 
                      id="aiAnswer" 
                      className="p-6 bg-gray-50 rounded-lg mb-6 whitespace-pre-line leading-relaxed"
                    >
                      {answer || "Loading your personalized salary report..."}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="text-sm text-gray-500 mb-4">
                  This is an estimate based on current market data. Actual salaries may vary based on 
                  experience, education, and specific employer offerings.
                </p>
                <div className="flex gap-4 justify-center w-full">
                  <Button variant="outline" asChild className="flex items-center justify-center">
                    <Link to="/salary-calculator" className="flex items-center justify-center">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Calculator
                    </Link>
                  </Button>
                  <Button className="flex items-center justify-center" asChild>
                    <Link to="/apply">
                      <FileText className="mr-2 h-5 w-5" />
                      Find Nurse
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
