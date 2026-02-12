import { useState } from 'react';
import { useCVDocuments } from '@/hooks/useCVDocuments';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Download, Trash2, Calendar, Grid3x3, List } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function CVDocumentsPage() {
    const { documents, isLoading, deleteDocument, isDeleting, downloadDocument } = useCVDocuments();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Chargement de vos documents...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Mes Documents Générés</h1>
                                <p className="text-gray-600 mt-1">
                                    Gérez tous vos CV et lettres générés en un seul endroit
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>{documents.length} document{documents.length > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Empty State */}
                    {documents.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucun document généré
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Commencez par créer votre premier CV professionnel
                                </p>
                                <Button onClick={() => window.location.href = '/services/cv-ai/create-cv'}>
                                    Créer un CV
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Grid View */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {documents.map((doc) => (
                                        <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <FileText className="w-10 h-10 text-blue-600" />
                                                    <Badge variant="secondary">
                                                        {doc.document_type === 'cv' ? 'CV' : 'Lettre'}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg mt-3 line-clamp-2">
                                                    {doc.metadata?.title || `CV ${doc.metadata?.lastName || ''}`}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(doc.created_at), {
                                                        addSuffix: true,
                                                        locale: fr,
                                                    })}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            downloadDocument(
                                                                doc.file_pdf_url || doc.document_url || '',
                                                                `CV_${doc.metadata?.lastName || 'Document'}.pdf`
                                                            )
                                                        }
                                                        disabled={!doc.file_pdf_url && !doc.document_url}
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Télécharger
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                disabled={isDeleting}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Cette action est irréversible. Le document sera définitivement supprimé.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteDocument(doc.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                                    <span>{doc.credits_used} crédit{doc.credits_used > 1 ? 's' : ''}</span>
                                                    {doc.metadata?.template && (
                                                        <span className="text-blue-600">{doc.metadata.template}</span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* List View */}
                            {viewMode === 'list' && (
                                <Card>
                                    <div className="divide-y">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />

                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {doc.metadata?.title || `CV ${doc.metadata?.lastName || ''}`}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {doc.document_type === 'cv' ? 'CV' : 'Lettre'}
                                                            </Badge>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDistanceToNow(new Date(doc.created_at), {
                                                                    addSuffix: true,
                                                                    locale: fr,
                                                                })}
                                                            </span>
                                                            <span>{doc.credits_used} crédit{doc.credits_used > 1 ? 's' : ''}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                downloadDocument(
                                                                    doc.file_pdf_url || doc.document_url || '',
                                                                    `CV_${doc.metadata?.lastName || 'Document'}.pdf`
                                                                )
                                                            }
                                                            disabled={!doc.file_pdf_url && !doc.document_url}
                                                        >
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Télécharger
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    disabled={isDeleting}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Cette action est irréversible. Le document sera définitivement supprimé.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => deleteDocument(doc.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Supprimer
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
