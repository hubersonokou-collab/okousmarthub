import { Link } from "react-router-dom";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  ArrowRight,
  FileText,
  Bot,
  Settings,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface DashboardOverviewProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
    totalSpent: number;
  };
  profile: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  formatPrice: (price: number) => string;
}

// Mock data for the activity chart
const activityData = [
  { name: "Lun", value: 2 },
  { name: "Mar", value: 1 },
  { name: "Mer", value: 3 },
  { name: "Jeu", value: 0 },
  { name: "Ven", value: 2 },
  { name: "Sam", value: 4 },
  { name: "Dim", value: 1 },
];

const quickActions = [
  {
    icon: FileText,
    label: "Nouvelle commande",
    description: "Commander un service",
    href: "/services",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Bot,
    label: "Assistant IA",
    description: "Poser une question",
    href: "#ai",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Settings,
    label: "Paramètres",
    description: "Gérer mon profil",
    href: "#profile",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Zap,
    label: "Services populaires",
    description: "Voir les tendances",
    href: "/services",
    color: "from-green-500 to-emerald-600",
  },
];

export function DashboardOverview({ stats, profile, formatPrice }: DashboardOverviewProps) {
  // Calculate profile completion
  const profileFields = [
    profile?.full_name,
    profile?.phone,
    profile?.avatar_url,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  return (
    <div className="space-y-8">
      {/* Profile Completion */}
      {profileCompletion < 100 && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Complétez votre profil</span>
                  <span className="text-sm text-muted-foreground">({profileCompletion}%)</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
              <Button size="sm" variant="outline">
                Compléter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards with Sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total commandes</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(217, 91%, 50%)" 
                    strokeWidth={2}
                    fill="url(#colorBlue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En cours</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>En traitement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Terminées</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>100% livrées</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total dépensé</p>
                <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span>Fidélité active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.href}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">{action.label}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Motivation Widget */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <CardContent className="relative py-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Conseil du jour
          </div>
          <p className="text-xl font-medium max-w-2xl mx-auto">
            "La clé du succès réside dans la préparation. Laissez-nous vous accompagner dans chaque étape de vos projets."
          </p>
          <Button className="mt-6 gradient-primary shadow-primary" asChild>
            <Link to="/services">
              Explorer nos services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
