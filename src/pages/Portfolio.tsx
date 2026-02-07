import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Github, Layers, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link: string | null;
  technologies: string[] | null;
  is_featured: boolean;
}

const categoryColors: Record<string, string> = {
  projet: "from-blue-500 to-indigo-600",
  web: "from-purple-500 to-pink-600",
  mobile: "from-green-500 to-emerald-600",
  design: "from-orange-500 to-red-600",
  conseil: "from-teal-500 to-cyan-600",
  formation: "from-violet-500 to-purple-600",
};

const demoPortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "OkouSmart Hub Platform",
    description: "Plateforme complète de services professionnels avec gestion des commandes, paiements intégrés et assistant IA.",
    category: "web",
    image_url: null,
    link: "https://okousmarthub.lovable.app",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    is_featured: true,
  },
  {
    id: "2",
    title: "Application Mobile de Gestion",
    description: "Application mobile pour la gestion des inventaires et des stocks en temps réel.",
    category: "mobile",
    image_url: null,
    link: null,
    technologies: ["React Native", "Firebase", "Redux"],
    is_featured: false,
  },
  {
    id: "3",
    title: "Analyse Financière Entreprise",
    description: "Tableaux de bord financiers interactifs pour l'analyse des performances des entreprises.",
    category: "conseil",
    image_url: null,
    link: null,
    technologies: ["Power BI", "Excel", "Python"],
    is_featured: true,
  },
];

export default function Portfolio() {
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as PortfolioItem[];
    },
  });

  const items = portfolioItems && portfolioItems.length > 0 ? portfolioItems : demoPortfolio;
  const featuredItems = items.filter((item) => item.is_featured);
  const otherItems = items.filter((item) => !item.is_featured);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-amber-400 text-amber-400">
              <Star className="h-3 w-3 mr-2 fill-current" />
              Portfolio Professionnel
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              M. OKOU KOUASSI HUBERSON
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Expert en services professionnels, développement web, analyse financière et accompagnement des entreprises.
            </p>
          </div>
        </section>

        {/* Domaines d'expertise */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Domaines d'Expertise</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Développement Web", "Analyse Financière", "Rédaction Académique", "Formation Professionnelle"].map((domain) => (
                <Card key={domain} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Layers className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <p className="font-semibold">{domain}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projets à la une */}
        {featuredItems.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">
                <Star className="inline h-6 w-6 mr-2 text-amber-500" />
                Projets à la Une
              </h2>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {featuredItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all">
                      {item.image_url ? (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className={`h-48 bg-gradient-to-br ${categoryColors[item.category] || categoryColors.projet}`} />
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {item.title}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-2">
                              {item.category}
                            </Badge>
                          </div>
                          {item.link && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tous les projets */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Tous les Projets</h2>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all overflow-hidden">
                    {item.image_url && (
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        {item.link && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <Badge variant="secondary" className="w-fit">{item.category}</Badge>
                      <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    {item.technologies && item.technologies.length > 0 && (
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {item.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Intéressé par une collaboration ?</h2>
            <p className="text-muted-foreground mb-6">
              N'hésitez pas à me contacter pour discuter de vos projets.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <a href="mailto:contact@okousmarthub.com">Me Contacter</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
