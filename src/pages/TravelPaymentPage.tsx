import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentCard } from '@/components/travel/PaymentButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { PaymentStageType } from '@/lib/paymentConfig';

export default function TravelPaymentPage() {
    const { requestId } = useParams<{ requestId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [request, setRequest] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        fetchRequestDetails();
        fetchUser();
    }, [requestId]);

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchRequestDetails = async () => {
        if (!requestId) return;

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('travel_requests')
                .select('*')
                .eq('id', requestId)
                .single();

            if (error) throw error;
            setRequest(data);
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!request || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50/30 to-white">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Card className="max-w-md">
                        <CardHeader>
                            <CardTitle>Dossier non trouvé</CardTitle>
                            <CardDescription>
                                Ce dossier n'existe pas ou vous n'avez pas accès.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate('/voyage')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    const paymentStage = request.payment_stage as PaymentStageType;
    const evaluationStatus = request.evaluation_status;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50/30 to-white">
            <Header />

            <main className="flex-1 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/dashboard/client')}
                                className="mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour au dashboard
                            </Button>
                            <h1 className="text-3xl font-bold mb-2">Paiement de votre dossier</h1>
                            <p className="text-muted-foreground">
                                Dossier: {request.request_number}
                            </p>
                        </div>

                        {/* Status du dossier */}
                        <Card className="mb-8 border-2 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    État du dossier
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Destination</p>
                                        <p className="font-semibold">{request.destination_country}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Type de projet</p>
                                        <p className="font-semibold">{request.project_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Étape actuelle</p>
                                        <p className="font-semibold">
                                            {paymentStage === 'evaluation' && '1. Évaluation'}
                                            {paymentStage === 'tranche1' && '2. Démarrage (1ère tranche)'}
                                            {paymentStage === 'tranche2' && '3. Finalisation (2ème tranche)'}
                                            {paymentStage === 'completed' && '✅ Complété'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Carte de paiement */}
                        {paymentStage !== 'completed' ? (
                            <PaymentCard
                                requestId={request.id}
                                paymentStage={paymentStage}
                                userEmail={user.email}
                                fullName={request.full_name}
                                evaluationStatus={evaluationStatus}
                                onPaymentSuccess={fetchRequestDetails}
                            />
                        ) : (
                            <Card className="border-2 border-green-500">
                                <CardContent className="pt-6">
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
                                        <h3 className="text-2xl font-bold mb-2">Dossier complété !</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Tous les paiements ont été effectués avec succès.
                                        </p>
                                        <Button onClick={() => navigate('/dashboard/client')}>
                                            Retour au dashboard
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Information sur le processus */}
                        <Card className="mt-8 bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-lg">ℹ️ Processus de paiement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-3 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600">1.</span>
                                        <div>
                                            <strong>Évaluation (10 000 FCFA)</strong>
                                            <p className="text-muted-foreground">
                                                Analyse de votre dossier sous 48h
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600">2.</span>
                                        <div>
                                            <strong>1ère Tranche (1 000 000 FCFA)</strong>
                                            <p className="text-muted-foreground">
                                                Disponible si votre dossier est approuvé
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600">3.</span>
                                        <div>
                                            <strong>2ème Tranche (1 500 000 FCFA)</strong>
                                            <p className="text-muted-foreground">
                                                Payable à la réception de votre visa
                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
