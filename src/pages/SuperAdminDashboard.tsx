import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAllTravelRequests, useUpdateTravelRequestStatus } from "@/hooks/useTravelRequest";
import { TRAVEL_REQUEST_STATUS, TRAVEL_PROJECT_TYPES, formatPrice } from "@/lib/travelConstants";
import { Users, FileText, DollarSign, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { EvaluationPanel } from "@/components/travel/EvaluationPanel";

export default function SuperAdminDashboard() {
    const { data: allRequests = [], isLoading } = useAllTravelRequests();
    const updateStatusMutation = useUpdateTravelRequestStatus();
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [validationChecklist, setValidationChecklist] = useState({
        passportValid: false,
        photoConform: false,
        paymentReceived: false,
        documentsComplete: false,
        bankStatementsOk: false,
    });
    const [adminNotes, setAdminNotes] = useState('');

    // Statistiques
    const stats = {
        totalRequests: allRequests.length,
        pendingRequests: allRequests.filter(r => r.status === 'registration').length,
        completedRequests: allRequests.filter(r => r.status === 'completed').length,
        totalRevenue: allRequests.reduce((sum, r) => sum + (r.amount_paid || 0), 0),
        pendingPayments: allRequests.reduce((sum, r) => sum + (r.balance_due || 0), 0),
    };

    const handleStatusChange = async (requestId: string, newStatus: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                id: requestId,
                status: newStatus,
            });
            toast.success('Statut mis à jour');
            setSelectedRequest(null);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const getStatusConfig = (status: string) => {
        return TRAVEL_REQUEST_STATUS[status as keyof typeof TRAVEL_REQUEST_STATUS] || {
            label: status,
            color: 'bg-gray-500',
        };
    };

    const getProjectConfig = (projectType: string) => {
        return TRAVEL_PROJECT_TYPES[projectType as keyof typeof TRAVEL_PROJECT_TYPES];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-2">Dashboard SuperAdmin</h1>
                        <p className="text-muted-foreground">Tour de Contrôle - Gestion Voyage</p>
                    </div>

                    {/* Statistiques Globales */}
                    <div className="grid md:grid-cols-5 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardDescription>Total Dossiers</CardDescription>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <CardTitle className="text-3xl">{stats.totalRequests}</CardTitle>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardDescription>En attente</CardDescription>
                                    <Clock className="h-4 w-4 text-orange-500" />
                                </div>
                                <CardTitle className="text-3xl text-orange-600">{stats.pendingRequests}</CardTitle>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardDescription>Complétés</CardDescription>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                                <CardTitle className="text-3xl text-green-600">{stats.completedRequests}</CardTitle>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardDescription>Revenus Reçus</CardDescription>
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                </div>
                                <CardTitle className="text-2xl text-green-600">
                                    {formatPrice(stats.totalRevenue)}
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardDescription>Paiements Dus</CardDescription>
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                </div>
                                <CardTitle className="text-2xl text-blue-600">
                                    {formatPrice(stats.pendingPayments)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <Tabs defaultValue="evaluations" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                            <TabsTrigger value="verification">Vérification Dossiers</TabsTrigger>
                            <TabsTrigger value="users">Gestion Utilisateurs</TabsTrigger>
                            <TabsTrigger value="financial">Gestion Financière</TabsTrigger>
                        </TabsList>

                        {/* TAB: Évaluations */}
                        <TabsContent value="evaluations">
                            <EvaluationPanel />
                        </TabsContent>

                        {/* TAB: Vérification des dossiers */}
                        <TabsContent value="verification">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Liste des dossiers */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Dossiers à traiter</CardTitle>
                                        <CardDescription>
                                            {stats.pendingRequests} dossiers en attente de vérification
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                            {allRequests
                                                .filter(r => !['completed', 'cancelled', 'rejected'].includes(r.status))
                                                .map((request) => {
                                                    const statusConfig = getStatusConfig(request.status);
                                                    const projectConfig = request.project_type ? getProjectConfig(request.project_type) : null;

                                                    return (
                                                        <Card
                                                            key={request.id}
                                                            className={`cursor-pointer transition-all ${selectedRequest?.id === request.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                                                                }`}
                                                            onClick={() => setSelectedRequest(request)}
                                                        >
                                                            <CardContent className="pt-4">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <p className="font-semibold">{request.request_number}</p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {request.full_name}
                                                                        </p>
                                                                        {projectConfig && (
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                {projectConfig.icon} {projectConfig.label}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <Badge className={`${statusConfig.color} text-white`}>
                                                                        {statusConfig.label}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Panneau de vérification */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {selectedRequest ? 'Vérification du dossier' : 'Sélectionnez un dossier'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedRequest ? (
                                            <div className="space-y-6">
                                                {/* Infos dossier */}
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold">Informations</h3>
                                                    <div className="text-sm space-y-1">
                                                        <p><strong>Nom:</strong> {selectedRequest.full_name}</p>
                                                        <p><strong>Email:</strong> {selectedRequest.email}</p>
                                                        <p><strong>Téléphone:</strong> {selectedRequest.phone}</p>
                                                        {selectedRequest.destination_country && (
                                                            <p><strong>Destination:</strong> {selectedRequest.destination_country}</p>
                                                        )}
                                                        {selectedRequest.passport_number && (
                                                            <p><strong>Passeport:</strong> {selectedRequest.passport_number}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Checklist de validation */}
                                                <div className="space-y-3">
                                                    <h3 className="font-semibold">Checklist de Validation</h3>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="passport"
                                                            checked={validationChecklist.passportValid}
                                                            onCheckedChange={(checked) =>
                                                                setValidationChecklist(prev => ({ ...prev, passportValid: !!checked }))
                                                            }
                                                        />
                                                        <Label htmlFor="passport">Passeport valide ?</Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="photo"
                                                            checked={validationChecklist.photoConform}
                                                            onCheckedChange={(checked) =>
                                                                setValidationChecklist(prev => ({ ...prev, photoConform: !!checked }))
                                                            }
                                                        />
                                                        <Label htmlFor="photo">Photos conformes ?</Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="payment"
                                                            checked={validationChecklist.paymentReceived}
                                                            onCheckedChange={(checked) =>
                                                                setValidationChecklist(prev => ({ ...prev, paymentReceived: !!checked }))
                                                            }
                                                        />
                                                        <Label htmlFor="payment">Paiement reçu ?</Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="documents"
                                                            checked={validationChecklist.documentsComplete}
                                                            onCheckedChange={(checked) =>
                                                                setValidationChecklist(prev => ({ ...prev, documentsComplete: !!checked }))
                                                            }
                                                        />
                                                        <Label htmlFor="documents">Documents complets ?</Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="bank"
                                                            checked={validationChecklist.bankStatementsOk}
                                                            onCheckedChange={(checked) =>
                                                                setValidationChecklist(prev => ({ ...prev, bankStatementsOk: !!checked }))
                                                            }
                                                        />
                                                        <Label htmlFor="bank">Relevés bancaires OK ?</Label>
                                                    </div>
                                                </div>

                                                {/* Notes internes */}
                                                <div className="space-y-2">
                                                    <Label>Notes internes</Label>
                                                    <Textarea
                                                        value={adminNotes}
                                                        onChange={(e) => setAdminNotes(e.target.value)}
                                                        placeholder="Commentaires sur le dossier..."
                                                        rows={3}
                                                    />
                                                </div>

                                                {/* Actions */}
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold">Actions</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            onClick={() => handleStatusChange(selectedRequest.id, 'documents_received')}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Valider
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleStatusChange(selectedRequest.id, 'completed')}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Marquer Complété
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Rejeter
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                <p>Sélectionnez un dossier dans la liste pour le vérifier</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TAB: Gestion Utilisateurs */}
                        <TabsContent value="users">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                                    <CardDescription>Liste des clients inscrits</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Fonctionnalité à venir - Liste des utilisateurs avec actions d'activation/suspension
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB: Gestion Financière */}
                        <TabsContent value="financial">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gestion Financière</CardTitle>
                                    <CardDescription>Suivi des paiements et génération de factures</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <p className="text-sm text-muted-foreground">Paiements Reçus</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatPrice(stats.totalRevenue)}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-muted-foreground">Paiements en Attente</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {formatPrice(stats.pendingPayments)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="font-semibold mb-3">Derniers Paiements</h3>
                                            <div className="space-y-2">
                                                {allRequests
                                                    .filter(r => r.amount_paid > 0)
                                                    .slice(0, 10)
                                                    .map((request) => (
                                                        <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <p className="font-medium text-sm">{request.full_name}</p>
                                                                <p className="text-xs text-muted-foreground">{request.request_number}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-green-600">{formatPrice(request.amount_paid)}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Reste: {formatPrice(request.balance_due)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
