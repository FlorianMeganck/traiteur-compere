export type FestiveCourse = {
    courseName: "Entrée" | "Potage" | "Plat Principal" | "Dessert" | "Mignardises" | "Amuse-bouche";
    title: string;
    description?: string;
};

export type FestiveMenu = {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    price: number; // Prix par personne en euros (ex: 49)
    priceFormatted: string; // "49,00 €"
    image: string;
    pickupDates: string[]; // ex: ["Mardi 24 Décembre après 11h", "Mercredi 31 Décembre après 11h"]
    deadlineNotice: string; // ex: "Commandes avant le 18 Décembre"
    description: string;
    courses: FestiveCourse[];
    allergens?: string[];
    isPopular?: boolean;
};

export const MENUS_FETES_DATA: FestiveMenu[] = [
    {
        id: "menu-reveillon-noel",
        title: "Menu Réveillon de Noël",
        subtitle: "L'élégance gastronomique traditionnelle pour vos tables de Noël",
        badge: "24 & 25 Décembre",
        price: 49.00,
        priceFormatted: "49,00 €",
        image: "/images/hero-traiteur.png",
        pickupDates: ["Mardi 24 Décembre après 11h", "Mercredi 25 Décembre avant 12h"],
        deadlineNotice: "Réservation souhaitée avant le 19 Décembre",
        description: "Une composition festive 4 services alliant produits nobles et savoir-faire bicentenaire de la maison Compère.",
        isPopular: true,
        courses: [
            {
                courseName: "Entrée",
                title: "Terrine de Foie Gras de Canard Maison",
                description: "Chutney de figues moelleuses au Porto rouge & brioche dorée toastée"
            },
            {
                courseName: "Potage",
                title: "Velouté de Châtaignes & Brisures de Truffe",
                description: "Émulsion crémeuse et éclats de noisettes torréfiées"
            },
            {
                courseName: "Plat Principal",
                title: "Filet de Biche Sauce Grand Veneur",
                description: "Mousseline de potimarron, airelles sauvages & poire pochée aux épices douces"
            },
            {
                courseName: "Dessert",
                title: "Bûche Signature Chocolat Valrhona & Praliné Croustillant",
                description: "Cœur coulant caramel fleur de sel et biscuit dacquoise"
            }
        ],
        allergens: ["Gluten", "Lactose", "Fruits à coque", "Œufs"]
    },
    {
        id: "menu-saint-sylvestre",
        title: "Menu Saint-Sylvestre",
        subtitle: "Passez le cap de la nouvelle année sous le signe du raffinement",
        badge: "31 Décembre & 1er Janvier",
        price: 55.00,
        priceFormatted: "55,00 €",
        image: "/images/banquet.png",
        pickupDates: ["Mercredi 31 Décembre après 11h", "Jeudi 1er Janvier avant 12h"],
        deadlineNotice: "Réservation souhaitée avant le 26 Décembre",
        description: "Un voyage culinaire festif pour sublimer votre réveillon du Nouvel An entre amis ou en famille.",
        isPopular: true,
        courses: [
            {
                courseName: "Entrée",
                title: "Carpaccio de Noix de Saint-Jacques & Émulsion Agrumes",
                description: "Perles de yuzu, huile vierge à l'aneth et jeunes pousses croquantes"
            },
            {
                courseName: "Potage",
                title: "Bisque Onctueuse de Homard & Croûtons Dorés",
                description: "Parfumée à l'estragon frais et pointe de cognac fine champagne"
            },
            {
                courseName: "Plat Principal",
                title: "Suprême de Chapon Farci aux Morilles",
                description: "Gratin dauphinois à la crème d'Isigny et tombée de champignons des bois"
            },
            {
                courseName: "Dessert",
                title: "Sphère Scintillante Mangue-Passion & Vanille de Madagascar",
                description: "Sablé breton pur beurre et coulis exotique acidulé"
            }
        ],
        allergens: ["Gluten", "Lactose", "Crustacés", "Mollusques", "Œufs"]
    },
    {
        id: "menu-prestige-fetes",
        title: "Menu Dégustation Prestige",
        subtitle: "L'excellence gastronomique absolue en 5 services",
        badge: "Édition Limitée",
        price: 65.00,
        priceFormatted: "65,00 €",
        image: "/images/wedding_table.png",
        pickupDates: ["24 Décembre après 11h", "31 Décembre après 11h"],
        deadlineNotice: "Série limitée - Réservation anticipée requise",
        description: "Une expérience d'exception mettant à l'honneur les trésors les plus précieux de la gastronomie de fête.",
        isPopular: false,
        courses: [
            {
                courseName: "Amuse-bouche",
                title: "Trilogie de Bouchées Festives du Chef",
                description: "Cuillère de tataki de thon rouge, tartare de bœuf truffé & cromesquis de foie gras"
            },
            {
                courseName: "Entrée",
                title: "Médaillon de Homard Bleu & Mousseline d'Avocat",
                description: "Vinaigrette passion au poivre de Timut & tuile de corail croustillante"
            },
            {
                courseName: "Potage",
                title: "Consommé Double de Faisan aux Cèpes & Truffe Noire",
                description: "Infusion lente aux herbes aromatiques et quenelle de volaille fine"
            },
            {
                courseName: "Plat Principal",
                title: "Pavé de Veau de Lait Cuit Basse Température",
                description: "Jus corsé au vin de Madère, grenailles confites et légumes glacés au miel"
            },
            {
                courseName: "Dessert",
                title: "Création Impériale : Dôme Royal Or & Chocolat Grand Cru",
                description: "Feuillantine pralinée, ganache intense 70% et éclat de feuille d'or comestible"
            }
        ],
        allergens: ["Gluten", "Lactose", "Crustacés", "Poissons", "Œufs", "Fruits à coque"]
    },
    {
        id: "menu-enfant-fetes",
        title: "Menu Enfant Festif",
        subtitle: "Les plaisirs de la fête spécialement adaptés pour les plus jeunes",
        badge: "Spécial Enfants (jusqu'à 12 ans)",
        price: 22.00,
        priceFormatted: "22,00 €",
        image: "/images/entreprise.jpeg",
        pickupDates: ["24 Décembre après 11h", "31 Décembre après 11h"],
        deadlineNotice: "Disponible pour les réveillons de Noël et Nouvel An",
        description: "Des saveurs douces et gourmandes préparées maison pour régaler les petits convives.",
        isPopular: false,
        courses: [
            {
                courseName: "Entrée",
                title: "Mini Feuilleté Croustillant au Jambon Artisanal & Fromage Doré",
                description: "Petite sauce veloutée légère"
            },
            {
                courseName: "Plat Principal",
                title: "Filet de Poulet Fermier Braisé & Pommes Noisettes Maison",
                description: "Sauce crème douce et compote de pommes fraîches"
            },
            {
                courseName: "Dessert",
                title: "Mini Bûchette Gourmande Chocolat au Lait & Guimauve",
                description: "Décoration lutin de Noël en sucre"
            }
        ],
        allergens: ["Gluten", "Lactose", "Œufs"]
    }
];

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
        pickupWindow: "Retrait le 23 Décembre (14h - 18h) ou le 24 Décembre (9h - 13h)",
        badge: "Noël",
        period: "noel"
    },
    {
        id: "noel-25",
        dateValue: "2026-12-25",
        label: "Jour de Noël",
        dayFormatted: "Jeudi 25 Décembre",
        pickupWindow: "Retrait le 23 Décembre (14h - 18h) ou le 24 Décembre (9h - 13h)",
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
        pickupWindow: "Retrait le 30 Décembre (14h - 18h) ou le 31 Décembre (9h - 13h)",
        badge: "Nouvel An",
        period: "nouvel_an"
    },
    {
        id: "nouvel-an-01",
        dateValue: "2027-01-01",
        label: "Jour de l'An",
        dayFormatted: "Jeudi 1er Janvier",
        pickupWindow: "Retrait le 30 Décembre (14h - 18h) ou le 31 Décembre (9h - 13h)",
        badge: "Nouvel An",
        period: "nouvel_an"
    }
];

export const FESTIVE_DATE_OPTIONS: FestiveDateOption[] = [
    ...NOEL_DATE_OPTIONS,
    ...NOUVEL_AN_DATE_OPTIONS
];

/**
 * Matrice des restrictions de dates par menu :
 * - Menu Noël (Réveillon & Prestige) : 24 et 25 Décembre
 * - Menu Nouvel An (Saint-Sylvestre) : 31 Décembre et 1er Janvier
 * - Menu Enfant : s'adapte aux menus choisis ou permet toutes les dates
 * - Si le panier contient à la fois Noël et Nouvel An : mode mixte (sélection de 2 dates distinctes)
 */
export function getFestiveMenuDateRestrictions(cartItems: Array<{ id?: string; nomPlat?: string; itemType?: string }>) {
    let hasNoel = false;
    let hasNouvelAn = false;
    let hasEnfant = false;

    cartItems.forEach(item => {
        const id = (item.id || "").toLowerCase();
        const nom = (item.nomPlat || "").toLowerCase();

        if (id === 'menu-reveillon-noel' || id === 'menu-prestige-fetes' || nom.includes('noël') || nom.includes('noel') || nom.includes('prestige')) {
            hasNoel = true;
        } else if (id === 'menu-saint-sylvestre' || nom.includes('sylvestre') || nom.includes('nouvel an')) {
            hasNouvelAn = true;
        } else if (id === 'menu-enfant-fetes' || nom.includes('enfant')) {
            hasEnfant = true;
        }
    });

    const isMixed = hasNoel && hasNouvelAn;

    let allowedOptionIds: string[] = ["noel-24", "noel-25", "nouvel-an-31", "nouvel-an-01"];
    let allowedPeriodLabel = "";

    if (isMixed) {
        allowedOptionIds = ["noel-24", "noel-25", "nouvel-an-31", "nouvel-an-01"];
        allowedPeriodLabel = "Votre commande comprend des repas pour Noël et pour Nouvel An. Veuillez choisir une date pour chaque événement.";
    } else if (hasNoel) {
        allowedOptionIds = ["noel-24", "noel-25"];
        allowedPeriodLabel = "Menus de Noël : réservations pour les 24 & 25 Décembre.";
    } else if (hasNouvelAn) {
        allowedOptionIds = ["nouvel-an-31", "nouvel-an-01"];
        allowedPeriodLabel = "Menus de Nouvel An : réservations pour les 31 Décembre & 1er Janvier.";
    }

    return {
        hasNoel,
        hasNouvelAn,
        hasEnfant,
        isMixed,
        allowedOptionIds,
        allowedPeriodLabel
    };
}


