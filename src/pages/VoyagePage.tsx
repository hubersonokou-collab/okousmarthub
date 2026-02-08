import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Users, FileText, CreditCard, MessageSquare, CheckCircle2, ArrowRight, Globe2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function VoyagePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            🧳 Service Premium
                        </Badge>
                        <h1 className="text-5xl font-bold mb-6">
                            VOYAGE
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Votre partenaire de confiance pour toutes vos démarches de mobilité internationale
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5 text-green-300" />
                                <span>Accompagnement complet</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5 text-green-300" />
                                <span>Paiement sécurisé</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5 text-green-300" />
                                <span>Suivi en temps réel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Présentation des 2 sous-services */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Nos Services de Mobilité</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choisissez le service adapté à votre projet de voyage
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Sous-service 1: Assistance Voyage */}
                        <Card className="hover:shadow-2xl transition-shadow duration-300 border-2 hover:border-blue-500">
                            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
                                <div className="flex items-start justify-between">
                                    <div className="bg-blue-600 text-white p-3 rounded-lg">
                                        <Plane className="h-8 w-8" />
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        Populaire
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4 text-2xl">Assistance Voyage</CardTitle>
                                <CardDescription className="text-base">
                                    Accompagnement professionnel pour vos projets de voyage
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        Types de projets disponibles
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Études (50k FCFA)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Travail (75k FCFA)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Tourisme (35k FCFA)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Famille (60k FCFA)</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        Services inclus
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Analyse complète de votre dossier</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Validation des documents requis</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Suivi personnalisé via dashboard</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Messagerie directe avec nos experts</span>
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    onClick={() => navigate('/services/assistance-voyage')}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    Démarrer mon dossier
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Sous-service 2: Decreto Flussi */}
                        <Card className="hover:shadow-2xl transition-shadow duration-300 border-2 border-amber-200 hover:border-amber-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-6 py-1 text-sm font-semibold transform rotate-12 translate-x-6 -translate-y-2">
                                ⭐ PREMIUM
                            </div>
                            <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50">
                                <div className="flex items-start justify-between">
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-3 rounded-lg">
                                        <Globe2 className="h-8 w-8" />
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                                        Opportunité Officielle
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4 text-2xl">Decreto Flussi</CardTitle>
                                <CardDescription className="text-base">
                                    Programme officiel de migration légale vers l'Italie
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Briefcase className="h-5 w-5 text-amber-600" />
                                        <span className="font-semibold text-amber-900">Programme gouvernemental italien</span>
                                    </div>
                                    <p className="text-sm text-amber-800">
                                        Accès légal et sécurisé au marché du travail italien via les quotas officiels
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-amber-600" />
                                        Processus complet
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span>Soumission et validation du dossier</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span>Obtention du contrat de travail</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <span>Demande de visa accompagnée</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            <span>Visa accordé + départ pour l'Italie</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900">Investissement total</span>
                                        <span className="text-2xl font-bold text-amber-600">1 500 000 FCFA</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Paiement échelonné en 3 tranches via Paystack</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => navigate('/services/assistance-voyage')}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                                    size="lg"
                                >
                                    Souscrire au programme
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pourquoi choisir notre service */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous choisir ?</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Support dédié</h3>
                            <p className="text-sm text-gray-600">
                                Messagerie intégrée avec nos experts pour un accompagnement personnalisé
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Suivi en temps réel</h3>
                            <p className="text-sm text-gray-600">
                                Dashboard personnel avec notifications à chaque étape de votre dossier
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
                            <p className="text-sm text-gray-600">
                                Transactions protégées via Paystack avec Mobile Money et cartes bancaires
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Rejoignez des centaines de clients satisfaits qui nous ont fait confiance pour leurs démarches de voyage
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            onClick={() => navigate('/services/assistance-voyage')}
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50"
                        >
                            Commencer maintenant
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            onClick={() => navigate('/dashboard/client')}
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            Voir mon dashboard
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
