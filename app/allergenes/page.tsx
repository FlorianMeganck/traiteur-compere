"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sprout, Shell, Flower2, FlaskConical } from "lucide-react";

// --- BASE DE DONNÉES DES ALLERGÈNES ---
const ALLERGENES = {
    GLU: { id: "GLU", name: "Gluten", image: "/allergene/ble.png", color: "bg-amber-100 text-amber-800 border-amber-200" },
    CRU: { id: "CRU", name: "Crustacés", image: "/allergene/crustace.png", color: "bg-orange-100 text-orange-800 border-orange-200" },
    OEU: { id: "OEU", name: "Œufs", image: "/allergene/oeuf.png", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    POI: { id: "POI", name: "Poissons", image: "/allergene/poisson.png", color: "bg-blue-100 text-blue-800 border-blue-200" },
    ARA: { id: "ARA", name: "Arachides", image: "/allergene/arachide.png", color: "bg-stone-100 text-stone-800 border-stone-200" },
    SOJ: { id: "SOJ", name: "Soja", icon: Sprout, color: "bg-green-100 text-green-800 border-green-200" },
    LAI: { id: "LAI", name: "Lait (Lactose)", image: "/allergene/lait.png", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
    FRU: { id: "FRU", name: "Fruits à coque", image: "/allergene/amande.png", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    CEL: { id: "CEL", name: "Céleri", image: "/allergene/celeri.png", color: "bg-lime-100 text-lime-800 border-lime-200" },
    MOU: { id: "MOU", name: "Moutarde", image: "/allergene/moutarde.png", color: "bg-yellow-200 text-yellow-900 border-yellow-300" },
    SES: { id: "SES", name: "Sésame", image: "/allergene/sesame.png", color: "bg-orange-50 text-orange-900 border-orange-200" },
    SUL: { id: "SUL", name: "Sulfites", icon: FlaskConical, color: "bg-purple-100 text-purple-800 border-purple-200" },
    LUP: { id: "LUP", name: "Lupin", icon: Flower2, color: "bg-rose-100 text-rose-800 border-rose-200" },
    MOL: { id: "MOL", name: "Mollusques", icon: Shell, color: "bg-slate-100 text-slate-800 border-slate-200" },
};

type ItemAllergens = { name: string; allergens: string[] };
type CategoryData = { id: string; title: string; items: ItemAllergens[] };

const allergenMatrix: CategoryData[] = [
    {
        id: "bbq",
        title: "Barbecues & Viandes",
        items: [
            { name: "Saucisses & Chipolatas (Nature, Campagne, BBQ...)", allergens: ["SUL", "MOU", "GLU"] },
            { name: "Saucisses Volaille (Fromage)", allergens: ["LAI", "SUL"] },
            { name: "Merguez", allergens: ["SUL"] },
            { name: "Boudins (Blanc, Noir)", allergens: ["GLU", "LAI", "OEU"] },
            { name: "Brochettes Marinées (Bœuf, Porc, Volaille)", allergens: ["SOJ", "MOU", "SUL"] },
            { name: "Braisade de canard aux trois poivres", allergens: ["LAI", "SUL"] },
            { name: "Spare ribs marinés au miel", allergens: ["SOJ", "SUL", "MOU"] },
            { name: "Viandes Nobles (Tomahawk, Côte à l'os, Entrecôtes)", allergens: [] },
            { name: "Cochon de Lait / Porchetta", allergens: ["SUL", "MOU"] },
            { name: "Options Végétariennes (Halloumi, Tofu teriyaki...)", allergens: ["LAI", "SOJ", "GLU", "SES"] }
        ]
    },
    {
        id: "mer",
        title: "Poissons & Fruits de Mer (BBQ)",
        items: [
            { name: "Brochette de scampi / Saint-Jacques", allergens: ["CRU", "MOL", "SUL"] },
            { name: "Pavé de saumon au fenouil / aneth", allergens: ["POI"] },
            { name: "Calamar mariné au cumin", allergens: ["MOL", "SUL"] },
            { name: "Pince de crabe / Homard", allergens: ["CRU"] },
            { name: "Moules en papillote", allergens: ["MOL", "CEL", "SUL"] }
        ]
    },
    {
        id: "accompagnements",
        title: "Accompagnements (Féculents & Crudités)",
        items: [
            { name: "Salade de Pâtes Pesto / Curry", allergens: ["GLU", "LAI", "OEU", "MOU"] },
            { name: "Salade Grecque (Feta/Olives)", allergens: ["LAI"] },
            { name: "Salade de Pomme de Terre (Mayonnaise)", allergens: ["OEU", "MOU", "SUL"] },
            { name: "Tomate Mozza Di Bufala", allergens: ["LAI"] },
            { name: "Taboulé Oriental", allergens: ["GLU"] },
            { name: "Céleri Râpé & Pommes", allergens: ["CEL", "OEU", "MOU"] },
            { name: "Coleslaw au miel", allergens: ["OEU", "MOU", "LAI"] },
            { name: "Gratin Dauphinois", allergens: ["LAI", "OEU"] },
            { name: "Petits pains & Baguettes", allergens: ["GLU"] }
        ]
    },
    {
        id: "zakouskis",
        title: "Zakouskis (Apéritifs)",
        items: [
            { name: "Falafel et sauce tahini", allergens: ["SES", "GLU"] },
            { name: "Croquette de fromage / Arancini", allergens: ["GLU", "LAI", "OEU"] },
            { name: "Roulé de saumon au fromage frais", allergens: ["POI", "LAI", "GLU"] },
            { name: "Sushi roll / Tataki de thon", allergens: ["POI", "SOJ", "SES"] },
            { name: "Nems (Poulet, Crevettes) / Gambas tempura", allergens: ["GLU", "CRU", "SOJ"] },
            { name: "Mini burger (Bœuf, Angus)", allergens: ["GLU", "LAI", "OEU", "SES", "MOU"] },
            { name: "Mini vol-au-vent aux ris de veau", allergens: ["GLU", "LAI", "OEU", "CEL"] }
        ]
    },
    {
        id: "verrines",
        title: "Verrines",
        items: [
            { name: "Verrine italienne parmesan, mozza, pesto", allergens: ["LAI", "FRU"] },
            { name: "Mousse d'avocat et crevettes", allergens: ["CRU", "LAI"] },
            { name: "Tartare de saumon / Ceviche", allergens: ["POI", "SUL"] },
            { name: "Carpaccio de bœuf au parmesan", allergens: ["LAI", "SUL"] },
            { name: "Mousse de foie de canard au Sauternes", allergens: ["LAI", "OEU", "SUL"] },
            { name: "Dôme de chocolat noir avec son cœur praliné", allergens: ["LAI", "OEU", "GLU", "FRU"] }
        ]
    },
    {
        id: "pains",
        title: "Petits Pains & Wraps",
        items: [
            { name: "Côté Mer (Crabe, Thon, Saumon)", allergens: ["GLU", "POI", "CRU", "OEU", "MOU"] },
            { name: "Côté Boucherie (Américain, Jambon)", allergens: ["GLU", "OEU", "MOU", "SUL"] },
            { name: "Côté Fromager (Abbaye, Brie)", allergens: ["GLU", "LAI", "OEU", "MOU"] },
            { name: "Le Suédois (Saumon, Philadelphia)", allergens: ["GLU", "POI", "LAI"] },
            { name: "Wraps (Maraîcher, Norvégien...)", allergens: ["GLU", "LAI", "POI", "OEU", "MOU"] }
        ]
    },
    {
        id: "buffets",
        title: "Buffets Froids",
        items: [
            { name: "Croûte de pâté (poivre, chevreuil)", allergens: ["GLU", "OEU", "LAI", "FRU"] },
            { name: "Pêche au thon", allergens: ["POI", "OEU", "MOU"] },
            { name: "Tomate-crevette grise", allergens: ["CRU", "OEU", "MOU"] },
            { name: "Saumon en belle-vue / Darne de saumon", allergens: ["POI", "OEU"] },
            { name: "Viandes braisées (Porc, Bœuf, Volaille)", allergens: ["SUL", "MOU"] },
            { name: "Terrines (Fenouil, Sandre, Légumes)", allergens: ["POI", "OEU", "LAI"] }
        ]
    },
    {
        id: "collectivite",
        title: "Repas de Collectivité & Plats Uniques",
        items: [
            { name: "Lasagnes (Bœuf, Saumon, Légumes)", allergens: ["GLU", "LAI", "OEU", "POI", "CEL"] },
            { name: "Boulettes / Boulets Liégeois (Tomate, Lapin, Chasseur)", allergens: ["GLU", "OEU", "LAI", "SUL", "MOU"] },
            { name: "Carbonnade flamande", allergens: ["GLU", "SUL", "MOU"] },
            { name: "Vol-au-vent", allergens: ["GLU", "LAI", "OEU", "CEL"] },
            { name: "Blanquette de veau à l'ancienne", allergens: ["GLU", "LAI", "CEL"] },
            { name: "Tartiflette", allergens: ["LAI", "SUL"] },
            { name: "Potées (Carottes, Liégeoise, Choux)", allergens: ["CEL", "SUL", "LAI"] }
        ]
    }
];

// --- COMPOSANT PRINCIPAL ---

function AllergenesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [openSection, setOpenSection] = useState<string | null>(null);

    // Deep Linking: Ouvrir la bonne section selon l'URL (?section=...)
    useEffect(() => {
        const sectionParam = searchParams.get("section");
        if (sectionParam) {
            setOpenSection(sectionParam);
            // Petit délai pour laisser le temps au composant de s'ouvrir avant de scroller
            setTimeout(() => {
                const element = document.getElementById(`section-${sectionParam}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 300);
        }
    }, [searchParams]);

    const toggleSection = (id: string) => {
        setOpenSection(prev => prev === id ? null : id);
    };

    return (
        <main className="min-h-screen pt-40 md:pt-48 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative">
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* En-tête de page */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">Matrice des Allergènes</h1>
                    <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6"></div>
                    <p className="text-neutral-500 font-light text-lg max-w-2xl mx-auto">
                        La santé de nos convives est notre priorité. Consultez la liste des allergènes majeurs présents dans nos préparations.
                        <br /><span className="font-bold text-neutral-700">En cas d'allergie sévère, merci de le préciser impérativement lors de votre commande.</span>
                    </p>
                </div>

                {/* Légende Globale des Allergènes */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 mb-10 flex flex-wrap gap-4 justify-center">
                    {Object.values(ALLERGENES).map(a => {
                        const IconComponent = (a as any).icon;
                        return (
                            <div key={a.id} className="flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-full border ${a.color} flex items-center justify-center overflow-hidden`}>
                                    {(a as any).image ? (
                                        <Image src={(a as any).image} alt={a.name} width={32} height={32} className="object-contain" />
                                    ) : IconComponent ? (
                                        <IconComponent size={24} strokeWidth={1.5} />
                                    ) : (
                                        <span className="text-[10px] font-bold">{a.id}</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium text-neutral-600">{a.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Accordéons des Menus */}
                <div className="space-y-4">
                    {allergenMatrix.map((category) => (
                        <div key={category.id} id={`section-${category.id}`} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                            <button
                                onClick={() => toggleSection(category.id)}
                                className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors"
                            >
                                <h2 className="text-xl font-serif font-bold text-neutral-800">{category.title}</h2>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 transition-transform duration-300 ${openSection === category.id ? 'rotate-180 bg-[#D4AF37]/20 text-[#D4AF37]' : ''}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </button>

                            <AnimatePresence>
                                {openSection === category.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-t border-neutral-100"
                                    >
                                        <div className="p-6 space-y-4 bg-neutral-50/50">
                                            {category.items.map((item, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-neutral-100">
                                                    <span className="font-medium text-neutral-800 text-sm">{item.name}</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.allergens.length > 0 ? (
                                                            item.allergens.map(alCode => {
                                                                const alInfo = ALLERGENES[alCode as keyof typeof ALLERGENES];
                                                                const IconComponent = (alInfo as any).icon;
                                                                return (
                                                                    <div key={alCode} className={`flex items-center gap-2 text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${alInfo.color}`}>
                                                                        {(alInfo as any).image && (
                                                                            <Image src={(alInfo as any).image} alt={alInfo.name} width={16} height={16} className="object-contain" />
                                                                        )}
                                                                        {IconComponent && (
                                                                            <IconComponent size={14} strokeWidth={1.5} />
                                                                        )}
                                                                        {alInfo.name}
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                                                                Aucun allergène majeur
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center pb-8">
                    <button
                        onClick={() => window.close()}
                        className="inline-block bg-[#D4AF37] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors shadow-lg"
                    >
                        Fermer cette page
                    </button>
                </div>

            </div>
        </main>
    );
}

export default function AllergenesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <AllergenesContent />
        </Suspense>
    );
}
