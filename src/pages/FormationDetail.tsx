import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, BookOpen, CheckCircle, Calendar, MapPin, Monitor, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormationRegistrationForm } from "@/components/formations/FormationRegistrationForm";

interface FormationModule {
  title: string;
  duration: string;
  topics: string[];
}

interface FormationSession {
  date: string;
  available: number;
  location?: string;
  isOnline?: boolean;
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
}

// Demo modules data (can be extended to DB later)
const formationModules: Record<string, { objectives: string[]; modules: FormationModule[]; prerequisites: string[]; certification: string }> = {
  "1": {
    objectives: [
      "Maîtriser les bases de HTML, CSS et JavaScript",
      "Créer des applications React modernes",
      "Utiliser TypeScript pour un code robuste",
      "Déployer des applications web en production"
    ],
    modules: [
      { title: "Fondamentaux du Web", duration: "2 semaines", topics: ["HTML5 sémantique", "CSS3 et Flexbox/Grid", "JavaScript ES6+", "Git et versioning"] },
      { title: "React & TypeScript", duration: "4 semaines", topics: ["Composants et Props", "Hooks (useState, useEffect)", "TypeScript basics", "State management"] },
      { title: "Backend & APIs", duration: "3 semaines", topics: ["REST APIs", "Supabase/Firebase", "Authentification", "Base de données"] },
      { title: "Projet Final", duration: "3 semaines", topics: ["Application complète", "Tests et debugging", "Déploiement", "Présentation"] }
    ],
    prerequisites: ["Connaissances basiques en informatique", "Motivation et régularité"],
    certification: "Certificat de Développeur Web Full Stack"
  },
  "2": {
    objectives: [
      "Comprendre les architectures réseau",
      "Configurer des équipements réseau",
      "Sécuriser une infrastructure",
      "Diagnostiquer et résoudre les problèmes"
    ],
    modules: [
      { title: "Fondamentaux Réseau", duration: "2 semaines", topics: ["Modèle OSI", "TCP/IP", "Adressage IP", "Sous-réseaux"] },
      { title: "Configuration Réseau", duration: "3 semaines", topics: ["Routeurs et switches", "VLANs", "DHCP et DNS", "Protocoles de routage"] },
      { title: "Sécurité Réseau", duration: "2 semaines", topics: ["Pare-feu", "VPN", "Détection d'intrusion", "Bonnes pratiques"] },
      { title: "Administration", duration: "1 semaine", topics: ["Monitoring", "Maintenance", "Documentation", "Projet pratique"] }
    ],
    prerequisites: ["Notions de base en informatique"],
    certification: "Certificat d'Administrateur Réseau"
  },
  "3": {
    objectives: [
      "Maîtriser les principes comptables",
      "Établir un bilan et compte de résultat",
      "Comprendre la fiscalité des entreprises",
      "Utiliser les logiciels comptables"
    ],
    modules: [
      { title: "Bases de Comptabilité", duration: "2 semaines", topics: ["Plan comptable", "Écritures comptables", "Journal et grand livre", "Balance"] },
      { title: "États Financiers", duration: "3 semaines", topics: ["Bilan", "Compte de résultat", "Annexes", "Analyse financière"] },
      { title: "Fiscalité", duration: "2 semaines", topics: ["TVA", "IS/IR", "Déclarations fiscales", "Optimisation"] },
      { title: "Pratique", duration: "1 semaine", topics: ["Logiciels comptables", "Cas pratiques", "Révision", "Examen"] }
    ],
    prerequisites: ["Niveau Bac minimum", "Aisance avec les chiffres"],
    certification: "Certificat de Comptable"
  },
  "4": {
    objectives: [
      "Maîtriser Adobe Photoshop",
      "Créer des illustrations avec Illustrator",
      "Concevoir des identités visuelles",
      "Réaliser des supports print et web"
    ],
    modules: [
      { title: "Photoshop", duration: "3 semaines", topics: ["Interface et outils", "Retouche photo", "Montage", "Effets et filtres"] },
      { title: "Illustrator", duration: "3 semaines", topics: ["Dessin vectoriel", "Logos", "Typographie", "Mise en page"] },
      { title: "Identité Visuelle", duration: "1 semaine", topics: ["Charte graphique", "Branding", "Applications", "Présentation client"] },
      { title: "Portfolio", duration: "1 semaine", topics: ["Projets personnels", "Mise en valeur", "Présentation"] }
    ],
    prerequisites: ["Créativité et sens artistique", "Ordinateur personnel recommandé"],
    certification: "Certificat de Designer Graphique"
  },
  "5": {
    objectives: [
      "Maîtriser le SEO et le référencement",
      "Gérer les réseaux sociaux professionnellement",
      "Créer des campagnes publicitaires efficaces",
      "Analyser les performances marketing"
    ],
    modules: [
      { title: "SEO & Référencement", duration: "2 semaines", topics: ["Mots-clés", "Optimisation on-page", "Link building", "SEO technique"] },
      { title: "Réseaux Sociaux", duration: "2 semaines", topics: ["Stratégie social media", "Création de contenu", "Community management", "Analytics"] },
      { title: "Publicité en Ligne", duration: "1 semaine", topics: ["Google Ads", "Facebook/Instagram Ads", "Budget et ROI", "A/B testing"] },
      { title: "Stratégie Globale", duration: "1 semaine", topics: ["Plan marketing", "Funnel de conversion", "Email marketing", "Projet final"] }
    ],
    prerequisites: ["Maîtrise des outils informatiques de base"],
    certification: "Certificat de Spécialiste Marketing Digital"
  },
  "6": {
    objectives: [
      "Diagnostiquer les pannes courantes",
      "Réparer smartphones et tablettes",
      "Entretenir et réparer ordinateurs",
      "Gérer une activité de réparation"
    ],
    modules: [
      { title: "Diagnostic", duration: "1 semaine", topics: ["Pannes logicielles", "Pannes matérielles", "Outils de diagnostic", "Méthodologie"] },
      { title: "Réparation Mobile", duration: "2 semaines", topics: ["Écrans", "Batteries", "Connecteurs", "Micro-soudure"] },
      { title: "Réparation PC", duration: "1 semaine", topics: ["Composants", "Assemblage", "OS et drivers", "Récupération données"] },
      { title: "Pratique", duration: "1 mois pratique en atelier", topics: ["Cas réels", "Gestion stock", "Relation client"] }
    ],
    prerequisites: ["Dextérité manuelle", "Patience et minutie"],
    certification: "Certificat de Technicien Réparateur"
  }
};

const categoryColors: Record<string, string> = {
  informatique: "bg-blue-500",
  comptabilite: "bg-green-500",
  design: "bg-purple-500",
  marketing: "bg-orange-500",
  maintenance: "bg-red-500",
};

const demoFormations: Formation[] = [
  {
    id: "1",
    title: "Développement d'Applications Web",
    category: "informatique",
    description: "Apprenez à créer des applications web modernes avec React, TypeScript et les dernières technologies.",
    duration: "3 mois",
    price: 150000,
    sessions: [
      { date: "2024-03-01", available: 10, location: "Centre Okou, Cotonou", isOnline: false },
      { date: "2024-04-15", available: 15, isOnline: true }
    ],
    is_active: true,
  },
  {
    id: "2",
    title: "Réseaux Informatiques",
    category: "informatique",
    description: "Maîtrisez les fondamentaux des réseaux : configuration, sécurité et maintenance.",
    duration: "2 mois",
    price: 100000,
    sessions: [
      { date: "2024-03-15", available: 15, location: "Centre Okou, Cotonou" },
      { date: "2024-05-01", available: 20, isOnline: true }
    ],
    is_active: true,
  },
  {
    id: "3",
    title: "Comptabilité Pratique",
    category: "comptabilite",
    description: "Formation complète en comptabilité : bilan, compte de résultat, fiscalité.",
    duration: "2 mois",
    price: 80000,
    sessions: [{ date: "2024-04-01", available: 20, location: "Centre Okou, Cotonou" }],
    is_active: true,
  },
  {
    id: "4",
    title: "Design Graphique",
    category: "design",
    description: "Maîtrisez Photoshop, Illustrator et les principes du design moderne.",
    duration: "2 mois",
    price: 90000,
    sessions: [
      { date: "2024-03-20", available: 12, location: "Centre Okou, Cotonou" },
      { date: "2024-04-20", available: 25, isOnline: true }
    ],
    is_active: true,
  },
  {
    id: "5",
    title: "Marketing Digital",
    category: "marketing",
    description: "SEO, réseaux sociaux, publicité en ligne : devenez un expert du marketing digital.",
    duration: "6 semaines",
    price: 75000,
    sessions: [{ date: "2024-04-10", available: 18, isOnline: true }],
    is_active: true,
  },
  {
    id: "6",
    title: "Maintenance Téléphone & Ordinateur",
    category: "maintenance",
    description: "Apprenez à diagnostiquer et réparer smartphones et ordinateurs.",
    duration: "1 mois",
    price: 60000,
    sessions: [{ date: "2024-03-25", available: 8, location: "Centre Okou, Cotonou" }],
    is_active: true,
  },
];

const FormationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormation = async () => {
      // First try to fetch from DB
      const { data, error } = await supabase
        .from("formations")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        // Fallback to demo data
        const demoFormation = demoFormations.find((f) => f.id === id);
        if (demoFormation) {
          setFormation(demoFormation);
        }
      } else {
        setFormation({
          ...data,
          sessions: (Array.isArray(data.sessions) ? data.sessions : null) as unknown as FormationSession[] | null,
        });
      }
      setLoading(false);
    };

    if (id) {
      fetchFormation();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Formation non trouvée</h1>
          <Button asChild>
            <Link to="/formations">Retour aux formations</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const moduleData = formationModules[formation.id] || {
    objectives: ["Objectifs à définir"],
    modules: [],
    prerequisites: ["Aucun prérequis spécifique"],
    certification: "Attestation de formation"
  };

  const bgColor = categoryColors[formation.category] || "bg-primary";
  const onlineSessions = formation.sessions?.filter((s) => s.isOnline) || [];
  const inPersonSessions = formation.sessions?.filter((s) => !s.isOnline) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div className="flex flex-wrap items-start gap-4 mb-4">
              <Badge className={`${bgColor} text-white text-sm`}>
                {formation.category.charAt(0).toUpperCase() + formation.category.slice(1)}
              </Badge>
              {onlineSessions.length > 0 && (
                <Badge variant="outline" className="border-primary text-primary">
                  <Monitor className="mr-1 h-3 w-3" />
                  Disponible en ligne
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{formation.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">{formation.description}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Durée : {formation.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>{moduleData.certification}</span>
              </div>
              <div className="flex items-center gap-2 text-xl font-bold text-primary">
                {formatPrice(formation.price)}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                <Tabs defaultValue="programme" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="programme">Programme</TabsTrigger>
                    <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="programme" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Programme de la Formation
                        </CardTitle>
                        <CardDescription>
                          Découvrez le contenu détaillé de chaque module
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {moduleData.modules.map((module, index) => (
                          <div key={index} className="border-l-4 border-primary pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">
                                Module {index + 1} : {module.title}
                              </h3>
                              <Badge variant="secondary">{module.duration}</Badge>
                            </div>
                            <ul className="space-y-1">
                              {module.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="flex items-center gap-2 text-muted-foreground">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="objectifs" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Objectifs de la Formation</CardTitle>
                        <CardDescription>Ce que vous saurez faire à l'issue de cette formation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3">À la fin de cette formation, vous serez capable de :</h4>
                          <ul className="space-y-2">
                            {moduleData.objectives.map((objective, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Prérequis :</h4>
                          <ul className="space-y-2">
                            {moduleData.prerequisites.map((prereq, index) => (
                              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-primary">•</span>
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sessions" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sessions Disponibles</CardTitle>
                        <CardDescription>Choisissez la session qui vous convient</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {inPersonSessions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              Sessions en Présentiel
                            </h4>
                            <div className="space-y-3">
                              {inPersonSessions.map((session, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div>
                                    <p className="font-medium">{formatDate(session.date)}</p>
                                    <p className="text-sm text-muted-foreground">{session.location}</p>
                                  </div>
                                  <Badge variant="secondary">
                                    <Users className="mr-1 h-3 w-3" />
                                    {session.available} places
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {onlineSessions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-primary" />
                              Sessions en Ligne
                            </h4>
                            <div className="space-y-3">
                              {onlineSessions.map((session, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div>
                                    <p className="font-medium">{formatDate(session.date)}</p>
                                    <p className="text-sm text-muted-foreground">Formation à distance via Zoom/Meet</p>
                                  </div>
                                  <Badge variant="secondary">
                                    <Users className="mr-1 h-3 w-3" />
                                    {session.available} places
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {formation.sessions?.length === 0 && (
                          <p className="text-muted-foreground">Aucune session programmée pour le moment. Contactez-nous pour plus d'informations.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Registration */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <FormationRegistrationForm
                    formation={formation}
                    sessions={formation.sessions || []}
                    formatPrice={formatPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FormationDetail;
