import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Zap, TrendingUp, FileText, Image, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CreditUsage {
    user_id: string;
    user_email: string;
    total_credits_used: number;
    cv_generations: number;
    letter_generations: number;
    photo_generations: number;
    last_activity: string;
}

export function CVAIStatsManager() {
    // Fetch credit usage statistics
    const { data: creditStats, isLoading: loadingStats } = useQuery({
        queryKey: ["admin-cv-ai-stats"],
        queryFn: async () => {
            // This is a simplified query - you may need to adjust based on your actual schema
            const { data, error } = await supabase
                .from("user_credits")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    // Fetch recent AI activity
    const { data: recentActivity, isLoading: loadingActivity } = useQuery({
        queryKey: ["admin-cv-ai-activity"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("ai_usage_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(20);

            if (error) {
                console.error("Error fetching activity:", error);
                return [];
            }
            return data;
        },
    });

    // Calculate summary statistics
    const totalCreditsUsed = creditStats?.reduce((sum, user) => sum + (user.credits_used || 0), 0) || 0;
    const activeUsers = creditStats?.filter(user => user.credits_used > 0).length || 0;
    const totalUsers = creditStats?.length || 0;

    const stats = [
        {
            title: "Utilisateurs Actifs",
            value: activeUsers,
            description: `Sur ${totalUsers} utilisateurs`,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Crédits Consommés",
            value: totalCreditsUsed,
            description: "Total depuis le début",
            icon: Zap,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            title: "Générations CV",
            value: recentActivity?.filter(a => a.action_type === "cv_generation").length || 0,
            description: "Ce mois-ci",
            icon: FileText,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Lettres de Motivation",
            value: recentActivity?.filter(a => a.action_type === "letter_generation").length || 0,
            description: "Ce mois-ci",
            icon: Mail,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground">Service CV/IA - Statistiques</h2>
                <p className="text-sm text-muted-foreground">
                    Suivez l'utilisation des crédits IA et les générations
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Top Users by Credit Usage */}
            <Card>
                <CardHeader>
                    <CardTitle>Utilisateurs - Consommation de Crédits</CardTitle>
                    <CardDescription>Top utilisateurs par crédits consommés</CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingStats ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-muted rounded" />
                            ))}
                        </div>
                    ) : creditStats && creditStats.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Utilisateur</TableHead>
                                    <TableHead>Crédits Utilisés</TableHead>
                                    <TableHead>Crédits Restants</TableHead>
                                    <TableHead>Dernière Activité</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {creditStats.slice(0, 10).map((user) => (
                                    <TableRow key={user.user_id}>
                                        <TableCell className="font-medium">
                                            {user.user_email || user.user_id.substring(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                {user.credits_used || 0} crédits
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {user.credits_remaining || 0} crédits
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune donnée disponible</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Activité Récente</CardTitle>
                    <CardDescription>Dernières générations IA</CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingActivity ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-muted rounded" />
                            ))}
                        </div>
                    ) : recentActivity && recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {activity.action_type === "cv_generation" && (
                                            <FileText className="h-4 w-4 text-green-600" />
                                        )}
                                        {activity.action_type === "letter_generation" && (
                                            <Mail className="h-4 w-4 text-purple-600" />
                                        )}
                                        {activity.action_type === "photo_generation" && (
                                            <Image className="h-4 w-4 text-blue-600" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium">
                                                {activity.action_type === "cv_generation" && "Génération CV"}
                                                {activity.action_type === "letter_generation" && "Lettre de motivation"}
                                                {activity.action_type === "photo_generation" && "Photo professionnelle"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.user_email || "Utilisateur anonyme"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </p>
                                        <Badge variant="outline" className="text-xs">
                                            {activity.credits_used || 1} crédit
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune activité récente</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
