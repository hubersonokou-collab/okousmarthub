import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Upload, FileText, Clock, Star, ShoppingCart, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_COLORS } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  base_price: number;
  category: string;
  icon: string;
}

interface ServicePrice {
  id: string;
  variant_name: string;
  price: number;
  description: string | null;
}

interface ServiceRequirement {
  id: string;
  document_name: string;
  is_required: boolean;
  description: string | null;
}

import { SERVICE_DEFAULT_IMAGES } from "@/lib/constants";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [service, setService] = useState<Service | null>(null);
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [requirements, setRequirements] = useState<ServiceRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});

  useEffect(() => {
    async function loadService() {
      if (!slug) return;
      
      try {
        // Load service
        const { data: serviceData, error: serviceError } = await supabase
          .from("services")
          .select("*")
          .eq("slug", slug)
          .single();

        if (serviceError) throw serviceError;
        setService(serviceData);

        // Load prices
        const { data: pricesData } = await supabase
          .from("service_prices")
          .select("*")
          .eq("service_id", serviceData.id)
          .eq("is_active", true)
          .order("price");

        setPrices(pricesData || []);
        if (pricesData && pricesData.length > 0) {
          setSelectedPrice(pricesData[0].id);
        }

        // Load requirements
        const { data: requirementsData } = await supabase
          .from("service_requirements")
          .select("*")
          .eq("service_id", serviceData.id)
          .order("display_order");

        setRequirements(requirementsData || []);

      } catch (error) {
        console.error("Error loading service:", error);
        toast({
          title: "Erreur",
          description: "Service introuvable",
          variant: "destructive",
        });
        navigate("/services");
      } finally {
        setIsLoading(false);
      }
    }

    loadService();
  }, [slug, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour passer commande",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const selectedPriceData = prices.find(p => p.id === selectedPrice);
      const totalAmount = selectedPriceData?.price || service?.base_price || 0;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          service_id: service?.id,
          total_amount: totalAmount,
          status: "pending",
          details: {
            variant: selectedPriceData?.variant_name,
            formData,
            files: Object.keys(files),
          },
          customer_email: user.email,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Upload files
      for (const [key, file] of Object.entries(files)) {
        const fileName = `${user.id}/${order.id}/${key}-${file.name}`;
        await supabase.storage
          .from("documents")
          .upload(fileName, file);
      }

      toast({
        title: "Commande créée",
        description: "Vous allez être redirigé vers le paiement",
      });

      navigate(`/payment/${order.id}`);

    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const categoryColors = CATEGORY_COLORS[service.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.digital;
  const imageUrl = SERVICE_DEFAULT_IMAGES[service.slug] || SERVICE_DEFAULT_IMAGES["formation"];
  const selectedPriceData = prices.find(p => p.id === selectedPrice);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={imageUrl}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux services
              </Link>
            </Button>
            <Badge className={`${categoryColors.bg} text-white mb-3`}>
              {service.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {service.name}
            </h1>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.long_description || service.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents requis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {requirements.map((req) => (
                      <li key={req.id} className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${req.is_required ? "bg-primary" : "bg-muted"}`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {req.document_name}
                            {req.is_required && <span className="text-destructive ml-1">*</span>}
                          </p>
                          {req.description && (
                            <p className="text-sm text-muted-foreground">{req.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de commande</CardTitle>
                <CardDescription>
                  Remplissez les informations pour votre demande
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Price Selection */}
                  {prices.length > 0 && (
                    <div className="space-y-3">
                      <Label>Choisissez une option</Label>
                      <RadioGroup value={selectedPrice} onValueChange={setSelectedPrice}>
                        {prices.map((price) => (
                          <div
                            key={price.id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              selectedPrice === price.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedPrice(price.id)}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={price.id} id={price.id} />
                              <div>
                                <Label htmlFor={price.id} className="font-medium cursor-pointer">
                                  {price.variant_name}
                                </Label>
                                {price.description && (
                                  <p className="text-sm text-muted-foreground">{price.description}</p>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-lg">
                              {price.price.toLocaleString()} FCFA
                            </span>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Additional Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Décrivez votre besoin</Label>
                      <Textarea
                        id="description"
                        placeholder="Donnez-nous plus de détails sur votre projet..."
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Date souhaitée de livraison
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline || ""}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* File Upload */}
                  {requirements.length > 0 && (
                    <div className="space-y-4">
                      <Label>Documents</Label>
                      {requirements.map((req) => (
                        <div key={req.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setFiles({ ...files, [req.document_name]: file });
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {req.document_name} {req.is_required && "(obligatoire)"}
                            </p>
                          </div>
                          {files[req.document_name] && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-primary shadow-primary"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Commander - {(selectedPriceData?.price || service.base_price).toLocaleString()} FCFA
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Prix à partir de</span>
                    <span className="text-2xl font-bold text-primary">
                      {service.base_price.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Délai moyen: 3-5 jours</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>4.8/5 (120 avis)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantees */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nos garanties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Satisfaction garantie ou remboursé",
                  "Support client 24/7",
                  "Révisions illimitées",
                  "Paiement sécurisé",
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{guarantee}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
