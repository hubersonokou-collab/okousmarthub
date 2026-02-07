import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, GraduationCap, Plane, FileCheck, Calculator, Globe, BookOpen, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES, CATEGORY_COLORS, SERVICE_DEFAULT_IMAGES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  GraduationCap,
  Plane,
  FileCheck,
  Calculator,
  Globe,
  BookOpen,
};

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  icon: string;
  base_price: number;
  category: string;
  is_active: boolean;
  display_order: number;
  image_url?: string | null;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map((s) => s.category))];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-600/10 via-fuchsia-500/5 to-orange-500/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-fuchsia-500/5 animate-gradient" style={{ backgroundSize: "200% 200%" }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Nos <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Découvrez notre gamme complète de services professionnels conçus pour répondre à tous vos besoins.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un service..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Filters & Services */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Tous
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {CATEGORIES[category as keyof typeof CATEGORIES] || category}
                </Button>
              ))}
            </div>

            {/* Services grid */}
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
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun service trouvé.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => {
                  const Icon = iconMap[service.icon] || FileText;
                  const colors = CATEGORY_COLORS[service.category as keyof typeof CATEGORY_COLORS];
                  const bgColor = colors?.bg || "bg-blue-600";
                  const gradient = colors?.gradient || "from-blue-600 to-indigo-700";
                  const imageUrl = service.image_url || SERVICE_DEFAULT_IMAGES[service.slug] || SERVICE_DEFAULT_IMAGES["formation"];

                  return (
                    <Card
                      key={service.id}
                      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                    >
                      {/* Image banner */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-30`} />
                        <div className={`absolute top-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <CardHeader className="pb-2 pt-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                            {CATEGORIES[service.category as keyof typeof CATEGORIES] || service.category}
                          </Badge>
                        </div>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold gradient-text">
                            À partir de {formatPrice(service.base_price)}
                          </span>
                          <Button variant="ghost" size="sm" className="group/btn hover:bg-blue-600 hover:text-white" asChild>
                            <Link to={`/services/${service.slug}`}>
                              Commander
                              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
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
      </main>
      <Footer />
    </div>
  );
};

export default Services;
