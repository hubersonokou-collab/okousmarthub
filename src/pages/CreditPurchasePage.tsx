import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/hooks/useAICV';
import { usePaystackPayment } from 'react-paystack';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
    Check, Coins, Sparkles, Star, TrendingUp, ArrowLeft
} from 'lucide-react';
import type { CreditPack } from '@/types/aiCVService';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export default function CreditPurchasePage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { creditPacks, creditsBalance, refreshCredits, isLoading } = useCredits();
    const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentSuccess = async (reference: any) => {
        if (!selectedPack) return;

        try {
            setIsProcessing(true);

            // Call Supabase function to add credits
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('add_credits', {
                p_user_id: userData.user.id,
                p_credits: selectedPack.credits,
                p_pack_id: selectedPack.id,
                p_payment_reference: reference.reference,
            });

            if (error) throw error;

            toast({
                title: 'Succès !',
                description: `${selectedPack.credits} crédits ajoutés à votre compte`,
            });

            refreshCredits();
            navigate('/services/cv-ai');
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message || 'Impossible d\'ajouter les crédits',
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentClose = () => {
        setSelectedPack(null);
    };

    const initializePayment = usePaystackPayment({
        reference: new Date().getTime().toString(),
        email: 'user@example.com', // Will be replaced with actual user email
        amount: (selectedPack?.price || 0) * 100, // Convert to kobo
        publicKey: PAYSTACK_PUBLIC_KEY,
    });

    const handlePurchase = async (pack: CreditPack) => {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user?.email) {
                toast({
                    title: 'Non connecté',
                    description: 'Veuillez vous connecter pour acheter des crédits',
                    variant: 'destructive',
                });
                navigate('/auth/login');
                return;
            }

            setSelectedPack(pack);

            // Initialize payment with correct email
            const paymentConfig = {
                reference: new Date().getTime().toString(),
                email: userData.user.email,
                amount: pack.price * 100,
                publicKey: PAYSTACK_PUBLIC_KEY,
            };

            const initPayment = usePaystackPayment(paymentConfig);
            initPayment(handlePaymentSuccess, handlePaymentClose);
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message || 'Impossible d\'initialiser le paiement',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Coins className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
            <Header />

            <main className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/services/cv-ai')}
                                className="mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>

                            <div className="text-center">
                                <Badge variant="outline" className="mb-4">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Système de Crédits
                                </Badge>
                                <h1 className="text-4xl font-bold mb-4">Acheter des Crédits</h1>
                                <p className="text-gray-600 text-lg mb-6">
                                    Choisissez le pack qui correspond à vos besoins
                                </p>

                                {/* Current Balance */}
                                <Card className="inline-flex items-center gap-3 px-8 py-4 border-2 border-purple-200">
                                    <Coins className="h-8 w-8 text-purple-600" />
                                    <div className="text-left">
                                        <p className="text-sm text-gray-600">Solde actuel</p>
                                        <p className="text-3xl font-bold text-purple-600">{creditsBalance}</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {creditPacks?.map((pack, index) => {
                                const isPopular = pack.name === 'Pro';
                                const isPremium = pack.name === 'Premium';

                                return (
                                    <Card
                                        key={pack.id}
                                        className={`relative ${isPopular ? 'border-2 border-purple-500 shadow-xl scale-105' : ''} ${isPremium ? 'bg-gradient-to-br from-purple-50 to-pink-50' : ''}`}
                                    >
                                        {isPopular && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <Badge className="bg-purple-600 text-white px-4 py-1">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Populaire
                                                </Badge>
                                            </div>
                                        )}

                                        <CardHeader className="text-center pt-8">
                                            <div className="mb-4">
                                                {index === 0 && <TrendingUp className="h-12 w-12 mx-auto text-blue-600" />}
                                                {index === 1 && <Sparkles className="h-12 w-12 mx-auto text-purple-600" />}
                                                {index === 2 && <Star className="h-12 w-12 mx-auto text-gradient-to-br from-purple-600 to-pink-600" />}
                                            </div>
                                            <CardTitle className="text-2xl mb-2">{pack.name}</CardTitle>
                                            <div className="mb-4">
                                                <span className="text-4xl font-bold">{pack.price.toLocaleString()}</span>
                                                <span className="text-gray-600"> FCFA</span>
                                            </div>
                                            <CardDescription className="text-lg font-semibold text-purple-600">
                                                {pack.credits} crédits
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <p className="text-center text-gray-600 mb-6">
                                                {pack.description}
                                            </p>

                                            <ul className="space-y-3 mb-6">
                                                {(pack.features as string[]).map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Button
                                                onClick={() => handlePurchase(pack)}
                                                disabled={isProcessing}
                                                className={`w-full ${isPopular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
                                                size="lg"
                                            >
                                                {isProcessing && selectedPack?.id === pack.id ? 'Traitement...' : 'Acheter'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Info Section */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-blue-600" />
                                    Comment fonctionnent les crédits ?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-gray-700">
                                <p>• <strong>Génération CV</strong> : 2 crédits par CV</p>
                                <p>• <strong>Lettre de motivation</strong> : 2 crédits par lettre</p>
                                <p>• <strong>Analyse offre d'emploi</strong> : 3 crédits (adaptation automatique)</p>
                                <p>• <strong>Traduction</strong> : 1 crédit par document</p>
                                <p>• <strong>Optimisation ATS</strong> : 1 crédit</p>
                                <p className="pt-3 border-t border-blue-300">
                                    💡 <strong>Astuce</strong> : Les crédits n'expirent jamais !
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
