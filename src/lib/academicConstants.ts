// =============================================
// CONSTANTES POUR LE SYSTÈME DE RÉDACTION ACADÉMIQUE
// =============================================

// Types de documents disponibles
export const DOCUMENT_TYPES = {
  RAPPORT_BT: {
    value: 'RAPPORT_BT',
    label: 'Rapport de stage BT',
    level: 'BT',
    price: 35000,
    advance: 25000,
    copies: 4,
    mentoring: false,
  },
  RAPPORT_BTS_AVEC_STAGE: {
    value: 'RAPPORT_BTS_AVEC_STAGE',
    label: 'Rapport de stage BTS (avec stage)',
    level: 'BTS',
    price: 35000,
    advance: 25000,
    copies: 4,
    mentoring: false,
  },
  RAPPORT_BTS_SANS_STAGE: {
    value: 'RAPPORT_BTS_SANS_STAGE',
    label: 'Rapport de stage BTS (sans stage)',
    level: 'BTS',
    price: 70000,
    advance: 50000,
    copies: 3,
    mentoring: true,
  },
  MEMOIRE_LICENCE: {
    value: 'MEMOIRE_LICENCE',
    label: 'Mémoire de Licence Professionnelle',
    level: 'LICENCE',
    price: 100000,
    advance: 60000,
    copies: 0,
    mentoring: false,
  },
} as const;

// Niveaux académiques
export const ACADEMIC_LEVELS = {
  BT: 'BT',
  BTS: 'BTS',
  LICENCE: 'Licence Professionnelle',
} as const;

// Statuts des demandes et leurs labels
export const REQUEST_STATUS = {
  pending: {
    label: 'En attente',
    description: 'Demande reçue, en attente de traitement',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    icon: 'Clock',
  },
  info_received: {
    label: 'Informations reçues',
    description: 'Toutes les informations nécessaires ont été collectées',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    icon: 'FileCheck',
  },
  plan_validated: {
    label: 'Plan validé',
    description: 'Le plan du document a été approuvé',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    icon: 'CheckCircle',
  },
  in_writing: {
    label: 'En rédaction',
    description: 'Le document est en cours de rédaction',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    icon: 'Edit',
  },
  in_review: {
    label: 'En révision',
    description: 'Le document est en cours de révision et correction',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgLight: 'bg-orange-50',
    icon: 'Eye',
  },
  ready_for_print: {
    label: 'Prêt pour impression',
    description: 'Le document est finalisé et prêt pour impression',
    color: 'bg-teal-500',
    textColor: 'text-teal-700',
    bgLight: 'bg-teal-50',
    icon: 'Printer',
  },
  completed: {
    label: 'Terminé',
    description: 'Le document a été livré',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    icon: 'CheckCircle2',
  },
  cancelled: {
    label: 'Annulé',
    description: 'La demande a été annulée',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    icon: 'XCircle',
  },
} as const;

// Types de paiement
export const PAYMENT_TYPES = {
  advance: 'Avance',
  balance: 'Solde',
} as const;

// Messages de notifications
export const NOTIFICATION_MESSAGES = {
  REQUEST_SUBMITTED: 'Votre demande a été soumise avec succès !',
  REQUEST_ERROR: 'Une erreur est survenue lors de la soumission.',
  PAYMENT_SUCCESS: 'Paiement effectué avec succès !',
  PAYMENT_FAILED: 'Le paiement a échoué. Veuillez réessayer.',
  STATUS_UPDATED: 'Le statut a été mis à jour.',
  REQUEST_NOT_FOUND: 'Aucune demande trouvée avec ce numéro.',
} as const;

// Configuration WhatsApp
export const WHATSAPP_CONFIG = {
  phone: '+2250708080808', // Changez ce numéro
  baseUrl: 'https://wa.me/',
  getUrl: (phone: string, message?: string) => {
    const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
    return `${WHATSAPP_CONFIG.baseUrl}${phone.replace(/[^0-9]/g, '')}${encodedMessage}`;
  },
  getDefaultMessage: (requestNumber: string) =>
    `Bonjour, je souhaite avoir des informations sur ma demande de rédaction académique. Numéro de dossier: ${requestNumber}`,
} as const;

// Texte d'importance (du document fourni)
export const IMPORTANCE_TEXT = {
  title: "Importance de la validation du diplôme par un rapport de stage ou un mémoire de fin de cycle",
  intro: "Dans le cadre de la rédaction académique, le rapport de stage et le mémoire de fin de cycle constituent des éléments fondamentaux de validation des diplômes. Ils permettent d'attester non seulement l'acquisition des connaissances théoriques, mais surtout la capacité de l'étudiant à les mobiliser dans un contexte professionnel ou scientifique réel.",
  stageSectionTitle: "Le Rapport de Stage",
  stageDescription: "Le rapport de stage joue un rôle d'interface entre la formation académique et le monde de l'entreprise.",
  stagePoints: [
    "La compréhension du fonctionnement organisationnel",
    "L'application pratique des compétences acquises",
    "L'esprit d'analyse et de synthèse",
    "La capacité de rédaction selon les normes académiques",
  ],
  memoireSectionTitle: "Le Mémoire de Fin de Cycle",
  memoireDescription: "Le mémoire de fin de cycle, quant à lui, représente un travail de recherche structuré.",
  memoirePoints: [
    "L'autonomie intellectuelle de l'étudiant",
    "La maîtrise de la méthodologie scientifique",
    "La rigueur analytique",
    "La capacité à proposer des solutions pertinentes à une problématique donnée",
  ],
  conclusion: "Ainsi, sans rapport de stage ou mémoire conforme aux exigences institutionnelles, la délivrance du diplôme est compromise, d'où l'importance d'un accompagnement professionnel et méthodologique tout au long du processus de rédaction.",
} as const;

// Format de prix
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

// Calculer le solde restant
export const calculateBalance = (totalAmount: number, advancePaid: number): number => {
  return totalAmount - advancePaid;
};
