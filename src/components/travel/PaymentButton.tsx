import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePaystackPayment } from 'react-paystack';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PAYMENT_CONFIG, PAYSTACK_CONFIG, formatAmountForPaystack, PaymentStageType } from '@/lib/paymentConfig';
import { formatPrice } from '@/lib/travelConstants';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentButtonProps {
    requestId: string;
    paymentStage: PaymentStageType;
    userEmail: string;
    fullName: string;
    onPaymentSuccess?: () => void;
}

export function PaymentButton({
    requestId,
    paymentStage,
    userEmail,
    fullName,
    onPaymentSuccess,
}: PaymentButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const paymentConfig = PAYMENT_CONFIG[paymentStage];
    const amount = paymentConfig.amount;

    const paystackConfig = {
        reference: `${paymentStage}_${requestId}_${Date.now()}`,
        email: userEmail,
        amount: formatAmountForPaystack(amount),
        publicKey: PAYSTACK_CONFIG.publicKey,
        currency: PAYSTACK_CONFIG.currency,
        channels: PAYSTACK_CONFIG.channels,
        metadata: {
            custom_fields: [
                {
                    display_name: 'Request ID',
                    variable_name: 'request_id',
                    value: requestId,
                },
                {
                    display_name: 'Payment Stage',
                    variable_name: 'payment_stage',
                    value: paymentStage,
                },
                {
                    display_name: 'Customer Name',
                    variable_name: 'customer_name',
                    value: fullName,
                },
            ],
        },
    };

    const onSuccess = async (reference: any) => {
        try {
            setIsProcessing(true);

            // Créer l'enregistrement de paiement
            const { error: paymentError } = await supabase
                .from('travel_payments')
                .insert({
                    request_id: requestId,
                    payment_step: paymentStage,
                    amount: amount,
                    payment_status: 'completed',
                    payment_method: 'paystack',
                    transaction_reference: reference.reference,
                    payment_date: new Date().toISOString(),
                });

            if (paymentError) throw paymentError;

            // Mettre à jour le payment_stage de la demande
            let updateData: any = {};

            if (paymentStage === 'evaluation') {
                // Après paiement évaluation, reste en pending
                updateData = {
                    payment_stage: 'evaluation',
                    evaluation_status: 'pending',
                };
            } else if (paymentStage === 'tranche1') {
                // Après tranche 1, passer à tranche2
                updateData = {
                    payment_stage: 'tranche2',
                };
            } else if (paymentStage === 'tranche2') {
                // Après tranche 2, marquer comme completed
                updateData = {
                    payment_stage: 'completed',
                    status: 'completed',
                };
            }

            const { error: updateError } = await supabase
                .from('travel_requests')
                .update(updateData)
                .eq('id', requestId);

            if (updateError) throw updateError;

            // Créer une notification
            const notificationMessage =
                paymentStage === 'evaluation'
                    ? 'Votre paiement d\'évaluation a été reçu. Votre dossier sera analysé sous 48h.'
                    : paymentStage === 'tranche1'
                        ? 'Paiement de la 1ère tranche reçu. Le traitement de votre visa commence maintenant.'
                        : 'Paiement final reçu. Votre dossier est maintenant complet !';

            await supabase.from('travel_notifications').insert({
                request_id: requestId,
                user_id: (await supabase.auth.getUser()).data.user?.id,
                type: 'payment',
                title: '💰 Paiement reçu',
                message: notificationMessage,
            });

            toast({
                title: '✅ Paiement réussi',
                description: notificationMessage,
            });

            if (onPaymentSuccess) {
                onPaymentSuccess();
            }

            // Rediriger vers le dashboard
            setTimeout(() => {
                navigate('/dashboard/client');
            }, 1500);
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const onClose = () => {
        toast({
            title: 'Paiement annulé',
            description: 'Vous pouvez réessayer quand vous voulez',
        });
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const handlePayment = () => {
        initializePayment(onSuccess, onClose);
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
        >
            {isProcessing ? (
                <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Traitement...
                </>
            ) : (
                <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payer {formatPrice(amount)}
                </>
            )}
        </Button>
    );
}

// Composant pour afficher la carte de paiement avec informations
export function PaymentCard({
    requestId,
    paymentStage,
    userEmail,
    fullName,
    evaluationStatus,
}: PaymentButtonProps & { evaluationStatus?: string }) {
    const paymentConfig = PAYMENT_CONFIG[paymentStage];

    // Vérifier si le paiement est autorisé
    const isPaymentAllowed = () => {
        if (paymentStage === 'evaluation') return true;
        if (paymentStage === 'tranche1' && evaluationStatus === 'approved') return true;
        if (paymentStage === 'tranche2') return true; // À améliorer avec vérification visa
        return false;
    };

    const allowed = isPaymentAllowed();

    return (
        <Card className={`${allowed ? 'border-2 border-blue-500' : 'opacity-60'}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {allowed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                    {paymentConfig.label}
                </CardTitle>
                <CardDescription>{paymentConfig.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">Montant à payer</p>
                        <p className="text-4xl font-bold text-blue-600">
                            {formatPrice(paymentConfig.amount)}
                        </p>
                    </div>

                    {!allowed && paymentStage === 'tranche1' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                ⚠️ Paiement disponible après approbation de l'évaluation
                            </p>
                        </div>
                    )}

                    {allowed && (
                        <PaymentButton
                            requestId={requestId}
                            paymentStage={paymentStage}
                            userEmail={userEmail}
                            fullName={fullName}
                        />
                    )}

                    <div className="text-xs text-center text-muted-foreground">
                        🔒 Paiement sécurisé via Paystack
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
