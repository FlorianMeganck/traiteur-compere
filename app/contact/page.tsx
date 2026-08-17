"use client";

import { useState, useEffect, useMemo, useLayoutEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Leaf, Check, ShoppingCart, Clock, Calendar, AlertCircle, AlertTriangle } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { FESTIVE_DATE_OPTIONS, NOEL_DATE_OPTIONS, NOUVEL_AN_DATE_OPTIONS, getFestiveMenuDateRestrictions } from "../data/menus-fetes";
import { useCart } from "../hooks/useCart";

export default function Contact() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ContactForm />
        </Suspense>
    );
}

// --- DATA CONSTANTS ---

const viandesClassiques = [
    "Saucisse (nature)", "Saucisse (campagne)", "Saucisse (barbecue)", "Saucisse (italienne)",
    "Chipolata (nature)", "Chipolata (fines herbes)", "Chipolata (poivre)", "Chipolata (piment d'Espelette)",
    "Merguez", "Mini boudin blanc", "Saucisse de volaille (nature)", "Saucisse de volaille (fromage)",
    "Brochette nature aux oignons", "Brochette de bœuf marinée", "Brochette de porc aux oignons",
    "Brochette de porc marinée", "Brochette de volaille nature aux oignons", "Brochette de volaille marinée",
    "Brochette de dinde nature aux oignons", "Brochette de dinde marinée", "Brochette de mini boulettes marinées",
    "Brochette de mini boudins", "Braisade de bœuf marinée", "Braisade de canard aux trois poivres (+2€)",
    "Braisade de porc marinée", "Filet de poulet mariné", "Lard mariné (ail et fines herbes)",
    "Lard mariné (paprika)", "Spare ribs marinés au miel (+1€)", "Jambon barbecue en tranche",
    "Côte d'agneau marinée ail et fines herbes (+1€)", "Tranche de gigot d'agneau marinée (+2€)", "Pilon de poulet mariné"
];

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

const viandesCompose = ["Côte d'agneau", "Contrefilet de bœuf étranger", "Merguez", "Chipolata", "Brochette de bœuf"];
const dinatoireServices = ["Lasagnes", "Chili", "Tortellini", "Paëlla"];
const dinatoireViandes = ["Brochette de scampi", "Côte d'agneau", "Contrefilet de bœuf étranger", "Merguez et saucisse", "Brochette de bœuf"];

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
        Feculent: "",
        Feculent_Extra: "",
        Suppl_Crudite_Extra: "",
        Dessert_Check: "Non",
        Dessert_Choix: "",
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
        Plat_Collectivite: "",
        Buffet_Chaud_Services: "3",
        Buffet_Chaud_Commentaires: "",
        Buffet_Chaud_Zakouskis: "",
        Buffet_Chaud_Entree_1: "",
        Buffet_Chaud_Entree_2: "",
        Buffet_Chaud_Plat: "",
        Buffet_Chaud_Dessert: "",
        Date_Fete: "",
        Creneau_Retrait: "",
        Date_Fete_Noel: "",
        Creneau_Retrait_Noel: "",
        Date_Fete_NouvelAn: "",
        Creneau_Retrait_NouvelAn: ""
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
    const isCollectiviteMode = menuParam === 'collectivite' || searchParams.get('formule') === 'collectivite';
    const isBuffetChaudMode = searchParams.get('formule') === 'buffet-chaud';
    const isMenusFetes = typeParam === 'menus_fetes' || typeParam === 'menu_fetes' || (isLoaded && cartItems.some(i => i.itemType === 'menu_fete' || i.semaineId?.startsWith('menu') || i.semaineId?.startsWith('fetes') || i.semaineId === 'menus-fetes'));
    const isPlatPrepare = typeParam === 'plat_prepare' || isMenusFetes;

    // Matrice des restrictions de dates Fêtes
    const festiveRestrictions = useMemo(() => getFestiveMenuDateRestrictions(cartItems), [cartItems]);

    // Auto-désélection de la date si elle devient incompatible suite à une modification du panier
    useEffect(() => {
        if (isMenusFetes && formData.Date_Fete && !festiveRestrictions.allowedOptionIds.includes(formData.Date_Fete)) {
            setFormData(prev => ({
                ...prev,
                Date_Fete: "",
                Date: "",
                Creneau_Retrait: ""
            }));
        }
    }, [isMenusFetes, festiveRestrictions.allowedOptionIds, formData.Date_Fete]);

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
            if (isMenusFetes) {
                router.push('/menus-fetes');
            } else {
                router.push('/plats-prepares');
            }
        }
    }, [isPlatPrepare, isMenusFetes, isLoaded, cartItems.length, router, status]);

    // EFFECT: Handle URL params & Default Selection
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const menuParam = searchParams.get('menu');
        const convivesParam = searchParams.get('convives');
        const serviceParam = searchParams.get('service');

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
                } else if (menuParam === 'collectivite') {
                    newData.Type_Evenement = 'Repas de collectivité';
                }
            } else if (typeParam === 'plat_prepare' || isMenusFetes) {
                newData.Type_Evenement = isMenusFetes ? 'Menus de Fêtes' : 'Plat Préparé';
            }

            const formuleParam = searchParams.get('formule');
            const servicesParam = searchParams.get('services');

            if (formuleParam === 'buffet-chaud') {
                newData.Type_Evenement = 'Buffet Chaud';
                if (servicesParam) {
                    newData.Buffet_Chaud_Services = servicesParam;
                }
            } else if (formuleParam === 'collectivite') {
                newData.Type_Evenement = 'Repas de collectivité';
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
        } else if (isCollectivite && formData.Plat_Collectivite) {
            let itemPrice = collectiviteData[formData.Plat_Collectivite];
            // Majoration de 10% si moins de 30 personnes
            if (formData.Nombre_Convives === 'Moins de 30') {
                itemPrice = itemPrice * 1.10;
            }
            base = itemPrice;
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
            formData.Viande_1, formData.Viande_2, formData.Viande_3,
            formData.dinatoire_service_1, formData.dinatoire_service_2
        ];
        meatFields.forEach(field => {
            if (field) {
                if (field.includes("(+1€)")) supplements += 1;
                if (field.includes("(+2€)")) supplements += 2;
                if (field.includes("(+3€)")) supplements += 3;
            }
        });

        if (isAnyBBQ) {
            if (formData.Viande_Extra_1) supplements += 3;
            if (formData.Viande_Extra_2) supplements += 3;
            if (formData.Suppl_Crudite_Extra) supplements += 1.5;
            if (formData.Feculent_Extra) supplements += 2;
        }

        // 3. Extra Hot Side
        if (formData.Accompagnement_Chaud_Supplement_Check === "Oui" && formData.Accompagnement_Chaud_Supplement) {
            supplements += 1;
        }

        // 4. Dessert
        if (formData.Dessert_Check === "Oui" && formData.Dessert_Choix) {
            supplements += 6;
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
        return viandesClassiques;
    };
    const renderPriceDisplay = (label: string = "Prix par personne") => {
        if (totalPrice.perPerson === 0 && totalPrice.materiel === 0) return null;
        return (
            <div className="transition-all duration-300 border-t border-[#D4AF37]/30 pt-6 mt-6">
                <div className="bg-black text-[#D4AF37] p-4 rounded-xl shadow-lg flex items-center justify-between border border-[#D4AF37]/50 max-w-sm mx-auto">
                    <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                    {totalPrice.perPerson === -1 ? (
                        <span className="bg-[#D4AF37] text-black px-3 py-1 rounded font-bold text-xs tracking-widest uppercase">SUR DEVIS</span>
                    ) : (
                        <span className="text-xl font-serif font-bold">
                            {totalPrice.perPerson > 0 ? (
                                <>
                                    {totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers
                                    {totalPrice.materiel > 0 && (
                                        <> + {totalPrice.materiel.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ (Matériel)</>
                                    )}
                                    <span className="text-xs font-sans font-normal text-[#D4AF37]/80 ml-1">HTVA</span>
                                </>
                            ) : (
                                "---"
                            )}
                        </span>
                    )}
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
                ...(name === "Accompagnement_Chaud_Supplement_Check" && !checked ? { Accompagnement_Chaud_Supplement: "" } : {}),
                ...(name === "Dessert_Check" && !checked ? { Dessert_Choix: "" } : {}),
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
        if (isMenusFetes) {
            if (festiveRestrictions.isMixed) {
                if (!formData.Date_Fete_Noel) {
                    newErrors.Date_Fete_Noel = "Veuillez sélectionner la date pour vos repas de Noël (24 ou 25 Décembre)";
                }
                if (!formData.Date_Fete_NouvelAn) {
                    newErrors.Date_Fete_NouvelAn = "Veuillez sélectionner la date pour vos repas de Nouvel An (31 Décembre ou 1er Janvier)";
                }
            } else {
                if (!formData.Date_Fete && !formData.Date) {
                    newErrors.Date_Fete = "Veuillez sélectionner la date de votre repas de fête";
                } else if (!festiveRestrictions.allowedOptionIds.includes(formData.Date_Fete)) {
                    newErrors.Date_Fete = "Cette date n'est pas compatible avec les menus sélectionnés dans votre panier";
                }
            }
        } else if (isPlatPrepare) {
            if (!formData.Plat_Prepare_Quantite || parseInt(formData.Plat_Prepare_Quantite) < 1) newErrors.Plat_Prepare_Quantite = "Requis";
        } else if (isPlatUnique) {
            if (!formData.Plat_Associatif) newErrors.Plat_Associatif = "Requis";
        } else if (isBuffetFroid) {
            if (!formData.Feculent_Froid) newErrors.Feculent_Froid = "Requis";
            if (!formData.Crudite_1) newErrors.Crudite_1 = "Requis";
            if (!formData.Crudite_2) newErrors.Crudite_2 = "Requis";
            if (!formData.Crudite_3) newErrors.Crudite_3 = "Requis";
            if (!formData.Crudite_4) newErrors.Crudite_4 = "Requis";
            if (!formData.Crudite_5) newErrors.Crudite_5 = "Requis";
            if (!formData.Crudite_6) newErrors.Crudite_6 = "Requis";
        } else if (isAnyBBQ) {
            if (!formData.Feculent) newErrors.Feculent = "Requis";
            if (!formData.Crudite_1) newErrors.Crudite_1 = "Requis";
            if (!formData.Crudite_2) newErrors.Crudite_2 = "Requis";
            if (!formData.Crudite_3) newErrors.Crudite_3 = "Requis";
            if (!formData.Crudite_4) newErrors.Crudite_4 = "Requis";
            if (!formData.Crudite_5) newErrors.Crudite_5 = "Requis";
            if (!formData.Crudite_6) newErrors.Crudite_6 = "Requis";

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
            if (!formData.Plat_Collectivite) newErrors.Plat_Collectivite = "Requis";
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
            ...(formData.Crudite_1 && { "🥗 Crudité 1": formData.Crudite_1 }),
            ...(formData.Crudite_2 && { "🥗 Crudité 2": formData.Crudite_2 }),
            ...(formData.Crudite_3 && { "🥗 Crudité 3": formData.Crudite_3 }),
            ...(formData.Crudite_4 && { "🥗 Crudité 4": formData.Crudite_4 }),
            ...(formData.Crudite_5 && { "🥗 Crudité 5": formData.Crudite_5 }),
            ...(formData.Crudite_6 && { "🥗 Crudité 6": formData.Crudite_6 }),
            ...(formData.Suppl_Crudite_Extra && { "⭐ Crudité Extra (+1,50€)": formData.Suppl_Crudite_Extra }),

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

            // --- SECTION COLLECTIVITÉS ---
            ...(formData.Type_Evenement === 'Repas de collectivité' && {
                "🥘 MENU SÉLECTIONNÉ": "REPAS DE COLLECTIVITÉ",
                "🍽️ Plat Unique Choisi": formData.Plat_Collectivite || "Non spécifié"
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
            ...(formData.Accompagnement_Froid_2 && { "🥗 Accompagnement Froid 2": formData.Accompagnement_Froid_2 }),
            ...(formData.Accompagnement_Froid_3 && { "🥗 Accompagnement Froid 3": formData.Accompagnement_Froid_3 }),
            ...(formData.Accompagnement_Chaud_Supplement && { "🔥 Accompagnement Chaud Extra": formData.Accompagnement_Chaud_Supplement }),

            // DESSERTS
            ...(formData.Dessert_Check === "Oui" && formData.Dessert_Choix && { "🍰 Dessert choisi (+6€)": formData.Dessert_Choix }),

            // DIVERS
            "🍽️ Location de vaisselle": formData.Location_Vaisselle_Check === "Oui" ? "Oui (+1,50€/pers)" : "Non",
            "🍷 Location de verrerie": getVerrerieDetail(),
            "💬 Message / Allergies": formData.details_projet || "Aucun message",
            "🔄 Souhaite être recontacté": formData.Souhaite_etre_recontacte === "Oui" ? "Oui" : "Non"
        };

        // 4. Envoi à Web3Forms ou API Interne
        try {
            if (isPlatPrepare) {
                let dateEvenementFormatted = "";
                let creneauRetraitFormatted = "";

                if (isMenusFetes) {
                    if (festiveRestrictions.isMixed) {
                        const noelOpt = NOEL_DATE_OPTIONS.find(o => o.id === formData.Date_Fete_Noel || o.dayFormatted === formData.Date_Fete_Noel);
                        const naOpt = NOUVEL_AN_DATE_OPTIONS.find(o => o.id === formData.Date_Fete_NouvelAn || o.dayFormatted === formData.Date_Fete_NouvelAn);

                        const noelDay = noelOpt?.dayFormatted || formData.Date_Fete_Noel;
                        const naDay = naOpt?.dayFormatted || formData.Date_Fete_NouvelAn;
                        const noelPickup = noelOpt?.pickupWindow || formData.Creneau_Retrait_Noel || "Retrait le 23 ou 24 Décembre";
                        const naPickup = naOpt?.pickupWindow || formData.Creneau_Retrait_NouvelAn || "Retrait le 30 ou 31 Décembre";

                        dateEvenementFormatted = `Noël : ${noelDay} | Nouvel An : ${naDay}`;
                        creneauRetraitFormatted = `Noël : ${noelPickup} | Nouvel An : ${naPickup}`;
                    } else {
                        const selectedOption = FESTIVE_DATE_OPTIONS.find(o => o.id === formData.Date_Fete || o.dayFormatted === formData.Date_Fete);
                        dateEvenementFormatted = selectedOption ? `${selectedOption.label} (${selectedOption.dayFormatted})` : (formData.Date_Fete || formData.Date);
                        creneauRetraitFormatted = selectedOption ? selectedOption.pickupWindow : formData.Creneau_Retrait;
                    }
                }

                const apiPayload = {
                    Nom: formData.Nom,
                    Prenom: formData.Prenom,
                    Mail: formData.Mail,
                    Tel: formData.Tel,
                    Societe: formData.Societe,
                    Nom_Societe: formData.Nom_Societe,
                    Date: isMenusFetes ? (dateEvenementFormatted || new Date().toLocaleDateString('fr-BE')) : new Date().toLocaleDateString('fr-BE'),
                    dateEvenement: isMenusFetes ? dateEvenementFormatted : undefined,
                    creneauRetrait: isMenusFetes ? creneauRetraitFormatted : undefined,
                    details_projet: formData.details_projet,
                    totalPrice: cartTotal,
                    cartItems: cartItems,
                    captchaToken: captchaToken,
                    typeCommande: isMenusFetes ? 'menus_fetes' : 'plat_prepare'
                };

                const response = await fetch("/api/commande", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(apiPayload)
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    setStatus("success");
                    const joursUniques = Array.from(new Set(cartItems.map(item => item.badge || item.jour))).join(',');
                    const redirectJours = isMenusFetes ? (dateEvenementFormatted || '24 Décembre') : joursUniques;
                    const redirectCreneau = creneauRetraitFormatted ? `&creneau=${encodeURIComponent(creneauRetraitFormatted)}` : '';
                    clearCart();
                    setTimeout(() => {
                        window.location.href = `/commande-confirmee?nom=${encodeURIComponent(formData.Nom)}&prenom=${encodeURIComponent(formData.Prenom)}&orderId=${result.orderNumber}&total=${cartTotal}&jours=${encodeURIComponent(redirectJours)}${redirectCreneau}`;
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

    const renderDropdown = (label: string, name: string, options: string[], excludeValues: string[] = [], req = false) => {
        // Filter options: remove if in excludeValues AND not the current value
        const currentVal = (formData as Record<string, string>)[name];
        const filteredOptions = options.filter(opt => !excludeValues.includes(opt) || opt === currentVal);

        return (
            <div className="group">
                <label className={labelStyle}>{label} {req && <span className="text-red-500">*</span>}</label>
                <div className="relative">
                    <select
                        name={name}
                        value={currentVal}
                        onChange={handleChange}
                        className={`${getInputStyle(name)} appearance-none cursor-pointer`}
                    >
                        <option value="">Faites votre choix...</option>
                        {filteredOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
        );
    };

    const renderLogisticsOptions = () => {
        if (isPlatPrepare) return null;
        return (
            <div className="space-y-4 mt-6 pt-6 border-t border-neutral-200">
                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200 max-w-lg mx-auto md:max-w-none">
                    <div className="flex items-center gap-3 mb-2">
                        <input
                            type="checkbox"
                            name="Location_Vaisselle_Check"
                            id="Location_Vaisselle_Check"
                            className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                            checked={formData.Location_Vaisselle_Check === "Oui"}
                            onChange={handleChange}
                        />
                        <label htmlFor="Location_Vaisselle_Check" className="text-neutral-700 font-bold cursor-pointer select-none">
                            Location de vaisselle (+1,50€ / pers)
                        </label>
                    </div>
                    <p className="text-sm text-neutral-500 ml-8 italic">Cela comprend le lavage.</p>
                </div>

                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200 max-w-lg mx-auto md:max-w-none">
                    <div className="flex items-center gap-3 mb-2">
                        <input
                            type="checkbox"
                            name="Location_Verrerie_Check"
                            id="Location_Verrerie_Check"
                            className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                            checked={formData.Location_Verrerie_Check === "Oui"}
                            onChange={handleChange}
                        />
                        <label htmlFor="Location_Verrerie_Check" className="text-neutral-700 font-bold cursor-pointer select-none text-left leading-tight">
                            Location de verrerie (1,50€ / lot de 5 verres)
                        </label>
                    </div>
                    <p className="text-sm text-neutral-500 ml-8 italic">Cela comprend le lavage.</p>

                    <AnimatePresence>
                        {formData.Location_Verrerie_Check === "Oui" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden mt-4 pl-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                            🍷 Verre à vin
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="Location_Verrerie_Vin"
                                                value={formData.Location_Verrerie_Vin}
                                                onChange={handleChange}
                                                className={getInputStyle("Location_Verrerie_Vin")}
                                            >
                                                {glassSteps.map(step => (
                                                    <option key={step} value={step}>{step} verres</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                            🥤 Verre à soft (25cl)
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="Location_Verrerie_Soft"
                                                value={formData.Location_Verrerie_Soft}
                                                onChange={handleChange}
                                                className={getInputStyle("Location_Verrerie_Soft")}
                                            >
                                                {glassSteps.map(step => (
                                                    <option key={step} value={step}>{step} verres</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                            🥂 Flûte à champagne
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="Location_Verrerie_Flute"
                                                value={formData.Location_Verrerie_Flute}
                                                onChange={handleChange}
                                                className={getInputStyle("Location_Verrerie_Flute")}
                                            >
                                                {glassSteps.map(step => (
                                                    <option key={step} value={step}>{step} verres</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-neutral-50/50 border border-[#D4AF37]/30 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm relative">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderDropdown("Entrée 1", "compose_entree_1", entreesCompose, composeEntreeChoices)}
                            {renderDropdown("Entrée 2", "compose_entree_2", entreesCompose, composeEntreeChoices)}
                            {renderDropdown("Plat 1", "Viande_1", viandesCompose, bbqChoices)}
                            {renderDropdown("Plat 2", "Viande_2", viandesCompose, bbqChoices)}
                        </div>
                    )}

                    {isBBQDinatoire && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderDropdown("1er Service (Plat 1)", "dinatoire_service_1", dinatoireServices, dinatoireServiceChoices)}
                            {renderDropdown("1er Service (Plat 2)", "dinatoire_service_2", dinatoireServices, dinatoireServiceChoices)}
                            {renderDropdown("2ème Service (BBQ Choix 1)", "Viande_1", getBBQList(), bbqChoices)}
                            {renderDropdown("2ème Service (BBQ Choix 2)", "Viande_2", getBBQList(), bbqChoices)}
                        </div>
                    )}

                    {!isCochonOrPorchetta && !isBBQCompose && !isBBQDinatoire && (
                        <div className={`grid grid-cols-1 ${isBBQNobles ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                            {renderDropdown("Choix 1", "Viande_1", getBBQList(), bbqChoices)}
                            {renderDropdown("Choix 2", "Viande_2", getBBQList(), bbqChoices)}
                            {!isBBQNobles && renderDropdown("Choix 3", "Viande_3", getBBQList(), bbqChoices)}
                        </div>
                    )}

                    {/* Suppléments Viandes (Rattachés à la catégorie Viande) */}
                    {!isCochonOrPorchetta && (
                        <div className="mt-4 p-4 bg-neutral-50/70 rounded-xl border border-dashed border-neutral-300">
                            <label className={`${labelStyle} flex items-center gap-2`}>
                                <span>🥩</span> Viande supplémentaire (+3,00€ / pers)
                            </label>
                            <div className="relative">
                                <select name="Viande_Extra_1" value={formData.Viande_Extra_1 || ""} onChange={handleChange} className={getInputStyle("Viande_Extra_1") + " appearance-none"}>
                                    <option value="">Aucun supplément...</option>
                                    {getBBQList().map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            {formData.Viande_Extra_1 && (
                                <div className="mt-4 animate-fade-in">
                                    <label className={`${labelStyle} flex items-center gap-2`}>
                                        <span>🥩</span> 2ème viande supplémentaire (+3,00€ / pers)
                                    </label>
                                    <div className="relative">
                                        <select name="Viande_Extra_2" value={formData.Viande_Extra_2 || ""} onChange={handleChange} className={getInputStyle("Viande_Extra_2") + " appearance-none"}>
                                            <option value="">Aucun supplément...</option>
                                            {getBBQList().map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                {/* ACCOMPAGNEMENTS & SUPPLÉMENTS */}
                <div className="space-y-6">
                    {/* SECTION FÉCULENTS (Groupés) */}
                    <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200 mb-8 mt-8">
                        <h4 className="text-md font-bold text-neutral-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <span>🍚</span> Vos Féculents
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Féculent Inclus */}
                            <div>
                                <label className={labelStyle}>Féculent (Inclus)</label>
                                <div className="relative">
                                    <select name="Feculent" value={formData.Feculent || ""} onChange={handleChange} className={getInputStyle("Feculent") + " appearance-none"}>
                                        <option value="">Faites votre choix...</option>
                                        {feculentsBBQ.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Féculent Supplémentaire */}
                            <div>
                                <label className={labelStyle}>Féculent Extra (+2,00€ / pers)</label>
                                <div className="relative">
                                    <select name="Feculent_Extra" value={formData.Feculent_Extra || ""} onChange={handleChange} className={getInputStyle("Feculent_Extra") + " appearance-none"}>
                                        <option value="">Aucun supplément...</option>
                                        {feculentsBBQ.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CRUDITÉS */}
                    <div className="mt-6 border-t border-dashed border-neutral-200 pt-6"></div>
                    <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Crudités (6 Incluses)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <div key={`bbq_crudite_${num}`}>
                                {renderDropdown(`Crudité ${num}`, `Crudite_${num}`, SIDES_COLD, [formData.Crudite_1, formData.Crudite_2, formData.Crudite_3, formData.Crudite_4, formData.Crudite_5, formData.Crudite_6].filter(Boolean))}
                            </div>
                        ))}
                    </div>

                    {/* Supplément Crudité (Rattaché à la catégorie Crudités) */}
                    <div className="mt-4 p-4 bg-neutral-50/70 rounded-xl border border-dashed border-neutral-300">
                        <label className={`${labelStyle} flex items-center gap-2`}>
                            <span>🥗</span> Crudité supplémentaire (+1,50€ / pers)
                        </label>
                        <div className="relative">
                            <select name="Suppl_Crudite_Extra" value={formData.Suppl_Crudite_Extra || ""} onChange={handleChange} className={getInputStyle("Suppl_Crudite_Extra") + " appearance-none"}>
                                <option value="">Aucun supplément...</option>
                                {SIDES_COLD.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESSERTS SECTION */}
                <div className="mt-8 border-t border-dashed border-neutral-200 pt-8">
                    <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200 hover:border-[#D4AF37]/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <input
                                type="checkbox"
                                name="Dessert_Check"
                                id="Dessert_Check"
                                className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                                checked={formData.Dessert_Check === "Oui"}
                                onChange={handleChange}
                            />
                            <label htmlFor="Dessert_Check" className="text-neutral-700 font-bold cursor-pointer select-none">
                                Ajouter un Dessert (+6€ / pers)
                            </label>
                        </div>
                        <AnimatePresence>
                            {formData.Dessert_Check === "Oui" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <select
                                            name="Dessert_Choix"
                                            value={formData.Dessert_Choix}
                                            onChange={handleChange}
                                            className={getInputStyle("Dessert_Choix")}
                                        >
                                            <option value="">Faites votre choix...</option>
                                            {dessertsList.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {renderLogisticsOptions()}

                {/* PRICE DISPLAY MOVED TO BOTTOM */}
                <div className={`transition-all duration-300 border-t border-[#D4AF37]/30 pt-8 mt-8 ${totalPrice.perPerson !== 0 || totalPrice.materiel !== 0 ? "opacity-100" : "opacity-50"}`}>
                    <div className="bg-black text-[#D4AF37] p-6 rounded-xl shadow-xl flex items-center justify-between border border-[#D4AF37]/50 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform">
                        <span className="text-sm font-bold uppercase tracking-widest">Prix Estimatif</span>
                        <div className="text-right">
                            {totalPrice.perPerson === -1 ? (
                                <span className="bg-[#D4AF37] text-black px-4 py-1 rounded font-bold text-sm tracking-widest">SUR DEVIS</span>
                            ) : (
                                <span className="text-2xl font-serif font-bold">
                                    {totalPrice.perPerson > 0 ? (
                                        <>
                                            {totalPrice.perPerson.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers
                                            {totalPrice.materiel > 0 && (
                                                <> + {totalPrice.materiel.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ (Matériel)</>
                                            )}
                                            <span className="text-sm font-sans font-normal text-[#D4AF37]/80 ml-1">HTVA</span>
                                        </>
                                    ) : (
                                        "---"
                                    )}
                                </span>
                            )}
                            {totalPrice.perPerson > 0 && (
                                <p className="text-xs text-[#D4AF37]/70 mt-1 font-light">
                                    {formData.Service_Check === "Oui" ? "Frais de déplacement et service inclus" : "Hors frais de déplacement et service"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };     // Legacy renderers for Associations / Buffet can be simplified or kept similar...
    // ideally I would refactor them to use renderDropdown too but keeping logic distinct is fine.
    // For brevity in this rewrite, I'll use a simplified version for them.

    // Simplified renderers for Associations / Buffet can be kept minimal

    const renderPlatUniqueFields = () => (
        <div className="space-y-6 animate-fade-in bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-[#D4AF37]">
            <h3 className="text-lg font-serif text-neutral-800 font-bold border-b border-neutral-200 pb-2 mb-4">Votre Choix de Plat Unique</h3>

            <div className="group">
                <label className={labelStyle}>Choisissez votre Plat Principal <span className="text-red-500">*</span></label>
                <div className="relative">
                    <select name="Plat_Associatif" value={formData.Plat_Associatif} onChange={handleChange} className={getInputStyle("Plat_Associatif")}>
                        <option value="">Faites votre choix...</option>
                        <option value="Bar à Pâtes">Bar à Pâtes</option>
                        <option value="Burgers">Burgers Spécial Compère</option>
                        <option value="Boulets Liégeois">Boulets Liégeois & Frites</option>
                        <option value="Vol-au-vent">Vol-au-vent artisanal & Frites</option>
                        <option value="Option Végétarienne">Option Végé (Salade & Quiche)</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {/* CASCADE : Apparaît selon le choix principal */}
            <AnimatePresence>
                {formData.Plat_Associatif === "Bar à Pâtes" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2 overflow-hidden">
                        <label className={labelStyle}>Choix de la sauce <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="Plat_Associatif_Detail" value={formData.Plat_Associatif_Detail} onChange={handleChange} className={getInputStyle("Plat_Associatif_Detail")}>
                                <option value="">Sélectionnez la sauce...</option>
                                <option value="Bolognaise">Bolognaise</option>
                                <option value="Carbonara">Carbonara</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </motion.div>
                )}

                {formData.Plat_Associatif === "Burgers" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2 overflow-hidden">
                        <label className={labelStyle}>Type de Burger <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="Plat_Associatif_Detail" value={formData.Plat_Associatif_Detail} onChange={handleChange} className={getInputStyle("Plat_Associatif_Detail")}>
                                <option value="">Sélectionnez le type...</option>
                                <option value="Normal">Burger Normal</option>
                                <option value="Spécial Compère">Spécial Compère</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </motion.div>
                )}

                {formData.Plat_Associatif === "Boulets Liégeois" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2 overflow-hidden">
                        <label className={labelStyle}>Choix de la sauce <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="Plat_Associatif_Detail" value={formData.Plat_Associatif_Detail} onChange={handleChange} className={getInputStyle("Plat_Associatif_Detail")}>
                                <option value="">Sélectionnez la sauce...</option>
                                <option value="Sauce Lapin">Sauce Lapin</option>
                                <option value="Sauce Tomate">Sauce Tomate</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {renderLogisticsOptions()}

            {/* PRICE INDICATION */}
            {renderPriceDisplay("Prix par personne")}
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
                    <label className={`${labelStyle} flex items-center gap-2`}>
                        <span>🍚</span> Votre Féculent (Inclus)
                    </label>
                    <div className="relative">
                        <select name="Feculent_Froid" value={formData.Feculent_Froid || ""} onChange={handleChange} className={getInputStyle("Feculent_Froid") + " appearance-none"}>
                            <option value="">Choisissez 1 féculent...</option>
                            {feculentsFroids.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Crudités Incluses (Grille de 6) */}
                <div>
                    <label className={`${labelStyle} flex items-center gap-2 mb-4`}>
                        <span>🥗</span> Vos 6 Crudités Incluses
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <div className="relative group" key={`Crudite_${num}`}>
                                <select
                                    name={`Crudite_${num}`}
                                    value={(formData as any)[`Crudite_${num}`] || ""}
                                    onChange={handleChange}
                                    className={getInputStyle(`Crudite_${num}`) + " appearance-none"}
                                >
                                    <option value="">Choix {num}...</option>
                                    {cruditesFroids.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay("Prix par personne")}
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
                        <label className={`${labelStyle} flex items-center gap-2`}>
                            <span>🥖</span> Gamme de pains
                        </label>
                        <div className="relative">
                            <select name="Categorie_Pains" value={formData.Categorie_Pains || ""} onChange={handleChange} className={getInputStyle("Categorie_Pains") + " appearance-none"}>
                                <option value="">Sélectionnez une gamme...</option>
                                {Object.keys(painsData).map(cat => {
                                    const adjustedPrice = getAdjustedUnitPrice(painsData[cat].price);
                                    return (
                                        <option key={cat} value={cat}>
                                            {cat} ({adjustedPrice.toFixed(2).replace('.', ',')}€ / pièce)
                                        </option>
                                    );
                                })}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

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
                        <label className={`${labelStyle} flex items-center gap-2`}>
                            <span>🔢</span> Quantité par personne
                        </label>
                        <div className="relative">
                            <select name="Quantite_Pains" value={formData.Quantite_Pains || ""} onChange={handleChange} className={getInputStyle("Quantite_Pains") + " appearance-none"}>
                                <option value="">Nombre de pièces/pers...</option>
                                {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num} pièces / pers</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        {/* Message intolérances */}
                        <p className="text-xs text-neutral-500 mt-2 italic px-1">
                            En cas d'intolérances, merci de le préciser dans le champ message en bas du formulaire.
                        </p>
                    </div>
                </div>

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay("Prix par personne")}
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

            return (
                <div key={`zakouski_slot_${num}`} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3 border-b pb-2">
                        Choix {num} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-3">
                        <div className="relative">
                            <select name={catKey} value={selectedCat || ""} onChange={handleChange} className={getInputStyle(catKey as any) + " appearance-none py-2 text-sm"}>
                                <option value="">Famille de produit...</option>
                                {Object.keys(zakouskisData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select name={itemKey} value={formAny[itemKey] || ""} onChange={handleChange} disabled={!selectedCat} className={getInputStyle(itemKey as any) + ` appearance-none py-2 text-sm ${!selectedCat ? 'bg-neutral-100 opacity-60' : ''}`}>
                                <option value="">Sélectionnez la pièce...</option>
                                {selectedCat && Object.entries(zakouskisData[selectedCat]).map(([gammeName, gammeData]) => {
                                    const adjustedPrice = getAdjustedPrice(gammeData.price);
                                    return (
                                        <optgroup key={gammeName} label={`--- ${gammeName} (${adjustedPrice.toFixed(2).replace('.', ',')}€) ---`}>
                                            {gammeData.items.map(item => <option key={item} value={item}>{item}</option>)}
                                        </optgroup>
                                    );
                                })}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
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

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay("Prix par personne")}
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

            return (
                <div key={`verrine_slot_${num}`} className={`bg-white p-4 rounded-xl border border-neutral-200 shadow-sm transition-opacity duration-300 ${isSlotsDisabled ? 'opacity-50' : ''}`}>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3 border-b pb-2">
                        Choix {num} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-3">
                        <div className="relative">
                            <select name={catKey} value={selectedCat || ""} onChange={handleChange} disabled={isSlotsDisabled} className={getInputStyle(catKey as any) + " appearance-none py-2 text-sm"}>
                                <option value="">Famille de verrine...</option>
                                {Object.keys(verrinesData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select name={itemKey} value={formAny[itemKey] || ""} onChange={handleChange} disabled={isSlotsDisabled || !selectedCat} className={getInputStyle(itemKey as any) + ` appearance-none py-2 text-sm ${(isSlotsDisabled || !selectedCat) ? 'bg-neutral-100 opacity-60' : ''}`}>
                                <option value="">Sélectionnez la pièce...</option>
                                {selectedCat && (
                                    <optgroup label={`--- ${selectedCat} (${getAdjustedPriceDisplay(selectedCat).toFixed(2).replace('.', ',')}€ / pièce) ---`}>
                                        {verrinesData[selectedCat].items.map(item => <option key={item} value={item}>{item}</option>)}
                                    </optgroup>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
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

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {renderPriceDisplay("Prix par personne")}
            </div>
        );
    };

    const renderCollectiviteFields = () => {
        if (!isCollectivite) return null;

        // Tri alphabétique des plats pour un affichage propre
        const sortedDishes = Object.keys(collectiviteData).sort((a, b) => a.localeCompare(b));

        const getAdjustedPriceDisplay = (basePrice: number) => {
            if (formData.Nombre_Convives === 'Moins de 30') return basePrice * 1.10;
            return basePrice;
        };

        return (
            <div className="space-y-6 animate-fade-in bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-black mt-8">
                <h3 className="text-xl font-bold text-neutral-800 uppercase tracking-wide border-b border-neutral-200 pb-2 mb-4">
                    Détails de votre Repas de Collectivité
                </h3>
                {FormAllergenLink({ section: 'collectivite' })}

                <div className="group">
                    <label className={labelStyle}>Sélectionnez le plat pour votre groupe <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select name="Plat_Collectivite" value={formData.Plat_Collectivite} onChange={handleChange} className={getInputStyle("Plat_Collectivite" as any) + " appearance-none"}>
                            <option value="">Faites votre choix parmi nos 21 plats...</option>
                            {sortedDishes.map(dish => {
                                const showPrice = formData.Nombre_Convives !== 'Plus de 100';
                                const price = getAdjustedPriceDisplay(collectiviteData[dish]);
                                return (
                                    <option key={dish} value={dish}>
                                        {dish}{showPrice ? ` (${price.toFixed(2).replace('.', ',')}€ / pers)` : ''}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 italic px-1">Un seul et même plat pour l'ensemble des convives.</p>
                </div>

                {renderLogisticsOptions()}

                {/* PRICE INDICATION */}
                {formData.Plat_Collectivite && renderPriceDisplay("Prix par personne")}
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

                {/* Choix du nombre de services */}
                <div className="group mb-8">
                    <label className={labelStyle}>Nombre de services <span className="text-red-500">*</span></label>
                    <div className="relative md:w-1/2">
                        <select name="Buffet_Chaud_Services" value={formData.Buffet_Chaud_Services} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Services") + " appearance-none"}>
                            <option value="2">2 Services (Plat + Dessert)</option>
                            <option value="3">3 Services (Entrée + Plat + Dessert)</option>
                            <option value="4">4 Services (Zakouskis + Entrée + Plat + Dessert)</option>
                            <option value="5">5 Services (Zakouskis + 2 Entrées + Plat + Dessert)</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
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

                    <div className="group">
                        <label className={labelStyle}>🍰 Dessert / Fromage</label>
                        <input type="text" name="Buffet_Chaud_Dessert" value={formData.Buffet_Chaud_Dessert} onChange={handleChange} className={getInputStyle("Buffet_Chaud_Dessert")} placeholder="Vos envies sucrées ou fromagères..." />
                    </div>
                </div>

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
            </div>
        );
    };

    const renderContactFields = () => (
        <>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                    <label className={labelStyle}>Prénom <span className="text-red-500">*</span></label>
                    <input type="text" name="Prenom" required value={formData.Prenom} onChange={handleChange} onFocus={handleFormStart} className={getInputStyle("Prenom")} placeholder="Votre prénom" />
                    {errors.Prenom && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.Prenom}</p>}
                </div>
                <div className="group">
                    <label className={labelStyle}>Nom <span className="text-red-500">*</span></label>
                    <input type="text" name="Nom" required value={formData.Nom} onChange={handleChange} className={getInputStyle("Nom")} placeholder="Votre nom" />
                    {errors.Nom && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.Nom}</p>}
                </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <input type="checkbox" name="Societe" id="Societe" className="w-5 h-5 text-[#D4AF37] rounded" checked={formData.Societe === "Oui"} onChange={handleChange} />
                    <label htmlFor="Societe" className="text-neutral-700 font-medium cursor-pointer">Je représente une société</label>
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
                            <input type="text" name="Nom_Societe" className={getInputStyle("Nom_Societe")} placeholder="Ex : Colruyt Group" value={formData.Nom_Societe} onChange={handleChange} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <>
                    {isAnyBBQ && (
                        <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 uppercase tracking-wide">Prestation Service</label>
                                <p className="text-xs text-neutral-500 mt-1 italic">Maîtres du feu, découpe & service à table sur place.</p>
                            </div>
                            <div className="flex bg-neutral-200/60 p-1 rounded-xl w-fit border border-neutral-200/40">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, Service_Check: "Non" }))}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${formData.Service_Check !== "Oui" ? 'bg-white text-black shadow' : 'text-neutral-500 hover:text-black'}`}
                                >
                                    Sans service
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, Service_Check: "Oui" }))}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${formData.Service_Check === "Oui" ? 'bg-black text-[#D4AF37] shadow' : 'text-neutral-500 hover:text-black'}`}
                                >
                                    Avec service (+2,5€/pers)
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className={labelStyle}>Date <span className="text-red-500">*</span></label>
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
                            <label className={labelStyle}>Convives <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="Nombre_Convives" value={formData.Nombre_Convives} onChange={handleChange} className={`${getInputStyle("Nombre_Convives")} appearance-none`}>
                                    {getInitialConvivesOptions(formData.Type_Evenement).map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    );



    return (
        <main className="min-h-screen pt-40 md:pt-48 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-0 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="bg-white shadow-2xl p-8 md:p-14 rounded-[2rem] border-t-4 border-[#D4AF37]">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">
                            {isMenusFetes ? "Menus de Fêtes 2026" : (isPlatPrepare ? "Finaliser votre Commande" : "Contactez-nous")}
                        </h1>
                        <p className="text-gray-500 font-light text-lg">
                            {isMenusFetes ? "Réveillon de Noël & Nouvel An — Réservation de votre repas" : (isPlatPrepare ? "Renseignez vos coordonnées pour valider votre commande." : "Parlons de votre prochain événement.")}
                        </p>
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
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* 1. Sélecteur de date pour les Menus de Fêtes */}
                            {isMenusFetes && (
                                <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-sm mb-10 space-y-8">
                                    <div className="flex items-start gap-3 border-b border-neutral-100 pb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-bold text-xl md:text-2xl text-black">
                                                {festiveRestrictions.isMixed ? "Dates de vos repas de fêtes" : "Date de votre repas de fête"} <span className="text-red-500">*</span>
                                            </h3>
                                            <p className="text-xs md:text-sm text-neutral-500 font-light mt-0.5">
                                                {festiveRestrictions.allowedPeriodLabel || "Sélectionnez la date de votre réveillon ou repas pour déterminer votre créneau de retrait à l'atelier."}
                                            </p>
                                        </div>
                                    </div>

                                    {festiveRestrictions.isMixed ? (
                                        <div className="space-y-8">
                                            {/* --- BLOC 1 : NOËL --- */}
                                            <div className="space-y-4 bg-[#FAF9F6] p-5 md:p-6 rounded-2xl border border-[#D4AF37]/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black text-[#D4AF37]">
                                                            🎄 Menus de Noël
                                                        </span>
                                                        <span className="text-xs font-medium text-neutral-600">
                                                            (Noël / Prestige)
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-neutral-400 font-medium italic">Choix obligatoire</span>
                                                </div>

                                                {errors.Date_Fete_Noel && (
                                                    <div className="bg-red-50 text-red-600 text-xs md:text-sm p-3 rounded-xl border border-red-200 flex items-center gap-2">
                                                        <span>⚠️</span> {errors.Date_Fete_Noel}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                    {NOEL_DATE_OPTIONS.map((option) => {
                                                        const isSelected = formData.Date_Fete_Noel === option.id || formData.Date_Fete_Noel === option.dayFormatted;
                                                        return (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        Date_Fete_Noel: option.id,
                                                                        Creneau_Retrait_Noel: option.pickupWindow
                                                                    }));
                                                                    if (errors.Date_Fete_Noel) {
                                                                        setErrors(prev => {
                                                                            const newErr = { ...prev };
                                                                            delete newErr.Date_Fete_Noel;
                                                                            return newErr;
                                                                        });
                                                                    }
                                                                }}
                                                                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                                                                    isSelected
                                                                        ? "border-[#D4AF37] bg-white ring-2 ring-[#D4AF37]/50 shadow-md"
                                                                        : "border-neutral-200 bg-white/70 hover:bg-white hover:border-neutral-300"
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                                                                        {option.badge}
                                                                    </span>
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                                        isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-neutral-300 bg-white"
                                                                    }`}>
                                                                        {isSelected && <Check size={12} strokeWidth={3} />}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-serif font-bold text-neutral-900 text-base">{option.label}</h4>
                                                                    <p className="text-xs font-semibold text-[#D4AF37] mt-0.5">{option.dayFormatted}</p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {formData.Date_Fete_Noel && (
                                                    <div className="bg-white border border-[#D4AF37]/30 p-3.5 rounded-xl flex items-start gap-3 shadow-2xs">
                                                        <Clock className="text-[#D4AF37] shrink-0 mt-0.5" size={18} />
                                                        <div className="text-xs text-neutral-700">
                                                            <span className="font-bold text-neutral-900">Retrait Noël : </span>
                                                            {NOEL_DATE_OPTIONS.find(o => o.id === formData.Date_Fete_Noel || o.dayFormatted === formData.Date_Fete_Noel)?.pickupWindow || formData.Creneau_Retrait_Noel}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* --- BLOC 2 : NOUVEL AN --- */}
                                            <div className="space-y-4 bg-[#FAF9F6] p-5 md:p-6 rounded-2xl border border-[#D4AF37]/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black text-[#D4AF37]">
                                                            🍾 Menus de Nouvel An
                                                        </span>
                                                        <span className="text-xs font-medium text-neutral-600">
                                                            (Saint-Sylvestre)
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-neutral-400 font-medium italic">Choix obligatoire</span>
                                                </div>

                                                {errors.Date_Fete_NouvelAn && (
                                                    <div className="bg-red-50 text-red-600 text-xs md:text-sm p-3 rounded-xl border border-red-200 flex items-center gap-2">
                                                        <span>⚠️</span> {errors.Date_Fete_NouvelAn}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                    {NOUVEL_AN_DATE_OPTIONS.map((option) => {
                                                        const isSelected = formData.Date_Fete_NouvelAn === option.id || formData.Date_Fete_NouvelAn === option.dayFormatted;
                                                        return (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        Date_Fete_NouvelAn: option.id,
                                                                        Creneau_Retrait_NouvelAn: option.pickupWindow
                                                                    }));
                                                                    if (errors.Date_Fete_NouvelAn) {
                                                                        setErrors(prev => {
                                                                            const newErr = { ...prev };
                                                                            delete newErr.Date_Fete_NouvelAn;
                                                                            return newErr;
                                                                        });
                                                                    }
                                                                }}
                                                                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                                                                    isSelected
                                                                        ? "border-[#D4AF37] bg-white ring-2 ring-[#D4AF37]/50 shadow-md"
                                                                        : "border-neutral-200 bg-white/70 hover:bg-white hover:border-neutral-300"
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                                                                        {option.badge}
                                                                    </span>
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                                        isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-neutral-300 bg-white"
                                                                    }`}>
                                                                        {isSelected && <Check size={12} strokeWidth={3} />}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-serif font-bold text-neutral-900 text-base">{option.label}</h4>
                                                                    <p className="text-xs font-semibold text-[#D4AF37] mt-0.5">{option.dayFormatted}</p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {formData.Date_Fete_NouvelAn && (
                                                    <div className="bg-white border border-[#D4AF37]/30 p-3.5 rounded-xl flex items-start gap-3 shadow-2xs">
                                                        <Clock className="text-[#D4AF37] shrink-0 mt-0.5" size={18} />
                                                        <div className="text-xs text-neutral-700">
                                                            <span className="font-bold text-neutral-900">Retrait Nouvel An : </span>
                                                            {NOUVEL_AN_DATE_OPTIONS.find(o => o.id === formData.Date_Fete_NouvelAn || o.dayFormatted === formData.Date_Fete_NouvelAn)?.pickupWindow || formData.Creneau_Retrait_NouvelAn}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // --- CAS STANDARD (UN SEUL EVENEMENT) ---
                                        <div className="space-y-6">
                                            {errors.Date_Fete && (
                                                <div className="bg-red-50 text-red-600 text-xs md:text-sm p-3.5 rounded-xl border border-red-200 flex items-center gap-2">
                                                    <span>⚠️</span> {errors.Date_Fete}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                {FESTIVE_DATE_OPTIONS.map((option) => {
                                                    const isAllowed = festiveRestrictions.allowedOptionIds.includes(option.id);
                                                    const isSelected = formData.Date_Fete === option.id || formData.Date_Fete === option.dayFormatted;

                                                    return (
                                                        <button
                                                            key={option.id}
                                                            type="button"
                                                            disabled={!isAllowed}
                                                            onClick={() => {
                                                                if (!isAllowed) return;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    Date_Fete: option.id,
                                                                    Date: option.dayFormatted,
                                                                    Creneau_Retrait: option.pickupWindow
                                                                }));
                                                                if (errors.Date_Fete) {
                                                                    setErrors(prev => {
                                                                        const newErr = { ...prev };
                                                                        delete newErr.Date_Fete;
                                                                        return newErr;
                                                                    });
                                                                }
                                                            }}
                                                            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                                                                !isAllowed
                                                                    ? "border-neutral-200 bg-neutral-100/70 opacity-40 cursor-not-allowed"
                                                                    : isSelected
                                                                    ? "border-[#D4AF37] bg-[#D4AF37]/10 ring-2 ring-[#D4AF37]/40 shadow-md"
                                                                    : "border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300"
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                                                        !isAllowed ? "bg-neutral-300 text-neutral-600" : "bg-black text-[#D4AF37]"
                                                                    }`}>
                                                                        {option.badge}
                                                                    </span>
                                                                    {!isAllowed && (
                                                                        <span className="text-[10px] text-neutral-500 font-medium italic">Incompatible</span>
                                                                    )}
                                                                </div>
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                                    !isAllowed ? "border-neutral-300 bg-neutral-200" : isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-neutral-300 bg-white"
                                                                }`}>
                                                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className={`font-serif font-bold text-base ${!isAllowed ? "text-neutral-400" : "text-neutral-900"}`}>{option.label}</h4>
                                                                <p className={`text-xs font-semibold mt-0.5 ${!isAllowed ? "text-neutral-400" : "text-[#D4AF37]"}`}>{option.dayFormatted}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {formData.Date_Fete && (
                                                <div className="bg-[#FAF9F6] border border-[#D4AF37]/40 p-4 md:p-5 rounded-2xl flex items-start gap-3.5 shadow-sm">
                                                    <Clock className="text-[#D4AF37] shrink-0 mt-0.5" size={22} />
                                                    <div className="space-y-1 text-sm">
                                                        <p className="font-bold text-neutral-900">
                                                            Créneau de retrait à l'atelier :
                                                        </p>
                                                        <p className="text-neutral-700 font-medium leading-relaxed">
                                                            {FESTIVE_DATE_OPTIONS.find(o => o.id === formData.Date_Fete || o.dayFormatted === formData.Date_Fete)?.pickupWindow || formData.Creneau_Retrait}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 pt-0.5">
                                                            📍 Atelier Traiteur Compère : Rue Potay 3, 4470 Saint-Georges-sur-Meuse
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. Autres Formules personnalisées (BBQ, Buffets, etc.) */}
                            {showMenuFirst && !isPlatPrepare && (
                                <>
                                    {isAnyBBQ && renderBBQComposition()}
                                    {isPlatUnique && renderPlatUniqueFields()}
                                    {isBuffetFroid && renderBuffetFroidFields()}
                                    {isPains && renderPainsFields()}
                                    {isZakouskis && renderZakouskisFields()}
                                    {isVerrines && renderVerrinesFields()}
                                    {isCollectivite && renderCollectiviteFields()}
                                    {isBuffetChaud && renderBuffetChaudFields()}
                                    {(isBuffet || isAssociations) && !isBuffetFroid && !isPains && !isCollectivite && !isBuffetChaud && (
                                        <>
                                            <div className="bg-neutral-50 p-6 rounded-xl text-center">
                                                <p className="italic text-gray-500">Pour les buffets et associations, veuillez préciser vos choix dans le champ &quot;Dites-nous en plus&quot; ci-dessous ou nous vous recontacterons pour affiner le menu.</p>
                                            </div>
                                            {renderLogisticsOptions()}
                                        </>
                                    )}
                                </>
                            )}

                            <h3 className="text-xl font-serif text-neutral-800 mt-2 mb-6 border-b border-neutral-200 pb-2">
                                {isPlatPrepare ? "Vos coordonnées" : "Vos informations"}
                            </h3>
                            {renderContactFields()}

                            {!isPlatPrepare && (
                                <div className="group">
                                    <label className={labelStyle}>Dites-nous en plus !</label>
                                    <textarea name="details_projet" value={formData.details_projet} onChange={handleChange} className={`${getInputStyle("details_projet")} h-32 resize-y`} placeholder="Allergies, précisions, déroulement..." />
                                </div>
                            )}



                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                <input type="checkbox" name="Souhaite_etre_recontacte" id="recontact" className="w-5 h-5 text-[#D4AF37] rounded" checked={formData.Souhaite_etre_recontacte === "Oui"} onChange={handleChange} />
                                <label htmlFor="recontact" className="text-neutral-700 cursor-pointer">{isPlatPrepare ? "Je souhaite ajouter un commentaire à ma commande" : "Je souhaite être recontacté pour discuter de mon devis."}</label>
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
                                                    <th className="px-4 py-3 rounded-tl-lg">Article / Menu</th>
                                                    <th className="px-4 py-3">Date / Service</th>
                                                    <th className="px-4 py-3 text-center">Qté</th>
                                                    <th className="px-4 py-3">Détails</th>
                                                    <th className="px-4 py-3 text-right rounded-tr-lg">S/Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item, idx) => {
                                                    const isFestive = item.itemType === 'menu_fete' || item.semaineId.startsWith('menu') || item.semaineId.startsWith('fetes');
                                                    return (
                                                        <tr key={idx} className="border-b border-neutral-100 last:border-0">
                                                            <td className="px-4 py-3 font-medium text-black max-w-[220px]" title={item.nomPlat}>
                                                                {isFestive && <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold px-1.5 py-0.5 rounded mr-1.5 uppercase">Fêtes</span>}
                                                                {item.nomPlat}
                                                            </td>
                                                            <td className="px-4 py-3 capitalize text-xs md:text-sm text-[#D4AF37] font-medium">{item.badge || item.jour}</td>
                                                            <td className="px-4 py-3 text-center font-bold text-black">{item.quantitePlat}</td>
                                                            <td className="px-4 py-3 text-xs text-neutral-500">
                                                                {isFestive ? (
                                                                    item.coursesSummary && item.coursesSummary.length > 0 ? (
                                                                        <div className="space-y-0.5 max-w-[200px]">
                                                                            {item.coursesSummary.map((c, cIdx) => <div key={cIdx} className="truncate text-[11px]">• {c}</div>)}
                                                                        </div>
                                                                    ) : '-'
                                                                ) : (
                                                                    item.soupes && Object.entries(item.soupes).map(([s, q]) => q > 0 ? <div key={s} className="text-xs">{q}x {s}</div> : null)
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-bold whitespace-nowrap text-black">{item.prixTotalLigne.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30 text-center flex flex-col justify-center items-center gap-2">
                                        <p className="text-neutral-800 font-bold text-lg">Total de votre commande : {cartTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</p>
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Paiement par virement bancaire uniquement (QR Code sur la page suivante).</p>
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

                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                className="w-full bg-black text-white py-5 uppercase tracking-widest text-sm font-bold rounded-full shadow-lg hover:bg-[#D4AF37] transition-all"
                            >
                                {status === "submitting" ? "Envoi en cours..." : "Envoyer la demande"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
