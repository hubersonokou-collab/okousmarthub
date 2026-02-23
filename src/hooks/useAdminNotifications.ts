import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminNotification {
    id: string;
    type: 'travel' | 'academic' | 'vapvae' | 'order' | 'system';
    title: string;
    message: string;
    is_read: boolean;
    payload: any;
    created_at: string;
}

export const useAdminNotifications = () => {
    return useQuery({
        queryKey: ['admin-notifications'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('admin_notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            return data as AdminNotification[];
        },
    });
};

export const useUnreadNotificationsCount = () => {
    return useQuery({
        queryKey: ['admin-notifications-unread-count'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('admin_notifications')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false);

            if (error) throw error;
            return count || 0;
        },
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
        },
    });
};

export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ is_read: true })
                .eq('is_read', false);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
        },
    });
};
