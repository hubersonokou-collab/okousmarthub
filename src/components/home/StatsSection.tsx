import { Users, CheckCircle, Award, Clock } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Clients satisfaits",
    description: "Nous ont fait confiance",
  },
  {
    icon: CheckCircle,
    value: 1200,
    suffix: "+",
    label: "Projets réalisés",
    description: "Dans tous les domaines",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Taux de satisfaction",
    description: "Clients recommandent",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Support disponible",
    description: "Assistance permanente",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center text-white animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:shadow-xl">
                  <Icon className="h-10 w-10" />
                </div>
                <div className="text-5xl font-bold mb-2">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                    className="tabular-nums"
                  />
                </div>
                <div className="font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
