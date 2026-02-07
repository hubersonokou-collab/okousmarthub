import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Package,
  CreditCard,
  MessageSquare,
  Users,
  Settings,
  ArrowLeft,
  Menu,
  X,
  BarChart3,
  Bell,
  Bot,
  Zap,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";
import okouLogo from "@/assets/okou-background.png";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/admin", badge: null },
  { icon: DollarSign, label: "Tarifs", path: "/admin/pricing", badge: null },
  { icon: Package, label: "Commandes", path: "/admin/orders", badge: "12" },
  { icon: CreditCard, label: "Transactions", path: "/admin/transactions", badge: null },
  { icon: MessageSquare, label: "Témoignages", path: "/admin/testimonials", badge: "3" },
  { icon: Users, label: "Utilisateurs", path: "/admin/users", badge: null },
  { icon: Bot, label: "Assistant IA", path: "/admin/ai-stats", badge: "New" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics", badge: null },
  { icon: Briefcase, label: "Portfolio", path: "/admin/portfolio", badge: null },
];

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-transform lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header with CEO Photo */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={okouLogo} 
            alt="CEO" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={okouLogo} 
                  alt="Admin" 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h2 className="font-bold text-white">SuperAdmin</h2>
                <p className="text-xs text-slate-400">{APP_NAME}</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs font-semibold",
                      item.badge === "New" 
                        ? "bg-emerald-500 text-white" 
                        : "bg-amber-500/20 text-amber-300"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5" asChild>
              <Link to="/admin/settings">
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Retour au site
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-600 dark:text-slate-400"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                {description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>
              <Button size="sm" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20">
                <Zap className="h-4 w-4" />
                Actions rapides
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
