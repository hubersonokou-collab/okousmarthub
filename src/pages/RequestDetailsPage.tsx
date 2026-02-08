import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTravelRequestByNumber } from "@/hooks/useTravelRequest";
import { useTravelMessages, useSendMessage } from "@/hooks/useMessages";
import { TRAVEL_REQUEST_STATUS, TRAVEL_PROJECT_TYPES, formatPrice } from "@/lib/travelConstants";
import { ArrowLeft, FileText, MessageSquare, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function RequestDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: request, isLoading } = useTravelRequestByNumber(id || '');
    const { data: messages = [] } = useTravelMessages(request?.id || null);
    const sendMessageMutation = useSendMessage();
    const [newMessage, setNewMessage] = useState('');

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
    }

    if (!request) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-lg mb-4">Dossier introuvable</p>
                <Button onClick={() => navigate('/dashboard/client')}>Retour au dashboard</Button>
            </div>
        );
    }

    const statusConfig = TRAVEL_REQUEST_STATUS[request.status as keyof typeof TRAVEL_REQUEST_STATUS];
    const projectConfig = request.project_type
        ? TRAVEL_PROJECT_TYPES[request.project_type as keyof typeof TRAVEL_PROJECT_TYPES]
        : null;

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !request.id) return;

        try {
            await sendMessageMutation.mutateAsync({
                requestId: request.id,
                message: newMessage,
                senderType: 'client',
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Button onClick={() => navigate('/dashboard/client')} className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{request.request_number}</h1>
                                <p className="text-muted-foreground">
                                    {projectConfig && `${projectConfig.icon} ${projectConfig.label}`}
                                </p>
                            </div>
                            <Badge className={`${statusConfig?.color || 'bg-gray-500'} text-white`}>
                                {statusConfig?.label || request.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="payments">Paiements</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                        </TabsList>

                        {/* TAB: Vue d'ensemble */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Informations principales */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations du dossier</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nom complet</p>
                                        <p className="font-medium">{request.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{request.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Téléphone</p>
                                        <p className="font-medium">{request.phone}</p>
                                    </div>
                                    {request.destination_country && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Destination</p>
                                            <p className="font-medium">{request.destination_country}</p>
                                        </div>
                                    )}
                                    {request.passport_number && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Passeport</p>
                                            <p className="font-medium">{request.passport_number}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date de création</p>
                                        <p className="font-medium">
                                            {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statut timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Suivi du dossier
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Statut actuel: <strong>{statusConfig?.label}</strong>
                                    </p>
                                    <p className="text-sm">{statusConfig?.description}</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB: Documents */}
                        <TabsContent value="documents">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Documents téléversés
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Liste des documents à venir
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB: Paiements */}
                        <TabsContent value="payments">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Informations financières
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Montant total</p>
                                            <p className="text-2xl font-bold">{formatPrice(request.total_amount)}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Montant payé</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatPrice(request.amount_paid)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Reste à payer</p>
                                            <p className="text-2xl font-bold text-orange-600">
                                                {formatPrice(request.balance_due)}
                                            </p>
                                        </div>
                                    </div>

                                    {request.balance_due > 0 && (
                                        <div className="mt-6">
                                            <Button className="w-full">Effectuer un paiement</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB: Messages */}
                        <TabsContent value="messages">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Messagerie
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Messages list */}
                                    <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                                        {messages.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                Aucun message pour le moment
                                            </p>
                                        ) : (
                                            messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`p-3 rounded-lg ${msg.sender_type === 'client'
                                                            ? 'bg-blue-100 ml-8'
                                                            : 'bg-gray-100 mr-8'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {format(new Date(msg.created_at), 'dd/MM/yyyy HH:mm')}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Message input */}
                                    <div className="flex gap-2">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Écrivez votre message..."
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                            Envoyer
                                        </Button>
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
