import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Loader2, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  customer_email: string | null;
  details: unknown;
  service: {
    name: string;
    category: string;
  } | null;
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            service:services(name, category)
          `)
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data as unknown as Order);

      } catch (error) {
        console.error("Error loading order:", error);
        toast({
          title: "Erreur",
          description: "Commande introuvable",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId, navigate, toast]);

  const handlePayment = async () => {
    if (!order) return;
    
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("paystack-initialize", {
        body: {
          orderId: order.id,
          email: order.customer_email || user.email,
          amount: order.total_amount,
          callbackUrl: `${window.location.origin}/payment/success`,
          metadata: {
            service_name: order.service?.name,
          },
        },
      });

      if (error) throw error;

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de paiement",
        description: "Impossible d'initialiser le paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const getVariantName = () => {
    if (typeof order.details === 'object' && order.details !== null && 'variant' in order.details) {
      return String((order.details as Record<string, unknown>).variant);
    }
    return "Standard";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold">Paiement</h1>
              <p className="text-xs text-muted-foreground">Finalisez votre commande</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
              <CardDescription>Commande #{order.id.slice(0, 8)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.service?.name || "Service"}</p>
                  <p className="text-sm text-muted-foreground">{getVariantName()}</p>
                </div>
                <span className="text-lg font-bold">
                  {order.total_amount.toLocaleString()} FCFA
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total à payer</span>
                  <span className="font-bold text-primary">
                    {order.total_amount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Mode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Carte bancaire</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Mobile Money</p>
                  <p className="text-xs text-muted-foreground">Orange, MTN, Wave</p>
                </div>
              </div>
              
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full gradient-primary shadow-primary"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirection vers Paystack...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Payer {order.total_amount.toLocaleString()} FCFA
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Paiement sécurisé par Paystack</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Paiement 100% sécurisé</p>
              <p className="text-xs text-muted-foreground">
                Vos informations de paiement sont protégées par un cryptage SSL de bout en bout.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
