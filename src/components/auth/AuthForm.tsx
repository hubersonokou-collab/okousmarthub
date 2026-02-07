import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Phone, UserCircle, Eye, EyeOff, Loader2, ArrowRight, Shield, Sparkles } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { COUNTRY_CODES, APP_NAME } from "@/lib/constants";
import { OTPVerification } from "./OTPVerification";
import { useEffect } from "react";

const emailSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  fullName: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailSchema>;

export function AuthForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithPhone, signInAnonymously, loading, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "anonymous">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+225");
  const [showOTP, setShowOTP] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onEmailSubmit = async (data: EmailFormData) => {
    if (mode === "login") {
      const { error } = await signInWithEmail(data.email, data.password);
      if (!error) {
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUpWithEmail(data.email, data.password, data.fullName);
      if (!error) {
        reset();
      }
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${phoneNumber}`;
    const { error } = await signInWithPhone(fullPhone);
    if (!error) {
      setShowOTP(true);
    }
  };

  const handleAnonymousLogin = async () => {
    const { error } = await signInAnonymously();
    if (!error) {
      navigate("/services");
    }
  };

  if (showOTP) {
    return (
      <OTPVerification
        phone={`${countryCode}${phoneNumber}`}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-2xl border-0">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-3 w-3" />
            {APP_NAME}
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </CardTitle>
          <CardDescription className="mt-2">
            {mode === "login"
              ? "Connectez-vous pour accéder à votre espace"
              : "Inscrivez-vous pour commencer"}
          </CardDescription>
        </div>
      </div>

      <CardContent className="p-6">
        <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as typeof authMethod)}>
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
            <TabsTrigger value="email" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Téléphone</span>
            </TabsTrigger>
            <TabsTrigger value="anonymous" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Invité</span>
            </TabsTrigger>
          </TabsList>

          {/* Email Auth */}
          <TabsContent value="email">
            <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    placeholder="Jean Dupont"
                    className="h-12"
                    {...register("fullName")}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    className="pl-10 h-12"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-12 h-12"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 gradient-primary shadow-primary text-lg group" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Se connecter" : "S'inscrire"}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              {mode === "login" ? (
                <p>
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setMode("signup")}
                  >
                    S'inscrire gratuitement
                  </button>
                </p>
              ) : (
                <p>
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Se connecter
                  </button>
                </p>
              )}
            </div>
          </TabsContent>

          {/* Phone Auth */}
          <TabsContent value="phone">
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[110px] h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07 00 00 00 00"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 h-12"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 gradient-primary shadow-primary group" disabled={loading || !phoneNumber}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Recevoir le code
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Un code de vérification sera envoyé par SMS.
              </p>
            </form>
          </TabsContent>

          {/* Anonymous Auth */}
          <TabsContent value="anonymous">
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <UserCircle className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium mb-2">Mode Invité</p>
                <p className="text-sm text-muted-foreground">
                  Explorez nos services sans créer de compte. Certaines fonctionnalités seront limitées.
                </p>
              </div>
              <Button
                onClick={handleAnonymousLogin}
                variant="outline"
                className="w-full h-12 border-2 hover:bg-primary/5"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <UserCircle className="mr-2 h-5 w-5" />
                    Continuer en tant qu'invité
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
