import Image from "next/image";
import Link from "next/link";
import { Sprout, Shell, Flower2, FlaskConical } from "lucide-react";

// --- EMPÊCHER L'INDEXATION GOOGLE ---
export const metadata = {
    title: "Informations Allergènes - Traiteur Compère",
    robots: {
        index: false,
        follow: false,
    },
};

// --- DONNÉES ICONES (Mêmes que Formules) ---
const ALLERGEN_ICONS: any = {
    gluten: { image: "/ble.png", label: "Blé (Gluten)" },
    lait: { image: "/lait.png", label: "Lait" },
    egg: { image: "/oeuf.png", label: "Œufs" },
    moutarde: { image: "/moutarde.png", label: "Moutarde" },
    celeri: { image: "/celeri.png", label: "Céleri" },
    fish: { image: "/poisson.png", label: "Poisson" },
    crustace: { image: "/crustace.png", label: "Crustacés" },
    soja: { icon: Sprout, label: "Soja" },
    sulfite: { icon: FlaskConical, label: "Sulfites" },
    // ... tu peux ajouter les autres si nécessaire
};

// --- LISTE PRODUITS (EXEMPLES À VÉRIFIER) ---
const PRODUCTS = [
    {
        category: "Saucisses & Classiques", items: [
            { name: "Saucisse de Campagne", allergens: ["gluten", "egg", "moutarde"] },
            { name: "Saucisse au Fromage", allergens: ["gluten", "lait"] },
            { name: "Merguez", allergens: [] },
            { name: "Boudin Blanc", allergens: ["lait", "gluten"] },
        ]
    },
    {
        category: "Brochettes & Marinades", items: [
            { name: "Brochette de Bœuf marinée", allergens: ["moutarde"] },
            { name: "Brochette de Poulet", allergens: ["soja"] },
            { name: "Scampi Marinés", allergens: ["crustace", "lait"] },
        ]
    },
    {
        category: "Accompagnements", items: [
            { name: "Salade de Pâtes", allergens: ["gluten", "egg"] },
            { name: "Gratin Dauphinois", allergens: ["lait"] },
            { name: "Sauce Tartare Maison", allergens: ["egg", "moutarde"] },
        ]
    }
];

export default function AllergenesPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-neutral-50">
            <div className="max-w-4xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-serif text-black mb-4">Informations Allergènes</h1>
                    <p className="text-gray-500 italic">
                        Document informatif à destination de notre clientèle sujette aux allergies alimentaires.
                    </p>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
                </header>

                <div className="space-y-12">
                    {PRODUCTS.map((section, idx) => (
                        <section key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-serif text-[#D4AF37] mb-6 border-b border-gray-100 pb-2">
                                {section.category}
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {section.items.map((item, i) => (
                                    <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <span className="font-medium text-gray-800">{item.name}</span>

                                        <div className="flex flex-wrap gap-3">
                                            {item.allergens.length > 0 ? (
                                                item.allergens.map(alg => {
                                                    const icon = ALLERGEN_ICONS[alg];
                                                    if (!icon) return null;
                                                    return (
                                                        <div key={alg} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200" title={icon.label}>
                                                            <div className="w-5 h-5 relative flex items-center justify-center">
                                                                {icon.image ? (
                                                                    <Image src={icon.image} alt={icon.label} fill className="object-contain" />
                                                                ) : (
                                                                    icon.icon && <icon.icon size={16} className="text-gray-500" />
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-600 font-bold uppercase">{icon.label}</span>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Aucun allergène majeur déclaré</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/contact" className="text-gray-500 hover:text-[#D4AF37] underline transition-colors">
                        ← Retour au formulaire
                    </Link>
                </div>
            </div>
        </main>
    );
}
