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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/tools/translator" element={<VoiceTranslatorPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
