import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    CheckCircle,
    Shield,
    Clock,
    CreditCard,
    FileCheck,
    ArrowRight,
    Plane,
    Briefcase,
    GraduationCap,
    Home,
    Users
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TRAVEL_PROJECT_TYPES, formatPrice, EVALUATION_STATUS } from '@/lib/travelConstants';

const TravelService = () => {
    const navigate = useNavigate();

    const processSteps = [
        {
            number: 1,
            title: 'Évaluation du Dossier',
            description: 'Soumettez votre projet et payez 10 000 FCFA pour une analyse complète',
            icon: FileCheck,
            color: 'bg-blue-500',
        },
        {
            number: 2,
            title: 'Résultat sous 48h',
            description: 'Recevez le résultat de l\'éligibilité de votre dossier',
            icon: Clock,
            color: 'bg-purple-500',
        },
        {
            number: 3,
            title: 'Paiement Échelonné',
            description: 'Si éligible: 1M FCFA au démarrage, 1.5M FCFA à la réception du visa',
            icon: CreditCard,
            color: 'bg-green-500',
        },
        {
            number: 4,
            title: 'Accompagnement Complet',
            description: 'Suivi transparent jusqu\'à l\'obtention de votre visa',
            icon: CheckCircle,
            color: 'bg-teal-500',
        },
    ];

    const projectTypes = Object.values(TRAVEL_PROJECT_TYPES);

    const guarantees = [
        {
            icon: Shield,
            title: 'Évaluation avant engagement',
            description: 'Connaissez vos chances réelles avant de payer le service complet',
        },
        {
            icon: CreditCard,
            title: 'Paiement sécurisé',
            description: 'Paystack certifié : carte bancaire et mobile money',
        },
        {
            icon: Clock,
            title: 'Suivi en temps réel',
            description: 'Dashboard personnel pour suivre chaque étape',
        },
        {
            icon: FileCheck,
            title: 'Transparence totale',
            description: 'Aucun frais caché, clarté sur toutes les étapes',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Votre Projet de Voyage Commence Ici
                            </h1>
                            <p className="text-xl mb-8 text-blue-100">
                                Évaluez gratuitement l'éligibilité de votre dossier pour seulement 10 000 FCFA.
                                Paiement du service complet uniquement si votre dossier est accepté.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50"
                                    onClick={() => navigate('/services/assistance-voyage/demande')}
                                >
                                    Évaluer mon dossier
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10"
                                    onClick={() => navigate('/services/assistance-voyage/suivi')}
                                >
                                    Suivre mon dossier
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Types de Voyage */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Types de Voyages Pris en Charge
                            </h2>
                            <p className="text-lg text-gray-600">
                                Quelle que soit votre destination, nous analysons votre dossier
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {projectTypes.map((project) => (
                                <Card key={project.value} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="text-4xl mb-4">{project.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2">{project.label}</h3>
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p className="font-medium text-blue-600">
                                            Évaluation : {formatPrice(project.evaluationFee)}
                                        </p>
                                        <p className="text-gray-500">
                                            Service complet : {formatPrice(project.serviceFee)}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Processus */}
                <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Comment Ça Marche ?
                            </h2>
                            <p className="text-lg text-gray-600">
                                Un processus simple et transparent en 4 étapes
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {processSteps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="text-sm font-semibold text-gray-500 mb-2">
                                            ÉTAPE {step.number}
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Tarification Transparente
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Paiement échelonné pour votre tranquillité
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <Card className="p-6 text-center border-2 border-blue-200">
                                    <div className="text-blue-600 text-4xl mb-4">1️⃣</div>
                                    <h3 className="font-bold text-xl mb-2">Évaluation</h3>
                                    <div className="text-3xl font-bold text-blue-600 mb-4">
                                        10 000 <span className="text-lg">FCFA</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Analyse complète de votre dossier et résultat sous 48h
                                    </p>
                                </Card>

                                <Card className="p-6 text-center border-2 border-green-200">
                                    <div className="text-green-600 text-4xl mb-4">2️⃣</div>
                                    <h3 className="font-bold text-xl mb-2">1ère Tranche</h3>
                                    <div className="text-3xl font-bold text-green-600 mb-4">
                                        1 000 000 <span className="text-lg">FCFA</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Si éligible : démarrage du processus de visa
                                    </p>
                                </Card>

                                <Card className="p-6 text-center border-2 border-teal-200">
                                    <div className="text-teal-600 text-4xl mb-4">3️⃣</div>
                                    <h3 className="font-bold text-xl mb-2">2ème Tranche</h3>
                                    <div className="text-3xl font-bold text-teal-600 mb-4">
                                        1 500 000 <span className="text-lg">FCFA</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Uniquement à la réception de votre visa
                                    </p>
                                </Card>
                            </div>

                            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg mb-2">Garantie de Transparence</h4>
                                        <p className="text-gray-700">
                                            Le service complet de <strong>2 500 000 FCFA</strong> n'est payé qu'après
                                            validation de votre éligibilité. Aucun engagement si votre dossier n'est pas retenu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Guarantees */}
                <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Pourquoi Nous Faire Confiance ?
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {guarantees.map((guarantee, index) => (
                                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                    <guarantee.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                                    <h3 className="font-semibold mb-2">{guarantee.title}</h3>
                                    <p className="text-sm text-gray-600">{guarantee.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Prêt à Réaliser Votre Projet de Voyage ?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            Commencez dès aujourd'hui par l'évaluation de votre dossier et donnez vie
                            à votre projet de voyage en toute sérénité.
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50"
                            onClick={() => navigate('/services/assistance-voyage/demande')}
                        >
                            Démarrer l'évaluation (10 000 FCFA)
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TravelService;
