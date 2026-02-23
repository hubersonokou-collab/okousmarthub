import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GlobalStats {
    totalRevenue: number;
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    revenueDistribution: {
        travel: number;
        academic: number;
        web: number;
    };
    counts: {
        travel: number;
        academic: number;
        vapvae: number;
        web: number;
    };
}

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin-global-stats'],
        queryFn: async () => {
            // Fetch everything in parallel
            const [
                { data: orders },
                { data: travel },
                { data: academic },
                { data: vapvae }
            ] = await Promise.all([
                supabase.from('orders').select('status, total_amount'),
                supabase.from('travel_requests').select('status, total_amount, amount_paid'),
                supabase.from('academic_requests').select('status, total_amount, advance_paid'),
                supabase.from('vap_vae_requests').select('status')
            ]);

            // Calculate Revenue
            const travelRev = travel?.reduce((sum, r) => sum + (Number(r.amount_paid) || 0), 0) || 0;
            const academicRev = academic?.reduce((sum, r) => sum + (Number(r.advance_paid) || 0), 0) || 0;
            const webRev = orders?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0;

            const totalRevenue = travelRev + academicRev + webRev;

            // Calculate Counts
            const travelCount = travel?.length || 0;
            const academicCount = academic?.length || 0;
            const vapvaeCount = vapvae?.length || 0;
            const webCount = orders?.length || 0;

            const totalRequests = travelCount + academicCount + vapvaeCount + webCount;

            // Calculate Pending
            const pending =
                (travel?.filter(r => r.status === 'registration' || r.status === 'documents_pending').length || 0) +
                (academic?.filter(r => r.status === 'pending').length || 0) +
                (vapvae?.filter(r => r.status === 'pending').length || 0) +
                (orders?.filter(o => o.status === 'pending').length || 0);

            // Calculate Completed
            const completed =
                (travel?.filter(r => r.status === 'completed').length || 0) +
                (academic?.filter(r => r.status === 'completed').length || 0) +
                (vapvae?.filter(r => r.status === 'validated').length || 0) +
                (orders?.filter(o => o.status === 'completed').length || 0);

            return {
                totalRevenue,
                totalRequests,
                pendingRequests: pending,
                completedRequests: completed,
                revenueDistribution: {
                    travel: travelRev,
                    academic: academicRev,
                    web: webRev
                },
                counts: {
                    travel: travelCount,
                    academic: academicCount,
                    vapvae: vapvaeCount,
                    web: webCount
                }
            } as GlobalStats;
        }
    });
};
