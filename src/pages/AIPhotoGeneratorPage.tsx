import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/hooks/useAICV';
import { useAIPhotos } from '@/hooks/useAIPhotos';
import { useToast } from '@/hooks/use-toast';
import { PHOTO_STYLES, type PhotoStyle, BACKGROUND_COLORS } from '@/types/aiPhoto';
import {
    Upload, Camera, Sparkles, CheckCircle, Loader2,
    ArrowLeft, Image as ImageIcon, Star, Wand2, Download
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function AIPhotoGeneratorPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { creditsBalance, hasEnoughCredits } = useCredits();
    const { photos, favoritePhotos } = useAIPhotos();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>('corporate');
    const [selectedBackground, setSelectedBackground] = useState<string>('#FFFFFF');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const handleGenerate = async () => {
        if (!selectedFile) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner une photo',
                variant: 'destructive',
            });
            return;
        }

        if (!hasEnoughCredits(3)) {
            toast({
                title: 'Crédits insuffisants',
                description: 'Il vous faut 3 crédits pour générer une photo professionnelle',
                variant: 'destructive',
            });
            navigate('/services/cv-ai/credits');
            return;
        }

        setIsGenerating(true);

        try {
            // TODO: Implement actual API call to Edge Function
            // Simulating for now
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock success
            setGeneratedPhoto(previewUrl); // In reality, this would be the AI-generated photo

            toast({
                title: 'Succès !',
                description: 'Photo professionnelle générée avec succès',
            });
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message || 'Impossible de générer la photo',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
            <Header />

            <main className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/services/cv-ai')}
                                className="mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>

                            <div className="text-center">
                                <Badge variant="outline" className="mb-4">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Photo Professionnelle IA
                                </Badge>
                                <h1 className="text-4xl font-bold mb-4">
                                    Créez votre Photo de CV Parfaite
                                </h1>
                                <p className="text-gray-600 text-lg mb-6">
                                    Notre IA transforme votre photo en portrait professionnel tout en préservant vos traits
                                </p>

                                {/* Credits Display */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Badge variant="secondary" className="text-lg px-4 py-2">
                                        {creditsBalance} crédits disponibles
                                    </Badge>
                                    <Badge variant="outline" className="text-lg px-4 py-2">
                                        3 crédits requis
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Left Column - Upload & Configuration */}
                            <div className="space-y-6">
                                {/* Upload Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-5 w-5" />
                                            1. Téléchargez votre photo
                                        </CardTitle>
                                        <CardDescription>
                                            Utilisez une photo claire de votre visage
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-blue-400'
                                                }`}
                                        >
                                            <input {...getInputProps()} />
                                            {previewUrl ? (
                                                <div className="space-y-4">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="max-h-64 mx-auto rounded-lg object-cover"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFile(null);
                                                            setPreviewUrl(null);
                                                        }}
                                                    >
                                                        Changer de photo
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Camera className="h-16 w-16 mx-auto text-gray-400" />
                                                    <div>
                                                        <p className="text-lg font-medium">
                                                            {isDragActive
                                                                ? 'Déposez la photo ici'
                                                                : 'Glissez-déposez ou cliquez'}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            JPG, PNG ou WebP (max 10MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Style Selection */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Wand2 className="h-5 w-5" />
                                            2. Choisissez votre style
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {Object.values(PHOTO_STYLES).map((style) => (
                                            <div
                                                key={style.id}
                                                onClick={() => setSelectedStyle(style.id)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedStyle === style.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-3xl">{style.icon}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold">{style.name}</h3>
                                                            {selectedStyle === style.id && (
                                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {style.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {style.useCases.slice(0, 3).map((useCase) => (
                                                                <Badge key={useCase} variant="secondary" className="text-xs">
                                                                    {useCase}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Background Color */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="h-5 w-5" />
                                            3. Couleur de fond (optionnel)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-4 gap-3">
                                            {Object.entries(BACKGROUND_COLORS).map(([name, color]) => (
                                                <button
                                                    key={name}
                                                    onClick={() => setSelectedBackground(color)}
                                                    className={`h-12 rounded-lg border-2 transition-all ${selectedBackground === color
                                                            ? 'border-blue-500 scale-110'
                                                            : 'border-gray-300 hover:border-blue-300'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                    title={name.replace('_', ' ')}
                                                >
                                                    {selectedBackground === color && (
                                                        <CheckCircle className="h-5 w-5 mx-auto text-white drop-shadow-lg" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Generate Button */}
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!selectedFile || isGenerating || !hasEnoughCredits(3)}
                                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Génération en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 mr-2" />
                                            Générer ma photo professionnelle (3 crédits)
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Right Column - Preview & Result */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Aperçu & Résultat</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {generatedPhoto ? (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <img
                                                        src={generatedPhoto}
                                                        alt="Generated professional photo"
                                                        className="w-full rounded-lg"
                                                    />
                                                    <Badge className="absolute top-2 right-2 bg-green-600">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Généré
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button className="flex-1">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Télécharger
                                                    </Button>
                                                    <Button variant="outline" className="flex-1">
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Ajouter aux favoris
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => navigate('/services/cv-ai/create-cv')}
                                                >
                                                    Utiliser dans mon CV
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                                <div className="text-center text-gray-500">
                                                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                    <p>Votre photo professionnelle apparaîtra ici</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                {photos.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Vos statistiques</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Photos générées</span>
                                                <span className="font-semibold">{photos.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Favoris</span>
                                                <span className="font-semibold">{favoritePhotos.length}</span>
                                            </div>
                                            <Button
                                                variant="link"
                                                className="w-full mt-2"
                                                onClick={() => navigate('/services/cv-ai/photo-gallery')}
                                            >
                                                Voir toutes mes photos →
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
