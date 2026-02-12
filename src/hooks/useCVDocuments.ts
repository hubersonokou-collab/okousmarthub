// Hook for managing CV documents from generated_documents table
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CVDocument {
    id: string;
    user_id: string;
    document_type: 'cv' | 'cover_letter';
    template_id: string | null;
    document_url: string | null;
    file_pdf_url: string | null;
    metadata: any;
    content: any;
    credits_used: number;
    created_at: string;
    updated_at: string;
}

export function useCVDocuments() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch user's CV documents
    const { data: documents, isLoading, error } = useQuery({
        queryKey: ['cv-documents', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('generated_documents')
                .select('*')
                .eq('user_id', user.id)
                .eq('document_type', 'cv')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as CVDocument[];
        },
        enabled: !!user,
    });

    // Delete document
    const deleteMutation = useMutation({
        mutationFn: async (documentId: string) => {
            const { error } = await supabase
                .from('generated_documents')
                .delete()
                .eq('id', documentId)
                .eq('user_id', user?.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cv-documents', user?.id] });
            toast({
                title: 'Document supprimé',
                description: 'Le document a été supprimé avec succès.',
            });
        },
        onError: (error) => {
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer le document.',
                variant: 'destructive',
            });
            console.error('Delete error:', error);
        },
    });

    // Download document
    const downloadDocument = async (documentUrl: string, fileName: string) => {
        try {
            const link = document.createElement('a');
            link.href = documentUrl;
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: 'Téléchargement lancé',
                description: 'Votre CV est en cours de téléchargement.',
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de télécharger le document.',
                variant: 'destructive',
            });
            console.error('Download error:', error);
        }
    };

    return {
        documents: documents || [],
        isLoading,
        error,
        deleteDocument: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        downloadDocument,
    };
}
