import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Sparkles, Mic, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import okouBackground from "@/assets/okou-background.png";

const features = [
  "7 services professionnels",
  "Assistant IA intégré",
  "Commande vocale",
  "Support 24/7",
];

const rotatingWords = ["Rédaction", "Voyage", "CV", "Formation", "Comptabilité"];

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background with CEO Photo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <img 
          src={okouBackground} 
          alt="OkouSmart Hub CEO" 
          className="absolute right-0 top-0 h-full w-1/2 object-cover object-top opacity-20 lg:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          {/* Badge with shimmer effect */}
          <div className="inline-flex items-center rounded-full border glass-effect px-4 py-2 text-sm relative overflow-hidden group">
            <div className="absolute inset-0 animate-shimmer" />
            <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse-glow relative z-10" />
            <span className="mr-2 rounded-full gradient-primary px-2 py-0.5 text-xs font-medium text-white relative z-10">
              Nouveau
            </span>
            <span className="relative z-10">Assistant IA avec commande vocale</span>
          </div>

          {/* Title with rotating words */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
            Bienvenue sur
            <span className="gradient-text block mt-2">{APP_NAME}</span>
          </h1>

          {/* Rotating service keywords */}
          <div className="flex items-center gap-3 text-xl lg:text-2xl">
            <span className="text-muted-foreground">Expert en</span>
            <div className="relative h-10 overflow-hidden">
              <div 
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentWordIndex * 40}px)` }}
              >
                {rotatingWords.map((word, index) => (
                  <div 
                    key={word}
                    className="h-10 flex items-center font-bold gradient-text"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="max-w-xl text-lg text-muted-foreground lg:text-xl">
            Votre plateforme intelligente tout-en-un : rédaction académique, assistance voyage, 
            création de CV, comptabilité, développement web et formations personnalisées.
          </p>

          {/* CTA Buttons with hover effects */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="group shadow-primary text-lg h-14 px-8 gradient-primary hover:scale-105 transition-transform" asChild>
              <Link to="/services">
                Découvrir nos services
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="group h-14 px-8 border-2 hover:bg-primary/5 transition-all" asChild>
              <Link to="/auth">
                <Play className="mr-2 h-5 w-5" />
                Commencer gratuitement
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="group h-14 px-6 hidden lg:flex hover:bg-primary/5" asChild>
              <Link to="/dashboard">
                <Mic className="mr-2 h-5 w-5 text-primary animate-pulse" />
                Essayer la commande vocale
              </Link>
            </Button>
          </div>

          {/* Features Grid with stagger animation */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            {features.map((feature, index) => (
              <div 
                key={feature} 
                className="flex items-center gap-3 p-3 rounded-lg glass-effect animate-slide-up hover:shadow-lg transition-shadow group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Animated Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-border/50">
            <div className="group cursor-default">
              <p className="text-3xl font-bold gradient-text">
                <AnimatedCounter end={500} suffix="+" />
              </p>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Clients satisfaits</p>
            </div>
            <div className="group cursor-default">
              <p className="text-3xl font-bold gradient-text">7</p>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Services disponibles</p>
            </div>
            <div className="group cursor-default">
              <p className="text-3xl font-bold gradient-text">24/7</p>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Support IA</p>
            </div>
            <div className="group cursor-default">
              <p className="text-3xl font-bold gradient-text">
                <AnimatedCounter end={98} suffix="%" />
              </p>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Taux de satisfaction</p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4.9/5</span> basé sur 200+ avis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
