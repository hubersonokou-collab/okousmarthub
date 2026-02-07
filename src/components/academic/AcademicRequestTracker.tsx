import { useState } from "react";
import { Search, Loader2, Phone, Mail, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAcademicRequestByNumber, useAcademicStatusHistory } from "@/hooks/useAcademicRequest";
import { REQUEST_STATUS, formatPrice, WHATSAPP_CONFIG } from "@/lib/academicConstants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const AcademicRequestTracker = () => {
    const [requestNumber, setRequestNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    const { data: request, isLoading } = useAcademicRequestByNumber(searchQuery);
    const { data: statusHistory = [] } = useAcademicStatusHistory(request?.id);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(requestNumber.trim());
    };

    const openWhatsApp = () => {
        if (!request) return;
        const message = WHATSAPP_CONFIG.getDefaultMessage(request.request_number);
        const url = WHATSAPP_CONFIG.getUrl(WHATSAPP_CONFIG.phone, message);
        window.open(url, '_blank');
    };

    const currentStatus = request ? REQUEST_STATUS[request.status as keyof typeof REQUEST_STATUS] : null;

    return (
        <div className="space-y-6">
            {/* Search form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Suivi de votre dossier académique</CardTitle>
                    <CardDescription>
                        Entrez votre numéro de dossier pour suivre l'avancement de votre demande
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ex: REF-20260207-0001"
                                value={requestNumber}
                                onChange={(e) => setRequestNumber(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !requestNumber.trim()}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Recherche...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Rechercher
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Request details */}
            {request && (
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left column: Request info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>Informations du dossier</CardTitle>
                                        <CardDescription className="mt-2">
                                            Numéro: <span className="font-mono font-bold text-foreground">{request.request_number}</span>
                                        </CardDescription>
                                    </div>
                                    {currentStatus && (
                                        <Badge className={`${currentStatus.color} text-white`}>
                                            {currentStatus.label}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Candidat</p>
                                        <p className="font-semibold">{request.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Établissement</p>
                                        <p className="font-semibold">{request.institution}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Filière</p>
                                        <p className="font-semibold">{request.field_of_study}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Niveau</p>
                                        <p className="font-semibold">{request.academic_level}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{request.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{request.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        Demande soumise le {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Historique du dossier</CardTitle>
                                <CardDescription>Suivi chronologique de l'avancement</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-4 pl-6">
                                    {/* Timeline line */}
                                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

                                    {statusHistory.map((history, index) => {
                                        const statusInfo = REQUEST_STATUS[history.new_status as keyof typeof REQUEST_STATUS];
                                        const isLatest = index === statusHistory.length - 1;

                                        return (
                                            <div key={history.id} className="relative">
                                                <div
                                                    className={`absolute left-[-1.4rem] top-1 h-5 w-5 rounded-full ${isLatest ? statusInfo?.color : 'bg-muted'
                                                        } border-4 border-background`}
                                                />
                                                <div className={`rounded-lg border p-4 ${isLatest ? statusInfo?.bgLight : 'bg-muted/20'}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-semibold">{statusInfo?.label || history.new_status}</p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {statusInfo?.description}
                                                            </p>
                                                            {history.notes && (
                                                                <p className="text-sm mt-2 italic">{history.notes}</p>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            {format(new Date(history.created_at), 'dd/MM/yyyy', { locale: fr })}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {statusHistory.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8">
                                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>Aucun historique disponible</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column: Payment info & actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Paiement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Montant total</p>
                                    <p className="text-2xl font-bold gradient-text">
                                        {formatPrice(request.total_amount)}
                                    </p>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Avance payée</span>
                                    <span className="font-semibold text-green-600">
                                        {formatPrice(request.advance_paid)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Solde restant</span>
                                    <span className="font-semibold text-orange-600">
                                        {formatPrice(request.balance_due)}
                                    </span>
                                </div>

                                {request.balance_due > 0 && (
                                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600" size="lg">
                                        Payer le solde
                                    </Button>
                                )}

                                {request.balance_due === 0 && (
                                    <div className="flex items-center gap-2 text-green-600 justify-center py-2">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="font-semibold">Paiement complet</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
                                <CardDescription>Contactez-nous via WhatsApp</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={openWhatsApp}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    size="lg"
                                >
                                    <Phone className="mr-2 h-5 w-5" />
                                    Contacter sur WhatsApp
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">
                                    Nous sommes disponibles pour répondre à toutes vos questions
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {searchQuery && !request && !isLoading && (
                <Card className="border-red-200 dark:border-red-800">
                    <CardContent className="py-12 text-center">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-red-500 opacity-50" />
                        <p className="text-lg font-semibold mb-2">Aucun dossier trouvé</p>
                        <p className="text-sm text-muted-foreground">
                            Le numéro de dossier <span className="font-mono font-bold">{searchQuery}</span> n'existe pas.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Vérifiez le numéro et réessayez.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
