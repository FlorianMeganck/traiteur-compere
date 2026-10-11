export interface MenuOption {
    id: string;
    title: string;
    description?: string;
    price?: number;
}

export interface FestiveMenuCourses {
    entrees: MenuOption[];
    potages?: MenuOption[];
    plats: MenuOption[];
    desserts: MenuOption[];
}

export interface FestiveMenu {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    price: number; // Prix par personne en euros TVAC (ex: 49)
    priceFormatted: string; // "49,00 €"
    image: string;
    pickupDates?: string[];
    deadlineNotice?: string;
    description: string;
    category?: 'formule' | 'noel' | 'nouvel_an';
    courses: FestiveMenuCourses;
    allergens?: string[];
    isPopular?: boolean;
}

// ==========================================
// 1. LA CARTE LIBRE (Données exactes du flyer)
// ==========================================

export type CarteCategoryKey = 'zakouskis' | 'potages' | 'entrees_froides' | 'entrees_chaudes' | 'plats' | 'buchettes';

export interface CarteItem {
    id: string;
    title: string;
    description?: string;
    category: CarteCategoryKey;
    categoryLabel: string;
    price: number; // TVAC
    priceFormatted: string;
    unitLabel: string;
}

export const CARTE_CATEGORIES: { id: CarteCategoryKey; label: string; unitPriceLabel: string; icon: string; description: string }[] = [
    {
        id: 'zakouskis',
        label: 'Zakouskis froids',
        unitPriceLabel: '4 € / pièce TVAC',
        icon: '🥟',
        description: 'Bouchées apéritives raffinées et artisanales, prêtes à déguster.'
    },
    {
        id: 'potages',
        label: 'Potages veloutés',
        unitPriceLabel: '4 € / portion TVAC',
        icon: '🥣',
        description: 'Potages onctueux et réconfortants mijotés avec des légumes de saison.'
    },
    {
        id: 'entrees_froides',
        label: 'Entrées froides',
        unitPriceLabel: 'Dès 22 € TVAC',
        icon: '❄️',
        description: 'Le foie gras et les Saint-Jacques à l\'honneur pour démarrer les festivités.'
    },
    {
        id: 'entrees_chaudes',
        label: 'Entrées chaudes',
        unitPriceLabel: 'Dès 22 € TVAC',
        icon: '🔥',
        description: 'Ris de veau et raviolis gourmands préparés avec des champignons des bois.'
    },
    {
        id: 'plats',
        label: 'Plats de fête',
        unitPriceLabel: 'Dès 30 € TVAC',
        icon: '🥩',
        description: 'Gibier, volaille laquée et poisson noble préparés en cuisson douce (±250g).'
    },
    {
        id: 'buchettes',
        label: 'Bûchettes artisanales (La Pavée)',
        unitPriceLabel: '8 € / pièce TVAC',
        icon: '🍰',
        description: 'Créations gourmandes individuelles signées par la pâtisserie renommée La Pavée.'
    }
];

export const CARTE_FETES_ITEMS: CarteItem[] = [
    // --- ZAKOUSKIS (4 € / pièce) ---
    {
        id: "zak-volaille",
        title: "Cuillère de mousse de volaille façon Périgord",
        description: "Mousse légère et parfumée, noisettes torréfiées et pointe de réduction",
        category: "zakouskis",
        categoryLabel: "Zakouskis",
        price: 4.00,
        priceFormatted: "4,00 €",
        unitLabel: "pièce"
    },
    {
        id: "zak-maquereau",
        title: "Blini de maquereau fumé, raifort et pomme verte",
        description: "Maquereau fumé artisanalement, fraîcheur acidulée de granny-smith et crème raifort douce",
        category: "zakouskis",
        categoryLabel: "Zakouskis",
        price: 4.00,
        priceFormatted: "4,00 €",
        unitLabel: "pièce"
    },
    {
        id: "zak-jambon",
        title: "Roulé de jambon d'Ardenne, Herve et sirop de Liège",
        description: "Jambon d'Ardenne affiné, fromage de Herve doux et douceur du véritable sirop de Liège",
        category: "zakouskis",
        categoryLabel: "Zakouskis",
        price: 4.00,
        priceFormatted: "4,00 €",
        unitLabel: "pièce"
    },

    // --- POTAGES (4 € / portion) ---
    {
        id: "pot-cresson",
        title: "Velouté de cresson",
        description: "Cresson de fontaine fraîchement lié à la crème double et pointe de muscade",
        category: "potages",
        categoryLabel: "Potages",
        price: 4.00,
        priceFormatted: "4,00 €",
        unitLabel: "portion"
    },
    {
        id: "pot-potiron",
        title: "Velouté de potiron et de châtaignes",
        description: "Douceur de potiron rôti au beurre et brisures de châtaignes moelleuses",
        category: "potages",
        categoryLabel: "Potages",
        price: 4.00,
        priceFormatted: "4,00 €",
        unitLabel: "portion"
    },

    // --- ENTRÉES FROIDES ---
    {
        id: "ef-foie-gras",
        title: "Foie gras de canard mi-cuit, chutney de figues et brioche dorée",
        description: "Terrine maison au poivre de Sichuan, chutney de figues au Porto et brioche toastée",
        category: "entrees_froides",
        categoryLabel: "Entrées froides",
        price: 22.00,
        priceFormatted: "22,00 €",
        unitLabel: "portion"
    },
    {
        id: "ef-st-jacques",
        title: "Carpaccio de noix de St-Jacques, suprêmes d'agrumes, confit pamplemousse et huile vierge",
        description: "Noix de Saint-Jacques tranchées minute, agrumes frais, baies roses et huile d'olive vierge extra",
        category: "entrees_froides",
        categoryLabel: "Entrées froides",
        price: 24.00,
        priceFormatted: "24,00 €",
        unitLabel: "portion"
    },

    // --- ENTRÉES CHAUDES ---
    {
        id: "ec-ris-de-veau",
        title: "Cassolette de ris de veau dorés au beurre, crème onctueuse aux champignons des bois",
        description: "Ris de veau de cœur croustillants, girolles, chanterelles et crème fine réduite",
        category: "entrees_chaudes",
        categoryLabel: "Entrées chaudes",
        price: 24.00,
        priceFormatted: "24,00 €",
        unitLabel: "portion"
    },
    {
        id: "ec-raviolis",
        title: "Raviolis farcis aux girolles, crème de parmesan affiné et girolles poêlées",
        description: "Pâtes fraîches farcies aux sous-bois, crème de Parmigiano Reggiano 24 mois",
        category: "entrees_chaudes",
        categoryLabel: "Entrées chaudes",
        price: 22.00,
        priceFormatted: "22,00 €",
        unitLabel: "portion"
    },

    // --- PLATS (±250g) ---
    {
        id: "plat-chevreuil",
        title: "Filet de chevreuil rôti ±250g, sauce aux agrumes et chocolat noir amer",
        description: "Gibier noble saisi au sautoir, jus corsé lié aux écorces d'orange et cacao grand cru",
        category: "plats",
        categoryLabel: "Plats",
        price: 36.00,
        priceFormatted: "36,00 €",
        unitLabel: "portion"
    },
    {
        id: "plat-pintadeau",
        title: "Suprême de pintadeau ±250g laqué au miel, mandarines rôties et jus corsé",
        description: "Volaille fermière dorée au miel d'acacia, quartiers de clémentines et jus de volaille réduit",
        category: "plats",
        categoryLabel: "Plats",
        price: 30.00,
        priceFormatted: "30,00 €",
        unitLabel: "portion"
    },
    {
        id: "plat-saumon",
        title: "Pavé de saumon à l'oseille ±250g en cuisson lente, crème légère au champagne et julienne légumes",
        description: "Cœur de filet de saumon fondant, émulsion veloutée au champagne et tombée d'oseille",
        category: "plats",
        categoryLabel: "Plats",
        price: 30.00,
        priceFormatted: "30,00 €",
        unitLabel: "portion"
    },

    // --- BÛCHETTES (8 € / pièce) ---
    {
        id: "buch-framboise",
        title: "Bûchette crème fraîche & framboise",
        description: "Biscuit roulé aérien, crème fraîche légère et compotée de framboises acidulées",
        category: "buchettes",
        categoryLabel: "Bûchettes",
        price: 8.00,
        priceFormatted: "8,00 €",
        unitLabel: "pièce"
    },
    {
        id: "buch-chocolat",
        title: "Bûchette mousse au chocolat, cœur framboise",
        description: "Mousse intense au chocolat noir belge, insert fruité framboise et croustillant praliné",
        category: "buchettes",
        categoryLabel: "Bûchettes",
        price: 8.00,
        priceFormatted: "8,00 €",
        unitLabel: "pièce"
    },
    {
        id: "buch-moka",
        title: "Bûchette au beurre moka",
        description: "La recette festive traditionnelle : crème au beurre au café pur arabica et génoise moelleuse",
        category: "buchettes",
        categoryLabel: "Bûchettes",
        price: 8.00,
        priceFormatted: "8,00 €",
        unitLabel: "pièce"
    }
];

// ==========================================
// 2. LES FORMULES (Configurateur 49€, 59€, 69€)
// ==========================================

export interface FormuleStepConfig {
    id: string;
    stepNumber: number;
    stepTitle: string; // Ex: "Choix 1 : 1 Potage au choix"
    selectionCount: 1 | 2;
    selectionType: 'single' | 'multiple_2' | 'fixed';
    options: MenuOption[];
    fixedItem?: MenuOption;
}

export interface FestiveFormule {
    id: string;
    title: string;
    badge: string;
    tagline: string;
    subtitle: string;
    price: number;
    priceFormatted: string;
    steps: FormuleStepConfig[];
}

// Options partagées pour les formules
const POTAGES_OPTIONS: MenuOption[] = [
    { id: "pot-cresson", title: "Velouté de cresson", description: "Cresson de fontaine lié à la crème et pointe de muscade" },
    { id: "pot-potiron", title: "Velouté de potiron et de châtaignes", description: "Potiron rôti au beurre et brisures de châtaignes" }
];

const ZAKOUSKIS_OPTIONS: MenuOption[] = [
    { id: "zak-volaille", title: "Cuillère de mousse de volaille façon Périgord", description: "Mousse légère et noisettes torréfiées" },
    { id: "zak-maquereau", title: "Blini de maquereau fumé, raifort et pomme verte", description: "Maquereau fumé artisanal et pomme croquante" },
    { id: "zak-jambon", title: "Roulé de jambon d'Ardenne, Herve et sirop de Liège", description: "Jambon d'Ardenne, Herve doux et sirop de Liège" }
];

const PLATS_DUO_OPTIONS: MenuOption[] = [
    { id: "plat-pintadeau", title: "Pintadeau laqué au miel (±250g)", description: "Mandarines rôties et jus de volaille corsé" },
    { id: "plat-saumon", title: "Pavé de saumon à l'oseille (±250g)", description: "Cuisson lente, crème légère au champagne et julienne" }
];

const BUCHETTES_OPTIONS: MenuOption[] = [
    { id: "buch-framboise", title: "Bûchette crème fraîche & framboise", description: "Par la pâtisserie La Pavée" },
    { id: "buch-chocolat", title: "Bûchette mousse au chocolat, cœur framboise", description: "Par la pâtisserie La Pavée" },
    { id: "buch-moka", title: "Bûchette au beurre moka", description: "Par la pâtisserie La Pavée" }
];

export const FORMULES_FETES: FestiveFormule[] = [
    {
        id: "formule-zakouskis",
        title: "Formule Zakouskis",
        badge: "Conviviale & Gourmande",
        tagline: "4 Services",
        subtitle: "La convivialité festive autour de bouchées fines et d'un plat savoureux",
        price: 49.00,
        priceFormatted: "49,00 €",
        steps: [
            {
                id: "step-potage",
                stepNumber: 1,
                stepTitle: "1 Potage au choix",
                selectionCount: 1,
                selectionType: "single",
                options: POTAGES_OPTIONS
            },
            {
                id: "step-zakouskis",
                stepNumber: 2,
                stepTitle: "2 Zakouskis froids au choix",
                selectionCount: 2,
                selectionType: "multiple_2",
                options: ZAKOUSKIS_OPTIONS
            },
            {
                id: "step-plat",
                stepNumber: 3,
                stepTitle: "1 Plat principal au choix (±250g)",
                selectionCount: 1,
                selectionType: "single",
                options: PLATS_DUO_OPTIONS
            },
            {
                id: "step-dessert",
                stepNumber: 4,
                stepTitle: "1 Bûchette au choix (La Pavée)",
                selectionCount: 1,
                selectionType: "single",
                options: BUCHETTES_OPTIONS
            }
        ]
    },
    {
        id: "formule-reveillon",
        title: "Formule Réveillon",
        badge: "Le Grand Classique",
        tagline: "4 Services",
        subtitle: "L'équilibre parfait entre tradition festive et raffinement gastronomique",
        price: 59.00,
        priceFormatted: "59,00 €",
        steps: [
            {
                id: "step-potage",
                stepNumber: 1,
                stepTitle: "1 Potage au choix",
                selectionCount: 1,
                selectionType: "single",
                options: POTAGES_OPTIONS
            },
            {
                id: "step-entree",
                stepNumber: 2,
                stepTitle: "1 Entrée au choix (Froide ou Chaude)",
                selectionCount: 1,
                selectionType: "single",
                options: [
                    { id: "ef-foie-gras", title: "Foie gras de canard mi-cuit", description: "Chutney de figues et brioche dorée maison" },
                    { id: "ec-raviolis", title: "Raviolis farcis aux girolles", description: "Crème de parmesan affiné et girolles poêlées" }
                ]
            },
            {
                id: "step-plat",
                stepNumber: 3,
                stepTitle: "1 Plat principal au choix (±250g)",
                selectionCount: 1,
                selectionType: "single",
                options: PLATS_DUO_OPTIONS
            },
            {
                id: "step-dessert",
                stepNumber: 4,
                stepTitle: "1 Bûchette au choix (La Pavée)",
                selectionCount: 1,
                selectionType: "single",
                options: BUCHETTES_OPTIONS
            }
        ]
    },
    {
        id: "formule-prestige",
        title: "Formule Prestige",
        badge: "Haute Gastronomie",
        tagline: "4 Services Nobles",
        subtitle: "L'excellence des produits d'exception : Saint-Jacques, Ris de veau & Chevreuil",
        price: 69.00,
        priceFormatted: "69,00 €",
        steps: [
            {
                id: "step-potage",
                stepNumber: 1,
                stepTitle: "1 Potage au choix",
                selectionCount: 1,
                selectionType: "single",
                options: POTAGES_OPTIONS
            },
            {
                id: "step-entree",
                stepNumber: 2,
                stepTitle: "1 Entrée prestigieuse au choix",
                selectionCount: 1,
                selectionType: "single",
                options: [
                    { id: "ef-st-jacques", title: "Carpaccio de noix de Saint-Jacques", description: "Suprêmes d'agrumes, confit pamplemousse et huile vierge" },
                    { id: "ec-ris-de-veau", title: "Cassolette de ris de veau dorés au beurre", description: "Crème onctueuse aux champignons des bois" }
                ]
            },
            {
                id: "step-plat",
                stepNumber: 3,
                stepTitle: "Plat Signature (Inclus)",
                selectionCount: 1,
                selectionType: "fixed",
                options: [
                    { id: "plat-chevreuil", title: "Filet de chevreuil rôti (±250g)", description: "Sauce aux agrumes et chocolat noir amer" }
                ],
                fixedItem: {
                    id: "plat-chevreuil",
                    title: "Filet de chevreuil rôti (±250g)",
                    description: "Sauce aux agrumes et chocolat noir amer • Servi avec ses accompagnements de fête"
                }
            },
            {
                id: "step-dessert",
                stepNumber: 4,
                stepTitle: "1 Bûchette au choix (La Pavée)",
                selectionCount: 1,
                selectionType: "single",
                options: BUCHETTES_OPTIONS
            }
        ]
    }
];

// Compatibilité descendante pour l'API de commande et les tunnels existants
export const MENUS_FETES_DATA: FestiveMenu[] = FORMULES_FETES.map(f => ({
    id: f.id,
    title: f.title,
    subtitle: f.subtitle,
    badge: f.badge,
    price: f.price,
    priceFormatted: f.priceFormatted,
    image: f.id === 'formule-prestige' ? '/images/wedding_table.png' : (f.id === 'formule-reveillon' ? '/images/hero-traiteur.png' : '/images/banquet.png'),
    description: f.subtitle,
    category: 'formule',
    courses: {
        potages: POTAGES_OPTIONS,
        entrees: f.steps.find(s => s.id.includes('entree') || s.id.includes('zakouskis'))?.options || [],
        plats: f.steps.find(s => s.id.includes('plat'))?.options || [],
        desserts: BUCHETTES_OPTIONS
    }
}));

// ==========================================
// 3. CALENDRIER DE RETRAIT & RESTRICTIONS
// ==========================================

export type FestiveDateOption = {
    id: string;
    dateValue: string;
    label: string;
    dayFormatted: string;
    pickupWindow: string;
    badge: string;
    period: 'noel' | 'nouvel_an';
};

export const NOEL_DATE_OPTIONS: FestiveDateOption[] = [
    {
        id: "noel-24",
        dateValue: "2026-12-24",
        label: "Réveillon de Noël",
        dayFormatted: "Mercredi 24 Décembre",
        pickupWindow: "Retrait possible : Le 23 Décembre (13h - 18h) OU le 24 Décembre (8h - 13h)",
        badge: "Noël",
        period: "noel"
    },
    {
        id: "noel-25",
        dateValue: "2026-12-25",
        label: "Jour de Noël",
        dayFormatted: "Jeudi 25 Décembre",
        pickupWindow: "Retrait possible : Le 24 Décembre (10h - 18h) OU le 25 Décembre (8h - 13h)",
        badge: "Noël",
        period: "noel"
    }
];

export const NOUVEL_AN_DATE_OPTIONS: FestiveDateOption[] = [
    {
        id: "nouvel-an-31",
        dateValue: "2026-12-31",
        label: "Réveillon de Nouvel An",
        dayFormatted: "Mercredi 31 Décembre",
        pickupWindow: "Retrait possible : Le 30 Décembre (13h - 18h) OU le 31 Décembre (8h - 13h)",
        badge: "Nouvel An",
        period: "nouvel_an"
    },
    {
        id: "nouvel-an-01",
        dateValue: "2027-01-01",
        label: "Jour de l'An",
        dayFormatted: "Jeudi 1er Janvier",
        pickupWindow: "Retrait possible : Le 31 Décembre (13h - 18h) OU le 1er Janvier (8h - 11h)",
        badge: "Nouvel An",
        period: "nouvel_an"
    }
];

export const FESTIVE_DATE_OPTIONS: FestiveDateOption[] = [
    ...NOEL_DATE_OPTIONS,
    ...NOUVEL_AN_DATE_OPTIONS
];

export function getFestiveMenuDateRestrictions(cartItems: Array<{ id?: string; nomPlat?: string; itemType?: string }>) {
    let hasNoel = false;
    let hasNouvelAn = false;
    let hasEnfant = false;

    cartItems.forEach(item => {
        const id = (item.id || "").toLowerCase();
        const nom = (item.nomPlat || "").toLowerCase();

        if (id.includes('noel') || id.includes('noël') || nom.includes('noël') || nom.includes('noel')) {
            hasNoel = true;
        } else if (id.includes('sylvestre') || id.includes('nouvel') || nom.includes('sylvestre') || nom.includes('nouvel an')) {
            hasNouvelAn = true;
        } else if (id.includes('enfant') || nom.includes('enfant')) {
            hasEnfant = true;
        } else {
            // Par défaut, toute formule ou article à la carte fête permet Noël ou Nouvel An
            hasNoel = true;
            hasNouvelAn = true;
        }
    });

    const isMixed = hasNoel && hasNouvelAn;
    const onlyEnfant = hasEnfant && !hasNoel && !hasNouvelAn;

    const allowedOptionIds: string[] = ["noel-24", "noel-25", "nouvel-an-31", "nouvel-an-01"];
    const allowedPeriodLabel = "Sélectionnez votre date de réveillon (Noël 24-25 Décembre ou Nouvel An 31 Décembre - 1er Janvier).";

    return {
        hasNoel,
        hasNouvelAn,
        hasEnfant,
        onlyEnfant,
        isMixed,
        allowedOptionIds,
        allowedPeriodLabel
    };
}

// ==========================================
// 6. LOGIQUE PROMO EARLY BIRD (-5%) & ACOMPTE
// ==========================================

export type FestiveValidationMode = 'acompte_30' | 'totalite_100';

/**
 * Date limite de la promotion Early Bird : jusqu'au 1er décembre 2026 inclus (23h59:59)
 */
export const EARLY_BIRD_DEADLINE = new Date(2026, 11, 1, 23, 59, 59, 999); // 1er décembre 2026

/**
 * Vérifie si la date spécifiée (ou actuelle) donne droit à la promotion Early Bird -5%
 */
export function isEarlyBirdFestivePromoActive(date: Date = new Date()): boolean {
    return date.getTime() <= EARLY_BIRD_DEADLINE.getTime();
}

/**
 * Vérifie si un article du panier appartient à l'offre Menus des Fêtes
 */
export function isFestiveCartItem(item: { id?: string; itemType?: string; semaineId?: string; nomPlat?: string }): boolean {
    if (!item) return false;
    if (item.itemType === 'menu_fete') return true;
    const sid = item.semaineId || '';
    if (sid.startsWith('menu') || sid.startsWith('fetes') || sid === 'menus-fetes') return true;
    const id = (item.id || '').toLowerCase();
    if (
        id.startsWith('formule-') ||
        id.startsWith('zak-') ||
        id.startsWith('pot-') ||
        id.startsWith('ef-') ||
        id.startsWith('ec-') ||
        id.startsWith('plat-') ||
        id.startsWith('buch-')
    ) {
        return true;
    }
    return false;
}

export interface FestiveOrderPricingSummary {
    hasFestiveItems: boolean;
    festiveSubtotal: number;
    classicSubtotal: number;
    rawTotal: number;
    isEarlyBirdEligible: boolean;
    discountRate: number; // 0.05 ou 0
    discountAmount: number; // -5% appliqué sur le total fêtes
    totalNet: number; // rawTotal - discountAmount
    validationMode: FestiveValidationMode;
    amountToPayNow: number; // Si acompte_30: 30% du totalNet, sinon 100%
    depositAmount: number; // 30%
    remainingBalance: number; // Solde restant dû plus tard
}

/**
 * Calcule la décomposition financière complète d'une commande (promo -5% fêtes et acompte 30% ou 100%)
 */
export function calculateFestiveOrderPricing(
    cartItems: Array<{ id?: string; itemType?: string; semaineId?: string; nomPlat?: string; prixTotalLigne: number }>,
    validationMode: FestiveValidationMode = 'totalite_100',
    currentDate: Date = new Date()
): FestiveOrderPricingSummary {
    let festiveSubtotal = 0;
    let classicSubtotal = 0;
    let hasFestiveItems = false;

    cartItems.forEach(item => {
        if (isFestiveCartItem(item)) {
            hasFestiveItems = true;
            festiveSubtotal += item.prixTotalLigne;
        } else {
            classicSubtotal += item.prixTotalLigne;
        }
    });

    const isEarlyBirdEligible = isEarlyBirdFestivePromoActive(currentDate) && festiveSubtotal > 0;
    const discountRate = isEarlyBirdEligible ? 0.05 : 0;
    // Arrondi au centime près
    const discountAmount = isEarlyBirdEligible
        ? Math.round(festiveSubtotal * 0.05 * 100) / 100
        : 0;

    const totalNet = Math.max(0, Math.round(((classicSubtotal + festiveSubtotal) - discountAmount) * 100) / 100);
    const rawTotal = classicSubtotal + festiveSubtotal;

    // Si pas d'articles fêtes, le mode de validation est toujours 100%
    const effectiveMode: FestiveValidationMode = hasFestiveItems ? validationMode : 'totalite_100';

    let depositAmount = 0;
    let remainingBalance = 0;
    let amountToPayNow = totalNet;

    if (effectiveMode === 'acompte_30') {
        depositAmount = Math.round(totalNet * 0.30 * 100) / 100;
        remainingBalance = Math.round((totalNet - depositAmount) * 100) / 100;
        amountToPayNow = depositAmount;
    } else {
        depositAmount = 0;
        remainingBalance = 0;
        amountToPayNow = totalNet;
    }

    return {
        hasFestiveItems,
        festiveSubtotal,
        classicSubtotal,
        rawTotal,
        isEarlyBirdEligible,
        discountRate,
        discountAmount,
        totalNet,
        validationMode: effectiveMode,
        amountToPayNow,
        depositAmount,
        remainingBalance
    };
}

