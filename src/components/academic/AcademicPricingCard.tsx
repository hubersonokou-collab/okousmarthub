import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { formatPrice, DOCUMENT_TYPES } from "@/lib/academicConstants";

interface AcademicPricingCardProps {
    type: keyof typeof DOCUMENT_TYPES;
    isPopular?: boolean;
}

export const AcademicPricingCard = ({ type, isPopular = false }: AcademicPricingCardProps) => {
    const docType = DOCUMENT_TYPES[type];

    const features = [
        `Rédaction complète du ${docType.label.toLowerCase()}`,
        `${docType.copies > 0 ? `${docType.copies} exemplaires imprimés` : 'Document numérique'}`,
        docType.mentoring && 'Mentorat entreprise (recherche de stage, suivi, attestation)',
        'Suivi personnalisé via WhatsApp',
        'Révisions illimitées',
        'Garantie de conformité académique',
    ].filter(Boolean) as string[];

    const gradients = {
        RAPPORT_BT: 'from-blue-600 to-cyan-600',
        RAPPORT_BTS_AVEC_STAGE: 'from-purple-600 to-pink-600',
        RAPPORT_BTS_SANS_STAGE: 'from-orange-600 to-red-600',
        MEMOIRE_LICENCE: 'from-green-600 to-emerald-600',
    };

    const gradient = gradients[type];

    return (
        <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isPopular ? 'border-2 border-blue-500' : ''}`}>
            {isPopular && (
                <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-blue-600">
                        Populaire
                    </Badge>
                </div>
            )}

            {/* Gradient header */}
            <div className={`h-2 bg-gradient-to-r ${gradient}`} />

            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl mb-2">{docType.label}</CardTitle>
                        <CardDescription className="text-sm">
                            Niveau: <span className="font-semibold">{docType.level}</span>
                        </CardDescription>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold gradient-text">
                            {formatPrice(docType.price)}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Avance: <span className="font-semibold text-foreground">{formatPrice(docType.advance)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Solde: <span className="font-semibold text-foreground">{formatPrice(docType.price - docType.advance)}</span>
                    </p>
                </div>
            </CardHeader>

            <CardContent>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <div className={`mt-0.5 rounded-full p-1 bg-gradient-to-r ${gradient}`}>
                                <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <div className="w-full text-center text-xs text-muted-foreground">
                    Paiement sécurisé via Paystack
                </div>
            </CardFooter>

            {/* Bottom accent line */}
            <div className={`h-1 bg-gradient-to-r ${gradient}`} />
        </Card>
    );
};
