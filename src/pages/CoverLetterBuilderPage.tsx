import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useAICV';
import { generateCoverLetterStream } from '@/lib/aiAssistant';
import { Loader2, ArrowLeft, Send, Download, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function CoverLetterBuilderPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { creditsBalance, hasEnoughCredits } = useCredits();

    // Form State
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');

    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        fullName: '',
        email: '',
        phone: '',
        currentPosition: '',

        // Step 2: Target
        companyName: '',
        jobTitle: '',
        jobDescription: '',

        // Step 3: Tone
        tone: 'professional' as 'professional' | 'creative' | 'enthusiastic',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!hasEnoughCredits(2)) {
            toast({
                title: "Crédits insuffisants",
                description: "Il vous faut 2 crédits pour générer une lettre.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        setGeneratedLetter(''); // Reset for streaming
        try {
            const userInfo = `Nom: ${formData.fullName}, Email: ${formData.email}, Tel: ${formData.phone}, Poste actuel: ${formData.currentPosition}`;

            await generateCoverLetterStream({
                userInfo,
                jobTitle: formData.jobTitle,
                companyName: formData.companyName,
                jobDescription: formData.jobDescription,
                tone: formData.tone,
            }, (chunk) => {
                setGeneratedLetter(prev => prev + chunk);
            });

            setStep(4); // Move to preview
            toast({
                title: "Lettre générée !",
                description: "Vous pouvez maintenant la modifier ou la télécharger.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Erreur",
                description: error.message || "Impossible de générer la lettre.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Simple PDF generation (can be enhanced)
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(generatedLetter, 180);
        doc.text(splitText, 15, 20);

        doc.save(`lettre_motivation_${formData.companyName.replace(/\s+/g, '_')}.pdf`);

        toast({
            title: "Téléchargement lancé",
            description: "Votre lettre est prête.",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate('/services/cv-ai')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>

                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">Générateur de Lettres IA</h1>
                        <p className="text-gray-600">
                            Créez une lettre de motivation parfaite en 2 minutes. Coût : 2 crédits.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8 px-12">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 
                                    ${step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                                </div>
                                <span className="text-xs text-gray-500">
                                    {s === 1 ? 'Moi' : s === 2 ? 'Cible' : s === 3 ? 'Style' : 'Résultat'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {step === 1 && "Vos Informations"}
                                {step === 2 && "Le Poste Visé"}
                                {step === 3 && "Style & Ton"}
                                {step === 4 && "Votre Lettre"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* STEP 1: Personal Info */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Nom Complet</Label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                placeholder="Jean Dupont"
                                            />
                                        </div>
                                        <div>
                                            <Label>Poste Actuel / Statut</Label>
                                            <Input
                                                value={formData.currentPosition}
                                                onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                                                placeholder="Ex: Étudiant, Comptable..."
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="jean@example.com"
                                            />
                                        </div>
                                        <div>
                                            <Label>Téléphone</Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+33 6..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <Button onClick={() => setStep(2)}>Suivant</Button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Target Info */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Nom de l'Entreprise</Label>
                                        <Input
                                            value={formData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            placeholder="Ex: Google, Société Générale..."
                                        />
                                    </div>
                                    <div>
                                        <Label>Intitulé du Poste</Label>
                                        <Input
                                            value={formData.jobTitle}
                                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                            placeholder="Ex: Chef de Projet Marketing"
                                        />
                                    </div>
                                    <div>
                                        <Label>Description du Poste / Mots-clés (Optionnel)</Label>
                                        <Textarea
                                            value={formData.jobDescription}
                                            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                                            placeholder="Collez ici les points clés de l'offre d'emploi..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
                                        <Button onClick={() => setStep(3)}>Suivant</Button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Tone & Generate */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label>Quel ton souhaitez-vous adopter ?</Label>
                                        <div className="grid grid-cols-3 gap-4 mt-2">
                                            {[
                                                { id: 'professional', label: 'Professionnel', desc: 'Classique, respectueux, standard' },
                                                { id: 'enthusiastic', label: 'Enthousiaste', desc: 'Dynamique, motivé, énergique' },
                                                { id: 'creative', label: 'Créatif', desc: 'Original, audacieux, marquant' }
                                            ].map((toneOpt) => (
                                                <div
                                                    key={toneOpt.id}
                                                    onClick={() => handleInputChange('tone', toneOpt.id)}
                                                    className={`cursor-pointer border-2 rounded-lg p-4 hover:border-purple-500 transition-colors ${formData.tone === toneOpt.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}
                                                >
                                                    <div className="font-semibold">{toneOpt.label}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{toneOpt.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900">Prêt à générer ?</h4>
                                            <p className="text-sm text-blue-700">
                                                Cette action va consommer <strong>2 crédits</strong>. L'IA va rédiger une lettre complète basée sur vos informations.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <Button variant="outline" onClick={() => setStep(2)}>Retour</Button>
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !formData.companyName || !formData.jobTitle}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 w-full ml-4"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Rédaction en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Générer ma Lettre (2 crédits)
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Result */}
                            {step === 4 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <Label>Votre Lettre de Motivation</Label>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                            Générée par IA
                                        </Badge>
                                    </div>

                                    <Textarea
                                        value={generatedLetter}
                                        onChange={(e) => setGeneratedLetter(e.target.value)}
                                        className="min-h-[400px] font-serif text-lg leading-relaxed p-6"
                                    />

                                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                        <Button variant="outline" onClick={() => setStep(3)} className="sm:w-1/4">
                                            Recommencer
                                        </Button>
                                        <div className="flex-grow" />
                                        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(generatedLetter)}>
                                            Copier le texte
                                        </Button>
                                        <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
                                            <Download className="mr-2 h-4 w-4" />
                                            Télécharger en PDF
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Helper Badge component since it wasn't imported
function Badge({ children, variant, className }: any) {
    return <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>{children}</span>;
}
