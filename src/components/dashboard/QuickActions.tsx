import { Link } from "react-router-dom";
import { 
  FileText, 
  Bot, 
  Settings, 
  Zap, 
  HelpCircle,
  CreditCard,
  Star,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    icon: FileText,
    label: "Nouvelle commande",
    description: "Passer une commande",
    href: "/services",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Bot,
    label: "Assistant IA",
    description: "Poser une question",
    action: "ai",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Star,
    label: "Laisser un avis",
    description: "Partager votre expérience",
    href: "/dashboard?tab=review",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: HelpCircle,
    label: "Aide & Support",
    description: "Centre d'assistance",
    href: "/support",
    color: "from-green-500 to-emerald-600",
  },
];

interface QuickActionsProps {
  onAIClick?: () => void;
}

export function QuickActions({ onAIClick }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        const content = (
          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-1">{action.label}</h4>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        );

        if (action.action === "ai" && onAIClick) {
          return (
            <div key={action.label} onClick={onAIClick}>
              {content}
            </div>
          );
        }

        return (
          <Link key={action.label} to={action.href || "#"}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
