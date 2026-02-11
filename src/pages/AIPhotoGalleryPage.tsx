import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAIPhotos } from '@/hooks/useAIPhotos';
import { useToast } from '@/hooks/use-toast';
import { PHOTO_STYLES, type PhotoStyle } from '@/types/aiPhoto';
import {
    ArrowLeft, Star, Trash2, Download, Search, Filter,
    Image as ImageIcon, Sparkles, Calendar
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AIPhotoGalleryPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStyle, setFilterStyle] = useState<PhotoStyle | 'all'>('all');
    const [filterFavorite, setFilterFavorite] = useState(false);

    const {
        photos,
        stats,
        isLoading,
        toggleFavorite,
        deletePhoto,
        isDeleting
    } = useAIPhotos({
        style: filterStyle !== 'all' ? filterStyle : undefined,
        isFavorite: filterFavorite || undefined,
    });

    const handleDownload = (photoUrl: string, photoId: string) => {
        // Create download link
        const link = document.createElement('a');
        link.href = photoUrl;
        link.download = `professional-photo-${photoId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Téléchargement démarré',
            description: 'Votre photo est en cours de téléchargement',
        });
    };

    const handleDelete = (photoId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
            deletePhoto(photoId);
        }
    };

    const filteredPhotos = photos.filter(photo =>
        searchTerm === '' ||
        photo.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        format(new Date(photo.created_at), 'PPP', { locale: fr }).includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
            <Header />

            <main className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/services/cv-ai/photo-generator')}
                                className="mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour au générateur
                            </Button>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">
                                        Ma Galerie de Photos
                                    </h1>
                                    <p className="text-gray-600">
                                        Gérez vos photos professionnelles générées par IA
                                    </p>
                                </div>
                                <Button
                                    onClick={() => navigate('/services/cv-ai/photo-generator')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Nouvelle photo
                                </Button>
                            </div>

                            {/* Stats Cards */}
                            {stats && (
                                <div className="grid md:grid-cols-4 gap-4 mb-6">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                                <p className="text-2xl font-bold">{stats.total_generated}</p>
                                                <p className="text-sm text-gray-600">Photos générées</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                                                <p className="text-2xl font-bold">{stats.favorite_count}</p>
                                                <p className="text-sm text-gray-600">Favoris</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                                <p className="text-2xl font-bold">{stats.total_credits_used}</p>
                                                <p className="text-sm text-gray-600">Crédits utilisés</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">
                                                    {stats.most_used_style && PHOTO_STYLES[stats.most_used_style]?.icon}
                                                </div>
                                                <p className="text-sm font-semibold">
                                                    {stats.most_used_style && PHOTO_STYLES[stats.most_used_style]?.name}
                                                </p>
                                                <p className="text-xs text-gray-600">Style préféré</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <select
                                    value={filterStyle}
                                    onChange={(e) => setFilterStyle(e.target.value as PhotoStyle | 'all')}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    <option value="all">Tous les styles</option>
                                    {Object.values(PHOTO_STYLES).map(style => (
                                        <option key={style.id} value={style.id}>
                                            {style.icon} {style.name}
                                        </option>
                                    ))}
                                </select>

                                <Button
                                    variant={filterFavorite ? 'default' : 'outline'}
                                    onClick={() => setFilterFavorite(!filterFavorite)}
                                >
                                    <Star className={`h-4 w-4 mr-2 ${filterFavorite ? 'fill-current' : ''}`} />
                                    Favoris uniquement
                                </Button>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-600">Chargement...</p>
                            </div>
                        ) : filteredPhotos.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold mb-2">Aucune photo</h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchTerm || filterStyle !== 'all' || filterFavorite
                                            ? 'Aucune photo ne correspond à vos filtres'
                                            : 'Vous n\'avez pas encore généré de photo professionnelle'}
                                    </p>
                                    <Button
                                        onClick={() => navigate('/services/cv-ai/photo-generator')}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Générer ma première photo
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPhotos.map((photo) => (
                                    <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img
                                                src={photo.generated_photo_url}
                                                alt={`${photo.style} photo`}
                                                className="w-full h-full object-cover"
                                            />
                                            <Badge className="absolute top-2 left-2">
                                                {PHOTO_STYLES[photo.style].icon} {PHOTO_STYLES[photo.style].name}
                                            </Badge>
                                            {photo.is_favorite && (
                                                <Star className="absolute top-2 right-2 h-6 w-6 text-yellow-500 fill-current drop-shadow-md" />
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                <Calendar className="h-4 w-4" />
                                                {format(new Date(photo.created_at), 'PPP', { locale: fr })}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleFavorite({
                                                        photoId: photo.id,
                                                        isFavorite: !photo.is_favorite
                                                    })}
                                                >
                                                    <Star className={`h-4 w-4 ${photo.is_favorite ? 'fill-current text-yellow-500' : ''}`} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownload(photo.generated_photo_url, photo.id)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate('/services/cv-ai/create-cv', {
                                                        state: { photoId: photo.id }
                                                    })}
                                                    className="col-span-2"
                                                >
                                                    Utiliser dans CV
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(photo.id)}
                                                    disabled={isDeleting}
                                                    className="col-span-2"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
