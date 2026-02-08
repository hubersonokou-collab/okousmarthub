import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, XCircle, Loader2, FileText, User, Mail, Phone, Globe } from 'lucide-react';
import { TRAVEL_PROJECT_TYPES } from '@/lib/travelConstants';

interface EvaluationRequest {
    id: string;
    request_number: string;
    project_type: string;
    destination: string;
    user_id: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
    evaluation_status: string;
    evaluation_paid: boolean;
    evaluation_amount_paid: number;
}

interface EvaluationPanelProps {
    onEvaluationUpdate?: () => void;
}

export function EvaluationPanel({ onEvaluationUpdate }: EvaluationPanelProps) {
    const [pendingEvaluations, setPendingEvaluations] = useState<EvaluationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [notes, setNotes] = useState<{ [key: string]: string }>({});
    const { toast } = useToast();

    // Fetch pending evaluations
    React.useEffect(() => {
        fetchPendingEvaluations();
    }, []);

    const fetchPendingEvaluations = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('admin_pending_evaluations')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setPendingEvaluations(data || []);
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEvaluationDecision = async (requestId: string, decision: 'approved' | 'rejected') => {
        try {
            setProcessingId(requestId);

            const evaluationNotes = decision === 'rejected' ? notes[requestId] : undefined;

            if (decision === 'rejected' && !evaluationNotes?.trim()) {
                toast({
                    title: 'Notes requises',
                    description: 'Veuillez fournir un motif de refus',
                    variant: 'destructive',
                });
                setProcessingId(null);
                return;
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            // Update evaluation status
            const { error } = await supabase
                .from('travel_requests')
                .update({
                    evaluation_status: decision,
                    evaluation_notes: evaluationNotes || null,
                    evaluation_date: new Date().toISOString(),
                    evaluated_by: user?.id,
                })
                .eq('id', requestId);

            if (error) throw error;

            toast({
                title: decision === 'approved' ? '✅ Dossier approuvé' : '❌ Dossier rejeté',
                description: decision === 'approved'
                    ? 'Le client peut maintenant payer la 1ère tranche'
                    : 'Le client a été notifié du refus',
            });

            // Refresh list
            await fetchPendingEvaluations();
            setNotes(prev => ({ ...prev, [requestId]: '' }));

            if (onEvaluationUpdate) {
                onEvaluationUpdate();
            }
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setProcessingId(null);
        }
    };

    const getProjectConfig = (projectType: string) => {
        return TRAVEL_PROJECT_TYPES[projectType as keyof typeof TRAVEL_PROJECT_TYPES];
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Évaluations en Attente
                </CardTitle>
                <CardDescription>
                    Dossiers ayant payé l'évaluation (10 000 FCFA) en attente de validation
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pendingEvaluations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune évaluation en attente</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingEvaluations.map((request) => {
                            const projectConfig = getProjectConfig(request.project_type);
                            const isProcessing = processingId === request.id;

                            return (
                                <Card key={request.id} className="border-2">
                                    <CardContent className="pt-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    {request.request_number}
                                                    <Badge className="bg-yellow-500">
                                                        ⏳ En attente
                                                    </Badge>
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {projectConfig && (
                                                        <span className="font-medium">
                                                            {projectConfig.icon} {projectConfig.label}
                                                        </span>
                                                    )}
                                                    {' • '}
                                                    {format(new Date(request.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">
                                                ✓ Évaluation payée
                                            </Badge>
                                        </div>

                                        {/* Client Info */}
                                        <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm">{request.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm">{request.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm">{request.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm font-medium">{request.destination}</span>
                                            </div>
                                        </div>

                                        {/* Notes Field */}
                                        <div className="mb-4">
                                            <label className="text-sm font-medium mb-2 block">
                                                Notes d'évaluation {notes[request.id]?.trim() && '(obligatoire si rejet)'}
                                            </label>
                                            <Textarea
                                                placeholder="Motif du refus ou commentaires sur l'éligibilité..."
                                                value={notes[request.id] || ''}
                                                onChange={(e) => setNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                                                rows={3}
                                                disabled={isProcessing}
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => handleEvaluationDecision(request.id, 'approved')}
                                                disabled={isProcessing}
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                )}
                                                Approuver (Éligible)
                                            </Button>
                                            <Button
                                                onClick={() => handleEvaluationDecision(request.id, 'rejected')}
                                                disabled={isProcessing || !notes[request.id]?.trim()}
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                )}
                                                Rejeter (Non éligible)
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
