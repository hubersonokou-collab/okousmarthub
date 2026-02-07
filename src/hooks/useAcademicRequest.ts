import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NOTIFICATION_MESSAGES } from '@/lib/academicConstants';

// Types
export interface AcademicRequest {
    id: string;
    request_number: string;
    user_id: string | null;
    full_name: string;
    phone: string;
    email: string;
    institution: string;
    field_of_study: string;
    academic_level: 'BT' | 'BTS' | 'LICENCE';
    document_type: 'RAPPORT_BT' | 'RAPPORT_BTS_AVEC_STAGE' | 'RAPPORT_BTS_SANS_STAGE' | 'MEMOIRE_LICENCE';
    has_internship: boolean;
    status: string;
    total_amount: number;
    advance_paid: number;
    balance_due: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateAcademicRequestData {
    full_name: string;
    phone: string;
    email: string;
    institution: string;
    field_of_study: string;
    academic_level: 'BT' | 'BTS' | 'LICENCE';
    document_type: 'RAPPORT_BT' | 'RAPPORT_BTS_AVEC_STAGE' | 'RAPPORT_BTS_SANS_STAGE' | 'MEMOIRE_LICENCE';
    has_internship?: boolean;
    total_amount: number;
    advance_paid: number;
    balance_due: number;
}

export interface AcademicPayment {
    id: string;
    request_id: string;
    amount: number;
    payment_type: 'advance' | 'balance';
    status: 'pending' | 'completed' | 'failed';
    paystack_reference: string | null;
    payment_method: string | null;
    created_at: string;
}

export interface AcademicStatusHistory {
    id: string;
    request_id: string;
    old_status: string | null;
    new_status: string;
    changed_by: string | null;
    notes: string | null;
    created_at: string;
}

// Hook pour créer une demande académique
export const useCreateAcademicRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAcademicRequestData) => {
            const { data: { user } } = await supabase.auth.getUser();

            const requestData = {
                ...data,
                user_id: user?.id || null,
            };

            const { data: result, error } = await supabase
                .from('academic_requests')
                .insert(requestData)
                .select()
                .single();

            if (error) throw error;
            return result as AcademicRequest;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-requests'] });
            toast.success(NOTIFICATION_MESSAGES.REQUEST_SUBMITTED);
        },
        onError: (error) => {
            console.error('Error creating academic request:', error);
            toast.error(NOTIFICATION_MESSAGES.REQUEST_ERROR);
        },
    });
};

// Hook pour récupérer les demandes de l'utilisateur connecté
export const useUserAcademicRequests = () => {
    return useQuery({
        queryKey: ['academic-requests', 'user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('academic_requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as AcademicRequest[];
        },
    });
};

// Hook pour récupérer une demande par son numéro
export const useAcademicRequestByNumber = (requestNumber: string | null) => {
    return useQuery({
        queryKey: ['academic-request', requestNumber],
        queryFn: async () => {
            if (!requestNumber) return null;

            const { data, error } = await supabase
                .from('academic_requests')
                .select('*')
                .eq('request_number', requestNumber)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    toast.error(NOTIFICATION_MESSAGES.REQUEST_NOT_FOUND);
                    return null;
                }
                throw error;
            }

            return data as AcademicRequest;
        },
        enabled: !!requestNumber,
    });
};

// Hook pour récupérer toutes les demandes (admin)
export const useAllAcademicRequests = () => {
    return useQuery({
        queryKey: ['academic-requests', 'all'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('academic_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as AcademicRequest[];
        },
    });
};

// Hook pour mettre à jour le statut d'une demande (admin)
export const useUpdateAcademicRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            requestId,
            newStatus,
            notes
        }: {
            requestId: string;
            newStatus: string;
            notes?: string;
        }) => {
            const updateData: any = { status: newStatus };
            if (notes) updateData.notes = notes;

            const { data, error } = await supabase
                .from('academic_requests')
                .update(updateData)
                .eq('id', requestId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-requests'] });
            toast.success(NOTIFICATION_MESSAGES.STATUS_UPDATED);
        },
        onError: (error) => {
            console.error('Error updating status:', error);
            toast.error('Erreur lors de la mise à jour du statut');
        },
    });
};

// Hook pour récupérer l'historique d'une demande
export const useAcademicStatusHistory = (requestId: string | undefined) => {
    return useQuery({
        queryKey: ['academic-status-history', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('academic_status_history')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as AcademicStatusHistory[];
        },
        enabled: !!requestId,
    });
};

// Hook pour récupérer les paiements d'une demande
export const useAcademicPayments = (requestId: string | undefined) => {
    return useQuery({
        queryKey: ['academic-payments', requestId],
        queryFn: async () => {
            if (!requestId) return [];

            const { data, error } = await supabase
                .from('academic_payments')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as AcademicPayment[];
        },
        enabled: !!requestId,
    });
};

// Hook pour créer un paiement
export const useCreateAcademicPayment = () => {
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
                .from('academic_payments')
                .insert(paymentData)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-payments'] });
            toast.success(NOTIFICATION_MESSAGES.PAYMENT_SUCCESS);
        },
        onError: (error) => {
            console.error('Error creating payment:', error);
            toast.error(NOTIFICATION_MESSAGES.PAYMENT_FAILED);
        },
    });
};
