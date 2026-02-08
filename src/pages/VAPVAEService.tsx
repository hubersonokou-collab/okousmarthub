import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSearch, FolderOpen, PenTool, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { VAPVAEPricingCard } from "@/components/vapvae/VAPVAEPricingCard";
import { VAPVAERequestForm } from "@/components/vapvae/VAPVAERequestForm";
import { VAP_VAE_LEVELS } from "@/lib/vapvaeConstants";

const processSteps = [
    {
        number: 1,
        title: "Analyse du profil",
        description: "Étude du parcours professionnel et vérification de l'éligibilité",
        icon: UserSearch,
        color: "text-blue-500",
    },
    {
        number: 2,
        title: "Constitution du dossier",
        description: "Préparation des CV, attestations et justificatifs",
        icon: FolderOpen,
        color: "text-purple-500",
    },
    {
        number: 3,
        title: "Rédaction académique",
        description: "Structuration conforme aux normes universitaires",
        icon: PenTool,
        color: "text-pink-500",
    },
    {
        number: 4,
        title: "Dépôt et validation",
        description: "Dépôt officiel et suivi administratif complet",
        icon: Award,
        color: "text-amber-500",
    },
];

const features = {
    DUT: [
        "Dossier complet préparé",
        "Validation d'accès DUT",
        "Suivi administratif",
        "Assistance personnalisée",
    ],
    LICENCE: [
        "Constitution complète du dossier",
        "Validation Licence Professionnelle",
        "Accompagnement dédié",
        "Aide à la rédaction académique",
        "Suivi jusqu'à validation finale",
    ],
    MASTER: [
        "Dossier expert niveau Master",
        "Validation Master Professionnel",
        "Accompagnement VIP",
        "Rédaction académique complète",
        "Coaching personnalisé",
        "Suivi prioritaire",
    ],
};

export default function VAPVAEService() {
    const [selectedLevel, setSelectedLevel] = useState<'DUT' | 'LICENCE' | 'MASTER' | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const scrollToForm = (level?: 'DUT' | 'LICENCE' | 'MASTER') => {
        if (level) setSelectedLevel(level);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                            Validation des Acquis
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Inscription VAP / VAE
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Validation des Acquis Professionnels & Validation des Acquis de l'Expérience
                        </p>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Obtenez une reconnaissance académique de votre expérience professionnelle
                            et accédez à des formations supérieures sans le diplôme requis.
                        </p>
                    </div>
                </div>
            </section>

            {/* Explication VAP/VAE */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Comprendre le système VAP / VAE</h2>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {/* VAP */}
                            <Card className="border-2 border-blue-200">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                            VAP
                                        </div>
                                        Qu'est-ce que la VAP ?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <p className="text-muted-foreground">
                                        La <strong>Validation des Acquis Professionnels</strong> permet d'accéder à un niveau
                                        de formation supérieur (DUT, Licence, Master) sans posséder le diplôme requis.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                                            <span>Parcours professionnel reconnu</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                                            <span>Compétences acquises sur le terrain</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                                            <span>Formations non diplômantes valorisées</span>
                                        </div>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-700">Validation d'accès</Badge>
                                </CardContent>
                            </Card>

                            {/* VAE */}
                            <Card className="border-2 border-purple-200">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                            VAE
                                        </div>
                                        Qu'est-ce que la VAE ?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <p className="text-muted-foreground">
                                        La <strong>Validation des Acquis de l'Expérience</strong> permet d'obtenir tout ou
                                        partie d'un diplôme grâce à l'expérience professionnelle.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5" />
                                            <span>Expérience salariée reconnue</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5" />
                                            <span>Activité indépendante valorisée</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5" />
                                            <span>Bénévolat pris en compte</span>
                                        </div>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700">Validation de diplôme</Badge>
                                </CardContent>
                            </Card>
                        </div>

                        {/* À qui s'adresse */}
                        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                            <CardHeader>
                                <CardTitle>À qui s'adresse la VAP / VAE ?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                                        <span>Professionnels en activité</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                                        <span>Entrepreneurs et indépendants</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                                        <span>Agents administratifs</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                                        <span>Personnes sans diplôme</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                                        <span>Salariés en évolution</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Processus VAP/VAE */}
            <section className="py-16 bg-gradient-to-b from-blue-50/50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-4">Processus VAP / VAE</h2>
                        <p className="text-center text-muted-foreground mb-12">4 étapes pour votre validation</p>

                        <div className="grid md:grid-cols-4 gap-8">
                            {processSteps.map((step, index) => (
                                <div key={step.number} className="relative">
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardHeader className="text-center">
                                            <div className={`mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ${step.color}`}>
                                                <step.icon className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                {step.number}
                                            </div>
                                            <CardTitle className="text-lg">{step.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground text-center">
                                                {step.description}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {index < processSteps.length - 1 && (
                                        <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-500 h-8 w-8 z-10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tarifs */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-4">Nos tarifs</h2>
                        <p className="text-center text-muted-foreground mb-12">Choisissez le niveau qui correspond à vos besoins</p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <VAPVAEPricingCard
                                level="DUT"
                                title={VAP_VAE_LEVELS.DUT.label}
                                description={VAP_VAE_LEVELS.DUT.description}
                                price={VAP_VAE_LEVELS.DUT.price}
                                advance={VAP_VAE_LEVELS.DUT.advance}
                                features={features.DUT}
                                onSelect={() => scrollToForm('DUT')}
                            />

                            <VAPVAEPricingCard
                                level="LICENCE"
                                title={VAP_VAE_LEVELS.LICENCE.label}
                                description={VAP_VAE_LEVELS.LICENCE.description}
                                price={VAP_VAE_LEVELS.LICENCE.price}
                                advance={VAP_VAE_LEVELS.LICENCE.advance}
                                features={features.LICENCE}
                                popular
                                onSelect={() => scrollToForm('LICENCE')}
                            />

                            <VAPVAEPricingCard
                                level="MASTER"
                                title={VAP_VAE_LEVELS.MASTER.label}
                                description={VAP_VAE_LEVELS.MASTER.description}
                                price={VAP_VAE_LEVELS.MASTER.price}
                                advance={VAP_VAE_LEVELS.MASTER.advance}
                                features={features.MASTER}
                                onSelect={() => scrollToForm('MASTER')}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Formulaire d'inscription */}
            <section ref={formRef} className="py-16 bg-gradient-to-b from-white to-blue-50/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Inscription en ligne</h2>
                        <p className="text-muted-foreground">
                            Remplissez le formulaire ci-dessous pour soumettre votre demande d'inscription VAP/VAE
                        </p>
                    </div>

                    <VAPVAERequestForm preselectedLevel={selectedLevel || undefined} />
                </div>
            </section>

            {/* CTA Tracker */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Vous avez déjà un dossier ?</h2>
                    <p className="text-lg mb-8 opacity-90">Suivez l'évolution de votre demande VAP/VAE en temps réel</p>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => window.location.href = '/services/vap-vae/suivi'}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                        Suivre mon dossier
                    </Button>
                </div>
            </section>
        </div>
    );
}
