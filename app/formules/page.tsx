"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Shell, Flower2, FlaskConical, LucideIcon, Check, Package, Flame } from "lucide-react";
import Link from "next/link";

// --- DATA ---

type BBQType = 'classique' | 'compose' | 'dinatoire' | 'mer' | 'vege' | 'cochon' | 'porchetta' | 'nobles';

const BBQ_OPTIONS: Record<BBQType, {
    label: string;
    composition: string[];
    description: string;
    prices: { small: string; medium: string; large: string }; // small: <25, medium: 25-250 (or similar), large: >250
    counts: { small: string; medium: string; large: string }; // thresholds text
    priceDetails?: { small?: string; medium?: string; large?: string }; // subtitle price details
    isFlatRate?: boolean; // For Cochon/Porchetta fixed price logic if needed, though structure handles it
}> = {
    classique: {
        label: "Le Classique",
        description: "L'incontournable de l'été. Des grillades savoureuses préparées avec soin.",
        composition: [
            "3 Viandes au choix (Saucisses, Merguez, Brochettes...)",
            "Assortiment de salades fraîches",
            "Pommes de terre grenailles & Pâtes",
            "Sauces maison & Pain artisanal"
        ],
        prices: { small: "17€", medium: "15€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    },
    compose: {
        label: "Le Composé",
        description: "Un menu complet avec entrées et plats pour un repas équilibré.",
        composition: [
            "2 Entrées au choix (Scampi, Saumon, Tartare...)",
            "2 Plats au choix (Côte d'agneau, Contrefilet...)",
            "Accompagnements chauds & froids à volonté"
        ],
        prices: { small: "22€", medium: "20€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    },
    dinatoire: {
        label: "Le Dînatoire",
        description: "Une formule élégante en deux services pour prendre le temps de déguster.",
        composition: [
            "1er Service à table (Lasagne, Chili, Paëlla...)",
            "2ème Service : Barbecue varié à volonté",
            "Buffet de salades & féculents"
        ],
        prices: { small: "26,50€", medium: "24€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    },
    mer: {
        label: "Fruits de Mer",
        description: "La fraîcheur de l'océan sur votre grill. Une sélection premium.",
        composition: [
            "Gambas géantes & Homard grillé",
            "Brochettes de St-Jacques & Scampis",
            "Pavé de Saumon papilloté",
            "Salades fraîcheur & Sauces citronnées"
        ],
        prices: { small: "33€", medium: "30€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    },
    vege: {
        label: "Végétarien",
        description: "Une alternative gourmande et créative 100% végétarienne.",
        composition: [
            "Halloumi grillé & Brochettes de légumes",
            "Portobellos farcis & Maïs grillé",
            "Grand buffet de salades composées",
            "Pommes de terre & Sauces végétales"
        ],
        prices: { small: "13€", medium: "11€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    },
    cochon: {
        label: "Cochon de Lait",
        description: "La pièce maîtresse de votre événement, cuite à la broche sous vos yeux.",
        composition: [
            "Cochon de lait entier rôti à la broche (300g/pers)",
            "Laqué au miel et aux épices douces",
            "Buffet complet de crudités et féculents",
            "Sauces maison"
        ],
        prices: { small: "36€", medium: "33€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 180 pers.", large: "Plus de 180 pers." }
    },
    porchetta: {
        label: "Porchetta",
        description: "Une spécialité italienne rôtie aux herbes, juteuse et parfumée.",
        composition: [
            "Porchetta artisanale rôtie (300g/pers)",
            "Marinade aux herbes fraîches et ail",
            "Accompagnements chauds (Gratin, Grenailles...)",
            "Salades variées"
        ],
        prices: { small: "26,50€", medium: "24€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 180 pers.", large: "Plus de 180 pers." }
    },
    nobles: {
        label: "Viandes Nobles",
        description: "L'excellence pour les amateurs de viandes d'exception.",
        composition: [
            "Tomahawk, Côte à l'os maturée",
            "Entrecôte Irlandaise & Black Angus",
            "Filet pur et viandes d'exception",
            "Accompagnements premium & Sauces truffées"
        ],
        prices: { small: "49,50€", medium: "45€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    }
};

const FORMULES = [
    {
        tag: "Terroir",
        title: "Le Buffet Ardennais",
        description: "Une véritable immersion dans le terroir : un assortiment généreux de charcuteries artisanales, spécialités de Liège et viandes mijotées pour une convivialité absolue.",
        price: "15€ / pers",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Croûte de pâté de chevreuil",
            "Boudin blanc de Liège & Boudin noir",
            "Duo de jambons sur griffes",
            "Pêche au thon",
            "Rosbif et Rôti de porc braisés",
            "Hure de veau",
            "Féculents et Crudités de saison"
        ],
        allergens: ["gluten", "egg", "lait", "fish", "moutarde", "celeri"],
        imageStyle: "rounded-t-2xl"
    },
    {
        tag: "BBQ & Feu de bois",
        title: "Le Barbecue sur Mesure",
        description: "Configurez votre barbecue idéal parmi nos 8 formules exclusives.",
        price: "Dès 11€ / pers", // Dynamic
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=2070&auto=format&fit=crop",
        items: [], // Dynamic
        allergens: ["fish", "crustace", "moutarde"],
        imageStyle: "rounded-t-2xl"
    },
    {
        tag: "Banquet & Mariage",
        title: "Le Buffet de Gala",
        description: "Notre offre prestige pour vos événements d'exception. Des mets délicats et raffinés pour éblouir vos convives.",
        price: "22€ / pers",
        image: "https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=1974&auto=format&fit=crop",
        items: [
            "Mousse de foie de canard au Sauternes",
            "Farandole de langoustines",
            "Saumon aux deux saveurs",
            "Terrine de Sandre au basilic & Tomates crevettes grises",
            "Viandes braisées et accompagnements raffinés"
        ],
        allergens: ["crustace", "fish", "gluten", "egg", "lait", "sulfite"],
        imageStyle: "rounded-t-2xl"
    },
    {
        tag: "Événements & Associations",
        title: "Le Buffet Associatif",
        description: "Formule conviviale en livraison seule. Idéal pour les grands groupes. Matériel et service non inclus.",
        price: "14,50€ / pers",
        image: "https://images.unsplash.com/photo-1547924475-f9e5b2931a26?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Boulets Liégeois (Sauce Lapin ou Tomate) & Frites",
            "Vol-au-vent artisanal & Frites",
            "Bar à Pâtes (Bolognaise ou Carbonara)",
            "Burgers Spécial Compère",
            "Option Végé : Grande Salade de saison & Quiche aux légumes 🌿"
        ],
        allergens: ["gluten", "egg", "lait", "celeri", "moutarde"],
        imageStyle: "rounded-t-2xl"
    }
];

type AllergenData = {
    label: string;
    image?: string;
    icon?: LucideIcon;
};

const ALLERGEN_ICONS: Record<string, AllergenData> = {
    // 10 Images
    nut: { image: "/amande.png", label: "Amande (Fruits à coque)" },
    arachide: { image: "/arachide.png", label: "Arachide" },
    celeri: { image: "/celeri.png", label: "Céleri" },
    fish: { image: "/poisson.png", label: "Poisson" },
    sesame: { image: "/sesame.png", label: "Sésame" },
    gluten: { image: "/ble.png", label: "Blé (Gluten)" },
    lait: { image: "/lait.png", label: "Lait" },
    moutarde: { image: "/moutarde.png", label: "Moutarde" },
    egg: { image: "/oeuf.png", label: "Œufs" },
    crustace: { image: "/crustace.png", label: "Crustacés" },

    // 4 Icônes Lucide
    soja: { icon: Sprout, label: "Soja" },
    mollusque: { icon: Shell, label: "Mollusques" },
    lupin: { icon: Flower2, label: "Lupin" },
    sulfite: { icon: FlaskConical, label: "Sulfites" },
};

interface FormuleType {
    tag: string;
    title: string;
    description: string;
    price: string;
    image: string;
    items: string[];
    allergens: string[];
}

export default function Formules() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <header className="text-center mb-16 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-serif text-black">Nos Formules Gourmandes</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Découvrez nos compositions pensées pour tous vos événements.
                        Du simple buffet aux plats mijotés, nous avons la formule qu&apos;il vous faut.
                    </p>
                </header>

                {/* FORMULES LIST */}
                <div className="space-y-24">
                    {FORMULES.map((formule, index) => {
                        const isAssociatif = formule.tag === "Événements & Associations";
                        return (
                            <div key={index}>
                                {isAssociatif && (
                                    <div className="py-12 flex items-center justify-center gap-6 mb-12">
                                        <div className="h-px bg-neutral-200 w-24 md:w-64"></div>
                                        <div className="flex flex-col items-center gap-2 text-neutral-400">
                                            <Package size={24} strokeWidth={1} />
                                            <span className="text-xs font-serif italic tracking-widest uppercase">Offre Livraison Seule</span>
                                        </div>
                                        <div className="h-px bg-neutral-200 w-24 md:w-64"></div>
                                    </div>
                                )}
                                <FormuleSection formule={formule} index={index} />
                            </div>
                        );
                    })}
                </div>

                {/* BOTTOM LEGEND */}
                <div className="mt-20 border-t border-neutral-200 pt-16">
                    <p className="text-center text-neutral-600 italic mb-8">
                        Tous nos plats peuvent contenir des traces d'autres allergènes. Reportez-vous à la légende ci-dessous :
                    </p>

                    <div className="text-center">
                        <p className="text-sm font-serif italic text-neutral-500 mb-6">Légende des allergènes :</p>
                        <div className="flex flex-wrap justify-center gap-8">
                            {Object.entries(ALLERGEN_ICONS).map(([key, data]) => (
                                <div key={key} className="flex flex-col items-center gap-2">
                                    <div className="h-6 flex items-center justify-center">
                                        {data.image ? (
                                            <div className="relative w-6 h-6">
                                                <Image
                                                    src={data.image}
                                                    alt={data.label}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            data.icon && <data.icon size={24} className="text-neutral-700" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <span className="text-neutral-700 text-xs font-medium">{data.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}

function FormuleSection({ formule, index }: { formule: FormuleType, index: number }) {
    const isEven = index % 2 === 0;
    const isAssociatif = formule.tag === "Événements & Associations";
    const isBBQ = formule.tag === "BBQ & Feu de bois";

    // BBQ State
    const [selectedBBQ, setSelectedBBQ] = useState<BBQType>('classique');
    const currentBBQ = BBQ_OPTIONS[selectedBBQ];

    return (
        <motion.section
            id={isAssociatif ? "associatif" : undefined}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-start scroll-mt-32
                ${isAssociatif ? 'py-12 px-6 md:px-12 bg-neutral-50 border border-[#D4AF37]/20 rounded-2xl' : ''}`}
        >
            {/* IMAGE SIDE */}
            <div className="w-full md:w-1/2 relative h-[280px] md:h-[500px] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl group">
                <Image
                    src={formule.image}
                    alt={formule.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                {/* Image Tag Overlay */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 shadow-sm border-l-4 border-[#D4AF37]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">{formule.tag}</span>
                </div>
            </div>

            {/* CONTENT SIDE */}
            <div className="w-full md:w-1/2 flex-1 space-y-6 md:space-y-8 mt-6 md:mt-0 relative z-10">
                <div className="flex flex-col gap-2">
                    <span className="text-[#D4AF37] font-sans text-sm font-bold uppercase tracking-widest md:hidden">{formule.tag}</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-black">{isBBQ ? currentBBQ.label : formule.title}</h2>
                    {isAssociatif && (
                        <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                            Livraison Seule
                        </div>
                    )}
                </div>
                <div className="w-20 h-1 bg-neutral-300" />

                <p className="text-gray-600 leading-relaxed text-lg">
                    {isBBQ ? currentBBQ.description : formule.description}
                </p>

                {/* --- DYNAMIC BBQ SELECTOR --- */}
                {isBBQ && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {Object.entries(BBQ_OPTIONS).map(([key, data]) => {
                            const isSelected = selectedBBQ === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedBBQ(key as BBQType)}
                                    className={`
                                        px-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300
                                        flex flex-col items-center justify-center gap-1 text-center border
                                        ${isSelected
                                            ? 'bg-black text-[#D4AF37] border-black shadow-lg scale-105'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <Flame size={16} className={isSelected ? 'text-[#D4AF37]' : 'text-gray-300'} />
                                    {data.label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* COMPOSITION */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-l-4 border-neutral-300">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                        {isAssociatif ? "Choix du Plat Unique" : "Composition"}
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                        {(isBBQ ? currentBBQ.composition : formule.items).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-neutral-700">
                                <Check size={16} className="text-[#D4AF37] flex-shrink-0 mt-1" strokeWidth={3} />
                                <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ALLERGENS FOR THIS ITEM */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="uppercase tracking-widest text-xs font-bold">Contient :</span>
                    <div className="flex gap-3">
                        {formule.allergens.map((alg) => {
                            const data = ALLERGEN_ICONS[alg];
                            if (!data) return null;

                            return (
                                <div key={alg} className="flex items-center gap-1.5" title={data.label}>
                                    {data.image ? (
                                        <Image
                                            src={data.image}
                                            alt={data.label}
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    ) : (
                                        data.icon && <data.icon size={20} strokeWidth={1.5} className="text-neutral-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* PRICING LOGIC */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <PricingBlock
                        price={formule.price}
                        tag={formule.tag}
                        selectedBBQ={selectedBBQ}
                    />
                </div>
            </div>
        </motion.section>
    );
}

function PricingBlock({ price, tag, selectedBBQ }: { price: string, tag: string, selectedBBQ?: BBQType }) {
    // If it's the BBQ menu, show the 3 specific options with dynamic prices
    if (tag === "BBQ & Feu de bois" && selectedBBQ) {
        const data = BBQ_OPTIONS[selectedBBQ];
        const menuParam = `bbq_${selectedBBQ}`;

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Option 1: Small Group */}
                <Link
                    href={`/contact?menu=${menuParam}&count=3&convives=${data.counts.small}`}
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">{data.counts.small}</span>
                    <span className="text-lg font-bold font-serif text-gray-900">{data.prices.small}</span>
                    <span className="text-[10px] text-gray-400">/ pers</span>
                </Link>

                {/* Option 2: Medium Group (Highlighted) */}
                <Link
                    href={`/contact?menu=${menuParam}&count=4&convives=${data.counts.medium}`}
                    className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden hover:scale-[1.07] transition-transform cursor-pointer"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">{data.counts.medium}</span>
                    <span className="text-2xl font-bold font-serif">{data.prices.medium}</span>
                    <span className="text-[10px] text-gray-300">/ pers</span>
                </Link>

                {/* Option 3: Large Group */}
                <Link
                    href={`/contact?menu=${menuParam}&count=5&convives=${data.counts.large}`}
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">{data.counts.large}</span>
                    <span className="text-sm font-medium text-gray-900">{data.prices.large}</span>
                    <span className="text-[10px] text-gray-400">(Tarifs dégressifs)</span>
                </Link>
            </div>
        );
    }

    // Logic for Associations
    if (tag === "Événements & Associations") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Option 1: < 50 */}
                <Link
                    href="/contact?menu=plat_unique&convives=moins_50"
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Moins de 50 pers.</span>
                    <span className="text-sm font-medium text-gray-900">1 Plat Unique</span>
                    <span className="text-xs text-gray-400 mt-1">(Sur devis)</span>
                </Link>

                {/* Option 2: 50 - 100 */}
                <Link
                    href="/contact?menu=plat_unique&convives=50_100"
                    className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden hover:scale-[1.07] transition-transform cursor-pointer"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">50 à 100 pers.</span>
                    <span className="text-lg font-bold font-serif">1 Plat Unique</span>
                    <span className="text-xs text-gray-300 mt-1">(14,50€ / pers)</span>
                </Link>

                {/* Option 3: > 100 */}
                <Link
                    href="/contact?menu=plat_unique&convives=plus_100"
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Plus de 100 pers.</span>
                    <span className="text-sm font-medium text-gray-900">1 Plat Unique</span>
                    <span className="text-xs text-gray-400 mt-1">(Tarifs dégressifs)</span>
                </Link>
            </div>
        );
    }

    // Logic for Ardennais (Terroir)
    if (tag === "Terroir") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <Link
                    href="/contact?menu=ardennais&count=4&convives=Moins de 40"
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Moins de 40 pers.</span>
                    <span className="text-sm font-medium text-gray-900">4 Choix à composer</span>
                </Link>

                <Link
                    href="/contact?menu=ardennais&count=5&convives=40 et plus"
                    className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden hover:scale-[1.07] transition-transform cursor-pointer"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">40 pers. et plus</span>
                    <span className="text-lg font-bold font-serif">5 Choix à composer</span>
                </Link>
            </div>
        );
    }

    // Logic for Gala (Banquet & Mariage)
    if (tag === "Banquet & Mariage") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <Link
                    href="/contact?menu=gala&count=4&convives=Moins de 40"
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Moins de 40 pers.</span>
                    <span className="text-sm font-medium text-gray-900">4 Choix à composer</span>
                </Link>

                <Link
                    href="/contact?menu=gala&count=5&convives=40 et plus"
                    className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden hover:scale-[1.07] transition-transform cursor-pointer"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">40 pers. et plus</span>
                    <span className="text-lg font-bold font-serif">5 Choix à composer</span>
                </Link>
            </div>
        );
    }

    // Check if price contains a number
    const hasPrice = /\d/.test(price);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* < 20 */}
            <Link
                href="/contact?convives=Moins de 20"
                className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
            >
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Moins de 20 pers.</span>
                <span className="text-sm font-medium text-gray-900">Sur devis</span>
                <span className="text-[10px] text-gray-400">(Nous contacter)</span>
            </Link>

            {/* 20 - 100 */}
            <Link
                href="/contact"
                className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden hover:scale-[1.07] transition-transform cursor-pointer"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">20 à 100 pers.</span>
                <span className="text-lg font-bold font-serif">{hasPrice ? price : "Sur devis"}</span>
            </Link>

            {/* > 100 */}
            <Link
                href="/contact?convives=Plus de 100"
                className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
            >
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Plus de 100 pers.</span>
                <span className="text-sm font-medium text-gray-900">Sur devis</span>
                <span className="text-[10px] text-gray-400">(Tarifs dégressifs)</span>
            </Link>
        </div>
    );
}
