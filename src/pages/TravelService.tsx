import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Globe, Shield, Upload, CreditCard, Calendar, Award } from "lucide-react";

const decretoSteps = [
    {
        number: 1,
        title: "Inscription candidat",
        description: "Création du profil et téléversement initial des documents",
        icon: FileText,
    },
    {
        number: 2,
        title: "Étude et validation",
        description: "Analyse approfondie de votre dossier par nos experts",
        icon: CheckCircle2,
    },
    {
        number: 3,
        title: "Soumission Decreto",
        description: "Dépôt officiel de votre demande auprès des autorités italiennes",
        icon: Upload,
    },
    {
        number: 4,
        title: "Obtention contrat",
        description: "Réception de votre contrat de travail officiel",
        icon: Award,
    },
    {
        number: 5,
        title: "Demande de visa",
        description: "Dépôt et traitement de votre demande de visa de travail",
        icon: Globe,
    },
    {
        number: 6,
        title: "Obtention visa",
        description: "Réception de votre visa de travail pour l'Italie",
        icon: CheckCircle2,
    },
    {
        number: 7,
        title: "Départ & intégration",
        description: "Accompagnement pour votre installation en Italie",
        icon: Shield,
    },
];

const requiredDocuments = [
    "Passeport valide (minimum 6 mois)",
    "Photo d'identité récente format passeport",
    "Acte de naissance (original + copie)",
    "Attestation de travail ou justificatif d'activité",
    "Relevés bancaires des 3 derniers mois",
    "Lettre de motivation personnalisée",
    "CV détaillé en français et italien",
];

export default function TravelService() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                            🧳 Assistance Voyage
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                            Votre partenaire pour la mobilité internationale
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Accompagnement complet pour vos projets de voyage et de migration professionnelle
                            avec suivi en temps réel et paiement sécurisé.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Service 1: Voyage Général */}
                            <Card className="hover:shadow-xl transition-shadow">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-6 w-6 text-blue-500" />
                                        Voyage Général
                                    </CardTitle>
                                    <CardDescription>Étude de dossier et préparation complète</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <p className="text-muted-foreground">
                                        Évaluation professionnelle de votre dossier comme dans une agence de voyage certifiée,
                                        pour maximiser vos chances de succès.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            <span className="text-sm">Analyse complète de votre profil</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            <span className="text-sm">Vérification d'éligibilité</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            <span className="text-sm">Recommandations personnalisées</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            <span className="text-sm">Support continu dans l'application</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => {
                                        const message = "Bonjour, je souhaite obtenir plus d'informations sur votre service d'assistance voyage général.";
                                        window.open(`https://wa.me/2250708080808?text=${encodeURIComponent(message)}`, '_blank');
                                    }}>
                                        En savoir plus
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Service 2: Decreto Flussi */}
                            <Card className="hover:shadow-xl transition-shadow border-2 border-green-200">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-6 w-6 text-green-500" />
                                                Decreto Flussi (Italie)
                                            </CardTitle>
                                            <CardDescription>Programme officiel de migration de travail</CardDescription>
                                        </div>
                                        <Badge className="bg-green-500 text-white">POPULAIRE</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <p className="text-muted-foreground">
                                        Programme gouvernemental italien permettant l'entrée légale de travailleurs étrangers.
                                        Ouvert à tous, sans discrimination de niveau ou de profil.
                                    </p>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="font-semibold text-green-700 mb-2">💰 Coût total : 1 500 000 FCFA</p>
                                        <p className="text-sm text-muted-foreground">Paiement en 3 tranches</p>
                                    </div>
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => {
                                        const element = document.getElementById('decreto-section');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}>
                                        Découvrir le programme
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decreto Flussi Détaillé */}
            <section id="decreto-section" className="py-16 bg-gradient-to-b from-green-50/50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="bg-green-600 text-white mb-4">Programme Phare</Badge>
                            <h2 className="text-3xl font-bold mb-4">Decreto Flussi - Italie</h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                Un parcours structuré en 7 étapes pour votre migration professionnelle en Italie
                            </p>
                        </div>

                        {/* Les 7 étapes */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {decretoSteps.map((step) => (
                                <Card key={step.number} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                                            {step.number}
                                        </div>
                                        <CardTitle className="text-base">{step.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Paiement */}
                        <Card className="mb-12">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-6 w-6" />
                                    Modalités de paiement
                                </CardTitle>
                                <CardDescription>Paiement sécurisé en 3 tranches via Paystack</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-green-50 rounded-lg">
                                        <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                            1
                                        </div>
                                        <p className="font-semibold mb-2">500 000 FCFA</p>
                                        <p className="text-sm text-muted-foreground">Avant obtention du contrat</p>
                                    </div>
                                    <div className="text-center p-6 bg-green-50 rounded-lg">
                                        <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                            2
                                        </div>
                                        <p className="font-semibold mb-2">500 000 FCFA</p>
                                        <p className="text-sm text-muted-foreground">Avant obtention du visa</p>
                                    </div>
                                    <div className="text-center p-6 bg-green-50 rounded-lg">
                                        <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                            3
                                        </div>
                                        <p className="font-semibold mb-2">500 000 FCFA</p>
                                        <p className="text-sm text-muted-foreground">Après obtention du visa</p>
                                    </div>
                                </div>
                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    💳 Tous les paiements se font exclusivement via Paystack avec confirmation automatique
                                </p>
                            </CardContent>
                        </Card>

                        {/* Documents requis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-6 w-6" />
                                    Documents requis
                                </CardTitle>
                                <CardDescription>À téléverser lors de votre inscription</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {requiredDocuments.map((doc, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <Upload className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm">
                                    📌 Tous les documents doivent être scannés en haute qualité (PDF ou images)
                                    et seront analysés par notre équipe avant validation.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Engagement */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Notre engagement</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
                                    <h3 className="font-semibold mb-2">Processus clair et structuré</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Chaque étape est détaillée et suivie en temps réel dans votre tableau de bord
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <Shield className="h-10 w-10 text-blue-500 mb-4" />
                                    <h3 className="font-semibold mb-2">Paiement 100% sécurisé</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Transactions protégées par Paystack avec historique complet dans l'app
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <Calendar className="h-10 w-10 text-purple-500 mb-4" />
                                    <h3 className="font-semibold mb-2">Suivi en temps réel</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Notifications à chaque étape clé et accès permanent à votre dossier
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <Award className="h-10 w-10 text-amber-500 mb-4" />
                                    <h3 className="font-semibold mb-2">Accompagnement professionnel</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Équipe d'experts dédiée pour maximiser vos chances de succès
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre projet ?</h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                            Demander une consultation
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10"
                            onClick={() => window.location.href = '/services/assistance-voyage/suivi'}
                        >
                            Suivre mon dossier
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
