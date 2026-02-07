import { User, Phone, Camera, Mail, Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProfileProgressProps {
  profile: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  email: string | null;
  onComplete?: () => void;
}

export function ProfileProgress({ profile, email, onComplete }: ProfileProgressProps) {
  const fields = [
    { 
      key: "email", 
      label: "Email", 
      icon: Mail, 
      completed: !!email,
      value: email || "Non renseigné",
    },
    { 
      key: "full_name", 
      label: "Nom complet", 
      icon: User, 
      completed: !!profile?.full_name,
      value: profile?.full_name || "Non renseigné",
    },
    { 
      key: "phone", 
      label: "Téléphone", 
      icon: Phone, 
      completed: !!profile?.phone,
      value: profile?.phone || "Non renseigné",
    },
    { 
      key: "avatar", 
      label: "Photo de profil", 
      icon: Camera, 
      completed: !!profile?.avatar_url,
      value: profile?.avatar_url ? "Ajoutée" : "Non ajoutée",
    },
  ];

  const completedCount = fields.filter(f => f.completed).length;
  const progress = Math.round((completedCount / fields.length) * 100);

  if (progress === 100) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Progress Circle */}
          <div className="flex items-center gap-4 lg:border-r lg:pr-6 lg:border-border/50">
            <div className="relative">
              <svg className="w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progress * 2.26} 226`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(217, 91%, 50%)" />
                    <stop offset="100%" stopColor="hsl(152, 76%, 40%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{progress}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Complétez votre profil</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount}/{fields.length} étapes complétées
              </p>
            </div>
          </div>

          {/* Fields checklist */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.key}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    field.completed 
                      ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                      : "bg-muted/50"
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${
                    field.completed ? "bg-green-500 text-white" : "bg-muted-foreground/20"
                  }`}>
                    {field.completed ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Icon className="h-3 w-3" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{field.label}</span>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <Button onClick={onComplete} className="gradient-primary shadow-primary shrink-0">
            Compléter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
