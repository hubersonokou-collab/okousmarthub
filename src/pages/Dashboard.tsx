import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Package, 
  LogOut, 
  Loader2,
  Bot,
  Sparkles,
  LayoutDashboard,
  Star,
  Gift,
  Languages,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VoiceAssistant } from "@/components/ai/VoiceAssistant";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { ProfileProgress } from "@/components/dashboard/ProfileProgress";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { ORDER_STATUS_LABELS, APP_NAME } from "@/lib/constants";

interface Order {
  id: string;
  status: keyof typeof ORDER_STATUS_LABELS;
  total_amount: number;
  created_at: string;
  services: {
    name: string;
    category: string;
  } | null;
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Dashboard = () => {
  const { user, isAuthenticated, isAnonymous, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    const { data: ordersData } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        created_at,
        services (name, category)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersData) {
      setOrders(ordersData as Order[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    totalSpent: orders.reduce((sum, o) => sum + o.total_amount, 0),
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary/20 mx-auto" />
          </div>
          <p className="mt-6 text-lg font-medium">Chargement de votre espace...</p>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-muted/30 via-background to-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8 relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/5 via-background to-secondary/5 p-6 lg:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 lg:h-20 lg:w-20 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="gradient-primary text-white text-xl font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary font-medium">{APP_NAME}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    {isAnonymous ? "Bienvenue, Invité !" : `Bonjour, ${profile?.full_name || "Utilisateur"} !`}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Gérez vos commandes et accédez à tous nos services.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/tools/translator">
                    <Languages className="h-4 w-4" />
                    Traducteur vocal
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Progress */}
          {!isAnonymous && (
            <div className="mb-8">
              <ProfileProgress 
                profile={profile} 
                email={user?.email || null}
                onComplete={() => setActiveTab("profile")}
              />
            </div>
          )}

          {/* Guest Mode Banner */}
          {isAnonymous && (
            <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 overflow-hidden">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Mode invité</p>
                      <p className="text-sm text-muted-foreground">
                        Créez un compte pour débloquer toutes les fonctionnalités.
                      </p>
                    </div>
                  </div>
                  <Button className="gradient-primary shadow-primary" asChild>
                    <Link to="/auth?mode=signup">Créer un compte gratuit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-auto p-1 bg-muted/50">
              <TabsTrigger value="overview" className="gap-2 py-3">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 py-3">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Commandes</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2 py-3">
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2 py-3">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <DashboardOverview 
                stats={stats} 
                profile={profile} 
                formatPrice={formatPrice} 
              />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Package className="h-6 w-6 text-primary" />
                      Mes Commandes
                    </h2>
                    <p className="text-muted-foreground">Suivez l'état de toutes vos commandes</p>
                  </div>
                  <Button className="gradient-primary shadow-primary" asChild>
                    <Link to="/services">
                      Nouvelle commande
                    </Link>
                  </Button>
                </div>
                <OrderTimeline 
                  orders={orders} 
                  formatPrice={formatPrice} 
                  formatDate={formatDate} 
                />
              </div>
            </TabsContent>

            {/* AI Tab */}
            <TabsContent value="ai">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    Assistant IA Intelligent
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions et recevez des conseils personnalisés
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Comment utiliser l'assistant ?
                        </h3>
                        <ol className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                            <span>Cliquez sur l'icône du robot en bas à droite</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                            <span>Tapez votre question ou utilisez la commande vocale</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                            <span>Recevez des conseils personnalisés instantanément</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="font-semibold text-lg">Exemples de questions</h3>
                      <div className="space-y-3">
                        {[
                          "Comment rédiger un mémoire de licence ?",
                          "Quels documents pour un visa France ?",
                          "Comment créer un CV professionnel ?",
                          "Aide-moi à créer mon entreprise",
                        ].map((question, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <p className="text-sm group-hover:text-primary transition-colors">"{question}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              {user && (
                <ProfileEditForm 
                  userId={user.id} 
                  email={user.email || null}
                  onUpdate={fetchData}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
};

export default Dashboard;
