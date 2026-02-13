"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sprout, Shell, Flower2, FlaskConical, LucideIcon } from "lucide-react";
import Link from "next/link";

// --- DATA ---
// --- DATA ---
const FORMULES = [
    {
        tag: "Terroir",
        title: "Le Buffet Ardennais",
        description: "Une sélection authentique de charcuteries et préparations locales, mettant à l'honneur les saveurs de notre région.",
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
        allergens: ["gluten", "egg", "lait", "fish", "moutarde", "celeri"]
    },
    {
        tag: "Plats Chauds",
        title: "Le Dinatoire du Monde",
        description: "Un voyage culinaire à travers des plats réconfortants et variés, idéal pour satisfaire toutes les envies.",
        price: "24,50€ / pers",
        image: "https://images.unsplash.com/photo-1547924475-f9e5b2931a26?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Premier service : Lasagne maison, Chili con Carne, Tortellini et Paëlla royale",
            "Suivi d'un service grillades : Brochettes de scampi",
            "Côte d'agneau, Bœuf et Merguez",
            "Accompagnés de féculents variés"
        ],
        allergens: ["gluten", "egg", "lait", "crustace", "celeri"]
    },
    {
        tag: "BBQ & Feu de bois",
        title: "Le Barbecue Mixte",
        description: "L'incontournable de l'été. Des grillades savoureuses préparées avec soin pour une ambiance conviviale.",
        price: "20€ / pers",
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Entrée au choix : Brochette de Scampi ou Pavé de Saumon à l'aneth",
            "Plat : Côte d'agneau, Contrefilet",
            "Merguez, Chipolata et Brochette de bœuf",
            "Assortiment complet de salades et féculents"
        ],
        allergens: ["fish", "crustace", "moutarde"]
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
        allergens: ["crustace", "fish", "gluten", "egg", "lait", "sulfite"]
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
                    <h1 className="text-5xl md:text-6xl font-serif text-black">Nos Formules Gourmandes</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Découvrez nos compositions pensées pour tous vos événements.
                        Du simple buffet aux plats mijotés, nous avons la formule qu&apos;il vous faut.
                    </p>


                </header>

                {/* FORMULES LIST */}
                <div className="space-y-24">
                    {FORMULES.map((formule, index) => (
                        <FormuleSection key={index} formule={formule} index={index} />
                    ))}
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

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
        >
            {/* IMAGE SIDE */}
            <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] overflow-hidden rounded-sm shadow-xl group">
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
            <div className="w-full md:w-1/2 space-y-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[#D4AF37] font-sans text-sm font-bold uppercase tracking-widest md:hidden">{formule.tag}</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-black">{formule.title}</h2>
                </div>
                <div className="w-20 h-1 bg-neutral-300" />

                <p className="text-gray-600 leading-relaxed text-lg">
                    {formule.description}
                </p>

                {/* COMPOSITION */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border-l-4 border-neutral-300">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Composition</h3>
                    <ul className="grid grid-cols-1 gap-2">
                        {formule.items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-neutral-400 mt-1.5">•</span>
                                {item}
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
                    <PricingBlock price={formule.price} tag={formule.tag} />
                </div>
            </div>
        </motion.section>
    );
}

function PricingBlock({ price, tag }: { price: string, tag: string }) {
    // If it's the BBQ menu, show the 3 specific options
    if (tag === "BBQ & Feu de bois") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Option 1: < 30 */}
                <Link
                    href="/contact?menu=bbq&count=3&convives=Moins de 30"
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Moins de 30 pers.</span>
                    <span className="text-sm font-medium text-gray-900">3 Viandes au choix</span>
                    <span className="text-[10px] text-gray-400">(Formule Standard)</span>
                </Link>

                {/* Option 2: 30 - 80 (Highlighted) */}
                <Link
                    href="/contact?menu=bbq&count=4&convives=30 à 80"
                    className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden hover:scale-[1.07] transition-transform cursor-pointer"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">30 à 80 pers.</span>
                    <span className="text-lg font-bold font-serif">4 Viandes au choix</span>
                </Link>

                {/* Option 3: > 80 */}
                <Link
                    href="/contact?menu=bbq&count=5&convives=Plus de 80"
                    className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Plus de 80 pers.</span>
                    <span className="text-sm font-medium text-gray-900">5 Viandes au choix</span>
                    <span className="text-[10px] text-gray-400">(Grand Groupe)</span>
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
