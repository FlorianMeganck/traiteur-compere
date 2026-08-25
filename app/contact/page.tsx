"use client";

import { useState, useLayoutEffect, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Leaf, Check, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { MENU_DATA } from "../data/plats-prepares";
import { useCart } from "../hooks/useCart";

export default function Contact() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ContactForm />
        </Suspense>
    );
}

// --- DATA CONSTANTS ---

export type CascadeMeatItem =
    | string
    | {
        label: string;
        variants: string[];
    };

const viandesClassiquesCascade: CascadeMeatItem[] = [
    { label: "Saucisse", variants: ["Nature", "Campagne", "Barbecue", "Italienne"] },
    { label: "Chipolata", variants: ["Nature", "Fines herbes", "Poivre", "Piment d'Espelette"] },
    "Merguez",
    "Mini boudin blanc",
    { label: "Saucisse de volaille", variants: ["Nature", "Fromage"] },
    "Brochette de mini boulettes marinées",
    "Brochette de mini boudins",
    "Filet de poulet mariné",
    "Pilon de poulet mariné",
    "Brochette de volaille marinée",
    "Brochette de volaille nature garnie aux oignons",
    "Brochette de dinde nature garnie aux oignons",
    "Brochette de dinde marinée",
    "Brochette nature garnie d'oignons",
    "Brochette de porc garnie aux oignons",
    "Brochette de porc marinée",
    "Braisade de porc marinée",
    { label: "Lard mariné", variants: ["Ail & fines herbes", "Paprika"] },
    "Jambon barbecue en tranche",
    "Brochette de bœuf marinée (+1,00 € / pers.)",
    "Braisade de bœuf marinée (+1,00 € / pers.)",
    "Spare ribs marinés au miel (+1,00 € / pers.)",
    "Côte d'agneau marinée ail & fines herbes (+1,00 € / pers.)",
    "Braisade de canard aux trois poivres (+2,00 € / pers.)",
    "Tranche de gigot d'agneau marinée ail & fines herbes (+2,00 € / pers.)",
    "Spare ribs de bœuf (+2,50 € / pers.)"
];

const viandesComposeCascade: CascadeMeatItem[] = [
    "Brochette de scampi (+2,00 € / pers.)",
    "Contrefilet de bœuf étranger (+2,00 € / pers.)",
    ...viandesClassiquesCascade
];

const dinatoireViandesCascade: CascadeMeatItem[] = [
    "Brochette de scampi (+2,00 € / pers.)",
    "Contrefilet de bœuf étranger (+2,00 € / pers.)",
    ...viandesClassiquesCascade
];

const viandesClassiques = [
    "Saucisse (nature, campagne, barbecue, italienne)",
    "Chipolata (nature, fines herbes, poivre, piment d'Espelette)",
    "Merguez",
    "Mini boudin blanc",
    "Saucisse de volaille (nature, fromage)",
    "Brochette de mini boulettes marinées",
    "Brochette de mini boudins",
    "Filet de poulet mariné",
    "Pilon de poulet mariné",
    "Brochette de volaille marinée",
    "Brochette de volaille nature garnie aux oignons",
    "Brochette de dinde nature garnie aux oignons",
    "Brochette de dinde marinée",
    "Brochette nature garnie d'oignons",
    "Brochette de porc garnie aux oignons",
    "Brochette de porc marinée",
    "Braisade de porc marinée",
    "Lard mariné (ail & fines herbes ou paprika)",
    "Jambon barbecue en tranche",
    "Brochette de bœuf marinée (+1,00 € / pers.)",
    "Braisade de bœuf marinée (+1,00 € / pers.)",
    "Spare ribs marinés au miel (+1,00 € / pers.)",
    "Côte d'agneau marinée ail & fines herbes (+1,00 € / pers.)",
    "Braisade de canard aux trois poivres (+2,00 € / pers.)",
    "Tranche de gigot d'agneau marinée ail & fines herbes (+2,00 € / pers.)",
    "Spare ribs de bœuf (+2,50 € / pers.)"
];

const viandesCompose = [
    "Brochette de scampi (+2,00 € / pers.)",
    "Contrefilet de bœuf étranger (+2,00 € / pers.)",
    ...viandesClassiques
];

const dinatoireViandes = [
    "Brochette de scampi (+2,00 € / pers.)",
    "Contrefilet de bœuf étranger (+2,00 € / pers.)",
    ...viandesClassiques
];

const getMeatSupplementPrice = (meatName: string): number => {
    if (!meatName) return 0;
    if (meatName.includes("+2,50 €") || meatName.includes("+2.50 €") || meatName.includes("+2,5€") || meatName.includes("+2.5€")) return 2.5;
    if (meatName.includes("+2,00 €") || meatName.includes("+2.00 €") || meatName.includes("+2€")) return 2.0;
    if (meatName.includes("+1,00 €") || meatName.includes("+1.00 €") || meatName.includes("+1€")) return 1.0;
    if (meatName.includes("+3,00 €") || meatName.includes("+3.00 €") || meatName.includes("+3€")) return 3.0;
    return 0;
};

const optionsVegetariennes = [
    "Halloumi grillé au miel", "Brochettes de légumes méditerranéens",
    "Maïs au paprika fumé et citron vert", "Steak de chou-fleur rôti au BBQ",
    "Portobello farci au fromage frais et herbes", "Tofu mariné sauce teriyaki",
    "Ananas rôti au BBQ, sirop d'érable et romarin"
];

const entreesCompose = [
    "Brochette de scampi marinées au citron et à l'aneth", "Pavé de saumon à l'aneth",
    "Salade melon, feta et menthe", "Burrata avec tomates cœur de bœuf et pesto",
    "Gaspacho andalou en verrines", "Mini-brochettes de poulet mariné à la moutarde",
    "Tartare de bœuf aux herbes fines"
];

const dinatoireServices = ["Lasagnes", "Chili", "Tortellini", "Paëlla"];

const fruitsDeMer = [
    "Brochette de scampi", "Calamar mariné au cumin", "Brochette de Saint-Jacques",
    "Pavé de saumon au fenouil", "Pince de crabe", "Moules en papillote",
    "Poulpe grillé à la méditerranéenne", "Homard grillé façon Maine", "Gambas grillées (citron et thym)"
];

const dessertsList = [
    "Tiramisu (classique, fruits, spéculoos)", "Pavlova aux fruits rouges",
    "Dôme de chocolat noir avec son cœur praliné", "Carpaccio d'ananas rôti, citron vert et menthe",
    "Panna cotta vanille et coulis framboise", "Financier aux amandes et fruits frais"
];

const MIGNARDISES_LIST = [
    "Mini bavarois framboises & passion",
    "Mini javanais",
    "Mini éclairs",
    "Mini choux crème fraîche & chocolat",
    "Mini choux crème fraîche",
    "Mini croûte aux fraises",
    "Mini verrine mousses chocolat"
];

const getMignardisesPricePerPerson = (qty: number): number => {
    if (!qty || qty <= 0) return 0;
    if (qty <= 2) {
        return qty * 2.75;
    }
    return qty * 2.50;
};

const NOBLES = ["Tomahawk", "Côte à l'os", "Entrecôte Irlandaise", "Entrecôte Simmental", "Entrecôte Black Angus", "Filet Pur"];

const BBQ_TIER_PRICES: Record<string, Record<string, number>> = {
    classique: {
        "Moins de 30": 17,
        "30 à 90": 16,
        "90 à 170": 15,
        "170 à 250": 14,
    },
    compose: {
        "Moins de 30": 23,
        "30 à 90": 22,
        "90 à 170": 21,
        "170 à 250": 20,
    },
    dinatoire: {
        "Moins de 30": 27,
        "30 à 90": 25.50,
        "90 à 170": 24,
        "170 à 250": 22.50,
    },
    mer: {
        "Moins de 30": 33,
        "30 à 90": 31.50,
        "90 à 170": 30.50,
        "170 à 250": 29.50,
    },
    vegetarien: {
        "Moins de 30": 13,
        "30 à 90": 12.50,
        "90 à 170": 12,
        "170 à 250": 11,
    },
    nobles: {
        "Moins de 30": 49.50,
        "30 à 90": 47.50,
        "90 à 170": 46,
        "170 à 250": 44.50,
    },
    cochon: {
        "Moins de 25": 36,
        "25 à 180": 33,
    },
    porchetta: {
        "Moins de 25": 26.50,
        "25 à 180": 24,
    }
};

const SIDES_COLD = ["Salade de Pâtes Pesto", "Salade de Pâtes Curry", "Salade Grecque (Feta/Olives)", "Taboulé Oriental", "Tomate Mozza Di Bufala", "Salade de Pomme de Terre (Mayonnaise)", "Salade de Pomme de Terre (Vinaigrette)", "Carottes Râpées (Citron)", "Céleri Râpé & Pommes", "Concombre à la crème", "Salade de chou blanc"];
const feculentsBBQ = ["Pomme de terre en chemise", "Gratin Dauphinois", "Grenailles au Romarin", "Baguette", "Petit pain"];

const BUFFET_FROID_PRICES: Record<string, { small: number; medium: number }> = {
    buffet_campagnard: { small: 17, medium: 14 },
    buffet_ardenais: { small: 17, medium: 15 },
    buffet_reception: { small: 20, medium: 18 },
    buffet_gala: { small: 24, medium: 22 }
};

const feculentsFroids = [
    "Pommes de terre vapeur ou grenaille", "Pommes de terre rôties froides aux herbes",
    "Purée froide à la ciboulette ou au beurre", "Riz blanc parfumé (basmati ou thaï)",
    "Riz pilaf", "Pâtes classiques froides (penne, fusilli, coquillettes)", "Semoule de couscous fine ou perlé"
];

const cruditesFroids = [
    "Salade de riz exotique", "Salade de pâtes au pesto à l'italienne", "Quinoa aux fines herbes et légumes grillés",
    "Salade de pommes de terre campagnarde", "Salade gourmande à la grecque", "Salade de céleri",
    "Carottes râpées à l'orange", "Salade de concombre et radis", "Salade méditerranéenne (tomates, olives et feta)",
    "Salade de haricots aux échalotes et fines herbes", "Coleslaw au miel", "Salade de betteraves façon bistrot",
    "Chou blanc au vinaigre", "Salade de lentilles vertes aux herbes", "Salade de pois chiches aux tomates séchées",
    "Taboulé libanais classique", "Salade de chou rouge et pommes", "Salade de haricots verts aux noix",
    "Salade de patate douce rôtie froide", "Salade de fenouil et agrumes", "Salade de radis, concombre et menthe fraîche",
    "Salade d'épinards frais, pommes et noix", "Salade de pois gourmands et carottes fines"
];

const buffetCompositions: Record<string, string[]> = {
    'Buffet Froid Campagnard': [
        "Croûte de pâté au poivre vert", "Jambon d'Ardenne", "Jambon à l'os sur griffe",
        "Assortiment de charcuterie de campagne", "Pilon de poulet braisé", "Rôti de porc braisé aux herbes de Provence"
    ],
    'Buffet Froid Ardenais': [
        "Croûte de pâté de chevreuil", "Boudin blanc de Liège et boudin noir au raisin",
        "Duo de jambon sur griffes", "Plateau de spécialités de nos Ardennes", "Pêche au thon",
        "Rosbif et rôti de porc braisé", "Hure de veau aux petits légumes"
    ],
    'Buffet Froid Réception': [
        "Mousse de foie de canard au Sauternes", "Assortiment de boudin", "Trio de viandes fumées et séchées",
        "Filet de dinde braisé", "Rosbif et rôti de porc braisé", "Pilon de poulet braisé",
        "Tomate-crevette grise et pêche au thon", "Darne de saumon en belle-vue", "Terrine au fenouil"
    ],
    'Buffet Froid Gala': [
        "Duo de jambon sur griffe", "Mousse de foie de canard au Sauternes", "Trio de viandes braisées",
        "Pilon de poulet braisé", "Saumon aux deux saveurs", "Farandole de langoustines",
        "Tomates aux crevettes grises", "Terrine de sandre au basilic"
    ]
};

const painsData: Record<string, { price: number; items: string[] }> = {
    "Petits Pains Classiques (Fermés)": {
        price: 2.20,
        items: ["Côté Mer (Salade crevettes, Thon, Saumon, Crabe)", "Côté Boucherie (Américain, Tartare, Jambon, Salade viande)", "Côté Volaille (Poulet Curry, Estragon)", "Côté Fromager (Abbaye, Emmental, Brie)"]
    },
    "Petits Pains Signature (Fermés)": {
        price: 2.20,
        items: ["Le Suédois (Saumon, Philadelphia)", "L'Italien (Jambon de Parme, Olives)", "Le Périgord (Mousse de canard, Magret)", "Le Spécial (Houmous poivron, Chorizo)"]
    },
    "Pains Ouverts Festifs": {
        price: 2.75,
        items: ["Compositions Classiques et Signature présentées ouvertes", "Garniture généreuse", "Décoration fleurs comestibles et micro-pousses"]
    },
    "L'Instant Wraps": {
        price: 2.20,
        items: ["Le Maraîcher (Crudités, crème légère)", "Le Norvégien (Saumon fumé, cream cheese)", "L'Oriental (Houmous, légumes grillés)", "Le Terroir (Charcuteries fines)"]
    }
};

const zakouskisData: Record<string, Record<string, { price: number, items: string[] }>> = {
    "Légumes & Végétariens": {
        "Gamme Classique": { price: 2.00, items: ["Falafel et sauce tahini", "Mini bruschetta tomate et tapenade", "Samosa légumes", "Mini wrap grillé aux légumes méditerranéens", "Croquette de fromage", "Mini croustade aux champignons", "Gougère au fromage"] },
        "Gamme Internationale": { price: 2.50, items: ["Arancini à la truffe", "Tempura de légumes et sauce aigre-douce", "Mini tacos végétariens avocat et pickles", "Cromesquis de fromage affiné", "Croustillant de camembert au miel"] }
    },
    "Poisson & Fruits de Mer": {
        "Gamme Classique": { price: 3.00, items: ["Roulé de saumon au fromage frais", "Duo concombre et saumon fumé", "Mousse d'avocat et crevettes marinées au citron", "Nems crevettes", "Mini brochette crevette marinée"] },
        "Gamme Internationale": { price: 3.00, items: ["Ceviche de poisson en mini-cuillère", "Sushi roll cocktail", "Tataki de thon au sésame", "Gambas tempura", "Mini quésadilla aux crevettes"] },
        "Gamme Premium": { price: 4.50, items: ["Saint-Jacques snackée", "Mini lobster roll", "Blini saumon et œufs de poisson", "Tartare de thon rouge", "Mini ceviche de langoustine"] }
    },
    "Viande & Volaille": {
        "Gamme Standard": { price: 3.00, items: ["Mini brochette de poulet mariné", "Nems poulet", "Feuilleté saucisse artisanale", "Mini burger bœuf", "Mini croque-monsieur"] },
        "Gamme Internationale": { price: 3.00, items: ["Mini tacos bœuf épicé", "Gyoza poulet", "Kefta orientale et sauce yaourt", "Mini shawarma poulet", "Bao bun porc effiloché"] },
        "Gamme Premium": { price: 4.00, items: ["Mini burger Black Angus", "Tataki de bœuf", "Parmentier de canard en bouchée", "Mini vol-au-vent aux ris de veau", "Brochette de magret fumé"] }
    }
};

const getZakouskiBasePrice = (itemName: string): number => {
    for (const cat of Object.values(zakouskisData)) {
        for (const gamme of Object.values(cat)) {
            if (gamme.items.includes(itemName)) return gamme.price;
        }
    }
    return 0;
};

// Structure pour Verrines (Prix différents selon format 6cl / 12cl)
// Structure stricte des Verrines selon le PDF (Prix 6cl / 12cl)
const verrinesData: Record<string, { items: string[], price6cl: number, price12cl: number }> = {
    "Végétariennes": {
        price6cl: 2.00,
        price12cl: 3.50,
        items: [
            "Verrine italienne au parmesan et tomates confites", "Poivron, feta et olives noires",
            "Quinoa et légumes d'été au citron", "Lentilles et betterave au vinaigre balsamique",
            "Pois chiches et épinards, sauce tahini", "Houmous de lentilles",
            "Épinard, avocat, noix et lentilles", "Tomate cerise, mozzarella, huile d'olive",
            "Burrata, pesto et tomates cerises", "Polenta crémeuse et champignons poêlés",
            "Mousse de ricotta citron et courgettes grillées"
        ]
    },
    "Poisson & Fruits de Mer": {
        price6cl: 3.00,
        price12cl: 4.50,
        items: [
            "Guacamole et saumon frais", "Saumon et fromage frais aux herbes",
            "Crevette et mangue fraîche", "Quinoa, thon et radis rose",
            "Tartare de saumon citron vert et aneth", "Crème d'avocat et chair de crabe",
            "Ceviche de cabillaud aux agrumes", "Rillettes de maquereau fumé et ciboulette"
        ]
    },
    "Viande & Volaille": {
        price6cl: 3.00,
        price12cl: 4.50,
        items: [
            "Carpaccio de bœuf, parmesan et balsamique", "Poulet grillé et quinoa aux herbes",
            "Bœuf et patate douce au thym", "Œufs mimosa et légumes grillés",
            "Butternut au chorizo piquant et abricot", "Mousse de chèvre frais, basilic, gingembre et noisettes",
            "Effiloché de bœuf au jus réduit", "Volaille curry coco", "Parmentier de canard en verrine"
        ]
    },
    "Gamme Premium": {
        price6cl: 3.50,
        price12cl: 5.00,
        items: [
            "Ceviche de langoustine au citron vert", "Tartare de bœuf Black Angus et brisure de truffe",
            "Saumon fumé supérieur, crème ciboulette et œufs de saumon", "Tataki de thon rouge, sésame noir et sauce yuzu",
            "Foie gras mi-cuit, gelée de Porto et pain d'épices croustillant", "Noix de Saint-Jacques poêlées, crème légère au citron",
            "Asperges blanches, œuf parfait et crumble ibérique", "Carpaccio de Saint-Pierre, huile de basilic"
        ]
    }
};

const getVerrineBasePrices = (itemName: string): { price6cl: number, price12cl: number } | null => {
    for (const data of Object.values(verrinesData)) {
        if (data.items.includes(itemName)) return { price6cl: data.price6cl, price12cl: data.price12cl };
    }
    return null;
};

export interface SaladBowlItem {
    name: string;
    price: number;
    desc: string;
}

const SALADS_BOWLS_DATA: SaladBowlItem[] = [
    {
        name: "La Buddha Bowl Maison",
        price: 10.50,
        desc: "Riz complet, lentilles corail, patate douce au cumin, chou rouge mariné, carottes à l'orange, avocat, pois chiches"
    },
    {
        name: "La Jardinière du Compère",
        price: 13.00,
        desc: "Boulgour aux herbes, chèvre frais, betterave rôtie, noix, pomme verte, roquette, miel-balsamique, parmesan"
    },
    {
        name: "La Fraîcheur Méditerranéenne",
        price: 14.50,
        desc: "Mesclun, poulet grillé, tomates confites, concombre, radis, quinoa, feta, graines de courge, vinaigrette citron"
    },
    {
        name: "La César Revisitée du Compère",
        price: 16.00,
        desc: "Romaine, poulet rôti, lardons fumés, parmesan, croûtons à l'ail, œuf mollet, sauce César maison"
    },
    {
        name: "La Caprese du Compère",
        price: 18.00,
        desc: "Orecchiette, mozzarella di bufala, tomates anciennes, roquette, pesto maison, olives taggiasche, tomates séchées, pignons"
    },
    {
        name: "La Compère Campagnarde",
        price: 21.00,
        desc: "Mesclun, magret fumé, lardons fermiers, jambon cru d'Ardenne, œuf poché, grenailles tièdes, oignons confits, croûtons"
    },
    {
        name: "La Power Bowl",
        price: 22.50,
        desc: "Filet de bœuf émincé ou saumon grillé, œuf dur, edamame, pois chiches paprika, quinoa, épinards, avocat, chia"
    },
    {
        name: "La Nordique",
        price: 25.00,
        desc: "Saumon fumé, crevettes grises, œuf dur, avocat, grenailles tièdes, concombre, jeunes pousses, câpres, oignons rouges"
    }
];

const saladesBowlsData: Record<string, number> = {
    "La Buddha Bowl Maison": 10.50,
    "La Jardinière du Compère": 13.00,
    "La Fraîcheur Méditerranéenne": 14.50,
    "La César Revisitée du Compère": 16.00,
    "La Caprese du Compère": 18.00,
    "La Compère Campagnarde": 21.00,
    "La Power Bowl": 22.50,
    "La Nordique": 25.00
};

const collectiviteData: Record<string, number> = {
    "Lasagne aux légumes du soleil": 8,
    "Cannellonis ricotta épinards": 8,
    "Roulade de chicons au jambon, purée": 9,
    "Roulade de chicons ardennaise (lard fumé), purée": 9,
    "Potée aux carottes, saucisse": 9,
    "Potée liégeoise": 9,
    "Potée aux choux, saucisse": 9,
    "Pâtes bolognaise": 9,
    "Pâtes carbonara": 9,
    "Ravioli de boeuf, sauce tomates": 9,
    "Boulettes sauce tomate, purée": 9,
    "Boulettes sauce chasseur, purée et compote de pomme": 9,
    "Tartiflette": 9,
    "Pâtes poulet estragon": 9,
    "Vol au vent": 9,
    "Lasagne de boeuf": 10,
    "Lasagne au saumon": 10,
    "Hachis parmentier épinards": 10,
    "Boulet (tomates, chasseur) frite salade": 10,
    "Carbonnade flamande, purée et compote de pomme": 12,
    "Blanquette de veau à l'ancienne, purée": 14
};

// Legacy/Other Menus
const ITEMS_ARDENNAIS = ["Croûte de pâté de chevreuil", "Boudin blanc de Liège", "Boudin noir", "Jambon d'Ardenne", "Pêche au thon", "Rosbif braisé", "Rôti de porc braisé", "Hure de veau", "Feuilleté de légumes de saison", "Quiche aux légumes"];
const ITEMS_GALA = ["Mousse de foie de canard", "Saumon en belle-vue", "Farandole de langoustines", "Tomates aux crevettes grises", "Terrine de Sandre", "Jambon sur griffe", "Viande braisée", "Feuilleté de légumes de saison", "Terrine de légumes"];
const ITEMS_ASSOCIATIONS = ["Boulets Liégeois (Sauce Lapin)", "Boulets Liégeois (Sauce Tomate)", "Vol-au-vent artisanal", "Pâtes Bolognaise", "Pâtes Carbonara", "Burgers Spécial Compère", "Option Végé : Grande Salade & Quiche"];

// SAUCES CHAUDES
const SAUCES_CHAUDES_LIST = [
    "Sauce au poivre",
    "Sauce béarnaise",
    "Sauce dijonnaise",
    "Sauce aux champignons",
    "Sauce au fond de volaille"
];

// OPTIONS
const OPTIONS_STANDARD = ["Moins de 20", "20 à 50", "50 à 100", "Plus de 100"];
const OPTIONS_BUFFET_FROID = ["Moins de 25", "25 à 250", "Plus de 250"];
const OPTIONS_BBQ = ["Moins de 30", "30 à 90", "90 à 170", "170 à 250", "Plus de 250"];
const OPTIONS_COCHON = ["Moins de 25", "25 à 180", "Plus de 180"]; // Specific for Cochon/Porchetta
const OPTIONS_BUFFET = ["Moins de 40", "40 et plus"];
const OPTIONS_ASSOCIATIONS = ["Moins de 50", "50 à 100", "Plus de 100"];
const OPTIONS_PLAT_UNIQUE = ["Moins de 50", "50 à 100", "Plus de 100"];
const OPTIONS_COLLECTIVITE = ["Moins de 30", "30 à 100", "Plus de 100"];
const OPTIONS_PAINS = ["Moins de 25", "25 à 100", "100 à 200", "Plus de 200"];
const glassSteps = Array.from({ length: 51 }, (_, i) => i * 5); // 0, 5, 10, ..., 250

// --- VALIDATION HELPERS ---

const getConvivesMax = (str: string): number => {
    if (!str) return 0;
    if (str.includes("Plus de")) return 9999;
    const matches = str.match(/\d+/g);
    if (!matches) return 0;
    return Math.max(...matches.map(Number));
};

const getEstimatedGuestCount = (str: string): number => {
    if (!str) return 0;
    const matches = str.match(/\d+/g);
    if (!matches) return 0;
    const numbers = matches.map(Number);
    if (str.includes("Moins de")) {
        return numbers[0];
    }
    if (str.includes("Plus de") || str.includes("et plus")) {
        return numbers[0];
    }
    return numbers[0]; // Range: return the lower bound (e.g. 30 for "30 à 90")
};

const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
};

const validateEmail = (email: string) => {
    // Must contain @ and .
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    // Must start with 0, length 9 or 10.
    if (!clean.startsWith('0') || (clean.length !== 9 && clean.length !== 10)) return false;

    // Anti-Fake Checks
    if (/^0([0-9])\1+$/.test(clean)) return false; // Repeated digits like 0444444444
    if (clean.startsWith('00')) return false;

    // Emergency numbers check (100, 101, 112) - though length check covers them (3 digits), 
    // but just in case someone enters 0112... (unlikely valid anyway)

    // Common fake/placeholder patterns
    if (clean === "0400000000" || clean === "0475123456") return false; // 0475123456 is the placeholder!

    return true;
};

function ContactForm() {
    const router = useRouter();
    const getPickupDayPreview = (j: string | null) => {
        if (!j) return "";
        const d = j.toLowerCase();
        if (d === 'lundi' || d === 'mardi') return 'Mardi';
        if (d === 'mercredi' || d === 'jeudi') return 'Jeudi';
        if (d === 'vendredi' || d === 'samedi') return 'Samedi';
        return j;
    };
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [isStarted, setIsStarted] = useState(false);

    // Initial state setup without referencing TDZ variables
    const [formData, setFormData] = useState({
        Prenom: "",
        Nom: "",
        Societe: "Non",
        Nom_Societe: "",
        Mail: "",
        Tel: "",
        Type_Evenement: "Mariage",
        type_autre: "",
        Date: "",
        Nombre_Convives: "", // Set dynamically in useLayoutEffect to prevent TDZ issues
        details_projet: "",
        Souhaite_etre_recontacte: "Non",

        // Plats Préparés
        Plat_Prepare_Potage: "Non merci",
        Plat_Prepare_Quantite: "1",

        // Dynamic Fields
        Viande_1: "",
        Viande_2: "",
        Viande_3: "",
        compose_entree_1: "",
        compose_entree_2: "",
        dinatoire_service_1: "",
        dinatoire_service_2: "",
        Supplement_Viande_1: "",
        Supplement_Viande_2: "",
        Supplement_Viande_3: "",
        Viande_Extra_1: "",
        Viande_Extra_2: "",
        Accompagnement_Froid_1: "",
        Accompagnement_Froid_2: "",
        Accompagnement_Froid_3: "",
        Accompagnement_Chaud: "",
        Accompagnement_Chaud_Supplement: "",
        Accompagnement_Chaud_Supplement_Check: "Non",
        Legumes_Chauds_Check: "Non",
        Sauces_Chaudes_Check: "Non",
        Sauces_Chaudes_Choix: [] as string[],
        Feculent: "",
        Feculent_Extra: "",
        Crudites_Choix_Chef: "Non",
        Suppl_Crudite_Extra: "",
        Dessert_Check: "Non",
        Dessert_Type: "traditionnel" as "traditionnel" | "mignardises",
        Dessert_Choix: "",
        Mignardises_Quantite: "3",
        Mignardises_Varietes: [] as string[],
        Service_Check: "Non",
        Location_Vaisselle_Check: "Non",
        Location_Verrerie_Check: "Non",
        Location_Verrerie_Vin: "0",
        Location_Verrerie_Soft: "0",
        Location_Verrerie_Flute: "0",
        plat_1: "",
        plat_2: "",
        plat_3: "",
        plat_4: "",
        plat_5: "",
        plat_6: "",
        salade_1: "",
        salade_2: "",
        Plat_Associatif: "",
        Plat_Associatif_Detail: "",
        Feculent_Froid: "",
        Crudite_1: "",
        Crudite_2: "",
        Crudite_3: "",
        Crudite_4: "",
        Crudite_5: "",
        Crudite_6: "",
        Suppl_Crudite_1: "",
        Suppl_Crudite_2: "",
        Suppl_Crudite_3: "",
        Categorie_Pains: "",
        Quantite_Pains: "",
        Zakouski_Cat_1: "", Zakouski_Item_1: "",
        Zakouski_Cat_2: "", Zakouski_Item_2: "",
        Zakouski_Cat_3: "", Zakouski_Item_3: "",
        Zakouski_Cat_4: "", Zakouski_Item_4: "",
        Zakouski_Cat_5: "", Zakouski_Item_5: "",
        Zakouski_Cat_6: "", Zakouski_Item_6: "",
        Zakouski_Cat_7: "", Zakouski_Item_7: "",
        Zakouski_Cat_8: "", Zakouski_Item_8: "",
        Zakouski_Cat_9: "", Zakouski_Item_9: "",
        Zakouski_Cat_10: "", Zakouski_Item_10: "",
        Format_Verrines: "",
        Verrine_Cat_1: "", Verrine_Item_1: "",
        Verrine_Cat_2: "", Verrine_Item_2: "",
        Verrine_Cat_3: "", Verrine_Item_3: "",
        Verrine_Cat_4: "", Verrine_Item_4: "",
        Verrine_Cat_5: "", Verrine_Item_5: "",
        Verrine_Cat_6: "", Verrine_Item_6: "",
        Verrine_Cat_7: "", Verrine_Item_7: "",
        Verrine_Cat_8: "", Verrine_Item_8: "",
        Verrine_Cat_9: "", Verrine_Item_9: "",
        Verrine_Cat_10: "", Verrine_Item_10: "",
        Collectivite_Volet: "plats_chauds" as "plats_chauds" | "salad_bar",
        Plat_Collectivite: "",
        Salad_Bar_Choix: "",
        Buffet_Chaud_Services: "3",
        Buffet_Chaud_Commentaires: "",
        Buffet_Chaud_Zakouskis: "",
        Buffet_Chaud_Entree_1: "",
        Buffet_Chaud_Entree_2: "",
        Buffet_Chaud_Plat: "",
        Buffet_Chaud_Dessert: ""
    });

    const handleFormStart = () => {
        if (!isStarted) {
            setIsStarted(true);
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'form_start', {
                    'event_category': 'engagement',
                    'event_label': 'debut_saisie_formulaire'
                });
            }
        }
    };

    const FormAllergenLink = ({ section }: { section: string }) => (
        <div className="text-center mt-2 mb-6">
            <Link href={`/allergenes?section=${section}`} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-widest border border-[#D4AF37]/30 px-4 py-2 rounded-full hover:bg-[#D4AF37]/10 transition-colors">
                ℹ️ Voir le détail des allergènes
            </Link>
        </div>
    );

    // --- MENU CONTEXT & PARAMETERS ---
    const menuParam = searchParams.get('menu');
    const typeParam = searchParams.get('type');
    const { cartItems, cartTotal, isLoaded, clearCart } = useCart();

    // BBQ Types
    const isBBQClassique = menuParam === 'bbq_classique';
    const isBBQCompose = menuParam === 'bbq_compose';
    const isBBQDinatoire = menuParam === 'bbq_dinatoire';
    const isBBQMer = menuParam === 'bbq_mer';
    const isBBQVegetarien = menuParam === 'bbq_vegetarien';
    const isBBQCochon = menuParam === 'bbq_cochon';
    const isBBQPorchetta = menuParam === 'bbq_porchetta';
    const isBBQNobles = menuParam === 'bbq_nobles';

    const isAnyBBQ = menuParam?.startsWith('bbq_');
    const isCochonOrPorchetta = isBBQCochon || isBBQPorchetta;

    // Buffets froids
    const isBuffetFroidMode = menuParam?.startsWith('buffet_');

    // Other Menus
    const isArdennais = menuParam === 'ardennais';
    const isGala = menuParam === 'gala';
    const isAssociations = menuParam === 'associations';
    const isBuffet = isArdennais || isGala;
    const isPlatUnique = menuParam === 'plat_unique';
    const isPainsMode = menuParam === 'pains_garnis';
    const isZakouskisMode = menuParam === 'zakouskis';
    const isVerrinesMode = menuParam === 'verrines';
    const isCollectiviteMode = menuParam === 'collectivite' || menuParam === 'collectivite_chaud' || menuParam === 'salad_bar' || menuParam === 'collectivite_saladbar' || menuParam === 'collectivite_salad_bar' || searchParams.get('formule') === 'collectivite' || searchParams.get('formule') === 'salad_bar';
    const isBuffetChaudMode = searchParams.get('formule') === 'buffet-chaud';
    const isPlatPrepare = typeParam === 'plat_prepare';

    const isCustomMode = isPlatPrepare || isAnyBBQ || isBuffet || isAssociations || isPlatUnique || isBuffetFroidMode || isPainsMode || isZakouskisMode || isVerrinesMode || isCollectiviteMode || isBuffetChaudMode;
    const showMenuFirst = isCustomMode;

    // State-dependent booleans
    const isBuffetFroid = formData.Type_Evenement.includes('Buffet Froid');
    const isPains = formData.Type_Evenement === 'Petits pains';
    const isZakouskis = formData.Type_Evenement === 'Zakouskis';
    const isVerrines = formData.Type_Evenement === 'Verrines';
    const isCollectivite = formData.Type_Evenement === 'Repas de collectivité';
    const isBuffetChaud = formData.Type_Evenement === 'Buffet Chaud';

    const getInitialConvivesOptions = (currentType?: string) => {
        if (isCochonOrPorchetta) return OPTIONS_COCHON;
        if (isAnyBBQ) return OPTIONS_BBQ;
        if (isBuffetFroidMode) return OPTIONS_BUFFET_FROID;
        if (isBuffet || currentType === 'Buffet Chaud' || isBuffetChaudMode) return OPTIONS_BUFFET;
        if (isAssociations) return OPTIONS_ASSOCIATIONS;
        if (isPlatUnique) return OPTIONS_PLAT_UNIQUE;
        if (isPainsMode || isZakouskisMode || isVerrinesMode) return OPTIONS_PAINS;
        if (isCollectiviteMode) return OPTIONS_COLLECTIVITE;
        return OPTIONS_STANDARD;
    };

    // --- HOOKS DEPENDING ON DECLARED MODE VARIABLES ---
    useLayoutEffect(() => {
        if (isPlatPrepare && isLoaded && cartItems.length === 0 && status !== "success") {
            router.push('/plats-prepares');
        }
    }, [isPlatPrepare, isLoaded, cartItems.length, router, status]);

    // EFFECT: Handle URL params & Default Selection
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const menuParam = searchParams.get('menu');
        const convivesParam = searchParams.get('convives');
        const serviceParam = searchParams.get('service');
        const voletParam = searchParams.get('volet');

        setFormData(prev => {
            const newData = { ...prev };

            if (serviceParam === 'oui') {
                newData.Service_Check = "Oui";
            } else if (serviceParam === 'non') {
                newData.Service_Check = "Non";
            }

            // 1. Pré-sélection du type d'événement / Menu
            if (menuParam) {
                if (menuParam.startsWith('bbq_')) {
                    const type = menuParam.replace('bbq_', '');
                    newData.Type_Evenement = `Barbecue ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                } else if (menuParam === 'buffet_campagnard') {
                    newData.Type_Evenement = 'Buffet Froid Campagnard';
                } else if (menuParam === 'buffet_ardenais') {
                    newData.Type_Evenement = 'Buffet Froid Ardenais';
                } else if (menuParam === 'buffet_reception') {
                    newData.Type_Evenement = 'Buffet Froid Réception';
                } else if (menuParam === 'buffet_gala') {
                    newData.Type_Evenement = 'Buffet Froid Gala';
                } else if (menuParam === 'ardennais') {
                    newData.Type_Evenement = 'Buffet Ardennais';
                } else if (menuParam === 'gala') {
                    newData.Type_Evenement = 'Buffet de Gala';
                } else if (menuParam === 'associations') {
                    newData.Type_Evenement = 'Associations';
                } else if (menuParam === 'plat_unique') {
                    newData.Type_Evenement = 'Plat Unique / Associatif';
                } else if (menuParam === 'pains_garnis') {
                    newData.Type_Evenement = 'Petits pains';
                } else if (menuParam === 'zakouskis') {
                    newData.Type_Evenement = 'Zakouskis';
                } else if (menuParam === 'verrines') {
                    newData.Type_Evenement = 'Verrines';
                } else if (menuParam === 'collectivite' || menuParam === 'collectivite_chaud') {
                    newData.Type_Evenement = 'Repas de collectivité';
                    newData.Collectivite_Volet = 'plats_chauds';
                } else if (menuParam === 'salad_bar' || menuParam === 'collectivite_saladbar' || menuParam === 'collectivite_salad_bar') {
                    newData.Type_Evenement = 'Repas de collectivité';
                    newData.Collectivite_Volet = 'salad_bar';
                }
            } else if (typeParam === 'plat_prepare') {
                newData.Type_Evenement = 'Plat Préparé';
            }

            const formuleParam = searchParams.get('formule');
            const servicesParam = searchParams.get('services');

            if (formuleParam === 'buffet-chaud') {
                newData.Type_Evenement = 'Buffet Chaud';
                if (servicesParam) {
                    newData.Buffet_Chaud_Services = servicesParam;
                }
            } else if (formuleParam === 'collectivite' || formuleParam === 'salad_bar' || formuleParam === 'collectivite_chaud' || formuleParam === 'collectivite_saladbar') {
                newData.Type_Evenement = 'Repas de collectivité';
                if (formuleParam === 'salad_bar' || formuleParam === 'collectivite_saladbar' || voletParam === 'salad_bar' || voletParam === 'salades') {
                    newData.Collectivite_Volet = 'salad_bar';
                } else if (formuleParam === 'collectivite_chaud' || voletParam === 'plats_chauds' || voletParam === 'chaud') {
                    newData.Collectivite_Volet = 'plats_chauds';
                }
                const groupeParam = searchParams.get('groupe');
                if (groupeParam === 'petit') newData.Nombre_Convives = "Moins de 30";
                else if (groupeParam === 'standard') newData.Nombre_Convives = "30 à 100";
                else if (groupeParam === 'grand') newData.Nombre_Convives = "Plus de 100";
            }

            // 2. Pré-sélection du Nombre de Convives
            if (convivesParam) {
                const safeParam = decodeURIComponent(convivesParam).toLowerCase();
                const opts = getInitialConvivesOptions(newData.Type_Evenement);

                const normalizeStr = (str: string) => {
                    return str
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/pers(onnes?)?\.?/g, "")
                        .replace(/[^a-z0-9]/g, "");
                };

                const normalizedParam = normalizeStr(safeParam);
                const matchedOpt = opts.find(opt => normalizeStr(opt) === normalizedParam);

                if (matchedOpt) {
                    newData.Nombre_Convives = matchedOpt;
                } else {
                    // Keyword/Range fallback detection
                    let found = "";
                    if (safeParam.includes("moins")) {
                        found = opts.find(o => o.startsWith("Moins de")) || "";
                    } else if (safeParam.includes("plus") || safeParam.includes("plus de") || safeParam.includes("et plus")) {
                        found = opts.find(o => o.startsWith("Plus de") || o.endsWith("plus")) || "";
                    } else if (safeParam.includes("30") && safeParam.includes("90")) {
                        found = opts.find(o => o.includes("30") && o.includes("90")) || "";
                    } else if (safeParam.includes("90") && safeParam.includes("170")) {
                        found = opts.find(o => o.includes("90") && o.includes("170")) || "";
                    } else if (safeParam.includes("170") && safeParam.includes("250")) {
                        found = opts.find(o => o.includes("170") && o.includes("250")) || "";
                    } else if (safeParam.includes("25") && safeParam.includes("250")) {
                        found = opts.find(o => o.includes("25") && o.includes("250")) || "";
                    } else if (safeParam.includes("25") && safeParam.includes("180")) {
                        found = opts.find(o => o.includes("25") && o.includes("180")) || "";
                    } else if (safeParam.includes("30") && safeParam.includes("100")) {
                        found = opts.find(o => o.includes("30") && o.includes("100")) || "";
                    } else if (safeParam.includes("50") && safeParam.includes("100")) {
                        found = opts.find(o => o.includes("50") && o.includes("100")) || "";
                    } else if (safeParam.includes("100") && safeParam.includes("200")) {
                        found = opts.find(o => o.includes("100") && o.includes("200")) || "";
                    } else if (safeParam.includes("20") && safeParam.includes("50")) {
                        found = opts.find(o => o.includes("20") && o.includes("50")) || "";
                    }

                    if (found) {
                        newData.Nombre_Convives = found;
                    } else {
                        newData.Nombre_Convives = opts[0] || "";
                    }
                }
            } else {
                const opts = getInitialConvivesOptions(newData.Type_Evenement);
                newData.Nombre_Convives = opts[0] || "";
            }

            return newData;
        });
    }, [searchParams, isCochonOrPorchetta, isAnyBBQ, isBuffet, isAssociations, isPlatUnique, isBuffetFroidMode, isPainsMode]);

    // --- PRICING ENGINE ---

    // Derived State for Price
    const getPriceTier = (countStr: string): 'low' | 'mid' | 'high' => {
        if (!countStr) return 'high'; // Default if empty
        if (countStr.includes("Moins de 25")) return 'low';
        if (countStr.includes("Moins de 20")) return 'high';
        if (countStr.includes("Plus de")) return 'high';
        return 'mid';
    };

    const calculateTotal = () => {
        if (isBuffetChaud) return { perPerson: -1, materiel: 0 };
        if (isPlatPrepare) {
            return { perPerson: cartTotal, materiel: 0 };
        }
        if (!isPlatUnique && !isAnyBBQ && !isBuffetFroidMode && !isPains && !isZakouskis && !isVerrines && !isCollectivite) {
            return { perPerson: 0, materiel: 0 };
        }

        // 1. Base Price
        let base = 0;
        let supplements = 0;

        if (isPlatUnique) {
            base = 14.5;
        } else if (isAnyBBQ) {
            const bbqType = menuParam?.replace('bbq_', '') || 'classique';
            const prices = BBQ_TIER_PRICES[bbqType];
            if (prices === undefined) return { perPerson: 0, materiel: 0 };

            const convives = formData.Nombre_Convives;
            const priceVal = prices[convives];

            if (priceVal !== undefined) {
                base = priceVal;
            } else {
                base = -1; // "Plus de 250" or "Plus de 180" -> Sur devis
            }

            // Apply Service (+2,5€/pers)
            if (base !== -1 && formData.Service_Check === "Oui") {
                base += 2.5;
            }
        } else if (isBuffetFroidMode) {
            const prices = BUFFET_FROID_PRICES[menuParam || ''];
            if (prices) {
                if (formData.Nombre_Convives === 'Moins de 25') {
                    base = prices.small;
                } else {
                    base = prices.medium;
                }
            }
        } else if (isPains && formData.Categorie_Pains && formData.Quantite_Pains) {
            const basePrice = painsData[formData.Categorie_Pains].price;
            let adjustedPrice = basePrice;

            if (formData.Nombre_Convives === 'Moins de 25') {
                adjustedPrice += 0.30;
            } else if (formData.Nombre_Convives === '100 à 200') {
                adjustedPrice -= 0.20;
            }

            const quantity = parseInt(formData.Quantite_Pains, 10);
            base = adjustedPrice * quantity;
        } else if (isZakouskis) {
            let basePriceTotal = 0;
            // On boucle sur les 10 choix potentiels
            for (let i = 1; i <= 10; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const item = (formData as any)[`Zakouski_Item_${i}`];
                if (item) {
                    let itemPrice = getZakouskiBasePrice(item);
                    if (formData.Nombre_Convives === 'Moins de 25') itemPrice += 0.30;
                    else if (formData.Nombre_Convives === '100 à 200') itemPrice -= 0.20;
                    basePriceTotal += itemPrice;
                }
            }
            base = basePriceTotal;
        } else if (isVerrines && formData.Format_Verrines) {
            let basePriceTotal = 0;
            const format = formData.Format_Verrines; // "6cl" ou "12cl"

            for (let i = 1; i <= 10; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const item = (formData as any)[`Verrine_Item_${i}`];
                if (item) {
                    const basePrices = getVerrineBasePrices(item);
                    if (basePrices) {
                        let itemPrice = format === "6cl" ? basePrices.price6cl : basePrices.price12cl;
                        if (formData.Nombre_Convives === 'Moins de 25') itemPrice += 0.30;
                        else if (formData.Nombre_Convives === '100 à 200') itemPrice -= 0.20;
                        basePriceTotal += itemPrice;
                    }
                }
            }
            base = basePriceTotal;
        } else if (isCollectivite) {
            if (formData.Collectivite_Volet === 'salad_bar' && formData.Salad_Bar_Choix) {
                let itemPrice = saladesBowlsData[formData.Salad_Bar_Choix] || 0;
                if (formData.Nombre_Convives === 'Moins de 30') {
                    itemPrice = itemPrice * 1.10;
                }
                base = itemPrice;
            } else if (formData.Plat_Collectivite) {
                let itemPrice = collectiviteData[formData.Plat_Collectivite] || 0;
                // Majoration de 10% si moins de 30 personnes
                if (formData.Nombre_Convives === 'Moins de 30') {
                    itemPrice = itemPrice * 1.10;
                }
                base = itemPrice;
            }
        }

        if (base === -1) return { perPerson: -1, materiel: 0 };

        const tier = getPriceTier(formData.Nombre_Convives);
        if (tier === 'high') {
            if (isPains && formData.Nombre_Convives === 'Plus de 200') return { perPerson: -1, materiel: 0 };
            if (isZakouskis && formData.Nombre_Convives === 'Plus de 200') return { perPerson: -1, materiel: 0 };
            if (isVerrines && formData.Nombre_Convives === 'Plus de 200') return { perPerson: -1, materiel: 0 };
            if (isCollectivite && formData.Nombre_Convives === 'Plus de 100') return { perPerson: -1, materiel: 0 };
            if (!isPains && !isZakouskis && !isVerrines && !isCollectivite) return { perPerson: -1, materiel: 0 };
        }

        // 2. Supplements

        // Loop over selected meats
        const meatFields = [
            formData.Viande_1,
            formData.Viande_2,
            formData.Viande_3
        ];
        meatFields.forEach(field => {
            if (field) {
                supplements += getMeatSupplementPrice(field);
            }
        });

        if (isAnyBBQ) {
            if (formData.Viande_Extra_1) {
                supplements += 3 + getMeatSupplementPrice(formData.Viande_Extra_1);
            }
            if (formData.Viande_Extra_2) {
                supplements += 3 + getMeatSupplementPrice(formData.Viande_Extra_2);
            }
            if (formData.Suppl_Crudite_Extra) supplements += 1.5;
            if (formData.Feculent_Extra) supplements += 2;
        }

        // 3. Options Chaudes (Légumes & Sauces)
        if (formData.Legumes_Chauds_Check === "Oui") {
            supplements += 1.0;
        }
        if (formData.Sauces_Chaudes_Check === "Oui") {
            supplements += 0.5;
        }
        if (formData.Accompagnement_Chaud_Supplement_Check === "Oui" && formData.Accompagnement_Chaud_Supplement) {
            supplements += 1;
        }

        // 4. Dessert & Mignardises
        if (formData.Dessert_Check === "Oui") {
            if (formData.Dessert_Type === "mignardises") {
                const qty = (formData.Mignardises_Varietes || []).length;
                if (qty > 0) {
                    supplements += getMignardisesPricePerPerson(qty);
                }
            } else {
                // Option traditionnel (+6,00€ / personne)
                supplements += 6;
            }
        }

        // Location Vaisselle & Verrerie (isolated flat equipment costs)
        let materiel = 0;
        if (formData.Location_Vaisselle_Check === "Oui") {
            const guestCount = getEstimatedGuestCount(formData.Nombre_Convives);
            materiel += guestCount * 1.50;
        }

        if (formData.Location_Verrerie_Check === "Oui") {
            const vinQty = parseInt(formData.Location_Verrerie_Vin || "0", 10);
            const softQty = parseInt(formData.Location_Verrerie_Soft || "0", 10);
            const fluteQty = parseInt(formData.Location_Verrerie_Flute || "0", 10);
            const glasswareCost = (Math.ceil(vinQty / 5) + Math.ceil(softQty / 5) + Math.ceil(fluteQty / 5)) * 1.50;
            materiel += glasswareCost;
        }

        return { perPerson: base + supplements, materiel };
    };

    const totalPrice = calculateTotal();

    // Helper to get needed list based on menu
    const getBBQList = () => {
        if (isBBQClassique) return viandesClassiques;
        if (isBBQMer) return fruitsDeMer;
        if (isBBQVegetarien) return optionsVegetariennes;
        if (isBBQNobles) return NOBLES;
        if (isBBQDinatoire) return dinatoireViandes;
        if (isBBQCompose) return viandesCompose;
        return viandesClassiques;
    };

    const getBBQCascadeList = (): CascadeMeatItem[] => {
        if (isBBQClassique) return viandesClassiquesCascade;
        if (isBBQMer) return fruitsDeMer;
        if (isBBQVegetarien) return optionsVegetariennes;
        if (isBBQNobles) return NOBLES;
        if (isBBQDinatoire) return dinatoireViandesCascade;
        if (isBBQCompose) return viandesComposeCascade;
        return viandesClassiquesCascade;
    };
    const renderServiceToggle = (
        priceLabel: string = "+2,50 € / pers.",
        description: string = "Personnel de service et prise en charge sur place."
    ) => {
        const isWithService = formData.Service_Check === "Oui";
        return (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <label className="block text-sm font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🧑‍🍳</span> Prestation de Service
                    </label>
                    <p className="text-xs text-neutral-500 mt-1 italic">
                        {description}
                    </p>
                </div>
                <div className="flex bg-neutral-100/80 p-1 rounded-xl w-fit border border-neutral-200 shrink-0">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, Service_Check: "Non" }))}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            !isWithService
                                ? "bg-white border border-neutral-200 shadow-xs text-neutral-900 font-bold"
                                : "text-neutral-500 hover:text-black"
                        }`}
                    >
                        Sans service
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, Service_Check: "Oui" }))}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isWithService
                                ? "bg-black text-[#D4AF37] shadow-sm font-bold"
                                : "text-neutral-500 hover:text-black"
                        }`}
                    >
                        Avec service ({priceLabel})
                    </button>
                </div>
            </div>
        );
    };

    const renderPriceDisplay = () => {
        if (totalPrice.perPerson === 0 && totalPrice.materiel === 0) return null;
        return (
            <div className="transition-all duration-300 border-t border-[#cbb079]/30 pt-8 mt-8">
                <div className="bg-neutral-900 text-[#cbb079] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#cbb079]/40 max-w-lg mx-auto transform hover:scale-[1.01] transition-transform">
                    <div>
                        <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#cbb079] block">
                            PRIX ESTIMATIF
                        </span>
                        <span className="text-xs text-[#cbb079]/70 mt-1 font-light block">
                            {formData.Service_Check === "Oui" ? "Prestation de service incluse" : "Hors frais de déplacement et service"}
                        </span>
                    </div>

                    <div className="text-left sm:text-right">
                        {totalPrice.perPerson === -1 ? (
                            <span className="bg-[#cbb079] text-neutral-900 px-4 py-1.5 rounded-lg font-bold text-xs tracking-widest uppercase inline-block">
                                SUR DEVIS
                            </span>
                        ) : (
                            <div>
                                <span className="text-2xl font-serif font-bold text-[#cbb079]">
                                    {totalPrice.perPerson > 0 ? (
                                        <>
                                            {totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} € <span className="text-sm font-sans font-normal text-neutral-300">/ pers</span>
                                            {totalPrice.materiel > 0 && (
                                                <span className="block text-xs text-[#cbb079]/80 font-sans font-normal">
                                                    + {totalPrice.materiel.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} € (Matériel)
                                                </span>
                                            )}
                                            <span className="text-xs font-sans font-normal text-[#cbb079]/70 ml-1.5 uppercase">HTVA</span>
                                        </>
                                    ) : (
                                        "---"
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked ? "Oui" : "Non",
                ...(name === "Societe" && !checked ? { Nom_Societe: "" } : {}),
                ...(name === "Sauces_Chaudes_Check" && !checked ? { Sauces_Chaudes_Choix: [] } : {}),
                ...(name === "Accompagnement_Chaud_Supplement_Check" && !checked ? { Accompagnement_Chaud_Supplement: "" } : {}),
                ...(name === "Dessert_Check" && !checked ? { Dessert_Choix: "", Dessert_Type: "traditionnel", Mignardises_Quantite: "3", Mignardises_Varietes: [] } : {}),
                ...(name === "Location_Verrerie_Check" && !checked ? { Location_Verrerie_Vin: "0", Location_Verrerie_Soft: "0", Location_Verrerie_Flute: "0" } : {})
            }));
            return;
        }

        // Strict Phone Formatting
        if (name === "Tel") {
            let cleanVal = value.replace(/\D/g, "");
            let formatted = cleanVal;

            // Determine max length based on prefix (04XX -> Mobile -> 10 digits, else 9)
            const isMobile = /^(045|046|047|048|049)/.test(cleanVal);
            const maxLength = isMobile ? 10 : 9;

            if (cleanVal.length > maxLength) cleanVal = cleanVal.slice(0, maxLength);

            if (cleanVal.length > 0) {
                if (isMobile) {
                    // 0470 12 34 56
                    if (cleanVal.length > 4) {
                        formatted = cleanVal.slice(0, 4) + ' ' + cleanVal.slice(4).match(/.{1,2}/g)?.join(' ');
                    }
                } else {
                    // 02 123 45 67
                    if (cleanVal.length > 2) {
                        formatted = cleanVal.slice(0, 2) + (cleanVal.length > 2 ? ' ' + cleanVal.slice(2, 5) : '') + (cleanVal.length > 5 ? ' ' + cleanVal.slice(5, 7) : '') + (cleanVal.length > 7 ? ' ' + cleanVal.slice(7, 9) : '');
                    }
                }
            }

            setFormData(prev => ({ ...prev, [name]: formatted.trim() }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleSauceChaude = (sauce: string) => {
        setFormData(prev => {
            const current = prev.Sauces_Chaudes_Choix || [];
            if (current.includes(sauce)) {
                return { ...prev, Sauces_Chaudes_Choix: current.filter(s => s !== sauce) };
            } else {
                return { ...prev, Sauces_Chaudes_Choix: [...current, sauce] };
            }
        });
    };

    const handleToggleMignardiseVariete = (item: string) => {
        setFormData(prev => {
            const currentVarietes = prev.Mignardises_Varietes || [];
            let updatedVarietes: string[];
            if (currentVarietes.includes(item)) {
                updatedVarietes = currentVarietes.filter(v => v !== item);
            } else {
                if (currentVarietes.length >= 6) {
                    return prev; // Maximum 6 variétés
                }
                updatedVarietes = [...currentVarietes, item];
            }
            return {
                ...prev,
                Mignardises_Varietes: updatedVarietes,
                Mignardises_Quantite: updatedVarietes.length.toString()
            };
        });
    };

    const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) return;
        if (new Date(val) < new Date(getMinDate())) {
            alert("La date sélectionnée est trop proche. Veuillez sélectionner une date à au moins 7 jours.");
            setFormData(prev => ({ ...prev, Date: getMinDate() }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Static Required Fields
        if (!formData.Prenom.trim()) newErrors.Prenom = "Requis";
        if (!formData.Nom.trim()) newErrors.Nom = "Requis";
        if (!formData.Mail.trim()) {
            newErrors.Mail = "Requis";
        } else if (!validateEmail(formData.Mail)) {
            newErrors.Mail = "Format invalide (ex: nom@domaine.com)";
        }
        if (!formData.Tel.trim()) {
            newErrors.Tel = "Requis";
        } else if (!isValidPhone(formData.Tel)) {
            newErrors.Tel = "Format invalide (ex: 0475 12 34 56)";
        }
        if (!isPlatPrepare && !formData.Date.trim()) newErrors.Date = "Requis";

        // Pour un plat préparé, on ne force pas le nombre de convives
        if (!isPlatPrepare && !formData.Nombre_Convives.trim()) newErrors.Nombre_Convives = "Requis";

        // Dynamic Validation
        if (isPlatPrepare) {
            if (!formData.Plat_Prepare_Quantite || parseInt(formData.Plat_Prepare_Quantite) < 1) newErrors.Plat_Prepare_Quantite = "Requis";
        } else if (isPlatUnique) {
            if (!formData.Plat_Associatif) newErrors.Plat_Associatif = "Requis";
        } else if (isBuffetFroid) {
            if (!formData.Feculent_Froid) newErrors.Feculent_Froid = "Requis";
            if (formData.Crudites_Choix_Chef !== "Oui") {
                if (!formData.Crudite_1) newErrors.Crudite_1 = "Requis";
                if (!formData.Crudite_2) newErrors.Crudite_2 = "Requis";
                if (!formData.Crudite_3) newErrors.Crudite_3 = "Requis";
                if (!formData.Crudite_4) newErrors.Crudite_4 = "Requis";
                if (!formData.Crudite_5) newErrors.Crudite_5 = "Requis";
                if (!formData.Crudite_6) newErrors.Crudite_6 = "Requis";
            }
        } else if (isAnyBBQ) {
            if (!formData.Feculent) newErrors.Feculent = "Requis";
            if (formData.Crudites_Choix_Chef !== "Oui") {
                if (!formData.Crudite_1) newErrors.Crudite_1 = "Requis";
                if (!formData.Crudite_2) newErrors.Crudite_2 = "Requis";
                if (!formData.Crudite_3) newErrors.Crudite_3 = "Requis";
                if (!formData.Crudite_4) newErrors.Crudite_4 = "Requis";
                if (!formData.Crudite_5) newErrors.Crudite_5 = "Requis";
                if (!formData.Crudite_6) newErrors.Crudite_6 = "Requis";
            }

            if (isCochonOrPorchetta) {
                // No specific dynamic fields required for these
            } else if (isBBQCompose) {
                if (!formData.compose_entree_1) newErrors.compose_entree_1 = "Requis";
                if (!formData.compose_entree_2) newErrors.compose_entree_2 = "Requis";
                if (!formData.Viande_1) newErrors.Viande_1 = "Requis";
                if (!formData.Viande_2) newErrors.Viande_2 = "Requis";
            } else if (isBBQDinatoire) {
                if (!formData.dinatoire_service_1) newErrors.dinatoire_service_1 = "Requis";
                if (!formData.dinatoire_service_2) newErrors.dinatoire_service_2 = "Requis";
                if (!formData.Viande_1) newErrors.Viande_1 = "Requis";
                if (!formData.Viande_2) newErrors.Viande_2 = "Requis";
            } else if (isBBQNobles) {
                if (!formData.Viande_1) newErrors.Viande_1 = "Requis";
                if (!formData.Viande_2) newErrors.Viande_2 = "Requis";
            } else {
                // Classique, Mer, Vege
                if (!formData.Viande_1) newErrors.Viande_1 = "Requis";
                if (!formData.Viande_2) newErrors.Viande_2 = "Requis";
                if (!formData.Viande_3) newErrors.Viande_3 = "Requis";
            }
        } else if (isPains) {
            if (!formData.Categorie_Pains) newErrors.Categorie_Pains = "Requis";
            if (!formData.Quantite_Pains) newErrors.Quantite_Pains = "Requis";
        } else if (isZakouskis) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formAny = formData as any;
            if (!formAny.Zakouski_Item_1) newErrors.Zakouski_Item_1 = "Requis";
            if (!formAny.Zakouski_Item_2) newErrors.Zakouski_Item_2 = "Requis";
            if (!formAny.Zakouski_Item_3) newErrors.Zakouski_Item_3 = "Requis";
        } else if (isVerrines) {
            if (!formData.Format_Verrines) newErrors.Format_Verrines = "Requis";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formAny = formData as any;
            if (!formAny.Verrine_Item_1) newErrors.Verrine_Item_1 = "Requis";
            if (!formAny.Verrine_Item_2) newErrors.Verrine_Item_2 = "Requis";
            if (!formAny.Verrine_Item_3) newErrors.Verrine_Item_3 = "Requis";
        } else if (isCollectivite) {
            if (formData.Collectivite_Volet === 'salad_bar') {
                if (!formData.Salad_Bar_Choix) {
                    newErrors.Salad_Bar_Choix = "Veuillez choisir une salade ou un bowl";
                }
            } else {
                if (!formData.Plat_Collectivite) newErrors.Plat_Collectivite = "Requis";
            }
        }

        // Validation Option Desserts & Mignardises
        if (formData.Dessert_Check === "Oui") {
            if (formData.Dessert_Type === "traditionnel") {
                if (!formData.Dessert_Choix) {
                    newErrors.Dessert_Choix = "Veuillez choisir un dessert";
                }
            } else if (formData.Dessert_Type === "mignardises") {
                if (!formData.Mignardises_Varietes || formData.Mignardises_Varietes.length === 0) {
                    newErrors.Mignardises_Varietes = "Veuillez sélectionner au moins 1 variété de mignardise";
                }
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
            alert("Veuillez valider le Captcha avant d'envoyer votre message.");
            return;
        }

        // 1. Validation (Garde ta fonction validateForm existante)
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorKey = Object.keys(newErrors)[0];
            const element = document.getElementsByName(firstErrorKey)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return;
        }

        setStatus("submitting");

        // 2. Préparation des données spécifiques
        let isSurDevis = false;
        if (isPlatUnique) {
            isSurDevis = formData.Nombre_Convives === 'Moins de 50' || formData.Nombre_Convives === 'Plus de 100';
        } else if (isBuffetFroid) {
            isSurDevis = formData.Nombre_Convives === 'Plus de 250';
        } else if (isCochonOrPorchetta) {
            isSurDevis = getConvivesMax(formData.Nombre_Convives) > 180;
        } else if (isPains) {
            isSurDevis = formData.Nombre_Convives === 'Plus de 200';
        } else if (isZakouskis) {
            isSurDevis = formData.Nombre_Convives === 'Plus de 200';
        } else if (isVerrines) {
            isSurDevis = formData.Nombre_Convives === 'Plus de 200';
        } else if (isCollectivite) {
            isSurDevis = formData.Nombre_Convives === 'Plus de 100';
        } else if (isBuffetChaud) {
            isSurDevis = true;
        } else {
            isSurDevis = getConvivesMax(formData.Nombre_Convives) > 250;
        }
        const isSurDevisOrMinusOne = isSurDevis || totalPrice.perPerson === -1;
        const finalPriceStr = isSurDevisOrMinusOne
            ? "SUR DEVIS"
            : totalPrice.materiel > 0
                ? `${totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers + ${totalPrice.materiel.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ (Matériel)`
                : `${totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers`;

        // Formatage propre du nom de la formule (ex: "bbq_classique" -> "Barbecue Classique")
        const formatFormulaName = (rawName: string | null) => {
            if (searchParams.get('formule') === 'buffet-chaud') return "Buffet Chaud Sur-Mesure";
            if (!rawName) return "Sur mesure / Non spécifié";
            if (rawName.startsWith('buffet_')) {
                const name = rawName.replace('buffet_', '').replace(/_/g, ' ');
                return `Buffet Froid ${name.charAt(0).toUpperCase() + name.slice(1)}`;
            }
            if (rawName === 'pains_garnis') return "Petits pains";
            if (rawName === 'zakouskis') return "Zakouskis";
            if (rawName === 'verrines') return "Verrines";
            if (rawName === 'collectivite') return "Repas de collectivité";
            const name = rawName.replace('bbq_', '').replace(/_/g, ' ');
            return `Barbecue ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        };

        const getVerrerieDetail = () => {
            if (formData.Location_Verrerie_Check !== "Oui") return "Non";

            const vinQty = parseInt(formData.Location_Verrerie_Vin || "0", 10);
            const softQty = parseInt(formData.Location_Verrerie_Soft || "0", 10);
            const fluteQty = parseInt(formData.Location_Verrerie_Flute || "0", 10);

            const details: string[] = [];
            if (vinQty > 0) details.push(`${vinQty}x Verre à vin`);
            if (softQty > 0) details.push(`${softQty}x Verre à soft (25cl)`);
            if (fluteQty > 0) details.push(`${fluteQty}x Flûte à champagne`);

            const cost = (Math.ceil(vinQty / 5) + Math.ceil(softQty / 5) + Math.ceil(fluteQty / 5)) * 1.50;

            if (details.length === 0) return "Oui (Aucun verre sélectionné - 0,00€)";
            return `Oui (${details.join(", ")} - Coût: ${cost.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€)`;
        };

        // 3. Construction du Payload Web3Forms (Propre pour le Web, Visuel pour le Mail)
        const payload = {
            access_key: "32511cd2-dc66-49b5-8c6f-12a73315f644",
            subject: `Nouvelle demande : ${formData.Nom} ${formData.Prenom}`,
            from_name: "Site Traiteur Compère",

            // DÉTAILS ÉVÉNEMENT
            "📋 Formule Choisie": formatFormulaName(menuParam),
            "💰 PRIX ESTIMATIF AFFICHÉ": finalPriceStr,
            "💰 PRIX NOURRITURE / PERS": isSurDevisOrMinusOne ? "SUR DEVIS" : `${totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers`,
            "📦 TOTAL MATÉRIEL RÉCEPTIF": totalPrice.materiel > 0 ? `${totalPrice.materiel.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€` : "Aucun (0,00€)",
            ...(isSurDevisOrMinusOne && totalPrice.perPerson > 0 && { "💡 Prix indicatif de base (Info Interne)": `${totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers` }),
            "📅 Date de l'événement": formData.Date,
            "👥 Nombre de convives": formData.Nombre_Convives,
            ...(isAnyBBQ && { "🧑‍🍳 Prestation Service": formData.Service_Check === "Oui" ? "Oui (+2,5€/pers)" : "Non" }),

            // COORDONNÉES
            "👤 Nom complet": `${formData.Nom} ${formData.Prenom}`,
            "✉️ Email": formData.Mail,
            "📞 Téléphone": formData.Tel,
            "🏢 Société": formData.Societe === "Oui" ? formData.Nom_Societe : "Non",

            // COMPOSITION (Conditionnelle)
            ...(formData.compose_entree_1 && { "🍤 Entrée 1": formData.compose_entree_1 }),
            ...(formData.compose_entree_2 && { "🍤 Entrée 2": formData.compose_entree_2 }),

            ...(formData.dinatoire_service_1 && { "🍝 1er Service 1": formData.dinatoire_service_1 }),
            ...(formData.dinatoire_service_2 && { "🍝 1er Service 2": formData.dinatoire_service_2 }),

            ...(formData.Viande_1 && { "🥩 Plat / Viande 1": formData.Viande_1 }),
            ...(formData.Viande_2 && { "🥩 Plat / Viande 2": formData.Viande_2 }),
            ...(formData.Viande_3 && { "🥩 Plat / Viande 3": formData.Viande_3 }),

            // PLAT UNIQUE
            ...(formData.Plat_Associatif && { "🍽️ Plat Principal": formData.Plat_Associatif }),
            ...(formData.Plat_Associatif_Detail && { "👨‍🍳 Option du Plat": formData.Plat_Associatif_Detail }),

            // FÉCULENTS (BBQ & Buffets)
            ...(formData.Feculent && { "🍚 Féculent Inclus": formData.Feculent }),
            ...(formData.Feculent_Extra && { "🍚 Féculent Supplémentaire (+2€)": formData.Feculent_Extra }),
            ...(formData.Feculent_Froid && { "🥔 Féculent Froid": formData.Feculent_Froid }),

            // CRUDITÉS (BBQ & Buffets)
            ...(() => {
                const checkedCrudites = [
                    formData.Crudite_1,
                    formData.Crudite_2,
                    formData.Crudite_3,
                    formData.Crudite_4,
                    formData.Crudite_5,
                    formData.Crudite_6
                ].filter(Boolean);

                if (isAnyBBQ || isBuffetFroid) {
                    if (formData.Crudites_Choix_Chef === "Oui") {
                        if (checkedCrudites.length === 0) {
                            return {
                                "🥗 Crudités": "Assortiment au choix du chef",
                                ...(formData.Suppl_Crudite_Extra && { "⭐ Crudité Extra (+1,50€)": formData.Suppl_Crudite_Extra })
                            };
                        } else if (checkedCrudites.length < 6) {
                            return {
                                "🥗 Crudités": `${checkedCrudites.join(', ')} + Complément au choix du chef`,
                                ...(formData.Suppl_Crudite_Extra && { "⭐ Crudité Extra (+1,50€)": formData.Suppl_Crudite_Extra })
                            };
                        } else {
                            return {
                                "🥗 Crudités": checkedCrudites.join(', '),
                                ...(formData.Suppl_Crudite_Extra && { "⭐ Crudité Extra (+1,50€)": formData.Suppl_Crudite_Extra })
                            };
                        }
                    } else if (checkedCrudites.length > 0) {
                        return {
                            ...(formData.Crudite_1 && { "🥗 Crudité 1": formData.Crudite_1 }),
                            ...(formData.Crudite_2 && { "🥗 Crudité 2": formData.Crudite_2 }),
                            ...(formData.Crudite_3 && { "🥗 Crudité 3": formData.Crudite_3 }),
                            ...(formData.Crudite_4 && { "🥗 Crudité 4": formData.Crudite_4 }),
                            ...(formData.Crudite_5 && { "🥗 Crudité 5": formData.Crudite_5 }),
                            ...(formData.Crudite_6 && { "🥗 Crudité 6": formData.Crudite_6 }),
                            ...(formData.Suppl_Crudite_Extra && { "⭐ Crudité Extra (+1,50€)": formData.Suppl_Crudite_Extra })
                        };
                    }
                }
                return {};
            })(),

            // --- SECTION PETITS PAINS ---
            ...(formData.Type_Evenement === 'Petits pains' && {
                "🥖 MENU SÉLECTIONNÉ": "PETITS PAINS & WRAPS",
                ...(formData.Categorie_Pains && { "🏷️ Gamme choisie": formData.Categorie_Pains }),
                ...(formData.Quantite_Pains && { "🔢 Quantité": `${formData.Quantite_Pains} pièces / pers.` })
            }),

            // --- SECTION ZAKOUSKIS ---
            ...(formData.Type_Evenement === 'Zakouskis' && {
                "🥟 MENU SÉLECTIONNÉ": "ZAKOUSKIS",
                ...(formData as any).Zakouski_Item_1 && { "Choix 1": (formData as any).Zakouski_Item_1 },
                ...(formData as any).Zakouski_Item_2 && { "Choix 2": (formData as any).Zakouski_Item_2 },
                ...(formData as any).Zakouski_Item_3 && { "Choix 3": (formData as any).Zakouski_Item_3 },
                ...(formData as any).Zakouski_Item_4 && { "Choix 4": (formData as any).Zakouski_Item_4 },
                ...(formData as any).Zakouski_Item_5 && { "Choix 5": (formData as any).Zakouski_Item_5 },
                ...(formData as any).Zakouski_Item_6 && { "Choix 6": (formData as any).Zakouski_Item_6 },
                ...(formData as any).Zakouski_Item_7 && { "Choix 7": (formData as any).Zakouski_Item_7 },
                ...(formData as any).Zakouski_Item_8 && { "Choix 8": (formData as any).Zakouski_Item_8 },
                ...(formData as any).Zakouski_Item_9 && { "Choix 9": (formData as any).Zakouski_Item_9 },
                ...(formData as any).Zakouski_Item_10 && { "Choix 10": (formData as any).Zakouski_Item_10 }
            }),

            // --- SECTION VERRINES ---
            ...(formData.Type_Evenement === 'Verrines' && {
                "🍵 MENU SÉLECTIONNÉ": "VERRINES",
                "📐 Format choisi": formData.Format_Verrines || "Non spécifié",
                ...(formData as any).Verrine_Item_1 && { "Choix Verrine 1": (formData as any).Verrine_Item_1 },
                ...(formData as any).Verrine_Item_2 && { "Choix Verrine 2": (formData as any).Verrine_Item_2 },
                ...(formData as any).Verrine_Item_3 && { "Choix Verrine 3": (formData as any).Verrine_Item_3 },
                ...(formData as any).Verrine_Item_4 && { "Choix Verrine 4": (formData as any).Verrine_Item_4 },
                ...(formData as any).Verrine_Item_5 && { "Choix Verrine 5": (formData as any).Verrine_Item_5 },
                ...(formData as any).Verrine_Item_6 && { "Choix Verrine 6": (formData as any).Verrine_Item_6 },
                ...(formData as any).Verrine_Item_7 && { "Choix Verrine 7": (formData as any).Verrine_Item_7 },
                ...(formData as any).Verrine_Item_8 && { "Choix Verrine 8": (formData as any).Verrine_Item_8 },
                ...(formData as any).Verrine_Item_9 && { "Choix Verrine 9": (formData as any).Verrine_Item_9 },
                ...(formData as any).Verrine_Item_10 && { "Choix Verrine 10": (formData as any).Verrine_Item_10 }
            }),

            // --- SECTION COLLECTIVITÉS & SALAD BAR ---
            ...(formData.Type_Evenement === 'Repas de collectivité' && {
                "🥘 MENU SÉLECTIONNÉ": "REPAS DE COLLECTIVITÉ & PLATS UNIQUES",
                "📋 Volet Sélectionné": formData.Collectivite_Volet === 'salad_bar' ? "Salad Bar & Bowls Fraîcheur" : "Plats Uniques Chauds",
                ...(formData.Collectivite_Volet === 'salad_bar' ? {
                    "🥗 Salade / Bowl Choisi": formData.Salad_Bar_Choix
                        ? `${formData.Salad_Bar_Choix} (${(saladesBowlsData[formData.Salad_Bar_Choix] || 0).toFixed(2).replace('.', ',')} € HTVA / pers.)`
                        : "Non spécifié"
                } : {
                    "🍽️ Plat Unique Chaud Choisi": formData.Plat_Collectivite
                        ? `${formData.Plat_Collectivite} (${(collectiviteData[formData.Plat_Collectivite] || 0).toFixed(2).replace('.', ',')} € HTVA / pers.)`
                        : "Non spécifié"
                })
            }),

            // --- SECTION BUFFET CHAUD ---
            ...(formData.Type_Evenement === 'Buffet Chaud' && {
                "🥘 MENU SÉLECTIONNÉ": "BUFFET CHAUD SUR-MESURE",
                "🔢 Nombre de services": `${formData.Buffet_Chaud_Services} services`,
                ...(formData.Buffet_Chaud_Zakouskis && { "🥟 Apéritif": formData.Buffet_Chaud_Zakouskis }),
                ...(formData.Buffet_Chaud_Entree_1 && { "🥗 Entrée 1": formData.Buffet_Chaud_Entree_1 }),
                ...(formData.Buffet_Chaud_Entree_2 && { "🍲 Entrée 2": formData.Buffet_Chaud_Entree_2 }),
                ...(formData.Buffet_Chaud_Plat && { "🥘 Plat Principal": formData.Buffet_Chaud_Plat }),
                ...(formData.Buffet_Chaud_Dessert && { "🍰 Dessert": formData.Buffet_Chaud_Dessert }),
                ...(formData.Buffet_Chaud_Commentaires && { "💬 Commentaires": formData.Buffet_Chaud_Commentaires })
            }),

            // SUPPLÉMENTS VIANDES (BBQ)
            ...(formData.Viande_Extra_1 && { "🥩 Viande Suppl. 1 (+3€)": formData.Viande_Extra_1 }),
            ...(formData.Viande_Extra_2 && { "🥩 Viande Suppl. 2 (+3€)": formData.Viande_Extra_2 }),

            // ANCIENS CHAMPS (Compatibilité)
            ...(formData.Supplement_Viande_1 && { "⭐ Supplément Viande 1": formData.Supplement_Viande_1 }),
            ...(formData.Supplement_Viande_2 && { "⭐ Supplément Viande 2": formData.Supplement_Viande_2 }),
            ...(formData.Supplement_Viande_3 && { "⭐ Supplément Viande 3": formData.Supplement_Viande_3 }),
            ...(formData.Accompagnement_Froid_1 && { "🥗 Accompagnement Froid 1": formData.Accompagnement_Froid_1 }),
            // ACCOMPAGNEMENTS CHAUDS & SAUCES
            ...(formData.Legumes_Chauds_Check === "Oui" && {
                "🥦 Option Légumes Chauds": "Légumes chauds cuisinés (+1,00 € / pers.)"
            }),
            ...(formData.Sauces_Chaudes_Check === "Oui" && {
                "🍲 Option Sauces Chaudes": `Assortiment de sauces chaudes maison (+0,50 € / pers.)${formData.Sauces_Chaudes_Choix && formData.Sauces_Chaudes_Choix.length > 0 ? ` (${formData.Sauces_Chaudes_Choix.join(', ')})` : ''}`
            }),
            ...(formData.Accompagnement_Chaud_Supplement && { "🔥 Accompagnement Chaud Extra": formData.Accompagnement_Chaud_Supplement }),

            // DESSERTS
            ...(formData.Dessert_Check === "Oui" && {
                "🍰 Option Dessert": formData.Dessert_Type === "mignardises"
                    ? `Option : Mignardises (${formData.Mignardises_Varietes.length} pièces/p - ${getMignardisesPricePerPerson(formData.Mignardises_Varietes.length).toFixed(2).replace('.', ',')} €/p) — Variétés : ${formData.Mignardises_Varietes.length > 0 ? formData.Mignardises_Varietes.join(', ') : 'Non spécifiées'}`
                    : `Option : Desserts traditionnels (+6,00 €/p)${formData.Dessert_Choix ? ` (${formData.Dessert_Choix})` : ''}`
            }),

            // DIVERS
            "🍽️ Location de vaisselle": formData.Location_Vaisselle_Check === "Oui" ? "Oui (+1,50€/pers)" : "Non",
            "🍷 Location de verrerie": getVerrerieDetail(),
            "💬 Message / Allergies": formData.details_projet || "Aucun message",
            "🔄 Souhaite être recontacté": formData.Souhaite_etre_recontacte === "Oui" ? "Oui" : "Non"
        };

        // 4. Envoi à Web3Forms ou API Interne
        try {
            if (isPlatPrepare) {
                const apiPayload = {
                    Nom: formData.Nom,
                    Prenom: formData.Prenom,
                    Mail: formData.Mail,
                    Tel: formData.Tel,
                    Societe: formData.Societe,
                    Nom_Societe: formData.Nom_Societe,
                    Date: new Date().toLocaleDateString('fr-BE'),
                    details_projet: formData.details_projet,
                    totalPrice: cartTotal,
                    cartItems: cartItems,
                    captchaToken: captchaToken
                };

                const response = await fetch("/api/commande", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(apiPayload)
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    setStatus("success");
                    const joursUniques = Array.from(new Set(cartItems.map(item => item.jour))).join(',');
                    clearCart();
                    setTimeout(() => {
                        window.location.href = `/commande-confirmee?nom=${encodeURIComponent(formData.Nom)}&prenom=${encodeURIComponent(formData.Prenom)}&orderId=${result.orderNumber}&total=${cartTotal}&jours=${encodeURIComponent(joursUniques)}`;
                    }, 3000);
                } else {
                    console.error("Erreur API Commande:", result);
                    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                    setStatus("error");
                }
            } else {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).gtag('event', 'generate_lead', {
                            'event_category': 'formulaire',
                            'event_label': 'contact_traiteur'
                        });
                    }
                    // Affichage du V vert
                    setStatus("success");

                    // Redirection après 3s
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                } else {
                    console.error("Erreur Web3Forms:", result);
                    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                    setStatus("error");
                }
            }
        } catch (error) {
            console.error("Erreur Fetch:", error);
            alert("Une erreur de connexion est survenue.");
            setStatus("error");
        }
    };


    // --- STYLES HELPER ---
    const getInputStyle = (fieldName: string) => {
        const base = `w-full bg-white border rounded-xl px-5 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner text-base`;
        if (errors[fieldName]) {
            return `${base} border-red-500 ring-1 ring-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500`;
        }
        return `${base} border-neutral-200 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] hover:border-[#D4AF37]/50`;
    };

    const labelStyle = `block text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2 ml-1`;

    // --- RENDERERS ---

    const handleSelectMeat = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    interface CustomDropdownProps {
        label?: string;
        name: string;
        value: string;
        options: (string | { label: string; variants: string[] })[];
        excludeValues?: string[];
        placeholder?: string;
        req?: boolean;
        disabled?: boolean;
        hasError?: boolean;
        onSelect?: (name: string, val: string) => void;
    }

    const CustomDropdown = ({
        label,
        name,
        value,
        options,
        excludeValues = [],
        placeholder = "Faites votre choix...",
        req = false,
        disabled = false,
        hasError = false,
        onSelect
    }: CustomDropdownProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
        const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
        const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number } | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const timeoutRef = useRef<NodeJS.Timeout | null>(null);

        const selectHandler = onSelect || handleSelectMeat;
        const isErr = hasError || !!errors[name];

        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                    setHoveredLabel(null);
                    setExpandedMobile(null);
                }
            };
            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isOpen]);

        const handleItemMouseEnter = (e: React.MouseEvent<HTMLDivElement>, itemLabel: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const rect = e.currentTarget.getBoundingClientRect();
            const opensLeft = typeof window !== 'undefined' && rect.right + 310 > window.innerWidth;
            setSubmenuPos({
                top: rect.top,
                left: opensLeft ? Math.max(10, rect.left - 295) : rect.right + 6
            });
            setHoveredLabel(itemLabel);
        };

        const handleItemMouseLeave = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setHoveredLabel(null);
            }, 180);
        };

        const handleSubmenuEnter = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };

        const handleSelectValue = (val: string) => {
            selectHandler(name, val);
            setIsOpen(false);
            setHoveredLabel(null);
            setExpandedMobile(null);
        };

        const handleToggleParentMobile = (e: React.MouseEvent, itemLabel: string) => {
            e.stopPropagation();
            setExpandedMobile(prev => (prev === itemLabel ? null : itemLabel));
        };

        const hoveredOption = options.find(
            opt => typeof opt !== "string" && opt.label === hoveredLabel
        ) as { label: string; variants: string[] } | undefined;

        // Filter options with excludeValues
        const filteredOptions = options.filter(opt => {
            const itemLabel = typeof opt === "string" ? opt : opt.label;
            return !excludeValues.includes(itemLabel) || itemLabel === value || (typeof opt !== "string" && opt.variants.some(v => `${itemLabel} (${v})` === value));
        });

        return (
            <div className={`group relative ${isOpen ? 'z-50' : 'z-10'}`} ref={containerRef}>
                {label && (
                    <label className={labelStyle}>
                        {label} {req && <span className="text-red-500">*</span>}
                    </label>
                )}

                {/* TRIGGER BUTTON */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full bg-white border rounded-xl px-5 py-4 text-left flex items-center justify-between text-base transition-all duration-300 shadow-inner ${
                        disabled
                            ? "bg-neutral-100 opacity-60 cursor-not-allowed border-neutral-200"
                            : isErr
                            ? "border-red-500 ring-1 ring-red-500 bg-red-50 text-red-900 cursor-pointer"
                            : isOpen
                            ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/40 text-neutral-900 cursor-pointer"
                            : "border-neutral-200 hover:border-[#D4AF37]/60 text-neutral-900 cursor-pointer"
                    }`}
                >
                    <span className={`text-left pr-2 leading-snug break-words ${!value ? "text-neutral-400 font-normal" : "text-neutral-900 font-medium"}`}>
                        {value || placeholder}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-neutral-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                            isOpen ? "rotate-180 text-[#D4AF37]" : ""
                        }`}
                    />
                </button>

                {/* DROPDOWN OVERLAY */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 left-0 top-full mt-1.5 w-full min-w-full md:min-w-[320px] md:w-max max-w-[92vw] md:max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 max-h-80 overflow-y-auto overscroll-contain animate-fade-in">
                        {value && !req && (
                            <button
                                type="button"
                                onClick={() => handleSelectValue("")}
                                className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors flex items-center justify-between border-b border-neutral-100 mb-1 cursor-pointer"
                            >
                                <span>Effacer le choix</span>
                                <span>✕</span>
                            </button>
                        )}

                        {filteredOptions.map((option, idx) => {
                            const isObject = typeof option !== "string";
                            const itemLabel = isObject ? option.label : option;
                            const hasVariants = isObject && option.variants && option.variants.length > 0;

                            if (!hasVariants) {
                                const isSelected = value === itemLabel;
                                const isExcluded = excludeValues.includes(itemLabel) && !isSelected;

                                return (
                                    <button
                                        key={`opt_${idx}_${itemLabel}`}
                                        type="button"
                                        disabled={isExcluded}
                                        onClick={() => handleSelectValue(itemLabel)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                                            isExcluded
                                                ? "opacity-35 cursor-not-allowed bg-neutral-50 text-neutral-400"
                                                : isSelected
                                                ? "bg-[#D4AF37]/15 text-neutral-900 font-bold border-l-4 border-[#D4AF37]"
                                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                                        }`}
                                    >
                                        <span className="pr-2 text-left whitespace-normal break-words leading-snug">{itemLabel}</span>
                                        {isSelected && <Check size={16} className="text-[#D4AF37] flex-shrink-0" />}
                                    </button>
                                );
                            }

                            const isHovered = hoveredLabel === itemLabel;
                            const isExpanded = expandedMobile === itemLabel;
                            const isParentSelected = value.startsWith(`${itemLabel} (`) || value === itemLabel;

                            return (
                                <div
                                    key={`parent_${idx}_${itemLabel}`}
                                    className="relative"
                                    onMouseEnter={(e) => handleItemMouseEnter(e, itemLabel)}
                                    onMouseLeave={handleItemMouseLeave}
                                >
                                    <div
                                        onClick={(e) => handleToggleParentMobile(e, itemLabel)}
                                        className={`w-full px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer select-none ${
                                            isParentSelected
                                                ? "bg-[#D4AF37]/10 text-neutral-900 font-bold border-l-4 border-[#D4AF37]"
                                                : isHovered || isExpanded
                                                ? "bg-neutral-100 text-neutral-900 font-semibold"
                                                : "text-neutral-700 hover:bg-neutral-50"
                                        }`}
                                    >
                                        <span className="pr-2 text-left whitespace-normal break-words leading-snug">{itemLabel}</span>
                                        <div className="flex items-center gap-1.5 flex-shrink-0 text-neutral-400">
                                            <span className="text-[11px] font-normal uppercase tracking-wider text-neutral-400">
                                                {option.variants.length} choix
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                className={`transition-transform duration-200 ${
                                                    isExpanded ? "rotate-90 text-[#D4AF37]" : ""
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* MOBILE ACCORDION */}
                                    {isExpanded && (
                                        <div className="md:hidden bg-neutral-50/80 border-y border-neutral-200 py-1.5 pl-4 pr-2 space-y-1 animate-fade-in">
                                            {option.variants.map((v) => {
                                                const fullVal = `${itemLabel} (${v})`;
                                                const isVariantSelected = value === fullVal;
                                                const isVariantExcluded = excludeValues.includes(fullVal) && !isVariantSelected;

                                                return (
                                                    <button
                                                        key={`mob_var_${v}`}
                                                        type="button"
                                                        disabled={isVariantExcluded}
                                                        onClick={() => handleSelectValue(fullVal)}
                                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                                            isVariantExcluded
                                                                ? "opacity-35 cursor-not-allowed text-neutral-400"
                                                                : isVariantSelected
                                                                ? "bg-[#D4AF37]/20 text-neutral-900 font-bold border-l-3 border-[#D4AF37]"
                                                                : "text-neutral-700 hover:bg-white"
                                                        }`}
                                                    >
                                                        <span className="text-left whitespace-normal break-words leading-snug">{v}</span>
                                                        {isVariantSelected && <Check size={14} className="text-[#D4AF37] flex-shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* DESKTOP CASCADING FLOATING SUBMENU */}
                {isOpen && !disabled && hoveredLabel && hoveredOption && submenuPos && (
                    <div
                        onMouseEnter={handleSubmenuEnter}
                        onMouseLeave={handleItemMouseLeave}
                        style={{
                            position: "fixed",
                            top: `${submenuPos.top}px`,
                            left: `${submenuPos.left}px`,
                            zIndex: 9999
                        }}
                        className="hidden md:block w-64 md:w-72 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 animate-fade-in"
                    >
                        <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
                            Déclinaisons : {hoveredLabel}
                        </div>
                        {hoveredOption.variants.map((v) => {
                            const fullVal = `${hoveredLabel} (${v})`;
                            const isVariantSelected = value === fullVal;
                            const isVariantExcluded = excludeValues.includes(fullVal) && !isVariantSelected;

                            return (
                                <button
                                    key={`submenu_var_${v}`}
                                    type="button"
                                    disabled={isVariantExcluded}
                                    onClick={() => handleSelectValue(fullVal)}
                                    className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                        isVariantExcluded
                                            ? "opacity-35 cursor-not-allowed bg-neutral-50 text-neutral-400"
                                            : isVariantSelected
                                            ? "bg-[#D4AF37]/15 text-neutral-900 font-bold border-l-3 border-[#D4AF37]"
                                            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                                    }`}
                                >
                                    <span className="text-left whitespace-normal break-words leading-snug">{v}</span>
                                    {isVariantSelected && <Check size={14} className="text-[#D4AF37] flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const CascadeMeatDropdown = CustomDropdown;

    const renderDropdown = (label: string, name: string, options: (string | { label: string; variants: string[] })[], excludeValues: string[] = [], req = false) => {
        return (
            <CustomDropdown
                label={label}
                name={name}
                value={(formData as any)[name] || ""}
                options={options}
                excludeValues={excludeValues}
                req={req}
                hasError={!!errors[name]}
                onSelect={handleSelectMeat}
            />
        );
    };

    const renderLogisticsOptions = () => {
        if (isPlatPrepare) return null;
        const isVaisselleChecked = formData.Location_Vaisselle_Check === "Oui";
        const isVerrerieChecked = formData.Location_Verrerie_Check === "Oui";

        return (
            <div className="space-y-4 mt-6 pt-6 border-t border-neutral-200">
                {/* Option Vaisselle */}
                <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isVaisselleChecked
                        ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                        : "bg-white border-neutral-200 hover:border-neutral-300"
                }`}>
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            name="Location_Vaisselle_Check"
                            id="Location_Vaisselle_Check"
                            className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                            checked={isVaisselleChecked}
                            onChange={handleChange}
                        />
                        <label htmlFor="Location_Vaisselle_Check" className="cursor-pointer select-none flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-neutral-800 text-sm md:text-base">
                                    🍽️ Location de vaisselle
                                </span>
                                <span className="bg-[#fcf9f2] text-[#9e7d3b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#cbb079]/30">
                                    +1,50 € / pers.
                                </span>
                            </div>
                            <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                                Assiettes, couverts inox et serviettes (lavage inclus par nos soins).
                            </span>
                        </label>
                    </div>
                </div>

                {/* Option Verrerie */}
                <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isVerrerieChecked
                        ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                        : "bg-white border-neutral-200 hover:border-neutral-300"
                }`}>
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            name="Location_Verrerie_Check"
                            id="Location_Verrerie_Check"
                            className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                            checked={isVerrerieChecked}
                            onChange={handleChange}
                        />
                        <label htmlFor="Location_Verrerie_Check" className="cursor-pointer select-none flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-neutral-800 text-sm md:text-base">
                                    🍷 Location de verrerie
                                </span>
                                <span className="bg-[#fcf9f2] text-[#9e7d3b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#cbb079]/30">
                                    1,50 € / lot de 5 verres
                                </span>
                            </div>
                            <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                                Verres à vin, softs et flûtes à champagne (lavage inclus).
                            </span>
                        </label>
                    </div>

                    <AnimatePresence>
                        {isVerrerieChecked && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25 }}
                                className="mt-4 pt-4 border-t border-neutral-200/80 bg-[#faf8f5]/80 p-4 rounded-xl"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                                    <div>
                                        <CustomDropdown
                                            label="🍷 Verre à vin"
                                            name="Location_Verrerie_Vin"
                                            value={formData.Location_Verrerie_Vin ? `${formData.Location_Verrerie_Vin} verres` : ""}
                                            options={glassSteps.map(step => `${step} verres`)}
                                            placeholder="Choisir..."
                                            onSelect={(name, val) => handleSelectMeat(name, val.replace(" verres", ""))}
                                        />
                                    </div>

                                    <div>
                                        <CustomDropdown
                                            label="🥤 Verre à soft (25cl)"
                                            name="Location_Verrerie_Soft"
                                            value={formData.Location_Verrerie_Soft ? `${formData.Location_Verrerie_Soft} verres` : ""}
                                            options={glassSteps.map(step => `${step} verres`)}
                                            placeholder="Choisir..."
                                            onSelect={(name, val) => handleSelectMeat(name, val.replace(" verres", ""))}
                                        />
                                    </div>

                                    <div>
                                        <CustomDropdown
                                            label="🥂 Flûte à champagne"
                                            name="Location_Verrerie_Flute"
                                            value={formData.Location_Verrerie_Flute ? `${formData.Location_Verrerie_Flute} verres` : ""}
                                            options={glassSteps.map(step => `${step} verres`)}
                                            placeholder="Choisir..."
                                            onSelect={(name, val) => handleSelectMeat(name, val.replace(" verres", ""))}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    const renderHotOptionsSection = () => {
        const isLegumesChecked = formData.Legumes_Chauds_Check === "Oui";
        const isSaucesChecked = formData.Sauces_Chaudes_Check === "Oui";
        const selectedSauces = formData.Sauces_Chaudes_Choix || [];

        return (
            <div className="space-y-4 my-6">
                <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest block">
                    Accompagnements & Sauces Chaudes (En Option)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1 : Légumes Chauds */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isLegumesChecked
                            ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="Legumes_Chauds_Check"
                                id="form_legumes_chauds"
                                className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                                checked={isLegumesChecked}
                                onChange={handleChange}
                            />
                            <label htmlFor="form_legumes_chauds" className="cursor-pointer select-none flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <span className="font-bold text-neutral-800 text-sm md:text-base">
                                        🥦 Légumes chauds cuisinés
                                    </span>
                                    <span className="bg-[#fcf9f2] text-[#9e7d3b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#cbb079]/30">
                                        +1,00 € / pers.
                                    </span>
                                </div>
                                <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                                    Assortiment de légumes chauds de saison cuisinés maison.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Option 2 : Sauces Chaudes */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isSaucesChecked
                            ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="Sauces_Chaudes_Check"
                                id="form_sauces_chaudes"
                                className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                                checked={isSaucesChecked}
                                onChange={handleChange}
                            />
                            <label htmlFor="form_sauces_chaudes" className="cursor-pointer select-none flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <span className="font-bold text-neutral-800 text-sm md:text-base">
                                        🍲 Assortiment de sauces chaudes maison
                                    </span>
                                    <span className="bg-[#fcf9f2] text-[#9e7d3b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#cbb079]/30">
                                        +0,50 € / pers.
                                    </span>
                                </div>
                                <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                                    Sauces chaudes artisanales au choix pour sublimer vos viandes.
                                </span>
                            </label>
                        </div>

                        {/* Sous-section sélection des sauces */}
                        <AnimatePresence>
                            {isSaucesChecked && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 pt-4 border-t border-neutral-200/80 bg-[#faf8f5]/80 p-3 rounded-xl space-y-2.5"
                                >
                                    <span className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                        Sélectionnez vos sauces chaudes :
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                        {SAUCES_CHAUDES_LIST.map((sauce) => {
                                            const isSauceChecked = selectedSauces.includes(sauce);
                                            return (
                                                <label
                                                    key={sauce}
                                                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs transition-all cursor-pointer select-none ${
                                                        isSauceChecked
                                                            ? "bg-white border-[#cbb079] text-neutral-900 font-semibold shadow-xs"
                                                            : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-[#faf8f5]"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSauceChecked}
                                                        onChange={() => handleToggleSauceChaude(sauce)}
                                                        className="w-4 h-4 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer"
                                                    />
                                                    <span className="leading-snug">{sauce}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    };

    const renderDessertSection = () => {
        const isChecked = formData.Dessert_Check === "Oui";
        const dessertType = formData.Dessert_Type || "traditionnel";
        const selectedVarietes = formData.Mignardises_Varietes || [];
        const mignardiseCount = selectedVarietes.length;
        const mignardisePrice = getMignardisesPricePerPerson(mignardiseCount);

        const getMignardisesPriceBadge = () => {
            if (mignardiseCount === 0) return "Dès 2,50 € TTC / pièce";
            const unitPrice = mignardiseCount <= 2 ? "2,75 €" : "2,50 €";
            return `${unitPrice} TTC / pièce (+${mignardisePrice.toFixed(2).replace('.', ',')} € / pers.)`;
        };

        return (
            <div className={`p-5 rounded-2xl border transition-all duration-300 mt-6 ${
                isChecked
                    ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                    : "bg-white border-neutral-200 hover:border-neutral-300"
            }`}>
                {/* Titre principal avec Case à cocher Niveau 1 */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="form_dessert_check"
                        name="Dessert_Check"
                        className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                        checked={isChecked}
                        onChange={(e) => {
                            const val = e.target.checked ? "Oui" : "Non";
                            setFormData(prev => ({
                                ...prev,
                                Dessert_Check: val,
                                Dessert_Choix: val === "Oui" ? prev.Dessert_Choix : ""
                            }));
                        }}
                    />
                    <label htmlFor="form_dessert_check" className="cursor-pointer select-none flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-neutral-800 text-sm md:text-base">
                                🍰 Ajouter une option dessert
                            </span>
                            <span className="bg-[#fcf9f2] text-[#9e7d3b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#cbb079]/30">
                                Dès 2,50 € / pers.
                            </span>
                        </div>
                        <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                            Sublimez votre événement avec nos douceurs artisanales au choix.
                        </span>
                    </label>
                </div>

                {/* Niveau 2 : Si la case est cochée */}
                <AnimatePresence>
                    {isChecked && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="mt-6 pt-6 border-t border-neutral-200/80 bg-[#faf8f5]/80 p-5 rounded-xl space-y-6"
                        >
                            {/* Sélecteur de type de dessert (Radio/Toggles élégants) */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                                    Type de prestation sucrée
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Option 1 : Desserts traditionnels */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, Dessert_Type: "traditionnel" }))}
                                        className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                                            dessertType === "traditionnel"
                                                ? "border-[#cbb079] bg-white shadow-xs ring-1 ring-[#cbb079]/30"
                                                : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-neutral-800">Desserts traditionnels</span>
                                                <span className="bg-[#fcf9f2] text-[#9e7d3b] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#cbb079]/30">
                                                    +6,00 € / pers
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                Gâteaux & tartes artisanales à partager (1 choix pour l&apos;ensemble)
                                            </p>
                                        </div>
                                    </button>

                                    {/* Option 2 : Mignardises artisanales */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, Dessert_Type: "mignardises" }))}
                                        className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                                            dessertType === "mignardises"
                                                ? "border-[#cbb079] bg-white shadow-xs ring-1 ring-[#cbb079]/30"
                                                : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-neutral-800">Mignardises artisanales</span>
                                                <span className="bg-[#fcf9f2] text-[#9e7d3b] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#cbb079]/30">
                                                    Dès 2,50 € TTC / pièce
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                Sélection directe des variétés (1 à 6 pièces par personne)
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Sous-section : Desserts traditionnels */}
                            {dessertType === "traditionnel" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3 shadow-xs mt-4"
                                >
                                    <CustomDropdown
                                        label="Sélectionnez votre dessert traditionnel"
                                        name="Dessert_Choix"
                                        value={formData.Dessert_Choix}
                                        options={dessertsList}
                                        placeholder="Faites votre choix de dessert..."
                                        req={true}
                                        hasError={!!errors.Dessert_Choix}
                                        onSelect={handleSelectMeat}
                                    />
                                    {errors.Dessert_Choix && (
                                        <p className="text-xs text-red-500 font-medium">{errors.Dessert_Choix}</p>
                                    )}
                                </motion.div>
                            )}

                            {/* Sous-section : Mignardises (Simplifiée - Sélection directe via cases à cocher) */}
                            {dessertType === "mignardises" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-5 rounded-xl border border-neutral-200 space-y-5 shadow-xs"
                                >
                                    {/* En-tête avec compteur & Prix dynamique à droite */}
                                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-100">
                                        <div>
                                            <label className={`${labelStyle} mb-0.5`}>
                                                Sélectionnez vos variétés de mignardises <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-neutral-500 italic">
                                                Cochez les variétés souhaitées (1 case = 1 pièce / pers, max 6).
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block text-xs font-bold text-[#9e7d3b] bg-[#fcf9f2] px-3 py-1 rounded-full border border-[#cbb079]/30">
                                                {getMignardisesPriceBadge()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Grille des variétés (Cases à cocher directes) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-neutral-500">
                                                {mignardiseCount === 0
                                                    ? "Aucune variété sélectionnée"
                                                    : `${mignardiseCount} pièce${mignardiseCount > 1 ? "s" : ""} / personne sélectionnée${mignardiseCount > 1 ? "s" : ""}`}
                                            </span>
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                                mignardiseCount >= 3
                                                    ? "bg-green-100 text-green-800 font-bold"
                                                    : mignardiseCount > 0
                                                        ? "bg-neutral-100 text-neutral-800 font-medium border border-neutral-200"
                                                        : "bg-neutral-100 text-neutral-600"
                                            }`}>
                                                {mignardiseCount} / 6 variété{mignardiseCount > 1 ? "s" : ""}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {MIGNARDISES_LIST.map((item) => {
                                                const isItemChecked = selectedVarietes.includes(item);
                                                const isMaxReached = selectedVarietes.length >= 6 && !isItemChecked;

                                                return (
                                                    <label
                                                        key={item}
                                                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all cursor-pointer select-none ${
                                                            isItemChecked
                                                                ? "bg-white border-[#cbb079] ring-1 ring-[#cbb079]/20 text-neutral-900 font-semibold shadow-xs"
                                                                : isMaxReached
                                                                    ? "bg-neutral-50 border-neutral-200 text-neutral-400 opacity-50 cursor-not-allowed"
                                                                    : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-[#faf8f5]"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isItemChecked}
                                                            disabled={isMaxReached}
                                                            onChange={() => handleToggleMignardiseVariete(item)}
                                                            className="w-4 h-4 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer disabled:cursor-not-allowed"
                                                        />
                                                        <span className="flex-1 text-xs leading-relaxed">{item}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.Mignardises_Varietes && (
                                            <p className="text-xs text-red-500 font-medium mt-2">{errors.Mignardises_Varietes}</p>
                                        )}
                                    </div>

                                    {/* Indications informatives conservées */}
                                    <div className="space-y-2 pt-2">
                                        <p className="text-xs text-neutral-500 italic flex items-center gap-1.5">
                                            <span>💡</span> Nous recommandons un minimum de 3 pièces par personne.
                                        </p>

                                        <div className="bg-white p-3 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between flex-wrap gap-2">
                                            <span>🏷️ <strong>Tarif dégressif :</strong></span>
                                            <span>1 ou 2 pièces : <strong>2,75 € / pc</strong></span>
                                            <span className="text-neutral-300">|</span>
                                            <span>3 à 6 pièces : <strong className="text-[#9e7d3b]">2,50 € / pc</strong></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const renderBBQComposition = () => {
        // Prepare exclusion lists with NEW keys
        const bbqChoices = [formData.Viande_1, formData.Viande_2, formData.Viande_3].filter(Boolean);
        const composeEntreeChoices = [formData.compose_entree_1, formData.compose_entree_2].filter(Boolean);
        const dinatoireServiceChoices = [formData.dinatoire_service_1, formData.dinatoire_service_2].filter(Boolean);
        const froidChoices = [formData.Accompagnement_Froid_1, formData.Accompagnement_Froid_2, formData.Accompagnement_Froid_3].filter(Boolean);

        const bbqName = menuParam ? menuParam.replace('bbq_', '').charAt(0).toUpperCase() + menuParam.replace('bbq_', '').slice(1) : "Sur Mesure";

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#D4AF37] rounded-b-full"></div>

                {/* HEADER Configuration */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif text-neutral-800 font-bold mb-2">Configuration : BBQ {bbqName}</h2>
                    <div className="text-center mb-6">
                        <p className="text-sm text-neutral-500 italic mb-2">
                            Note : 300g de viande par personne pour les 3 choix.
                        </p>
                        <FormAllergenLink section="bbq" />
                    </div>
                </div>

                {/* PRESTATION SERVICE OPTION */}
                {renderServiceToggle("+2,50 € / pers.", "Maîtres du feu, découpe & service à table sur place.")}

                {/* MAIN CHOICES */}
                <div className="space-y-6">
                    <h3 className="text-lg font-serif text-neutral-800 font-bold border-b border-neutral-200 pb-2">Votre Sélection Principale (Inclus)</h3>

                    {isCochonOrPorchetta && (
                        <div className="text-center py-4 bg-white rounded-xl border border-neutral-200">
                            <p className="text-xl font-serif text-neutral-800">
                                {isBBQCochon ? "Cochon de Lait à la Broche" : "Porchetta Rôtie aux Herbes"}
                            </p>
                            <p className="text-sm text-neutral-500 mt-1">300g / personne</p>
                        </div>
                    )}

                    {isBBQCompose && (
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest block">
                                1er Service : Entrées au choix (2 Incluses)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderDropdown("1ère Entrée", "compose_entree_1", entreesCompose, composeEntreeChoices, true)}
                                {renderDropdown("2ème Entrée", "compose_entree_2", entreesCompose, composeEntreeChoices, true)}
                            </div>
                        </div>
                    )}

                    {isBBQDinatoire && (
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest block">
                                1er Service : Plats chauds (2 Inclus)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderDropdown("Plat 1", "dinatoire_service_1", dinatoireServices, dinatoireServiceChoices, true)}
                                {renderDropdown("Plat 2", "dinatoire_service_2", dinatoireServices, dinatoireServiceChoices, true)}
                            </div>
                        </div>
                    )}

                    {/* VIANDES */}
                    {!isCochonOrPorchetta && (
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest block">
                                {isBBQCompose || isBBQDinatoire
                                    ? "2ème Service : Viandes au choix (2 Incluses)"
                                    : isBBQNobles
                                        ? "Viandes au choix (2 Incluses)"
                                        : "Viandes au choix (3 Incluses)"}
                            </label>
                            <div className={`grid grid-cols-1 ${isBBQCompose || isBBQDinatoire || isBBQNobles ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
                                {renderDropdown("Viande 1", "Viande_1", getBBQCascadeList(), bbqChoices, true)}
                                {renderDropdown("Viande 2", "Viande_2", getBBQCascadeList(), bbqChoices, true)}
                                {!isBBQCompose && !isBBQDinatoire && !isBBQNobles && (
                                    renderDropdown("Viande 3", "Viande_3", getBBQCascadeList(), bbqChoices, true)
                                )}
                            </div>
                        </div>
                    )}

                    {/* SUPPLÉMENTS VIANDES (Optionnels) */}
                    {!isCochonOrPorchetta && (
                        <div className="mt-6 border-t border-dashed border-neutral-200 pt-6">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                                Viandes Supplémentaires (Optionnel)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CascadeMeatDropdown
                                    label="🥩 1ère Viande Extra (+3,00€ / pers)"
                                    name="Viande_Extra_1"
                                    value={formData.Viande_Extra_1 || ""}
                                    options={getBBQCascadeList()}
                                    placeholder="Aucun supplément..."
                                    onSelect={handleSelectMeat}
                                />
                                <CascadeMeatDropdown
                                    label="🥩 2ème Viande Extra (+3,00€ / pers)"
                                    name="Viande_Extra_2"
                                    value={formData.Viande_Extra_2 || ""}
                                    options={getBBQCascadeList()}
                                    placeholder="Aucun supplément..."
                                    onSelect={handleSelectMeat}
                                />
                            </div>
                        </div>
                    )}

                    {/* FÉCULENTS */}
                    <div className="mt-6 border-t border-dashed border-neutral-200 pt-6">
                        <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest block mb-4">Féculents</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {renderDropdown("1 Féculent Inclus", "Feculent", feculentsBBQ, [], true)}
                            </div>
                            <div>
                                <CustomDropdown
                                    label="🥔 Féculent supplémentaire (+2,00€ / pers)"
                                    name="Feculent_Extra"
                                    value={formData.Feculent_Extra || ""}
                                    options={feculentsBBQ}
                                    placeholder="Aucun supplément..."
                                    onSelect={handleSelectMeat}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CRUDITÉS */}
                    <div className="mt-6 border-t border-dashed border-neutral-200 pt-6"></div>
                    <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Crudités (6 Incluses)</label>

                    {/* OPTION LAISSER LE CHEF COMPOSER */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 mb-5 ${
                        formData.Crudites_Choix_Chef === "Oui"
                            ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="Crudites_Choix_Chef"
                                id="BBQ_Crudites_Choix_Chef"
                                className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                                checked={formData.Crudites_Choix_Chef === "Oui"}
                                onChange={handleChange}
                            />
                            <label htmlFor="BBQ_Crudites_Choix_Chef" className="cursor-pointer select-none">
                                <span className="block font-bold text-neutral-800 text-sm md:text-base">
                                    👨‍🍳 Laisser le chef composer l&apos;assortiment selon la saison
                                </span>
                                <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                                    Cochez cette option pour un assortiment équilibré, ou sélectionnez vos indispensables et le chef complètera le reste.
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <div key={`bbq_crudite_${num}`}>
                                {renderDropdown(`Crudité ${num}`, `Crudite_${num}`, SIDES_COLD, [formData.Crudite_1, formData.Crudite_2, formData.Crudite_3, formData.Crudite_4, formData.Crudite_5, formData.Crudite_6].filter(Boolean))}
                            </div>
                        ))}
                    </div>

                    {/* Supplément Crudité (Rattaché à la catégorie Crudités) */}
                    <div className="mt-4 p-4 bg-white rounded-xl border border-dashed border-neutral-300">
                        <CustomDropdown
                            label="🥗 Crudité supplémentaire (+1,50€ / pers)"
                            name="Suppl_Crudite_Extra"
                            value={formData.Suppl_Crudite_Extra || ""}
                            options={SIDES_COLD}
                            placeholder="Aucun supplément..."
                            onSelect={handleSelectMeat}
                        />
                    </div>
                </div>

                {/* ACCOMPAGNEMENTS & SAUCES CHAUDES */}
                {renderHotOptionsSection()}

                {/* DESSERTS SECTION */}
                {renderDessertSection()}

                {renderLogisticsOptions()}

                {/* PRICE DISPLAY */}
                {renderPriceDisplay()}
            </motion.div>
        );
    };     // Legacy renderers for Associations / Buffet can be simplified or kept similar...
    // ideally I would refactor them to use renderDropdown too but keeping logic distinct is fine.
    // For brevity in this rewrite, I'll use a simplified version for them.

    // Simplified renderers for Associations / Buffet can be kept minimal

    const renderPlatUniqueFields = () => (
        <div className="space-y-6 animate-fade-in bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-[#D4AF37]">
            <h3 className="text-lg font-serif text-neutral-800 font-bold border-b border-neutral-200 pb-2 mb-4">Votre Choix de Plat Unique</h3>

            {renderServiceToggle("Sur devis", "Prise en charge et service de vos plats chauds.")}

            <div>
                <CustomDropdown
                    label="Choisissez votre Plat Principal"
                    name="Plat_Associatif"
                    value={formData.Plat_Associatif}
                    options={[
                        "Bar à Pâtes",
                        "Burgers",
                        "Boulets Liégeois",
                        "Vol-au-vent",
                        "Option Végétarienne"
                    ]}
                    req={true}
                    placeholder="Faites votre choix..."
                    onSelect={handleSelectMeat}
                />
            </div>

            {/* CASCADE : Apparaît selon le choix principal */}
            <AnimatePresence>
                {formData.Plat_Associatif === "Bar à Pâtes" && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="pt-2">
                        <CustomDropdown
                            label="Choix de la sauce"
                            name="Plat_Associatif_Detail"
                            value={formData.Plat_Associatif_Detail}
                            options={["Bolognaise", "Carbonara"]}
                            req={true}
                            placeholder="Sélectionnez la sauce..."
                            onSelect={handleSelectMeat}
                        />
                    </motion.div>
                )}

                {formData.Plat_Associatif === "Burgers" && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="pt-2">
                        <CustomDropdown
                            label="Type de Burger"
                            name="Plat_Associatif_Detail"
                            value={formData.Plat_Associatif_Detail}
                            options={["Normal", "Spécial Compère"]}
                            req={true}
                            placeholder="Sélectionnez le type..."
                            onSelect={handleSelectMeat}
                        />
                    </motion.div>
                )}

                {formData.Plat_Associatif === "Boulets Liégeois" && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="pt-2">
                        <CustomDropdown
                            label="Choix de la sauce"
                            name="Plat_Associatif_Detail"
                            value={formData.Plat_Associatif_Detail}
                            options={["Sauce Lapin", "Sauce Tomate"]}
                            req={true}
                            placeholder="Sélectionnez la sauce..."
                            onSelect={handleSelectMeat}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {renderDessertSection()}

            {renderLogisticsOptions()}

            {/* PRICE INDICATION */}
            {renderPriceDisplay()}
        </div>
    );

    const renderBuffetFroidFields = () => {
        if (!isBuffetFroid) return null;

        // Récupérer la liste des viandes pour le buffet sélectionné
        const viandesIncluses = buffetCompositions[formData.Type_Evenement] || [];

        return (
            <div className="space-y-8 animate-fade-in mt-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-6 border-b pb-2 uppercase tracking-wide">
                    Composition de votre Buffet
                </h3>
                {FormAllergenLink({ section: 'buffets' })}

                {renderServiceToggle("Sur devis", "Mise en place, réassort et service de votre buffet sur place.")}

                {/* NOUVEAU : Encart des plats inclus */}
                {viandesIncluses.length > 0 && (
                    <div className="bg-[#f9f9f9] p-6 rounded-2xl border border-neutral-200">
                        <label className={`${labelStyle} flex items-center gap-2 mb-4`}>
                            <span>🍖</span> Plats et Viandes Inclus
                        </label>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                            {viandesIncluses.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                                    <span className="text-[#D4AF37] font-bold">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Féculent */}
                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200">
                    <CustomDropdown
                        label="🍚 Votre Féculent (Inclus)"
                        name="Feculent_Froid"
                        value={formData.Feculent_Froid || ""}
                        options={feculentsFroids}
                        placeholder="Choisissez 1 féculent..."
                        onSelect={handleSelectMeat}
                    />
                </div>

                {/* Crudités Incluses (Grille de 6) */}
                <div>
                    <label className={`${labelStyle} flex items-center gap-2 mb-4`}>
                        <span>🥗</span> Vos 6 Crudités Incluses
                    </label>

                    {/* OPTION LAISSER LE CHEF COMPOSER */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 mb-5 ${
                        formData.Crudites_Choix_Chef === "Oui"
                            ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="Crudites_Choix_Chef"
                                id="Buffet_Crudites_Choix_Chef"
                                className="w-5 h-5 text-[#c2a661] accent-[#c2a661] border-gray-300 rounded focus:ring-[#c2a661] cursor-pointer mt-0.5"
                                checked={formData.Crudites_Choix_Chef === "Oui"}
                                onChange={handleChange}
                            />
                            <label htmlFor="Buffet_Crudites_Choix_Chef" className="cursor-pointer select-none">
                                <span className="block font-bold text-neutral-800 text-sm md:text-base">
                                    👨‍🍳 Laisser le chef composer l&apos;assortiment selon la saison
                                </span>
                                <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                                    Cochez cette option pour un assortiment équilibré, ou sélectionnez vos indispensables et le chef complètera le reste.
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <div key={`Crudite_${num}`}>
                                <CustomDropdown
                                    name={`Crudite_${num}`}
                                    value={(formData as any)[`Crudite_${num}`] || ""}
                                    options={cruditesFroids}
                                    placeholder={`Choix ${num} (ou choix du chef)...`}
                                    onSelect={handleSelectMeat}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACCOMPAGNEMENTS & SAUCES CHAUDES */}
                {renderHotOptionsSection()}

                {/* OPTION DESSERTS & MIGNARDISES */}
                {renderDessertSection()}

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay()}
            </div>
        );
    };

    const renderPainsFields = () => {
        if (!isPains) return null;

        const selectedCategory = formData.Categorie_Pains;
        const categoryInfo = selectedCategory ? painsData[selectedCategory] : null;

        // Calcul du prix unitaire ajusté en fonction des convives
        const getAdjustedUnitPrice = (basePrice: number) => {
            if (formData.Nombre_Convives === 'Moins de 25') return basePrice + 0.30;
            if (formData.Nombre_Convives === '100 à 200') return basePrice - 0.20;
            return basePrice;
        };

        return (
            <div className="space-y-8 animate-fade-in mt-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-6 border-b pb-2 uppercase tracking-wide">
                    Composition de votre Assortiment
                </h3>
                {FormAllergenLink({ section: 'pains' })}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                        <CustomDropdown
                            label="🥖 Gamme de pains"
                            name="Categorie_Pains"
                            value={formData.Categorie_Pains ? (
                                (() => {
                                    const cat = formData.Categorie_Pains;
                                    if (painsData[cat]) {
                                        const adjustedPrice = getAdjustedUnitPrice(painsData[cat].price);
                                        return `${cat} (${adjustedPrice.toFixed(2).replace('.', ',')}€ / pièce)`;
                                    }
                                    return cat;
                                })()
                            ) : ""}
                            options={Object.keys(painsData).map(cat => {
                                const adjustedPrice = getAdjustedUnitPrice(painsData[cat].price);
                                return `${cat} (${adjustedPrice.toFixed(2).replace('.', ',')}€ / pièce)`;
                            })}
                            placeholder="Sélectionnez une gamme..."
                            onSelect={(name, val) => {
                                const rawCat = Object.keys(painsData).find(cat => val.startsWith(cat)) || val;
                                handleSelectMeat(name, rawCat);
                            }}
                        />

                        {categoryInfo && (
                            <div className="mt-4 pt-4 border-t border-neutral-200 animate-fade-in">
                                <p className="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider">Ce que comprend cette gamme :</p>
                                <ul className="space-y-1">
                                    {categoryInfo.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                                            <span className="text-[#D4AF37] font-bold">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                        <CustomDropdown
                            label="🔢 Quantité par personne"
                            name="Quantite_Pains"
                            value={formData.Quantite_Pains ? `${formData.Quantite_Pains} pièces / pers` : ""}
                            options={[3, 4, 5, 6, 7, 8, 9, 10].map(num => `${num} pièces / pers`)}
                            placeholder="Nombre de pièces/pers..."
                            onSelect={(name, val) => {
                                const numVal = val.split(' ')[0];
                                handleSelectMeat(name, numVal);
                            }}
                        />
                        {/* Message intolérances */}
                        <p className="text-xs text-neutral-500 mt-2 italic px-1">
                            En cas d'intolérances, merci de le préciser dans le champ message en bas du formulaire.
                        </p>
                    </div>
                </div>

                {renderDessertSection()}

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay()}
            </div>
        );
    };

    const renderZakouskisFields = () => {
        if (!isZakouskis) return null;

        const getAdjustedPrice = (basePrice: number) => {
            if (formData.Nombre_Convives === 'Moins de 25') return basePrice + 0.30;
            if (formData.Nombre_Convives === '100 à 200') return basePrice - 0.20;
            return basePrice;
        };

        const renderZakouskiSlot = (num: number, isRequired: boolean) => {
            const catKey = `Zakouski_Cat_${num}`;
            const itemKey = `Zakouski_Item_${num}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formAny = formData as any;
            const selectedCat = formAny[catKey];

            const rawItems = selectedCat && zakouskisData[selectedCat]
                ? Object.entries(zakouskisData[selectedCat]).flatMap(([gammeName, gammeData]) => {
                    const adjustedPrice = getAdjustedPrice(gammeData.price);
                    return gammeData.items.map(item => `${item} (${adjustedPrice.toFixed(2).replace('.', ',')}€)`);
                })
                : [];

            return (
                <div key={`zakouski_slot_${num}`} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3 border-b pb-2">
                        Choix {num} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-3">
                        <CustomDropdown
                            name={catKey}
                            value={selectedCat || ""}
                            options={Object.keys(zakouskisData)}
                            placeholder="Famille de produit..."
                            onSelect={(k, val) => {
                                handleSelectMeat(k, val);
                                if (formAny[itemKey]) handleSelectMeat(itemKey, "");
                            }}
                        />
                        <CustomDropdown
                            name={itemKey}
                            value={formAny[itemKey] ? (rawItems.find(i => i.startsWith(formAny[itemKey])) || formAny[itemKey]) : ""}
                            options={rawItems}
                            placeholder="Sélectionnez la pièce..."
                            disabled={!selectedCat}
                            onSelect={(k, val) => {
                                const rawItem = val.replace(/\s\(\d+.*€\)$/, '');
                                handleSelectMeat(k, rawItem);
                            }}
                        />
                    </div>
                </div>
            );
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formAny = formData as any;
        const showBlock2 = !!formAny.Zakouski_Item_3;
        const showSlot7 = !!formAny.Zakouski_Item_6;
        const showSlot8 = !!formAny.Zakouski_Item_7;
        const showSlot9 = !!formAny.Zakouski_Item_8;
        const showSlot10 = !!formAny.Zakouski_Item_9;

        return (
            <div className="space-y-8 animate-fade-in mt-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-2 border-b pb-2 uppercase tracking-wide">
                    Votre Sélection de Zakouskis
                </h3>
                <p className="text-sm text-neutral-500 mb-6 italic">Minimum 3 pièces par personne. Maximum 10 pièces.</p>
                {FormAllergenLink({ section: 'zakouskis' })}

                {/* Bloc 1 : Choix 1 à 3 (Obligatoires) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => renderZakouskiSlot(i, true))}
                </div>

                {/* Bloc 2 : Choix 4 à 6 */}
                <AnimatePresence>
                    {showBlock2 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dashed border-neutral-200">
                            {[4, 5, 6].map(i => renderZakouskiSlot(i, false))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bloc 3 : Choix 7 à 10 (Individuels) */}
                <AnimatePresence>
                    {(showSlot7 || showSlot8 || showSlot9 || showSlot10) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dashed border-neutral-200">
                            {showSlot7 && renderZakouskiSlot(7, false)}
                            {showSlot8 && renderZakouskiSlot(8, false)}
                            {showSlot9 && renderZakouskiSlot(9, false)}
                            {showSlot10 && renderZakouskiSlot(10, false)}
                        </motion.div>
                    )}
                </AnimatePresence>

                {renderDessertSection()}

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay()}
            </div>
        );
    };

    const renderVerrinesFields = () => {
        if (!isVerrines) return null;

        const selectedFormat = formData.Format_Verrines; // "6cl" ou "12cl"

        const getAdjustedPriceDisplay = (category: string) => {
            if (!selectedFormat) return 0;
            const catData = verrinesData[category];
            const basePrice = selectedFormat === "6cl" ? catData.price6cl : catData.price12cl;

            if (formData.Nombre_Convives === 'Moins de 25') return basePrice + 0.30;
            if (formData.Nombre_Convives === '100 à 200') return basePrice - 0.20;
            return basePrice;
        };

        const renderVerrineSlot = (num: number, isRequired: boolean) => {
            const catKey = `Verrine_Cat_${num}`;
            const itemKey = `Verrine_Item_${num}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formAny = formData as any;
            const selectedCat = formAny[catKey];

            const isSlotsDisabled = !selectedFormat;
            const rawVerrineItems = selectedCat && verrinesData[selectedCat]
                ? verrinesData[selectedCat].items.map(item => `${item} (${getAdjustedPriceDisplay(selectedCat).toFixed(2).replace('.', ',')}€ / pièce)`)
                : [];

            return (
                <div key={`verrine_slot_${num}`} className={`bg-white p-4 rounded-xl border border-neutral-200 shadow-sm transition-opacity duration-300 ${isSlotsDisabled ? 'opacity-50' : ''}`}>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3 border-b pb-2">
                        Choix {num} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-3">
                        <CustomDropdown
                            name={catKey}
                            value={selectedCat || ""}
                            options={Object.keys(verrinesData)}
                            placeholder="Famille de verrine..."
                            disabled={isSlotsDisabled}
                            onSelect={(k, val) => {
                                handleSelectMeat(k, val);
                                if (formAny[itemKey]) handleSelectMeat(itemKey, "");
                            }}
                        />
                        <CustomDropdown
                            name={itemKey}
                            value={formAny[itemKey] ? (rawVerrineItems.find(i => i.startsWith(formAny[itemKey])) || formAny[itemKey]) : ""}
                            options={rawVerrineItems}
                            placeholder="Sélectionnez la pièce..."
                            disabled={isSlotsDisabled || !selectedCat}
                            onSelect={(k, val) => {
                                const rawItem = val.replace(/\s\(\d+.*€ \/ pièce\)$/, '');
                                handleSelectMeat(k, rawItem);
                            }}
                        />
                    </div>
                </div>
            );
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formAny = formData as any;
        const showBlock2 = !!formAny.Verrine_Item_3;
        const showSlot7 = !!formAny.Verrine_Item_6;
        const showSlot8 = !!formAny.Verrine_Item_7;
        const showSlot9 = !!formAny.Verrine_Item_8;
        const showSlot10 = !!formAny.Verrine_Item_9;

        return (
            <div className="space-y-8 animate-fade-in mt-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-2 border-b pb-2 uppercase tracking-wide">
                    Votre Sélection de Verrines
                </h3>
                <p className="text-sm text-neutral-500 mb-6 italic">Minimum 3 pièces par personne. Maximum 10 pièces.</p>
                {FormAllergenLink({ section: 'verrines' })}

                {/* ÉTAPE 1 : CHOIX DU FORMAT */}
                <div className="bg-neutral-100 p-6 rounded-2xl border border-neutral-200">
                    <label className={`${labelStyle} flex items-center gap-2`}>
                        <span>🍸</span> 1. Choisissez d&apos;abord le Format <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, Format_Verrines: "6cl" }))} className={`px-5 py-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all ${selectedFormat === "6cl" ? "bg-black text-white border-black" : "bg-white text-neutral-800 border-neutral-200 hover:border-black"}`}>
                            <span>Format Apéritif</span>
                            <span className="font-serif text-xl">6 cl</span>
                        </button>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, Format_Verrines: "12cl" }))} className={`px-5 py-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all ${selectedFormat === "12cl" ? "bg-black text-white border-black" : "bg-white text-neutral-800 border-neutral-200 hover:border-black"}`}>
                            <span>Format Dînatoire</span>
                            <span className="font-serif text-xl">12 cl</span>
                        </button>
                    </div>
                    {!selectedFormat && <p className="text-red-500 text-xs mt-3 font-medium ml-1">Veuillez sélectionner un format pour activer les choix de verrines.</p>}
                </div>

                {/* ÉTAPE 2 : SÉLECTION DES PIÈCES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => renderVerrineSlot(i, true))}
                </div>

                <AnimatePresence>
                    {showBlock2 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dashed border-neutral-200">
                            {[4, 5, 6].map(i => renderVerrineSlot(i, false))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {(showSlot7 || showSlot8 || showSlot9 || showSlot10) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dashed border-neutral-200">
                            {showSlot7 && renderVerrineSlot(7, false)}
                            {showSlot8 && renderVerrineSlot(8, false)}
                            {showSlot9 && renderVerrineSlot(9, false)}
                            {showSlot10 && renderVerrineSlot(10, false)}
                        </motion.div>
                    )}
                </AnimatePresence>

                {renderDessertSection()}

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay()}
            </div>
        );
    };

    const renderCollectiviteFields = () => {
        if (!isCollectivite) return null;

        const currentVolet = formData.Collectivite_Volet || "plats_chauds";

        // Tri alphabétique des plats chauds pour un affichage propre
        const sortedDishes = Object.keys(collectiviteData).sort((a, b) => a.localeCompare(b));
        const sortedSalads = Object.keys(saladesBowlsData);

        const getAdjustedPriceDisplay = (basePrice: number) => {
            if (formData.Nombre_Convives === 'Moins de 30') return basePrice * 1.10;
            return basePrice;
        };

        return (
            <div className="space-y-6 animate-fade-in bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-black mt-8">
                <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h3 className="text-xl font-bold text-neutral-800 uppercase tracking-wide">
                        Repas de Collectivité & Plats Uniques
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                        Choisissez votre formule : plats chauds mijotés ou salad bar & bowls fraîcheur (1 plat unique pour votre groupe).
                    </p>
                </div>

                {renderServiceToggle("Sur devis", "Mise en place, maintien en température et service pour votre groupe.")}

                {/* Sélecteur de Volet (Toggle buttons) */}
                <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                        Type de formule pour votre groupe
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, Collectivite_Volet: "plats_chauds" }));
                                if (errors.Salad_Bar_Choix) {
                                    setErrors(prev => {
                                        const next = { ...prev };
                                        delete next.Salad_Bar_Choix;
                                        return next;
                                    });
                                }
                            }}
                            className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                                currentVolet === "plats_chauds"
                                    ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs ring-1 ring-[#cbb079]/30"
                                    : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🍲</span>
                                <div>
                                    <span className="block font-bold text-neutral-800 text-sm md:text-base">
                                        Plats Uniques Chauds
                                    </span>
                                    <span className="block text-xs text-neutral-500 mt-0.5">
                                        21 plats mijotés au choix (dès 8,00€ / pers)
                                    </span>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, Collectivite_Volet: "salad_bar" }));
                                if (errors.Plat_Collectivite) {
                                    setErrors(prev => {
                                        const next = { ...prev };
                                        delete next.Plat_Collectivite;
                                        return next;
                                    });
                                }
                            }}
                            className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                                currentVolet === "salad_bar"
                                    ? "border-[#cbb079] bg-[#fdfbf7] shadow-xs ring-1 ring-[#cbb079]/30"
                                    : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🥗</span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-neutral-800 text-sm md:text-base">
                                            Salad Bar & Bowls
                                        </span>
                                        <span className="bg-[#fcf9f2] text-[#9e7d3b] text-[10px] font-bold px-2 py-0.2 rounded-full border border-[#cbb079]/30">
                                            NOUVEAU
                                        </span>
                                    </div>
                                    <span className="block text-xs text-neutral-500 mt-0.5">
                                        8 recettes fraîches au choix (dès 10,50€ / pers)
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* VOLET 1 : PLATS CHAUDS */}
                {currentVolet === "plats_chauds" && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-2"
                    >
                        {FormAllergenLink({ section: 'collectivite' })}

                        <div className="group">
                            <CustomDropdown
                                label="Sélectionnez le plat chaud pour votre groupe"
                                name="Plat_Collectivite"
                                value={formData.Plat_Collectivite ? (
                                    (() => {
                                        const showPrice = formData.Nombre_Convives !== 'Plus de 100';
                                        const price = getAdjustedPriceDisplay(collectiviteData[formData.Plat_Collectivite] || 0);
                                        return `${formData.Plat_Collectivite}${showPrice ? ` (${price.toFixed(2).replace('.', ',')}€ / pers)` : ''}`;
                                    })()
                                ) : ""}
                                options={sortedDishes.map(dish => {
                                    const showPrice = formData.Nombre_Convives !== 'Plus de 100';
                                    const price = getAdjustedPriceDisplay(collectiviteData[dish] || 0);
                                    return `${dish}${showPrice ? ` (${price.toFixed(2).replace('.', ',')}€ / pers)` : ''}`;
                                })}
                                placeholder="Faites votre choix parmi nos 21 plats mijotés..."
                                req={true}
                                hasError={!!errors.Plat_Collectivite}
                                onSelect={(name, val) => {
                                    const dish = sortedDishes.find(d => val.startsWith(d)) || val;
                                    handleSelectMeat(name, dish);
                                }}
                            />
                            {errors.Plat_Collectivite && (
                                <p className="text-xs text-red-500 font-medium mt-1">{errors.Plat_Collectivite}</p>
                            )}
                            <p className="text-xs text-neutral-500 mt-2 italic px-1">Un seul et même plat pour l&apos;ensemble des convives.</p>
                        </div>
                    </motion.div>
                )}

                {/* VOLET 2 : SALAD BAR & BOWLS */}
                {currentVolet === "salad_bar" && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-2"
                    >
                        {FormAllergenLink({ section: 'collectivite' })}

                        <div>
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                    CHOISISSEZ VOTRE SALADE / BOWL (1 CHOIX POUR LE GROUPE) <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-neutral-500 italic">
                                    Un seul et même choix pour l&apos;ensemble des convives.
                                </p>
                            </div>

                            {/* Grille responsive des 8 Cartes Radio descriptives */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {SALADS_BOWLS_DATA.map((bowl) => {
                                    const isSelected = formData.Salad_Bar_Choix === bowl.name;
                                    const showPrice = formData.Nombre_Convives !== 'Plus de 100';
                                    const price = getAdjustedPriceDisplay(bowl.price);

                                    return (
                                        <div
                                            key={bowl.name}
                                            onClick={() => {
                                                handleFormStart();
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Salad_Bar_Choix: bowl.name
                                                }));
                                                if (errors.Salad_Bar_Choix) {
                                                    setErrors(prev => {
                                                        const next = { ...prev };
                                                        delete next.Salad_Bar_Choix;
                                                        return next;
                                                    });
                                                }
                                            }}
                                            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none group flex flex-col justify-between ${
                                                isSelected
                                                    ? "border-[#cbb079] bg-[#fcfbf8] shadow-xs ring-1 ring-[#cbb079]/30"
                                                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-neutral-50/40"
                                            }`}
                                        >
                                            {/* Haut de la carte : Radio + Nom + Badge Prix */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                                                        isSelected
                                                            ? "border-[#c2a661] bg-[#c2a661]"
                                                            : "border-gray-300 bg-white group-hover:border-gray-400"
                                                    }`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className={`font-bold text-sm md:text-base leading-snug transition-colors ${
                                                        isSelected ? "text-neutral-900" : "text-neutral-800 group-hover:text-black"
                                                    }`}>
                                                        {bowl.name}
                                                    </span>
                                                </div>

                                                <span className="bg-[#fcf9f2] text-[#9e7d3b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#cbb079]/30 shrink-0 whitespace-nowrap">
                                                    {showPrice ? `${price.toFixed(2).replace('.', ',')} € / pers.` : 'Sur devis'}
                                                </span>
                                            </div>

                                            {/* Bas de la carte : Description complète des ingrédients */}
                                            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mt-2.5 pl-7">
                                                {bowl.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {errors.Salad_Bar_Choix && (
                                <p className="text-xs text-red-500 font-medium mt-2">{errors.Salad_Bar_Choix}</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* OPTIONS DESSERTS */}
                {renderDessertSection()}

                {/* OPTIONS LOGISTIQUE */}
                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {((currentVolet === "plats_chauds" && formData.Plat_Collectivite) || (currentVolet === "salad_bar" && formData.Salad_Bar_Choix)) && (
                    renderPriceDisplay()
                )}
            </div>
        );
    };

    const renderBuffetChaudFields = () => {
        if (!isBuffetChaud) return null;

        const services = parseInt(formData.Buffet_Chaud_Services);

        return (
            <div className="space-y-6 animate-fade-in bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-[#D4AF37] mt-8">
                <h3 className="text-xl font-bold text-neutral-800 uppercase tracking-wide border-b border-neutral-200 pb-2 mb-4">
                    Personnalisez votre Buffet Chaud
                </h3>
                {FormAllergenLink({ section: 'buffets' })}

                {renderServiceToggle("Sur devis", "Prise en charge et service de votre buffet chaud sur place.")}

                {/* Choix du nombre de services */}
                <div className="group mb-8">
                    <div className="md:w-1/2">
                        <CustomDropdown
                            label="Nombre de services"
                            name="Buffet_Chaud_Services"
                            value={
                                formData.Buffet_Chaud_Services === "2" ? "2 Services (Plat + Dessert)" :
                                formData.Buffet_Chaud_Services === "3" ? "3 Services (Entrée + Plat + Dessert)" :
                                formData.Buffet_Chaud_Services === "4" ? "4 Services (Zakouskis + Entrée + Plat + Dessert)" :
                                formData.Buffet_Chaud_Services === "5" ? "5 Services (Zakouskis + 2 Entrées + Plat + Dessert)" :
                                "3 Services (Entrée + Plat + Dessert)"
                            }
                            options={[
                                "2 Services (Plat + Dessert)",
                                "3 Services (Entrée + Plat + Dessert)",
                                "4 Services (Zakouskis + Entrée + Plat + Dessert)",
                                "5 Services (Zakouskis + 2 Entrées + Plat + Dessert)"
                            ]}
                            req={true}
                            onSelect={(name, val) => {
                                const s = val.charAt(0);
                                handleSelectMeat(name, s);
                            }}
                        />
                    </div>
                </div>

                {/* Champs dynamiques selon le nombre de services */}
                <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-neutral-500 italic mb-4">Décrivez vos envies pour chaque service (ex: "Je voudrais du saumon", "Plutôt de la volaille", etc.) :</p>

                    {(services >= 4) && (
                        <div className="group">
                            <label className={labelStyle}>🥟 Apéritif / Zakouskis</label>
                            <input type="text" name="Buffet_Chaud_Zakouskis" value={formData.Buffet_Chaud_Zakouskis} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Zakouskis")} placeholder="Vos envies pour l'apéritif..." />
                        </div>
                    )}

                    {(services === 5) && (
                        <>
                            <div className="group">
                                <label className={labelStyle}>🥗 Entrée Froide</label>
                                <input type="text" name="Buffet_Chaud_Entree_1" value={formData.Buffet_Chaud_Entree_1} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Entree_1")} placeholder="Vos envies pour l'entrée froide..." />
                            </div>
                            <div className="group">
                                <label className={labelStyle}>🍲 Entrée Chaude</label>
                                <input type="text" name="Buffet_Chaud_Entree_2" value={formData.Buffet_Chaud_Entree_2} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Entree_2")} placeholder="Vos envies pour l'entrée chaude..." />
                            </div>
                        </>
                    )}

                    {(services === 3 || services === 4) && (
                        <div className="group">
                            <label className={labelStyle}>🥗 Entrée</label>
                            <input type="text" name="Buffet_Chaud_Entree_1" value={formData.Buffet_Chaud_Entree_1} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Entree_1")} placeholder="Vos envies pour l'entrée..." />
                        </div>
                    )}

                    <div className="group">
                        <label className={labelStyle}>🥘 Plat Principal (Buffet Chaud)</label>
                        <input type="text" name="Buffet_Chaud_Plat" value={formData.Buffet_Chaud_Plat} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Plat")} placeholder="Viandes, poissons, accompagnements souhaités..." />
                    </div>
                </div>

                {/* ACCOMPAGNEMENTS & SAUCES CHAUDES */}
                {renderHotOptionsSection()}

                {/* OPTION DESSERTS & MIGNARDISES */}
                {renderDessertSection()}

                <div className="group mt-8 border-t border-neutral-100 pt-6">
                    <label className={labelStyle}>Thème de l'événement ou autres commentaires</label>
                    <textarea
                        name="Buffet_Chaud_Commentaires"
                        value={formData.Buffet_Chaud_Commentaires}
                        onChange={handleChange}
                        className={`${getInputStyle("Buffet_Chaud_Commentaires")} h-20 resize-y`}
                        placeholder="Précisez le thème, le style de service attendu..."
                    />
                </div>
                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay()}
            </div>
        );
    };

    const renderContactFields = () => (
        <div className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <input
                        type="checkbox"
                        name="Societe"
                        id="Societe"
                        className="w-5 h-5 text-[#c2a661] accent-[#c2a661] rounded focus:ring-[#c2a661] cursor-pointer"
                        checked={formData.Societe === "Oui"}
                        onChange={handleChange}
                    />
                    <label htmlFor="Societe" className="text-neutral-700 font-medium cursor-pointer select-none">
                        Je représente une société
                    </label>
                </div>
                <AnimatePresence>
                    {formData.Societe === "Oui" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                        >
                            <input
                                type="text"
                                name="Nom_Societe"
                                className={getInputStyle("Nom_Societe")}
                                placeholder="Ex : Colruyt Group, ASBL..."
                                value={formData.Nom_Societe}
                                onChange={handleChange}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                    <label className={labelStyle}>Prénom <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="Prenom"
                        required
                        value={formData.Prenom}
                        onChange={handleChange}
                        onFocus={handleFormStart}
                        className={getInputStyle("Prenom")}
                        placeholder="Votre prénom"
                    />
                    {errors.Prenom && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.Prenom}</p>}
                </div>
                <div className="group">
                    <label className={labelStyle}>Nom <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="Nom"
                        required
                        value={formData.Nom}
                        onChange={handleChange}
                        className={getInputStyle("Nom")}
                        placeholder="Votre nom"
                    />
                    {errors.Nom && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.Nom}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                    <label className={labelStyle}>Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="Mail"
                        required
                        value={formData.Mail}
                        onChange={handleChange}
                        className={getInputStyle("Mail")}
                        placeholder="jean.dupont@exemple.com"
                    />
                    {errors.Mail && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.Mail}</p>}
                </div>
                <div className="group">
                    <label className={labelStyle}>Téléphone <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        name="Tel"
                        required
                        value={formData.Tel}
                        onChange={handleChange}
                        placeholder="0475 12 34 56"
                        className={getInputStyle("Tel")}
                    />
                    {errors.Tel && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.Tel}</p>}
                </div>
            </div>

            {!isPlatPrepare && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                        <label className={labelStyle}>Date de l&apos;événement <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="Date"
                            required
                            min={getMinDate()}
                            value={formData.Date}
                            onChange={handleChange}
                            onBlur={handleDateBlur}
                            className={getInputStyle("Date")}
                        />
                    </div>
                    <div className="group">
                        <CustomDropdown
                            label="Nombre de convives"
                            name="Nombre_Convives"
                            value={formData.Nombre_Convives}
                            options={getInitialConvivesOptions(formData.Type_Evenement)}
                            req={true}
                            hasError={!!errors.Nombre_Convives}
                            onSelect={handleSelectMeat}
                        />
                    </div>
                </div>
            )}
        </div>
    );



    return (
        <main className="min-h-screen pt-32 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-0 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="bg-white shadow-2xl p-8 md:p-14 rounded-[2rem] border-t-4 border-[#D4AF37]">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">Contactez-nous</h1>
                        <p className="text-gray-500 font-light text-lg">Parlons de votre prochain événement.</p>
                    </header>

                    {status === "success" ? (
                        <div className="text-center py-20 space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
                            {/* Cercle avec le V Vert */}
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4 shadow-sm border-4 border-green-100 scale-110">
                                <Check className="w-12 h-12 text-green-600" strokeWidth={4} />
                            </div>

                            <h2 className="text-4xl font-serif text-neutral-900">C&apos;est envoyé !</h2>

                            <p className="text-neutral-600 text-lg max-w-lg mx-auto leading-relaxed">
                                Merci de votre confiance. Nous avons bien reçu votre demande et reviendrons vers vous très rapidement.
                            </p>

                            <div className="pt-8">
                                <div className="inline-block bg-neutral-100 px-6 py-3 rounded-full border border-neutral-200">
                                    <p className="text-sm text-neutral-500 font-medium animate-pulse flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                        {isPlatPrepare ? "Redirection vers le paiement dans 3 secondes..." : "Redirection vers l'accueil dans 3 secondes..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {showMenuFirst ? (
                                <>
                                    {/* SECTION 1 : CONFIGURATION DE VOTRE FORMULE & OPTIONS */}
                                    <div className="space-y-8">
                                        {isAnyBBQ && renderBBQComposition()}
                                        {isPlatUnique && renderPlatUniqueFields()}
                                        {isBuffetFroid && renderBuffetFroidFields()}
                                        {isPains && renderPainsFields()}
                                        {isZakouskis && renderZakouskisFields()}
                                        {isVerrines && renderVerrinesFields()}
                                        {isCollectivite && renderCollectiviteFields()}
                                        {isBuffetChaud && renderBuffetChaudFields()}
                                        {(isBuffet || isAssociations) && !isBuffetFroid && !isPains && !isCollectivite && !isBuffetChaud && (
                                            <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-6">
                                                <div className="bg-neutral-50 p-6 rounded-xl text-center">
                                                    <p className="italic text-gray-500">Pour les buffets et associations, veuillez préciser vos choix dans le champ &quot;Dites-nous en plus&quot; ci-dessous ou nous vous recontacterons pour affiner le menu.</p>
                                                </div>
                                                {renderHotOptionsSection()}
                                                {renderDessertSection()}
                                                {renderLogisticsOptions()}
                                                {renderPriceDisplay()}
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION 2 : VOS INFORMATIONS & COORDONNÉES */}
                                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                                        <div className="border-b border-neutral-200 pb-4">
                                            <h3 className="text-2xl font-serif text-neutral-900 font-bold">
                                                Vos Coordonnées & Date de l&apos;Événement
                                            </h3>
                                            <p className="text-sm text-neutral-500 mt-1">
                                                Renseignez vos coordonnées pour recevoir votre devis détaillé sous 24h.
                                            </p>
                                        </div>
                                        {renderContactFields()}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                                    <div className="border-b border-neutral-200 pb-4">
                                        <h3 className="text-2xl font-serif text-neutral-900 font-bold">
                                            Vos Coordonnées & Date de l&apos;Événement
                                        </h3>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            Renseignez vos coordonnées pour nous transmettre votre demande.
                                        </p>
                                    </div>
                                    {renderContactFields()}
                                </div>
                            )}

                            {!isPlatPrepare && (
                                <div className="group bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-3">
                                    <label className="block text-lg font-serif font-bold text-neutral-900">
                                        Dites-nous en plus ! (Optionnel)
                                    </label>
                                    <p className="text-xs text-neutral-500">
                                        Précisez vos éventuelles allergies alimentaires, souhaits particuliers, lieu exact de l&apos;événement ou toute autre indication utile.
                                    </p>
                                    <textarea
                                        name="details_projet"
                                        value={formData.details_projet}
                                        onChange={handleChange}
                                        className={`${getInputStyle("details_projet")} h-32 resize-y`}
                                        placeholder="Ex : 2 personnes intolérantes au lactose, besoin d'une découpe à 19h..."
                                    />
                                </div>
                            )}

                            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200 flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="Souhaite_etre_recontacte"
                                    id="recontact"
                                    className="w-5 h-5 text-[#c2a661] accent-[#c2a661] rounded focus:ring-[#c2a661] cursor-pointer"
                                    checked={formData.Souhaite_etre_recontacte === "Oui"}
                                    onChange={handleChange}
                                />
                                <label htmlFor="recontact" className="text-neutral-800 text-sm font-medium cursor-pointer select-none">
                                    {isPlatPrepare
                                        ? "Je souhaite ajouter un commentaire à ma commande"
                                        : "Je souhaite être recontacté par téléphone pour discuter de mon devis."}
                                </label>
                            </div>

                            {isPlatPrepare && formData.Souhaite_etre_recontacte === "Oui" && (
                                <div className="group">
                                    <textarea name="details_projet" value={formData.details_projet} onChange={handleChange} className={`${getInputStyle("details_projet")} h-32 resize-y mt-4`} placeholder="Allergies, précisions..." />
                                </div>
                            )}

                            {isPlatPrepare && (
                                <div className="bg-white p-6 rounded-2xl border border-neutral-200 mt-6 shadow-sm">
                                    <h3 className="text-xl font-serif text-black mb-4 flex items-center gap-2">
                                        <ShoppingCart className="text-[#D4AF37]" size={20} /> Récapitulatif de votre panier
                                    </h3>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-left text-sm text-neutral-600">
                                            <thead className="bg-neutral-50 text-xs uppercase text-neutral-400">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Plat</th>
                                                    <th className="px-4 py-3">Jour</th>
                                                    <th className="px-4 py-3 text-center">Qte</th>
                                                    <th className="px-4 py-3">Soupes</th>
                                                    <th className="px-4 py-3 text-right rounded-tr-lg">S/Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item, idx) => (
                                                    <tr key={idx} className="border-b border-neutral-100 last:border-0">
                                                        <td className="px-4 py-3 font-medium text-black max-w-[200px] truncate" title={item.nomPlat}>{item.nomPlat}</td>
                                                        <td className="px-4 py-3 capitalize">{item.jour}</td>
                                                        <td className="px-4 py-3 text-center">{item.quantitePlat}</td>
                                                        <td className="px-4 py-3">
                                                            {Object.entries(item.soupes).map(([s, q]) => q > 0 ? <div key={s} className="text-xs">{q}x {s}</div> : null)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold whitespace-nowrap">{item.prixTotalLigne} €</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30 text-center flex flex-col justify-center items-center gap-2">
                                        <p className="text-neutral-800 font-bold text-lg">Total de votre commande : {cartTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</p>
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Paiement par virement bancaire uniquement.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center mb-6 w-full">
                                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                        onChange={(token) => setCaptchaToken(token)}
                                    />
                                ) : (
                                    <p className="text-red-500 text-sm font-bold">⚠️ Clé ReCAPTCHA manquante dans la configuration.</p>
                                )}
                            </div>

                            <button type="submit" disabled={status === "submitting"} className="w-full bg-black text-white py-5 uppercase tracking-widest text-sm font-bold rounded-full shadow-lg hover:bg-[#D4AF37] transition-all cursor-pointer">
                                {status === "submitting" ? "Envoi en cours..." : "Envoyer la demande"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
