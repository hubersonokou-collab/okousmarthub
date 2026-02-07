import { Globe, Plane, GraduationCap, FileText, Calculator, Briefcase, Code, Award } from "lucide-react";

const partners = [
  { icon: Globe, name: "International" },
  { icon: Plane, name: "Travel" },
  { icon: GraduationCap, name: "Education" },
  { icon: FileText, name: "Documents" },
  { icon: Calculator, name: "Finance" },
  { icon: Briefcase, name: "Business" },
  { icon: Code, name: "Technology" },
  { icon: Award, name: "Quality" },
];

export function PartnersCarousel() {
  return (
    <section className="py-12 overflow-hidden bg-muted/30 border-y">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Nos domaines d'expertise
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll">
          {/* First set */}
          {[...partners, ...partners].map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={`${partner.name}-${index}`}
                className="flex items-center gap-3 px-8 py-4 mx-4 rounded-xl bg-background/80 border shadow-sm hover:shadow-md transition-all shrink-0"
              >
                <div className="p-2 rounded-lg gradient-primary">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium whitespace-nowrap">{partner.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
