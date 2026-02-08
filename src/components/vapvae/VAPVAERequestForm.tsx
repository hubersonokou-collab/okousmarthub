import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Send } from "lucide-react";
import { useCreateVAPVAERequest } from "@/hooks/useVAPVAERequest";
import { VAP_VAE_LEVELS, SUPPORT_TYPES, formatPrice } from "@/lib/vapvaeConstants";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    full_name: z.string().min(3, "Le nom complet est requis (minimum 3 caractères)"),
    phone: z.string().min(8, "Numéro de téléphone invalide"),
    email: z.string().email("Email invalide"),
    current_profession: z.string().min(3, "Profession requise"),
    years_of_experience: z.coerce.number().min(0, "Années d'expérience invalides"),
    desired_field: z.string().min(3, "Filière souhaitée requise"),
    level: z.enum(['DUT', 'LICENCE', 'MASTER']),
    support_type: z.enum(['standard', 'priority', 'personalized']),
});

type FormData = z.infer<typeof formSchema>;

interface VAPVAERequestFormProps {
    preselectedLevel?: 'DUT' | 'LICENCE' | 'MASTER';
}

export function VAPVAERequestForm({ preselectedLevel }: VAPVAERequestFormProps) {
    const navigate = useNavigate();
    const { mutate: createRequest, isPending } = useCreateVAPVAERequest();
    const [selectedLevel, setSelectedLevel] = useState<'DUT' | 'LICENCE' | 'MASTER'>(preselectedLevel || 'DUT');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            level: preselectedLevel || 'DUT',
            support_type: 'standard',
        },
    });

    const levelValue = watch('level');
    const supportType = watch('support_type');

    const onSubmit = (data: FormData) => {
        const levelConfig = VAP_VAE_LEVELS[data.level];

        createRequest({
            ...data,
            total_amount: levelConfig.price,
            advance_paid: 0,
            balance_due: levelConfig.price,
        }, {
            onSuccess: (result) => {
                navigate(`/services/vap-vae/suivi?number=${result.request_number}`);
            },
        });
    };

    const currentLevel = VAP_VAE_LEVELS[levelValue || 'DUT'];

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl">Formulaire d'inscription VAP / VAE</CardTitle>
                <CardDescription>Remplissez tous les champs pour soumettre votre demande</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Section A: Informations du candidat */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">A. Informations du candidat</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Nom & Prénoms *</Label>
                                <Input
                                    id="full_name"
                                    {...register("full_name")}
                                    placeholder="Ex: KOUADIO Jean Marc"
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone (WhatsApp) *</Label>
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    placeholder="+225 07 XX XX XX XX"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="votre@email.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="current_profession">Profession actuelle *</Label>
                                <Input
                                    id="current_profession"
                                    {...register("current_profession")}
                                    placeholder="Ex: Agent commercial"
                                />
                                {errors.current_profession && (
                                    <p className="text-sm text-destructive">{errors.current_profession.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="years_of_experience">Années d'expérience *</Label>
                                <Input
                                    id="years_of_experience"
                                    type="number"
                                    min="0"
                                    {...register("years_of_experience")}
                                    placeholder="Ex: 5"
                                />
                                {errors.years_of_experience && (
                                    <p className="text-sm text-destructive">{errors.years_of_experience.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desired_field">Filière professionnelle souhaitée *</Label>
                                <Input
                                    id="desired_field"
                                    {...register("desired_field")}
                                    placeholder="Ex: Gestion Commerciale"
                                />
                                {errors.desired_field && (
                                    <p className="text-sm text-destructive">{errors.desired_field.message}</p>
                                )}
                            </div>
                        </div>            </div>

                    {/* Section B: Niveau demandé */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">B. Niveau demandé</h3>

                        <RadioGroup
                            value={levelValue}
                            onValueChange={(value) => {
                                setValue('level', value as 'DUT' | 'LICENCE' | 'MASTER');
                                setSelectedLevel(value as 'DUT' | 'LICENCE' | 'MASTER');
                            }}
                            className="space-y-3"
                        >
                            {Object.values(VAP_VAE_LEVELS).map((level) => {
                                const balance = level.price - level.advance;
                                return (
                                    <div key={level.value} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                                        <RadioGroupItem value={level.value} id={level.value} />
                                        <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                                            <div className="font-semibold text-base">{level.label} - {level.description}</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Coût total: <span className="font-medium text-foreground">{formatPrice(level.price)}</span>
                                                {" • "}
                                                Avance: <span className="font-medium text-green-600">{formatPrice(level.advance)}</span>
                                                {" • "}
                                                Solde: <span className="font-medium text-blue-600">{formatPrice(balance)}</span>
                                            </div>
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    {/* Section C: Options de suivi */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">C. Options de suivi</h3>

                        <RadioGroup
                            value={supportType}
                            onValueChange={(value) => setValue('support_type', value as 'standard' | 'priority' | 'personalized')}
                            className="space-y-3"
                        >
                            {Object.values(SUPPORT_TYPES).map((type) => (
                                <div key={type.value} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                                    <RadioGroupItem value={type.value} id={type.value} />
                                    <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                                        <div className="font-semibold">{type.label}</div>
                                        <div className="text-sm text-muted-foreground">{type.description}</div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Résumé du prix */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 space-y-3">
                        <h3 className="font-semibold text-lg">Récapitulatif financier</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Prix total ({currentLevel.label}):</span>
                                <span className="font-bold">{formatPrice(currentLevel.price)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Avance à payer:</span>
                                <span className="font-bold">{formatPrice(currentLevel.advance)}</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                                <span>Solde à la remise:</span>
                                <span className="font-bold">{formatPrice(currentLevel.price - currentLevel.advance)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        size="lg"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Traitement en cours...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-5 w-5" />
                                Réserver ma commande
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        En soumettant ce formulaire, vous acceptez de payer l'avance requise pour lancer la procédure.
                        Un numéro de dossier vous sera attribué automatiquement.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
