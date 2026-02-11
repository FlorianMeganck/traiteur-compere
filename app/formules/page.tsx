"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sprout, Shell, Flower2, FlaskConical, LucideIcon } from "lucide-react";

// --- DATA ---
const FORMULES = [
    {
        title: "Cochon à la broche & BBQ",
        description: "Une cuisson lente pour une viande tendre et savoureuse, accompagnée de nos salades fraîches et sauces maison.",
        price: "Sur devis (variable selon marché)", // Specific override
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Cochon de lait mariné 24h",
            "Assortiment de saucisses artisanales",
            "Pommes de terre grenailles au romarin",
            "Buffet de crudités de saison",
            "Sauces : Mayonnaise maison, Tartare, Andalouse"
        ],
        allergens: ["gluten", "egg", "lait", "moutarde"] // Updated to include new keys if applicable
    },
    {
        title: "Buffets Froids",
        description: "Un assortiment de mets raffinés pour satisfaire tous les palais. Idéal pour les réceptions estivales.",
        price: "32€ / personne", // Example price
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Saumon Bellevue & Tomates crevettes",
            "Plateau de charcuteries fines",
            "Rôti de bœuf & Rôti de porc",
            "Pêches au thon & Œufs mimosa",
            "Salade de pâtes à l'italienne",
            "Pain & Beurre"
        ],
        allergens: ["gluten", "egg", "lait", "fish", "crustace"]
    },
    {
        title: "Buffets Chauds",
        description: "Des plats mijotés avec amour, servis chauds pour réconforter vos convives.",
        price: "14€ / personne", // THE REQUESTED EXAMPLE
        image: "https://images.unsplash.com/photo-1547924475-f9e5b2931a26?q=80&w=2070&auto=format&fit=crop",
        items: [
            "Boulets à la Liégeoise",
            "Vol au vent de volaille fermière",
            "Carbonnades à la bière brune",
            "Gratin dauphinois crémeux",
            "Légumes chauds de saison"
        ],
        allergens: ["gluten", "lait", "egg", "celeri"]
    },
    {
        title: "Zakouskis & Verrines",
        description: "Des bouchées apéritives élégantes pour lancer vos événements avec style.",
        price: "1.50€ / pièce",
        image: "https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=1974&auto=format&fit=crop",
        items: [
            "Verrine mousse de saumon & aneth",
            "Mini-burger foie gras & confit d'oignons",
            "Cuillère scampis curry-coco",
            "Toast chèvre miel & noix",
            "Mini-quiche lorraine"
        ],
        allergens: ["gluten", "lait", "egg", "nut", "fish", "crustace", "sesame"]
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
            </div>

            {/* CONTENT SIDE */}
            <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-serif text-black">{formule.title}</h2>
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
                    <PricingBlock price={formule.price} />
                </div>
            </div>
        </motion.section>
    );
}

function PricingBlock({ price }: { price: string }) {
    // If exact price provided (e.g. "14€ / personne"), we show strict tiered logic
    // Otherwise (e.g. "Sur devis"), we adapt slightly or just show it.

    // Check if price contains a number
    const hasPrice = /\d/.test(price);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* < 20 */}
            <div className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Moins de 20 pers.</span>
                <span className="text-sm font-medium text-gray-900">Sur devis</span>
                <span className="text-[10px] text-gray-400">(Nous contacter)</span>
            </div>

            {/* 20 - 100 */}
            <div className="bg-black text-white p-3 rounded-lg transform scale-105 shadow-lg flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wide mb-1">20 à 100 pers.</span>
                <span className="text-lg font-bold font-serif">{hasPrice ? price : "Sur devis"}</span>
            </div>

            {/* > 100 */}
            <div className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Plus de 100 pers.</span>
                <span className="text-sm font-medium text-gray-900">Sur devis</span>
                <span className="text-[10px] text-gray-400">(Tarifs dégressifs)</span>
            </div>
        </div>
    );
}
