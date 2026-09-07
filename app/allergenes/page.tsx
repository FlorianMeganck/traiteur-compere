"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Sprout,
    Shell,
    Flower2,
    FlaskConical,
    Search,
    Check,
    ChevronDown,
    ShieldAlert,
    X,
    Utensils,
    Flame,
    Fish,
    Salad,
    Soup,
    Sparkles,
    Wine,
    Sandwich,
    Cake
} from "lucide-react";

// --- LES 14 ALLERGÈNES MAJEURS OBLIGATOIRES (RÈGLEMENT UE N° 1169/2011) ---

export type AllergenKey =
    | "GLU"
    | "CRU"
    | "OEU"
    | "POI"
    | "ARA"
    | "SOJ"
    | "LAI"
    | "FRU"
    | "CEL"
    | "MOU"
    | "SES"
    | "SUL"
    | "LUP"
    | "MOL";

export interface AllergenMeta {
    id: AllergenKey;
    short: string;
    name: string;
    description: string;
    image?: string;
    icon?: any;
    color: string;
}

const ALLERGENES: Record<AllergenKey, AllergenMeta> = {
    GLU: {
        id: "GLU",
        short: "GLU",
        name: "Gluten",
        description: "Blé, seigle, orge, avoine, épeautre et dérivés",
        image: "/allergene/ble.png",
        color: "bg-amber-100 text-amber-900 border-amber-300"
    },
    CRU: {
        id: "CRU",
        short: "CRU",
        name: "Crustacés",
        description: "Crevettes, scampis, homards, crabes, langoustines",
        image: "/allergene/crustace.png",
        color: "bg-orange-100 text-orange-900 border-orange-300"
    },
    OEU: {
        id: "OEU",
        short: "OEU",
        name: "Œufs",
        description: "Œufs de toutes volailles, ovoproduits, mayonnaises",
        image: "/allergene/oeuf.png",
        color: "bg-yellow-100 text-yellow-900 border-yellow-300"
    },
    POI: {
        id: "POI",
        short: "POI",
        name: "Poissons",
        description: "Poissons frais, fumés, anchois, préparations",
        image: "/allergene/poisson.png",
        color: "bg-blue-100 text-blue-900 border-blue-300"
    },
    ARA: {
        id: "ARA",
        short: "ARA",
        name: "Arachides",
        description: "Cacahuètes et dérivés",
        image: "/allergene/arachide.png",
        color: "bg-stone-100 text-stone-900 border-stone-300"
    },
    SOJ: {
        id: "SOJ",
        short: "SOJ",
        name: "Soja",
        description: "Soja, edamame, tofu, sauces et marinades soja",
        icon: Sprout,
        color: "bg-emerald-100 text-emerald-900 border-emerald-300"
    },
    LAI: {
        id: "LAI",
        short: "LAI",
        name: "Lait",
        description: "Lait, beurre, crèmes, fromages, lactose",
        image: "/allergene/lait.png",
        color: "bg-sky-100 text-sky-900 border-sky-300"
    },
    FRU: {
        id: "FRU",
        short: "FRU",
        name: "Fruits à coque",
        description: "Amandes, noix, noisettes, pignons de pin, pistaches",
        image: "/allergene/amande.png",
        color: "bg-teal-100 text-teal-900 border-teal-300"
    },
    CEL: {
        id: "CEL",
        short: "CEL",
        name: "Céleri",
        description: "Céleri branche, rave, graines, fonds de sauce",
        image: "/allergene/celeri.png",
        color: "bg-lime-100 text-lime-900 border-lime-300"
    },
    MOU: {
        id: "MOU",
        short: "MOU",
        name: "Moutarde",
        description: "Moutarde en pâte, graines et assaisonnements",
        image: "/allergene/moutarde.png",
        color: "bg-yellow-200 text-yellow-950 border-yellow-400"
    },
    SES: {
        id: "SES",
        short: "SES",
        name: "Sésame",
        description: "Graines de sésame, huile de sésame, tahini",
        image: "/allergene/sesame.png",
        color: "bg-orange-50 text-orange-950 border-orange-300"
    },
    SUL: {
        id: "SUL",
        short: "SUL",
        name: "Sulfites",
        description: "Vins, bières, vinaigrettes, confits d'oignons (> 10 mg/kg)",
        icon: FlaskConical,
        color: "bg-purple-100 text-purple-900 border-purple-300"
    },
    LUP: {
        id: "LUP",
        short: "LUP",
        name: "Lupin",
        description: "Farine de lupin et graines",
        icon: Flower2,
        color: "bg-rose-100 text-rose-900 border-rose-300"
    },
    MOL: {
        id: "MOL",
        short: "MOL",
        name: "Mollusques",
        description: "Moules, calamars, huîtres, Saint-Jacques, escargots",
        icon: Shell,
        color: "bg-slate-200 text-slate-900 border-slate-400"
    }
};

const ALLERGEN_KEYS: AllergenKey[] = [
    "GLU",
    "CRU",
    "OEU",
    "POI",
    "ARA",
    "SOJ",
    "LAI",
    "FRU",
    "CEL",
    "MOU",
    "SES",
    "SUL",
    "LUP",
    "MOL"
];

// --- DONNÉES DU CATALOGUE PAR CATÉGORIE ---

export interface MatrixDish {
    name: string;
    details?: string;
    allergens: AllergenKey[];
}

export interface MatrixCategory {
    id: string;
    title: string;
    icon: any;
    description: string;
    items: MatrixDish[];
}

const ALLERGEN_MATRIX: MatrixCategory[] = [
    {
        id: "saladbar",
        title: "Salad Bar & Bowls Fraîcheur",
        icon: Salad,
        description: "Compositions fraîches, salades composées et bowls signature.",
        items: [
            {
                name: "La Buddha Bowl Maison",
                details: "Pois chiches, lentilles corail, patate douce, avocat, graines et tahini",
                allergens: ["SES"]
            },
            {
                name: "La Jardinière du Compère",
                details: "Boulgour, chèvre fermier, noix torréfiées, miel-balsamique, parmesan",
                allergens: ["GLU", "LAI", "FRU", "SUL"]
            },
            {
                name: "La Fraîcheur Méditerranéenne",
                details: "Quinoa, filet de poulet rôti, véritable feta, graines de courge, vinaigrette",
                allergens: ["LAI", "MOU", "SUL"]
            },
            {
                name: "La César Revisitée du Compère",
                details: "Cœur de romaine, poulet, parmesan, croûtons, œuf dur, sauce César aux anchois",
                allergens: ["GLU", "LAI", "OEU", "POI", "MOU", "SUL"]
            },
            {
                name: "La Caprese du Compère",
                details: "Orecchiette artisanales, mozzarella di bufala, pesto génois aux pignons",
                allergens: ["GLU", "LAI", "FRU", "SUL"]
            },
            {
                name: "La Compère Campagnarde",
                details: "Charcuteries de nos fermes, œuf dur, croûtons, oignons confits au vin rouge",
                allergens: ["GLU", "OEU", "MOU", "SUL"]
            },
            {
                name: "La Power Bowl",
                details: "Pavé de saumon frais ou émincé de bœuf, œuf mollet, edamame, chia et sésame",
                allergens: ["POI", "OEU", "SOJ", "SES"]
            },
            {
                name: "La Nordique",
                details: "Saumon fumé maison, crevettes grises de la mer du Nord, œuf dur, sauce aneth",
                allergens: ["POI", "CRU", "OEU", "LAI", "MOU"]
            }
        ]
    },
    {
        id: "sauces",
        title: "Sauces Chaudes, Froides & Accompagnements",
        icon: Soup,
        description: "Sauces maison, féculents, légumes cuisinés et pains.",
        items: [
            {
                name: "Sauce au poivre noir concassé",
                details: "Crème fraîche, beurre de ferme, fond de veau réduit, cognac",
                allergens: ["LAI", "CEL", "SUL"]
            },
            {
                name: "Sauce béarnaise minute",
                details: "Beurre clarifié, jaunes d'œufs, réduction d'échalotes au vin blanc et estragon",
                allergens: ["LAI", "OEU", "SUL"]
            },
            {
                name: "Sauce dijonnaise à l'ancienne",
                details: "Moutarde de Dijon et graines, crème fraîche, vin blanc",
                allergens: ["MOU", "LAI", "SUL"]
            },
            {
                name: "Sauce crème aux champignons des bois",
                details: "Champignons frais, crème entière, beurre, échalote au vin blanc",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Sauce au fond de volaille & liégeoise",
                details: "Fond de volaille lié au roux de blé, céleri, sirop de Liège",
                allergens: ["GLU", "CEL", "SUL"]
            },
            {
                name: "Sauces froides maison (Mayonnaise, Tartare, Cocktail, Ail)",
                details: "Préparées aux jaunes d'œufs frais, huile, moutarde, vinaigre",
                allergens: ["OEU", "MOU", "SUL", "LAI"]
            },
            {
                name: "Gratin Dauphinois traditionnel",
                details: "Pommes de terre, crème fraîche, lait, œuf, muscade",
                allergens: ["LAI", "OEU"]
            },
            {
                name: "Pâtes fraîches & Orecchiette",
                details: "Semoule de blé dur et œufs frais",
                allergens: ["GLU", "OEU"]
            },
            {
                name: "Pommes de terre grenailles au romarin",
                details: "Cuites au four à l'huile d'olive et herbes",
                allergens: []
            },
            {
                name: "Frites fraîches artisanales",
                details: "Pommes de terre Bintje, bain d'huile végétale dédiée",
                allergens: []
            },
            {
                name: "Poêlée de légumes chauds cuisinés & Tomate provençale",
                details: "Légumes de saison sautés à l'huile d'olive, bouillon de légumes",
                allergens: ["CEL"]
            },
            {
                name: "Salade de pâtes fraîches au pesto / curry",
                details: "Pâtes au blé, mayonnaise maison, moutarde, crème, curry ou pesto",
                allergens: ["GLU", "LAI", "OEU", "MOU"]
            },
            {
                name: "Taboulé oriental à la menthe fraîche",
                details: "Semoule de blé, tomates, menthe, persil, citron et huile d'olive",
                allergens: ["GLU"]
            },
            {
                name: "Salade de pommes de terre à l'ancienne",
                details: "Pommes de terre, mayonnaise maison, échalotes et ciboulette",
                allergens: ["OEU", "MOU", "SUL"]
            },
            {
                name: "Petits pains artisanaux & Baguettes tradition",
                details: "Farine panifiable au blé et levain",
                allergens: ["GLU"]
            }
        ]
    },
    {
        id: "bbq",
        title: "Barbecue & Viandes Grillées",
        icon: Flame,
        description: "Grillades au feu de bois, viandes marinées et saucisses artisanales.",
        items: [
            {
                name: "Saucisses & Chipolatas artisanales (Nature, Campagne, BBQ, Italienne)",
                details: "Boyau naturel, épices maison, moutarde, farine de liaison, sel",
                allergens: ["GLU", "MOU", "SUL"]
            },
            {
                name: "Saucisses de volaille (Nature, Fromage)",
                details: "Viande de volaille sélectionnée, fromage fondant, épices douces",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Merguez artisanale pur bœuf et agneau",
                details: "Épices orientales douces, piment doux, sel",
                allergens: ["SUL"]
            },
            {
                name: "Boudins artisanaux (Blanc et Noir)",
                details: "Lait entier, œufs, mie de pain au blé, oignons",
                allergens: ["GLU", "LAI", "OEU"]
            },
            {
                name: "Brochettes marinées (Bœuf, Porc, Volaille, Dinde)",
                details: "Marinade à l'huile végétale, sauce soja, moutarde et vin",
                allergens: ["SOJ", "MOU", "SUL"]
            },
            {
                name: "Braisade de porc & de bœuf marinée",
                details: "Tranches fines marinées aux herbes, soja, moutarde et épices fumées",
                allergens: ["SOJ", "MOU", "SUL"]
            },
            {
                name: "Braisade de canard aux trois poivres",
                details: "Magret tranché, beurre aux trois poivres, réduction de vin",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Spare ribs marinés au miel & épices",
                details: "Travers de porc caramélisés au miel, sauce soja, moutarde",
                allergens: ["SOJ", "MOU", "SUL"]
            },
            {
                name: "Côte d'agneau & Tranche de gigot marinées ail & herbes",
                details: "Huile d'olive, ail pilé, romarin, pointe de vin blanc",
                allergens: ["SUL"]
            },
            {
                name: "Viandes Nobles au grill (Tomahawk, Côte à l'os, Entrecôte)",
                details: "Bœuf sélectionné non mariné, cuit sur braises, fleur de sel uniquement",
                allergens: []
            },
            {
                name: "Cochon de lait doré à la broche & Porchetta artisanale",
                details: "Rôtissage lent au feu de bois, frottage sel de marinade, moutarde, herbes",
                allergens: ["MOU", "SUL"]
            },
            {
                name: "Options Végétariennes BBQ (Halloumi, Tofu teriyaki)",
                details: "Fromage halloumi brebis/chèvre, tofu mariné au soja teriyaki, sésame",
                allergens: ["GLU", "LAI", "SOJ", "SES"]
            }
        ]
    },
    {
        id: "mer",
        title: "Poissons & Fruits de Mer",
        icon: Fish,
        description: "Poissons frais et fruits de mer cuits au grill ou en papillote.",
        items: [
            {
                name: "Brochette de scampis marinés à l'ail doux",
                details: "Scampis décortiqués, huile aux herbes, ail",
                allergens: ["CRU", "SUL"]
            },
            {
                name: "Brochette de Saint-Jacques & Scampis",
                details: "Noix de Saint-Jacques et scampis, assaisonnement citronné",
                allergens: ["CRU", "MOL", "SUL"]
            },
            {
                name: "Pavé de saumon papilloté à l'aneth & fenouil",
                details: "Saumon atlantique frais, fenouil, aneth et huile d'olive",
                allergens: ["POI"]
            },
            {
                name: "Gambas géantes grillées à la plancha",
                details: "Gambas entières saisies aux herbes",
                allergens: ["CRU"]
            },
            {
                name: "Homard grillé au beurre blanc fin",
                details: "Demi-homard fendu au grill, beurre monté aux herbes",
                allergens: ["CRU", "LAI"]
            },
            {
                name: "Moules en papillote au vin blanc & céleri",
                details: "Moules de bouchot, brunoise de céleri, échalote et vin blanc",
                allergens: ["MOL", "CEL", "SUL"]
            }
        ]
    },
    {
        id: "buffets",
        title: "Buffets Froids (Campagnard, Ardennais, Réception, Gala)",
        icon: Wine,
        description: "Terrines, salaisons artisanales, poissons froids et pièces de réception.",
        items: [
            {
                name: "Pâté en croûte de campagne & confit d'oignons",
                details: "Pâte au blé et beurre, farce porc et volaille, œufs, pistaches, vin",
                allergens: ["GLU", "LAI", "OEU", "FRU", "SUL"]
            },
            {
                name: "Terrines artisanales de poisson & légumes",
                details: "Chair de poisson, crème, œufs, julienne de légumes",
                allergens: ["POI", "LAI", "OEU"]
            },
            {
                name: "Pêche au thon & Mayonnaise maison",
                details: "Thon blanc émietté, mayonnaise aux œufs frais et moutarde",
                allergens: ["POI", "OEU", "MOU"]
            },
            {
                name: "Tomate aux crevettes grises de la mer du Nord",
                details: "Crevettes grises, mayonnaise maison, jus de citron",
                allergens: ["CRU", "OEU", "MOU"]
            },
            {
                name: "Saumon fumé extra doux & Médaillon en belle-vue",
                details: "Saumon fumé au bois de hêtre, œufs mimosa, mayonnaise",
                allergens: ["POI", "OEU"]
            },
            {
                name: "Viandes froides braisées (Porc, Bœuf, Volaille)",
                details: "Rôti cuit à cœur, frottage moutarde et vin blanc",
                allergens: ["MOU", "SUL"]
            },
            {
                name: "Foie gras de canard mi-cuit artisanal & confit",
                details: "Foie gras cuit au torchon, pointe de Sauternes, crème",
                allergens: ["LAI", "OEU", "SUL"]
            },
            {
                name: "Cascade de fruits de mer (Huîtres, crevettes, bulots)",
                details: "Plateau de mer, huîtres creuses, bulots au court-bouillon",
                allergens: ["CRU", "MOL", "SUL"]
            },
            {
                name: "Carpaccio de bœuf mariné & copeaux de parmesan",
                details: "Bœuf charolais, parmesan au lait de vache, câpres",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Plateau de charcuteries fines (Jambon d'Ardenne, saucisson)",
                details: "Salaisons ardennaises, cornichons et moutarde",
                allergens: ["MOU", "SUL"]
            }
        ]
    },
    {
        id: "collectivite",
        title: "Buffets Chauds & Plats Uniques Mijotés",
        icon: Utensils,
        description: "Plats traditionnels mijotés servis chauds en réceptions.",
        items: [
            {
                name: "Carbonnade flamande à la bière d'abbaye",
                details: "Bœuf mijoté à la bière, pain d'épices au blé tartiné de moutarde, oignons",
                allergens: ["GLU", "MOU", "SUL"]
            },
            {
                name: "Blanquette de veau à l'ancienne",
                details: "Veau tendre, carottes, céleri, sauce liée au roux de blé, crème",
                allergens: ["GLU", "LAI", "CEL"]
            },
            {
                name: "Boulets liégeois sauce lapin & chasseur",
                details: "Haché porc et bœuf, mie de pain, œufs, crème, sirop de Liège, oignons, bière",
                allergens: ["GLU", "LAI", "OEU", "CEL", "MOU", "SUL"]
            },
            {
                name: "Lasagne maison à la bolognaise",
                details: "Pâtes au blé et œuf, béchamel au lait et beurre, parmesan, céleri",
                allergens: ["GLU", "LAI", "OEU", "CEL"]
            },
            {
                name: "Lasagne au saumon et épinards al verde",
                details: "Pâtes au blé et œuf, saumon frais, crème, béchamel au lait",
                allergens: ["GLU", "LAI", "OEU", "POI"]
            },
            {
                name: "Waterzooi de poisson à la gantoise",
                details: "Filets de poisson du jour, julienne de poireaux et céleri, bouillon crème",
                allergens: ["POI", "LAI", "CEL"]
            },
            {
                name: "Vol-au-vent de poularde de ferme",
                details: "Croûte feuilletée au blé et beurre, blancs de volaille, boulettes, crème, céleri",
                allergens: ["GLU", "LAI", "OEU", "CEL"]
            },
            {
                name: "Chicons farcis au lard fumé & purée onctueuse",
                details: "Chicons braisés, haché assaisonné à la chapelure, purée au beurre et lait",
                allergens: ["GLU", "LAI", "OEU", "SUL"]
            },
            {
                name: "Cuisse de lapin à la bière & compote artisanale",
                details: "Lapin mijoté à la bière, sauce liée, compote de pommes",
                allergens: ["GLU", "SUL"]
            },
            {
                name: "Tartiflette au Reblochon fermier AOP",
                details: "Pommes de terre, lardons au vin blanc, crème, Reblochon au lait cru",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Potées traditionnelles (Liégeoise, Carottes, Choux)",
                details: "Légumes d'hiver pilés, céleri, lardons, saucisse de campagne, beurre",
                allergens: ["CEL", "SUL", "LAI"]
            }
        ]
    },
    {
        id: "zakouskis",
        title: "Apéritifs, Zakouskis & Mises en bouche",
        icon: Sparkles,
        description: "Bouchées festives, zakouskis chauds et froids pour réceptions.",
        items: [
            {
                name: "Falafels artisanaux et crème de sésame tahini",
                details: "Pois chiches, coriandre, graines de sésame, liant végétal au blé",
                allergens: ["GLU", "SES"]
            },
            {
                name: "Croquettes de fromage de nos régions / Arancini",
                details: "Appareil au lait et beurre, fromages affinés, panure au blé",
                allergens: ["GLU", "LAI", "OEU"]
            },
            {
                name: "Roulé de saumon au fromage frais et aneth",
                details: "Galette fine, crème fromagère au lait, saumon fumé",
                allergens: ["GLU", "LAI", "POI"]
            },
            {
                name: "Sushi rolls & Tataki de thon mariné",
                details: "Thon rouge snacké, riz vinaigré, marinade soja et graines de sésame",
                allergens: ["POI", "SOJ", "SES"]
            },
            {
                name: "Nems croustillants & Gambas tempura",
                details: "Galette de blé croustillante, farce porc ou crevettes, sauce soja",
                allergens: ["GLU", "CRU", "SOJ"]
            },
            {
                name: "Mini burgers Black Angus du Compère",
                details: "Pain brioché au sésame, steak Angus, cheddar fondant, sauce moutardée",
                allergens: ["GLU", "LAI", "OEU", "SES", "MOU"]
            },
            {
                name: "Mini vol-au-vent aux ris de veau",
                details: "Bouchée feuilletée au blé, ris de veau, crème, céleri",
                allergens: ["GLU", "LAI", "OEU", "CEL"]
            }
        ]
    },
    {
        id: "verrines",
        title: "Verrines Salées Gourmandes",
        icon: Wine,
        description: "Verrines fraîches présentées en verrerie pour cocktails dînatoires.",
        items: [
            {
                name: "Verrine italienne parmesan, mozzarella & pesto aux pignons",
                details: "Tomates confites, mozzarella di bufala, pesto au basilic, pignons de pin",
                allergens: ["LAI", "FRU"]
            },
            {
                name: "Mousse d'avocat onctueuse & Crevettes grises",
                details: "Avocat monté au mascarpone et crème, crevettes grises, citron",
                allergens: ["CRU", "LAI"]
            },
            {
                name: "Tartare de saumon frais au yuzu & fines herbes",
                details: "Saumon atlantique mariné au citron vert et vin doux, échalote",
                allergens: ["POI", "SUL"]
            },
            {
                name: "Carpaccio de bœuf au parmesan & câpres",
                details: "Bœuf mariné à l'huile et vinaigre, copeaux de parmesan",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Mousse de foie de canard au Sauternes & brioche",
                details: "Foie gras émulsionné à la crème, réduction de Sauternes, œuf",
                allergens: ["LAI", "OEU", "SUL"]
            },
            {
                name: "Dôme de chocolat noir & cœur praliné aux noisettes",
                details: "Chocolat grand cru, crème entière, praliné noisettes et amandes",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            }
        ]
    },
    {
        id: "pains",
        title: "Petits Pains Garnis, Pains Surprises & Wraps",
        icon: Sandwich,
        description: "Assortiment de petits pains fermés, ouverts et wraps traiteur.",
        items: [
            {
                name: "Pains garnis Côté Mer (Crabe, Thon mayonnaise, Saumon fumé)",
                details: "Pain brioché au blé, mayonnaise maison aux œufs et moutarde, crabe",
                allergens: ["GLU", "POI", "CRU", "OEU", "MOU"]
            },
            {
                name: "Pains garnis Côté Boucherie (Américain préparé, Jambon fermier)",
                details: "Pain au blé, américain à la mayonnaise et câpres, jambon et beurre",
                allergens: ["GLU", "OEU", "MOU", "SUL", "LAI"]
            },
            {
                name: "Pains garnis Côté Fromager (Abbaye, Brie de Meaux, Chèvre)",
                details: "Pain au blé, fromages affinés, beurre, cerneaux de noix",
                allergens: ["GLU", "LAI", "OEU", "MOU", "FRU"]
            },
            {
                name: "Le Suédois signature (Pain polaire, Saumon fumé, Philadelphia)",
                details: "Pain polaire au seigle et blé, fromage frais, aneth",
                allergens: ["GLU", "LAI", "POI"]
            },
            {
                name: "L'Instant Wraps (Le Norvégien & Le Maraîcher)",
                details: "Galette de blé, tartinable au fromage frais, légumes ou saumon",
                allergens: ["GLU", "LAI", "POI", "OEU", "MOU"]
            }
        ]
    },
    {
        id: "desserts",
        title: "Desserts, Mignardises & Fromages",
        icon: Cake,
        description: "Douceurs sucrées, pièces montées et fromages affinés.",
        items: [
            {
                name: "Cascade de desserts traditionnels",
                details: "Mousses au chocolat, bavarois fruits rouges, tartelettes amandines",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            },
            {
                name: "Plateau de mignardises artisanales",
                details: "Mini éclairs, tartelettes citron meringuées, financiers aux amandes",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            },
            {
                name: "Macarons artisanaux aux amandes",
                details: "Poudre d'amandes pures, blancs d'œufs meringués, ganaches chocolat",
                allergens: ["OEU", "FRU", "LAI"]
            },
            {
                name: "Buffet de fromages affinés de nos régions & assortiment de pains",
                details: "Fromages belges et français, raisins, noix sèches, pains au blé",
                allergens: ["LAI", "GLU", "FRU", "SUL"]
            },
            {
                name: "Gâteau de mariage & Pièce montée personnalisée",
                details: "Génoise fine au blé, crème mousseline au beurre et lait, œufs, amandes",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            }
        ]
    }
];

// --- SURVEILLANCE DES PARAMÈTRES D'URL (DEEP LINKING) ---

function SectionWatcher({ onOpenSection }: { onOpenSection: (sec: string) => void }) {
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get("section")?.toLowerCase();

    useEffect(() => {
        if (!sectionParam) return;

        const aliasMap: Record<string, string> = {
            bbq: "bbq",
            mer: "mer",
            accompagnements: "sauces",
            sauces: "sauces",
            buffets: "buffets",
            collectivite: "collectivite",
            saladbar: "saladbar",
            zakouskis: "zakouskis",
            verrines: "verrines",
            pains: "pains",
            desserts: "desserts"
        };

        const target = aliasMap[sectionParam] || sectionParam;
        onOpenSection(target);

        setTimeout(() => {
            const element = document.getElementById(`accordion-${target}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);
    }, [sectionParam, onOpenSection]);

    return null;
}

// --- COMPOSANT PRINCIPAL ---

export default function AllergenesPage() {
    // Liste des sections ouvertes (accordéons)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        saladbar: true // On ouvre la première section par défaut pour guider l'utilisateur
    });

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [excludeAllergen, setExcludeAllergen] = useState<AllergenKey | "none">("none");
    const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);

    // Ouvrir automatiquement une section spécifique (ex: deep link)
    const handleOpenSection = (sectionId: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: true
        }));
    };

    // Bascule d'un accordéon au clic
    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Tout déplier / Tout replier
    const areAllOpen = useMemo(() => {
        return ALLERGEN_MATRIX.every((cat) => openSections[cat.id]);
    }, [openSections]);

    const toggleAllSections = () => {
        const nextState = !areAllOpen;
        const newMap: Record<string, boolean> = {};
        ALLERGEN_MATRIX.forEach((cat) => {
            newMap[cat.id] = nextState;
        });
        setOpenSections(newMap);
    };

    // Filtrage des plats
    const filteredCategories = useMemo(() => {
        return ALLERGEN_MATRIX.map((cat) => {
            const filteredItems = cat.items.filter((dish) => {
                // Recherche textuelle
                if (searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase().trim();
                    const matchName = dish.name.toLowerCase().includes(q);
                    const matchDetails = dish.details ? dish.details.toLowerCase().includes(q) : false;
                    if (!matchName && !matchDetails) return false;
                }

                // Exclusion d'un allergène
                if (excludeAllergen !== "none") {
                    if (dish.allergens.includes(excludeAllergen)) {
                        return false;
                    }
                }

                return true;
            });

            if (filteredItems.length === 0) return null;

            return {
                ...cat,
                items: filteredItems
            };
        }).filter(Boolean) as MatrixCategory[];
    }, [searchQuery, excludeAllergen]);

    // Ouvrir automatiquement les sections qui ont des résultats lors d'une recherche active
    useEffect(() => {
        if (searchQuery.trim() !== "" || excludeAllergen !== "none") {
            const openMap: Record<string, boolean> = {};
            filteredCategories.forEach((cat) => {
                openMap[cat.id] = true;
            });
            setOpenSections(openMap);
        }
    }, [searchQuery, excludeAllergen, filteredCategories]);

    const totalDisplayedItems = useMemo(() => {
        return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
    }, [filteredCategories]);

    return (
        <main className="min-h-screen pt-28 pb-20 bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-[#D4AF37] selection:text-white">
            <Suspense fallback={null}>
                <SectionWatcher onOpenSection={handleOpenSection} />
            </Suspense>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* En-tête épuré */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2 block">
                        Information Alimentaire
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-3">
                        Matrice des Allergènes
                    </h1>
                    <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4"></div>
                    <p className="text-neutral-600 font-light text-sm md:text-base leading-relaxed">
                        Consultez facilement les <strong>14 allergènes majeurs</strong> présents dans nos formules. Cliquez sur une catégorie pour déplier son tableau détaillé.
                    </p>
                </div>

                {/* Barre de Recherche & Contrôles Rapides */}
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-neutral-200/90 mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        {/* Champ de recherche instantanée */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un plat (ex: Buddha, Béarnaise, Saumon, Lasagne...)"
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder-neutral-400 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
                                    aria-label="Effacer"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filtre par allergène à exclure */}
                        <div className="flex items-center gap-2">
                            <select
                                value={excludeAllergen}
                                onChange={(e) => setExcludeAllergen(e.target.value as AllergenKey | "none")}
                                className="py-2 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-700 focus:border-[#D4AF37] focus:bg-white focus:outline-none cursor-pointer w-full sm:w-auto"
                            >
                                <option value="none">Tous les plats</option>
                                <option value="GLU">Sans Gluten</option>
                                <option value="LAI">Sans Lait / Lactose</option>
                                <option value="OEU">Sans Œufs</option>
                                <option value="POI">Sans Poissons</option>
                                <option value="CRU">Sans Crustacés</option>
                                <option value="FRU">Sans Fruits à coque</option>
                                <option value="SOJ">Sans Soja</option>
                                <option value="MOU">Sans Moutarde</option>
                                <option value="SES">Sans Sésame</option>
                                <option value="SUL">Sans Sulfites</option>
                            </select>
                        </div>

                        {/* Bouton Tout déplier / Tout replier */}
                        <button
                            type="button"
                            onClick={toggleAllSections}
                            className="px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 uppercase tracking-wider transition-colors whitespace-nowrap"
                        >
                            {areAllOpen ? "Tout replier" : "Tout déplier"}
                        </button>
                    </div>

                    {/* Sous-barre : Légende pliable & Compteur */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                        <button
                            type="button"
                            onClick={() => setIsLegendOpen(!isLegendOpen)}
                            className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-[#D4AF37] font-semibold transition-colors"
                        >
                            <span>ℹ️ Légende des 14 symboles</span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${isLegendOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        <div className="flex items-center gap-3">
                            {excludeAllergen !== "none" && (
                                <button
                                    onClick={() => setExcludeAllergen("none")}
                                    className="text-[#D4AF37] hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    Filtre : Sans {ALLERGENES[excludeAllergen].name} (fermer)
                                    <X size={12} />
                                </button>
                            )}
                            <span className="font-medium">
                                {totalDisplayedItems} préparation{totalDisplayedItems > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Tiroir déroulant de la légende des 14 Allergènes */}
                    <AnimatePresence>
                        {isLegendOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden pt-3"
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                                    {ALLERGEN_KEYS.map((key) => {
                                        const meta = ALLERGENES[key];
                                        const IconComponent = meta.icon;
                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-neutral-200/60"
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${meta.color}`}
                                                >
                                                    {meta.image ? (
                                                        <div className="relative w-4 h-4">
                                                            <Image
                                                                src={meta.image}
                                                                alt={meta.name}
                                                                fill
                                                                className="object-contain"
                                                                sizes="16px"
                                                            />
                                                        </div>
                                                    ) : IconComponent ? (
                                                        <IconComponent size={13} strokeWidth={2} />
                                                    ) : (
                                                        <span className="text-[9px] font-bold">{meta.short}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[11px] font-bold text-neutral-800 block truncate">
                                                        {meta.short}
                                                    </span>
                                                    <span className="text-[9px] text-neutral-500 block truncate">
                                                        {meta.name}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* LISTE DES ACCORDÉONS (Catégories compactes dépliables) */}
                <div className="space-y-3">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => {
                            const isOpen = !!openSections[category.id];
                            const CategoryIcon = category.icon;

                            return (
                                <div
                                    key={category.id}
                                    id={`accordion-${category.id}`}
                                    className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-200"
                                >
                                    {/* Bouton d'en-tête de l'accordéon */}
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(category.id)}
                                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors gap-4"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                    isOpen
                                                        ? "bg-[#D4AF37] text-white"
                                                        : "bg-neutral-100 text-neutral-700"
                                                }`}
                                            >
                                                <CategoryIcon size={20} strokeWidth={1.75} />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-base md:text-lg font-serif font-bold text-neutral-900 truncate">
                                                    {category.title}
                                                </h2>
                                                <p className="text-xs text-neutral-500 font-light truncate hidden sm:block">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                                                {category.items.length} plat{category.items.length > 1 ? "s" : ""}
                                            </span>
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600 transition-transform duration-300 ${
                                                    isOpen ? "rotate-180 bg-[#D4AF37]/20 text-[#D4AF37]" : ""
                                                }`}
                                            >
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Contenu déroulant : Tableau matriciel clair */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden border-t border-neutral-100"
                                            >
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                                        <thead>
                                                            <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                                                                <th className="sticky left-0 bg-neutral-50 z-20 py-2.5 px-4 w-64 md:w-80 border-r border-neutral-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                                                                    Plat & Ingrédients
                                                                </th>
                                                                {ALLERGEN_KEYS.map((key) => {
                                                                    const meta = ALLERGENES[key];
                                                                    return (
                                                                        <th
                                                                            key={key}
                                                                            className="py-2 px-1 text-center font-mono w-9"
                                                                            title={`${meta.name} : ${meta.description}`}
                                                                        >
                                                                            <span className="block">{meta.short}</span>
                                                                        </th>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-neutral-100 text-sm">
                                                            {category.items.map((dish, idx) => {
                                                                const hasNoAllergens = dish.allergens.length === 0;

                                                                return (
                                                                    <tr
                                                                        key={idx}
                                                                        className={`hover:bg-[#FAF9F6] transition-colors ${
                                                                            idx % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                                                                        }`}
                                                                    >
                                                                        {/* Intitulé du plat (Sticky left) */}
                                                                        <td
                                                                            className={`sticky left-0 z-10 py-2.5 px-4 border-r border-neutral-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)] ${
                                                                                idx % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]"
                                                                            }`}
                                                                        >
                                                                            <div className="font-semibold text-neutral-900 text-xs md:text-sm">
                                                                                {dish.name}
                                                                            </div>
                                                                            {dish.details && (
                                                                                <p className="text-[11px] text-neutral-500 font-light mt-0.5 line-clamp-2">
                                                                                    {dish.details}
                                                                                </p>
                                                                            )}
                                                                            {hasNoAllergens && (
                                                                                <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                                                                    Aucun allergène majeur
                                                                                </span>
                                                                            )}
                                                                        </td>

                                                                        {/* Les 14 Colonnes de cochage */}
                                                                        {ALLERGEN_KEYS.map((key) => {
                                                                            const isPresent = dish.allergens.includes(key);
                                                                            const meta = ALLERGENES[key];

                                                                            return (
                                                                                <td
                                                                                    key={key}
                                                                                    className="py-2 px-1 text-center align-middle border-r border-neutral-100 last:border-r-0"
                                                                                >
                                                                                    {isPresent ? (
                                                                                        <div
                                                                                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D4AF37] text-black shadow-xs mx-auto font-bold text-[10px]"
                                                                                            title={`${dish.name} contient : ${meta.name}`}
                                                                                        >
                                                                                            <Check size={12} strokeWidth={3} />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-neutral-200 text-xs select-none">
                                                                                            ·
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200">
                            <ShieldAlert size={36} className="mx-auto text-neutral-400 mb-3" />
                            <h3 className="text-lg font-serif text-black mb-1">Aucune préparation trouvée</h3>
                            <p className="text-neutral-500 text-xs max-w-sm mx-auto mb-4">
                                Aucun plat ne correspond à vos critères de recherche ou d&apos;exclusion d&apos;allergène.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setExcludeAllergen("none");
                                }}
                                className="px-5 py-2 rounded-full bg-black text-white text-xs uppercase font-bold tracking-wider hover:bg-[#D4AF37] transition-colors"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </div>

                {/* MENTION LÉGALE OBLIGATOIRE (Sobre et rassurante) */}
                <div className="mt-12 bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-xs text-center max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-2">
                        <ShieldAlert size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
                            Sécurité Sanitaire & Traçabilité
                        </span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-600 font-light leading-relaxed max-w-xl mx-auto italic">
                        « Nos préparations sont réalisées dans un atelier utilisant des produits contenant l&apos;ensemble des 14 allergènes majeurs. En cas d&apos;allergie sévère, merci de le signaler impérativement lors de votre demande de devis. »
                    </p>
                    <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-wider text-xs transition-all shadow-sm"
                        >
                            Signaler une allergie lors d&apos;un devis
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="text-xs text-neutral-500 hover:text-black uppercase tracking-wider font-semibold underline"
                        >
                            Haut de page ↑
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
