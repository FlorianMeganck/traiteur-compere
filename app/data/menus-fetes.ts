export interface MenuOption {
    id: string;
    title: string;
    description?: string;
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
    price: number; // Prix par personne en euros (ex: 49)
    priceFormatted: string; // "49,00 €"
    image: string;
    pickupDates: string[];
    deadlineNotice: string;
    description: string;
    category: 'noel' | 'nouvel_an' | 'enfant';
    courses: FestiveMenuCourses;
    allergens?: string[];
    isPopular?: boolean;
}

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
        category: "noel",
        isPopular: true,
        courses: {
            entrees: [
                {
                    id: "noel-entree-1",
                    title: "Terrine de Foie Gras de Canard Maison",
                    description: "Chutney de figues moelleuses au Porto rouge & brioche dorée toastée"
                },
                {
                    id: "noel-entree-2",
                    title: "Saumon Fumé d'Écosse Artisanal & Blinis Maison",
                    description: "Crème acidulée à l'aneth frais, zeste de citron et baies roses"
                }
            ],
            potages: [
                {
                    id: "noel-potage-1",
                    title: "Velouté de Châtaignes & Brisures de Truffe",
                    description: "Émulsion crémeuse et éclats de noisettes torréfiées"
                },
                {
                    id: "noel-potage-2",
                    title: "Crème de Butternut au Lait de Coco & Épices Douces",
                    description: "Graines de courge torréfiées et pointe de gingembre"
                }
            ],
            plats: [
                {
                    id: "noel-plat-1",
                    title: "Filet de Biche Sauce Grand Veneur",
                    description: "Mousseline de potimarron, airelles sauvages & poire pochée aux épices"
                },
                {
                    id: "noel-plat-2",
                    title: "Suprême de Pintade Fermière aux Morilles",
                    description: "Gratin dauphinois onctueux à la crème et petits légumes glacés"
                },
                {
                    id: "noel-plat-3",
                    title: "Pavé de Dos de Cabillaud Rôti aux Agrumes",
                    description: "Risotto crémeux au parmesan et émulsion légère au safran"
                }
            ],
            desserts: [
                {
                    id: "noel-dessert-1",
                    title: "Bûche Signature Chocolat Valrhona & Praliné Croustillant",
                    description: "Cœur coulant caramel fleur de sel et biscuit dacquoise"
                },
                {
                    id: "noel-dessert-2",
                    title: "Bûche Féerie Exotique Mangue & Fruit de la Passion",
                    description: "Mousse légère vanille bourbon et biscuit génoise imbibé"
                },
                {
                    id: "noel-dessert-3",
                    title: "Pavlova d'Hiver aux Marrons & Myrtilles Sauvages",
                    description: "Meringue croquante, crème fouettée vanillée et marrons glacés"
                }
            ]
        },
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
        category: "nouvel_an",
        isPopular: true,
        courses: {
            entrees: [
                {
                    id: "sylvestre-entree-1",
                    title: "Carpaccio de Noix de Saint-Jacques & Émulsion Agrumes",
                    description: "Perles de yuzu, huile vierge à l'aneth et jeunes pousses croquantes"
                },
                {
                    id: "sylvestre-entree-2",
                    title: "Médaillon de Foie Gras Poêlé & Pain d'Épices Artisanal",
                    description: "Compotée de coings au miel d'acacia et réduction balsamique"
                }
            ],
            potages: [
                {
                    id: "sylvestre-potage-1",
                    title: "Bisque Onctueuse de Homard & Croûtons Dorés",
                    description: "Parfumée à l'estragon frais et pointe de cognac fine champagne"
                },
                {
                    id: "sylvestre-potage-2",
                    title: "Cappuccino de Cèpes & Noisettes Grillées",
                    description: "Mousse de lait truffée et brisures croustillantes de châtaigne"
                }
            ],
            plats: [
                {
                    id: "sylvestre-plat-1",
                    title: "Suprême de Chapon Farci aux Morilles & Vin Jaune",
                    description: "Gratin dauphinois à la crème d'Isigny et tombée de sous-bois"
                },
                {
                    id: "sylvestre-plat-2",
                    title: "Filet de Bœuf Simmental Sauce Périgourdine",
                    description: "Pommes grenailles confites au romarin et fagot de haricots fins"
                },
                {
                    id: "sylvestre-plat-3",
                    title: "Dos de Bar Sauvage Rôti au Beurre Blanc Citronné",
                    description: "Purée onctueuse de panais vanillée et tombée de jeunes épinards"
                }
            ],
            desserts: [
                {
                    id: "sylvestre-dessert-1",
                    title: "Sphère Scintillante Mangue-Passion & Vanille Intense",
                    description: "Sablé breton pur beurre et coulis exotique acidulé"
                },
                {
                    id: "sylvestre-dessert-2",
                    title: "Entremets Royal Chocolat Noir Intense & Feuillantine",
                    description: "Glaçage miroir étincelant et poudre d'or scintillante"
                },
                {
                    id: "sylvestre-dessert-3",
                    title: "Tartelette Sablée aux Noix de Pécan & Sirop d'Érable",
                    description: "Glace artisanale vanille bourbon de Madagascar"
                }
            ]
        },
        allergens: ["Gluten", "Lactose", "Crustacés", "Mollusques", "Œufs"]
    },
    {
        id: "menu-prestige-fetes",
        title: "Menu Dégustation Prestige",
        subtitle: "L'excellence gastronomique absolue pour les tables d'exception",
        badge: "Édition Limitée",
        price: 65.00,
        priceFormatted: "65,00 €",
        image: "/images/wedding_table.png",
        pickupDates: ["24 Décembre après 11h", "31 Décembre après 11h"],
        deadlineNotice: "Série limitée - Réservation anticipée requise",
        description: "Une expérience gastronomique d'exception mettant à l'honneur les trésors les plus précieux des fêtes.",
        category: "noel",
        isPopular: false,
        courses: {
            entrees: [
                {
                    id: "prestige-entree-1",
                    title: "Médaillon de Homard Bleu & Mousseline d'Avocat",
                    description: "Vinaigrette passion au poivre de Timut & tuile de corail croustillante"
                },
                {
                    id: "prestige-entree-2",
                    title: "Duo Festif : Foie Gras Mi-Cuit & Tartare de Saint-Jacques Truffé",
                    description: "Gelée de Sauternes millésimé et toasts briochés maison"
                }
            ],
            potages: [
                {
                    id: "prestige-potage-1",
                    title: "Consommé Double de Faisan aux Cèpes & Truffe Noire",
                    description: "Infusion lente aux herbes aromatiques et quenelle de volaille fine"
                },
                {
                    id: "prestige-potage-2",
                    title: "Velouté Parfumé de Châtaignes & Noix de Saint-Jacques Rôties",
                    description: "Huile de truffe blanche et jeunes pousses d'aneth"
                }
            ],
            plats: [
                {
                    id: "prestige-plat-1",
                    title: "Pavé de Veau de Lait Cuit Basse Température",
                    description: "Jus corsé au vin de Madère, grenailles confites et légumes glacés au miel"
                },
                {
                    id: "prestige-plat-2",
                    title: "Filet de Chevreuil Grand Veneur aux Airelles",
                    description: "Mousseline de céleri-rave et poire au vin chaud d'Alsace"
                },
                {
                    id: "prestige-plat-3",
                    title: "Lotte Rôtie au Lardo di Colonnata & Jus de Crustacés",
                    description: "Risotto carnaroli aux morilles et asperges vertes croquantes"
                }
            ],
            desserts: [
                {
                    id: "prestige-dessert-1",
                    title: "Création Impériale : Dôme Royal Or & Chocolat Grand Cru",
                    description: "Feuillantine pralinée, ganache intense 70% et éclat de feuille d'or"
                },
                {
                    id: "prestige-dessert-2",
                    title: "Lingot Croustillant Praliné Noisette du Piémont & Yuzu",
                    description: "Mousse ivoire vanille et cœur caramel coulant"
                },
                {
                    id: "prestige-dessert-3",
                    title: "Symphonie Glacée Champagne Rosé & Fruits Rouges Flambés",
                    description: "Crumble sablé amande et coulis de framboises sauvages"
                }
            ]
        },
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
        category: "enfant",
        isPopular: false,
        courses: {
            entrees: [
                {
                    id: "enfant-entree-1",
                    title: "Mini Feuilleté Croustillant au Jambon Artisanal & Fromage Doré",
                    description: "Petite sauce veloutée douce"
                },
                {
                    id: "enfant-entree-2",
                    title: "Petit Roulé de Saumon Doux & Cream Cheese",
                    description: "Mini toasts dorés croustillants"
                }
            ],
            potages: [
                {
                    id: "enfant-potage-1",
                    title: "Petit Velouté Doux de Potiron au Beurre Fermier",
                    description: "Mini croûtons croustillants dorés"
                },
                {
                    id: "enfant-potage-2",
                    title: "Bouillon Gourmand aux Petites Pâtes Étoiles",
                    description: "Petites boulettes de volaille fondantes"
                }
            ],
            plats: [
                {
                    id: "enfant-plat-1",
                    title: "Filet de Poulet Fermier Braisé & Pommes Noisettes Maison",
                    description: "Sauce crème douce et compote de pommes fraîches"
                },
                {
                    id: "enfant-plat-2",
                    title: "Mini Pavé de Saumon Doré & Écrasé de Pommes de Terre",
                    description: "Légère crème citronnée douce"
                },
                {
                    id: "enfant-plat-3",
                    title: "Émincé de Veau Fondant & Gratin Dauphinois Doux",
                    description: "Jus gourmand aux carottes glacées"
                }
            ],
            desserts: [
                {
                    id: "enfant-dessert-1",
                    title: "Mini Bûchette Gourmande Chocolat au Lait & Guimauve",
                    description: "Décoration lutin de Noël en sucre"
                },
                {
                    id: "enfant-dessert-2",
                    title: "Mousse Fondante au Chocolat Blanc & Coulis Fraise",
                    description: "Étoiles en chocolat pétillant"
                },
                {
                    id: "enfant-dessert-3",
                    title: "Duo de Glaces Artisanales (Vanille & Fraise) & Biscuit Sablé",
                    description: "Mini pépites festives croustillantes"
                }
            ]
        },
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

        if (id === 'menu-reveillon-noel' || id === 'menu-prestige-fetes' || id.startsWith('menu-reveillon-noel') || id.startsWith('menu-prestige-fetes') || nom.includes('noël') || nom.includes('noel') || nom.includes('prestige')) {
            hasNoel = true;
        } else if (id === 'menu-saint-sylvestre' || id.startsWith('menu-saint-sylvestre') || nom.includes('sylvestre') || nom.includes('nouvel an')) {
            hasNouvelAn = true;
        } else if (id === 'menu-enfant-fetes' || id.startsWith('menu-enfant-fetes') || nom.includes('enfant')) {
            hasEnfant = true;
        }
    });

    const isMixed = hasNoel && hasNouvelAn;
    const onlyEnfant = hasEnfant && !hasNoel && !hasNouvelAn;

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
    } else if (onlyEnfant) {
        allowedOptionIds = ["noel-24", "noel-25", "nouvel-an-31", "nouvel-an-01"];
        allowedPeriodLabel = "Menus Enfants : réservations disponibles pour le 24, 25, 31 Décembre & 1er Janvier.";
    }

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
