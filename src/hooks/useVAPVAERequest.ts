import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NOTIFICATION_MESSAGES } from '@/lib/vapvaeConstants';

// Types
export interface VAPVAERequest {
    id: string;
    request_number: string;
    user_id: string | null;
    full_name: string;
    phone: string;
    email: string;
    current_profession: string;
    years_of_experience: number;
    desired_field: string;
    level: 'DUT' | 'LICENCE' | 'MASTER';
    support_type: 'standard' | 'priority' | 'personalized';
    status: string;
    total_amount: number;
    advance_paid: number;
    balance_due: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateVAPVAERequestData {
    full_name: string;
    phone: string;
    email: string;
    current_profession: string;
    years_of_experience: number;
    desired_field: string;
    level: 'DUT' | 'LICENCE' | 'MASTER';
    support_type: 'standard' | 'priority' | 'personalized';
    total_amount: number;
    advance_paid: number;
    balance_due: number;
}

export interface VAPVAEPayment {
    id: string;
    request_id: string;
    amount: number;
    payment_type: 'advance' | 'balance';
    status: string;
    paystack_reference: string | null;
    payment_method: string | null;
    created_at: string;
}

export interface VAPVAEStatusHistory {
    id: string;
    request_id: string;
    old_status: string | null;
    new_status: string;
    changed_by: string | null;
    notes: string | null;
    created_at: string;
}

// Hook pour créer une demande VAP/VAE
export const useCreateVAPVAERequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateVAPVAERequestData) => {
            const { data: { user } } = await supabase.auth.getUser();

            const requestData = {
                ...data,
                user_id: user?.id || null,
            };

            const { data: result, error } = await supabase
                .from('vap_vae_requests')
                .insert(requestData)
                .select()
                .single();

            if (error) throw error;
            return result as VAPVAERequest;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vap-vae-requests'] });
            toast.success(NOTIFICATION_MESSAGES.REQUEST_SUBMITTED, {
                description: NOTIFICATION_MESSAGES.REQUEST_SUBMITTED_DESC,
            });
        },
        onError: (error) => {
            console.error('Error creating VAP/VAE request:', error);
            toast.error('Erreur lors de la création de la demande', {
                description: 'Veuillez réessayer ou nous contacter.',
            });
        },
    });
};

// Hook pour récupérer les demandes de l'utilisateur connecté
export const useUserVAPVAERequests = () => {
    return useQuery({
        queryKey: ['vap-vae-requests', 'user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('vap_vae_requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as VAPVAERequest[];
        },
    });
};

// Hook pour rechercher une demande par numéro (public)
export const useVAPVAERequestByNumber = (requestNumber: string | null) => {
    return useQuery({
        queryKey: ['vap-vae-request', requestNumber],
        queryFn: async () => {
            if (!requestNumber) return null;

            const { data, error } = await supabase
                .from('vap_vae_requests')
                .select('*')
                .eq('request_number', requestNumber)
                .single();

            if (error) throw error;
            return data as VAPVAERequest;
        },
        enabled: !!requestNumber,
    });
};

// Hook pour récupérer toutes les demandes (admin)
export const useAllVAPVAERequests = () => {
    return useQuery({
        queryKey: ['vap-vae-requests', 'all'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('vap_vae_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as VAPVAERequest[];
        },
    });
};

// Hook pour mettre à jour le statut (admin)
export const useUpdateVAPVAERequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            requestId,
            newStatus,
            notes,
        }: {
            requestId: string;
            newStatus: string;
            notes?: string;
        }) => {
            const { data, error } = await supabase
                .from('vap_vae_requests')
                .update({ status: newStatus, notes })
                .eq('id', requestId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vap-vae-requests'] });
            toast.success(NOTIFICATION_MESSAGES.STATUS_UPDATED);
        },
        onError: (error) => {
            console.error('Error updating status:', error);
            toast.error('Erreur lors de la mise à jour du statut');
        },
    });
};

// Hook pour récupérer l'historique de statut
export const useVAPVAEStatusHistory = (requestId: string | null) => {
    return useQuery({
        queryKey: ['vap-vae-status-history', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('vap_vae_status_history')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as VAPVAEStatusHistory[];
        },
        enabled: !!requestId,
    });
};

// Hook pour récupérer les paiements
export const useVAPVAEPayments = (requestId: string | null) => {
    return useQuery({
        queryKey: ['vap-vae-payments', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('vap_vae_payments')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as VAPVAEPayment[];
        },
        enabled: !!requestId,
    });
};

// Hook pour créer un paiement
export const useCreateVAPVAEPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (paymentData: {
            request_id: string;
            amount: number;
            payment_type: 'advance' | 'balance';
            paystack_reference?: string;
            payment_method?: string;
        }) => {
            const { data, error } = await supabase
                .from('vap_vae_payments')
                .insert({
                    ...paymentData,
                    status: 'completed',
                })
                .select()
                .single();

            if (error) throw error;
            return data as VAPVAEPayment;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vap-vae-payments'] });
            queryClient.invalidateQueries({ queryKey: ['vap-vae-requests'] });
            toast.success(NOTIFICATION_MESSAGES.PAYMENT_SUCCESS);
        },
        onError: (error) => {
            console.error('Error creating payment:', error);
            toast.error(NOTIFICATION_MESSAGES.PAYMENT_FAILED);
        },
    });
};
