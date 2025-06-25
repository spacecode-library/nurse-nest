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
import EnhancedAdminPortal from "./components/admin/EnhancedAdminPortal";
import NurseDashboard from "./components/dashboard/NurseDashboard";
import DashboardRouter from "./components/DashboardRouter";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import PendingApprovalPage from "./components/PendingApprovalPage";
import { BackgroundCheckPage } from './pages/BackgroundCheckPage';
import NurseBackgroundCheckPage from './pages/NurseBackgroundCheckPage';

// New page imports
import NurseLlcSetup from "./pages/NurseLlcSetup";
import GetEinNurseBusiness from "./pages/GetEinNurseBusiness";

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Main Pages */}
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
              <Route path="/disclaimer" element={<Disclaimer />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<BlogPost />} />
              
              {/* Tools and Calculators */}
              <Route path="/salary-calculator" element={<SalaryCalculator />} />
              <Route path="/pre-result" element={<PreResult />} />
              <Route path="/salary-result" element={<SalaryResult />} />
              
              {/* Application and Vetting */}
              <Route path="/vetting-options" element={<VettingOptions />} />
              <Route path="/nurse-application" element={<NurseApplication />} />
              <Route path="/malpractice-insurance" element={<MalpracticeInsurance />} />
              
              {/* Business Setup */}
              <Route path="/llc-setup-help" element={<LlcSetupHelp />} />
              <Route path="/nurse-llc-setup" element={<NurseLlcSetup />} />
              <Route path="/get-ein-nurse-business" element={<GetEinNurseBusiness />} />
              <Route path="/tax-tips" element={<TaxTips />} />
              
              {/* Onboarding Routes */}
              <Route path="/onboarding/nurse" element={<NurseOnboarding />} />
              <Route path="/client-onboarding" element={<ClientOnboarding />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/dashboard/nurse" element={<NurseDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/dashboard/*" element={<DashboardRouter />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/admin/enhanced" element={<EnhancedAdminPortal />} />
              <Route path="/admin/*" element={<AdminPortal />} />
              
              {/* Background Check Routes */}
              <Route 
                path="/background-check/:backgroundCheckId" 
                element={<NurseBackgroundCheckPage />} 
              />
              <Route 
                path="/background-check/:nurseId/:clientId" 
                element={<BackgroundCheckPage />} 
              />
              <Route 
                path="/background-check/:nurseId/:clientId/:jobPostingId" 
                element={<BackgroundCheckPage />} 
              />
              
              {/* Approval and Status Pages */}
              <Route path="/pending-approval" element={<PendingApprovalPage />} />
              
              {/* Catch All - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}