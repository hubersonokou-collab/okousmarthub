import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WebSolutionsManager() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: orders, isLoading, refetch } = useQuery({
        queryKey: ["web-solutions-orders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("web_solutions_orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from("web_solutions_orders")
            .update({ payment_status: newStatus })
            .eq("id", id);

        if (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de mettre à jour le statut" });
        } else {
            toast({ title: "Succès", description: "Statut mis à jour" });
            refetch();
        }
    };

    const filteredOrders = orders?.filter(order => {
        const matchesSearch =
            order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.payment_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid": return <Badge className="bg-green-500">Payé</Badge>;
            case "partial": return <Badge className="bg-orange-500">Partiel</Badge>;
            case "pending": return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>;
            case "cancelled": return <Badge variant="destructive">Annulé</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher (Client, Email, N° Facture)..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="paid">Payés</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="partial">Partiel</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Commandes Solutions Web ({filteredOrders?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>N° Facture</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Pack</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Paiement</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders?.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-mono text-xs">{order.invoice_number}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.client_name}</div>
                                            <div className="text-xs text-muted-foreground">{order.business_type}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{order.pack_type}</Badge>
                                        </TableCell>
                                        <TableCell>{order.total_amount.toLocaleString()} FCFA</TableCell>
                                        <TableCell className="text-xs">
                                            {order.payment_mode || '-'} <br />
                                            <span className="text-muted-foreground">{order.payment_terms}</span>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(order.payment_status || 'pending')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.payment_status !== 'paid' && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusUpdate(order.id, 'paid')}>
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {order.payment_status !== 'cancelled' && (
                                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleStatusUpdate(order.id, 'cancelled')}>
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredOrders?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            Aucune commande trouvée
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
