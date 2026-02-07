-- =============================================
-- PHASE 1: ENUM ET FONCTIONS DE BASE
-- =============================================

-- Enum pour les rôles utilisateur
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Enum pour le statut des commandes
CREATE TYPE public.order_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Enum pour le statut des transactions
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- =============================================
-- PHASE 2: TABLES PRINCIPALES
-- =============================================

-- Table des profils utilisateurs
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des rôles utilisateurs (séparée pour sécurité)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Table des services
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    icon TEXT NOT NULL DEFAULT 'FileText',
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des variantes de prix par service
CREATE TABLE public.service_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
    variant_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des commandes
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    customer_email TEXT,
    customer_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des témoignages
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    payment_method TEXT,
    stripe_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des formations
CREATE TABLE public.formations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    sessions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- PHASE 3: FONCTION SECURITY DEFINER
-- =============================================

-- Fonction pour vérifier les rôles (évite récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- =============================================
-- PHASE 4: ACTIVATION RLS
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PHASE 5: POLITIQUES RLS - PROFILES
-- =============================================

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 6: POLITIQUES RLS - USER_ROLES
-- =============================================

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 7: POLITIQUES RLS - SERVICES
-- =============================================

CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage all services"
ON public.services FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 8: POLITIQUES RLS - SERVICE_PRICES
-- =============================================

CREATE POLICY "Anyone can view active service prices"
ON public.service_prices FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage service prices"
ON public.service_prices FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 9: POLITIQUES RLS - ORDERS
-- =============================================

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 10: POLITIQUES RLS - TESTIMONIALS
-- =============================================

CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials FOR SELECT
TO anon, authenticated
USING (is_approved = true);

CREATE POLICY "Users can create testimonials"
ON public.testimonials FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 11: POLITIQUES RLS - TRANSACTIONS
-- =============================================

CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = transactions.order_id
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage transactions"
ON public.transactions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 12: POLITIQUES RLS - FORMATIONS
-- =============================================

CREATE POLICY "Anyone can view active formations"
ON public.formations FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage formations"
ON public.formations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 13: TRIGGERS POUR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_formations_updated_at
BEFORE UPDATE ON public.formations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- PHASE 14: TRIGGER CRÉATION PROFIL AUTO
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PHASE 15: DONNÉES INITIALES - SERVICES
-- =============================================

INSERT INTO public.services (name, slug, description, long_description, icon, base_price, category, display_order) VALUES
('Rédaction Académique', 'redaction', 'Rapports de stage BT/BTS et mémoires Licence', 'Service professionnel de rédaction de documents académiques. Nous rédigeons vos rapports de stage (BT, BTS) et mémoires de Licence dans toutes les filières avec un accompagnement personnalisé.', 'FileText', 50000, 'academique', 1),
('Inscription VAP/VAE', 'inscription-vap-vae', 'Diplômes DUT, Licence et Master par validation', 'Accompagnement complet pour l''obtention de diplômes par Validation des Acquis Professionnels (VAP) ou Validation des Acquis de l''Expérience (VAE). DUT, Licence professionnelle, Master professionnel.', 'GraduationCap', 75000, 'academique', 2),
('Assistance Voyage', 'assistance-voyage', 'Visas travail, étude, visiteur et Decreto Flussi', 'Service d''accompagnement pour vos projets de voyage. Obtention de visas (travail, étude, visiteur) pour tous pays et programme spécial Decreto Flussi pour l''Italie.', 'Plane', 100000, 'voyage', 3),
('CV & Lettre de Motivation', 'cv-lettre', 'CV ATS, modèles canadien/français, traductions', 'Création de CV optimisés ATS et lettres de motivation personnalisées. Modèles canadien et français disponibles avec traduction automatique en anglais et allemand.', 'FileCheck', 15000, 'emploi', 4),
('Gestion Comptabilité', 'comptabilite', 'Création d''entreprise et gestion comptable', 'Services complets de comptabilité : création d''entreprise, tenue de comptabilité, bilans, déclarations fiscales et conseils financiers.', 'Calculator', 80000, 'entreprise', 5),
('Création Site Web', 'creation-site-web', 'Sites vitrines, e-commerce et portfolios', 'Développement de sites web professionnels : sites vitrines, boutiques e-commerce, portfolios. Design moderne et responsive avec hébergement inclus.', 'Globe', 150000, 'digital', 6),
('Formation Pratique', 'formation', 'Informatique, comptabilité, design, marketing', 'Formations pratiques en présentiel : réseaux informatiques, développement d''applications, comptabilité, design graphique, marketing digital, maintenance téléphone/ordinateur.', 'BookOpen', 25000, 'formation', 7);