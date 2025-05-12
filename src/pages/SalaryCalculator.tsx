
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form schema
const calculatorFormSchema = z.object({
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  specialty: z.string().min(1, "Nursing specialty is required"),
});

type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;

export default function SalaryCalculator() {
  const navigate = useNavigate();
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      city: "",
      state: "",
      specialty: "",
    },
  });

  const onSubmit = async (data: CalculatorFormValues) => {
    try {
      const response = await fetch("https://hook.us2.make.com/u55ngzrd25dbof39xncf2ujt3nbs97c1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Try to get JSON response if available
        try {
          const responseData = await response.json();
          console.log("Make.com response:", responseData);
          
          // If we have a redirect_url with answer parameter
          if (responseData && responseData.redirect_url) {
            navigate(responseData.redirect_url);
            return;
          }
          // If we have an answer directly
          else if (responseData && responseData.answer) {
            navigate(`/pre-result?answer=${encodeURIComponent(responseData.answer)}`);
            return;
          }
        } catch (jsonError) {
          console.log("Response is not JSON, proceeding with default redirect");
        }
        
        // Default behavior - just go to pre-result page
        toast({
          title: "Success!",
          description: "Your salary calculation request has been submitted.",
        });
        navigate("/pre-result");
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay Calculator</h1>
                <p className="text-gray-600">
                  Enter your details below to get an estimated salary range for nurses in your area.
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Seattle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., WA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nursing Specialty</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ICU">ICU</SelectItem>
                              <SelectItem value="ER">ER</SelectItem>
                              <SelectItem value="L&D">Labor & Delivery</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Postpartum">Postpartum</SelectItem>
                              <SelectItem value="Home Health">Home Health</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                  >
                    Calculate My Pay
                  </Button>
                </form>
              </Form>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Our salary estimates are based on real market data and updated regularly to provide the most accurate insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
