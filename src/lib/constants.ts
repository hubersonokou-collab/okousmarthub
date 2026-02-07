import {
  FileText,
  GraduationCap,
  Plane,
  FileCheck,
  Calculator,
  Globe,
  BookOpen,
  Briefcase,
  Users,
} from "lucide-react";

export const SERVICES_ICONS = {
  FileText,
  GraduationCap,
  Plane,
  FileCheck,
  Calculator,
  Globe,
  BookOpen,
  Briefcase,
  Users,
} as const;

export const ORDER_STATUS_LABELS = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
} as const;

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const;

export const TRANSACTION_STATUS_LABELS = {
  pending: "En attente",
  completed: "Complété",
  failed: "Échoué",
  refunded: "Remboursé",
} as const;

// Couleurs vibrantes par catégorie de service
export const CATEGORY_COLORS = {
  academique: {
    bg: "bg-blue-600",
    light: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-600",
    gradient: "from-blue-600 to-indigo-700",
  },
  voyage: {
    bg: "bg-orange-500",
    light: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500",
    gradient: "from-orange-500 to-rose-600",
  },
  emploi: {
    bg: "bg-emerald-500",
    light: "bg-emerald-100 dark:bg-emerald-900",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
  },
  entreprise: {
    bg: "bg-amber-500",
    light: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500",
    gradient: "from-amber-500 to-yellow-600",
  },
  digital: {
    bg: "bg-fuchsia-500",
    light: "bg-fuchsia-100 dark:bg-fuchsia-900",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-500",
    gradient: "from-fuchsia-500 to-purple-700",
  },
  formation: {
    bg: "bg-cyan-500",
    light: "bg-cyan-100 dark:bg-cyan-900",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500",
    gradient: "from-cyan-500 to-blue-600",
  },
} as const;

// Couleurs vibrantes par catégorie de formation
export const FORMATION_CATEGORY_COLORS: Record<string, { bg: string; gradient: string; text: string }> = {
  informatique: { bg: "bg-blue-600", gradient: "from-blue-600 to-cyan-500", text: "text-blue-600" },
  comptabilite: { bg: "bg-emerald-500", gradient: "from-emerald-500 to-teal-600", text: "text-emerald-600" },
  design: { bg: "bg-fuchsia-500", gradient: "from-fuchsia-500 to-purple-700", text: "text-fuchsia-600" },
  marketing: { bg: "bg-orange-500", gradient: "from-orange-500 to-rose-500", text: "text-orange-600" },
  maintenance: { bg: "bg-rose-500", gradient: "from-rose-500 to-pink-600", text: "text-rose-600" },
};

// Images par défaut pour les services (par slug)
export const SERVICE_DEFAULT_IMAGES: Record<string, string> = {
  "redaction-academique": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
  "redaction": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
  "inscription-vap-vae": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
  "assistance-voyage": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop",
  "cv-lettre": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop",
  "comptabilite": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
  "creation-site-web": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
  "site-web": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
  "formation": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
  "analyse-financiere": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
};

// Images par défaut pour les formations (par catégorie)
export const FORMATION_DEFAULT_IMAGES: Record<string, string> = {
  informatique: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
  comptabilite: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
  design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
  marketing: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=400&fit=crop",
  maintenance: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=400&fit=crop",
};

export const CATEGORIES = {
  academique: "Académique",
  voyage: "Voyage",
  emploi: "Emploi",
  entreprise: "Entreprise",
  digital: "Digital",
  formation: "Formation",
} as const;

export const COUNTRY_CODES = [
  { code: "+225", country: "CI", name: "Côte d'Ivoire" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+1", country: "CA", name: "Canada" },
  { code: "+49", country: "DE", name: "Allemagne" },
  { code: "+39", country: "IT", name: "Italie" },
  { code: "+221", country: "SN", name: "Sénégal" },
  { code: "+223", country: "ML", name: "Mali" },
  { code: "+226", country: "BF", name: "Burkina Faso" },
  { code: "+228", country: "TG", name: "Togo" },
  { code: "+229", country: "BJ", name: "Bénin" },
] as const;

export const APP_NAME = "OkouSmart Hub";
export const APP_DESCRIPTION = "Votre partenaire intelligent pour tous vos services professionnels";

export const CONTACT_INFO = {
  email: "Okoukouassihuberson@gmail.com",
  phone: "+225 07 08 81 74 09",
  address: "Abidjan, Côte d'Ivoire",
  whatsapp: "+225 07 08 81 74 09",
} as const;

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/okousmarthub",
  instagram: "https://instagram.com/okousmarthub",
  linkedin: "https://linkedin.com/company/okousmarthub",
  twitter: "https://twitter.com/okousmarthub",
} as const;
