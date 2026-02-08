import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface TravelRequest {
    id: string;
    request_number: string;
    user_id: string | null;
    program_type: 'general' | 'decreto_flussi';
    full_name: string;
    phone: string;
    email: string;
    date_of_birth: string | null;
    nationality: string | null;
    current_occupation: string | null;
    status: string;
    total_amount: number;
    amount_paid: number;
    balance_due: number;
    notes: string | null;
    admin_comments: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateTravelRequestData {
    program_type: 'general' | 'decreto_flussi';
    project_type?: 'studies' | 'work' | 'tourism' | 'family_reunion';
    full_name: string;
    phone: string;
    email: string;
    date_of_birth?: string;
    nationality?: string;
    passport_number?: string;
    passport_issue_date?: string;
    passport_expiry_date?: string;
    destination_country?: string;
    current_situation?: 'student' | 'employee' | 'unemployed' | 'entrepreneur';
    current_occupation?: string;
    total_amount?: number;
    amount_paid?: number;
    balance_due?: number;
}

export interface TravelPayment {
    id: string;
    request_id: string;
    payment_stage: 'stage_1' | 'stage_2' | 'stage_3';
    amount: number;
    status: string;
    paystack_reference: string | null;
    payment_method: string | null;
    paid_at: string | null;
    created_at: string;
}

export interface TravelStatusHistory {
    id: string;
    request_id: string;
    old_status: string | null;
    new_status: string;
    changed_by: string | null;
    notes: string | null;
    created_at: string;
}

// Hook pour créer une demande de voyage
export const useCreateTravelRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateTravelRequestData) => {
            const { data: { user } } = await supabase.auth.getUser();

            const requestData = {
                ...data,
                user_id: user?.id || null,
                total_amount: data.total_amount || (data.program_type === 'decreto_flussi' ? 1500000 : 0),
                amount_paid: data.amount_paid || 0,
                balance_due: data.balance_due || (data.program_type === 'decreto_flussi' ? 1500000 : 0),
            };

            const { data: result, error } = await supabase
                .from('travel_requests')
                .insert(requestData)
                .select()
                .single();

            if (error) throw error;
            return result as TravelRequest;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['travel-requests'] });
            toast.success('Demande créée avec succès !', {
                description: 'Vous allez recevoir un email avec votre numéro de dossier.',
            });
        },
        onError: (error) => {
            console.error('Error creating travel request:', error);
            toast.error('Erreur lors de la création de la demande', {
                description: 'Veuillez réessayer ou nous contacter.',
            });
        },
    });
};

// Hook pour récupérer les demandes de l'utilisateur connecté
export const useUserTravelRequests = () => {
    return useQuery({
        queryKey: ['travel-requests', 'user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('travel_requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as TravelRequest[];
        },
    });
};

// Hook pour rechercher une demande par numéro (public)
export const useTravelRequestByNumber = (requestNumber: string | null) => {
    return useQuery({
        queryKey: ['travel-request', requestNumber],
        queryFn: async () => {
            if (!requestNumber) return null;

            const { data, error } = await supabase
                .from('travel_requests')
                .select('*')
                .eq('request_number', requestNumber)
                .single();

            if (error) throw error;
            return data as TravelRequest;
        },
        enabled: !!requestNumber,
    });
};

// Hook pour récupérer toutes les demandes (admin)
export const useAllTravelRequests = () => {
    return useQuery({
        queryKey: ['travel-requests', 'all'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('travel_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as TravelRequest[];
        },
    });
};

// Hook pour mettre à jour le statut (admin)
export const useUpdateTravelRequestStatus = () => {
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
                .from('travel_requests')
                .update({ status: newStatus, admin_comments: notes })
                .eq('id', requestId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['travel-requests'] });
            toast.success('Statut mis à jour avec succès');
        },
        onError: (error) => {
            console.error('Error updating status:', error);
            toast.error('Erreur lors de la mise à jour du statut');
        },
    });
};

// Hook pour récupérer l'historique de statut
export const useTravelStatusHistory = (requestId: string | null) => {
    return useQuery({
        queryKey: ['travel-status-history', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('travel_status_history')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as TravelStatusHistory[];
        },
        enabled: !!requestId,
    });
};

// Hook pour récupérer les paiements
export const useTravelPayments = (requestId: string | null) => {
    return useQuery({
        queryKey: ['travel-payments', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('travel_payments')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as TravelPayment[];
        },
        enabled: !!requestId,
    });
};

// Hook pour créer un paiement
export const useCreateTravelPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (paymentData: {
            request_id: string;
            payment_stage: 'stage_1' | 'stage_2' | 'stage_3';
            amount: number;
            paystack_reference?: string;
            payment_method?: string;
        }) => {
            const { data, error } = await supabase
                .from('travel_payments')
                .insert({
                    ...paymentData,
                    status: 'completed',
                    paid_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return data as TravelPayment;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['travel-payments'] });
            queryClient.invalidateQueries({ queryKey: ['travel-requests'] });
            toast.success('Paiement enregistré avec succès !');
        },
        onError: (error) => {
            console.error('Error creating payment:', error);
            toast.error('Erreur lors du paiement');
        },
    });
};
