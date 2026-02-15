import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, CheckCircle, Store, Building2, Briefcase, FileText, Download } from "lucide-react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import PaystackPop from '@paystack/inline-js';

// --- INVOICE COMPONENT ---
const styles = StyleSheet.create({
    page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30 },
    header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#112244', paddingBottom: 10 },
    title: { fontSize: 24, textAlign: 'right', color: '#112244', fontWeight: 'bold' },
    subtitle: { fontSize: 10, textAlign: 'right', color: '#666' },
    companyInfo: { fontSize: 10, color: '#333', marginBottom: 20 },
    clientInfo: { marginTop: 20, padding: 10, backgroundColor: '#F5F7FA', borderRadius: 4 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#112244' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, fontSize: 10 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, paddingTop: 5, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#999' }
});

const InvoicePDF = ({ order }: { order: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>FACTURE PROFORMA</Text>
                <Text style={styles.subtitle}>N° {order.invoice_number}</Text>
                <Text style={styles.subtitle}>Date: {new Date(order.created_at).toLocaleDateString()}</Text>
            </View>

            <View style={styles.companyInfo}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>OKOU SMART HUB</Text>
                <Text>Service Solutions Digitales</Text>
                <Text>Abidjan, Côte d'Ivoire</Text>
                <Text>Tel: +225 07 00 00 00 00</Text>
                <Text>Email: contact@okousmarthub.com</Text>
            </View>

            <View style={styles.clientInfo}>
                <Text style={styles.sectionTitle}>FACTURÉ À :</Text>
                <Text>{order.client_name}</Text>
                <Text>{order.business_type}</Text>
                <Text>{order.phone}</Text>
                <Text>{order.email}</Text>
            </View>

            <View style={{ marginTop: 30 }}>
                <Text style={styles.sectionTitle}>DESCRIPTION DU SERVICE</Text>
                <View style={{ borderBottomWidth: 1, borderColor: '#EEE', paddingBottom: 5, marginBottom: 5 }}>
                    <View style={styles.row}>
                        <Text style={{ width: '60%' }}>Mise en place Solution Web - {order.pack_type}</Text>
                        <Text>1</Text>
                        <Text>{parseInt(order.total_amount).toLocaleString()} FCFA</Text>
                    </View>
                </View>

                <View style={styles.totalRow}>
                    <Text>TOTAL À PAYER</Text>
                    <Text>{parseInt(order.total_amount).toLocaleString()} FCFA</Text>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 10 }}>Mode de paiement: {order.payment_mode}</Text>
                    <Text style={{ fontSize: 10 }}>Conditions: {order.payment_terms === 'full' ? 'Paiement comptant' : order.payment_terms === '50-50' ? '50% à la commande, 50% à la livraison' : 'Paiement en 3 fois'}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>Merci de votre confiance. Ce document est une facture proforma générée automatiquement.</Text>
                <Text>OKOU SMART HUB - Services Numériques et Assistance</Text>
            </View>
        </Page>
    </Document>
);

// --- MAIN PAGE COMPONENT ---
export default function WebSolutionsOrderPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const initialPack = searchParams.get("pack") || "essentiel";

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            client_name: "",
            business_type: "",
            phone: "",
            email: "",
            description: "",
            pack_type: initialPack === "essentiel" ? "Pack Essentiel" : initialPack === "business" ? "Pack Business" : "Pack Premium",
            payment_mode: "wave",
            payment_terms: "full"
        }
    });

    const selectedPack = watch("pack_type");
    const getPrice = (pack: string) => {
        if (pack.includes("Essentiel")) return 150000;
        if (pack.includes("Business")) return 350000;
        return 800000; // Premium base
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const amount = getPrice(data.pack_type);
            const invoiceNum = `WEB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { data: orderData, error } = await supabase
                .from('web_solutions_orders')
                .insert({
                    client_name: data.client_name,
                    business_type: data.business_type,
                    pack_type: data.pack_type,
                    email: data.email,
                    phone: data.phone,
                    description: data.description,
                    total_amount: amount,
                    payment_mode: data.payment_mode,
                    payment_terms: data.payment_terms,
                    invoice_number: invoiceNum,
                    payment_status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            setOrder(orderData);
            setStep(3); // Go to confirmation/payment
            toast({ title: "Commande enregistrée !", description: "Votre facture a été générée." });

        } catch (error: any) {
            console.error('Error:', error);
            toast({ variant: "destructive", title: "Erreur", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePay = () => {
        if (!order) return;

        // Paystack configuration
        const paystack = new PaystackPop();
        paystack.newTransaction({
            key: 'pk_test_YOUR_PUBLIC_KEY', // TODO: Replace with env var or real key
            email: order.email,
            amount: order.total_amount * 100, // In kobo/centimes
            currency: 'XOF',
            onSuccess: async (transaction: any) => {
                // Update order status
                await supabase.from('web_solutions_orders').update({
                    payment_status: 'paid',
                    paid_amount: order.total_amount
                }).eq('id', order.id);

                toast({ title: "Paiement réussi !", description: "Merci pour votre confiance." });
                navigate('/dashboard');
            },
            onCancel: () => {
                toast({ title: "Paiement annulé", description: "Vous pourrez réessayer plus tard." });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 py-12 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Réservation de votre Solution Web</h1>

                {/* STEP 1 & 2 FORM */}
                {step < 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations & Commande</CardTitle>
                            <CardDescription>Remplissez ce formulaire pour recevoir votre facture proforma.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pack Choisi</Label>
                                        <Select
                                            defaultValue={watch("pack_type")}
                                            onValueChange={(val) => setValue("pack_type", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un pack" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pack Essentiel">Pack Essentiel (150.000 FCFA)</SelectItem>
                                                <SelectItem value="Pack Business">Pack Business (350.000 FCFA)</SelectItem>
                                                <SelectItem value="Pack Premium">Pack Premium (Sur devis)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Type d'activité</Label>
                                        <Select onValueChange={(val) => setValue("business_type", val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Ex: Commerce, Service..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Commerce / Boutique">Commerce / Boutique</SelectItem>
                                                <SelectItem value="Service / Consultant">Service / Consultant</SelectItem>
                                                <SelectItem value="Immobilier / BTP">Immobilier / BTP</SelectItem>
                                                <SelectItem value="Restauration / Hôtellerie">Restauration / Hôtellerie</SelectItem>
                                                <SelectItem value="Autre">Autre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Nom de l'entreprise ou Nom complet</Label>
                                    <Input {...register("client_name", { required: true })} placeholder="Ma Super Entreprise" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" {...register("email", { required: true })} placeholder="contact@entreprise.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Téléphone (avec WhatsApp)</Label>
                                        <Input {...register("phone", { required: true })} placeholder="+225 07..." />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Préférences de paiement</Label>
                                    <RadioGroup defaultValue="wave" onValueChange={(val) => setValue("payment_mode", val)} className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="wave" id="wave" />
                                            <Label htmlFor="wave" className="cursor-pointer">Mobile Money (Wave/Orange)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card" className="cursor-pointer">Carte Bancaire</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label>Facilités de paiement</Label>
                                    <RadioGroup defaultValue="full" onValueChange={(val) => setValue("payment_terms", val)} className="grid grid-cols-3 gap-2">
                                        <div className="flex items-center space-x-2 border p-2 rounded-lg">
                                            <RadioGroupItem value="full" id="full" />
                                            <Label htmlFor="full" className="text-xs">Comptant (100%)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-2 rounded-lg">
                                            <RadioGroupItem value="50-50" id="half" />
                                            <Label htmlFor="half" className="text-xs">2 Tranches (50/50)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-2 rounded-lg">
                                            <RadioGroupItem value="3-installments" id="tranche" />
                                            <Label htmlFor="tranche" className="text-xs">3 Mensualités</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-lg py-6" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Confirmer ma réservation"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* STEP 3: CONFIRMATION & INVOICE */}
                {step === 3 && order && (
                    <Card className="border-green-500 border-2">
                        <CardHeader className="text-center bg-green-50">
                            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <CardTitle className="text-green-700 text-2xl">Commande Confirmée !</CardTitle>
                            <CardDescription>Votre numéro de dossier : <strong>{order.invoice_number}</strong></CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <p className="text-center text-slate-600">
                                Votre facture proforma a été générée. Vous pouvez la télécharger ci-dessous.
                                Un conseiller vous contactera sous 24h sur WhatsApp au <strong>{order.phone}</strong>.
                            </p>

                            <div className="flex flex-col gap-3">
                                <div className="p-4 bg-slate-100 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-blue-600" />
                                        <div>
                                            <p className="font-bold text-sm">Facture_Proforma_{order.invoice_number}.pdf</p>
                                            <p className="text-xs text-slate-500">Généré le {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`Facture_${order.invoice_number}.pdf`}>
                                        {(params) => (
                                            <Button variant="outline" size="sm" disabled={params.loading}>
                                                <Download className="h-4 w-4 mr-2" />
                                                {params.loading ? '...' : 'Télécharger'}
                                            </Button>
                                        )}
                                    </PDFDownloadLink>
                                </div>

                                <Button onClick={handlePay} className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
                                    Payer maintenant ({parseInt(order.total_amount).toLocaleString()} FCFA)
                                </Button>

                                <Button variant="ghost" onClick={() => navigate('/services/solutions-web')}>
                                    Retour à l'accueil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </main>
            <Footer />
        </div>
    );
}
