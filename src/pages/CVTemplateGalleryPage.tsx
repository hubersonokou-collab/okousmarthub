import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplatePreviewCSS } from '@/components/TemplatePreviewCSS';
import { useCredits } from '@/hooks/useAICV';
import { useToast } from '@/hooks/use-toast';
import { CV_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCountry, getPopularTemplates } from '@/lib/cvTemplates';
import type { CountryCode } from '@/types/aiCVService';
import {
    ArrowLeft, Sparkles, CheckCircle, Crown, Star,
    FileText, Zap, TrendingUp, Globe
} from 'lucide-react';

const COUNTRIES = [
    { code: 'canada' as CountryCode, name: 'Canada', flag: '🇨🇦' },
    { code: 'france' as CountryCode, name: 'France', flag: '🇫🇷' },
    { code: 'australia' as CountryCode, name: 'Australie', flag: '🇦🇺' },
    { code: 'usa' as CountryCode, name: 'États-Unis', flag: '🇺🇸' },
];

export default function CVTemplateGalleryPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { creditsBalance, hasEnoughCredits } = useCredits();
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>('canada');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const popularTemplates = getPopularTemplates(3);
    const countryTemplates = getTemplatesByCountry(selectedCountry);

    const handleSelectTemplate = (templateId: string) => {
        const template = CV_TEMPLATES.find(t => t.id === templateId);

        if (!template) return;

        // Check if user has enough credits (2 for CV generation)
        if (!hasEnoughCredits(2)) {
            toast({
                title: 'Crédits insuffisants',
                description: 'Il vous faut 2 crédits pour créer un CV. Achetez des crédits pour continuer.',
                variant: 'destructive',
            });
            navigate('/services/cv-ai/credits');
            return;
        }

        // Navigate to CV builder with selected template
        navigate(`/services/cv-ai/builder/${templateId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
            <Header />

            <main className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/services/cv-ai')}
                                className="mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour au service
                            </Button>

                            <div className="text-center mb-6">
                                <Badge variant="outline" className="mb-3">
                                    <FileText className="h-3 w-3 mr-1" />
                                    Modèles de CV Professionnels
                                </Badge>
                                <h1 className="text-4xl font-bold mb-3">
                                    Choisissez Votre Modèle de CV
                                </h1>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Des templates optimisés pour chaque pays, conçus par des experts RH
                                </p>
                            </div>

                            {/* Credits Display */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <Badge className="text-lg px-4 py-2">
                                    💰 {creditsBalance} crédits disponibles
                                </Badge>
                                <Badge variant="outline" className="text-lg px-4 py-2">
                                    2 crédits requis par CV
                                </Badge>
                            </div>
                        </div>

                        {/* Popular Templates Section */}
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                                <h2 className="text-2xl font-bold">Templates les Plus Populaires</h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {popularTemplates.map((template) => (
                                    <Card
                                        key={template.id}
                                        className="hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-blue-400 relative overflow-hidden group"
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        {template.is_premium && (
                                            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 z-10">
                                                <Crown className="h-3 w-3 mr-1" />
                                                Premium
                                            </Badge>
                                        )}

                                        <div className="h-64 bg-white relative overflow-hidden border-b-2">
                                            <TemplatePreviewCSS template={template} />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <Badge className="mb-2">{COUNTRIES.find(c => c.code === template.country)?.flag} {template.type}</Badge>
                                            </div>
                                        </div>

                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                {template.name}
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            </CardTitle>
                                            <CardDescription>{template.description}</CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {template.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectTemplate(template.id);
                                                }}
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                                            >
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Utiliser ce modèle
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Templates by Country */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Globe className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold">Parcourir par Pays</h2>
                            </div>

                            <Tabs value={selectedCountry} onValueChange={(value) => setSelectedCountry(value as CountryCode)}>
                                <TabsList className="grid w-full grid-cols-4 mb-8">
                                    {COUNTRIES.map((country) => (
                                        <TabsTrigger key={country.code} value={country.code} className="text-lg">
                                            <span className="mr-2">{country.flag}</span>
                                            {country.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {COUNTRIES.map((country) => (
                                    <TabsContent key={country.code} value={country.code}>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {countryTemplates.map((template) => (
                                                <Card
                                                    key={template.id}
                                                    className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-400 relative overflow-hidden"
                                                    onClick={() => setSelectedTemplate(template.id)}
                                                >
                                                    {template.is_premium && (
                                                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 z-10">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            Premium
                                                        </Badge>
                                                    )}

                                                    <div className="h-48 bg-white relative overflow-hidden border-b-2">
                                                        <TemplatePreviewCSS template={template} />
                                                        <div className="absolute top-4 left-4">
                                                            <Badge>{template.type}</Badge>
                                                        </div>
                                                    </div>

                                                    <CardHeader className="pb-3">
                                                        <CardTitle className="text-lg">{template.name}</CardTitle>
                                                        <CardDescription className="text-sm line-clamp-2">
                                                            {template.description}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                <Zap className="h-4 w-4 text-green-600" />
                                                                <span>ATS Optimisé</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                                <span>{template.sections.length} sections</span>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectTemplate(template.id);
                                                            }}
                                                            variant="outline"
                                                            className="w-full"
                                                        >
                                                            Choisir
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        {countryTemplates.length === 0 && (
                                            <div className="text-center py-12">
                                                <p className="text-gray-500">Aucun template disponible pour ce pays</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>

                        {/* Features Info */}
                        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                            <CardHeader>
                                <CardTitle>✨ Tous nos templates incluent</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="font-semibold">Optimisation ATS</p>
                                            <p className="text-sm text-gray-600">Compatible avec les systèmes de recrutement</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="font-semibold">Export PDF & DOCX</p>
                                            <p className="text-sm text-gray-600">Téléchargez dans le format de votre choix</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="font-semibold">Personnalisation IA</p>
                                            <p className="text-sm text-gray-600">Suggestions intelligentes de contenu</p>
                                        </div>
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
