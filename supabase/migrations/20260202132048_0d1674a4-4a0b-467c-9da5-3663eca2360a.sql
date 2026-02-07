-- Ajouter le rôle admin à l'utilisateur spécifié
INSERT INTO public.user_roles (user_id, role)
SELECT 'b87a1467-5e55-459d-81b2-d974228e6867', 'admin'::app_role
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = 'b87a1467-5e55-459d-81b2-d974228e6867' AND role = 'admin'
);