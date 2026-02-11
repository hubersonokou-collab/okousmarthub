import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft, Sparkles, CheckCircle, Clock, Bell,
    FileText, Send, FolderOpen, Camera
} from 'lucide-react';

interface FeatureInfo {
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    estimatedRelease: string;
}

const FEATURE_MAP: Record<string, FeatureInfo> = {
    'create-cv': {
        title: 'Créateur de CV IA',
        description: 'Générez des CV professionnels optimisés avec l\'intelligence artificielle',
        icon: <FileText className="h-12 w-12 text-blue-600" />,
        features: [
            'Templates adaptés à chaque pays (Canada, France, Australie, USA)',
            'Optimisation automatique pour ATS',
            'Suggestions intelligentes basées sur votre profil',
            'Analyse d\'offres d\'emploi et adaptation automatique',
            'Export PDF et DOCX professionnel',
        ],
        estimatedRelease: 'Phase 2 - Février 2026',
    },
    'create-letter': {
        title: 'Générateur de Lettres de Motivation IA',
        description: 'Créez des lettres de motivation personnalisées et percutantes',
        icon: <Send className="h-12 w-12 text-purple-600" />,
        features: [
            'Adaptation au poste et à l\'entreprise',
            'Ton personnalisable (formel, moderne, créatif)',
            'Structure optimale selon le pays',
            'Traduction professionnelle multilingue',
            'Analyse de concordance avec l\'offre',
        ],
        estimatedRelease: 'Phase 2 - Février 2026',
    },
    'documents': {
        title: 'Mes Documents Générés',
        description: 'Gérez tous vos CV et lettres générés en un seul endroit',
        icon: <FolderOpen className="h-12 w-12 text-green-600" />,
        features: [
            'Historique complet de vos documents',
            'Système de favoris',
            'Recherche et filtrage avancés',
            'Téléchargement multiple',
            'Versions et comparaisons',
        ],
        estimatedRelease: 'Phase 2 - Février 2026',
    },
};

export default function ComingSoonPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract feature ID from path
    const featureId = location.pathname.split('/').pop() || 'create-cv';
    const feature = FEATURE_MAP[featureId] || FEATURE_MAP['create-cv'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
            <Header />

            <main className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/services/cv-ai')}
                            className="mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour au service
                        </Button>

                        {/* Coming Soon Card */}
                        <Card className="text-center border-2 border-blue-200 shadow-xl">
                            <CardHeader className="pb-4">
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        {feature.icon}
                                        <div className="absolute -top-2 -right-2">
                                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse">
                                                Bientôt
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <CardTitle className="text-3xl font-bold mb-2">
                                    {feature.title}
                                </CardTitle>

                                <CardDescription className="text-lg">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Status */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center justify-center gap-2 text-blue-700">
                                        <Clock className="h-5 w-5" />
                                        <span className="font-semibold">
                                            Cette fonctionnalité est actuellement en développement
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-600 mt-2">
                                        Sortie prévue : <strong>{feature.estimatedRelease}</strong>
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold mb-4 text-center">
                                        Ce qui sera disponible :
                                    </h3>
                                    <div className="grid gap-3">
                                        {feature.features.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Bell className="h-5 w-5 text-purple-600" />
                                        <h4 className="font-semibold text-gray-800">
                                            Restez informé(e)
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        En attendant, profitez de nos fonctionnalités disponibles dès maintenant !
                                    </p>
                                </div>

                                {/* Available Actions */}
                                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                    <Button
                                        onClick={() => navigate('/services/cv-ai/photo-generator')}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        Photo Pro IA (Disponible)
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/services/cv-ai/credits')}
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Acheter des crédits
                                    </Button>
                                </div>

                                {/* Timeline Info */}
                                <div className="pt-6 border-t">
                                    <p className="text-sm text-gray-500">
                                        💡 <strong>Astuce :</strong> En achetant vos crédits maintenant, vous serez prêt(e) dès le lancement !
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* What's Already Available */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-green-600" />
                                    Disponible dès maintenant
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => navigate('/services/cv-ai/photo-generator')}
                                        className="p-4 border rounded-lg hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Camera className="h-6 w-6 text-purple-600" />
                                            <h4 className="font-semibold">Photo Professionnelle IA</h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Générez une photo de CV professionnelle avec l'IA
                                        </p>
                                        <Badge className="mt-2 bg-green-600">Actif</Badge>
                                    </div>

                                    <div
                                        onClick={() => navigate('/services/cv-ai/photo-gallery')}
                                        className="p-4 border rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <FolderOpen className="h-6 w-6 text-blue-600" />
                                            <h4 className="font-semibold">Galerie de Photos</h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Consultez et gérez vos photos générées
                                        </p>
                                        <Badge className="mt-2 bg-green-600">Actif</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
