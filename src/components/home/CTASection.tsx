import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, CheckCircle, Shield, Clock, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT_INFO } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const benefits = [
  { icon: CheckCircle, text: "7 services professionnels" },
  { icon: Shield, text: "Paiement 100% sécurisé" },
  { icon: Clock, text: "Support disponible 24/7" },
];

export function CTASection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleQuickSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setIsSubmitting(true);
    const { error } = await signUpWithEmail(email, password);
    setIsSubmitting(false);
    
    if (!error) {
      toast.success("Compte créé avec succès ! Vérifiez votre email.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          
          {/* Floating decorations */}
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

          <div className="relative grid lg:grid-cols-2 gap-12 p-8 sm:p-12 lg:p-16">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Rejoignez-nous maintenant
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Prêt à démarrer votre{" "}
                <span className="gradient-text">projet ?</span>
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Créez votre compte gratuitement et accédez à tous nos services professionnels. 
                Notre équipe est là pour vous accompagner à chaque étape.
              </p>

              {/* Benefits list */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div 
                      key={benefit.text}
                      className="flex items-center gap-3 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="font-medium">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp button */}
              <Button size="lg" variant="outline" className="group border-2" asChild>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5 text-green-500" />
                  Discuter sur WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            {/* Right side - Signup form */}
            <div className="relative">
              <div className="bg-background/80 backdrop-blur-xl border rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Créer un compte gratuit</h3>
                  <p className="text-muted-foreground">En moins de 30 secondes</p>
                </div>

                <form onSubmit={handleQuickSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cta-email"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cta-password"
                        type="password"
                        placeholder="Min. 6 caractères"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary shadow-primary text-lg h-12 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Créer mon compte
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">ou</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth">
                    J'ai déjà un compte
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  En créant un compte, vous acceptez nos{" "}
                  <Link to="/terms" className="underline hover:text-primary">
                    conditions d'utilisation
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
