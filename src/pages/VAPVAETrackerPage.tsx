import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle2, Clock, FileText, Award } from "lucide-react";
import { useVAPVAERequestByNumber, useVAPVAEStatusHistory, useVAPVAEPayments } from "@/hooks/useVAPVAERequest";
import { VAP_VAE_REQUEST_STATUS, formatPrice, PAYMENT_TYPES } from "@/lib/vapvaeConstants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function VAPVAETrackerPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [requestNumber, setRequestNumber] = useState(searchParams.get('number') || '');
    const [searchValue, setSearchValue] = useState('');

    const { data: request, isLoading, error } = useVAPVAERequestByNumber(requestNumber);
    const { data: statusHistory = [] } = useVAPVAEStatusHistory(request?.id || null);
    const { data: payments = [] } = useVAPVAEPayments(request?.id || null);

    const handleSearch = () => {
        setRequestNumber(searchValue);
        setSearchParams({ number: searchValue });
    };

    const getStatusConfig = (status: string) => {
        return VAP_VAE_REQUEST_STATUS[status as keyof typeof VAP_VAE_REQUEST_STATUS] || {
            label: status,
            color: 'bg-gray-500',
            description: '',
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Suivi de dossier VAP/VAE
                        </h1>
                        <p className="text-muted-foreground">
                            Entrez votre numéro de dossier pour suivre l'évolution de votre demande
                        </p>
                    </div>

                    {/* Search */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Rechercher un dossier</CardTitle>
                            <CardDescription>Format: VAP-YYYYMMDD-XXXX</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Ex: VAP-20260208-0001"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="flex-1"
                                />
                                <Button onClick={handleSearch} disabled={!searchValue}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Rechercher
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <Card className="border-destructive">
                            <CardContent className="pt-6">
                                <p className="text-center text-destructive">
                                    Aucun dossier trouvé avec ce numéro. Vérifiez et réessayez.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Request Details */}
                    {request && (
                        <div className="space-y-6">
                            {/* Info générale */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">{request.request_number}</CardTitle>
                                            <CardDescription className="mt-2">
                                                {request.full_name} • {request.level}
                                            </CardDescription>
                                        </div>
                                        <Badge className={`${getStatusConfig(request.status).color} text-white`}>
                                            {getStatusConfig(request.status).label}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{request.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Téléphone</p>
                                            <p className="font-medium">{request.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Profession</p>
                                            <p className="font-medium">{request.current_profession}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Années d'expérience</p>
                                            <p className="font-medium">{request.years_of_experience} ans</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Filière souhaitée</p>
                                            <p className="font-medium">{request.desired_field}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date de création</p>
                                            <p className="font-medium">
                                                {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Paiements */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations financières</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Prix total</p>
                                            <p className="text-xl font-bold">{formatPrice(request.total_amount)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Avance payée</p>
                                            <p className="text-xl font-bold text-green-600">{formatPrice(request.advance_paid)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Solde restant</p>
                                            <p className="text-xl font-bold text-blue-600">{formatPrice(request.balance_due)}</p>
                                        </div>
                                    </div>

                                    {payments.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-3">Historique des paiements</h4>
                                            <div className="space-y-2">
                                                {payments.map((payment) => (
                                                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">
                                                                {PAYMENT_TYPES[payment.payment_type as keyof typeof PAYMENT_TYPES]}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {format(new Date(payment.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">{formatPrice(payment.amount)}</p>
                                                            <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                                                                {payment.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Historique de suivi</CardTitle>
                                    <CardDescription>Évolution de votre dossier</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {statusHistory.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-4">
                                                Aucun historique disponible
                                            </p>
                                        ) : (
                                            statusHistory.map((history, index) => {
                                                const statusConfig = getStatusConfig(history.new_status);
                                                return (
                                                    <div key={history.id} className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`h-10 w-10 rounded-full ${statusConfig.color} flex items-center justify-center text-white`}>
                                                                <CheckCircle2 className="h-5 w-5" />
                                                            </div>
                                                            {index < statusHistory.length - 1 && (
                                                                <div className="w-0.5 h-full bg-gray-200 mt-2" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <p className="font-semibold">{statusConfig.label}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {format(new Date(history.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {statusConfig.description}
                                                            </p>
                                                            {history.notes && (
                                                                <p className="text-sm mt-2 p-2 bg-gray-50 rounded">{history.notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
