import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserTravelRequests } from "@/hooks/useTravelRequest";
import { useUnreadNotifications } from "@/hooks/useNotifications";
import {
    TRAVEL_REQUEST_STATUS,
    TRAVEL_PROJECT_TYPES,
    formatPrice,
    EVALUATION_STATUS,
    PAYMENT_STAGE_NEW
} from "@/lib/travelConstants";
import { FileText, Plus, Bell, Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientDashboard() {
    const navigate = useNavigate();
    const { data: requests = [], isLoading } = useUserTravelRequests();
    const { data: notifications = [] } = useUnreadNotifications();

    const getStatusConfig = (status: string) => {
        return TRAVEL_REQUEST_STATUS[status as keyof typeof TRAVEL_REQUEST_STATUS] || {
            label: status,
            color: 'bg-gray-500',
            description: '',
            step: 0,
        };
    };

    const getProjectConfig = (projectType: string) => {
        return TRAVEL_PROJECT_TYPES[projectType as keyof typeof TRAVEL_PROJECT_TYPES];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Espace Voyageur</h1>
                            <p className="text-muted-foreground">Gérez vos dossiers de voyage</p>
                        </div>
                        <Button onClick={() => navigate('/services/assistance-voyage/demande')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-5 w-5 mr-2" />
                            Nouvelle Demande
                        </Button>
                    </div>

                    {/* Notifications */}
                    {notifications.length > 0 && (
                        <Card className="mb-8 border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notifications ({notifications.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {notifications.slice(0, 3).map((notif) => (
                                        <div key={notif.id} className="p-3 bg-white rounded-lg">
                                            <p className="font-medium text-sm">{notif.title}</p>
                                            <p className="text-xs text-muted-foreground">{notif.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Vue d'ensemble */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Total des dossiers</CardDescription>
                                <CardTitle className="text-3xl">{requests.length}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>En cours</CardDescription>
                                <CardTitle className="text-3xl">
                                    {requests.filter((r) => !['completed', 'cancelled', 'rejected'].includes(r.status)).length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Complétés</CardDescription>
                                <CardTitle className="text-3xl">
                                    {requests.filter((r) => r.status === 'completed').length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Liste des dossiers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Mes Dossiers</CardTitle>
                            <CardDescription>Historique de vos demandes de voyage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground mb-4">Aucun dossier pour le moment</p>
                                    <Button onClick={() => navigate('/services/assistance-voyage/demande')}>
                                        Créer ma première demande
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {requests.map((request) => {
                                        const statusConfig = getStatusConfig(request.status);
                                        const projectConfig = request.project_type ? getProjectConfig(request.project_type) : null;

                                        return (
                                            <Card key={request.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/dashboard/client/request/${request.id}`)}>
                                                <CardContent className="pt-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{request.request_number}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {projectConfig && (
                                                                    <span>{projectConfig.icon} {projectConfig.label} • </span>
                                                                )}
                                                                {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 items-end">
                                                            <Badge className={`${statusConfig.color} text-white`}>
                                                                {statusConfig.label}
                                                            </Badge>

                                                            {/* Evaluation Status Badge */}
                                                            {request.evaluation_status && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${request.evaluation_status === 'approved'
                                                                            ? 'bg-green-50 border-green-300 text-green-700'
                                                                            : request.evaluation_status === 'rejected'
                                                                                ? 'bg-red-50 border-red-300 text-red-700'
                                                                                : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                                                                        }`}
                                                                >
                                                                    {request.evaluation_status === 'approved' && '✅ Éligible'}
                                                                    {request.evaluation_status === 'rejected' && '❌ Non éligible'}
                                                                    {request.evaluation_status === 'pending' && '⏳ En évaluation'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Payment Stage Indicator */}
                                                    {request.payment_stage && request.payment_stage !== 'completed' && (
                                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-blue-600" />
                                                                <p className="text-sm font-medium text-blue-900">
                                                                    {request.payment_stage === 'evaluation' && 'Paiement évaluation requis (10 000 FCFA)'}
                                                                    {request.payment_stage === 'tranche1' && 'Paiement 1ère tranche requis (1 000 000 FCFA)'}
                                                                    {request.payment_stage === 'tranche2' && 'Paiement 2ème tranche requis (1 500 000 FCFA)'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Evaluation Notes (if rejected) */}
                                                    {request.evaluation_status === 'rejected' && request.evaluation_notes && (
                                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-red-900 mb-1">Motif du refus</p>
                                                                    <p className="text-sm text-red-700">{request.evaluation_notes}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {request.program_type === 'decreto_flussi' && (
                                                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Total</p>
                                                                <p className="font-semibold">{formatPrice(request.total_amount)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Payé</p>
                                                                <p className="font-semibold text-green-600">{formatPrice(request.amount_paid)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Restant</p>
                                                                <p className="font-semibold text-blue-600">{formatPrice(request.balance_due)}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
