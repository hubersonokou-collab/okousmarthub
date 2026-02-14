import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCreateTravelRequest } from "@/hooks/useTravelRequest";
import { TRAVEL_PROJECT_TYPES, POPULAR_DESTINATIONS, CURRENT_SITUATIONS, TravelProjectType, TravelCurrentSituation } from "@/lib/travelConstants";
import { DOCUMENT_TEMPLATES_BY_PROJECT, getDocumentsByProject } from "@/lib/documentTemplates";
import DocumentUploadZone from "./DocumentUploadZone";
import { PaymentCard } from "./PaymentButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface TravelFormData {
    projectType: TravelProjectType | '';
    destinationCountry: string;
    fullName: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    currentSituation: TravelCurrentSituation | '';
    currentOccupation: string;
}

export default function DynamicTravelForm() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<TravelFormData>({
        projectType: '',
        destinationCountry: '',
        fullName: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        passportIssueDate: '',
        passportExpiryDate: '',
        currentSituation: '',
        currentOccupation: '',
    });
    const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const createMutation = useCreateTravelRequest();

    // Fetch authenticated user
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const handleInputChange = (field: keyof TravelFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(formData.projectType && formData.destinationCountry && formData.fullName && formData.phone && formData.email);
            case 2:
                return !!(formData.passportNumber && formData.passportIssueDate && formData.passportExpiryDate && formData.currentSituation);
            case 3:
                return !!createdRequestId; // Demande créée
            case 4:
                return !!createdRequestId && !!user; // Demande créée + user connecté
            default:
                return true;
        }
    };

    const handleNext = async () => {
        if (currentStep === 2) {
            // Créer la demande avant de passer à l'étape 3
            try {
                const projectConfig = TRAVEL_PROJECT_TYPES[formData.projectType as TravelProjectType];
                const result = await createMutation.mutateAsync({
                    program_type: 'general',
                    project_type: formData.projectType as TravelProjectType,
                    full_name: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    date_of_birth: formData.dateOfBirth || undefined,
                    nationality: formData.nationality,
                    passport_number: formData.passportNumber,
                    passport_issue_date: formData.passportIssueDate,
                    passport_expiry_date: formData.passportExpiryDate,
                    destination_country: formData.destinationCountry,
                    current_situation: formData.currentSituation as TravelCurrentSituation,
                    current_occupation: formData.currentOccupation,
                    total_amount: projectConfig.baseFee,
                    balance_due: projectConfig.baseFee,
                });

                setCreatedRequestId(result.id);
                setCurrentStep(3);
            } catch (error) {
                console.error('Error creating request:', error);
            }
        } else if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        navigate(`/dashboard/client`);
    };

    // Récupérer documents requis selon projet
    const requiredDocuments = formData.projectType
        ? getDocumentsByProject(formData.projectType as keyof typeof DOCUMENT_TEMPLATES_BY_PROJECT)
        : [];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50/30 to-white">
            <Header />

            <main className="flex-1 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Nouvelle Demande de Voyage</h1>
                            <p className="text-muted-foreground">Complétez les informations en 4 étapes simples</p>
                        </div>

                        {/* Steps indicator */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex-1">
                                        <div className="flex items-center">
                                            <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${step < currentStep
                                                    ? 'bg-green-500 text-white'
                                                    : step === currentStep
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                                    }`}
                                            >
                                                {step < currentStep ? <Check className="h-5 w-5" /> : step}
                                            </div>
                                            {step < 4 && (
                                                <div
                                                    className={`h-1 flex-1 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                        <p className="text-xs mt-2 text-center">
                                            {step === 1 && 'Infos de base'}
                                            {step === 2 && 'Passeport'}
                                            {step === 3 && 'Documents'}
                                            {step === 4 && 'Paiement'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Steps */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {currentStep === 1 && 'Informations de base'}
                                    {currentStep === 2 && 'Informations passeport et situation'}
                                    {currentStep === 3 && 'Téléversement des documents'}
                                    {currentStep === 4 && 'Paiement'}
                                </CardTitle>
                                <CardDescription>
                                    {currentStep === 1 && 'Type de projet et informations personnelles'}
                                    {currentStep === 2 && 'Détails de votre passeport et situation actuelle'}
                                    {currentStep === 3 && 'Documents requis pour votre projet'}
                                    {currentStep === 4 && 'Finalisation du paiement'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Step 1: Infos de base */}
                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        {/* Type de projet */}
                                        <div className="space-y-2">
                                            <Label>Type de projet *</Label>
                                            <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez votre projet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(TRAVEL_PROJECT_TYPES).map((project) => (
                                                        <SelectItem key={project.value} value={project.value}>
                                                            {project.icon} {project.label} - {project.baseFee.toLocaleString()} FCFA
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Pays destination */}
                                        <div className="space-y-2">
                                            <Label>Pays de destination *</Label>
                                            <Select value={formData.destinationCountry} onValueChange={(value) => handleInputChange('destinationCountry', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez le pays" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.projectType && POPULAR_DESTINATIONS[formData.projectType as keyof typeof POPULAR_DESTINATIONS]?.map((country) => (
                                                        <SelectItem key={country} value={country}>
                                                            {country}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Nom complet */}
                                        <div className="space-y-2">
                                            <Label>Nom complet *</Label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                placeholder="Votre nom complet"
                                            />
                                        </div>

                                        {/* Téléphone */}
                                        <div className="space-y-2">
                                            <Label>Téléphone *</Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+225..."
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label>Email *</Label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="votre@email.com"
                                            />
                                        </div>

                                        {/* Date naissance */}
                                        <div className="space-y-2">
                                            <Label>Date de naissance</Label>
                                            <Input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            />
                                        </div>

                                        {/* Nationalité */}
                                        <div className="space-y-2">
                                            <Label>Nationalité *</Label>
                                            <Input
                                                value={formData.nationality}
                                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                                                placeholder="Ex: Ivoirienne"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Passeport */}
                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Numéro de passeport *</Label>
                                            <Input
                                                value={formData.passportNumber}
                                                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                                                placeholder="Ex: CI1234567"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Date d'émission *</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.passportIssueDate}
                                                    onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date d'expiration *</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.passportExpiryDate}
                                                    onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Situation actuelle *</Label>
                                            <Select value={formData.currentSituation} onValueChange={(value) => handleInputChange('currentSituation', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Votre situation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(CURRENT_SITUATIONS).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {value.icon} {value.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Profession/Occupation actuelle</Label>
                                            <Input
                                                value={formData.currentOccupation}
                                                onChange={(e) => handleInputChange('currentOccupation', e.target.value)}
                                                placeholder="Ex: Étudiant en informatique"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Documents */}
                                {currentStep === 3 && createdRequestId && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Téléversez les documents requis pour votre projet{' '}
                                            <strong>{TRAVEL_PROJECT_TYPES[formData.projectType as TravelProjectType]?.label}</strong>
                                        </p>

                                        {requiredDocuments.map((doc, index) => (
                                            <DocumentUploadZone
                                                key={index}
                                                requestId={createdRequestId}
                                                documentTemplate={doc}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Step 4: Paiement */}
                                {currentStep === 4 && createdRequestId && user && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Pour finaliser votre demande, veuillez effectuer le paiement d'évaluation.
                                            Votre dossier sera analysé sous 48h après réception.
                                        </p>
                                        <PaymentCard
                                            requestId={createdRequestId}
                                            paymentStage="evaluation"
                                            userEmail={user.email!}
                                            fullName={formData.fullName}
                                            onPaymentSuccess={() => {
                                                toast({
                                                    title: "✅ Paiement effectué",
                                                    description: "Votre dossier sera traité sous 48h.",
                                                });
                                                setTimeout(() => navigate('/dashboard/client'), 2000);
                                            }}
                                        />
                                    </div>
                                )}
                                {currentStep === 4 && !user && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Connexion requise pour effectuer le paiement.</p>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6">
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Précédent
                                    </Button>

                                    {currentStep < 4 ? (
                                        <Button
                                            onClick={handleNext}
                                            disabled={!validateStep(currentStep) || createMutation.isPending}
                                        >
                                            {currentStep === 2 && createMutation.isPending ? 'Création...' : 'Suivant'}
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleFinish}>
                                            Terminer
                                            <Check className="h-4 w-4 ml-2" />
                                        </Button>
                                    )}
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
