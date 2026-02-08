-- =============================================
-- SCRIPT DE VÉRIFICATION POST-MIGRATION
-- Exécuter après avoir appliqué la migration
-- =============================================

-- 1. Vérifier que les nouvelles tables existent
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'travel_messages' THEN '✅ Table messagerie'
        WHEN table_name = 'travel_notifications' THEN '✅ Table notifications'
        WHEN table_name = 'travel_validation_checklist' THEN '✅ Table checklist validation'
        ELSE table_name
    END as description
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('travel_messages', 'travel_notifications', 'travel_validation_checklist')
ORDER BY table_name;

-- 2. Vérifier les nouvelles colonnesde travel_requests
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN column_name = 'project_type' THEN '✅ Type de projet'
        WHEN column_name = 'destination_country' THEN '✅ Pays destination'
        WHEN column_name = 'passport_number' THEN '✅ Numéro passeport'
        WHEN column_name = 'current_situation' THEN '✅ Situation actuelle'
        WHEN column_name = 'is_verified' THEN '✅ Statut vérification'
        ELSE column_name
    END as description
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'travel_requests'
AND column_name IN ('project_type', 'destination_country', 'passport_number', 'current_situation', 'is_verified')
ORDER BY column_name;

-- 3. Vérifier les types ENUM
SELECT 
    t.typname as enum_type,
    CASE 
        WHEN t.typname = 'travel_project_type' THEN '✅ Types projets voyage'
        WHEN t.typname = 'travel_current_situation' THEN '✅ Situations actuelles'
        WHEN t.typname = 'message_sender_type' THEN '✅ Types expéditeurs'
        WHEN t.typname = 'notification_type' THEN '✅ Types notifications'
        ELSE t.typname
    END as description,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
AND t.typname IN ('travel_project_type', 'travel_current_situation', 'message_sender_type', 'notification_type')
GROUP BY t.typname, description
ORDER BY t.typname;

-- 4. Vérifier les triggers
SELECT 
    trigger_name,
    event_object_table as table_name,
    CASE 
        WHEN trigger_name = 'trigger_travel_status_notification' THEN '✅ Notifications automatiques'
        WHEN trigger_name = 'trigger_create_checklist' THEN '✅ Création checklist auto'
        ELSE trigger_name
    END as description
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name IN ('trigger_travel_status_notification', 'trigger_create_checklist')
ORDER BY trigger_name;

-- 5. Vérifier les fonctions
SELECT 
    routine_name,
    CASE 
        WHEN routine_name = 'mark_message_as_read' THEN '✅ Marquer message lu'
        WHEN routine_name = 'mark_notification_as_read' THEN '✅ Marquer notification lue'
        WHEN routine_name = 'create_travel_notification' THEN '✅ Créer notification'
        WHEN routine_name = 'create_validation_checklist' THEN '✅ Créer checklist'
        ELSE routine_name
    END as description
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('mark_message_as_read', 'mark_notification_as_read', 'create_travel_notification', 'create_validation_checklist')
ORDER BY routine_name;

-- 6. Vérifier les RLS policies
SELECT 
    tablename,
    policyname,
    CASE 
        WHEN policyname LIKE '%own%' THEN '✅ Policy utilisateur'
        WHEN policyname LIKE '%send%' THEN '✅ Policy envoi'
        WHEN policyname LIKE '%view%' THEN '✅ Policy lecture'
        ELSE '✅ ' || policyname
    END as description
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('travel_messages', 'travel_notifications', 'travel_validation_checklist')
ORDER BY tablename, policyname;

-- 7. Compter les enregistrements (devrait être vide initial)
SELECT 
    'travel_messages' as table_name,
    COUNT(*) as record_count
FROM public.travel_messages
UNION ALL
SELECT 
    'travel_notifications',
    COUNT(*)
FROM public.travel_notifications
UNION ALL
SELECT 
    'travel_validation_checklist',
    COUNT(*)
FROM public.travel_validation_checklist;

-- =============================================
-- RÉSUMÉ DU STATUT
-- =============================================

SELECT 
    '✅ MIGRATION APPLIQUÉE AVEC SUCCÈS!' as status,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('travel_messages', 'travel_notifications', 'travel_validation_checklist')
        ) = 3 
        THEN 'Toutes les tables sont créées'
        ELSE '⚠️ Il manque des tables'
    END as table_status,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'travel_requests'
            AND column_name IN ('project_type', 'destination_country', 'passport_number')
        ) = 3 
        THEN 'Colonnes enrichies ajoutées'
        ELSE '⚠️ Colonnes manquantes'
    END as column_status,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            AND trigger_name IN ('trigger_travel_status_notification', 'trigger_create_checklist')
        ) = 2 
        THEN 'Triggers activés'
        ELSE '⚠️ Triggers manquants'
    END as trigger_status;

-- =============================================
-- Si tout est ✅, le système est prêt !
-- =============================================
