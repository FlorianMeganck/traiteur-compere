"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Shell, Flower2, FlaskConical, LucideIcon, Check, Package, Flame } from "lucide-react";
import Link from "next/link";

// --- DATA ---

type BBQType = 'classique' | 'compose' | 'dinatoire' | 'mer' | 'vegetarien' | 'cochon' | 'porchetta' | 'nobles';

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
        label: "Barbecue Classique",
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
        label: "Barbecue Composé",
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
        label: "Barbecue Dînatoire",
        description: "Une formule élégante en deux services pour prendre le temps de déguster.",
        composition: [
            "1er Service à table (Lasagne, Chili, Paëlla...)",
            "2ème Service : Barbecue varié à volonté",
            "Buffet de salades & féculents"
        ],
        prices: { small: "26,50€", medium: "24,50€", large: "Sur devis" },
        counts: { small: "Moins de 25 pers.", medium: "25 à 250 pers.", large: "Plus de 250 pers." }
    },
    mer: {
        label: "Barbecue Fruits de mer",
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
    vegetarien: {
        label: "Barbecue Végétarien",
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

type BuffetFroidType = 'campagnard' | 'ardenais' | 'reception' | 'gala';

const BUFFETS_FROIDS_OPTIONS: Record<BuffetFroidType, {
    label: string;
    id: string;
    description: string;
    composition: string[];
    basePrice: number;
}> = {
    campagnard: {
        label: "Campagnard",
        id: "buffet_campagnard",
        description: "Un assortiment rustique et généreux, parfait pour une ambiance conviviale.",
        composition: [
            "Assortiment de charcuteries artisanales",
            "Pâté de campagne et cornichons",
            "Salades de pommes de terre",
            "Crudités variées et œuf dur"
        ],
        basePrice: 13
    },
    ardenais: {
        label: "Ardennais",
        id: "buffet_ardenais",
        description: "Les délices de l'Ardenne avec des charcuteries et viandes froides régionales.",
        composition: [
            "Jambon d'Ardenne et saucisson gaumais",
            "Boudin blanc et noir",
            "Rôti de porc froid moutardé",
            "Salades et féculents"
        ],
        basePrice: 15
    },
    reception: {
        label: "Réception",
        id: "buffet_reception",
        description: "Un buffet élégant mêlant viandes fines et poissons délicats.",
        composition: [
            "Saumon fumé extra doux",
            "Carpaccio de bœuf parfumé",
            "Assortiment de viandes froides nobles",
            "Salades raffinées"
        ],
        basePrice: 18
    },
    gala: {
        label: "Gala",
        id: "buffet_gala",
        description: "Le summum du raffinement avec fruits de mer, foie gras et créations du chef.",
        composition: [
            "Foie gras mi-cuit et confit d'oignons",
            "Cascade de fruits de mer",
            "Médaillon de saumon en belle-vue",
            "Salades prestige"
        ],
        basePrice: 22
    }
};

const aperitifsData = {
    zakouskis: {
        id: 'zakouskis',
        title: 'Zakouskis',
        desc: "Des bouchées raffinées pour éveiller les papilles. Découvrez nos créations déclinées en gammes Classique, Internationale et Premium.",
        image: '/images/zakouskis.jpg', // Image à ajouter dans /public/images
        composition: [
            "Légumes & Végé (ex: Arancini à la truffe, Falafel)",
            "Poisson & Mer (ex: Saint-Jacques snackée, Lobster roll)",
            "Viande & Volaille (ex: Mini burger Black Angus, Tataki)",
            "Tarification à la pièce (de 2,00€ à 4,50€)"
        ]
    },
    verrines: {
        id: 'verrines',
        title: 'Verrines (Apéritives ou Dînatoires)',
        desc: "Élégantes et savoureuses, nos verrines se déclinent en format apéritif (6cl) ou dînatoire (12cl) pour s'adapter à votre événement.",
        image: '/images/verrines.jpg', // Image à ajouter dans /public/images
        composition: [
            "Végétariennes (ex: Burrata pesto, Mousse de ricotta)",
            "Poisson & Mer (ex: Ceviche de langoustine, Tartare saumon)",
            "Viande & Volaille (ex: Carpaccio de bœuf, Parmentier de canard)",
            "Tarification au format (de 2,00€ à 5,00€)"
        ]
    },
    pains_garnis: {
        id: 'pains_garnis',
        title: 'Petits Pains & Wraps',
        desc: "L'authenticité au creux de la main. Parfait pour vos déjeuners d'entreprise ou réceptions en journée.",
        image: '/images/pains-garnis.jpg', // Image à ajouter dans /public/images
        composition: [
            "Pains Classiques Fermés (ex: Crabe fondant, Américain)",
            "Pains Signature (ex: Le Suédois, L'Italien, Le Périgord)",
            "Pains Ouverts Festifs (décorés de fleurs comestibles)",
            "L'Instant Wraps (ex: Le Norvégien, Le Maraîcher)"
        ]
    }
};

const FORMULES = [
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
        tag: "Buffets Froids",
        title: "Nos Buffets Froids",
        description: "Découvrez notre sélection de buffets froids, du plus rustique au plus raffiné.",
        price: "Dès 13€ / pers", // Dynamic
        image: "https://images.unsplash.com/photo-1628198544464-9eb5112faee1?q=80&w=2070&auto=format&fit=crop",
        items: [], // Dynamic
        allergens: ["gluten", "egg", "lait", "moutarde", "celeri", "fish", "crustace"],
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
    allergens?: string[];
    imageStyle?: string;
}

const SectionTitle = ({ title }: { title: string }) => (
    <div className="mt-24 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">{title}</h2>
        <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
    </div>
);

const AllergenLink = ({ section }: { section: string }) => (
    <div className="text-center mt-2 mb-8">
        <Link href={`/allergenes?section=${section}`} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-widest px-4 py-2 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors">
            ℹ️ Consulter la matrice des allergènes
        </Link>
    </div>
);

function BuffetChaudSection() {
    const [services, setServices] = useState<number>(3);

    const descriptions = {
        2: "Un plat mijoté savoureux (comme notre Carbonnade flamande ou une Blanquette de veau) accompagné de ses féculents et crudités, suivi d'un buffet de desserts gourmands.",
        3: "Une entrée raffinée servie à table (ex: Croûte de pâté au poivre), suivie d'un généreux buffet chaud avec deux choix de viandes, et clôturé par notre farandole de douceurs.",
        4: "Démarrez avec un assortiment de zakouskis, suivi d'une entrée. Place ensuite au grand buffet chaud (viandes et poissons), et terminez sur une note sucrée ou un plateau de fromages affinés.",
        5: "L'expérience ultime. Zakouskis en réception, double entrée (froide puis chaude), le majestueux buffet chaud garni, le buffet de fromages de nos régions, et la cascade de desserts."
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-32">
            {/* Colonne Gauche : Image */}
            <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-bold text-[#D4AF37] tracking-widest uppercase z-10 rounded-sm shadow-sm">
                    Sur-Mesure
                </div>
                {/* Remplace l'image par celle qui était utilisée pour le Gala ou une nouvelle */}
                <Image 
                    src="https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=1974&auto=format&fit=crop" 
                    alt="Buffet Chaud Sur-Mesure" 
                    fill 
                    className="object-cover"
                />
            </div>

            {/* Colonne Droite : Contenu */}
            <div className="w-full lg:w-1/2 flex flex-col items-start">
                <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">Buffets Chauds Sur-Mesure</h2>
                <div className="w-12 h-1 bg-[#D4AF37] mb-6"></div>
                <p className="text-neutral-500 font-light mb-8 leading-relaxed">
                    Notre offre prestige pour vos événements d'exception. Choisissez le format qui vous convient, et nous élaborerons ensemble un menu chaud personnalisé selon les saisons et vos envies.
                </p>

                {/* Boutons de sélection */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {[2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => setServices(num)}
                            className={`px-5 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 border-2 
                            ${services === num 
                                ? 'bg-black text-white border-black' 
                                : 'bg-transparent text-neutral-400 border-neutral-200 hover:border-[#D4AF37] hover:text-black'
                            }`}
                        >
                            {num} Services
                        </button>
                    ))}
                </div>

                {/* Encadré Composition (Design calqué sur le Gala) */}
                <div className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 mb-8">
                    <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">
                        Exemple de Composition ({services} services)
                    </h3>
                    <p className="text-neutral-600 italic leading-relaxed min-h-[80px]">
                        "{descriptions[services as keyof typeof descriptions]}"
                    </p>
                </div>

                {/* Bouton d'action */}
                <Link 
                    href={`/contact?formule=buffet-chaud&services=${services}`}
                    className="inline-block bg-black text-[#D4AF37] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                    Composer mon menu {services} services
                </Link>
                
                {/* Lien Allergènes discret */}
                <div className="mt-4">
                    <Link href="/allergenes?section=buffets" target="_blank" className="text-[10px] text-neutral-400 hover:text-[#D4AF37] uppercase tracking-widest underline decoration-neutral-300 underline-offset-4 transition-colors">
                        ℹ️ Voir les allergènes typiques
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Formules() {
    const [activeAperitifTab, setActiveAperitifTab] = useState('zakouskis');

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

                {/* SECTION APÉRITIFS */}
                <section className="py-16 bg-white rounded-3xl mb-24 shadow-sm border border-neutral-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="text-center mb-12">
                            <SectionTitle title="Apéritifs & Mises en bouche" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Colonne Gauche : Onglets & Infos */}
                            <div className="lg:col-span-5 space-y-8">
                                
                                {/* Navigation des onglets */}
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(aperitifsData).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setActiveAperitifTab(key)}
                                            className={`px-4 py-3 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-300 flex-1 min-w-[140px] ${
                                                activeAperitifTab === key
                                                    ? "bg-black text-[#D4AF37] shadow-lg scale-105"
                                                    : "bg-white text-neutral-500 border border-neutral-200 hover:border-[#D4AF37] hover:text-black"
                                            }`}
                                        >
                                            {key === 'pains_garnis' ? 'Petits Pains' : aperitifsData[key as keyof typeof aperitifsData].title.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>

                                {/* Contenu Dynamique */}
                                <div className="animate-fade-in">
                                    <h3 className="text-2xl font-bold text-neutral-800 mb-4">{aperitifsData[activeAperitifTab as keyof typeof aperitifsData].title}</h3>
                                    <p className="text-neutral-600 mb-6 leading-relaxed">
                                        {aperitifsData[activeAperitifTab as keyof typeof aperitifsData].desc}
                                    </p>

                                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 mb-8">
                                        <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-4">À la carte</h4>
                                        <ul className="grid grid-cols-1 gap-3">
                                            {aperitifsData[activeAperitifTab as keyof typeof aperitifsData].composition.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-neutral-700 text-sm">
                                                    <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {activeAperitifTab === 'zakouskis' && <AllergenLink section="zakouskis" />}
                                    {activeAperitifTab === 'verrines' && <AllergenLink section="verrines" />}
                                    {activeAperitifTab === 'pains_garnis' && <AllergenLink section="pains" />}

                                    {/* Boutons de Convives */}
                                    <div className="flex flex-wrap gap-3 mt-8">
                                        {activeAperitifTab === 'zakouskis' || activeAperitifTab === 'pains_garnis' || activeAperitifTab === 'verrines' ? (
                                            <>
                                                {/* 4 Boutons partagés pour Pains, Zakouskis et Verrines */}
                                                <Link href={`/contact?menu=${activeAperitifTab}&convives=moins_25`} className="flex-1 min-w-[110px] bg-neutral-50 p-3 rounded-xl text-center border border-neutral-200 hover:border-black transition group flex flex-col justify-center">
                                                    <p className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-black">Moins de 25 pers.</p>
                                                    <p className="text-sm font-bold text-neutral-800">Prix sur sélection</p>
                                                </Link>
                                                <Link href={`/contact?menu=${activeAperitifTab}&convives=25_100`} className="flex-1 min-w-[110px] bg-neutral-50 p-3 rounded-xl text-center border border-neutral-200 hover:border-black transition group flex flex-col justify-center">
                                                    <p className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-black">25 à 100 pers.</p>
                                                    <p className="text-sm font-bold text-neutral-800">Prix sur sélection</p>
                                                </Link>
                                                <Link href={`/contact?menu=${activeAperitifTab}&convives=100_200`} className="flex-1 min-w-[110px] bg-neutral-50 p-3 rounded-xl text-center border border-neutral-200 hover:border-black transition group flex flex-col justify-center">
                                                    <p className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-black">100 à 200 pers.</p>
                                                    <p className="text-sm font-bold text-neutral-800">Prix sur sélection</p>
                                                </Link>
                                                <Link href={`/contact?menu=${activeAperitifTab}&convives=plus_200`} className="flex-1 min-w-[110px] bg-black p-3 rounded-xl text-center hover:bg-neutral-800 transition shadow-md transform hover:-translate-y-0.5 flex flex-col justify-center">
                                                    <p className="text-[10px] font-bold text-[#D4AF37] mb-1 uppercase tracking-wider">Plus de 200 pers.</p>
                                                    <p className="text-sm font-bold text-white">Prix dégressifs</p>
                                                </Link>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Colonne Droite : Image Dynamique */}
                            <div className="lg:col-span-7 h-[500px] relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
                                <Image
                                    src={aperitifsData[activeAperitifTab as keyof typeof aperitifsData].image}
                                    alt={aperitifsData[activeAperitifTab as keyof typeof aperitifsData].title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FORMULES LIST */}
                <div className="space-y-24">
                    {FORMULES.map((formule, index) => {
                        const renderSectionTitle = () => {
                            if (index === 0) return <SectionTitle title="Barbecues" />;
                            if (formule.title === "Nos Buffets Froids") return <SectionTitle title="Buffets Froids" />;
                            return null;
                        };

                        return (
                            <div key={index}>
                                {renderSectionTitle()}
                                <FormuleSection formule={formule} index={index} />
                                {index === 0 && <AllergenLink section="bbq" />}
                                {formule.title === "Nos Buffets Froids" && <AllergenLink section="buffets" />}
                            </div>
                        );
                    })}
                </div>
                
                <SectionTitle title="Buffets Chauds" />
                <BuffetChaudSection />

                <SectionTitle title="Plats Uniques & Associations" />

                {/* SECTION COLLECTIVITÉS */}
                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-black rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h3 className="text-3xl font-serif text-neutral-900 mb-4">Repas de Collectivité</h3>
                            <p className="text-neutral-600 mb-6 leading-relaxed">
                                Des plats mijotés, généreux et réconfortants, pensés spécialement pour les grands groupes, les clubs sportifs et les associations. La convivialité au meilleur prix avec un plat unique pour tous.
                            </p>
                            
                            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 mb-6">
                                <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-widest mb-4">Quelques exemples à la carte</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-neutral-700"><span className="text-[#D4AF37]">✓</span> Carbonnade flamande, purée et compote</li>
                                    <li className="flex items-center gap-2 text-sm text-neutral-700"><span className="text-[#D4AF37]">✓</span> Lasagnes (Bœuf, Saumon, Légumes)</li>
                                    <li className="flex items-center gap-2 text-sm text-neutral-700"><span className="text-[#D4AF37]">✓</span> Boulettes sauce tomate ou chasseur</li>
                                    <li className="flex items-center gap-2 text-sm text-neutral-700"><span className="text-[#D4AF37]">✓</span> Et bien d'autres (21 plats au choix)...</li>
                                </ul>
                            </div>
                            
                            <AllergenLink section="collectivite" />

                            <div className="inline-block bg-black text-[#D4AF37] px-4 py-2 rounded-lg font-bold text-sm tracking-widest mb-6">
                                De 8,00€ à 14,00€ / personne
                            </div>
                        </div>

                        {/* Boutons de Convives (Vertical sur Desktop) */}
                        <div className="md:w-64 flex flex-col justify-center gap-3">
                            <Link href="/contact?menu=collectivite&convives=moins_50" className="w-full bg-neutral-50 p-4 rounded-xl text-center border border-neutral-200 hover:border-black transition group">
                                <p className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-black">Moins de 50 pers.</p>
                                <p className="text-lg font-bold text-neutral-800">À la carte (+10%)</p>
                            </Link>
                            <Link href="/contact?menu=collectivite&convives=50_100" className="w-full bg-neutral-50 p-4 rounded-xl text-center border border-neutral-200 hover:border-black transition group">
                                <p className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-black">50 à 100 pers.</p>
                                <p className="text-lg font-bold text-neutral-800">À la carte</p>
                            </Link>
                            <Link href="/contact?menu=collectivite&convives=plus_100" className="w-full bg-black p-4 rounded-xl text-center hover:bg-neutral-800 transition shadow-md transform hover:-translate-y-0.5">
                                <p className="text-[10px] font-bold text-[#D4AF37] mb-1 uppercase tracking-wider">Plus de 100 pers.</p>
                                <p className="text-lg font-bold text-white">Tarifs dégressifs</p>
                            </Link>
                        </div>
                    </div>
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
    const isBuffetFroid = formule.tag === "Buffets Froids";

    // BBQ State
    const [selectedBBQ, setSelectedBBQ] = useState<BBQType>('classique');
    const currentBBQ = BBQ_OPTIONS[selectedBBQ];

    // Buffet Froid State
    const [activeBuffetTab, setActiveBuffetTab] = useState<BuffetFroidType>('campagnard');
    const currentBuffetFroid = BUFFETS_FROIDS_OPTIONS[activeBuffetTab];

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
                    <h2 className="text-3xl md:text-4xl font-serif text-black">
                        {isBBQ ? currentBBQ.label : isBuffetFroid ? `Buffet ${currentBuffetFroid.label}` : formule.title}
                    </h2>
                    {isAssociatif && (
                        <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                            Livraison Seule
                        </div>
                    )}
                </div>
                <div className="w-20 h-1 bg-neutral-300" />

                <p className="text-gray-600 leading-relaxed text-lg">
                    {isBBQ ? currentBBQ.description : isBuffetFroid ? currentBuffetFroid.description : formule.description}
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

                {/* --- DYNAMIC BUFFET FROID SELECTOR --- */}
                {isBuffetFroid && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {Object.entries(BUFFETS_FROIDS_OPTIONS).map(([key, data]) => {
                            const isSelected = activeBuffetTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveBuffetTab(key as BuffetFroidType)}
                                    className={`
                                        px-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300
                                        flex flex-col items-center justify-center gap-1 text-center border
                                        ${isSelected
                                            ? 'bg-black text-[#D4AF37] border-black shadow-lg scale-105'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }
                                    `}
                                >
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
                        {(isBBQ ? currentBBQ.composition : isBuffetFroid ? currentBuffetFroid.composition : formule.items).map((item: string, i: number) => (
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
                        {formule.allergens?.map((alg) => {
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
                        activeBuffetTab={activeBuffetTab}
                    />
                </div>
            </div>
        </motion.section>
    );
}

function PricingBlock({ price, tag, selectedBBQ, activeBuffetTab }: { price: string, tag: string, selectedBBQ?: BBQType, activeBuffetTab?: BuffetFroidType }) {
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

    // Logic for Buffets Froids
    if (tag === "Buffets Froids" && activeBuffetTab) {
        const data = BUFFETS_FROIDS_OPTIONS[activeBuffetTab];
        return (
            <div className="flex flex-wrap gap-4 mt-8">
                <Link
                    href={`/contact?menu=${data.id}&convives=moins_25`}
                    className="flex-1 min-w-[120px] bg-neutral-50 p-4 rounded-xl text-center border border-neutral-200 hover:border-neutral-300 transition group"
                >
                    <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-neutral-700 transition">Moins de 25 pers.</p>
                    <p className="text-xl font-bold text-neutral-800">{data.basePrice + 2}€ <span className="text-sm font-normal text-neutral-500">/ pers</span></p>
                </Link>

                <Link
                    href={`/contact?menu=${data.id}&convives=25_250`}
                    className="flex-1 min-w-[120px] bg-black p-4 rounded-xl text-center hover:bg-neutral-800 transition shadow-lg transform hover:-translate-y-0.5"
                >
                    <p className="text-xs font-bold text-[#D4AF37] mb-1 uppercase tracking-wider">25 à 250 pers.</p>
                    <p className="text-2xl font-bold text-white">{data.basePrice}€ <span className="text-sm font-normal text-neutral-300">/ pers</span></p>
                </Link>

                <Link
                    href={`/contact?menu=${data.id}&convives=plus_250`}
                    className="flex-1 min-w-[120px] bg-neutral-50 p-4 rounded-xl text-center border border-neutral-200 hover:border-neutral-300 transition group"
                >
                    <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider group-hover:text-neutral-700 transition">Plus de 250 pers.</p>
                    <p className="text-xl font-bold text-neutral-800">Sur devis</p>
                    <p className="text-xs text-neutral-400 mt-1">(Tarifs dégressifs)</p>
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
