import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Package,
  CreditCard,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  ArrowLeft,
  Bot,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/admin" },
  { icon: DollarSign, label: "Tarifs", path: "/admin/pricing" },
  { icon: Package, label: "Commandes", path: "/admin/orders" },
  { icon: CreditCard, label: "Transactions", path: "/admin/transactions" },
  { icon: BarChart3, label: "Analyse revenus", path: "/admin/analytics" },
  { icon: MessageSquare, label: "Témoignages", path: "/admin/testimonials" },
  { icon: Users, label: "Utilisateurs", path: "/admin/users" },
  { icon: Bot, label: "Assistant IA", path: "/admin/ai-stats" },
  { icon: Briefcase, label: "Portfolio", path: "/admin/portfolio" },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold">SuperAdmin</h2>
            <p className="text-xs text-muted-foreground">Panneau de contrôle</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
