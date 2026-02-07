import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useCreateAcademicRequest } from "@/hooks/useAcademicRequest";
import { DOCUMENT_TYPES, ACADEMIC_LEVELS, formatPrice, calculateBalance } from "@/lib/academicConstants";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
    phone: z.string().min(10, "Numéro de téléphone invalide"),
    email: z.string().email("Email invalide"),
    institution: z.string().min(2, "Nom de l'établissement requis"),
    field_of_study: z.string().min(2, "Filière/Spécialité requise"),
    academic_level: z.enum(['BT', 'BTS', 'LICENCE']),
    document_type: z.enum(['RAPPORT_BT', 'RAPPORT_BTS_AVEC_STAGE', 'RAPPORT_BTS_SANS_STAGE', 'MEMOIRE_LICENCE']),
    has_internship: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const AcademicRequestForm = () => {
    const [selectedDocType, setSelectedDocType] = useState<keyof typeof DOCUMENT_TYPES | null>(null);
    const [submittedRequest, setSubmittedRequest] = useState<any>(null);
    const createRequest = useCreateAcademicRequest();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const academicLevel = watch('academic_level');
    const documentType = watch('document_type');

    // Calculer les montants en fonction du type de document sélectionné
    const pricing = selectedDocType ? DOCUMENT_TYPES[selectedDocType] : null;

    const onSubmit = async (data: FormData) => {
        if (!pricing) return;

        const requestData = {
            ...data,
            has_internship: documentType === 'RAPPORT_BTS_AVEC_STAGE',
            total_amount: pricing.price,
            advance_paid: 0, // Sera mis à jour après le paiement
            balance_due: pricing.price,
        };

        createRequest.mutate(requestData, {
            onSuccess: (result) => {
                setSubmittedRequest(result);
                // TODO: Rediriger vers Paystack pour le paiement
            },
        });
    };

    // Filtrer les types de documents en fonction du niveau académique
    const getAvailableDocTypes = (level: string) => {
        return Object.entries(DOCUMENT_TYPES).filter(([_, doc]) => doc.level === level);
    };

    if (submittedRequest) {
        return (
            <Card className="max-w-2xl mx-auto border-2 border-green-500">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">Demande soumise avec succès !</CardTitle>
                    <CardDescription>
                        Votre numéro de dossier a été généré
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Numéro de dossier</p>
                        <p className="text-2xl font-bold gradient-text">
                            {submittedRequest.request_number}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Montant total</p>
                            <p className="text-lg font-semibold">{formatPrice(submittedRequest.total_amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avance à payer</p>
                            <p className="text-lg font-semibold text-orange-600">{formatPrice(submittedRequest.balance_due)}</p>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                            size="lg"
                            onClick={() => {
                                // TODO: Intégrer Paystack
                                alert('Redirection vers Paystack...');
                            }}
                        >
                            Procéder au paiement
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSubmittedRequest(null)}
                        >
                            Nouvelle demande
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Un email de confirmation vous a été envoyé avec les détails de votre demande.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Formulaire de demande de rédaction académique</CardTitle>
                <CardDescription>
                    Remplissez ce formulaire pour soumettre votre demande. Tous les champs sont obligatoires.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Section: Informations du candidat */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-l-4 border-blue-600 pl-3">
                            A. Informations du candidat
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Nom et Prénoms *</Label>
                                <Input
                                    id="full_name"
                                    placeholder="Ex: KOUASSI Jean-Marc"
                                    {...register('full_name')}
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-red-500">{errors.full_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
                                <Input
                                    id="phone"
                                    placeholder="+225 07 XX XX XX XX"
                                    {...register('phone')}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse e-mail *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="votre.email@exemple.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Établissement *</Label>
                                <Input
                                    id="institution"
                                    placeholder="Ex: INPHB, UFHB, ISTC..."
                                    {...register('institution')}
                                />
                                {errors.institution && (
                                    <p className="text-sm text-red-500">{errors.institution.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="field_of_study">Filière / Spécialité *</Label>
                                <Input
                                    id="field_of_study"
                                    placeholder="Ex: Génie Logiciel, Commerce..."
                                    {...register('field_of_study')}
                                />
                                {errors.field_of_study && (
                                    <p className="text-sm text-red-500">{errors.field_of_study.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Type de document */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-l-4 border-purple-600 pl-3">
                            B. Type de document demandé
                        </h3>

                        <div className="space-y-2">
                            <Label>Niveau académique *</Label>
                            <RadioGroup
                                onValueChange={(value) => {
                                    setValue('academic_level', value as any);
                                    setValue('document_type', '' as any);
                                    setSelectedDocType(null);
                                }}
                                className="grid gap-3 sm:grid-cols-3"
                            >
                                {Object.entries(ACADEMIC_LEVELS).map(([key, label]) => (
                                    <div key={key}>
                                        <RadioGroupItem value={key} id={key} className="peer sr-only" />
                                        <Label
                                            htmlFor={key}
                                            className="flex items-center justify-center rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 cursor-pointer transition-all"
                                        >
                                            {label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {errors.academic_level && (
                                <p className="text-sm text-red-500">{errors.academic_level.message}</p>
                            )}
                        </div>

                        {academicLevel && (
                            <div className="space-y-2">
                                <Label>Type de document *</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('document_type', value as any);
                                        setSelectedDocType(value as keyof typeof DOCUMENT_TYPES);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez le type de document" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableDocTypes(academicLevel).map(([key, doc]) => (
                                            <SelectItem key={key} value={key}>
                                                {doc.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.document_type && (
                                    <p className="text-sm text-red-500">{errors.document_type.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Section: Résumé de la commande */}
                    {pricing && (
                        <div className="rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-6 bg-blue-50/50 dark:bg-blue-950/20">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Badge className="bg-blue-600">Résumé</Badge>
                                Détails de la tarification
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Montant total</p>
                                    <p className="text-2xl font-bold gradient-text">{formatPrice(pricing.price)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Avance à payer</p>
                                    <p className="text-2xl font-bold text-orange-600">{formatPrice(pricing.advance)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Solde restant</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatPrice(calculateBalance(pricing.price, pricing.advance))}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-muted-foreground mb-2">Inclus dans l'offre :</p>
                                <ul className="text-sm space-y-1">
                                    <li>✅ Rédaction complète du document</li>
                                    {pricing.copies > 0 && <li>✅ {pricing.copies} exemplaires imprimés</li>}
                                    {pricing.mentoring && <li>✅ Mentorat entreprise complet</li>}
                                    <li>✅ Suivi personnalisé via WhatsApp</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Bouton de soumission */}
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                            disabled={!pricing || createRequest.isPending}
                        >
                            {createRequest.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Soumettre ma demande
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        En soumettant ce formulaire, vous acceptez nos conditions générales et vous serez redirigé vers Paystack pour le paiement sécurisé.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
};
