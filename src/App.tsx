
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";

// Core Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Apply from "./pages/Apply";
import Auth from "./pages/Auth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Info Pages
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";

// Blog Pages
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BusinessBankingSetupGuideNurses from "./pages/blog/BusinessBankingSetupGuideNurses";
import NewbornCareGuideBlog from "./pages/blog/complete-newborn-care-guide-for-nurses";
import ElderlyCareBlog from "./pages/elderly-care-nurse-services";
import NewbornNurseSupport from "./pages/NewbornNurseSupport";

// Care Service Pages
import PostSurgicalCare from "./pages/PostSurgicalCare";

// Payment Pages
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

// Calculator Pages
import SalaryCalculator from "./pages/SalaryCalculator";
import SalaryResult from "./pages/SalaryResult";
import PreResult from "./pages/PreResult";

// Dashboard Pages
import DashboardRouter from "./components/DashboardRouter";
import NurseDashboard from "./components/dashboard/NurseDashboard";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import PendingApprovalPage from "./components/PendingApprovalPage";

// Onboarding Pages
import VettingOptions from "./pages/VettingOptions";
import NurseOnboarding from "./pages/NurseOnboarding";
import ClientOnboarding from "./pages/ClientOnboarding";

// Admin Pages
import EnhancedAdminPortal from "./components/admin/EnhancedAdminPortal";

// Nurse Resource Pages
import NurseApplication from "./pages/NurseApplication";
import MalpracticeInsurance from "./pages/MalpracticeInsurance";
import LlcSetupHelp from "./pages/LlcSetupHelp";
import TaxTips from "./pages/TaxTips";
import NurseLlcSetup from "./pages/NurseLlcSetup";
import GetEinNurseBusiness from "./pages/GetEinNurseBusiness";
import EinApplications from "./pages/EinApplications";

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Core Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/apply" element={<Apply />} />
              
              {/* Authentication Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              
              {/* Information Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              
              {/* Care Service Routes */}
              <Route path="/post-surgical-care" element={<PostSurgicalCare />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<BlogPost />} />
              <Route 
                path="/blog/complete-newborn-care-guide-for-nurses" 
                element={<NewbornCareGuideBlog />} 
              />
              <Route 
                path="/elderly-care-nurse-services"
                element={<ElderlyCareBlog />}
              />
              {/* Newborn Care Service Route */}
              <Route path="/newborn-nurse-support-guide" element={<NewbornNurseSupport />} />
              
              {/* Payment Routes */}
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              
              {/* Calculator Routes */}
              <Route path="/salary-calculator" element={<SalaryCalculator />} />
              <Route path="/pre-result" element={<PreResult />} />
              <Route path="/salary-result" element={<SalaryResult />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/dashboard/nurse" element={<NurseDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/pending-approval" element={<PendingApprovalPage />} />
              
              {/* Onboarding Routes */}
              <Route path="/vetting-options" element={<VettingOptions />} />
              <Route path="/onboarding/nurse" element={<NurseOnboarding />} />
              <Route path="/onboarding/client" element={<ClientOnboarding />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<EnhancedAdminPortal />} />
              
              {/* Nurse Resource Routes */}
              <Route path="/nurse-application" element={<NurseApplication />} />
              <Route path="/malpractice-insurance" element={<MalpracticeInsurance />} />
              <Route path="/llc-setup-help" element={<LlcSetupHelp />} />
              <Route path="/1099-tax-tips" element={<TaxTips />} />
              <Route path="/nurse-llc-setup-guide" element={<NurseLlcSetup />} />
              <Route path="/get-ein-nurse-business" element={<GetEinNurseBusiness />} />
              <Route path="/blog/ein-applications-independent-contract-nurses" element={<EinApplications />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
