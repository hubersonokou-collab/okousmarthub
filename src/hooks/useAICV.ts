// useCredits Hook - Manage user credits
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserCredits, CreditTransaction, CreditPack } from '@/types/aiCVService';
import { useToast } from '@/hooks/use-toast';

export function useCredits() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
    }, []);

    // Fetch user credits
    const { data: userCredits, isLoading: isLoadingCredits, error: creditsError } = useQuery({
        queryKey: ['user-credits', userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from('user_credits')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
                throw error;
            }

            // If no record exists, create one
            if (!data) {
                const { data: newData, error: insertError } = await supabase
                    .from('user_credits')
                    .insert({ user_id: userId, credits_balance: 0 })
                    .select()
                    .single();

                if (insertError) throw insertError;
                return newData as UserCredits;
            }

            return data as UserCredits;
        },
        enabled: !!userId,
    });

    // Fetch credit packs
    const { data: creditPacks, isLoading: isLoadingPacks } = useQuery({
        queryKey: ['credit-packs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('credit_packs')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            return data as CreditPack[];
        },
    });

    // Fetch credit transactions
    const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['credit-transactions', userId],
        queryFn: async () => {
            if (!userId) return [];

            const { data, error } = await supabase
                .from('credit_transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            return data as CreditTransaction[];
        },
        enabled: !!userId,
    });

    // Check if user has enough credits
    const hasEnoughCredits = (required: number): boolean => {
        return (userCredits?.credits_balance || 0) >= required;
    };

    // Refresh credits after purchase
    const refreshCredits = () => {
        queryClient.invalidateQueries({ queryKey: ['user-credits', userId] });
        queryClient.invalidateQueries({ queryKey: ['credit-transactions', userId] });
    };

    return {
        userCredits,
        creditPacks,
        transactions,
        isLoading: isLoadingCredits || isLoadingPacks,
        isLoadingTransactions,
        hasEnoughCredits,
        refreshCredits,
        creditsBalance: userCredits?.credits_balance || 0,
    };
}

// useDocuments Hook - Manage generated documents
export function useDocuments() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
    }, []);

    // Fetch user documents
    const { data: documents, isLoading, error } = useQuery({
        queryKey: ['generated-documents', userId],
        queryFn: async () => {
            if (!userId) return [];

            const { data, error } = await supabase
                .from('generated_documents')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });

    // Toggle favorite mutation
    const toggleFavorite = useMutation({
        mutationFn: async ({ documentId, isFavorite }: { documentId: string; isFavorite: boolean }) => {
            const { error } = await supabase
                .from('generated_documents')
                .update({ is_favorite: isFavorite })
                .eq('id', documentId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generated-documents', userId] });
            toast({
                title: 'Succès',
                description: 'Document mis à jour',
            });
        },
        onError: () => {
            toast({
                title: 'Erreur',
                description: 'Impossible de mettre à jour le document',
                variant: 'destructive',
            });
        },
    });

    // Delete document mutation
    const deleteDocument = useMutation({
        mutationFn: async (documentId: string) => {
            const { error } = await supabase
                .from('generated_documents')
                .delete()
                .eq('id', documentId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generated-documents', userId] });
            toast({
                title: 'Succès',
                description: 'Document supprimé',
            });
        },
        onError: () => {
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer le document',
                variant: 'destructive',
            });
        },
    });

    // Filter documents
    const cvDocuments = documents?.filter(doc => doc.document_type === 'cv') || [];
    const letterDocuments = documents?.filter(doc => doc.document_type === 'cover_letter') || [];
    const favoriteDocuments = documents?.filter(doc => doc.is_favorite) || [];

    return {
        documents: documents || [],
        cvDocuments,
        letterDocuments,
        favoriteDocuments,
        isLoading,
        error,
        toggleFavorite: toggleFavorite.mutate,
        deleteDocument: deleteDocument.mutate,
    };
}

// useTemplates Hook - Fetch CV templates
export function useTemplates(country?: string) {
    const { data: templates, isLoading } = useQuery({
        queryKey: ['cv-templates', country],
        queryFn: async () => {
            let query = supabase
                .from('cv_templates')
                .select('*')
                .eq('is_active', true);

            if (country) {
                query = query.eq('country', country);
            }

            const { data, error } = await query.order('name');

            if (error) throw error;
            return data;
        },
    });

    return {
        templates: templates || [],
        isLoading,
    };
}
