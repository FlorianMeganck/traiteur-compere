"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Gift, ShoppingCart, Plus, Minus, Check,
    Clock, ChevronRight, ShieldCheck, Flame, Utensils
} from "lucide-react";

import { MENUS_FETES_DATA, FestiveMenu, MenuOption } from "../data/menus-fetes";
import { useCart, CartItem } from "../hooks/useCart";

type CourseKey = 'entrees' | 'potages' | 'plats' | 'desserts';

interface MenuSelections {
    entrees?: string;
    potages?: string;
    plats?: string;
    desserts?: string;
}

export default function MenusFetes() {
    const { addToCart } = useCart();

    // État local des quantités pour chaque carte de menu
    const [quantities, setQuantities] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        MENUS_FETES_DATA.forEach(m => initial[m.id] = 1);
        return initial;
    });

    // État des options sélectionnées pour chaque menu (pré-sélectionnées par défaut sur le 1er choix)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, MenuSelections>>(() => {
        const initial: Record<string, MenuSelections> = {};
        MENUS_FETES_DATA.forEach(menu => {
            initial[menu.id] = {
                entrees: menu.courses.entrees[0]?.id,
                potages: menu.courses.potages?.[0]?.id,
                plats: menu.courses.plats[0]?.id,
                desserts: menu.courses.desserts[0]?.id,
            };
        });
        return initial;
    });

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleQuantityChange = (menuId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [menuId]: Math.max(1, (prev[menuId] || 1) + delta)
        }));
    };

    const handleSelectOption = (menuId: string, courseKey: CourseKey, optionId: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [menuId]: {
                ...(prev[menuId] || {}),
                [courseKey]: optionId
            }
        }));
    };

    const handleAddMenuToCart = (menu: FestiveMenu) => {
        const selections = selectedOptions[menu.id] || {};
        const selectedEntree = menu.courses.entrees.find(o => o.id === selections.entrees);
        const selectedPotage = menu.courses.potages?.find(o => o.id === selections.potages);
        const selectedPlat = menu.courses.plats.find(o => o.id === selections.plats);
        const selectedDessert = menu.courses.desserts.find(o => o.id === selections.desserts);

        const hasPotageRequired = !!menu.courses.potages && menu.courses.potages.length > 0;
        const isComplete = !!selectedEntree && !!selectedPlat && !!selectedDessert && (!hasPotageRequired || !!selectedPotage);

        if (!isComplete) {
            setToastMessage("Veuillez sélectionner l'ensemble des services de votre menu.");
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        const coursesSummary: string[] = [
            `Entrée: ${selectedEntree.title}`,
            selectedPotage ? `Potage: ${selectedPotage.title}` : '',
            `Plat: ${selectedPlat.title}`,
            `Dessert: ${selectedDessert.title}`
        ].filter(Boolean);

        const uniqueCompositionId = `${menu.id}-${selectedEntree.id}-${selectedPotage?.id || 'none'}-${selectedPlat.id}-${selectedDessert.id}`;
        const qty = quantities[menu.id] || 1;

        const item: CartItem = {
            id: uniqueCompositionId,
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
            coursesSummary: coursesSummary
        };

        addToCart(item);
        setToastMessage(`${qty}x "${menu.title}" personnalisé ajouté(s) à votre panier !`);
        setTimeout(() => setToastMessage(null), 4000);

        // Ouvre automatiquement le panier latéral
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("open-cart-drawer"));
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-[#D4AF37] selection:text-white pt-28 md:pt-36 pb-20 relative overflow-hidden">

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

            {/* --- HERO SECTION FESTIVE (COMPACT) --- */}
            <section className="relative bg-[#0F0F0F] text-white py-12 md:py-16 px-6 overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem] shadow-2xl">
                {/* Texture dorée d'arrière-plan */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative max-w-4xl mx-auto text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold"
                    >
                        <Gift size={15} /> Menus Gastronomiques de Réveillon 2026
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight"
                    >
                        La Magie des Fêtes <br />
                        <span className="text-[#D4AF37] italic">signée Traiteur Compère</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Composez votre repas de réveillon sur mesure selon vos envies. Notre brigade élabore des créations d'exception prêtes à réchauffer et déguster en toute sérénité.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="pt-2 flex flex-wrap justify-center gap-3.5"
                    >
                        <a
                            href="#menus"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-[#c29f2e] transition-all shadow-xl hover:scale-105"
                        >
                            Composer nos menus
                            <ChevronRight size={16} />
                        </a>
                        <a
                            href="#retraits"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 text-white font-bold uppercase tracking-wider text-xs sm:text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5 transition-all shadow-md"
                        >
                            <Clock size={15} className="text-[#D4AF37]" />
                            Dates &amp; Modalités de retrait
                        </a>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-14 relative z-20">

                {/* --- COMMENT ÇA FONCTIONNE (4 ÉTAPES) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold font-serif text-xl mb-4">
                                1
                            </div>
                            <h3 className="font-serif font-bold text-xl text-black mb-2">Composez sur mesure</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Choisissez votre entrée, potage, plat principal et dessert parmi nos suggestions de fête.
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
                                Ajoutez au panier, choisissez vos dates de repas (Noël et/ou Nouvel An) et vos coordonnées.
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
                                Règlement sous 24h par virement SEPA ou QR code sécurisé pour valider votre réservation.
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
                                Retrait à l'atelier à Saint-Georges avec livret d'instructions de réchauffage pas-à-pas.
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
                            Nos Menus Festifs à Composer
                        </h2>
                        <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full mt-4"></div>
                        <p className="text-neutral-500 max-w-xl mx-auto font-light text-base">
                            Sélectionnez vos options pour chaque service (Entrée, Potage, Plat, Dessert) et composez votre menu d&apos;exception.
                        </p>
                    </div>

                    {/* Grille des menus */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {MENUS_FETES_DATA.map((menu) => {
                            const qty = quantities[menu.id] || 1;
                            const totalLinePrice = menu.price * qty;
                            const currentSelections = selectedOptions[menu.id] || {};

                            const allGroups: {
                                key: CourseKey;
                                name: string;
                                badgeNumber: string;
                                options: MenuOption[];
                            }[] = [
                                { key: 'entrees', name: 'Entrée', badgeNumber: '1er Service', options: menu.courses.entrees },
                                { key: 'potages', name: 'Potage', badgeNumber: '2ème Service', options: menu.courses.potages || [] },
                                { key: 'plats', name: 'Plat Principal', badgeNumber: '3ème Service', options: menu.courses.plats },
                                { key: 'desserts', name: 'Dessert', badgeNumber: '4ème Service', options: menu.courses.desserts },
                            ];
                            const courseGroups = allGroups.filter((g): g is { key: CourseKey; name: string; badgeNumber: string; options: MenuOption[] } => g.options.length > 0);

                            const isMenuComplete = courseGroups.every(g => !!currentSelections[g.key]);

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

                                    {/* Corps de la carte : Sélecteur d'options par service */}
                                    <div className="p-6 sm:p-8 space-y-7 flex-1 bg-white">
                                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                            <span className="text-xs uppercase tracking-widest font-bold text-neutral-800 flex items-center gap-2">
                                                <Utensils size={15} className="text-[#D4AF37]" /> Composition de votre menu :
                                            </span>
                                            <span className="text-xs text-[#D4AF37] font-semibold">
                                                {courseGroups.length} services inclus
                                            </span>
                                        </div>

                                        {/* Liste des groupes de services */}
                                        <div className="space-y-6">
                                            {courseGroups.map((group) => {
                                                const selectedOptionId = currentSelections[group.key];

                                                return (
                                                    <div key={group.key} className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                                                                    {group.badgeNumber}
                                                                </span>
                                                                <h4 className="font-serif font-bold text-neutral-900 text-sm sm:text-base">
                                                                    {group.name}
                                                                </h4>
                                                            </div>
                                                            <span className="text-[11px] text-neutral-400 font-medium">
                                                                1 choix parmi {group.options.length}
                                                            </span>
                                                        </div>

                                                        {/* Choix des options */}
                                                        <div className="grid grid-cols-1 gap-2.5">
                                                            {group.options.map((option) => {
                                                                const isSelected = selectedOptionId === option.id;

                                                                return (
                                                                    <div
                                                                        key={option.id}
                                                                        onClick={() => handleSelectOption(menu.id, group.key, option.id)}
                                                                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                                                            isSelected
                                                                                ? 'border-[#D4AF37] bg-amber-50/70 ring-1 ring-[#D4AF37]/50 shadow-2xs'
                                                                                : 'border-neutral-200 bg-white hover:border-[#D4AF37]/60 hover:bg-neutral-50/60'
                                                                        }`}
                                                                    >
                                                                        {/* Radio indicator */}
                                                                        <div className="mt-0.5 shrink-0">
                                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                                                                isSelected
                                                                                    ? 'border-[#D4AF37] bg-[#D4AF37]'
                                                                                    : 'border-neutral-300 bg-white'
                                                                            }`}>
                                                                                {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex-1 min-w-0">
                                                                            <h5 className={`text-xs sm:text-sm font-semibold leading-tight ${
                                                                                isSelected ? 'text-neutral-950 font-bold' : 'text-neutral-800'
                                                                            }`}>
                                                                                {option.title}
                                                                            </h5>
                                                                            {option.description && (
                                                                                <p className="text-xs sm:text-[13px] text-zinc-700 font-normal italic mt-1 leading-snug">
                                                                                    {option.description}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
                                            disabled={!isMenuComplete}
                                            className="w-full bg-black hover:bg-[#D4AF37] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-wider text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100"
                                        >
                                            <ShoppingCart size={18} />
                                            <span>
                                                {isMenuComplete
                                                    ? `Ajouter au panier • ${totalLinePrice.toLocaleString("fr-BE", { minimumFractionDigits: 2 })} €`
                                                    : "Veuillez choisir vos services"}
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* --- SECTION DATES & MODALITÉS DE RETRAIT --- */}
                <div id="retraits" className="scroll-mt-36 bg-white rounded-3xl p-8 md:p-14 border border-neutral-200 shadow-lg mb-24 space-y-8">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-full">
                            <Clock size={14} /> Organisation des Retraits
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif text-black">
                            Dates &amp; Horaires de Retrait à l&apos;Atelier
                        </h3>
                        <p className="text-neutral-500 font-light text-sm md:text-base">
                            Pour vous garantir une fraîcheur optimale et une fluidité maximale, les commandes de fête sont à retirer directement à notre atelier :
                        </p>
                        <p className="text-xs md:text-sm font-semibold text-neutral-800 flex items-center justify-center gap-1.5">
                            <span>📍</span> Rue Potay 3, 4470 Saint-Georges-sur-Meuse
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Encart Noël */}
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                                <h4 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                                    <span>🎄</span> Repas de Noël (24 &amp; 25 Décembre)
                                </h4>
                                <span className="text-[11px] bg-[#D4AF37] text-white font-bold px-2.5 py-1 rounded-full uppercase">Noël</span>
                            </div>
                            <div className="space-y-3 text-xs md:text-sm text-neutral-700">
                                <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5 shadow-2xs">
                                    <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                                    <div>
                                        <strong className="text-neutral-900">Pour le Réveillon (Mercredi 24 Décembre) :</strong><br/>
                                        Retrait possible le 23 Décembre (13h - 18h) OU le 24 Décembre (8h - 13h).
                                    </div>
                                </div>
                                <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5 shadow-2xs">
                                    <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                                    <div>
                                        <strong className="text-neutral-900">Pour le Jour de Noël (Jeudi 25 Décembre) :</strong><br/>
                                        Retrait possible le 24 Décembre (10h - 18h) OU le 25 Décembre (8h - 13h).
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Encart Nouvel An */}
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                                <h4 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                                    <span>🍾</span> Repas de Nouvel An (31 Déc. &amp; 1er Janv.)
                                </h4>
                                <span className="text-[11px] bg-black text-white font-bold px-2.5 py-1 rounded-full uppercase">Nouvel An</span>
                            </div>
                            <div className="space-y-3 text-xs md:text-sm text-neutral-700">
                                <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5 shadow-2xs">
                                    <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                                    <div>
                                        <strong className="text-neutral-900">Pour le Réveillon (Mercredi 31 Décembre) :</strong><br/>
                                        Retrait possible le 30 Décembre (13h - 18h) OU le 31 Décembre (8h - 13h).
                                    </div>
                                </div>
                                <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5 shadow-2xs">
                                    <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                                    <div>
                                        <strong className="text-neutral-900">Pour le Jour de l&apos;An (Jeudi 1er Janvier) :</strong><br/>
                                        Retrait possible le 31 Décembre (13h - 18h) OU le 1er Janvier (8h - 11h).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONSEILS DU CHEF & RÉCHAUFFAGE --- */}
                <div className="bg-white rounded-3xl p-8 md:p-14 border border-neutral-200 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2 space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                                <Flame size={16} /> Service &amp; Dégustation sans stress
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
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider">Fraîcheur &amp; DLC Garantie</h4>
                            <p className="text-neutral-500 text-xs leading-normal">
                                Préparé le jour même du retrait, conservation garantie jusqu&apos;à 48h au réfrigérateur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
