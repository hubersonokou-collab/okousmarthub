import { MousePointer, FileEdit, Calculator, Package, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: MousePointer,
    step: "01",
    title: "Choisissez votre service",
    description: "Parcourez notre catalogue et sélectionnez le service adapté à vos besoins.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: FileEdit,
    step: "02",
    title: "Décrivez votre projet",
    description: "Remplissez le formulaire avec les détails de votre demande.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Calculator,
    step: "03",
    title: "Recevez un devis",
    description: "Obtenez un devis personnalisé et validez votre commande en ligne.",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Package,
    step: "04",
    title: "Obtenez votre livrable",
    description: "Recevez votre travail dans les délais convenus avec un suivi complet.",
    color: "from-green-500 to-emerald-600",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple & Rapide
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Comment ça <span className="gradient-text">marche</span> ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En seulement 4 étapes simples, transformez votre projet en réalité avec notre accompagnement expert.
          </p>
        </div>

        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Step card */}
                  <div className="relative bg-background rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group-hover:border-primary/50">
                    {/* Step number badge */}
                    <div className={`absolute -top-4 left-6 px-3 py-1 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold shadow-lg`}>
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className={`mt-4 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon className="h-8 w-8" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:flex absolute -right-4 top-24 z-10 h-8 w-8 items-center justify-center rounded-full bg-background border shadow-sm">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
