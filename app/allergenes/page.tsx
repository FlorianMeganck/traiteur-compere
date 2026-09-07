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
    Table as TableIcon,
    LayoutGrid,
    ShieldAlert,
    X,
    UtensilsCrossed
} from "lucide-react";

// --- LES 14 ALLERGÈNES MAJEURS OBLIGATOIRES (Règlement UE n° 1169/2011) ---

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
    badgeBg: string;
    badgeText: string;
    borderColor: string;
}

const ALLERGENES: Record<AllergenKey, AllergenMeta> = {
    GLU: {
        id: "GLU",
        short: "GLU",
        name: "Gluten",
        description: "Blé, seigle, orge, avoine, épeautre, kamut et dérivés",
        image: "/allergene/ble.png",
        color: "bg-amber-100 text-amber-900 border-amber-300",
        badgeBg: "bg-amber-500",
        badgeText: "text-white",
        borderColor: "border-amber-500"
    },
    CRU: {
        id: "CRU",
        short: "CRU",
        name: "Crustacés",
        description: "Crevettes, scampis, homards, crabes, langoustines, écrevisses",
        image: "/allergene/crustace.png",
        color: "bg-orange-100 text-orange-900 border-orange-300",
        badgeBg: "bg-orange-500",
        badgeText: "text-white",
        borderColor: "border-orange-500"
    },
    OEU: {
        id: "OEU",
        short: "OEU",
        name: "Œufs",
        description: "Œufs de toutes volailles, ovoproduits, mayonnaises, préparations liantes",
        image: "/allergene/oeuf.png",
        color: "bg-yellow-100 text-yellow-900 border-yellow-300",
        badgeBg: "bg-yellow-500",
        badgeText: "text-white",
        borderColor: "border-yellow-500"
    },
    POI: {
        id: "POI",
        short: "POI",
        name: "Poissons",
        description: "Poissons de mer et d'eau douce, fumés, frais, anchois, gélatines de poisson",
        image: "/allergene/poisson.png",
        color: "bg-blue-100 text-blue-900 border-blue-300",
        badgeBg: "bg-blue-500",
        badgeText: "text-white",
        borderColor: "border-blue-500"
    },
    ARA: {
        id: "ARA",
        short: "ARA",
        name: "Arachides",
        description: "Cacahuètes, pâte et huile d'arachide",
        image: "/allergene/arachide.png",
        color: "bg-stone-100 text-stone-900 border-stone-300",
        badgeBg: "bg-stone-600",
        badgeText: "text-white",
        borderColor: "border-stone-600"
    },
    SOJ: {
        id: "SOJ",
        short: "SOJ",
        name: "Soja",
        description: "Soja, edamame, tofu, sauces soja, marinades au soja",
        icon: Sprout,
        color: "bg-emerald-100 text-emerald-900 border-emerald-300",
        badgeBg: "bg-emerald-600",
        badgeText: "text-white",
        borderColor: "border-emerald-600"
    },
    LAI: {
        id: "LAI",
        short: "LAI",
        name: "Lait",
        description: "Lait, beurre, crèmes fraîches, fromages, lactose",
        image: "/allergene/lait.png",
        color: "bg-sky-100 text-sky-900 border-sky-300",
        badgeBg: "bg-sky-500",
        badgeText: "text-white",
        borderColor: "border-sky-500"
    },
    FRU: {
        id: "FRU",
        short: "FRU",
        name: "Fruits à coque",
        description: "Amandes, noix, noisettes, noix de cajou, pignons de pin, pistaches",
        image: "/allergene/amande.png",
        color: "bg-teal-100 text-teal-900 border-teal-300",
        badgeBg: "bg-teal-600",
        badgeText: "text-white",
        borderColor: "border-teal-600"
    },
    CEL: {
        id: "CEL",
        short: "CEL",
        name: "Céleri",
        description: "Céleri branche, rave, graines de céleri, fonds de sauce",
        image: "/allergene/celeri.png",
        color: "bg-lime-100 text-lime-900 border-lime-300",
        badgeBg: "bg-lime-600",
        badgeText: "text-white",
        borderColor: "border-lime-600"
    },
    MOU: {
        id: "MOU",
        short: "MOU",
        name: "Moutarde",
        description: "Moutarde en pâte, graines de moutarde, assaisonnements",
        image: "/allergene/moutarde.png",
        color: "bg-yellow-200 text-yellow-950 border-yellow-400",
        badgeBg: "bg-amber-600",
        badgeText: "text-white",
        borderColor: "border-amber-600"
    },
    SES: {
        id: "SES",
        short: "SES",
        name: "Sésame",
        description: "Graines de sésame, huile de sésame, tahini",
        image: "/allergene/sesame.png",
        color: "bg-orange-50 text-orange-950 border-orange-300",
        badgeBg: "bg-orange-600",
        badgeText: "text-white",
        borderColor: "border-orange-600"
    },
    SUL: {
        id: "SUL",
        short: "SUL",
        name: "Sulfites",
        description: "Vins, bières, vinaigrettes, confits d'oignons, fruits secs (> 10 mg/kg)",
        icon: FlaskConical,
        color: "bg-purple-100 text-purple-900 border-purple-300",
        badgeBg: "bg-purple-600",
        badgeText: "text-white",
        borderColor: "border-purple-600"
    },
    LUP: {
        id: "LUP",
        short: "LUP",
        name: "Lupin",
        description: "Farine de lupin, graines et dérivés",
        icon: Flower2,
        color: "bg-rose-100 text-rose-900 border-rose-300",
        badgeBg: "bg-rose-500",
        badgeText: "text-white",
        borderColor: "border-rose-500"
    },
    MOL: {
        id: "MOL",
        short: "MOL",
        name: "Mollusques",
        description: "Moules, huîtres, calamars, poulpes, escargots, coquilles Saint-Jacques",
        icon: Shell,
        color: "bg-slate-200 text-slate-900 border-slate-400",
        badgeBg: "bg-slate-600",
        badgeText: "text-white",
        borderColor: "border-slate-600"
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
    shortTitle: string;
    description: string;
    items: MatrixDish[];
}

const ALLERGEN_MATRIX: MatrixCategory[] = [
    {
        id: "saladbar",
        title: "Salad Bar & Bowls Fraîcheur",
        shortTitle: "Salad Bar",
        description: "Compositions fraîches, salades composées et bowls signature du traiteur.",
        items: [
            {
                name: "La Buddha Bowl Maison",
                details: "Pois chiches, lentilles corail, patate douce, avocat, graines et tahini",
                allergens: ["SES"]
            },
            {
                name: "La Jardinière du Compère",
                details: "Boulgour, chèvre fermier, noix torréfiées, vinaigre de miel-balsamique, copeaux de parmesan",
                allergens: ["GLU", "LAI", "FRU", "SUL"]
            },
            {
                name: "La Fraîcheur Méditerranéenne",
                details: "Quinoa, filet de poulet rôti, véritable feta, graines de courge et vinaigrette douce",
                allergens: ["LAI", "MOU", "SUL"]
            },
            {
                name: "La César Revisitée du Compère",
                details: "Cœur de romaine, émincé de poulet, parmesan, croûtons dorés, œuf dur, sauce César aux anchois",
                allergens: ["GLU", "LAI", "OEU", "POI", "MOU", "SUL"]
            },
            {
                name: "La Caprese du Compère",
                details: "Orecchiette artisanales, mozzarella di bufala, pesto génois aux pignons, olives taggiasche",
                allergens: ["GLU", "LAI", "FRU", "SUL"]
            },
            {
                name: "La Compère Campagnarde",
                details: "Charcuteries de nos fermes, œuf dur, croûtons au beurre, oignons confits au vin rouge",
                allergens: ["GLU", "OEU", "MOU", "SUL"]
            },
            {
                name: "La Power Bowl",
                details: "Pavé de saumon frais ou émincé de bœuf, œuf mollet, fèves d'edamame, graines de chia et sésame",
                allergens: ["POI", "OEU", "SOJ", "SES"]
            },
            {
                name: "La Nordique",
                details: "Saumon fumé maison, crevettes grises de la mer du Nord, œuf dur, sauce onctueuse à l'aneth",
                allergens: ["POI", "CRU", "OEU", "LAI", "MOU"]
            }
        ]
    },
    {
        id: "sauces",
        title: "Sauces Chaudes & Accompagnements",
        shortTitle: "Sauces & Accompagnements",
        description: "Sauces mijotées, sauces émulsionnées, féculents et garnitures chaudes.",
        items: [
            {
                name: "Sauce au poivre noir concassé",
                details: "Crème fraîche épaisse, beurre de ferme, fond de veau réduit, pointe de cognac",
                allergens: ["LAI", "CEL", "SUL"]
            },
            {
                name: "Sauce béarnaise minute",
                details: "Beurre clarifié, jaunes d'œufs frais, réduction d'échalotes au vin blanc et estragon",
                allergens: ["LAI", "OEU", "SUL"]
            },
            {
                name: "Sauce dijonnaise à l'ancienne",
                details: "Moutarde de Dijon et graines à l'ancienne, crème fraîche, réduction au vin blanc",
                allergens: ["MOU", "LAI", "SUL"]
            },
            {
                name: "Sauce crème aux champignons des bois",
                details: "Champignons frais, crème entière, beurre, échalote revenue au vin blanc",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Sauce au fond de volaille & liégeoise",
                details: "Fond de volaille lié au roux de farine, céleri, mélasse de Liège, réduction",
                allergens: ["GLU", "CEL", "SUL"]
            },
            {
                name: "Sauces froides maison (Mayonnaise, Tartare, Cocktail, Ail)",
                details: "Préparées aux jaunes d'œufs frais, huile végétale, moutarde, vinaigre de cidre",
                allergens: ["OEU", "MOU", "SUL", "LAI"]
            },
            {
                name: "Gratin Dauphinois traditionnel",
                details: "Pommes de terre finement coupées, crème fraîche, lait, œuf battu, ail et muscade",
                allergens: ["LAI", "OEU"]
            },
            {
                name: "Pâtes fraîches & Orecchiette",
                details: "Semoule de blé dur et œufs frais",
                allergens: ["GLU", "OEU"]
            },
            {
                name: "Pommes de terre grenailles au romarin & fleur de sel",
                details: "Cuites au four à l'huile d'olive et herbes de Provence",
                allergens: []
            },
            {
                name: "Frites fraîches artisanales",
                details: "Pommes de terre Bintje découpées minute, cuisson dans un bain d'huile végétale dédiée",
                allergens: []
            },
            {
                name: "Poêlée de légumes chauds cuisinés & Tomate provençale",
                details: "Légumes de saison sautés à l'huile d'olive, bouillon de légumes infusé",
                allergens: ["CEL"]
            },
            {
                name: "Salade de pâtes fraîches au pesto / curry",
                details: "Pâtes au blé, mayonnaise maison, moutarde, crème, curry ou pesto",
                allergens: ["GLU", "LAI", "OEU", "MOU"]
            },
            {
                name: "Taboulé oriental à la menthe fraîche",
                details: "Semoule de blé, tomates en dés, menthe, persil, jus de citron et huile d'olive",
                allergens: ["GLU"]
            },
            {
                name: "Salade de pommes de terre à l'ancienne",
                details: "Pommes de terre vapeur, mayonnaise maison à la moutarde, échalotes et ciboulette",
                allergens: ["OEU", "MOU", "SUL"]
            },
            {
                name: "Petits pains artisanaux & Baguettes tradition",
                details: "Farines panifiables au blé, levure et levain",
                allergens: ["GLU"]
            }
        ]
    },
    {
        id: "bbq",
        title: "Barbecue & Viandes Grillées",
        shortTitle: "Barbecue & Viandes",
        description: "Grillades au feu de bois, viandes marinées artisanales et saucisses maison.",
        items: [
            {
                name: "Saucisses & Chipolatas artisanales (Nature, Campagne, BBQ, Italienne)",
                details: "Boyau naturel, épices maison, moutarde, farine de liaison et conservateurs de sel",
                allergens: ["GLU", "MOU", "SUL"]
            },
            {
                name: "Saucisses de volaille (Nature, Fromage)",
                details: "Viande de volaille sélectionnée, fromage fondant, épices douces",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Merguez artisanale pur bœuf et agneau",
                details: "Épices orientales douces, piment doux, sel et antioxydants",
                allergens: ["SUL"]
            },
            {
                name: "Boudins artisanaux (Blanc et Noir)",
                details: "Lait entier, œufs, mie de pain au blé, oignons et sang de porc pour le noir",
                allergens: ["GLU", "LAI", "OEU"]
            },
            {
                name: "Brochettes marinées (Bœuf, Porc, Volaille, Dinde)",
                details: "Marinade riche à l'huile végétale, sauce soja, moutarde et vin aromatique",
                allergens: ["SOJ", "MOU", "SUL"]
            },
            {
                name: "Braisade de porc & de bœuf marinée",
                details: "Tranches fines marinées aux herbes, soja, moutarde et épices fumées",
                allergens: ["SOJ", "MOU", "SUL"]
            },
            {
                name: "Braisade de canard aux trois poivres",
                details: "Magret tranché, beurre aux trois poivres concassés, réduction de vin",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Spare ribs marinés au miel & épices",
                details: "Travers de porc caramélisés au miel, sauce soja, pointe de moutarde",
                allergens: ["SOJ", "MOU", "SUL"]
            },
            {
                name: "Côte d'agneau & Tranche de gigot marinées ail & fines herbes",
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
                details: "Rôtissage lent au feu de bois, frottage au sel de marinade, moutarde et herbes",
                allergens: ["MOU", "SUL"]
            },
            {
                name: "Options Végétariennes BBQ (Halloumi, Tofu teriyaki, Légumes grillés)",
                details: "Fromage halloumi au lait de brebis/chèvre, tofu mariné au soja teriyaki, sésame",
                allergens: ["GLU", "LAI", "SOJ", "SES"]
            }
        ]
    },
    {
        id: "mer",
        title: "Poissons & Fruits de Mer (BBQ & Réceptions)",
        shortTitle: "Poissons & Mer",
        description: "Produits de la mer frais grillés au feu de bois ou cuits en papillote.",
        items: [
            {
                name: "Brochette de scampis marinés à l'ail doux",
                details: "Scampis décortiqués, huile aux herbes, ail, antioxydant sulfité",
                allergens: ["CRU", "SUL"]
            },
            {
                name: "Brochette de Saint-Jacques & Scampis",
                details: "Noix de Saint-Jacques entières et scampis, assaisonnement citronné",
                allergens: ["CRU", "MOL", "SUL"]
            },
            {
                name: "Pavé de saumon papilloté à l'aneth & fenouil",
                details: "Saumon atlantique frais, branches de fenouil, aneth et huile d'olive",
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
        shortTitle: "Buffets Froids",
        description: "Terrines artisanales, charcuteries nobles, poissons fins et pièces de réception.",
        items: [
            {
                name: "Pâté en croûte de campagne & confit d'oignons",
                details: "Pâte au blé et beurre, farce porc et volaille, œufs, pistaches ou noisettes, vin",
                allergens: ["GLU", "LAI", "OEU", "FRU", "SUL"]
            },
            {
                name: "Terrines artisanales de poisson & légumes",
                details: "Chair de sandre ou cabillaud, crème, œufs, épinards et fenouil",
                allergens: ["POI", "LAI", "OEU"]
            },
            {
                name: "Pêche au thon & Mayonnaise maison",
                details: "Thon blanc émietté, mayonnaise aux œufs frais et moutarde, oreillons de pêche",
                allergens: ["POI", "OEU", "MOU"]
            },
            {
                name: "Tomate aux crevettes grises de la mer du Nord",
                details: "Crevettes grises épluchées, mayonnaise maison, jus de citron",
                allergens: ["CRU", "OEU", "MOU"]
            },
            {
                name: "Saumon fumé extra doux & Médaillon en belle-vue",
                details: "Saumon fumé au bois de hêtre, œufs durs mimosa, mayonnaise",
                allergens: ["POI", "OEU"]
            },
            {
                name: "Viandes froides braisées (Porc, Bœuf, Volaille)",
                details: "Rôti cuit à cœur, frottage moutarde et vin blanc",
                allergens: ["MOU", "SUL"]
            },
            {
                name: "Foie gras de canard mi-cuit artisanal & confit",
                details: "Foie gras cuit au torchon, pointe de Porto/Sauternes, crème, toasts",
                allergens: ["LAI", "OEU", "SUL"]
            },
            {
                name: "Cascade de fruits de mer (Huîtres, crevettes, bulots)",
                details: "Plateau de mer, huîtres creuses, bulots cuits au court-bouillon, langoustines",
                allergens: ["CRU", "MOL", "SUL"]
            },
            {
                name: "Carpaccio de bœuf mariné & copeaux de parmesan",
                details: "Bœuf charolais, copeaux de parmesan au lait de vache, câpres au vinaigre",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Plateau de charcuteries fines (Jambon d'Ardenne, saucisson gaumais)",
                details: "Salaisons ardennaises fumées au genévrier, cornichons et moutarde",
                allergens: ["MOU", "SUL"]
            }
        ]
    },
    {
        id: "collectivite",
        title: "Buffets Chauds & Plats Uniques Mijotés",
        shortTitle: "Buffets Chauds & Mijotés",
        description: "Plats traditionnels cuisinés sur place ou livrés chauds en bacs isothermes.",
        items: [
            {
                name: "Carbonnade flamande à la bière d'abbaye",
                details: "Bœuf mijoté à la bière brune, pain d'épices au blé tartiné de moutarde, oignons",
                allergens: ["GLU", "MOU", "SUL"]
            },
            {
                name: "Blanquette de veau à l'ancienne",
                details: "Veau tendre, carottes, céleri, sauce liée au roux de farine, crème fraîche",
                allergens: ["GLU", "LAI", "CEL"]
            },
            {
                name: "Boulets liégeois sauce lapin & chasseur",
                details: "Haché porc et bœuf, mie de pain, œufs, crème, sauce au sirop de Liège, oignons et bière",
                allergens: ["GLU", "LAI", "OEU", "CEL", "MOU", "SUL"]
            },
            {
                name: "Lasagne maison à la bolognaise",
                details: "Feuilles de lasagne au blé et œuf, béchamel au lait et beurre, parmesan, céleri",
                allergens: ["GLU", "LAI", "OEU", "CEL"]
            },
            {
                name: "Lasagne au saumon et épinards al verde",
                details: "Pâtes au blé et œuf, saumon frais, crème, béchamel au lait, emmental",
                allergens: ["GLU", "LAI", "OEU", "POI"]
            },
            {
                name: "Waterzooi de poisson à la gantoise",
                details: "Filets de poisson du jour, julienne de poireaux et céleri, bouillon à la crème",
                allergens: ["POI", "LAI", "CEL"]
            },
            {
                name: "Vol-au-vent de poularde de ferme",
                details: "Croûte feuilletée pur beurre au blé, blancs de volaille, boulettes, crème, céleri",
                allergens: ["GLU", "LAI", "OEU", "CEL"]
            },
            {
                name: "Chicons farcis au lard fumé & purée onctueuse",
                details: "Chicons braisés, haché assaisonné à la chapelure, purée au beurre et lait",
                allergens: ["GLU", "LAI", "OEU", "SUL"]
            },
            {
                name: "Cuisse de lapin à la bière & compote artisanale",
                details: "Lapin mijoté à la bière blonde, sauce liée, compote de pommes",
                allergens: ["GLU", "SUL"]
            },
            {
                name: "Tartiflette au Reblochon fermier AOP",
                details: "Pommes de terre, lardons déglacés au vin blanc, crème fraîche, Reblochon au lait cru",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Potées traditionnelles (Liégeoise, Carottes, Choux)",
                details: "Légumes d'hiver pilés, céleri, lardons, saucisse de campagne, pointe de beurre",
                allergens: ["CEL", "SUL", "LAI"]
            }
        ]
    },
    {
        id: "zakouskis",
        title: "Apéritifs & Mises en bouche",
        shortTitle: "Apéritifs & Zakouskis",
        description: "Bouchées festives, zakouskis chauds et froids pour réceptions.",
        items: [
            {
                name: "Falafels artisanaux et crème de sésame tahini",
                details: "Pois chiches moulus, coriandre, graines de sésame, liant végétal au blé",
                allergens: ["GLU", "SES"]
            },
            {
                name: "Croquettes de fromage de nos régions / Arancini",
                details: "Appareil au lait et beurre, fromages affinés, panure au blé, friture dorée",
                allergens: ["GLU", "LAI", "OEU"]
            },
            {
                name: "Roulé de saumon au fromage frais et aneth",
                details: "Galette fine, crème fromagère au lait, saumon fumé",
                allergens: ["GLU", "LAI", "POI"]
            },
            {
                name: "Sushi rolls & Tataki de thon mariné",
                details: "Thon rouge snacké, riz vinaigré, marinade soja et graines de sésame noir",
                allergens: ["POI", "SOJ", "SES"]
            },
            {
                name: "Nems croustillants & Gambas tempura",
                details: "Galette de blé croustillante, farce porc ou crevettes, sauce soja douce",
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
        shortTitle: "Verrines",
        description: "Verrines fraîches présentées en verrerie pour cocktails dînatoires.",
        items: [
            {
                name: "Verrine italienne parmesan, mozzarella & pesto aux pignons",
                details: "Tomates confites, mozzarella di bufala, pesto au basilic, pignons de pin",
                allergens: ["LAI", "FRU"]
            },
            {
                name: "Mousse d'avocat onctueuse & Crevettes grises de la mer du Nord",
                details: "Avocat monté au mascarpone et crème, crevettes grises fraîches, zeste de citron",
                allergens: ["CRU", "LAI"]
            },
            {
                name: "Tartare de saumon frais au yuzu & fines herbes",
                details: "Saumon atlantique mariné au citron vert et vin doux, échalote",
                allergens: ["POI", "SUL"]
            },
            {
                name: "Carpaccio de bœuf au parmesan & câpres",
                details: "Bœuf mariné à l'huile et vinaigre de vin, copeaux de parmesan",
                allergens: ["LAI", "SUL"]
            },
            {
                name: "Mousse de foie de canard au Sauternes & brioche",
                details: "Foie gras émulsionné à la crème, réduction de Sauternes, œuf",
                allergens: ["LAI", "OEU", "SUL"]
            },
            {
                name: "Dôme de chocolat noir & cœur praliné aux noisettes",
                details: "Chocolat grand cru, crème entière, praliné aux noisettes et amandes",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            }
        ]
    },
    {
        id: "pains",
        title: "Petits Pains Garnis, Pains Surprises & Wraps",
        shortTitle: "Pains & Wraps",
        description: "Assortiment de petits pains fermés, ouverts et wraps traiteur.",
        items: [
            {
                name: "Pains garnis Côté Mer (Crabe, Thon mayonnaise, Saumon fumé)",
                details: "Pain brioché au blé, mayonnaise maison aux œufs et moutarde, chair de crabe",
                allergens: ["GLU", "POI", "CRU", "OEU", "MOU"]
            },
            {
                name: "Pains garnis Côté Boucherie (Américain préparé, Jambon fermier)",
                details: "Pain au blé, américain à la mayonnaise et câpres, jambon et beurre",
                allergens: ["GLU", "OEU", "MOU", "SUL", "LAI"]
            },
            {
                name: "Pains garnis Côté Fromager (Abbaye, Brie de Meaux, Chèvre)",
                details: "Pain au blé, fromages affinés au lait cru ou pasteurisé, beurre, noix",
                allergens: ["GLU", "LAI", "OEU", "MOU", "FRU"]
            },
            {
                name: "Le Suédois signature (Pain polaire, Saumon fumé, Philadelphia)",
                details: "Pain polaire au seigle et blé, fromage frais à tartiner, aneth fraîche",
                allergens: ["GLU", "LAI", "POI"]
            },
            {
                name: "L'Instant Wraps (Le Norvégien & Le Maraîcher)",
                details: "Galette de blé, tartinable au fromage frais, julienne de légumes ou saumon",
                allergens: ["GLU", "LAI", "POI", "OEU", "MOU"]
            }
        ]
    },
    {
        id: "desserts",
        title: "Desserts, Mignardises & Fromages",
        shortTitle: "Desserts & Douceurs",
        description: "Farandole de douceurs sucrées, pièces montées et fromages affinés.",
        items: [
            {
                name: "Cascade de desserts traditionnels",
                details: "Mousses au chocolat, bavarois fruits rouges, tartelettes amandines, choux",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            },
            {
                name: "Plateau de mignardises artisanales",
                details: "Mini éclairs au chocolat, tartelettes citron meringuées, financiers aux amandes",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            },
            {
                name: "Macarons artisanaux aux amandes",
                details: "Poudre d'amandes pures, blancs d'œufs meringués, ganaches au chocolat et fruits",
                allergens: ["OEU", "FRU", "LAI"]
            },
            {
                name: "Buffet de fromages affinés de nos régions & assortiment de pains",
                details: "Fromages belges et français, raisins, noix sèches, pains aux céréales et blé",
                allergens: ["LAI", "GLU", "FRU", "SUL"]
            },
            {
                name: "Gâteau de mariage & Pièce montée personnalisée",
                details: "Génoise fine au blé, crème mousseline au beurre et lait, œufs, décorations d'amandes",
                allergens: ["GLU", "LAI", "OEU", "FRU"]
            }
        ]
    }
];

// --- SURVEILLANCE DES PARAMÈTRES D'URL POUR LE DEEP LINKING ---

function SectionWatcher({ onSectionChange }: { onSectionChange: (sec: string) => void }) {
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
        onSectionChange(target);

        setTimeout(() => {
            const element = document.getElementById(`category-${target}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);
    }, [sectionParam, onSectionChange]);

    return null;
}

// --- COMPOSANT DE CONTENU ---

export default function AllergenesPage() {
    // Navigation & Filtres
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [excludeAllergen, setExcludeAllergen] = useState<AllergenKey | "none">("none");
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");

    // Filtrage dynamique des plats
    const filteredCategories = useMemo(() => {
        return ALLERGEN_MATRIX.map((cat) => {
            // Filtrer par catégorie active
            if (selectedCategory !== "all" && cat.id !== selectedCategory) {
                return null;
            }

            // Filtrer les plats selon la recherche et l'allergène exclu
            const filteredItems = cat.items.filter((dish) => {
                // Recherche par texte
                if (searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase().trim();
                    const matchName = dish.name.toLowerCase().includes(q);
                    const matchDetails = dish.details ? dish.details.toLowerCase().includes(q) : false;
                    if (!matchName && !matchDetails) return false;
                }

                // Exclusion d'un allergène (ex: Sans Gluten)
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
    }, [selectedCategory, searchQuery, excludeAllergen]);

    // Nombre total de plats affichés
    const totalDisplayedItems = useMemo(() => {
        return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
    }, [filteredCategories]);

    return (
        <main className="min-h-screen pt-28 pb-20 bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-[#D4AF37] selection:text-white">
            <Suspense fallback={null}>
                <SectionWatcher onSectionChange={setSelectedCategory} />
            </Suspense>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* En-tête de la page */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-3 block">
                        Conformité Règlement UE n° 1169/2011
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">
                        Matrice Officielle des Allergènes
                    </h1>
                    <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6"></div>
                    <p className="text-neutral-600 font-light text-base md:text-lg leading-relaxed">
                        Pour la sécurité et le confort de tous vos convives, voici la cartographie détaillée des <strong>14 allergènes majeurs</strong> présents dans nos préparations artisanales.
                    </p>
                </div>

                {/* Légende interactive des 14 Allergènes */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200/80 mb-10">
                    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-6 bg-[#D4AF37] rounded-full"></div>
                            <h2 className="text-lg md:text-xl font-serif text-black font-semibold">
                                Les 14 Allergènes Majeurs Réglementaires
                            </h2>
                        </div>
                        <span className="text-xs text-neutral-500 italic">
                            Cliquez sur un allergène pour l&apos;exclure de l&apos;affichage
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {ALLERGEN_KEYS.map((key) => {
                            const meta = ALLERGENES[key];
                            const IconComponent = meta.icon;
                            const isExcluded = excludeAllergen === key;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setExcludeAllergen(isExcluded ? "none" : key)}
                                    title={`${meta.name} : ${meta.description}`}
                                    className={`group flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                        isExcluded
                                            ? "bg-red-50 border-red-300 ring-2 ring-red-400 shadow-sm"
                                            : "bg-neutral-50 hover:bg-white hover:border-[#D4AF37] hover:shadow-sm border-neutral-200"
                                    }`}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                                            meta.color
                                        } transition-transform group-hover:scale-105`}
                                    >
                                        {meta.image ? (
                                            <div className="relative w-6 h-6">
                                                <Image
                                                    src={meta.image}
                                                    alt={meta.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="24px"
                                                />
                                            </div>
                                        ) : IconComponent ? (
                                            <IconComponent size={18} strokeWidth={1.75} />
                                        ) : (
                                            <span className="text-xs font-bold">{meta.short}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-bold text-black uppercase tracking-wider truncate">
                                                {meta.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-neutral-500 block truncate font-mono">
                                            {isExcluded ? "Exclu (Sans)" : meta.short}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Barre d'outils : Recherche, Catégories, Filtre d'exclusion, Bascule vue */}
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-neutral-200/80 mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                        {/* Champ de recherche */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un plat, une sauce, une bowl (ex: Buddha, Béarnaise, Carbonnade...)"
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder-neutral-400 focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filtre d'exclusion d'allergène */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">Régime spécifique :</span>
                            <select
                                value={excludeAllergen}
                                onChange={(e) => setExcludeAllergen(e.target.value as AllergenKey | "none")}
                                className="py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-800 focus:border-[#D4AF37] focus:bg-white focus:outline-none cursor-pointer"
                            >
                                <option value="none">Tous les régimes</option>
                                <option value="GLU">Sans Gluten (GLU)</option>
                                <option value="LAI">Sans Lait / Lactose (LAI)</option>
                                <option value="OEU">Sans Œufs (OEU)</option>
                                <option value="POI">Sans Poissons (POI)</option>
                                <option value="CRU">Sans Crustacés (CRU)</option>
                                <option value="FRU">Sans Fruits à coque (FRU)</option>
                                <option value="SOJ">Sans Soja (SOJ)</option>
                                <option value="MOU">Sans Moutarde (MOU)</option>
                                <option value="SES">Sans Sésame (SES)</option>
                                <option value="SUL">Sans Sulfites (SUL)</option>
                            </select>
                        </div>

                        {/* Bascule de mode Vue Tableau vs Fiches */}
                        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-end md:self-auto">
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    viewMode === "table"
                                        ? "bg-black text-white shadow-sm"
                                        : "text-neutral-600 hover:text-black"
                                }`}
                            >
                                <TableIcon size={14} />
                                Matrice
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("cards")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    viewMode === "cards"
                                        ? "bg-black text-white shadow-sm"
                                        : "text-neutral-600 hover:text-black"
                                }`}
                            >
                                <LayoutGrid size={14} />
                                Fiches
                            </button>
                        </div>
                    </div>

                    {/* Filtres rapides de catégories (Pills) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3.5 py-2 rounded-full whitespace-nowrap font-bold uppercase tracking-wider transition-all ${
                                selectedCategory === "all"
                                    ? "bg-[#D4AF37] text-white shadow-sm"
                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                            }`}
                        >
                            Toutes ({ALLERGEN_MATRIX.reduce((s, c) => s + c.items.length, 0)})
                        </button>
                        {ALLERGEN_MATRIX.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3.5 py-2 rounded-full whitespace-nowrap font-bold uppercase tracking-wider transition-all ${
                                    selectedCategory === cat.id
                                        ? "bg-black text-[#D4AF37] shadow-sm"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                                }`}
                            >
                                {cat.shortTitle} ({cat.items.length})
                            </button>
                        ))}
                    </div>

                    {/* Information active */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                        <span>
                            {totalDisplayedItems} préparation{totalDisplayedItems > 1 ? "s" : ""}{" "}
                            {searchQuery ? `correspondant à « ${searchQuery} »` : "référencée" + (totalDisplayedItems > 1 ? "s" : "")}
                        </span>
                        {excludeAllergen !== "none" && (
                            <button
                                onClick={() => setExcludeAllergen("none")}
                                className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline font-semibold"
                            >
                                Filtre actif : Sans {ALLERGENES[excludeAllergen].name} (cliquez pour annuler)
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* VUE MATRICE TABLEAU (Lignes = Plats, Colonnes = 14 Allergènes cochés) */}
                {viewMode === "table" ? (
                    <div className="space-y-10">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <section
                                    key={category.id}
                                    id={`category-${category.id}`}
                                    className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
                                >
                                    {/* En-tête de section */}
                                    <div className="px-6 py-4 bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-800">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <UtensilsCrossed size={16} className="text-[#D4AF37]" />
                                                <h3 className="font-serif text-lg md:text-xl text-white font-bold">
                                                    {category.title}
                                                </h3>
                                            </div>
                                            <p className="text-neutral-400 text-xs mt-0.5 font-light">
                                                {category.description}
                                            </p>
                                        </div>
                                        <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-neutral-800 text-[#D4AF37] border border-neutral-700 self-start md:self-auto">
                                            {category.items.length} plat{category.items.length > 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    {/* Tableau de la Matrice avec défilement horizontal et première colonne figée */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[950px]">
                                            <thead>
                                                <tr className="bg-neutral-100 border-b border-neutral-200 text-[11px] font-bold text-neutral-700">
                                                    {/* Colonne Plat figée */}
                                                    <th className="sticky left-0 bg-neutral-100 z-20 py-3.5 px-4 w-72 md:w-80 border-r border-neutral-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                        Nom de la préparation & Ingrédients
                                                    </th>
                                                    {/* Les 14 Colonnes Allergènes */}
                                                    {ALLERGEN_KEYS.map((key) => {
                                                        const meta = ALLERGENES[key];
                                                        const isFiltered = excludeAllergen === key;
                                                        return (
                                                            <th
                                                                key={key}
                                                                className={`py-2 px-1 text-center font-mono w-11 transition-colors ${
                                                                    isFiltered ? "bg-red-50 text-red-700 font-black" : ""
                                                                }`}
                                                                title={`${meta.name} : ${meta.description}`}
                                                            >
                                                                <div className="flex flex-col items-center justify-center gap-1">
                                                                    <span className="text-[10px] uppercase font-bold tracking-tight">
                                                                        {meta.short}
                                                                    </span>
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300"></div>
                                                                </div>
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
                                                            {/* Colonne Nom & Détails Plat (Sticky Left) */}
                                                            <td className={`sticky left-0 z-10 py-3 px-4 border-r border-neutral-200/80 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${
                                                                idx % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]"
                                                            }`}>
                                                                <div className="font-semibold text-neutral-900 text-sm leading-tight">
                                                                    {dish.name}
                                                                </div>
                                                                {dish.details && (
                                                                    <p className="text-[11px] text-neutral-500 font-light mt-0.5 leading-snug">
                                                                        {dish.details}
                                                                    </p>
                                                                )}
                                                                {hasNoAllergens && (
                                                                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                                        Aucun des 14 allergènes majeurs
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
                                                                        className="py-2.5 px-1 text-center align-middle border-r border-neutral-100 last:border-r-0"
                                                                    >
                                                                        {isPresent ? (
                                                                            <div
                                                                                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-black shadow-xs mx-auto font-bold text-xs"
                                                                                title={`${dish.name} contient : ${meta.name}`}
                                                                            >
                                                                                <Check size={14} strokeWidth={3} />
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
                                </section>
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
                                <ShieldAlert size={40} className="mx-auto text-neutral-400 mb-4" />
                                <h3 className="text-xl font-serif text-black mb-2">Aucun plat correspondant</h3>
                                <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
                                    Aucune préparation ne correspond à vos critères de recherche ou de filtre d&apos;exclusion.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setExcludeAllergen("none");
                                        setSelectedCategory("all");
                                    }}
                                    className="px-6 py-2.5 rounded-full bg-black text-white text-xs uppercase font-bold tracking-wider hover:bg-[#D4AF37] transition-colors"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* VUE FICHES / CARTES */
                    <div className="space-y-8">
                        {filteredCategories.map((category) => (
                            <section
                                key={category.id}
                                id={`category-${category.id}`}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200"
                            >
                                <div className="border-b border-neutral-100 pb-4 mb-6">
                                    <h3 className="text-2xl font-serif font-bold text-black">{category.title}</h3>
                                    <p className="text-neutral-500 text-sm">{category.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {category.items.map((dish, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#D4AF37] transition-all flex flex-col justify-between gap-3"
                                        >
                                            <div>
                                                <h4 className="font-bold text-neutral-900 text-base">{dish.name}</h4>
                                                {dish.details && (
                                                    <p className="text-xs text-neutral-500 mt-1">{dish.details}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
                                                {dish.allergens.length > 0 ? (
                                                    dish.allergens.map((alKey) => {
                                                        const meta = ALLERGENES[alKey];
                                                        const IconComp = meta.icon;
                                                        return (
                                                            <span
                                                                key={alKey}
                                                                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.color}`}
                                                            >
                                                                {meta.image ? (
                                                                    <span className="relative w-3.5 h-3.5">
                                                                        <Image
                                                                            src={meta.image}
                                                                            alt={meta.name}
                                                                            fill
                                                                            className="object-contain"
                                                                            sizes="14px"
                                                                        />
                                                                    </span>
                                                                ) : IconComp ? (
                                                                    <IconComp size={11} />
                                                                ) : null}
                                                                {meta.name}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                        Aucun allergène majeur
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* MENTION LÉGALE DISCRÈTE ET CONFORME (OBLIGATOIRE) */}
                <div className="mt-12 bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/90 shadow-xs text-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-3">
                        <ShieldAlert size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
                            Information Importante & Sécurité Sanitaire
                        </span>
                    </div>
                    <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto italic">
                        « Nos préparations sont réalisées dans un atelier utilisant des produits contenant l&apos;ensemble des 14 allergènes majeurs. En cas d&apos;allergie sévère, merci de le signaler impérativement lors de votre demande de devis. »
                    </p>
                    <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-wider text-xs transition-all shadow-sm"
                        >
                            Préciser une allergie lors d&apos;une demande de devis
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
