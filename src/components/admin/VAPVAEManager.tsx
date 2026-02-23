import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Eye, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VAPVAERequest {
    id: string;
    request_number: string;
    user_id: string;
    service_type: string;
    full_name: string;
    email: string;
    phone: string;
    current_profession: string;
    years_of_experience: number;
    desired_field: string;
    level: string;
    support_type: string;
    status: string;
    notes: string | null;
    total_amount: number;
    advance_paid: number;
    balance_due: number;
    created_at: string;
    updated_at: string;
}

const statusConfig = {
    pending: { label: "En attente", color: "bg-yellow-500", icon: Clock },
    processing: { label: "En traitement", color: "bg-blue-500", icon: FileText },
    document_review: { label: "Révision docs", color: "bg-indigo-500", icon: Filter },
    validation_pending: { label: "En validation", color: "bg-purple-500", icon: Clock },
    completed: { label: "Terminé", color: "bg-green-500", icon: CheckCircle },
    rejected: { label: "Refusé", color: "bg-red-500", icon: XCircle },
    cancelled: { label: "Annulé", color: "bg-gray-500", icon: XCircle },
};

export function VAPVAEManager() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState<VAPVAERequest | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: requests, isLoading } = useQuery({
        queryKey: ["admin-vap-vae", statusFilter],
        queryFn: async () => {
            let query = supabase
                .from("vap_vae_requests")
                .select("*")
                .order("created_at", { ascending: false });

            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as VAPVAERequest[];
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { error } = await supabase
                .from("vap_vae_requests")
                .update({ status, updated_at: new Date().toISOString() })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-vap-vae"] });
            toast({ title: "Statut mis à jour avec succès" });
            setIsDetailsOpen(false);
        },
        onError: (error) => {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        },
    });

    const handleViewDetails = (request: VAPVAERequest) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    const handleStatusChange = (status: string) => {
        if (selectedRequest) {
            updateStatusMutation.mutate({ id: selectedRequest.id, status });
        }
    };

    const getStatusBadge = (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} text-white`}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Demandes VAP/VAE</h2>
                    <p className="text-sm text-muted-foreground">
                        Gérez les demandes de Validation des Acquis Professionnels et de l'Expérience
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="in_progress">En cours</SelectItem>
                            <SelectItem value="validated">Validés</SelectItem>
                            <SelectItem value="rejected">Refusés</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <Card className="p-8">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-muted rounded" />
                        ))}
                    </div>
                </Card>
            ) : requests && requests.length > 0 ? (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N° Dossier</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Niveau</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-mono text-xs">{request.request_number}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium">{request.full_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{request.level}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-semibold">{request.total_amount?.toLocaleString()} F</TableCell>
                                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(request)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Détails
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <Card className="p-8 text-center border-border">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune demande trouvée</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {statusFilter !== "all"
                            ? "Essayez de changer le filtre de statut"
                            : "Les demandes VAP/VAE apparaîtront ici"}
                    </p>
                </Card>
            )}

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails de la demande</DialogTitle>
                        <DialogDescription>
                            Demande {selectedRequest?.service_type} - {selectedRequest?.full_name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                                    <p className="text-foreground">{selectedRequest.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Type de service</p>
                                    <Badge variant="outline">{selectedRequest.service_type}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-foreground">{selectedRequest.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                                    <p className="text-foreground">{selectedRequest.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Diplôme visé</p>
                                    <p className="text-foreground">{selectedRequest.target_diploma || "Non spécifié"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Années d'expérience</p>
                                    <p className="text-foreground">{selectedRequest.experience_years || "Non spécifié"}</p>
                                </div>
                            </div>

                            {selectedRequest.current_situation && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Situation actuelle</p>
                                    <p className="text-foreground bg-muted p-3 rounded-lg">
                                        {selectedRequest.current_situation}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Statut actuel</p>
                                {getStatusBadge(selectedRequest.status)}
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleStatusChange("in_progress")}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Mettre en cours
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusChange("validated")}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Valider
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => handleStatusChange("rejected")}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Refuser
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
