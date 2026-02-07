import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FORMATION_CATEGORY_COLORS, FORMATION_DEFAULT_IMAGES } from "@/lib/constants";

interface FormationSession {
  date: string;
  available: number;
}

interface Formation {
  id: string;
  title: string;
  category: string;
  description: string | null;
  duration: string | null;
  price: number;
  sessions: FormationSession[] | null;
  is_active: boolean;
  image_url?: string | null;
}

const Formations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      const { data, error } = await supabase
        .from("formations")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching formations:", error);
      } else {
        const formattedData: Formation[] = (data || []).map((item) => ({
          ...item,
          sessions: (Array.isArray(item.sessions) ? item.sessions : null) as unknown as FormationSession[] | null,
        }));
        setFormations(formattedData);
      }
      setLoading(false);
    };

    fetchFormations();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  // Données de démonstration si pas de formations en DB
  const demoFormations: Formation[] = [
    {
      id: "1",
      title: "Développement d'Applications Web",
      category: "informatique",
      description: "Apprenez à créer des applications web modernes avec React, TypeScript et les dernières technologies.",
      duration: "3 mois",
      price: 150000,
      sessions: [{ date: "2024-03-01", available: 10 }],
      is_active: true,
    },
    {
      id: "2",
      title: "Réseaux Informatiques",
      category: "informatique",
      description: "Maîtrisez les fondamentaux des réseaux : configuration, sécurité et maintenance.",
      duration: "2 mois",
      price: 100000,
      sessions: [{ date: "2024-03-15", available: 15 }],
      is_active: true,
    },
    {
      id: "3",
      title: "Comptabilité Pratique",
      category: "comptabilite",
      description: "Formation complète en comptabilité : bilan, compte de résultat, fiscalité.",
      duration: "2 mois",
      price: 80000,
      sessions: [{ date: "2024-04-01", available: 20 }],
      is_active: true,
    },
    {
      id: "4",
      title: "Design Graphique",
      category: "design",
      description: "Maîtrisez Photoshop, Illustrator et les principes du design moderne.",
      duration: "2 mois",
      price: 90000,
      sessions: [{ date: "2024-03-20", available: 12 }],
      is_active: true,
    },
    {
      id: "5",
      title: "Marketing Digital",
      category: "marketing",
      description: "SEO, réseaux sociaux, publicité en ligne : devenez un expert du marketing digital.",
      duration: "6 semaines",
      price: 75000,
      sessions: [{ date: "2024-04-10", available: 18 }],
      is_active: true,
    },
    {
      id: "6",
      title: "Maintenance Téléphone & Ordinateur",
      category: "maintenance",
      description: "Apprenez à diagnostiquer et réparer smartphones et ordinateurs.",
      duration: "1 mois",
      price: 60000,
      sessions: [{ date: "2024-03-25", available: 8 }],
      is_active: true,
    },
  ];

  const displayFormations = formations.length > 0 ? formations : demoFormations;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/5 to-emerald-500/10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-fuchsia-500/5 animate-gradient" style={{ backgroundSize: "200% 200%" }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Nos <span className="gradient-text">Formations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Développez vos compétences avec nos formations pratiques dispensées par des experts du domaine.
            </p>
          </div>
        </section>

        {/* Formations Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <Skeleton className="h-40 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mt-2" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayFormations.map((formation) => {
                  const colors = FORMATION_CATEGORY_COLORS[formation.category];
                  const bgColor = colors?.bg || "bg-blue-600";
                  const gradient = colors?.gradient || "from-blue-600 to-cyan-500";
                  const imageUrl = formation.image_url || FORMATION_DEFAULT_IMAGES[formation.category] || FORMATION_DEFAULT_IMAGES["informatique"];
                  const nextSession = formation.sessions?.[0];

                  return (
                    <Card
                      key={formation.id}
                      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                    >
                      {/* Image banner */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={formation.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-40`} />
                        <div className="absolute top-3 right-3">
                          <Badge className={`${bgColor} text-white border-0 shadow-lg`}>
                            {formation.category.charAt(0).toUpperCase() + formation.category.slice(1)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="text-white font-bold text-lg drop-shadow-lg">
                            {formatPrice(formation.price)}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="pt-4">
                        <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{formation.title}</CardTitle>
                        <CardDescription>{formation.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formation.duration}
                          </div>
                          {nextSession && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {nextSession.available} places
                            </div>
                          )}
                        </div>
                        <Button className={`w-full group/btn bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0`} asChild>
                          <Link to={`/formations/${formation.id}`}>
                            S'inscrire
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>

                      {/* Bottom gradient line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas la formation que vous cherchez ?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Contactez-nous pour nous faire part de vos besoins. Nous pouvons créer des formations sur mesure.
            </p>
            <Button size="lg" variant="outline" className="group border-2 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all" asChild>
              <Link to="/services">
                Voir tous nos services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Formations;
