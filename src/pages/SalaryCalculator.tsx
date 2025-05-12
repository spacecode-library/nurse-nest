
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SalaryCalculator() {
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
              
              <div dangerouslySetInnerHTML={{ __html: `
                <form id="salaryForm" onsubmit="submitToMake(event)" style="max-width: 500px; margin: auto;">
                  <input type="text" name="city" placeholder="City" required style="width: 100%; margin-bottom: 12px; padding: 10px;">
                  <input type="text" name="state" placeholder="State" required style="width: 100%; margin-bottom: 12px; padding: 10px;">
                  <select name="specialty" required style="width: 100%; padding: 10px; margin-bottom: 12px;">
                    <option value="" disabled selected>Select Specialty</option>
                    <option value="ICU">ICU</option>
                    <option value="ER">ER</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Postpartum">Postpartum</option>
                  </select>
                  <button type="submit" style="padding: 12px; background-color: #4A90E2; color: white; border: none;">Submit</button>
                </form>

                <script>
                  async function submitToMake(event) {
                    event.preventDefault();
                    const form = document.getElementById("salaryForm");
                    const data = {
                      city: form.city.value,
                      state: form.state.value,
                      specialty: form.specialty.value
                    };

                    try {
                      const response = await fetch("https://hook.us2.make.com/u55ngzrd25dbof39xncf2ujt3nbs97c1", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                      });

                      const result = await response.json();
                      if (result.redirect_url) {
                        window.location.href = result.redirect_url;
                      } else {
                        alert("No redirect URL returned. Please try again.");
                      }
                    } catch (error) {
                      console.error("Submission failed:", error);
                      alert("Something went wrong. Please try again.");
                    }
                  }
                </script>
              `}} />
              
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
