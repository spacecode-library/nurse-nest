
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import Pricing from "./pages/Pricing";
import VettingOptions from "./pages/VettingOptions";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import NurseApplication from "./pages/NurseApplication";
import NurseOnboarding from "./pages/NurseOnboarding";
import ClientOnboarding from "./pages/ClientOnboarding";
import NotFound from "./pages/NotFound";
import PreResult from "./pages/PreResult";
import SalaryResult from "./pages/SalaryResult";
import SalaryCalculator from "./pages/SalaryCalculator";
import BookingPage from "./pages/BookingPage";
import Apartments from "./pages/Apartments";
import Gallery from "./pages/Gallery";
import Amenities from "./pages/Amenities";
import LlcSetupHelp from "./pages/LlcSetupHelp";
import NurseLlcSetup from "./pages/NurseLlcSetup";
import GetEinNurseBusiness from "./pages/GetEinNurseBusiness";
import MalpracticeInsurance from "./pages/MalpracticeInsurance";
import TaxTips from "./pages/TaxTips";
import NurseLlcFormationGuide from "./pages/NurseLlcFormationGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/vetting-options" element={<VettingOptions />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/blog/nurse-llc-formation-guide" element={<NurseLlcFormationGuide />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/nurse-application" element={<NurseApplication />} />
                <Route path="/nurse-onboarding" element={<NurseOnboarding />} />
                <Route path="/client-onboarding" element={<ClientOnboarding />} />
                <Route path="/pre-result" element={<PreResult />} />
                <Route path="/salary-result" element={<SalaryResult />} />
                <Route path="/salary-calculator" element={<SalaryCalculator />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/apartments" element={<Apartments />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/amenities" element={<Amenities />} />
                <Route path="/nurse-llc-setup-guide" element={<LlcSetupHelp />} />
                <Route path="/nurse-llc-setup" element={<NurseLlcSetup />} />
                <Route path="/get-ein-nurse-business" element={<GetEinNurseBusiness />} />
                <Route path="/business-bank-account-for-nurses" element={<GetEinNurseBusiness />} />
                <Route path="/malpractice-insurance-for-nurses" element={<MalpracticeInsurance />} />
                <Route path="/1099-tax-tips" element={<TaxTips />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
