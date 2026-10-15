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

export interface BookletDish {
    id: string;
    title: string;
    description: string;
    price: number;
    priceFormatted: string;
    unitLabel: string;
    categoryLabel: string;
}

export interface BookletSubSection {
    subtitle: string;
    note?: string;
    dishes: BookletDish[];
}

export interface BookletPage {
    pageNumber: number;
    tabNumber: string;
    tabLabel: string;
    tabShort: string;
    pageTitle: string;
    pageTagline: string;
    subsections: BookletSubSection[];
    footnote?: string;
    nextPageTitle?: string;
    prevPageTitle?: string;
}

export const BOOKLET_PAGES: BookletPage[] = [
    {
        pageNumber: 1,
        tabNumber: "1",
        tabLabel: "1. Zakouskis & Potages",
        tabShort: "Zakouskis & Potages",
        pageTitle: "L'Apéritif & Les Potages",
        pageTagline: "Pour éveiller les papilles et débuter les festivités tout en délicatesse",
        nextPageTitle: "Découvrir les Entrées",
        subsections: [
            {
                subtitle: "Les Zakouskis Froids",
                note: "4,00 € / pièce TVAC",
                dishes: [
                    {
                        id: "zak-volaille",
                        title: "Cuillère de mousse de volaille Périgord",
                        description: "Mousse légère et parfumée, noisettes torréfiées et pointe de réduction",
                        price: 4.00,
                        priceFormatted: "4,00 €",
                        unitLabel: "pièce",
                        categoryLabel: "Zakouskis"
                    },
                    {
                        id: "zak-maquereau",
                        title: "Blini de maquereau fumé",
                        description: "Maquereau fumé artisanalement, raifort doux et fraîcheur acidulée de pomme verte",
                        price: 4.00,
                        priceFormatted: "4,00 €",
                        unitLabel: "pièce",
                        categoryLabel: "Zakouskis"
                    },
                    {
                        id: "zak-jambon",
                        title: "Roulé de jambon d'Ardenne",
                        description: "Jambon d'Ardenne affiné, fromage de Herve doux et pointe de sirop de Liège",
                        price: 4.00,
                        priceFormatted: "4,00 €",
                        unitLabel: "pièce",
                        categoryLabel: "Zakouskis"
                    }
                ]
            },
            {
                subtitle: "Les Potages Veloutés",
                note: "4,00 € / portion TVAC",
                dishes: [
                    {
                        id: "pot-cresson",
                        title: "Velouté de cresson",
                        description: "Cresson de fontaine fraîchement lié à la crème double et pointe de muscade",
                        price: 4.00,
                        priceFormatted: "4,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Potages"
                    },
                    {
                        id: "pot-potiron",
                        title: "Velouté de potiron et châtaignes",
                        description: "Douceur de potiron rôti au beurre et brisures de châtaignes moelleuses",
                        price: 4.00,
                        priceFormatted: "4,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Potages"
                    }
                ]
            }
        ]
    },
    {
        pageNumber: 2,
        tabNumber: "2",
        tabLabel: "2. Entrées",
        tabShort: "Entrées",
        pageTitle: "Les Entrées de Fête",
        pageTagline: "Le raffinement de la terre et de la mer pour sublimer vos tables",
        prevPageTitle: "Zakouskis & Potages",
        nextPageTitle: "Découvrir les Plats",
        subsections: [
            {
                subtitle: "Les Entrées Froides",
                note: "Fraîcheur noble & dressage délicat",
                dishes: [
                    {
                        id: "ef-foie-gras",
                        title: "Foie gras de canard mi-cuit",
                        description: "Terrine maison au poivre de Sichuan, chutney de figues au Porto et brioche toastée",
                        price: 22.00,
                        priceFormatted: "22,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Entrées froides"
                    },
                    {
                        id: "ef-st-jacques",
                        title: "Carpaccio de noix de Saint-Jacques",
                        description: "Noix tranchées minute, suprêmes d'agrumes, confit de pamplemousse et huile vierge extra",
                        price: 24.00,
                        priceFormatted: "24,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Entrées froides"
                    }
                ]
            },
            {
                subtitle: "Les Entrées Chaudes",
                note: "À réchauffer délicatement avant le service",
                dishes: [
                    {
                        id: "ec-ris-de-veau",
                        title: "Cassolette de ris de veau dorés au beurre",
                        description: "Ris de veau de cœur croustillants, girolles, chanterelles et crème fine réduite",
                        price: 24.00,
                        priceFormatted: "24,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Entrées chaudes"
                    },
                    {
                        id: "ec-raviolis",
                        title: "Raviolis farcis aux girolles",
                        description: "Pâtes fraîches farcies aux sous-bois, crème de parmesan affiné et girolles poêlées",
                        price: 22.00,
                        priceFormatted: "22,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Entrées chaudes"
                    }
                ]
            }
        ]
    },
    {
        pageNumber: 3,
        tabNumber: "3",
        tabLabel: "3. Plats",
        tabShort: "Plats",
        pageTitle: "Les Plats de Fête",
        pageTagline: "Grandes pièces généreuses (±250g) mijotées ou saisies à point avec leurs garnitures",
        prevPageTitle: "Les Entrées",
        nextPageTitle: "Découvrir les Bûchettes",
        subsections: [
            {
                subtitle: "Les Grandes Pièces Cuisinées",
                note: "Portion généreuse ±250g avec sauce et garnitures maison",
                dishes: [
                    {
                        id: "plat-chevreuil",
                        title: "Filet de chevreuil rôti",
                        description: "Gibier noble saisi au sautoir (±250g), sauce aux agrumes et chocolat noir amer",
                        price: 36.00,
                        priceFormatted: "36,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Plats"
                    },
                    {
                        id: "plat-pintadeau",
                        title: "Suprême de pintadeau laqué au miel",
                        description: "Volaille fermière dorée au miel d'acacia (±250g), mandarines rôties et jus corsé",
                        price: 30.00,
                        priceFormatted: "30,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Plats"
                    },
                    {
                        id: "plat-saumon",
                        title: "Pavé de saumon à l'oseille en cuisson lente",
                        description: "Cœur de filet de saumon fondant (±250g), émulsion légère au champagne et julienne de légumes",
                        price: 30.00,
                        priceFormatted: "30,00 €",
                        unitLabel: "portion",
                        categoryLabel: "Plats"
                    }
                ]
            }
        ]
    },
    {
        pageNumber: 4,
        tabNumber: "4",
        tabLabel: "4. Bûchettes",
        tabShort: "Bûchettes",
        pageTitle: "La Touche Sucrée",
        pageTagline: "L'élégance pâtissière artisanale pour clore votre repas en apothéose",
        prevPageTitle: "Les Plats",
        footnote: "Tout est préparé maison • Bûchettes artisanales de chez La Pavée",
        subsections: [
            {
                subtitle: "Bûchettes de chez La Pavée",
                note: "Créations individuelles d'exception signées par la pâtisserie La Pavée • 8,00 € / pièce TVAC",
                dishes: [
                    {
                        id: "buch-framboise",
                        title: "Crème fraîche & framboise",
                        description: "Biscuit roulé aérien, crème fraîche légère et compotée de framboises acidulées",
                        price: 8.00,
                        priceFormatted: "8,00 €",
                        unitLabel: "pièce",
                        categoryLabel: "Bûchettes"
                    },
                    {
                        id: "buch-chocolat",
                        title: "Mousse au chocolat cœur framboise",
                        description: "Mousse intense au chocolat noir belge, insert fruité framboise et croustillant praliné",
                        price: 8.00,
                        priceFormatted: "8,00 €",
                        unitLabel: "pièce",
                        categoryLabel: "Bûchettes"
                    },
                    {
                        id: "buch-moka",
                        title: "Beurre moka",
                        description: "La recette festive traditionnelle : crème au beurre au café pur arabica et génoise moelleuse",
                        price: 8.00,
                        priceFormatted: "8,00 €",
                        unitLabel: "pièce",
                        categoryLabel: "Bûchettes"
                    }
                ]
            }
        ]
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
 * Promotion Early Bird -5% : Valable pour toute commande validée avant le 1er décembre 2026 (strictement < 01/12/2026 00:00:00).
 */
export const EARLY_BIRD_DEADLINE = new Date(2026, 11, 1, 0, 0, 0, 0); // 1er décembre 2026 00:00:00

export function isEarlyBirdFestivePromoActive(date: Date = new Date()): boolean {
    return date.getTime() < EARLY_BIRD_DEADLINE.getTime();
}

/**
 * Option Acompte 30% : Disponible jusqu'au 10 décembre 2026 inclus (23h59:59).
 * À partir du 11 décembre 2026, seul le règlement à 100% est proposé.
 */
export const DEPOSIT_DEADLINE = new Date(2026, 11, 10, 23, 59, 59, 999);

export function isDepositAllowed(date: Date = new Date()): boolean {
    return date.getTime() <= DEPOSIT_DEADLINE.getTime();
}

// ==========================================
// 7. CALENDRIER 20 DÉCEMBRE AU 5 JANVIER & J-4
// ==========================================

export interface FestiveCalendarDay {
    dateValue: string; // "2026-12-24"
    dayFormatted: string; // "Jeudi 24 Décembre 2026"
    shortLabel: string; // "24 Décembre"
    displayLabel?: string;
    isQuickButton: boolean;
    quickButtonLabel?: string;
}

export const FESTIVE_CALENDAR_DAYS: FestiveCalendarDay[] = [
    { dateValue: "2026-12-20", dayFormatted: "Dimanche 20 Décembre 2026", shortLabel: "20 Décembre", isQuickButton: false },
    { dateValue: "2026-12-21", dayFormatted: "Lundi 21 Décembre 2026", shortLabel: "21 Décembre", isQuickButton: false },
    { dateValue: "2026-12-22", dayFormatted: "Mardi 22 Décembre 2026", shortLabel: "22 Décembre", isQuickButton: false },
    { dateValue: "2026-12-23", dayFormatted: "Mercredi 23 Décembre 2026", shortLabel: "23 Décembre", isQuickButton: false },
    { dateValue: "2026-12-24", dayFormatted: "Jeudi 24 Décembre 2026", shortLabel: "24 Décembre", isQuickButton: true, quickButtonLabel: "24 Décembre" },
    { dateValue: "2026-12-25", dayFormatted: "Vendredi 25 Décembre 2026", shortLabel: "25 Décembre", isQuickButton: true, quickButtonLabel: "25 Décembre" },
    { dateValue: "2026-12-26", dayFormatted: "Samedi 26 Décembre 2026", shortLabel: "26 Décembre", isQuickButton: false },
    { dateValue: "2026-12-27", dayFormatted: "Dimanche 27 Décembre 2026", shortLabel: "27 Décembre", isQuickButton: false },
    { dateValue: "2026-12-28", dayFormatted: "Lundi 28 Décembre 2026", shortLabel: "28 Décembre", isQuickButton: false },
    { dateValue: "2026-12-29", dayFormatted: "Mardi 29 Décembre 2026", shortLabel: "29 Décembre", isQuickButton: false },
    { dateValue: "2026-12-30", dayFormatted: "Mercredi 30 Décembre 2026", shortLabel: "30 Décembre", isQuickButton: false },
    { dateValue: "2026-12-31", dayFormatted: "Jeudi 31 Décembre 2026", shortLabel: "31 Décembre", isQuickButton: true, quickButtonLabel: "31 Décembre" },
    { dateValue: "2027-01-01", dayFormatted: "Vendredi 1er Janvier 2027", shortLabel: "1er Janvier", isQuickButton: true, quickButtonLabel: "1er Janvier" },
    { dateValue: "2027-01-02", dayFormatted: "Samedi 2 Janvier 2027", shortLabel: "2 Janvier", isQuickButton: false },
    { dateValue: "2027-01-03", dayFormatted: "Dimanche 3 Janvier 2027", shortLabel: "3 Janvier", isQuickButton: false },
    { dateValue: "2027-01-04", dayFormatted: "Lundi 4 Janvier 2027", shortLabel: "4 Janvier", isQuickButton: false },
    { dateValue: "2027-01-05", dayFormatted: "Mardi 5 Janvier 2027", shortLabel: "5 Janvier", isQuickButton: false }
];

export interface FestivePickupSlot {
    id: 'veille' | 'jour_meme';
    label: string;
    hours: string;
    fullLabel: string;
    shortNotice: string;
    badge?: string;
    targetDateFormatted: string;
}

/**
 * Calcule les deux créneaux de retrait possibles pour une date de repas donnée :
 * - La veille de 14h00 à 18h00
 * - Le jour même de 08h00 à 12h00
 */
export function getFestivePickupOptions(dateValue: string): FestivePickupSlot[] {
    if (!dateValue) return [];
    const [y, m, d] = dateValue.split('-').map(Number);
    const mealDate = new Date(y, m - 1, d, 12, 0, 0);

    const eveDate = new Date(mealDate);
    eveDate.setDate(eveDate.getDate() - 1);

    const formatEve = eveDate.toLocaleDateString('fr-BE', { day: 'numeric', month: 'numeric' });
    const formatEveFull = eveDate.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
    const formatMeal = mealDate.toLocaleDateString('fr-BE', { day: 'numeric', month: 'numeric' });
    const formatMealFull = mealDate.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return [
        {
            id: 'veille',
            label: 'La veille du repas',
            hours: 'entre 14h00 et 18h00',
            fullLabel: `La veille du repas (${capitalize(formatEveFull)}) : entre 14h00 et 18h00`,
            shortNotice: `Retrait la veille (${formatEve}) de 14h à 18h`,
            badge: `Retrait veille 14h-18h`,
            targetDateFormatted: capitalize(formatEveFull)
        },
        {
            id: 'jour_meme',
            label: 'Le jour même du repas',
            hours: 'entre 08h00 et 12h00',
            fullLabel: `Le jour même du repas (${capitalize(formatMealFull)}) : entre 08h00 et 12h00`,
            shortNotice: `Retrait le jour même (${formatMeal}) de 8h à 12h`,
            badge: `Retrait jour même 8h-12h`,
            targetDateFormatted: capitalize(formatMealFull)
        }
    ];
}

/**
 * Règle J-4 dynamique : Commandes acceptées au plus tard 4 jours avant la date de retrait.
 * La date de retrait la plus hâtive est la veille du repas.
 */
export function isFestiveDateJ4Locked(dateValue: string, currentDate: Date = new Date()): boolean {
    if (!dateValue) return false;
    const [y, m, d] = dateValue.split('-').map(Number);
    const targetMeal = new Date(y, m - 1, d, 12, 0, 0);

    // Date de retrait la plus proche = la veille du repas
    const earliestPickup = new Date(targetMeal);
    earliestPickup.setDate(earliestPickup.getDate() - 1);

    const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const earliestMidnight = new Date(earliestPickup.getFullYear(), earliestPickup.getMonth(), earliestPickup.getDate());

    const diffMs = earliestMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Verrouillé si moins de 4 jours (diffDays < 4)
    return diffDays < 4;
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
        id.startsWith('carte-') ||
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
    validationMode: FestiveValidationMode = 'acompte_30',
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
    // Si la date dépasse le 10 décembre 2026, l'acompte n'est plus autorisé
    const depositPermitted = isDepositAllowed(currentDate);
    const effectiveMode: FestiveValidationMode = (hasFestiveItems && depositPermitted) ? validationMode : 'totalite_100';

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

