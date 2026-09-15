"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sprout, Shell, Flower2, FlaskConical, ShieldAlert } from "lucide-react";

// --- BASE DE DONNÉES DES 14 ALLERGÈNES MAJEURS (Règlement UE n° 1169/2011) ---

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
        id: "saladbar",
        title: "Salad Bar & Bowls Fraîcheur",
        items: [
            { name: "La Buddha Bowl Maison", allergens: ["SES"] },
            { name: "La Jardinière du Compère", allergens: ["GLU", "LAI", "FRU", "SUL"] },
            { name: "La Fraîcheur Méditerranéenne", allergens: ["LAI", "MOU", "SUL"] },
            { name: "La César Revisitée du Compère", allergens: ["GLU", "LAI", "OEU", "POI", "MOU", "SUL"] },
            { name: "La Caprese du Compère", allergens: ["GLU", "LAI", "FRU", "SUL"] },
            { name: "La Compère Campagnarde", allergens: ["GLU", "OEU", "MOU", "SUL"] },
            { name: "La Power Bowl (Saumon ou Bœuf)", allergens: ["POI", "OEU", "SOJ", "SES"] },
            { name: "La Nordique (Saumon & Crevettes grises)", allergens: ["POI", "CRU", "OEU", "LAI", "MOU"] }
        ]
    },
    {
        id: "sauces",
        title: "Sauces Chaudes & Accompagnements",
        items: [
            { name: "Sauce au poivre noir concassé", allergens: ["LAI", "CEL", "SUL"] },
            { name: "Sauce béarnaise minute", allergens: ["LAI", "OEU", "SUL"] },
            { name: "Sauce dijonnaise à l'ancienne", allergens: ["MOU", "LAI", "SUL"] },
            { name: "Sauce crème aux champignons des bois", allergens: ["LAI", "SUL"] },
            { name: "Sauce au fond de volaille / Sauce liégeoise", allergens: ["GLU", "CEL", "SUL"] },
            { name: "Sauces froides maison (Mayonnaise, Tartare, Cocktail, Ail)", allergens: ["OEU", "MOU", "SUL", "LAI"] },
            { name: "Gratin Dauphinois traditionnel", allergens: ["LAI", "OEU"] },
            { name: "Pâtes fraîches & Orecchiette", allergens: ["GLU", "OEU"] },
            { name: "Pommes de terre grenailles au romarin", allergens: [] },
            { name: "Frites fraîches artisanales", allergens: [] },
            { name: "Poêlée de légumes chauds cuisinés & Tomates provençales", allergens: ["CEL"] },
            { name: "Salade de pâtes fraîches au pesto / curry", allergens: ["GLU", "LAI", "OEU", "MOU"] },
            { name: "Taboulé oriental à la menthe", allergens: ["GLU"] },
            { name: "Salade de pommes de terre à l'ancienne", allergens: ["OEU", "MOU", "SUL"] },
            { name: "Petits pains artisanaux & Baguettes tradition", allergens: ["GLU"] }
        ]
    },
    {
        id: "bbq",
        title: "Barbecues & Viandes",
        items: [
            { name: "Saucisses & Chipolatas (Nature, Campagne, BBQ, Italienne)", allergens: ["GLU", "MOU", "SUL"] },
            { name: "Saucisses Volaille (Fromage)", allergens: ["LAI", "SUL"] },
            { name: "Merguez artisanale", allergens: ["SUL"] },
            { name: "Boudins artisanaux (Blanc, Noir)", allergens: ["GLU", "LAI", "OEU"] },
            { name: "Brochettes Marinées (Bœuf, Porc, Volaille, Dinde)", allergens: ["SOJ", "MOU", "SUL"] },
            { name: "Braisade de porc & de bœuf marinée", allergens: ["SOJ", "MOU", "SUL"] },
            { name: "Braisade de canard aux trois poivres", allergens: ["LAI", "SUL"] },
            { name: "Spare ribs marinés au miel", allergens: ["SOJ", "SUL", "MOU"] },
            { name: "Côte d'agneau & Gigot marinés ail & herbes", allergens: ["SUL"] },
            { name: "Viandes Nobles (Tomahawk, Côte à l'os, Entrecôtes)", allergens: [] },
            { name: "Cochon de Lait / Porchetta", allergens: ["MOU", "SUL"] },
            { name: "Options Végétariennes (Halloumi, Tofu teriyaki...)", allergens: ["GLU", "LAI", "SOJ", "SES"] }
        ]
    },
    {
        id: "mer",
        title: "Poissons & Fruits de Mer (BBQ & Réceptions)",
        items: [
            { name: "Brochette de scampi / Saint-Jacques", allergens: ["CRU", "MOL", "SUL"] },
            { name: "Pavé de saumon au fenouil / aneth", allergens: ["POI"] },
            { name: "Gambas géantes grillées", allergens: ["CRU"] },
            { name: "Homard grillé au beurre fin", allergens: ["CRU", "LAI"] },
            { name: "Moules en papillote au vin blanc & céleri", allergens: ["MOL", "CEL", "SUL"] }
        ]
    },
    {
        id: "buffets",
        title: "Buffets Froids (Campagnard, Ardennais, Réception, Gala)",
        items: [
            { name: "Pâté en croûte de campagne & confit", allergens: ["GLU", "OEU", "LAI", "FRU", "SUL"] },
            { name: "Pêche au thon mayonnaise", allergens: ["POI", "OEU", "MOU"] },
            { name: "Tomate-crevette grise de la mer du Nord", allergens: ["CRU", "OEU", "MOU"] },
            { name: "Saumon en belle-vue / Saumon fumé extra doux", allergens: ["POI", "OEU"] },
            { name: "Viandes froides braisées (Porc, Bœuf, Volaille)", allergens: ["MOU", "SUL"] },
            { name: "Terrines (Fenouil, Sandre, Légumes)", allergens: ["POI", "OEU", "LAI"] },
            { name: "Foie gras de canard mi-cuit artisanal & confit", allergens: ["LAI", "OEU", "SUL"] },
            { name: "Cascade de fruits de mer (Huîtres, crevettes, bulots)", allergens: ["CRU", "MOL", "SUL"] },
            { name: "Carpaccio de bœuf au parmesan", allergens: ["LAI", "SUL"] },
            { name: "Plateau de charcuteries fines (Jambon d'Ardenne, saucisson)", allergens: ["MOU", "SUL"] }
        ]
    },
    {
        id: "collectivite",
        title: "Buffets Chauds & Plats Uniques Mijotés",
        items: [
            { name: "Carbonnade flamande à la bière d'abbaye", allergens: ["GLU", "SUL", "MOU"] },
            { name: "Blanquette de veau à l'ancienne", allergens: ["GLU", "LAI", "CEL"] },
            { name: "Boulettes / Boulets Liégeois (Tomate, Lapin, Chasseur)", allergens: ["GLU", "OEU", "LAI", "SUL", "MOU", "CEL"] },
            { name: "Lasagne maison à la bolognaise", allergens: ["GLU", "LAI", "OEU", "CEL"] },
            { name: "Lasagne au saumon et épinards al verde", allergens: ["GLU", "LAI", "OEU", "POI"] },
            { name: "Waterzooi de poisson à la gantoise", allergens: ["POI", "LAI", "CEL"] },
            { name: "Vol-au-vent de poularde de ferme", allergens: ["GLU", "LAI", "OEU", "CEL"] },
            { name: "Chicons farcis au lard fumé & purée", allergens: ["GLU", "LAI", "OEU", "SUL"] },
            { name: "Cuisse de lapin à la bière & compote", allergens: ["GLU", "SUL"] },
            { name: "Tartiflette au Reblochon AOP", allergens: ["LAI", "SUL"] },
            { name: "Potées traditionnelles (Carottes, Liégeoise, Choux)", allergens: ["CEL", "SUL", "LAI"] }
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
            { name: "Mini burger Black Angus", allergens: ["GLU", "LAI", "OEU", "SES", "MOU"] },
            { name: "Mini vol-au-vent aux ris de veau", allergens: ["GLU", "LAI", "OEU", "CEL"] }
        ]
    },
    {
        id: "verrines",
        title: "Verrines Salées Gourmandes",
        items: [
            { name: "Verrine italienne parmesan, mozza, pesto", allergens: ["LAI", "FRU"] },
            { name: "Mousse d'avocat et crevettes grises", allergens: ["CRU", "LAI"] },
            { name: "Tartare de saumon frais / Ceviche", allergens: ["POI", "SUL"] },
            { name: "Carpaccio de bœuf au parmesan", allergens: ["LAI", "SUL"] },
            { name: "Mousse de foie de canard au Sauternes", allergens: ["LAI", "OEU", "SUL"] },
            { name: "Dôme de chocolat noir avec son cœur praliné", allergens: ["LAI", "OEU", "GLU", "FRU"] }
        ]
    },
    {
        id: "pains",
        title: "Petits Pains & Wraps",
        items: [
            { name: "Pains garnis Côté Mer (Crabe, Thon, Saumon)", allergens: ["GLU", "POI", "CRU", "OEU", "MOU"] },
            { name: "Pains garnis Côté Boucherie (Américain, Jambon)", allergens: ["GLU", "OEU", "MOU", "SUL", "LAI"] },
            { name: "Pains garnis Côté Fromager (Abbaye, Brie, Chèvre)", allergens: ["GLU", "LAI", "OEU", "MOU", "FRU"] },
            { name: "Le Suédois (Saumon, Philadelphia)", allergens: ["GLU", "POI", "LAI"] },
            { name: "L'Instant Wraps (Maraîcher, Norvégien...)", allergens: ["GLU", "LAI", "POI", "OEU", "MOU"] }
        ]
    },
    {
        id: "desserts",
        title: "Desserts & Mignardises Artisanales",
        items: [
            { name: "Cascade de desserts traditionnels (Mousse chocolat, bavarois, tartes)", allergens: ["GLU", "LAI", "OEU", "FRU"] },
            { name: "Plateau de mignardises artisanales (Éclairs, tartelettes)", allergens: ["GLU", "LAI", "OEU", "FRU"] },
            { name: "Macarons artisanaux aux amandes", allergens: ["OEU", "FRU", "LAI"] },
            { name: "Buffet de fromages affinés de nos régions & pains", allergens: ["LAI", "GLU", "FRU", "SUL"] },
            { name: "Gâteau d'événement & Pièce montée", allergens: ["GLU", "LAI", "OEU", "FRU"] }
        ]
    }
];

// --- COMPOSANT DE CONTENU ---

function AllergenesContent() {
    const searchParams = useSearchParams();
    const [openSection, setOpenSection] = useState<string | null>(null);
    const hasInitialScrolled = useRef<boolean>(false);

    // Deep Linking : ouverture au chargement initial UNIQUEMENT (sans boucle de scroll)
    useEffect(() => {
        if (hasInitialScrolled.current) return;

        const sectionParam = searchParams.get("section")?.toLowerCase();
        if (sectionParam) {
            hasInitialScrolled.current = true;

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
            setOpenSection(target);

            setTimeout(() => {
                const element = document.getElementById(`section-${target}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 300);
        }
    }, [searchParams]);

    const toggleSection = (id: string) => {
        setOpenSection((prev) => (prev === id ? null : id));
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative">
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* En-tête de page */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">Matrice des Allergènes</h1>
                    <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6"></div>
                    <p className="text-neutral-500 font-light text-lg max-w-2xl mx-auto">
                        La santé de nos convives est notre priorité. Consultez la liste des allergènes majeurs présents dans nos préparations.
                        <br /><span className="font-bold text-neutral-700">En cas d&apos;allergie sévère, merci de le préciser impérativement lors de votre commande.</span>
                    </p>
                </div>

                {/* Légende Globale des Allergènes */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 mb-10 flex flex-wrap gap-4 justify-center">
                    {Object.values(ALLERGENES).map((a) => {
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

                {/* Accordéons des Menus (Système simple, fluide et sans saut de scroll) */}
                <div className="space-y-4">
                    {allergenMatrix.map((category) => (
                        <div key={category.id} id={`section-${category.id}`} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => toggleSection(category.id)}
                                className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors"
                            >
                                <h2 className="text-xl font-serif font-bold text-neutral-800">{category.title}</h2>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 transition-transform duration-300 ${openSection === category.id ? "rotate-180 bg-[#D4AF37]/20 text-[#D4AF37]" : ""}`}>
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
                                        <div className="p-6 space-y-3 bg-neutral-50/50">
                                            {category.items.map((item, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-neutral-100 shadow-xs">
                                                    <span className="font-medium text-neutral-800 text-sm">{item.name}</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.allergens.length > 0 ? (
                                                            item.allergens.map((alCode) => {
                                                                const alInfo = ALLERGENES[alCode as keyof typeof ALLERGENES];
                                                                if (!alInfo) return null;
                                                                const IconComponent = (alInfo as any).icon;
                                                                return (
                                                                    <div key={alCode} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${alInfo.color}`}>
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
                                                            <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded border border-green-200">
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

                {/* MENTION LÉGALE OBLIGATOIRE EN BAS */}
                <div className="mt-12 bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-xs text-center">
                    <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-2">
                        <ShieldAlert size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
                            Sécurité Sanitaire & Traçabilité
                        </span>
                    </div>
                    <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto italic">
                        « Nos préparations sont réalisées dans un atelier utilisant des produits contenant l&apos;ensemble des 14 allergènes majeurs. En cas d&apos;allergie sévère, merci de le signaler impérativement lors de votre demande de devis. »
                    </p>
                    <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-wider text-xs transition-all shadow-sm"
                        >
                            Préciser une allergie lors d&apos;un devis
                        </Link>
                    </div>
                </div>

                <div className="mt-10 text-center pb-8">
                    <button
                        type="button"
                        onClick={() => {
                            window.close();
                            // Fallback si l'onglet n'a pas été ouvert via script ou si le navigateur bloque window.close()
                            setTimeout(() => {
                                if (!document.hidden) {
                                    window.location.href = "/";
                                }
                            }, 200);
                        }}
                        className="inline-block bg-[#D4AF37] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors shadow-md"
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
