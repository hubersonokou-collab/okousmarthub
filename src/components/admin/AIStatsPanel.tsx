import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Mic, TrendingUp, Users, Zap } from "lucide-react";

export function AIStatsPanel() {
  const stats = [
    {
      title: "Conversations IA",
      value: "1,247",
      change: "+23%",
      icon: MessageSquare,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Commandes Vocales",
      value: "438",
      change: "+15%",
      icon: Mic,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Utilisateurs IA",
      value: "89",
      change: "+8%",
      icon: Users,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Taux de Satisfaction",
      value: "94%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  const topQuestions = [
    { question: "Comment rédiger un mémoire ?", count: 156 },
    { question: "Documents pour visa France", count: 134 },
    { question: "Créer un CV professionnel", count: 98 },
    { question: "Inscription VAE/VAP", count: 87 },
    { question: "Création d'entreprise", count: 76 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-500 mt-1">{stat.change} ce mois</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Questions les plus fréquentes
            </CardTitle>
            <CardDescription>Top 5 des demandes utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topQuestions.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full gradient-primary text-white text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm">{item.question}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" />
              Fonctionnalités IA Actives
            </CardTitle>
            <CardDescription>État des services d'intelligence artificielle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Assistant Chatbot", status: "Actif", color: "bg-green-500" },
                { name: "Commande Vocale", status: "Actif", color: "bg-green-500" },
                { name: "Synthèse Vocale", status: "Actif", color: "bg-green-500" },
                { name: "Conseils Personnalisés", status: "Actif", color: "bg-green-500" },
                { name: "Analyse de Documents", status: "Bientôt", color: "bg-amber-500" },
              ].map((feature) => (
                <div key={feature.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">{feature.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${feature.color}`} />
                    <span className="text-xs text-muted-foreground">{feature.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
