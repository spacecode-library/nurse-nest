
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, LogIn, ArrowRight } from "lucide-react";

export default function SalaryResult() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
                <div className="p-6 bg-gray-50 rounded-lg mb-6">
                  <h3 className="text-xl font-medium mb-4">Estimated Salary Range</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">$75,000 - $95,000</span>
                    <span className="text-sm text-gray-500">Annual salary</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Regional Factors</h3>
                    <p className="text-gray-600">
                      Nursing salaries in your selected location are influenced by cost of living, 
                      demand for healthcare services, and local economic conditions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Specialty Impact</h3>
                    <p className="text-gray-600">
                      Your selected nursing specialty typically commands competitive compensation 
                      due to the specialized skills and training required.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="text-sm text-gray-500 mb-4">
                  This is an estimate based on current market data. Actual salaries may vary based on 
                  experience, education, and specific employer offerings.
                </p>
                <Button asChild>
                  <Link to="/apply">
                    Find Housing with Nurse Nest
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
