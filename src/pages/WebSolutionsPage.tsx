import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Globe, Smartphone, ShoppingCart, Zap, Shield, BarChart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const PACKS = [
    {
        id: "essentiel",
        name: "Pack Essentiel",
        price: "150.000",
        description: "Idéal pour les artisans, startups et indépendants qui veulent une présence en ligne professionnelle.",
        features: [
            "Site One-Page (Vitrine)",
            "Design Responsive (Mobile First)",
            "Formulaire de contact",
            "Liens réseaux sociaux",
            "Hébergement + Nom de domaine (1 an)",
            "Support Email",
            "Délai : 1 semaine"
        ],
        icon: <Globe className="h-10 w-10 text-blue-500" />,
        color: "bg-blue-50 border-blue-200",
        btnColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
        id: "business",
        name: "Pack Business",
        price: "350.000",
        description: "Pour les PME et commerces qui veulent présenter leurs services et attirer plus de clients.",
        features: [
            "Site Multi-pages (jusqu'à 5 pages)",
            "Design Premium & Animations",
            "Optimisation SEO de base",
            "Blog / Actualités",
            "Intégration WhatsApp",
            "Formation prise en main",
            "Support Email + Téléphone",
            "Délai : 2-3 semaines"
        ],
        popular: true,
        icon: <BriefcaseIcon className="h-10 w-10 text-purple-500" />,
        color: "bg-purple-50 border-purple-200",
        btnColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
        id: "premium",
        name: "Pack Premium / E-commerce",
        price: "Sur devis",
        basePrice: "800.000",
        description: "Solutions sur mesure, boutiques en ligne et applications web complexes.",
        features: [
            "Site E-commerce ou Sur Mesure",
            "Paiement en ligne (Mobile Money, Carte)",
            "Dashboard Administrateur",
            "SEO Avancé",
            "Marketing Automation",
            "Support Dédié Prioritaire",
            "Maintenance incluse (3 mois)",
            "Délai : 1-2 mois"
        ],
        icon: <Zap className="h-10 w-10 text-amber-500" />,
        color: "bg-amber-50 border-amber-200",
        btnColor: "bg-amber-600 hover:bg-amber-700"
    }
];

// Helper icon component since Briefcase is not imported directly from lucide-react in the top import
function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    )
}

export default function WebSolutionsPage() {
    const navigate = useNavigate();

    const handleOrder = (packId: string) => {
        navigate(`/services/solutions-web/order?pack=${packId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Solutions Web & Paiement Digital</h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                            Propulsez votre entreprise avec un site web professionnel et encaissez vos clients par Mobile Money et Carte Bancaire.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <Smartphone className="h-5 w-5 text-green-400" />
                                <span>Mobile First</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <Shield className="h-5 w-5 text-blue-400" />
                                <span>Paiement Sécurisé</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <BarChart className="h-5 w-5 text-purple-400" />
                                <span>Dashboard Admin</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-20 container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Choisissez le pack adapté à votre ambition</h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {PACKS.map((pack) => (
                            <Card key={pack.id} className={`flex flex-col border-2 transition-all hover:shadow-xl ${pack.popular ? 'border-purple-500 shadow-lg scale-105 z-10' : 'border-transparent hover:border-gray-200'}`}>
                                {pack.popular && (
                                    <div className="bg-purple-600 text-white text-center py-1 text-sm font-bold uppercase tracking-wide">
                                        Recommandé
                                    </div>
                                )}
                                <CardHeader className={`${pack.color} border-b`}>
                                    <div className="mb-4">{pack.icon}</div>
                                    <CardTitle className="text-2xl">{pack.name}</CardTitle>
                                    <CardDescription className="text-slate-600 mt-2 min-h-[50px]">{pack.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 pt-6">
                                    <div className="mb-6">
                                        <span className="text-3xl font-bold text-slate-900">{pack.price}</span>
                                        {pack.price !== "Sur devis" && <span className="text-slate-500 ml-1">FCFA</span>}
                                        {pack.basePrice && <p className="text-sm text-slate-500">À partir de {pack.basePrice} FCFA</p>}
                                    </div>
                                    <ul className="space-y-3">
                                        {pack.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-slate-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-6 border-t bg-gray-50/50">
                                    <Button
                                        className={`w-full text-lg h-12 ${pack.btnColor}`}
                                        onClick={() => handleOrder(pack.id)}
                                    >
                                        Réserver ce pack
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-16 text-center bg-blue-50 p-8 rounded-2xl max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4 text-blue-900">Besoin d'une solution personnalisée ?</h3>
                        <p className="text-blue-700 mb-6">
                            Nous développons aussi des logiciels de gestion, CRM, et applications mobiles spécifiques à votre métier.
                        </p>
                        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100" onClick={() => navigate('/contact')}>
                            Contactez-nous pour un devis
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
