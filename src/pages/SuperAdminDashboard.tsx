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
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { TRAVEL_REQUEST_STATUS, TRAVEL_PROJECT_TYPES, formatPrice } from "@/lib/travelConstants";
import {
    Users, FileText, DollarSign, CheckCircle, XCircle,
    Clock, TrendingUp, Bell, Zap, Plane, GraduationCap,
    ShoppingCart, Eye, ArrowRight
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { EvaluationPanel } from "@/components/travel/EvaluationPanel";
import { FormationsManager } from "@/components/admin/FormationsManager";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
    const { data: globalStats, isLoading: statsLoading } = useAdminStats();
    const { data: notifications = [] } = useAdminNotifications();
    const { data: allRequests = [], isLoading: travelLoading } = useAllTravelRequests();

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

    if (statsLoading) {
        return <div className="flex items-center justify-center min-h-screen">Chargement des données...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Global Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tour de Contrôle</h1>
                        <p className="text-slate-500 mt-1">SuperAdmin Dashboard - Vue d'ensemble de l'écosystème</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" asChild>
                            <Link to="/admin">
                                <Zap className="h-4 w-4" /> Panneau Admin Complet
                            </Link>
                        </Button>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 gap-2">
                            <Eye className="h-4 w-4" /> Mode Lecture seule
                        </Button>
                    </div>
                </div>

                {/* Main Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="font-medium">Revenus Totaux</CardDescription>
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold">{formatPrice(globalStats?.totalRevenue || 0)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <TrendingUp className="h-3 w-3" />
                                <span>+12% vs mois dernier</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="font-medium">Total Demandes</CardDescription>
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                                    <FileText className="h-5 w-5" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold">{globalStats?.totalRequests}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400 font-medium">Toutes catégories confondues</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="font-medium">En Attente</CardDescription>
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-orange-600">{globalStats?.pendingRequests}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400 font-medium">Nécessitent une action</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="font-medium">Succès</CardDescription>
                                <div className="p-2 bg-green-50 rounded-lg text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-green-600">{globalStats?.completedRequests}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <span>Taux de complétion : </span>
                                <span className="text-green-600 font-bold">
                                    {globalStats?.totalRequests ? Math.round((globalStats.completedRequests / globalStats.totalRequests) * 100) : 0}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-white border p-1 rounded-xl shadow-sm">
                        <TabsTrigger value="overview" className="rounded-lg">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="catalogue" className="rounded-lg">Catalogue</TabsTrigger>
                        <TabsTrigger value="evaluations" className="rounded-lg">Voyages</TabsTrigger>
                        <TabsTrigger value="verification" className="rounded-lg">Vérification</TabsTrigger>
                        <TabsTrigger value="users" className="rounded-lg">Utilisateurs</TabsTrigger>
                    </TabsList>

                    {/* TAB: Overview / Fil d'activité */}
                    <TabsContent value="overview">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-blue-600" />
                                            Activité Récente
                                        </CardTitle>
                                        <CardDescription>Flux en temps réel des interactions clients</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 10).map((notif, i) => (
                                                    <div key={notif.id} className="relative pl-10 group">
                                                        <div className="absolute left-0 top-1 p-2 bg-white rounded-full border shadow-sm group-hover:border-blue-200 transition-colors">
                                                            {notif.type === 'travel' && <Plane className="h-4 w-4 text-blue-500" />}
                                                            {notif.type === 'academic' && <GraduationCap className="h-4 w-4 text-purple-500" />}
                                                            {notif.type === 'vapvae' && <FileText className="h-4 w-4 text-orange-500" />}
                                                            {notif.type === 'order' && <ShoppingCart className="h-4 w-4 text-green-500" />}
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl border border-transparent group-hover:border-slate-100 group-hover:shadow-md transition-all">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <p className="font-bold text-sm text-slate-800">{notif.title}</p>
                                                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-500">
                                                                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 leading-relaxed mb-3">{notif.message}</p>
                                                            <Link
                                                                to={notif.type === 'travel' ? '/admin' : `/admin/${notif.type.replace('_', '-')}`}
                                                                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                                            >
                                                                Voir le dossier <ArrowRight className="h-3 w-3" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center">
                                                    <Bell className="h-10 w-10 mx-auto opacity-20 mb-4" />
                                                    <p className="text-slate-400">Aucune activité récente détectée</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-8">
                                <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Répartition Services</CardTitle>
                                        <CardDescription className="text-indigo-200/70">Volume par catégorie</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Voyage & Immigration</span>
                                                <span className="font-bold">{globalStats?.counts.travel}</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-400"
                                                    style={{ width: `${(globalStats?.counts.travel || 0) / (globalStats?.totalRequests || 1) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>VAP / VAE</span>
                                                <span className="font-bold">{globalStats?.counts.vapvae}</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-400"
                                                    style={{ width: `${(globalStats?.counts.vapvae || 0) / (globalStats?.totalRequests || 1) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Rédaction Académique</span>
                                                <span className="font-bold">{globalStats?.counts.academic}</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-400"
                                                    style={{ width: `${(globalStats?.counts.academic || 0) / (globalStats?.totalRequests || 1) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Solutions Web</span>
                                                <span className="font-bold">{globalStats?.counts.web}</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-400"
                                                    style={{ width: `${(globalStats?.counts.web || 0) / (globalStats?.totalRequests || 1) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Actions Rapides</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl" asChild>
                                            <Link to="/admin/vap-vae">
                                                <FileText className="h-5 w-5 text-orange-500" />
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Gérer VAP/VAE</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl" asChild>
                                            <Link to="/admin/academic">
                                                <GraduationCap className="h-5 w-5 text-purple-500" />
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Gérer Académique</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl" asChild>
                                            <Link to="/admin/web-solutions">
                                                <ShoppingCart className="h-5 w-5 text-green-500" />
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Gérer Web</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl" asChild>
                                            <Link to="/admin/portfolio">
                                                <Zap className="h-5 w-5 text-blue-500" />
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Portfolio</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl border-dashed border-slate-200" onClick={() => document.querySelector('[value="catalogue"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                                            <GraduationCap className="h-5 w-5 text-amber-500" />
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Éditer Catalogue</span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB: Catalogue de formations */}
                    <TabsContent value="catalogue">
                        <Card className="border-none shadow-sm">
                            <CardContent className="pt-6">
                                <FormationsManager />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: Évaluations Voyages (Existing logic) */}
                    <TabsContent value="evaluations">
                        <EvaluationPanel />
                    </TabsContent>

                    {/* TAB: Vérification (Existing logic) */}
                    <TabsContent value="verification">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* ... existing verification UI ... */}
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Dossiers Voyage à traiter</CardTitle>
                                    <CardDescription>
                                        {allRequests.filter(r => !['completed', 'cancelled', 'rejected'].includes(r.status)).length} dossiers en attente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                        {allRequests
                                            .filter(r => !['completed', 'cancelled', 'rejected'].includes(r.status))
                                            .map((request) => {
                                                const statusConfig = getStatusConfig(request.status);
                                                const projectConfig = request.project_type ? getProjectConfig(request.project_type) : null;

                                                return (
                                                    <Card
                                                        key={request.id}
                                                        className={`cursor-pointer transition-all border-none bg-white shadow-sm hover:shadow-md ${selectedRequest?.id === request.id ? 'ring-2 ring-blue-500' : ''
                                                            }`}
                                                        onClick={() => setSelectedRequest(request)}
                                                    >
                                                        <CardContent className="pt-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <p className="font-bold text-slate-900">{request.request_number}</p>
                                                                    <p className="text-sm text-slate-500">{request.full_name}</p>
                                                                </div>
                                                                <Badge className={`${statusConfig.color} text-white border-none shadow-sm`}>
                                                                    {statusConfig.label}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400">
                                                                Créé le {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>
                                        {selectedRequest ? 'Vérification du dossier' : 'Sélectionnez un dossier'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedRequest ? (
                                        <div className="space-y-6">
                                            {/* Infos dossier */}
                                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                                                <h3 className="font-bold text-slate-900 border-b pb-2 mb-2">Détails Client</h3>
                                                <div className="grid grid-cols-2 gap-y-2 text-sm italic">
                                                    <p className="text-slate-500">Nom complet:</p> <p className="font-medium text-right">{selectedRequest.full_name}</p>
                                                    <p className="text-slate-500">Service:</p> <p className="font-medium text-right uppercase">{selectedRequest.project_type || 'Général'}</p>
                                                    <p className="text-slate-500">Destination:</p> <p className="font-medium text-right">{selectedRequest.destination_country || 'N/A'}</p>
                                                    <p className="text-slate-500">Passeport:</p> <p className="font-medium text-right">{selectedRequest.passport_number || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* Checklist de validation */}
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-slate-900">Points de Contrôle</h3>
                                                <div className="grid gap-3">
                                                    {[
                                                        { id: 'passport', label: 'Passeport valide ?', key: 'passportValid' },
                                                        { id: 'photo', label: 'Photos conformes ?', key: 'photoConform' },
                                                        { id: 'payment', label: 'Paiement reçu ?', key: 'paymentReceived' },
                                                        { id: 'documents', label: 'Documents complets ?', key: 'documentsComplete' },
                                                    ].map((item) => (
                                                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setValidationChecklist(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}>
                                                            <Checkbox
                                                                id={item.id}
                                                                checked={validationChecklist[item.key as keyof typeof validationChecklist]}
                                                            />
                                                            <Label htmlFor={item.id} className="flex-1 cursor-pointer font-medium">{item.label}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold">Instructions Admin</Label>
                                                <Textarea
                                                    value={adminNotes}
                                                    onChange={(e) => setAdminNotes(e.target.value)}
                                                    placeholder="Précisez les étapes suivantes..."
                                                    className="bg-white"
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                                <Button
                                                    onClick={() => handleStatusChange(selectedRequest.id, 'documents_received')}
                                                    className="bg-blue-600 hover:bg-blue-700 font-bold"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Valider
                                                </Button>
                                                <Button
                                                    onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                                                    variant="secondary"
                                                    className="text-red-600 hover:bg-red-50 font-medium"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" /> Rejeter
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-slate-300">
                                            <Zap className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                            <p className="font-medium">Prêt pour la vérification</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TAB: Gestion Utilisateurs */}
                    <TabsContent value="users">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>Client / Utilisateurs</CardTitle>
                                <CardDescription>Base de données des comptes actifs</CardDescription>
                            </CardHeader>
                            <CardContent className="py-10 text-center">
                                <Users className="h-16 w-16 mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-500">Module de gestion avancée disponible dans <Link to="/admin/users" className="text-blue-600 font-bold hover:underline">Utilisateurs</Link></p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
