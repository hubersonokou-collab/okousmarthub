import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Edit, Download, Loader2, RefreshCw } from "lucide-react";
import { useAllAcademicRequests, useUpdateAcademicRequestStatus } from "@/hooks/useAcademicRequest";
import { REQUEST_STATUS, formatPrice, DOCUMENT_TYPES } from "@/lib/academicConstants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const AcademicAdmin = () => {
    const { data: requests = [], isLoading, refetch } = useAllAcademicRequests();
    const updateStatus = useUpdateAcademicRequestStatus();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [newStatus, setNewStatus] = useState("");
    const [notes, setNotes] = useState("");

    // Filtrer les demandes
    const filteredRequests = requests.filter((req) => {
        const matchesSearch =
            req.request_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleUpdateStatus = async () => {
        if (!selectedRequest || !newStatus) return;

        await updateStatus.mutateAsync({
            requestId: selectedRequest.id,
            newStatus,
            notes: notes || undefined,
        });

        setSelectedRequest(null);
        setNewStatus("");
        setNotes("");
        refetch();
    };

    const handleExportCSV = () => {
        const headers = ["Numéro", "Nom", "Email", "Téléphone", "Niveau", "Document", "Statut", "Montant", "Avance", "Solde", "Date"];
        const rows = filteredRequests.map((req) => [
            req.request_number,
            req.full_name,
            req.email,
            req.phone,
            req.academic_level,
            req.document_type,
            req.status,
            req.total_amount,
            req.advance_paid,
            req.balance_due,
            format(new Date(req.created_at), "dd/MM/yyyy"),
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `demandes-academiques-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
    };

    // Statistiques
    const stats = {
        total: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        inProgress: requests.filter((r) => ["info_received", "plan_validated", "in_writing", "in_review"].includes(r.status)).length,
        completed: requests.filter((r) => r.status === "completed").length,
        totalRevenue: requests.reduce((sum, r) => sum + r.advance_paid, 0),
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête et statistiques */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Gestion des Demandes Académiques</h2>
                    <p className="text-muted-foreground">Gérez les demandes de rédaction</p>
                </div>
                <Button onClick={() => refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualiser
                </Button>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total demandes</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>En attente</CardDescription>
                        <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>En cours</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Terminées</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Revenus (Avances)</CardDescription>
                        <CardTitle className="text-2xl gradient-text">{formatPrice(stats.totalRevenue)}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtres</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par numéro, nom ou email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {Object.entries(REQUEST_STATUS).map(([key, status]) => (
                                    <SelectItem key={key} value={key}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={handleExportCSV} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Exporter CSV
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table des demandes */}
            <Card>
                <CardHeader>
                    <CardTitle>Demandes ({filteredRequests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Candidat</TableHead>
                                <TableHead>Niveau</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Aucune demande trouvée
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRequests.map((request) => {
                                    const statusInfo = REQUEST_STATUS[request.status as keyof typeof REQUEST_STATUS];

                                    return (
                                        <TableRow key={request.id}>
                                            <TableCell className="font-mono text-sm">{request.request_number}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-semibold">{request.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">{request.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{request.academic_level}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${statusInfo.color} text-white`}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-semibold">{formatPrice(request.total_amount)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Avance: {formatPrice(request.advance_paid)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {format(new Date(request.created_at), "dd/MM/yy", { locale: fr })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setNewStatus(request.status);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Gérer la demande</DialogTitle>
                                                            <DialogDescription>
                                                                Numéro: {request.request_number}
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4">
                                                            {/* Informations */}
                                                            <div className="grid gap-4 sm:grid-cols-2">
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">Candidat</p>
                                                                    <p className="font-semibold">{request.full_name}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">Téléphone</p>
                                                                    <p className="font-semibold">{request.phone}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">Établissement</p>
                                                                    <p className="font-semibold">{request.institution}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">Filière</p>
                                                                    <p className="font-semibold">{request.field_of_study}</p>
                                                                </div>
                                                            </div>

                                                            {/* Modifier le statut */}
                                                            <div className="space-y-2">
                                                                <Label>Nouveau statut</Label>
                                                                <Select value={newStatus} onValueChange={setNewStatus}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Object.entries(REQUEST_STATUS).map(([key, status]) => (
                                                                            <SelectItem key={key} value={key}>
                                                                                {status.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Notes (optionnel)</Label>
                                                                <Textarea
                                                                    placeholder="Ajoutez une note sur ce changement..."
                                                                    value={notes}
                                                                    onChange={(e) => setNotes(e.target.value)}
                                                                    rows={3}
                                                                />
                                                            </div>

                                                            <Button
                                                                className="w-full"
                                                                onClick={handleUpdateStatus}
                                                                disabled={updateStatus.isPending || newStatus === request.status}
                                                            >
                                                                {updateStatus.isPending ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Mise à jour...
                                                                    </>
                                                                ) : (
                                                                    "Mettre à jour le statut"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
