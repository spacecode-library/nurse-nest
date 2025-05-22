import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Apply from "./pages/Apply";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Disclaimer from "./pages/Disclaimer";
import SalaryCalculator from "./pages/SalaryCalculator";
import SalaryResult from "./pages/SalaryResult";
import PreResult from "./pages/PreResult";
import VettingOptions from "./pages/VettingOptions";
import NurseApplication from "./pages/NurseApplication";
import MalpracticeInsurance from "./pages/MalpracticeInsurance";
import LlcSetupHelp from "./pages/LlcSetupHelp";
import TaxTips from "./pages/TaxTips";
import NurseOnboarding from "./pages/NurseOnboarding";
import ClientOnboarding from "./pages/ClientOnboarding";
import AdminPortal from "./components/AdminPortal";
import NurseDashboard from "./components/dashboard/NurseDashboard";
import DashboardRouter from "./components/DashboardRouter";
import ClientDashboard from "./components/dashboard/ClientDashboard";

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<BlogPost />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/salary-calculator" element={<SalaryCalculator />} />
              <Route path="/pre-result" element={<PreResult />} />
              <Route path="/salary-result" element={<SalaryResult />} />
              
              {/* Dashboard Routes - Updated to handle different user types */}
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/dashboard/nurse" element={<NurseDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              
              <Route path="/vetting-options" element={<VettingOptions />} />
              <Route path="/onboarding/nurse" element={<NurseOnboarding />} />
              <Route path="/onboarding/client" element={<ClientOnboarding />} />
              <Route path="/admin" element={<AdminPortal />} />
              
              {/* Nurse Resources Routes */}
              <Route path="/nurse-application" element={<NurseApplication />} />
              <Route path="/malpractice-insurance" element={<MalpracticeInsurance />} />
              <Route path="/llc-setup-help" element={<LlcSetupHelp />} />
              <Route path="/1099-tax-tips" element={<TaxTips />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}