import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCards } from "@/components/admin/StatsCards";
import { PricingManager } from "@/components/admin/PricingManager";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { TransactionsChart } from "@/components/admin/TransactionsChart";
import { TransactionsManager } from "@/components/admin/TransactionsManager";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { UsersTable } from "@/components/admin/UsersTable";
import { AIStatsPanel } from "@/components/admin/AIStatsPanel";
import { PortfolioManager } from "@/components/admin/PortfolioManager";
import { VoiceAssistant } from "@/components/ai/VoiceAssistant";
import { AcademicAdmin } from "@/components/admin/AcademicAdmin";
import { WebSolutionsManager } from "@/components/admin/WebSolutionsManager";

// Overview Page
function AdminOverview() {
  return (
    <AdminLayout title="Vue d'ensemble" description="Tableau de bord SuperAdmin - OkouSmart Hub">
      <div className="space-y-6">
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionsChart />
        </div>
      </div>
    </AdminLayout>
  );
}

// Pricing Page
function AdminPricing() {
  return (
    <AdminLayout title="Gestion des Tarifs" description="Modifiez les prix de vos services">
      <PricingManager />
    </AdminLayout>
  );
}

// Orders Page
function AdminOrders() {
  return (
    <AdminLayout title="Commandes" description="Suivez et gérez toutes les commandes">
      <OrdersTable />
    </AdminLayout>
  );
}

// Transactions Page
function AdminTransactionsPage() {
  return (
    <AdminLayout title="Transactions" description="Historique des paiements Paystack">
      <TransactionsManager />
    </AdminLayout>
  );
}

// Transactions Chart Page
function AdminTransactionsChart() {
  return (
    <AdminLayout title="Analyse des revenus" description="Graphiques et statistiques financières">
      <TransactionsChart />
    </AdminLayout>
  );
}

// Testimonials Page
function AdminTestimonials() {
  return (
    <AdminLayout title="Témoignages" description="Modérez les avis clients">
      <TestimonialsManager />
    </AdminLayout>
  );
}

// Users Page
function AdminUsers() {
  return (
    <AdminLayout title="Utilisateurs" description="Gérez les comptes utilisateurs">
      <UsersTable />
    </AdminLayout>
  );
}

// AI Stats Page
function AdminAIStats() {
  return (
    <AdminLayout title="Assistant IA" description="Statistiques et performances de l'IA">
      <AIStatsPanel />
    </AdminLayout>
  );
}

// Portfolio Page
function AdminPortfolio() {
  return (
    <AdminLayout title="Portfolio" description="Gérez les projets et réalisations">
      <PortfolioManager />
    </AdminLayout>
  );
}

function AdminAcademic() {
  return (
    <AdminLayout title="Rédaction Académique" description="Gérez les demandes de rédaction">
      <AcademicAdmin />
    </AdminLayout>
  );
}

// Web Solutions Page
function AdminWebSolutions() {
  return (
    <AdminLayout title="Solutions Web" description="Gérez les commandes de sites et services digitaux">
      <WebSolutionsManager />
    </AdminLayout>
  );
}

// Main Admin Router with Protection
export default function Admin() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sidebar">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sidebar-foreground/70">Chargement du panneau admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="transactions" element={<AdminTransactionsPage />} />
        <Route path="analytics" element={<AdminTransactionsChart />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="ai-stats" element={<AdminAIStats />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="academic" element={<AdminAcademic />} />
        <Route path="web-solutions" element={<AdminWebSolutions />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
      <VoiceAssistant context="general" />
    </>
  );
}
