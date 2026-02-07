import { Link } from "react-router-dom";
import { ArrowRight, FileText, GraduationCap, Plane, FileCheck, Calculator, Globe, BookOpen, Star, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICE_DEFAULT_IMAGES } from "@/lib/constants";

const iconMap = {
  FileText,
  GraduationCap,
  Plane,
  FileCheck,
  Calculator,
  Globe,
  BookOpen,
  BarChart3,
};

const services = [
  {
    icon: "FileText",
    name: "Rédaction Académique",
    slug: "redaction",
    description: "Rapports de stage BT/BTS et mémoires Licence",
    price: "50 000 FCFA",
    gradient: "from-blue-600 to-indigo-700",
    popular: true,
  },
  {
    icon: "GraduationCap",
    name: "Inscription VAP/VAE",
    slug: "inscription-vap-vae",
    description: "Diplômes DUT, Licence et Master par validation",
    price: "75 000 FCFA",
    gradient: "from-fuchsia-500 to-purple-700",
    popular: false,
  },
  {
    icon: "Plane",
    name: "Assistance Voyage",
    slug: "assistance-voyage",
    description: "Visas travail, étude, visiteur et Decreto Flussi",
    price: "100 000 FCFA",
    gradient: "from-orange-500 to-rose-600",
    popular: true,
  },
  {
    icon: "FileCheck",
    name: "CV & Lettre de Motivation",
    slug: "cv-lettre",
    description: "CV ATS, modèles canadien/français, traductions",
    price: "15 000 FCFA",
    gradient: "from-emerald-500 to-teal-600",
    popular: false,
  },
  {
    icon: "Calculator",
    name: "Gestion Comptabilité",
    slug: "comptabilite",
    description: "Création d'entreprise et gestion comptable",
    price: "80 000 FCFA",
    gradient: "from-amber-500 to-yellow-600",
    popular: false,
  },
  {
    icon: "Globe",
    name: "Création Site Web",
    slug: "creation-site-web",
    description: "Sites vitrines, e-commerce et portfolios",
    price: "150 000 FCFA",
    gradient: "from-cyan-500 to-blue-600",
    popular: true,
  },
  {
    icon: "BookOpen",
    name: "Formation Pratique",
    slug: "formation",
    description: "Informatique, comptabilité, design, marketing",
    price: "25 000 FCFA",
    gradient: "from-violet-500 to-indigo-600",
    popular: false,
  },
  {
    icon: "BarChart3",
    name: "Analyse Financière",
    slug: "analyse-financiere",
    description: "Études financières, business plans, audit et conseil",
    price: "120 000 FCFA",
    gradient: "from-rose-500 to-pink-600",
    popular: true,
  },
];

export function ServicesGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            <TrendingUp className="h-3 w-3 mr-2" />
            8 services professionnels
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Nos <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre gamme complète de services professionnels conçus pour répondre à tous vos besoins.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            const imageUrl = SERVICE_DEFAULT_IMAGES[service.slug] || SERVICE_DEFAULT_IMAGES["formation"];
            return (
              <Card
                key={service.slug}
                className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl card-3d animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image banner */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-40`} />
                  <div className={`absolute top-3 left-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 dark:bg-black/60 backdrop-blur-sm text-foreground shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Popular badge */}
                {service.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Populaire
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-2 relative pt-4">
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">À partir de</span>
                      <p className="text-lg font-bold gradient-text">{service.price}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="group/btn hover:bg-blue-600 hover:text-white" asChild>
                      <Link to={`/services/${service.slug}`}>
                        Détails
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>

                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="group border-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all" asChild>
            <Link to="/services">
              Voir tous les services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
