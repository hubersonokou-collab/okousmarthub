import { useState } from "react";
import { Bell, Check, Info, Plane, GraduationCap, FileText, ShoppingCart } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuHeader,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminNotifications, useUnreadNotificationsCount, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useAdminNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function NotificationBell() {
    const navigate = useNavigate();
    const { data: notifications = [] } = useAdminNotifications();
    const { data: unreadCount = 0 } = useUnreadNotificationsCount();
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const getIcon = (type: string) => {
        switch (type) {
            case 'travel': return <Plane className="h-4 w-4 text-blue-500" />;
            case 'academic': return <GraduationCap className="h-4 w-4 text-purple-500" />;
            case 'vapvae': return <FileText className="h-4 w-4 text-orange-500" />;
            case 'order': return <ShoppingCart className="h-4 w-4 text-green-500" />;
            default: return <Info className="h-4 w-4 text-slate-500" />;
        }
    };

    const getRoute = (notif: any) => {
        switch (notif.type) {
            case 'travel': return '/admin/analytics'; // or specific travel page if exists
            case 'academic': return '/admin/academic';
            case 'vapvae': return '/admin/vap-vae';
            case 'order': return '/admin/orders';
            default: return '/admin';
        }
    };

    const handleNotificationClick = (notif: any) => {
        if (!notif.is_read) {
            markRead.mutate(notif.id);
        }
        navigate(getRoute(notif));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-none">
                <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-slate-300 hover:text-white h-8 hover:bg-white/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAllRead.mutate();
                                }}
                            >
                                Tout marquer lu
                            </Button>
                        )}
                    </div>
                </div>
                <ScrollArea className="h-[400px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notif) => (
                                <DropdownMenuItem
                                    key={notif.id}
                                    className={`p-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 flex gap-3 items-start ${!notif.is_read ? 'bg-slate-50/50 dark:bg-slate-900/50' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${!notif.is_read ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/50'
                                        }`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={`text-sm leading-none ${!notif.is_read ? 'font-bold' : 'font-medium'}`}>
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70">
                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                                        </p>
                                    </div>
                                    {!notif.is_read && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Aucune notification</p>
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="ghost" className="w-full text-xs font-medium" onClick={() => navigate('/admin')}>
                        Voir tout le dashboard
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
