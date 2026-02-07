INSERT INTO public.user_roles (user_id, role)
VALUES ('54951a3a-f51d-43bf-b638-ae96d793f021', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;