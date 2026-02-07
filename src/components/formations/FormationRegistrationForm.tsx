import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, MapPin, CreditCard, Phone, Mail, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface FormationRegistrationFormProps {
  formation: Formation;
  sessions: FormationSession[];
  formatPrice: (price: number) => string;
}

export function FormationRegistrationForm({ formation, sessions, formatPrice }: FormationRegistrationFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    sessionType: "presential",
    selectedSession: "",
  });

  const onlineSessions = sessions.filter((s) => s.isOnline);
  const inPersonSessions = sessions.filter((s) => !s.isOnline);

  const availableSessions = formData.sessionType === "online" ? onlineSessions : inPersonSessions;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    if (availableSessions.length > 0 && !formData.selectedSession) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une session.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Create an order for this formation
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_amount: formation.price,
          status: "pending",
          details: {
            type: "formation",
            formation_id: formation.id,
            formation_title: formation.title,
            session_type: formData.sessionType,
            session_date: formData.selectedSession,
            customer_name: formData.fullName,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: "Inscription enregistrée !",
        description: "Vous allez être redirigé vers la page de paiement.",
      });

      // Navigate to payment page
      navigate(`/payment/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasOnline = onlineSessions.length > 0;
  const hasInPerson = inPersonSessions.length > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          S'inscrire
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Réservez votre place dès maintenant
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Votre nom complet"
                className="pl-10"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+229 XX XX XX XX"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Session Type */}
          {(hasOnline || hasInPerson) && (
            <div className="space-y-3">
              <Label>Mode de formation</Label>
              <RadioGroup
                value={formData.sessionType}
                onValueChange={(value) => setFormData({ ...formData, sessionType: value, selectedSession: "" })}
                className="grid grid-cols-2 gap-2"
              >
                {hasInPerson && (
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="presential" id="presential" />
                    <Label htmlFor="presential" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-primary" />
                      Présentiel
                    </Label>
                  </div>
                )}
                {hasOnline && (
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                      <Monitor className="h-4 w-4 text-primary" />
                      En ligne
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          )}

          {/* Session Selection */}
          {availableSessions.length > 0 && (
            <div className="space-y-2">
              <Label>Session souhaitée</Label>
              <Select
                value={formData.selectedSession}
                onValueChange={(value) => setFormData({ ...formData, selectedSession: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une date" />
                </SelectTrigger>
                <SelectContent>
                  {availableSessions.map((session, index) => (
                    <SelectItem key={index} value={session.date}>
                      {formatDate(session.date)} ({session.available} places)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Total à payer</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(formation.price)}</span>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Traitement..." : "Continuer vers le paiement"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            En vous inscrivant, vous acceptez nos conditions générales de vente.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
