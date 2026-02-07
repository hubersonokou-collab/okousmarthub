import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AcademicPricingCard } from "@/components/academic/AcademicPricingCard";
import { AcademicRequestForm } from "@/components/academic/AcademicRequestForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, GraduationCap, FileText, MessageCircle, ArrowRight } from "lucide-react";
import { DOCUMENT_TYPES, IMPORTANCE_TEXT, WHATSAPP_CONFIG } from "@/lib/academicConstants";
import { Link } from "react-router-dom";

const AcademicService = () => {
    const openWhatsApp = () => {
        const message = "Bonjour, je souhaite avoir des informations sur vos services de rédaction académique.";
        const url = WHATSAPP_CONFIG.getUrl(WHATSAPP_CONFIG.phone, message);
        window.open(url, '_blank');
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-500/10 to-pink-500/10">
                    <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-2 mb-6">
                                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    Service Professionnel de Rédaction Académique
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                                Rapports de Stage & Mémoires de{" "}
                                <span className="gradient-text">Licence Professionnelle</span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Confiez-nous la rédaction de vos documents académiques. Accompagnement professionnel
                                pour tous niveaux : BT, BTS et Licence.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600" asChild>
                                    <a href="#formulaire">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Faire une demande
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link to="/services/redaction-academique/suivi">
                                        Suivre mon dossier
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Importance Section */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-6 text-center">
                                {IMPORTANCE_TEXT.title}
                            </h2>

                            <Card className="mb-8">
                                <CardContent className="p-8">
                                    <p className="text-muted-foreground leading-relaxed mb-8">
                                        {IMPORTANCE_TEXT.intro}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Rapport de Stage */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold">{IMPORTANCE_TEXT.stageSectionTitle}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {IMPORTANCE_TEXT.stageDescription}
                                            </p>
                                            <ul className="space-y-2">
                                                {IMPORTANCE_TEXT.stagePoints.map((point, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Mémoire */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                                    <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold">{IMPORTANCE_TEXT.memoireSectionTitle}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {IMPORTANCE_TEXT.memoireDescription}
                                            </p>
                                            <ul className="space-y-2">
                                                {IMPORTANCE_TEXT.memoirePoints.map((point, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500">
                                        <p className="text-sm leading-relaxed">
                                            <strong>Conclusion : </strong>
                                            {IMPORTANCE_TEXT.conclusion}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Nos Offres de Rédaction</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Choisissez la formule adaptée à votre niveau académique.
                                Paiement en deux fois : avance + solde à la livraison.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                            <AcademicPricingCard type="RAPPORT_BT" />
                            <AcademicPricingCard type="RAPPORT_BTS_AVEC_STAGE" />
                            <AcademicPricingCard type="RAPPORT_BTS_SANS_STAGE" isPopular />
                            <AcademicPricingCard type="MEMOIRE_LICENCE" />
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section id="formulaire" className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Faites Votre Demande</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Remplissez le formulaire ci-dessous pour commencer. Vous recevrez votre numéro de dossier
                                immédiatement après soumission.
                            </p>
                        </div>

                        <AcademicRequestForm />
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold mb-8 text-center">Questions Fréquentes</h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Quel est le délai de livraison ?",
                                        a: "Le délai moyen est de 15 à 21 jours selon la complexité du document et votre disponibilité pour les informations.",
                                    },
                                    {
                                        q: "Puis-je demander des révisions ?",
                                        a: "Oui, les révisions sont illimitées jusqu'à votre entière satisfaction dans le respect des normes académiques.",
                                    },
                                    {
                                        q: "Comment se passe le paiement ?",
                                        a: "Le paiement se fait en deux fois : une avance lors de la commande via Paystack, puis le solde à la réception du document finalisé.",
                                    },
                                    {
                                        q: "Que faire si je n'ai pas encore de stage pour mon BTS ?",
                                        a: "Choisissez l'offre 'BTS sans stage' qui inclut le mentorat entreprise complet : recherche de stage, suivi, notes et attestation.",
                                    },
                                    {
                                        q: "Comment puis-je suivre l'avancement de mon dossier ?",
                                        a: "Utilisez votre numéro de dossier sur la page de suivi ou contactez-nous via WhatsApp pour un suivi personnalisé.",
                                    },
                                ].map((faq, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold mb-2 flex items-start gap-2">
                                                <BookOpen className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                {faq.q}
                                            </h3>
                                            <p className="text-sm text-muted-foreground pl-7">{faq.a}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <MessageCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
                        <h2 className="text-3xl font-bold mb-4">Une Question ? Contactez-Nous !</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Notre équipe est disponible sur WhatsApp pour répondre à toutes vos questions
                            et vous accompagner tout au long du processus.
                        </p>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={openWhatsApp}
                            className="bg-white text-blue-600 hover:bg-blue-50"
                        >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Discuter sur WhatsApp
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Floating WhatsApp Button */}
            <button
                onClick={openWhatsApp}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
                aria-label="Contact WhatsApp"
            >
                <MessageCircle className="h-6 w-6" />
            </button>
        </div>
    );
};

export default AcademicService;
