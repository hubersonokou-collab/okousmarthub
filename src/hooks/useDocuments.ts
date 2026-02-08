import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface DocumentUpload {
    file: File;
    documentType: string;
    requestId: string;
}

// Hook pour uploader un document
export const useUploadDocument = () => {
    return useMutation({
        mutationFn: async ({ file, documentType, requestId }: DocumentUpload) => {
            // Générer le chemin du fichier
            const timestamp = Date.now();
            const fileName = `${requestId}/${documentType}/${timestamp}_${file.name}`;

            // Upload vers Supabase Storage
            const { data, error } = await supabase.storage
                .from('travel-documents')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) throw error;

            // Enregistrer la référence dans la table documents
            const { data: docData, error: docError } = await supabase
                .from('travel_documents')
                .insert({
                    request_id: requestId,
                    document_type: documentType,
                    file_name: file.name,
                    file_path: data.path,
                    file_size: file.size,
                })
                .select()
                .single();

            if (docError) throw docError;

            return { storageData: data, documentData: docData };
        },
        onSuccess: () => {
            toast.success('Document téléversé avec succès');
        },
        onError: (error) => {
            console.error('Upload error:', error);
            toast.error('Erreur lors du téléversement du document');
        },
    });
};

// Hook pour télécharger/visualiser un document
export const useGetDocumentUrl = () => {
    return useMutation({
        mutationFn: async (filePath: string) => {
            const { data, error } = await supabase.storage
                .from('travel-documents')
                .createSignedUrl(filePath, 3600); // URL valide 1h

            if (error) throw error;
            return data.signedUrl;
        },
        onError: () => {
            toast.error('Erreur lors de la récupération du document');
        },
    });
};

// Hook pour supprimer un document
export const useDeleteDocument = () => {
    return useMutation({
        mutationFn: async ({ documentId, filePath }: { documentId: string; filePath: string }) => {
            // Supprimer du storage
            const { error: storageError } = await supabase.storage
                .from('travel-documents')
                .remove([filePath]);

            if (storageError) throw storageError;

            // Supprimer de la table
            const { error: dbError } = await supabase
                .from('travel_documents')
                .delete()
                .eq('id', documentId);

            if (dbError) throw dbError;
        },
        onSuccess: () => {
            toast.success('Document supprimé');
        },
        onError: () => {
            toast.error('Erreur lors de la suppression');
        },
    });
};

// Validation fichier
export const validateFile = (file: File, maxSizeMB: number, acceptedFormats: string[]): { valid: boolean; error?: string } => {
    // Vérifier la taille
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
        return {
            valid: false,
            error: `Le fichier est trop volumineux (${fileSizeMB.toFixed(2)} MB). Taille maximum: ${maxSizeMB} MB`,
        };
    }

    // Vérifier le format
    const extension = file.name.split('.').pop()?.toUpperCase();
    if (!extension || !acceptedFormats.map(f => f.toUpperCase()).includes(extension)) {
        return {
            valid: false,
            error: `Format non accepté. Formats acceptés: ${acceptedFormats.join(', ')}`,
        };
    }

    return { valid: true };
};
