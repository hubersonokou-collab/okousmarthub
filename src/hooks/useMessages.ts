import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface TravelMessage {
    id: string;
    request_id: string;
    sender_type: 'client' | 'admin';
    sender_id: string | null;
    message: string;
    is_read: boolean;
    read_at: string | null;
    attachment_url: string | null;
    created_at: string;
}

// Hook pour récupérer les messages d'une demande
export const useTravelMessages = (requestId: string | null) => {
    return useQuery({
        queryKey: ['travel-messages', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('travel_messages')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as TravelMessage[];
        },
        enabled: !!requestId,
    });
};

// Hook pour envoyer un message
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            requestId,
            message,
            senderType,
            attachment,
        }: {
            requestId: string;
            message: string;
            senderType: 'client' | 'admin';
            attachment?: File;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            let attachmentUrl = null;

            // Upload attachment if provided
            if (attachment) {
                const fileName = `${requestId}/${Date.now()}_${attachment.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('travel-documents')
                    .upload(fileName, attachment);

                if (uploadError) throw uploadError;
                attachmentUrl = uploadData.path;
            }

            const { data, error } = await supabase
                .from('travel_messages')
                .insert({
                    request_id: requestId,
                    sender_type: senderType,
                    sender_id: user.id,
                    message,
                    attachment_url: attachmentUrl,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['travel-messages', variables.requestId] });
            toast.success('Message envoyé');
        },
        onError: () => {
            toast.error('Erreur lors de l\'envoi du message');
        },
    });
};

// Hook pour marquer un message comme lu
export const useMarkMessageAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messageId: string) => {
            const { error } = await supabase.rpc('mark_message_as_read', {
                message_uuid: messageId,
            });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['travel-messages'] });
        },
    });
};

// Hook pour compter les messages non lus
export const useUnreadMessagesCount = (requestId: string | null) => {
    return useQuery({
        queryKey: ['unread-messages-count', requestId],
        queryFn: async () => {
            if (!requestId) return 0;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return 0;

            const { data, error } = await supabase
                .from('travel_messages')
                .select('id', { count: 'exact' })
                .eq('request_id', requestId)
                .eq('is_read', false)
                .neq('sender_id', user.id);

            if (error) throw error;
            return data?.length || 0;
        },
        enabled: !!requestId,
    });
};
