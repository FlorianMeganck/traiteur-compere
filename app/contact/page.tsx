"use client";

import { useState, useLayoutEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Leaf, Check } from "lucide-react";

export default function Contact() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ContactForm />
        </Suspense>
    );
}

// --- DATA CONSTANTS ---

const VIANDES_BASE = [
    "Saucisse de Campagne", "Saucisse BBQ", "Saucisse Italienne", "Saucisse au Fromage",
    "Chipolata aux Herbes", "Chipolata au Poivre", "Chipolata Nature",
    "Merguez", "Boudin blanc grillé",
    "Brochette de Bœuf marinée", "Brochette de Porc marinée", "Brochette de Volaille", "Brochette de légumes 🌿",
    "Braisade de Bœuf", "Braisade de Porc",
    "Filet de poulet mariné", "Lard mariné", "Pilon de poulet"
];

const VIANDES_SUPPL_ONLY = [
    "Magret de Canard (+2€)",
    "Spare Ribs (+1€)",
    "Côte d'Agneau (+1€)",
    "Gigot d'agneau (+2€)",
    "Viande Extra (Bœuf/Veau...) (+3€)"
];

const BBQ_PRICES: Record<string, { low: number; mid: number; high: number }> = {
    classique: { low: 17, mid: 15, high: 0 },
    compose: { low: 22, mid: 20, high: 0 },
    dinatoire: { low: 26.50, mid: 24, high: 0 },
    mer: { low: 33, mid: 30, high: 0 },
    vege: { low: 13, mid: 11, high: 0 },
    cochon: { low: 36, mid: 33, high: 0 },
    porchetta: { low: 26.50, mid: 24, high: 0 },
    nobles: { low: 49.50, mid: 45, high: 0 },
};

const ENTREES_COMPOSE = ["Coquille St-Jacques", "Brochette de Scampi", "Pavé de Saumon", "Salade Melon/Feta 🌿", "Burrata & Tomates Cerises 🌿", "Gaspacho Andalou 🌿", "Mini-brochettes Tomate/Mozza 🌿", "Tartare de Bœuf", "Tartare de Saumon"];
const PLATS_COMPOSE = ["Côte d'agneau", "Contrefilet", "Merguez", "Chipolata", "Brochette de bœuf", "Pavé de Saumon grillé"];

const SERVICES_DINATOIRE = ["Lasagne Maison", "Chili con Carne", "Tortellini Ricotta/Epinards 🌿", "Paëlla Royale", "Hachis Parmentier"];

const FRUITS_MER = ["Brochette de Scampi", "Calamar à la romaine", "Coquille St-Jacques", "Pavé de Saumon", "Pince de Crabe", "Moules gratinées", "Poulpe grillé", "Demi-Homard (+supp)", "Gambas géantes"];

const NOBLES = ["Tomahawk", "Côte à l'os", "Entrecôte Irlandaise", "Entrecôte Simmental", "Entrecôte Black Angus", "Filet Pur"];

const VEGE = ["Halloumi grillé", "Brochette de légumes", "Maïs grillé", "Steak de Chou-fleur", "Portobello farci", "Tofu mariné", "Tranche d'Ananas grillée"];

const SIDES_COLD = ["Salade de Pâtes Pesto 🌿", "Salade de Pâtes Curry 🌿", "Salade Grecque (Feta/Olives) 🌿", "Taboulé Oriental 🌿", "Tomate Mozza Di Bufala 🌿", "Salade de Pomme de Terre (Mayonnaise) 🌿", "Salade de Pomme de Terre (Vinaigrette) 🌿", "Carottes Râpées (Citron) 🌿", "Céleri Râpé & Pommes 🌿", "Concombre à la crème 🌿", "Salade de chou blanc 🌿"];
const SIDES_HOT = ["Pomme de terre en chemise 🌿", "Gratin Dauphinois 🌿", "Grenailles au Romarin 🌿", "Riz aux petits légumes 🌿", "Pâtes à l'italienne 🌿"];

// Legacy/Other Menus
const ITEMS_ARDENNAIS = ["Croûte de pâté de chevreuil", "Boudin blanc de Liège", "Boudin noir", "Jambon d'Ardenne", "Pêche au thon", "Rosbif braisé", "Rôti de porc braisé", "Hure de veau", "Feuilleté de légumes de saison 🌿", "Quiche aux légumes 🌿"];
const ITEMS_GALA = ["Mousse de foie de canard", "Saumon en belle-vue", "Farandole de langoustines", "Tomates aux crevettes grises", "Terrine de Sandre", "Jambon sur griffe", "Viande braisée", "Feuilleté de légumes de saison 🌿", "Terrine de légumes 🌿"];
const ITEMS_ASSOCIATIONS = ["Boulets Liégeois (Sauce Lapin)", "Boulets Liégeois (Sauce Tomate)", "Vol-au-vent artisanal", "Pâtes Bolognaise", "Pâtes Carbonara", "Burgers Spécial Compère", "Option Végé : Grande Salade & Quiche 🌿"];

// OPTIONS
const OPTIONS_STANDARD = ["Moins de 20", "20 à 50", "50 à 100", "Plus de 100"];
const OPTIONS_BBQ = ["Moins de 25", "25 à 250", "Plus de 250"]; // Matches new Formules logic roughly
const OPTIONS_COCHON = ["Moins de 25", "25 à 180", "Plus de 180"]; // Specific for Cochon/Porchetta
const OPTIONS_BUFFET = ["Moins de 40", "40 et plus"];
const OPTIONS_ASSOCIATIONS = ["Moins de 50", "50 à 100", "Plus de 100"];

// --- VALIDATION HELPERS ---

const getConvivesMax = (str: string): number => {
    if (!str) return 0;
    if (str.includes("Plus de")) return 9999;
    const matches = str.match(/\d+/g);
    if (!matches) return 0;
    return Math.max(...matches.map(Number));
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

// ... component starts ...

function ContactForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- MENU CONTEXT ---
    const menuParam = searchParams.get('menu');

    // BBQ Types
    const isBBQClassique = menuParam === 'bbq_classique';
    const isBBQCompose = menuParam === 'bbq_compose';
    const isBBQDinatoire = menuParam === 'bbq_dinatoire';
    const isBBQMer = menuParam === 'bbq_mer';
    const isBBQVege = menuParam === 'bbq_vege';
    const isBBQCochon = menuParam === 'bbq_cochon';
    const isBBQPorchetta = menuParam === 'bbq_porchetta';
    const isBBQNobles = menuParam === 'bbq_nobles';

    const isAnyBBQ = menuParam?.startsWith('bbq_');
    const isCochonOrPorchetta = isBBQCochon || isBBQPorchetta;

    // Other Menus
    const isArdennais = menuParam === 'ardennais';
    const isGala = menuParam === 'gala';
    const isAssociations = menuParam === 'associations';
    const isBuffet = isArdennais || isGala;

    const isCustomMode = isAnyBBQ || isBuffet || isAssociations;
    const showMenuFirst = isCustomMode;

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
        Nombre_Convives: isCochonOrPorchetta ? OPTIONS_COCHON[0] : (isAnyBBQ ? OPTIONS_BBQ[0] : (isBuffet ? OPTIONS_BUFFET[0] : (isAssociations ? OPTIONS_ASSOCIATIONS[0] : OPTIONS_STANDARD[0]))),
        details_projet: "",
        Souhaite_etre_recontacte: "Non",

        // Dynamic Fields
        // BBQ Standard / Nobles / Vege / Mer (3 choices usually)
        Viande_1: "",
        Viande_2: "",
        Viande_3: "",

        // Compose (2 Entrées + 2 Plats)
        compose_entree_1: "",
        compose_entree_2: "",
        compose_plat_1: "",
        compose_plat_2: "",

        // Dinatoire (1 Service + BBQ selection)
        dinatoire_service_1: "",
        dinatoire_service_2: "",
        // dinatoire bbq choices reuse Viande_1 & 2

        // Supplements Cascade
        Supplement_Viande_1: "",
        Supplement_Viande_2: "",
        Supplement_Viande_3: "",

        // Accompaniments
        Accompagnement_Froid_1: "",
        Accompagnement_Froid_2: "",
        Accompagnement_Froid_3: "",
        Accompagnement_Chaud: "",
        Accompagnement_Chaud_Supplement: "",
        Accompagnement_Chaud_Supplement_Check: "Non",

        // Buffet / Assoc Legacy
        plat_1: "",
        plat_2: "",
        plat_3: "",
        plat_4: "",
        plat_5: "",
        plat_6: "",
        salade_1: "",
        salade_2: ""
    });

    // --- PRICING ENGINE ---

    // Derived State for Price
    const getPriceTier = (countStr: string): 'low' | 'mid' | 'high' => {
        if (!countStr) return 'high'; // Default if empty
        if (countStr.includes("Moins de 25")) return 'low'; // < 25 -> Higher Base Price
        if (countStr.includes("Moins de 20")) return 'high'; // Standard ? NO, usually "on quote"
        if (countStr.includes("Plus de")) return 'high'; // > 250 -> Devis (0)
        return 'mid'; // 25 - 250 -> Standard Price
    };

    const calculateTotal = () => {
        if (!isAnyBBQ) return 0;

        // 1. Base Price
        const bbqType = menuParam?.replace('bbq_', '') || 'classique';
        const priceData = BBQ_PRICES[bbqType];
        if (!priceData) return 0;

        const tier = getPriceTier(formData.Nombre_Convives);
        let base = priceData[tier];

        // If base is 0, it means "Sur Devis" (High tier / > 250)
        if (base === 0) return -1; // -1 signals "Sur Devis" specifically

        // 2. Supplements
        let supplements = 0;
        const suppFields = [formData.Supplement_Viande_1, formData.Supplement_Viande_2, formData.Supplement_Viande_3];
        suppFields.forEach(field => {
            if (field) {
                const match = field.match(/\+(\d+)€/);
                if (match) supplements += parseInt(match[1], 10);
            }
        });

        // 3. Extra Hot Side
        if (formData.Accompagnement_Chaud_Supplement_Check === "Oui" && formData.Accompagnement_Chaud_Supplement) {
            supplements += 1;
        }

        return base + supplements;
    };

    const totalPrice = calculateTotal();

    // Helper to get needed list based on menu
    const getBBQList = () => {
        if (isBBQClassique) return VIANDES_BASE;
        if (isBBQMer) return FRUITS_MER;
        if (isBBQVege) return VEGE;
        if (isBBQNobles) return NOBLES;
        if (isBBQDinatoire) return VIANDES_BASE; // BBQ part of Dinatoire
        return VIANDES_BASE;
    };

    const getInitialConvivesOptions = () => {
        if (isCochonOrPorchetta) return OPTIONS_COCHON;
        if (isAnyBBQ) return OPTIONS_BBQ;
        if (isBuffet) return OPTIONS_BUFFET;
        if (isAssociations) return OPTIONS_ASSOCIATIONS;
        return OPTIONS_STANDARD;
    };

    // EFFECT: Handle URL params
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const menuParam = searchParams.get('menu');
        const convivesParam = searchParams.get('convives');

        setFormData(prev => {
            const newData = { ...prev };

            // 1. Pré-sélection du type d'événement / Menu
            if (menuParam) {
                if (menuParam.startsWith('bbq_')) {
                    const type = menuParam.replace('bbq_', '');
                    newData.Type_Evenement = `Barbecue ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                } else if (menuParam === 'ardennais') {
                    newData.Type_Evenement = 'Buffet Ardennais';
                } else if (menuParam === 'gala') {
                    newData.Type_Evenement = 'Buffet de Gala';
                } else if (menuParam === 'associations') {
                    newData.Type_Evenement = 'Associations';
                }
            }

            // 2. Pré-sélection du Nombre de Convives (NOUVEAU)
            if (convivesParam) {
                // Nettoyage de la chaîne (ex: "25 à 250 pers." -> "25 a 250")
                const safeParam = decodeURIComponent(convivesParam).toLowerCase();

                // Détection intelligente selon les mots-clés
                if (safeParam.includes('moins') && (safeParam.includes('20') || safeParam.includes('25'))) {
                    // Check specific menus restrictions first
                    if (isCochonOrPorchetta) newData.Nombre_Convives = "Moins de 25";
                    else if (isAnyBBQ) newData.Nombre_Convives = "Moins de 25";
                    else if (isAssociations) newData.Nombre_Convives = "Moins de 50"; // Fallback to lowest
                    else if (isBuffet) newData.Nombre_Convives = "Moins de 40";
                    else newData.Nombre_Convives = "Moins de 20";
                } else if (safeParam.includes('plus') && safeParam.includes('250')) {
                    newData.Nombre_Convives = "Plus de 250";
                } else if (safeParam.includes('plus') && safeParam.includes('180')) {
                    newData.Nombre_Convives = "Plus de 180";
                } else if (safeParam.includes('plus') && safeParam.includes('100')) {
                    newData.Nombre_Convives = "Plus de 100";
                } else if (safeParam.includes('25') && safeParam.includes('180')) {
                    newData.Nombre_Convives = "25 à 180";
                } else if (safeParam.includes('25') && safeParam.includes('250')) {
                    newData.Nombre_Convives = "25 à 250";
                } else if (safeParam.includes('50') && safeParam.includes('100')) {
                    newData.Nombre_Convives = "50 à 100";
                } else if (safeParam.includes('20') && safeParam.includes('50')) {
                    newData.Nombre_Convives = "20 à 50";
                } else {
                    const opts = getInitialConvivesOptions();
                    if (opts.includes(convivesParam)) {
                        // Direct match fallback
                        newData.Nombre_Convives = convivesParam;
                    }
                }
            }

            return newData;
        });
    }, [searchParams, isCochonOrPorchetta, isAnyBBQ, isBuffet, isAssociations]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked ? "Oui" : "Non",
                ...(name === "Societe" && !checked ? { Nom_Societe: "" } : {}),
                ...(name === "Accompagnement_Chaud_Supplement_Check" && !checked ? { Accompagnement_Chaud_Supplement: "" } : {})
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
                        formatted = cleanVal.slice(0, 2) + ' ' + cleanVal.slice(2).match(/.{1,3}/g)?.join(' ')?.replace(/(.{3}) (.{2})$/, "$1 $2");
                        // The above regex replace is a simplified attempt, let's stick to simple grouping for stability or just standard 2 groups
                        // Let's use a simpler approach used in previous reliable versions if possible.
                        // Actually, standard Belgium fixed is 0Z XXX XX XX or 0ZZ XX XX XX. 
                        // Let's split 2 / 3 / 2 / 2 for fixed (9 digits total: 02 123 45 67)
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
        if (!formData.Date.trim()) newErrors.Date = "Requis";
        if (!formData.Nombre_Convives.trim()) newErrors.Nombre_Convives = "Requis";

        // Dynamic BBQ Validation
        if (isAnyBBQ) {
            if (isCochonOrPorchetta) {
                // No specific dynamic fields required for these
            } else if (isBBQCompose) {
                if (!formData.compose_entree_1) newErrors.compose_entree_1 = "Requis";
                if (!formData.compose_entree_2) newErrors.compose_entree_2 = "Requis";
                if (!formData.compose_plat_1) newErrors.compose_plat_1 = "Requis";
                if (!formData.compose_plat_2) newErrors.compose_plat_2 = "Requis";
            } else if (isBBQDinatoire) {
                if (!formData.dinatoire_service_1) newErrors.dinatoire_service_1 = "Requis";
                if (!formData.dinatoire_service_2) newErrors.dinatoire_service_2 = "Requis";
                if (!formData.Viande_1) newErrors.Viande_1 = "Requis";
                if (!formData.Viande_2) newErrors.Viande_2 = "Requis";
            } else {
                // Classique, Mer, Vege, Nobles (Standard 3 choices)
                if (!formData.Viande_1) newErrors.Viande_1 = "Requis";
                if (!formData.Viande_2) newErrors.Viande_2 = "Requis";
                if (!formData.Viande_3) newErrors.Viande_3 = "Requis";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
        const isSurDevis = isCochonOrPorchetta
            ? getConvivesMax(formData.Nombre_Convives) > 180
            : getConvivesMax(formData.Nombre_Convives) > 250;
        const finalPriceStr = (isSurDevis || totalPrice === -1) ? "SUR DEVIS" : `${totalPrice}€ / pers`;

        // Formatage propre du nom de la formule (ex: "bbq_classique" -> "Barbecue Classique")
        const formatFormulaName = (rawName: string | null) => {
            if (!rawName) return "Sur mesure / Non spécifié";
            const name = rawName.replace('bbq_', '').replace(/_/g, ' ');
            return `Barbecue ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        };

        // 3. Construction du Payload Web3Forms (Propre pour le Web, Visuel pour le Mail)
        const payload = {
            access_key: "32511cd2-dc66-49b5-8c6f-12a73315f644",
            subject: `Nouvelle demande : ${formData.Nom} ${formData.Prenom}`,
            from_name: "Site Traiteur Compère",

            // DÉTAILS ÉVÉNEMENT
            "📋 Formule Choisie": formatFormulaName(menuParam),
            "💶 Prix Estimé": finalPriceStr,
            "📅 Date de l'événement": formData.Date,
            "👥 Nombre de convives": formData.Nombre_Convives,

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
            // @ts-ignore
            ...(formData.Viande_4 && { "🥩 Plat / Viande 4": formData.Viande_4 }),
            // @ts-ignore
            ...(formData.Viande_5 && { "🥩 Plat / Viande 5": formData.Viande_5 }),

            // SUPPLÉMENTS
            ...(formData.Supplement_Viande_1 && { "⭐ Supplément Viande 1": formData.Supplement_Viande_1 }),
            ...(formData.Supplement_Viande_2 && { "⭐ Supplément Viande 2": formData.Supplement_Viande_2 }),
            ...(formData.Supplement_Viande_3 && { "⭐ Supplément Viande 3": formData.Supplement_Viande_3 }),

            // ACCOMPAGNEMENTS
            ...(formData.Accompagnement_Froid_1 && { "🥗 Accompagnement Froid 1": formData.Accompagnement_Froid_1 }),
            ...(formData.Accompagnement_Froid_2 && { "🥗 Accompagnement Froid 2": formData.Accompagnement_Froid_2 }),
            ...(formData.Accompagnement_Froid_3 && { "🥗 Accompagnement Froid 3": formData.Accompagnement_Froid_3 }),
            ...(formData.Accompagnement_Chaud_Supplement && { "🔥 Accompagnement Chaud Extra": formData.Accompagnement_Chaud_Supplement }),

            // DIVERS
            "💬 Message / Allergies": formData.details_projet || "Aucun message",
            "🔄 Souhaite être recontacté": formData.Souhaite_etre_recontacte === "Oui" ? "Oui" : "Non"
        };

        // 4. Envoi à Web3Forms
        try {
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
                // Tracking GA4
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'generate_lead', {
                        'event_category': 'Contact',
                        'event_label': 'Formulaire_Envoye_Web3Forms',
                        'value': typeof totalPrice !== 'undefined' ? totalPrice : 0,
                        'currency': 'EUR'
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
        const currentVal = (formData as any)[name];
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

    const renderBBQComposition = () => {
        // Prepare exclusion lists with NEW keys
        const bbqChoices = [formData.Viande_1, formData.Viande_2, formData.Viande_3].filter(Boolean);
        const suppChoices = [formData.Supplement_Viande_1, formData.Supplement_Viande_2, formData.Supplement_Viande_3].filter(Boolean);
        const composeEntreeChoices = [formData.compose_entree_1, formData.compose_entree_2].filter(Boolean);
        const composePlatChoices = [formData.compose_plat_1, formData.compose_plat_2].filter(Boolean);
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
                            Note : 100g de viande par personne/choix.
                        </p>
                        <Link href="/allergenes" target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-widest border border-[#D4AF37]/30 px-4 py-2 rounded-full hover:bg-[#D4AF37]/10 transition-colors">
                            <span>ℹ️ Voir le détail des allergènes par produit</span>
                        </Link>
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
                            {renderDropdown("Entrée 1", "compose_entree_1", ENTREES_COMPOSE, composeEntreeChoices)}
                            {renderDropdown("Entrée 2", "compose_entree_2", ENTREES_COMPOSE, composeEntreeChoices)}
                            {renderDropdown("Plat 1", "compose_plat_1", PLATS_COMPOSE, composePlatChoices)}
                            {renderDropdown("Plat 2", "compose_plat_2", PLATS_COMPOSE, composePlatChoices)}
                        </div>
                    )}

                    {isBBQDinatoire && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderDropdown("1er Service (Plat 1)", "dinatoire_service_1", SERVICES_DINATOIRE, dinatoireServiceChoices)}
                            {renderDropdown("1er Service (Plat 2)", "dinatoire_service_2", SERVICES_DINATOIRE, dinatoireServiceChoices)}
                            {renderDropdown("2ème Service (BBQ Choix 1)", "Viande_1", getBBQList(), bbqChoices)}
                            {renderDropdown("2ème Service (BBQ Choix 2)", "Viande_2", getBBQList(), bbqChoices)}
                        </div>
                    )}

                    {!isCochonOrPorchetta && !isBBQCompose && !isBBQDinatoire && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {renderDropdown("Choix 1", "Viande_1", getBBQList(), bbqChoices)}
                            {renderDropdown("Choix 2", "Viande_2", getBBQList(), bbqChoices)}
                            {renderDropdown("Choix 3", "Viande_3", getBBQList(), bbqChoices)}
                        </div>
                    )}
                </div>

                {/* SUPPLEMENTS CASCADE */}
                <div className="space-y-6">
                    <h3 className="text-lg font-serif text-neutral-800 font-bold border-b border-neutral-200 pb-2">Suppléments Viandes (Payants)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {renderDropdown("Supplément Viande 1", "Supplement_Viande_1", VIANDES_SUPPL_ONLY, suppChoices)}
                        {(formData.Supplement_Viande_1 !== "") && renderDropdown("Supplément Viande 2", "Supplement_Viande_2", VIANDES_SUPPL_ONLY, suppChoices)}
                        {(formData.Supplement_Viande_2 !== "") && renderDropdown("Supplément Viande 3", "Supplement_Viande_3", VIANDES_SUPPL_ONLY, suppChoices)}
                    </div>
                </div>

                {/* ACCOMPAGNEMENTS */}
                <div className="space-y-6">
                    <h3 className="text-lg font-serif text-neutral-800 font-bold border-b border-neutral-200 pb-2">Accompagnements</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Froids (3 Choix)</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {renderDropdown("Salade Froide 1", "Accompagnement_Froid_1", SIDES_COLD, froidChoices)}
                                {renderDropdown("Salade Froide 2", "Accompagnement_Froid_2", SIDES_COLD, froidChoices)}
                                {renderDropdown("Salade Froide 3", "Accompagnement_Froid_3", SIDES_COLD, froidChoices)}
                            </div>
                        </div>

                        <div className="md:col-span-3 border-t border-dashed border-neutral-200 pt-6"></div>

                        <div className="md:col-span-1">
                            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Chauds</label>
                            {renderDropdown("Accomp. Chaud Inclus", "Accompagnement_Chaud", SIDES_HOT)}
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-col justify-end">
                            <div className="bg-neutral-50/50 p-5 rounded-2xl border border-neutral-200 hover:border-[#D4AF37]/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="Accompagnement_Chaud_Supplement_Check"
                                        id="Accompagnement_Chaud_Supplement_Check"
                                        className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                                        checked={formData.Accompagnement_Chaud_Supplement_Check === "Oui"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="Accompagnement_Chaud_Supplement_Check" className="text-neutral-700 font-medium cursor-pointer select-none">
                                        Ajouter un accompagnement chaud supplémentaire (+1€ / pers)
                                    </label>
                                </div>
                                <AnimatePresence>
                                    {formData.Accompagnement_Chaud_Supplement_Check === "Oui" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="relative">
                                                <select
                                                    name="Accompagnement_Chaud_Supplement"
                                                    value={formData.Accompagnement_Chaud_Supplement}
                                                    onChange={handleChange}
                                                    className={getInputStyle("Accompagnement_Chaud_Supplement")}
                                                >
                                                    <option value="">Faites votre choix...</option>
                                                    {SIDES_HOT.map((c) => (
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
                    </div>
                </div>

                {/* PRICE DISPLAY MOVED TO BOTTOM */}
                <div className={`transition-all duration-300 border-t border-[#D4AF37]/30 pt-8 mt-8 ${totalPrice !== 0 ? "opacity-100" : "opacity-50"}`}>
                    <div className="bg-black text-[#D4AF37] p-6 rounded-xl shadow-xl flex items-center justify-between border border-[#D4AF37]/50 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform">
                        <span className="text-sm font-bold uppercase tracking-widest">Prix Estimatif</span>
                        <div className="text-right">
                            {totalPrice === -1 ? (
                                <span className="bg-[#D4AF37] text-black px-4 py-1 rounded font-bold text-sm tracking-widest">SUR DEVIS</span>
                            ) : (
                                <span className="text-2xl font-serif font-bold">{totalPrice > 0 ? `${totalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })}€ / pers` : "---"}</span>
                            )}
                            {totalPrice > 0 && <p className="text-xs text-[#D4AF37]/70 mt-1 font-light">Hors frais de déplacement & service</p>}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };     // Legacy renderers for Associations / Buffet can be simplified or kept similar...
    // ideally I would refactor them to use renderDropdown too but keeping logic distinct is fine.
    // For brevity in this rewrite, I'll use a simplified version for them.

    const renderContactFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                    <label className={labelStyle}>Prénom <span className="text-red-500">*</span></label>
                    <input type="text" name="Prenom" required value={formData.Prenom} onChange={handleChange} className={getInputStyle("Prenom")} placeholder="Votre prénom" />
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
                            {getInitialConvivesOptions().map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <main className="min-h-screen pt-32 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-0 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
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

                            <h2 className="text-4xl font-serif text-neutral-900">C'est envoyé !</h2>

                            <p className="text-neutral-600 text-lg max-w-lg mx-auto leading-relaxed">
                                Merci de votre confiance. Nous avons bien reçu votre demande et reviendrons vers vous très rapidement.
                            </p>

                            <div className="pt-8">
                                <div className="inline-block bg-neutral-100 px-6 py-3 rounded-full border border-neutral-200">
                                    <p className="text-sm text-neutral-500 font-medium animate-pulse flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                        Redirection vers l'accueil dans 3 secondes...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {showMenuFirst ? (
                                <>
                                    {isAnyBBQ && renderBBQComposition()}
                                    {(isBuffet || isAssociations) && (
                                        <div className="bg-neutral-50 p-6 rounded-xl text-center">
                                            <p className="italic text-gray-500">Pour les buffets et associations, veuillez préciser vos choix dans le champ "Dites-nous en plus" ci-dessous ou nous vous recontacterons pour affiner le menu.</p>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-serif text-neutral-800 mt-10 mb-6 border-b border-neutral-200 pb-2">Vos informations</h3>
                                    {renderContactFields()}
                                </>
                            ) : (
                                <>
                                    {renderContactFields()}
                                </>
                            )}

                            <div className="group">
                                <label className={labelStyle}>Dites-nous en plus !</label>
                                <textarea name="details_projet" value={formData.details_projet} onChange={handleChange} className={`${getInputStyle("details_projet")} h-32 resize-y`} placeholder="Allergies, précisions, déroulement..." />
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                <input type="checkbox" name="Souhaite_etre_recontacte" id="recontact" className="w-5 h-5 text-[#D4AF37] rounded" checked={formData.Souhaite_etre_recontacte === "Oui"} onChange={handleChange} />
                                <label htmlFor="recontact" className="text-neutral-700 cursor-pointer">Je souhaite être recontacté pour discuter de mon devis.</label>
                            </div>

                            <button type="submit" disabled={status === "submitting"} className="w-full bg-black text-white py-5 uppercase tracking-widest text-sm font-bold rounded-full shadow-lg hover:bg-[#D4AF37] transition-all">
                                {status === "submitting" ? "Envoi en cours..." : "Envoyer la demande"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
