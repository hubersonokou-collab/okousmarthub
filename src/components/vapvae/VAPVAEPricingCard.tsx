import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/vapvaeConstants";

interface VAPVAEPricingCardProps {
    level: string;
    title: string;
    description: string;
    price: number;
    advance: number;
    features: string[];
    popular?: boolean;
    onSelect: () => void;
}

export function VAPVAEPricingCard({
    level,
    title,
    description,
    price,
    advance,
    features,
    popular = false,
    onSelect,
}: VAPVAEPricingCardProps) {
    const balance = price - advance;

    const gradients = {
        DUT: "from-blue-500 to-cyan-500",
        LICENCE: "from-purple-500 to-pink-500",
        MASTER: "from-amber-500 to-orange-500",
    };

    const gradient = gradients[level as keyof typeof gradients] || gradients.DUT;

    return (
        <Card className={`relative overflow-hidden transition-all hover:scale-105 ${popular ? 'border-2 border-primary shadow-xl' : ''}`}>
            {popular && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${gradient} text-white px-4 py-1 text-xs font-bold rounded-bl-lg`}>
                    POPULAIRE
                </div>
            )}

            <CardHeader className="text-center pb-8">
                <div className={`mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {level[0]}
                </div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="space-y-1">
                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            {formatPrice(price)}
                        </p>
                        <p className="text-sm text-muted-foreground">Prix total</p>
                    </div>

                    <div className="flex justify-center gap-4 pt-2">
                        <div className="text-center">
                            <p className="font-semibold text-green-600">{formatPrice(advance)}</p>
                            <p className="text-xs text-muted-foreground">Avance</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-blue-600">{formatPrice(balance)}</p>
                            <p className="text-xs text-muted-foreground">Solde</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    onClick={onSelect}
                    className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white shadow-lg`}
                    size="lg"
                >
                    Choisir {level}
                </Button>
            </CardFooter>
        </Card>
    );
}
