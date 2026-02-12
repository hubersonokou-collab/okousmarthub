import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useAICV';
import { getTemplateById } from '@/lib/cvTemplates';
import { generateCVPDF, downloadCVPDF } from '@/lib/pdfGenerationService';
import { useAuth } from '@/hooks/useAuth';
import {
    ArrowLeft, ArrowRight, Sparkles, FileText, Briefcase,
    GraduationCap, Award, Languages, User, Mail, Phone,
    MapPin, Linkedin, Globe, Save, Download, Loader2, Upload, Camera
} from 'lucide-react';

const STEPS = [
    { id: 1, name: 'Informations Personnelles', icon: User },
    { id: 2, name: 'Résumé Professionnel', icon: FileText },
    { id: 3, name: 'Expérience', icon: Briefcase },
    { id: 4, name: 'Formation', icon: GraduationCap },
    { id: 5, name: 'Compétences', icon: Award },
    { id: 6, name: 'Langues & Finalisation', icon: Languages },
];

export default function CVBuilderPage() {
    const navigate = useNavigate();
    const { templateId } = useParams<{ templateId: string }>();
    const { toast } = useToast();
    const { creditsBalance, hasEnoughCredits } = useCredits();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [cvData, setCvData] = useState({
        // Personal Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        linkedin: '',
        website: '',

        // Professional Summary
        summary: '',

        // Experience (array)
        experiences: [{
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        }],

        // Education
        education: [{
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            description: '',
        }],

        // Skills
        technicalSkills: [] as string[],
        softSkills: [] as string[],

        // Languages
        languages: [{
            language: '',
            level: 'intermediate',
        }],
    });

    const template = templateId ? getTemplateById(templateId) : null;

    if (!template) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Template non trouvé</p>
                    <Button onClick={() => navigate('/services/cv-ai/create-cv')}>
                        Retour aux templates
                    </Button>
                </div>
            </div>
        );
    }

    const progressPercentage = (currentStep / STEPS.length) * 100;

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateCV = async () => {
        // Check credits
        if (!hasEnoughCredits(2)) {
            toast({
                title: 'Crédits insuffisants',
                description: 'Il vous faut 2 crédits pour générer un CV.',
                variant: 'destructive',
            });
            navigate('/services/cv-ai/credits');
            return;
        }

        if (!user) {
            toast({
                title: 'Non connecté',
                description: 'Vous devez être connecté pour générer un CV.',
                variant: 'destructive',
            });
            return;
        }

        setIsGenerating(true);

        try {
            // Transform cvData to match CVFormData interface
            const formattedData = {
                personalInfo: {
                    firstName: cvData.firstName,
                    lastName: cvData.lastName,
                    email: cvData.email,
                    phone: cvData.phone,
                    address: cvData.address,
                    city: cvData.city,
                    country: cvData.country,
                    linkedin: cvData.linkedin,
                    portfolio: cvData.website,
                },
                summary: cvData.summary,
                experience: cvData.experiences.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    location: '',
                    startDate: exp.startDate,
                    endDate: exp.endDate || '',
                    isCurrent: exp.current,
                    description: exp.description,
                    achievements: [],
                })),
                education: cvData.education.map(edu => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    fieldOfStudy: edu.field,
                    startDate: edu.startDate,
                    endDate: edu.endDate,
                    description: edu.description,
                })),
                skills: {
                    technical: cvData.technicalSkills,
                    soft: cvData.softSkills,
                },
                languages: cvData.languages.map(lang => ({
                    name: lang.language,
                    proficiency: lang.level as any,
                })),
            };

            // Generate PDF
            const result = await generateCVPDF({
                cvData: formattedData as any,
                template: template!,
                userId: user.id,
                photoFile: photoFile || undefined,
            });

            if (result.success) {
                toast({
                    title: '✅ CV Généré avec succès !',
                    description: 'Votre CV a été créé et sauvegardé.',
                });
                // Trigger automatic download
                if (result.pdfBlob) {
                    const url = URL.createObjectURL(result.pdfBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `CV_${cvData.lastName}_${Date.now()}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
                // Navigate to documents page
                navigate('/services/cv-ai/documents');
            } else {
                // Fallback: If upload failed, download directly
                console.warn('Upload failed, falling back to direct download');
                toast({
                    title: '⚠️ Upload non disponible',
                    description: 'Téléchargement direct du CV en cours...',
                });

                await downloadCVPDF({
                    cvData: formattedData as any,
                    template: template!,
                    photoFile: photoFile || undefined,
                });

                toast({
                    title: '✅ CV téléchargé',
                    description: 'Votre CV a été téléchargé avec succès.',
                });
            }
        } catch (error) {
            console.error('Error generating CV:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la génération.',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddExperience = () => {
        setCvData({
            ...cvData,
            experiences: [
                ...cvData.experiences,
                {
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                }
            ]
        });
    };

    const handleAddEducation = () => {
        setCvData({
            ...cvData,
            education: [
                ...cvData.education,
                {
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                }
            ]
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
            <Header />

            <main className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/services/cv-ai/create-cv')}
                                className="mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Changer de template
                            </Button>

                            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold mb-1">{template.name}</h1>
                                            <p className="text-blue-100">{template.description}</p>
                                        </div>
                                        <Badge className="bg-white text-blue-600">
                                            💰 {creditsBalance} crédits
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progress */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                    Étape {currentStep} sur {STEPS.length}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {Math.round(progressPercentage)}% complété
                                </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />

                            {/* Step indicators */}
                            <div className="flex justify-between mt-4">
                                {STEPS.map((step) => {
                                    const StepIcon = step.icon;
                                    const isActive = currentStep === step.id;
                                    const isCompleted = currentStep > step.id;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`flex flex-col items-center ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-400'
                                                }`}
                                        >
                                            <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center mb-1 ${isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : isCompleted
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200'
                                                    }`}
                                            >
                                                <StepIcon className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs text-center max-w-[80px] hidden md:block">
                                                {step.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {(() => {
                                        const StepIcon = STEPS[currentStep - 1].icon;
                                        return <StepIcon className="h-5 w-5" />;
                                    })()}
                                    {STEPS[currentStep - 1].name}
                                </CardTitle>
                                <CardDescription>
                                    Remplissez vos informations. L'IA vous aidera à optimiser le contenu.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {/* Step 1: Personal Info */}
                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        {/* Photo Upload  */}
                                        <div className="bg-blue-50 p-6 rounded-lg border-2 border-dashed border-blue-200">
                                            <Label className="text-base font-semibold mb-3 block">Photo Professionnelle</Label>
                                            <div className="flex items-center gap-6">
                                                {photoPreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={photoPreview}
                                                            alt="Photo de profil"
                                                            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                                                            onClick={() => {
                                                                setPhotoFile(null);
                                                                setPhotoPreview(null);
                                                            }}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <Camera className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-700 mb-3">
                                                        Ajoutez une photo professionnelle pour les CV français. Recommandé pour les templates français.
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <label>
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handlePhotoUpload}
                                                                className="hidden"
                                                                id="photo-upload"
                                                            />
                                                            <Button type="button" variant="outline" size="sm" asChild>
                                                                <span className="cursor-pointer">
                                                                    <Upload className="h-4 w-4 mr-2" />
                                                                    Choisir une photo
                                                                </span>
                                                            </Button>
                                                        </label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => navigate('/services/cv-ai/photo-generator')}
                                                        >
                                                            <Sparkles className="h-4 w-4 mr-2" />
                                                            Générer avec l'IA
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName">Prénom *</Label>
                                                <Input
                                                    id="firstName"
                                                    value={cvData.firstName}
                                                    onChange={(e) => setCvData({ ...cvData, firstName: e.target.value })}
                                                    placeholder="Jean"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Nom *</Label>
                                                <Input
                                                    id="lastName"
                                                    value={cvData.lastName}
                                                    onChange={(e) => setCvData({ ...cvData, lastName: e.target.value })}
                                                    placeholder="Dupont"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email">Email *</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="pl-10"
                                                        value={cvData.email}
                                                        onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                                                        placeholder="jean.dupont@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Téléphone *</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="phone"
                                                        className="pl-10"
                                                        value={cvData.phone}
                                                        onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                                                        placeholder="+33 6 12 34 56 78"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="address">Adresse</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="address"
                                                    className="pl-10"
                                                    value={cvData.address}
                                                    onChange={(e) => setCvData({ ...cvData, address: e.target.value })}
                                                    placeholder="123 Rue de la République"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city">Ville *</Label>
                                                <Input
                                                    id="city"
                                                    value={cvData.city}
                                                    onChange={(e) => setCvData({ ...cvData, city: e.target.value })}
                                                    placeholder="Paris"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="country">Pays *</Label>
                                                <Input
                                                    id="country"
                                                    value={cvData.country}
                                                    onChange={(e) => setCvData({ ...cvData, country: e.target.value })}
                                                    placeholder="France"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="linkedin">LinkedIn</Label>
                                                <div className="relative">
                                                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="linkedin"
                                                        className="pl-10"
                                                        value={cvData.linkedin}
                                                        onChange={(e) => setCvData({ ...cvData, linkedin: e.target.value })}
                                                        placeholder="linkedin.com/in/jeandupont"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="website">Site web / Portfolio</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="website"
                                                        className="pl-10"
                                                        value={cvData.website}
                                                        onChange={(e) => setCvData({ ...cvData, website: e.target.value })}
                                                        placeholder="www.monportfolio.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Professional Summary */}
                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                            <p className="text-sm text-blue-800">
                                                💡 <strong>Astuce IA :</strong> Décrivez votre profil professionnel en 3-4 phrases.
                                                L'IA optimisera automatiquement votre texte pour le rendre percutant.
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="summary">Résumé Professionnel *</Label>
                                            <Textarea
                                                id="summary"
                                                rows={8}
                                                value={cvData.summary}
                                                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                                                placeholder="Décrivez votre profil, vos compétences clés et ce que vous recherchez..."
                                                className="resize-none"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                {cvData.summary.length} caractères
                                            </p>
                                        </div>

                                        <Button variant="outline" className="w-full">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Optimiser avec l'IA (Bientôt disponible)
                                        </Button>
                                    </div>
                                )}

                                {/* Step 3: Experience */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        {cvData.experiences.map((exp, index) => (
                                            <Card key={index} className="border-2">
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Expérience #{index + 1}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Entreprise *</Label>
                                                            <Input
                                                                value={exp.company}
                                                                onChange={(e) => {
                                                                    const newExps = [...cvData.experiences];
                                                                    newExps[index].company = e.target.value;
                                                                    setCvData({ ...cvData, experiences: newExps });
                                                                }}
                                                                placeholder="Nom de l'entreprise"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Poste *</Label>
                                                            <Input
                                                                value={exp.position}
                                                                onChange={(e) => {
                                                                    const newExps = [...cvData.experiences];
                                                                    newExps[index].position = e.target.value;
                                                                    setCvData({ ...cvData, experiences: newExps });
                                                                }}
                                                                placeholder="Titre du poste"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Date de début</Label>
                                                            <Input
                                                                type="month"
                                                                value={exp.startDate}
                                                                onChange={(e) => {
                                                                    const newExps = [...cvData.experiences];
                                                                    newExps[index].startDate = e.target.value;
                                                                    setCvData({ ...cvData, experiences: newExps });
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Date de fin</Label>
                                                            <Input
                                                                type="month"
                                                                value={exp.endDate}
                                                                onChange={(e) => {
                                                                    const newExps = [...cvData.experiences];
                                                                    newExps[index].endDate = e.target.value;
                                                                    setCvData({ ...cvData, experiences: newExps });
                                                                }}
                                                                disabled={exp.current}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label>Description des responsabilités</Label>
                                                        <Textarea
                                                            rows={4}
                                                            value={exp.description}
                                                            onChange={(e) => {
                                                                const newExps = [...cvData.experiences];
                                                                newExps[index].description = e.target.value;
                                                                setCvData({ ...cvData, experiences: newExps });
                                                            }}
                                                            placeholder="Décrivez vos missions, réalisations et responsabilités..."
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        <Button onClick={handleAddExperience} variant="outline" className="w-full">
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            Ajouter une expérience
                                        </Button>
                                    </div>
                                )}

                                {/* Step 4: Education */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        {cvData.education.map((edu, index) => (
                                            <Card key={index} className="border-2">
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Formation #{index + 1}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <Label>Établissement *</Label>
                                                        <Input
                                                            value={edu.institution}
                                                            onChange={(e) => {
                                                                const newEdu = [...cvData.education];
                                                                newEdu[index].institution = e.target.value;
                                                                setCvData({ ...cvData, education: newEdu });
                                                            }}
                                                            placeholder="Nom de l'université ou école"
                                                        />
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Diplôme *</Label>
                                                            <Input
                                                                value={edu.degree}
                                                                onChange={(e) => {
                                                                    const newEdu = [...cvData.education];
                                                                    newEdu[index].degree = e.target.value;
                                                                    setCvData({ ...cvData, education: newEdu });
                                                                }}
                                                                placeholder="Ex: Master, Licence, DUT..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Domaine d'études</Label>
                                                            <Input
                                                                value={edu.field}
                                                                onChange={(e) => {
                                                                    const newEdu = [...cvData.education];
                                                                    newEdu[index].field = e.target.value;
                                                                    setCvData({ ...cvData, education: newEdu });
                                                                }}
                                                                placeholder="Ex: Informatique, Marketing..."
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Année de début</Label>
                                                            <Input
                                                                type="month"
                                                                value={edu.startDate}
                                                                onChange={(e) => {
                                                                    const newEdu = [...cvData.education];
                                                                    newEdu[index].startDate = e.target.value;
                                                                    setCvData({ ...cvData, education: newEdu });
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Année de fin</Label>
                                                            <Input
                                                                type="month"
                                                                value={edu.endDate}
                                                                onChange={(e) => {
                                                                    const newEdu = [...cvData.education];
                                                                    newEdu[index].endDate = e.target.value;
                                                                    setCvData({ ...cvData, education: newEdu });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        <Button onClick={handleAddEducation} variant="outline" className="w-full">
                                            <GraduationCap className="h-4 w-4 mr-2" />
                                            Ajouter une formation
                                        </Button>
                                    </div>
                                )}

                                {/* Step 5: Skills */}
                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        <div>
                                            <Label>Compétences Techniques</Label>
                                            <Textarea
                                                rows={4}
                                                placeholder="Ex: JavaScript, Python, React, Marketing Digital, Adobe Photoshop... (séparez par des virgules)"
                                                className="resize-none"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Séparez chaque compétence par une virgule
                                            </p>
                                        </div>

                                        <div>
                                            <Label>Compétences Comportementales (Soft Skills)</Label>
                                            <Textarea
                                                rows={4}
                                                placeholder="Ex: Leadership, Communication, Travail d'équipe, Résolution de problèmes..."
                                                className="resize-none"
                                            />
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <p className="text-sm text-purple-800">
                                                ✨ <strong>IA Suggérée :</strong> Basé sur votre profil, nous recommandons d'ajouter :
                                                <span className="font-semibold"> Gestion de projet, Analyse de données, Créativité</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Step 6: Languages & Finalize */}
                                {currentStep === 6 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                <Languages className="h-5 w-5 text-blue-600" />
                                                Langues
                                            </h3>

                                            {cvData.languages.map((lang, index) => (
                                                <Card key={index} className="mb-3 p-4 border-2 hover:border-blue-300 transition-colors">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Langue</Label>
                                                            <Input
                                                                value={lang.language}
                                                                onChange={(e) => {
                                                                    const newLangs = [...cvData.languages];
                                                                    newLangs[index].language = e.target.value;
                                                                    setCvData({ ...cvData, languages: newLangs });
                                                                }}
                                                                placeholder="Ex: Français, Anglais, Espagnol..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Niveau de maîtrise</Label>
                                                            <select
                                                                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                                                                value={lang.level}
                                                                onChange={(e) => {
                                                                    const newLangs = [...cvData.languages];
                                                                    newLangs[index].level = e.target.value;
                                                                    setCvData({ ...cvData, languages: newLangs });
                                                                }}
                                                            >
                                                                <option value="beginner">Débutant (A1-A2)</option>
                                                                <option value="intermediate">Intermédiaire (B1-B2)</option>
                                                                <option value="advanced">Avancé (C1-C2)</option>
                                                                <option value="native">Langue maternelle</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {cvData.languages.length > 1 && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => {
                                                                const newLangs = cvData.languages.filter((_, i) => i !== index);
                                                                setCvData({ ...cvData, languages: newLangs });
                                                            }}
                                                        >
                                                            <span className="mr-1">🗑️</span>
                                                            Supprimer cette langue
                                                        </Button>
                                                    )}
                                                </Card>
                                            ))}

                                            <Button
                                                variant="outline"
                                                className="w-full border-2 border-dashed border-blue-300 hover:bg-blue-50"
                                                onClick={() => {
                                                    setCvData({
                                                        ...cvData,
                                                        languages: [...cvData.languages, { language: '', level: 'intermediate' }]
                                                    });
                                                }}
                                            >
                                                <Languages className="h-4 w-4 mr-2" />
                                                Ajouter une langue
                                            </Button>
                                        </div>

                                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start gap-3">
                                                    <Award className="h-6 w-6 text-green-600 mt-1" />
                                                    <div>
                                                        <h4 className="font-semibold text-green-900 mb-2">
                                                            Votre CV est presque prêt !
                                                        </h4>
                                                        <p className="text-sm text-green-800 mb-4">
                                                            L'IA va maintenant optimiser votre contenu pour maximiser vos chances d'être retenu.
                                                            Coût : <strong>2 crédits</strong>
                                                        </p>
                                                        <ul className="space-y-2 text-sm text-green-700">
                                                            <li className="flex items-center gap-2">
                                                                <span className="h-1.5 w-1.5 bg-green-600 rounded-full" />
                                                                Optimisation ATS (Applicant Tracking System)
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="h-1.5 w-1.5 bg-green-600 rounded-full" />
                                                                Suggestions de contenu améliorées
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="h-1.5 w-1.5 bg-green-600 rounded-full" />
                                                                Mise en page professionnelle
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="h-1.5 w-1.5 bg-green-600 rounded-full" />
                                                                Export PDF & DOCX
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Précédent
                            </Button>

                            <div className="flex gap-2">
                                <Button variant="ghost">
                                    <Save className="h-4 w-4 mr-2" />
                                    Sauvegarder
                                </Button>

                                {currentStep < STEPS.length ? (
                                    <Button onClick={handleNext}>
                                        Suivant
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleGenerateCV}
                                        disabled={isGenerating}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Génération en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Générer mon CV (2 crédits)
                                            </>
                                        )}
                                    </Button>
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
