import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/hooks/useAICV';
import {
    FileText, Send, Globe, Zap, CheckCircle2, Star, Coins,
    ArrowRight, Sparkles, Download, BarChart3
} from 'lucide-react';
import { COUNTRY_STANDARDS, SUPPORTED_LANGUAGES } from '@/lib/aiCVConstants';

export default function AICVServicePage() {
    const navigate = useNavigate();
    const { creditsBalance, isLoading } = useCredits();

    const features = [
        {
            icon: FileText,
            title: 'CV Personnalisé IA',
            description: 'Création automatique de CV selon les standards professionnels internationaux',
            cost: 2,
        },
        {
            icon: Send,
            title: 'Lettre de Motivation',
            description: 'Lettres adaptées à chaque offre d\'emploi avec analyse IA avancée',
            cost: 2,
        },
        {
            icon: Globe,
            title: 'Traduction Multi-Langues',
            description: 'Traduction professionnelle en Anglais, Allemand, Espagnol',
            cost: 1,
        },
        {
            icon: Zap,
            title: 'Optimisation ATS',
            description: 'Optimisation automatique pour passer les systèmes de tri automatique',
            cost: 1,
        },
    ];

    const countries = Object.entries(COUNTRY_STANDARDS);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="outline" className="mb-4 text-sm">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Powered by AI
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            CV & Lettres IA
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Créez des CV et lettres de motivation professionnels en quelques clics.
                            Optimisés pour les standards internationaux et les systèmes ATS.
                        </p>

                        {/* Credits Display */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <Card className="inline-flex items-center gap-3 px-6 py-3 border-2 border-purple-200">
                                <Coins className="h-6 w-6 text-purple-600" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-600">Vos crédits</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {isLoading ? '...' : creditsBalance}
                                    </p>
                                </div>
                            </Card>
                            <Button
                                size="lg"
                                onClick={() => navigate('/services/cv-ai/credits')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                Acheter des crédits
                            </Button>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate('/services/cv-ai/create-cv')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                <FileText className="h-5 w-5 mr-2" />
                                Créer un CV
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/services/cv-ai/create-letter')}
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Créer une Lettre (Nouveau 🚀)
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/services/cv-ai/documents')}
                            >
                                <Download className="h-5 w-5 mr-2" />
                                Mes Documents
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Fonctionnalités IA Puissantes
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                <Icon className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <Badge variant="secondary">{feature.cost} crédits</Badge>
                                        </div>
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Country Standards */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        Standards Internationaux
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Créez des CV conformes aux standards professionnels de chaque pays
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {countries.map(([code, info]) => (
                            <Card key={code} className="text-center hover:border-purple-300 transition-colors">
                                <CardHeader>
                                    <div className="text-5xl mb-3">{info.flag}</div>
                                    <CardTitle className="text-xl">{info.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><strong>Longueur:</strong> {info.cvLength}</p>
                                        <p><strong>Photo:</strong> {info.photoRequired ? 'Requise' : 'Non requise'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Translation Support */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Traduction Professionnelle
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                                <Card key={code} className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="text-4xl mb-2">{lang.flag}</div>
                                        <p className="font-semibold">{lang.nativeName}</p>
                                        <p className="text-sm text-gray-600">{lang.name}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Comment ça marche ?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Remplissez vos infos</h3>
                            <p className="text-purple-100">
                                Entrez vos informations personnelles et professionnelles
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">L'IA génère</h3>
                            <p className="text-purple-100">
                                Notre IA crée un document optimisé selon vos critères
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Téléchargez</h3>
                            <p className="text-purple-100">
                                Téléchargez en PDF ou DOCX et postulez immédiatement
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Prêt à créer votre CV professionnel ?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Rejoignez des milliers de chercheurs d'emploi qui ont trouvé leur poste grâce à nos CV optimisés IA
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate('/services/cv-ai/create-cv')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Commencer Maintenant
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
