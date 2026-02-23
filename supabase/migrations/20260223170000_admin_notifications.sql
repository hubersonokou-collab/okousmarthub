-- Migration: Admin Notifications System
-- Created: 2026-02-23
-- Description: Create a central notification table for administrators and triggers to populate it.

-- =====================================================
-- 1. TABLE: admin_notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'travel', 'academic', 'vapvae', 'order', 'system'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    payload JSONB DEFAULT '{}'::jsonb, -- Store related IDs or data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view and update all notifications
CREATE POLICY "Admins can manage all notifications"
ON public.admin_notifications
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 2. NOTIFICATION FUNCTIONS
-- =====================================================

-- Generic function to create admin notification
CREATE OR REPLACE FUNCTION public.notify_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notif_type TEXT;
    notif_title TEXT;
    notif_message TEXT;
    notif_payload JSONB;
BEGIN
    -- Determine type based on table name
    IF TG_TABLE_NAME = 'travel_requests' THEN
        notif_type := 'travel';
        notif_title := 'Nouveau Dossier Voyage';
        notif_message := NEW.full_name || ' a soumis une demande d''assistance voyage.';
        notif_payload := jsonb_build_object('id', NEW.id, 'request_number', NEW.request_number);
    ELSIF TG_TABLE_NAME = 'academic_requests' THEN
        notif_type := 'academic';
        notif_title := 'Nouvelle Demande Académique';
        notif_message := NEW.full_name || ' a soumis une demande de rédaction académique.';
        notif_payload := jsonb_build_object('id', NEW.id, 'request_number', NEW.request_number);
    ELSIF TG_TABLE_NAME = 'vap_vae_requests' THEN
        notif_type := 'vapvae';
        notif_title := 'Nouvelle Demande VAP/VAE';
        notif_message := NEW.full_name || ' a soumis une demande VAP/VAE.';
        notif_payload := jsonb_build_object('id', NEW.id, 'service_type', NEW.service_type);
    ELSIF TG_TABLE_NAME = 'orders' THEN
        notif_type := 'order';
        notif_title := 'Nouvelle Commande Service';
        notif_message := 'Une nouvelle commande de ' || NEW.total_amount || ' FCFA a été reçue.';
        notif_payload := jsonb_build_object('id', NEW.id, 'customer_email', NEW.customer_email);
    END IF;

    -- Insert notification
    IF notif_type IS NOT NULL THEN
        INSERT INTO public.admin_notifications (type, title, message, payload)
        VALUES (notif_type, notif_title, notif_message, notif_payload);
    END IF;

    RETURN NEW;
END;
$$;

-- =====================================================
-- 3. TRIGGERS
-- =====================================================

-- Trigger for Travel
DROP TRIGGER IF EXISTS tr_notify_admin_travel ON public.travel_requests;
CREATE TRIGGER tr_notify_admin_travel
AFTER INSERT ON public.travel_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_admin();

-- Trigger for Academic
DROP TRIGGER IF EXISTS tr_notify_admin_academic ON public.academic_requests;
CREATE TRIGGER tr_notify_admin_academic
AFTER INSERT ON public.academic_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_admin();

-- Trigger for VAP/VAE
DROP TRIGGER IF EXISTS tr_notify_admin_vap_vae ON public.vap_vae_requests;
CREATE TRIGGER tr_notify_admin_vap_vae
AFTER INSERT ON public.vap_vae_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_admin();

-- Trigger for Orders (Web Solutions, etc.)
DROP TRIGGER IF EXISTS tr_notify_admin_orders ON public.orders;
CREATE TRIGGER tr_notify_admin_orders
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_admin();
