// useAIPhotos Hook - Manage AI-generated professional photos
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AIPhoto, PhotoStats, PhotoGalleryFilter } from '@/types/aiPhoto';
import { useToast } from '@/hooks/use-toast';

export function useAIPhotos(filter?: PhotoGalleryFilter) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
    }, []);

    // Fetch user's AI photos
    const { data: photos, isLoading, error } = useQuery({
        queryKey: ['ai-photos', userId, filter],
        queryFn: async () => {
            if (!userId) return [];

            let query = supabase
                .from('ai_photos')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            // Apply filters
            if (filter?.style) {
                query = query.eq('style', filter.style);
            }
            if (filter?.isFavorite !== undefined) {
                query = query.eq('is_favorite', filter.isFavorite);
            }
            if (filter?.dateFrom) {
                query = query.gte('created_at', filter.dateFrom);
            }
            if (filter?.dateTo) {
                query = query.lte('created_at', filter.dateTo);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data as AIPhoto[];
        },
        enabled: !!userId,
    });

    // Fetch photo stats
    const { data: stats } = useQuery({
        queryKey: ['ai-photos-stats', userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await supabase
                .rpc('get_photo_generation_stats', { p_user_id: userId });

            if (error) throw error;
            return data[0] as PhotoStats;
        },
        enabled: !!userId,
    });

    // Toggle favorite mutation
    const toggleFavorite = useMutation({
        mutationFn: async ({ photoId, isFavorite }: { photoId: string; isFavorite: boolean }) => {
            const { error } = await supabase
                .from('ai_photos')
                .update({ is_favorite: isFavorite })
                .eq('id', photoId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-photos', userId] });
            queryClient.invalidateQueries({ queryKey: ['ai-photos-stats', userId] });
            toast({
                title: 'Succès',
                description: 'Photo mise à jour',
            });
        },
        onError: () => {
            toast({
                title: 'Erreur',
                description: 'Impossible de mettre à jour la photo',
                variant: 'destructive',
            });
        },
    });

    // Delete photo mutation
    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            // Get photo details first to delete from storage
            const { data: photo } = await supabase
                .from('ai_photos')
                .select('original_photo_url, generated_photo_url, thumbnail_url')
                .eq('id', photoId)
                .single();

            if (photo) {
                // Delete files from storage
                const filesToDelete = [
                    photo.original_photo_url,
                    photo.generated_photo_url,
                    photo.thumbnail_url,
                ].filter(Boolean);

                for (const fileUrl of filesToDelete) {
                    if (fileUrl) {
                        const path = fileUrl.split('/profile-photos/')[1];
                        if (path) {
                            await supabase.storage
                                .from('profile-photos')
                                .remove([path]);
                        }
                    }
                }
            }

            // Delete database record
            const { error } = await supabase
                .from('ai_photos')
                .delete()
                .eq('id', photoId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-photos', userId] });
            queryClient.invalidateQueries({ queryKey: ['ai-photos-stats', userId] });
            toast({
                title: 'Succès',
                description: 'Photo supprimée',
            });
        },
        onError: () => {
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer la photo',
                variant: 'destructive',
            });
        },
    });

    // Filter helpers
    const favoritePhotos = photos?.filter(p => p.is_favorite) || [];
    const photosByStyle = (style: string) => photos?.filter(p => p.style === style) || [];

    return {
        photos: photos || [],
        favoritePhotos,
        photosByStyle,
        stats,
        isLoading,
        error,
        toggleFavorite: toggleFavorite.mutate,
        deletePhoto: deletePhoto.mutate,
        isDeleting: deletePhoto.isPending,
    };
}

// Hook for single photo details
export function useAIPhoto(photoId: string | null) {
    const { data: photo, isLoading } = useQuery({
        queryKey: ['ai-photo', photoId],
        queryFn: async () => {
            if (!photoId) return null;

            const { data, error } = await supabase
                .from('ai_photos')
                .select('*')
                .eq('id', photoId)
                .single();

            if (error) throw error;
            return data as AIPhoto;
        },
        enabled: !!photoId,
    });

    return {
        photo,
        isLoading,
    };
}
