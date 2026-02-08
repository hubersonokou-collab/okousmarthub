import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface TravelNotification {
    id: string;
    user_id: string;
    request_id: string | null;
    type: 'document_missing' | 'payment_due' | 'status_update' | 'message_received' | 'deadline_approaching';
    title: string;
    message: string;
    is_read: boolean;
    read_at: string | null;
    action_url: string | null;
    created_at: string;
}

// Hook pour récupérer les notifications de l'utilisateur
export const useUserNotifications = () => {
    return useQuery({
        queryKey: ['user-notifications'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('travel_notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            return data as TravelNotification[];
        },
    });
};

// Hook pour les notifications non lues
export const useUnreadNotifications = () => {
    return useQuery({
        queryKey: ['unread-notifications'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('travel_notifications')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_read', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as TravelNotification[];
        },
    });
};

// Hook pour marquer une notification comme lue
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId: string) => {
            const { error } = await supabase.rpc('mark_notification_as_read', {
                notification_uuid: notificationId,
            });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
        },
    });
};

// Hook pour marquer toutes comme lues
export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('travel_notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
            toast.success('Toutes les notifications marquées comme lues');
        },
    });
};

// Hook pour créer une notification manuelle (admin)
export const useCreateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            requestId,
            type,
            title,
            message,
            actionUrl,
        }: {
            userId: string;
            requestId?: string;
            type: TravelNotification['type'];
            title: string;
            message: string;
            actionUrl?: string;
        }) => {
            const { data, error } = await supabase
                .from('travel_notifications')
                .insert({
                    user_id: userId,
                    request_id: requestId || null,
                    type,
                    title,
                    message,
                    action_url: actionUrl || null,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
            toast.success('Notification créée');
        },
    });
};
