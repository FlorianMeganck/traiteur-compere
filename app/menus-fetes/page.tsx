"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sparkles, Calendar, Gift, ShoppingCart, Plus, Minus, Check, 
    UtensilsCrossed, Clock, CreditCard, ChevronRight, ShieldCheck, Flame
} from "lucide-react";

import { MENUS_FETES_DATA, FestiveMenu } from "../data/menus-fetes";
import { useCart, CartItem } from "../hooks/useCart";

export default function MenusFetes() {
    const { addToCart, cartItems, cartTotal, totalItems } = useCart();
    
    // État local des quantités pour chaque carte de menu
    const [quantities, setQuantities] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        MENUS_FETES_DATA.forEach(m => initial[m.id] = 1);
        return initial;
    });

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleQuantityChange = (menuId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [menuId]: Math.max(1, (prev[menuId] || 1) + delta)
        }));
    };

    const handleAddMenuToCart = (menu: FestiveMenu) => {
        const qty = quantities[menu.id] || 1;
        const item: CartItem = {
            id: menu.id,
            semaineId: "menus-fetes",
            jour: menu.badge,
            nomPlat: menu.title,
            prixUnitairePlat: menu.price,
            quantitePlat: qty,
            soupes: {},
            prixUnitaireSoupe: 0,
            prixTotalLigne: menu.price * qty,
            itemType: "menu_fete",
            badge: menu.badge,
            coursesSummary: menu.courses.map(c => `${c.courseName}: ${c.title}`)
        };

        addToCart(item);
        setToastMessage(`${qty}x "${menu.title}" ajouté(s) à votre panier !`);
        setTimeout(() => setToastMessage(null), 4000);

        // Ouvre automatiquement le panier latéral
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("open-cart-drawer"));
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-[#D4AF37] selection:text-white pt-28 md:pt-36 pb-24 relative overflow-hidden">
            
            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-black text-white border border-[#D4AF37] px-6 py-3.5 rounded-full shadow-2xl text-sm font-medium flex items-center gap-3"
                    >
                        <span className="text-[#D4AF37] text-lg">✨</span>
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HERO SECTION FESTIVE --- */}
            <section className="relative bg-[#0F0F0F] text-white py-20 md:py-28 px-6 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-2xl">
                {/* Texture dorée d'arrière-plan */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative max-w-5xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs md:text-sm uppercase tracking-widest font-semibold"
                    >
                        <Gift size={16} /> Menus Gastronomiques de Réveillon 2026
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight"
                    >
                        La Magie des Fêtes <br />
                        <span className="text-[#D4AF37] italic">signée Traiteur Compère</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-2xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        Profitez pleinement de vos convives. Notre brigade élabore pour vos réveillons de Noël et Nouvel An des menus d'exception à emporter et réchauffer en toute simplicité.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="pt-4 flex flex-wrap justify-center gap-4"
                    >
                        <a
                            href="#menus"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#c29f2e] transition-all shadow-xl hover:scale-105"
                        >
                            Découvrir nos menus
                            <ChevronRight size={18} />
                        </a>
                        <Link
                            href="/contact?type=menus_fetes"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-all"
                        >
                            Demande personnalisée
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-16 relative z-20">

                {/* --- COMMENT ÇA FONCTIONNE (4 ÉTAPES) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold font-serif text-xl mb-4">
                                1
                            </div>
                            <h3 className="font-serif font-bold text-xl text-black mb-2">Composez votre table</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Choisissez parmi nos compositions festives (Noël, Saint-Sylvestre, Prestige ou Enfant).
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold font-serif text-xl mb-4">
                                2
                            </div>
                            <h3 className="font-serif font-bold text-xl text-black mb-2">Validation en ligne</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Ajoutez au panier, indiquez vos coordonnées et vos éventuelles allergies alimentaires.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold font-serif text-xl mb-4">
                                3
                            </div>
                            <h3 className="font-serif font-bold text-xl text-black mb-2">Paiement & Confirmation</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Virement SEPA sécurisé (QR code instantané). Commande validée dès réception du paiement.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold font-serif text-xl mb-4">
                                4
                            </div>
                            <h3 className="font-serif font-bold text-xl text-black mb-2">Retrait & Dégustation</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Retrait le 24 ou 31 décembre à l'atelier avec fiche d'instructions de réchauffage pas-à-pas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- SECTION DES MENUS --- */}
                <div id="menus" className="scroll-mt-36 mb-24">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                            CARTE DES RÉVEILLONS 2026
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-black">
                            Nos Menus Festifs à la Carte
                        </h2>
                        <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full mt-4"></div>
                        <p className="text-neutral-500 max-w-xl mx-auto font-light text-base">
                            Tous nos plats sont préparés artisanalement dans notre atelier avec des matières premières d'exception.
                        </p>
                    </div>

                    {/* Grille des menus */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {MENUS_FETES_DATA.map((menu) => {
                            const qty = quantities[menu.id] || 1;
                            const totalLinePrice = menu.price * qty;

                            return (
                                <motion.div
                                    key={menu.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative"
                                >
                                    {/* Image d'en-tête */}
                                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                                        <Image
                                            src={menu.image}
                                            alt={menu.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-6">
                                            <div className="flex justify-between items-start">
                                                <span className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                                                    {menu.badge}
                                                </span>
                                                {menu.isPopular && (
                                                    <span className="bg-white/90 backdrop-blur-md text-black font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow">
                                                        <Sparkles size={12} className="text-[#D4AF37]" /> Coup de cœur
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-serif text-white leading-snug">
                                                    {menu.title}
                                                </h3>
                                                <p className="text-neutral-300 text-sm font-light mt-1">
                                                    {menu.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corps de la carte : Déroulé du menu */}
                                    <div className="p-6 sm:p-8 space-y-6 flex-1 bg-white">
                                        <div className="space-y-4">
                                            {menu.courses.map((course, idx) => (
                                                <div key={idx} className="border-b border-neutral-100 last:border-0 pb-3.5 last:pb-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[11px] uppercase tracking-widest font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-md">
                                                            {course.courseName}
                                                        </span>
                                                        <h4 className="font-serif font-bold text-neutral-900 text-base sm:text-lg">
                                                            {course.title}
                                                        </h4>
                                                    </div>
                                                    {course.description && (
                                                        <p className="text-neutral-500 text-xs sm:text-sm pl-2 italic">
                                                            {course.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Notice de retrait */}
                                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 text-xs text-neutral-600">
                                            <Clock size={16} className="text-[#D4AF37] shrink-0" />
                                            <span>
                                                <strong>Retrait :</strong> {menu.pickupDates.join(" ou ")}.
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pied de carte : Sélecteur quantité et ajout panier */}
                                    <div className="p-6 sm:p-8 bg-neutral-50 border-t border-neutral-100 space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div>
                                                <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block">Prix par convive</span>
                                                <span className="text-3xl font-serif font-bold text-[#D4AF37]">{menu.priceFormatted}</span>
                                            </div>

                                            {/* Contrôleur Quantité */}
                                            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-neutral-200 shadow-sm">
                                                <span className="text-xs text-neutral-500 font-medium">Couverts :</span>
                                                <button
                                                    onClick={() => handleQuantityChange(menu.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 hover:bg-black hover:text-white transition-colors disabled:opacity-40"
                                                    disabled={qty <= 1}
                                                    aria-label="Diminuer"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-6 text-center font-bold text-base text-black">{qty}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(menu.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 hover:bg-black hover:text-white transition-colors"
                                                    aria-label="Augmenter"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bouton Ajouter au Panier */}
                                        <button
                                            onClick={() => handleAddMenuToCart(menu)}
                                            className="w-full bg-black hover:bg-[#D4AF37] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-wider text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                                        >
                                            <ShoppingCart size={18} />
                                            <span>Ajouter au panier • {totalLinePrice.toLocaleString("fr-BE", { minimumFractionDigits: 2 })} €</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* --- CONSEILS DU CHEF & RÉCHAUFFAGE --- */}
                <div className="bg-white rounded-3xl p-8 md:p-14 border border-neutral-200 shadow-md mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2 space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                                <Flame size={16} /> Service & Dégustation sans stress
                            </div>
                            <h3 className="text-2xl md:text-4xl font-serif text-black">
                                Prêt à réchauffer, facile à dresser
                            </h3>
                            <p className="text-neutral-600 leading-relaxed font-light">
                                Tous les menus sont conditionnés dans des contenants adaptés avec une notice explicative claire détaillée par notre chef (températures et temps de four, astuces de dressage pour épater vos invités).
                            </p>
                        </div>
                        <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-neutral-200 flex flex-col justify-center text-center space-y-3">
                            <ShieldCheck size={36} className="mx-auto text-[#D4AF37]" />
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider">Fraîcheur & DLC Garantie</h4>
                            <p className="text-neutral-500 text-xs leading-normal">
                                Préparé le jour même du retrait, conservation garantie jusqu'à 48h au réfrigérateur.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- BANNIÈRE DE CONTACT PERSONNALISÉ --- */}
                <div className="bg-[#111111] text-white rounded-3xl p-8 md:p-14 text-center space-y-6 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <Sparkles className="mx-auto text-[#D4AF37]" size={36} />
                    <h3 className="text-3xl md:text-4xl font-serif text-white">
                        Vous organisez une grande réception ou un repas sur-mesure ?
                    </h3>
                    <p className="text-neutral-300 max-w-2xl mx-auto font-light text-base md:text-lg">
                        Notre équipe s'adapte à vos envies : menus végétariens, sélection de vins d'exception ou service à table par notre maître d'hôtel.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-wider text-sm transition-all"
                        >
                            Contactez notre service traiteur
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
