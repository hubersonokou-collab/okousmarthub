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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <a href="mailto:Okoukouassihuberson@gmail.com">Me Contacter par Email</a>
              </Button>
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                <a
                  href="https://wa.me/2250708817409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
