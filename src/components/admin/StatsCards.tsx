import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalTestimonials: number;
  approvedTestimonials: number;
  recentUsers: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalTestimonials: 0,
    approvedTestimonials: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch orders
        const { data: orders } = await supabase
          .from("orders")
          .select("status, total_amount");

        // Fetch testimonials
        const { data: testimonials } = await supabase
          .from("testimonials")
          .select("is_approved");

        // Fetch recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { count: recentUsersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString());

        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
        const completedOrders = orders?.filter(o => o.status === "completed").length || 0;
        const approvedTestimonials = testimonials?.filter(t => t.is_approved).length || 0;

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue,
          pendingOrders,
          completedOrders,
          totalTestimonials: testimonials?.length || 0,
          approvedTestimonials,
          recentUsers: recentUsersCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  const cards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      subValue: `+${stats.recentUsers} cette semaine`,
      icon: Users,
      gradient: "from-indigo-500 to-purple-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-900",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Revenus Totaux",
      value: formatCurrency(stats.totalRevenue),
      subValue: `${stats.totalOrders} commandes`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Commandes en attente",
      value: stats.pendingOrders,
      subValue: `${stats.completedOrders} terminées`,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-900",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Taux de complétion",
      value: stats.totalOrders > 0 
        ? Math.round((stats.completedOrders / stats.totalOrders) * 100) + "%" 
        : "N/A",
      subValue: `${stats.completedOrders}/${stats.totalOrders}`,
      icon: TrendingUp,
      gradient: "from-sky-500 to-cyan-600",
      iconBg: "bg-sky-100 dark:bg-sky-900",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      title: "Témoignages",
      value: stats.totalTestimonials,
      subValue: `${stats.approvedTestimonials} approuvés`,
      icon: MessageSquare,
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-100 dark:bg-rose-900",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Commandes réussies",
      value: stats.completedOrders,
      subValue: "Livrées avec succès",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subValue}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.iconBg}`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${card.gradient}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
