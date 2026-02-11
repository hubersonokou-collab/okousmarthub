import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useAICV';
import { useAIPhotos } from '@/hooks/useAIPhotos';
import { 
  Sparkles, FileText, Send, Camera, FolderOpen, Coins,
  BookOpen, Plane, GraduationCap, TrendingUp, Gift,
  ArrowRight, CheckCircle, Clock
} from 'lucide-react';

export default function UnifiedDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { creditsBalance, creditPacks, userCredits } = useCredits();
  const { photos, stats } = useAIPhotos();

  // Calculate usage percentages
  const totalPurchased = userCredits?.total_purchased || 0;
  const totalUsed = userCredits?.total_used || 0;
  const usagePercentage = totalPurchased > 0 ? (totalUsed / totalPurchased) * 100 : 0;

  // Check if user received welcome bonus
  const hasWelcomeBonus = userCredits?.welcome_bonus_given || false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Bienvenue, {user?.email?.split('@')[0] || 'Client'} ! 👋
                  </h1>
                  <p className="text-gray-600">
                    Accédez à tous vos services professionnels en un seul endroit
                  </p>
                </div>
                
                {hasWelcomeBonus && creditsBalance === 8 && totalUsed === 0 && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg px-4 py-2">
                    <Gift className="h-5 w-5 mr-2" />
                    Bonus de bienvenue activé !
                  </Badge>
                )}
              </div>
            </div>

            {/* Credits Overview Card */}
            <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="h-5 w-5" />
                      <p className="text-blue-100 text-sm">Crédits Disponibles</p>
                    </div>
                    <p className="text-4xl font-bold">{creditsBalance}</p>
                    {hasWelcomeBonus && totalUsed === 0 && (
                      <p className="text-sm text-blue-100 mt-1">
                        🎁 Dont 8 crédits offerts !
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <p className="text-blue-100 text-sm">Crédits Utilisés</p>
                    </div>
                    <p className="text-4xl font-bold">{totalUsed}</p>
                    <p className="text-sm text-blue-100 mt-1">
                      sur {totalPurchased} achetés
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5" />
                      <p className="text-blue-100 text-sm">Utilisation</p>
                    </div>
                    <Progress value={usagePercentage} className="h-3 bg-blue-400" />
                    <p className="text-sm text-blue-100 mt-2">
                      {Math.round(usagePercentage)}% consommé
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <Button
                    onClick={() => navigate('/services/cv-ai/credits')}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Acheter Plus de Crédits
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Welcome Instructions (for new users) */}
            {hasWelcomeBonus && totalUsed === 0 && (
              <Card className="mb-8 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Gift className="h-6 w-6" />
                    🎉 Vos crédits de bienvenue sont prêts !
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Commencez votre aventure avec <strong>8 crédits offerts</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">1 CV</span>
                      </div>
                      <p className="text-sm text-gray-600">2 crédits</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Send className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold">1 Lettre</span>
                      </div>
                      <p className="text-sm text-gray-600">2 crédits</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="h-5 w-5 text-pink-600" />
                        <span className="font-semibold">1 Photo Pro</span>
                      </div>
                      <p className="text-sm text-gray-600">3 crédits</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-700 mt-4 text-center">
                    ✨ <strong>Bonus :</strong> Il vous restera 1 crédit pour tester d'autres fonctionnalités !
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Services Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Vos Services</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Service IA CV */}
                <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-500">Actif</Badge>
                    </div>
                    <CardTitle>Service IA CV & Lettres</CardTitle>
                    <CardDescription>
                      Création professionnelle avec intelligence artificielle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Photo Pro IA disponible</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>CV et lettres bientôt</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/services/cv-ai')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Accéder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Rédaction Académique */}
                <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-green-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-500">Actif</Badge>
                    </div>
                    <CardTitle>Rédaction Académique</CardTitle>
                    <CardDescription>
                      Accompagnement pour vos travaux universitaires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Mémoires, thèses, rapports</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Suivi de demandes</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/services/redaction-academique')}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      Accéder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* VAP / VAE */}
                <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-orange-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-500">Actif</Badge>
                    </div>
                    <CardTitle>VAP / VAE</CardTitle>
                    <CardDescription>
                      Validation des acquis professionnels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Dossier de validation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Accompagnement complet</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/services/vap-vae')}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                    >
                      Accéder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Assistance Voyage */}
                <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-cyan-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                        <Plane className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-500">Actif</Badge>
                    </div>
                    <CardTitle>Assistance Voyage</CardTitle>
                    <CardDescription>
                      Réservations et organisation de voyages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Billets d'avion</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Hôtels et séjours</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/voyage')}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                    >
                      Accéder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Formations */}
                <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-yellow-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-500">Actif</Badge>
                    </div>
                    <CardTitle>Formations</CardTitle>
                    <CardDescription>
                      Développez vos compétences professionnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Cours en ligne</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Certifications</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/formations')}
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
                    >
                      Accéder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Mes Documents */}
                <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-indigo-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline">Bientôt</Badge>
                    </div>
                    <CardTitle>Mes Documents</CardTitle>
                    <CardDescription>
                      Gérez tous vos documents générés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>CV et lettres</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{photos?.length || 0} photos générées</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/services/cv-ai/photo-gallery')}
                      variant="outline"
                      className="w-full"
                    >
                      Voir Photos
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Les actions les plus populaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => navigate('/services/cv-ai/photo-generator')}
                    className="h-auto py-4 flex-col gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Camera className="h-6 w-6" />
                    <span>Générer Photo Pro</span>
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/services/cv-ai/create-cv')}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span>Créer un CV</span>
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/services/redaction-academique')}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span>Demande Académique</span>
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/voyage')}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <Plane className="h-6 w-6" />
                    <span>Réserver Voyage</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
