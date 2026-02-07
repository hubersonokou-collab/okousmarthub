import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, ArrowRight, Download, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderDetails, setOrderDetails] = useState<{
    amount: number;
    orderId: string | null;
  } | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setStatus("failed");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("paystack-verify", {
          body: { reference },
        });

        if (error) throw error;

        if (data.success) {
          setStatus("success");
          setOrderDetails({
            amount: data.amount,
            orderId: data.order_id,
          });
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
      }
    }

    verifyPayment();
  }, [reference]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Paiement échoué</h1>
            <p className="text-muted-foreground mb-6">
              Votre paiement n'a pas pu être traité. Veuillez réessayer.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Retour au tableau de bord
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/services">
                  Voir nos services
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full overflow-hidden">
        {/* Success Animation */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center animate-bounce-in">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Paiement réussi !</h1>
          <p className="text-white/80">Merci pour votre commande</p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Order Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Référence</span>
              <span className="font-mono">{reference?.slice(0, 15)}...</span>
            </div>
            {orderDetails && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-bold">{orderDetails.amount.toLocaleString()} FCFA</span>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-medium">Prochaines étapes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
                Vous recevrez un email de confirmation
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
                Notre équipe commence à traiter votre demande
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span>
                Suivez l'avancement depuis votre tableau de bord
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full gradient-primary">
              <Link to="/dashboard">
                Voir ma commande
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/services">
                Commander un autre service
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Un reçu a été envoyé à votre adresse email
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
