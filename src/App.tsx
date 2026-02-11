import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/Dashboard";
import Formations from "./pages/Formations";
import FormationDetail from "./pages/FormationDetail";
import Admin from "./pages/Admin";
import VoiceTranslatorPage from "./pages/VoiceTranslatorPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import AcademicService from "./pages/AcademicService";
import AcademicTrackerPage from "./pages/AcademicTrackerPage";
import VAPVAEService from "./pages/VAPVAEService";
import VAPVAETrackerPage from "./pages/VAPVAETrackerPage";
import TravelService from "./pages/TravelService";
import TravelTrackerPage from "./pages/TravelTrackerPage";
import DynamicTravelForm from "./components/travel/DynamicTravelForm";
import ClientDashboard from "./pages/ClientDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import TravelPaymentPage from "./pages/TravelPaymentPage";
import AICVServicePage from "./pages/AICVServicePage";
import CreditPurchasePage from "./pages/CreditPurchasePage";
import AIPhotoGeneratorPage from "./pages/AIPhotoGeneratorPage";
import AIPhotoGalleryPage from "./pages/AIPhotoGalleryPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import UnifiedDashboardPage from "./pages/UnifiedDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/services/redaction-academique" element={<AcademicService />} />
          <Route path="/services/redaction-academique/suivi" element={<AcademicTrackerPage />} />
          <Route path="/services/vap-vae" element={<VAPVAEService />} />
          <Route path="/services/vap-vae/suivi" element={<VAPVAETrackerPage />} />
          <Route path="/voyage" element={<TravelService />} />
          <Route path="/services/assistance-voyage" element={<TravelService />} />
          <Route path="/services/assistance-voyage/suivi" element={<TravelTrackerPage />} />
          <Route path="/services/assistance-voyage/demande" element={<DynamicTravelForm />} />
          <Route path="/voyage/payment/:requestId" element={<TravelPaymentPage />} />
          <Route path="/dashboard" element={<UnifiedDashboardPage />} />
          <Route path="/dashboard/legacy" element={<Dashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/client/request/:id" element={<RequestDetailsPage />} />
          <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/tools/translator" element={<VoiceTranslatorPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services/cv-ai" element={<AICVServicePage />} />
          <Route path="/services/cv-ai/credits" element={<CreditPurchasePage />} />
          <Route path="/services/cv-ai/photo-generator" element={<AIPhotoGeneratorPage />} />
          <Route path="/services/cv-ai/photo-gallery" element={<AIPhotoGalleryPage />} />
          <Route path="/services/cv-ai/create-cv" element={<ComingSoonPage />} />
          <Route path="/services/cv-ai/create-letter" element={<ComingSoonPage />} />
          <Route path="/services/cv-ai/documents" element={<ComingSoonPage />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
