"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Check, Plus, Minus, ShoppingCart, ArrowDown,
    Utensils, ChefHat, Info, Award, Heart, ChevronDown
} from "lucide-react";

import {
    FORMULES_FETES,
    CARTE_FETES_ITEMS,
    CARTE_CATEGORIES,
    FestiveFormule,
    CarteItem,
    CarteCategoryKey
} from "../data/menus-fetes";
import { useCart, CartItem } from "../hooks/useCart";

export default function MenusFetesPage() {
    const { addToCart } = useCart();

    // Formule actuellement sélectionnée dans le configurateur
    const [selectedFormuleId, setSelectedFormuleId] = useState<string>("formule-reveillon");

    // Sélections pour chaque formule : { [formuleId]: { [stepId]: string | string[] } }
    const [formuleSelections, setFormuleSelections] = useState<Record<string, Record<string, string | string[]>>>(() => {
        const initial: Record<string, Record<string, string | string[]>> = {};
        FORMULES_FETES.forEach(formule => {
            initial[formule.id] = {};
            formule.steps.forEach(step => {
                if (step.selectionType === 'single') {
                    initial[formule.id][step.id] = step.options[0]?.id || "";
                } else if (step.selectionType === 'multiple_2') {
                    // Par défaut les 2 premiers
                    initial[formule.id][step.id] = [step.options[0]?.id, step.options[1]?.id].filter(Boolean);
                } else if (step.selectionType === 'fixed') {
                    initial[formule.id][step.id] = step.options[0]?.id || "";
                }
            });
        });
        return initial;
    });

    // Quantité (nombre de convives) pour chaque formule
    const [formuleQuantities, setFormuleQuantities] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        FORMULES_FETES.forEach(f => { initial[f.id] = 2; }); // Défaut 2 convives
        return initial;
    });

    // Quantités sélectionnées pour chaque article à la carte : { [itemId]: number }
    const [carteQuantities, setCarteQuantities] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        CARTE_FETES_ITEMS.forEach(item => { initial[item.id] = 1; });
        return initial;
    });

    // Filtre de catégorie pour la carte libre ('all' ou catégorie spécifique)
    const [activeCarteCategory, setActiveCarteCategory] = useState<CarteCategoryKey | 'all'>('all');

    // Notification toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Synchronisation avec l'URL (?formule=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const f = params.get("formule");
        if (f && FORMULES_FETES.some(item => item.id === f)) {
            setSelectedFormuleId(f);
        }
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Gestionnaires sélections Formules
    const handleSingleChoice = (formuleId: string, stepId: string, optionId: string) => {
        setFormuleSelections(prev => ({
            ...prev,
            [formuleId]: {
                ...prev[formuleId],
                [stepId]: optionId
            }
        }));
    };

    const handleMultiple2Choice = (formuleId: string, stepId: string, optionId: string) => {
        setFormuleSelections(prev => {
            const current = (prev[formuleId]?.[stepId] as string[]) || [];
            let updated: string[];

            if (current.includes(optionId)) {
                if (current.length > 1) {
                    updated = current.filter(id => id !== optionId);
                } else {
                    updated = current;
                }
            } else {
                if (current.length < 2) {
                    updated = [...current, optionId];
                } else {
                    updated = [current[1], optionId];
                }
            }

            return {
                ...prev,
                [formuleId]: {
                    ...prev[formuleId],
                    [stepId]: updated
                }
            };
        });
    };

    const handleFormuleQuantityDelta = (formuleId: string, delta: number) => {
        setFormuleQuantities(prev => ({
            ...prev,
            [formuleId]: Math.max(1, (prev[formuleId] || 1) + delta)
        }));
    };

    const handleSelectFormuleToConfigure = (formuleId: string) => {
        setSelectedFormuleId(formuleId);
        // Défilement doux vers le configurateur
        const configElement = document.getElementById("configurateur-formule");
        if (configElement) {
            configElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleAddFormuleToCart = (formule: FestiveFormule) => {
        const selections = formuleSelections[formule.id] || {};
        const qty = formuleQuantities[formule.id] || 1;

        // Résumé des services
        const coursesSummary: string[] = [];

        formule.steps.forEach(step => {
            const val = selections[step.id];
            if (Array.isArray(val)) {
                const titles = val.map(id => step.options.find(o => o.id === id)?.title).filter(Boolean);
                coursesSummary.push(`${step.stepTitle.replace(/^\d+\s*/, '')}: ${titles.join(' + ')}`);
            } else if (typeof val === 'string') {
                const opt = step.options.find(o => o.id === val) || step.fixedItem;
                if (opt) {
                    coursesSummary.push(`${step.stepTitle.replace(/^\d+\s*/, '')}: ${opt.title}`);
                }
            }
        });

        const selectionHash = Object.values(selections)
            .map(v => Array.isArray(v) ? v.sort().join('_') : v)
            .join('-');
        const cartItemId = `${formule.id}-${selectionHash}`;

        const cartItem: CartItem = {
            id: cartItemId,
            semaineId: "menus-fetes",
            jour: "Réveillon",
            nomPlat: `${formule.title} (${formule.price}€)`,
            prixUnitairePlat: formule.price,
            quantitePlat: qty,
            soupes: {},
            prixUnitaireSoupe: 0,
            prixTotalLigne: formule.price * qty,
            itemType: "menu_fete",
            badge: "Formule Fêtes",
            coursesSummary
        };

        addToCart(cartItem);
        showToast(`${qty}x "${formule.title}" ajouté(s) à votre commande !`);
    };

    // Gestionnaires Carte Libre
    const handleCarteQuantityDelta = (itemId: string, delta: number) => {
        setCarteQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
        }));
    };

    const handleAddCarteItemToCart = (item: CarteItem) => {
        const qty = carteQuantities[item.id] || 1;

        const cartItem: CartItem = {
            id: item.id,
            semaineId: "menus-fetes",
            jour: "Réveillon",
            nomPlat: item.title,
            prixUnitairePlat: item.price,
            quantitePlat: qty,
            soupes: {},
            prixUnitaireSoupe: 0,
            prixTotalLigne: item.price * qty,
            itemType: "menu_fete",
            badge: item.categoryLabel,
            coursesSummary: [
                `Catégorie : ${item.categoryLabel}`,
                `Prix unitaire : ${item.priceFormatted} TVAC`
            ]
        };

        addToCart(cartItem);
        showToast(`${qty}x "${item.title}" ajouté(s) au panier !`);
    };

    const currentFormule = FORMULES_FETES.find(f => f.id === selectedFormuleId) || FORMULES_FETES[0];

    const filteredCarteItems = activeCarteCategory === 'all'
        ? CARTE_FETES_ITEMS
        : CARTE_FETES_ITEMS.filter(item => item.category === activeCarteCategory);

    return (
        <main className="min-h-screen bg-[#FAF9F6] text-[#111111] font-sans selection:bg-[#D4AF37] selection:text-white pt-28 md:pt-36 pb-24 relative overflow-hidden">

            {/* Notification Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] bg-black/95 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-[#D4AF37]/50 backdrop-blur-md"
                    >
                        <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-xs">✓</span>
                        <span className="text-xs sm:text-sm font-medium tracking-wide">{toastMessage}</span>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-cart-drawer'))}
                            className="ml-2 text-xs text-[#D4AF37] hover:underline font-semibold"
                        >
                            Voir le panier →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Décoration d'arrière-plan dorée */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ==================================================== */}
                {/* 1. HERO HEADER - AMBIANCE NOËL & RÉVEILLON           */}
                {/* ==================================================== */}
                <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#927116] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4">
                        <Sparkles size={13} className="text-[#D4AF37]" />
                        <span>Maison Compère • Réveillon 2026</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-black tracking-tight mb-4 font-bold">
                        Menus des Fêtes
                    </h1>

                    <p className="font-serif italic text-neutral-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        &ldquo;Pour vos réveillons de Noël et de Nouvel An, savourez l&apos;art de recevoir sans le stress des préparatifs.&rdquo;
                    </p>

                    {/* BANDEAU PROMOTION EARLY BIRD (-5%) */}
                    <div className="mt-8 bg-gradient-to-r from-neutral-900 via-black to-neutral-900 text-white rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#D4AF37] text-black font-serif font-bold text-xs sm:text-sm px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                                    Offre -5%*
                                </span>
                                <div>
                                    <p className="font-serif font-bold text-sm sm:text-base text-white">
                                        Avantage Réservation Anticipée
                                    </p>
                                    <p className="text-xs text-neutral-300 font-light mt-0.5">
                                        *<strong>-5% appliqués automatiquement</strong> sur toute commande validée jusqu&apos;au <strong>1er décembre 2026</strong>.
                                    </p>
                                </div>
                            </div>
                            <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4 shrink-0">
                                Noël & Nouvel An
                            </div>
                        </div>
                    </div>

                    {/* NAVIGATION RAPIDE PAR ANCRES */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        <a
                            href="#formules-festives"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-[#D4AF37] hover:bg-neutral-800 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                        >
                            <Sparkles size={14} />
                            <span>1. Les 3 Formules Festives</span>
                        </a>
                        <a
                            href="#carte-fetes"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-800 hover:text-black hover:border-[#D4AF37] border border-neutral-300 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-2xs"
                        >
                            <Utensils size={14} />
                            <span>2. La Carte Libre & Suppléments</span>
                            <ArrowDown size={13} className="text-[#D4AF37]" />
                        </a>
                    </div>
                </header>

                {/* ==================================================== */}
                {/* PREMIER TEMPS : LES 3 FORMULES FESTIVES (CLÉ EN MAIN)*/}
                {/* ==================================================== */}
                <section id="formules-festives" className="scroll-mt-32 space-y-10">

                    {/* En-tête de section Formules */}
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full">
                            Menu Complet Clé en Main
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black mt-3 mb-2 font-bold">
                            Nos 3 Formules Festives
                        </h2>
                        <p className="font-serif italic text-neutral-600 text-sm sm:text-base">
                            Choisissez votre formule, personnalisez les plats pour vos convives et profitez d&apos;un réveillon gastronomique sans stress.
                        </p>
                    </div>

                    {/* LES 3 CARTES CÔTE À CÔTE (GRILLE 3 COLONNES) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                        {FORMULES_FETES.map((formule) => {
                            const isConfiguring = selectedFormuleId === formule.id;

                            return (
                                <div
                                    key={formule.id}
                                    className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative bg-white border-2 ${
                                        isConfiguring
                                            ? 'border-[#D4AF37] shadow-2xl ring-4 ring-[#D4AF37]/15 -translate-y-1'
                                            : 'border-neutral-200/90 hover:border-[#D4AF37]/60 shadow-md hover:shadow-xl'
                                    }`}
                                >
                                    {/* En-tête carte */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-2.5 py-1 rounded-full">
                                                {formule.badge}
                                            </span>
                                            <span className="text-[11px] font-serif font-bold text-neutral-500 uppercase tracking-wider">
                                                {formule.tagline}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black mb-1">
                                            {formule.title}
                                        </h3>
                                        <p className="font-serif italic text-xs sm:text-sm text-neutral-500 mb-4 min-h-[2.5rem]">
                                            {formule.subtitle}
                                        </p>

                                        {/* Prix & Badge -5% */}
                                        <div className="flex items-baseline gap-2 mb-5 pb-5 border-b border-neutral-100">
                                            <span className="font-serif text-3xl sm:text-4xl font-bold text-black">
                                                {formule.price} €
                                            </span>
                                            <span className="text-xs text-neutral-500 font-medium">
                                                / convive TVAC
                                            </span>
                                            <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                                                -5%*
                                            </span>
                                        </div>

                                        {/* Composition détaillée des services */}
                                        <div className="space-y-3.5 mb-8">
                                            <p className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
                                                Composition du menu :
                                            </p>
                                            {formule.steps.map((st, sIdx) => (
                                                <div key={sIdx} className="text-xs bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-150">
                                                    <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-0.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                                        <span>{st.stepTitle}</span>
                                                    </div>
                                                    <p className="text-neutral-500 font-serif italic text-[11px] pl-3 leading-snug">
                                                        {st.selectionType === 'fixed'
                                                            ? st.fixedItem?.title
                                                            : st.options.map(o => o.title).join(' • ')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bouton d'action pour configurer cette formule */}
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSelectFormuleToConfigure(formule.id)}
                                            className={`w-full py-3.5 px-4 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                                                isConfiguring
                                                    ? 'bg-[#D4AF37] text-black shadow-md'
                                                    : 'bg-black text-white hover:bg-[#D4AF37] hover:text-black'
                                            }`}
                                        >
                                            <ChefHat size={15} />
                                            <span>{isConfiguring ? 'Personnalisation en cours' : 'Choisir & Personnaliser'}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CONFIGURATEUR INTERACTIF DE LA FORMULE SÉLECTIONNÉE */}
                    <div id="configurateur-formule" className="bg-white rounded-3xl border-2 border-[#D4AF37] shadow-xl p-6 sm:p-10 md:p-12 relative scroll-mt-28">

                        {/* Onglets de sélection directe de la formule dans le configurateur */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 pb-6 border-b border-neutral-100">
                            <span className="text-xs uppercase tracking-wider font-bold text-neutral-400 mr-2 hidden sm:inline">
                                Formule active :
                            </span>
                            {FORMULES_FETES.map((f) => {
                                const isFSelected = selectedFormuleId === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setSelectedFormuleId(f.id)}
                                        className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider font-serif uppercase transition-all ${
                                            isFSelected
                                                ? 'bg-black text-[#D4AF37] shadow-md scale-105'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                        }`}
                                    >
                                        {f.title} ({f.price} €)
                                    </button>
                                );
                            })}
                        </div>

                        {/* En-tête du configurateur */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-100">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#927116] mb-1">
                                    <ChefHat size={15} />
                                    <span>Étape de personnalisation</span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-serif text-black font-bold">
                                    {currentFormule.title}
                                </h3>
                                <p className="font-serif italic text-sm text-neutral-500 mt-1">
                                    {currentFormule.subtitle}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 bg-[#FAF9F6] p-3.5 rounded-2xl border border-neutral-200 self-start md:self-center">
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="font-serif text-2xl sm:text-3xl font-bold text-black">
                                            {currentFormule.price} €
                                        </span>
                                        <span className="bg-black text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            -5%*
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-neutral-500 block">par convive TVAC</span>
                                </div>
                            </div>
                        </div>

                        {/* ÉTAPES DE SÉLECTION DES PLATS */}
                        <div className="space-y-6">
                            {currentFormule.steps.map((step) => {
                                const currentSelection = formuleSelections[currentFormule.id]?.[step.id];

                                return (
                                    <div key={step.id} className="bg-[#FAF9F6]/80 rounded-2xl p-5 sm:p-6 border border-neutral-200/80">
                                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-6 h-6 rounded-full bg-black text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                                                    {step.stepNumber}
                                                </span>
                                                <h4 className="font-serif font-bold text-base sm:text-lg text-black">
                                                    {step.stepTitle}
                                                </h4>
                                            </div>

                                            {step.selectionType === 'multiple_2' && (
                                                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#927116]">
                                                    {Array.isArray(currentSelection) ? currentSelection.length : 0}/2 zakouskis choisis
                                                </span>
                                            )}

                                            {step.selectionType === 'fixed' && (
                                                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                                                    Inclus d&apos;office
                                                </span>
                                            )}
                                        </div>

                                        {/* Grille des options du step */}
                                        {step.selectionType === 'fixed' ? (
                                            <div className="bg-white p-4 rounded-xl border-2 border-[#D4AF37]/50 flex items-start gap-3 shadow-xs">
                                                <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                                                    ✓
                                                </div>
                                                <div>
                                                    <p className="font-serif font-bold text-neutral-900 text-base">
                                                        {step.fixedItem?.title}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 font-serif italic mt-0.5">
                                                        {step.fixedItem?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`grid grid-cols-1 ${step.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                                                {step.options.map((option) => {
                                                    const isSelected = step.selectionType === 'multiple_2'
                                                        ? Array.isArray(currentSelection) && currentSelection.includes(option.id)
                                                        : currentSelection === option.id;

                                                    return (
                                                        <div
                                                            key={option.id}
                                                            onClick={() => {
                                                                if (step.selectionType === 'multiple_2') {
                                                                    handleMultiple2Choice(currentFormule.id, step.id, option.id);
                                                                } else {
                                                                    handleSingleChoice(currentFormule.id, step.id, option.id);
                                                                }
                                                            }}
                                                            className={`cursor-pointer p-4 rounded-xl transition-all duration-200 border text-left flex flex-col justify-between ${
                                                                isSelected
                                                                    ? 'bg-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-sm'
                                                                    : 'bg-white/70 border-neutral-200 hover:border-[#D4AF37]/40 hover:bg-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <p className="font-serif font-bold text-sm sm:text-base text-neutral-900 leading-snug">
                                                                    {option.title}
                                                                </p>
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                                                    isSelected
                                                                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black text-xs font-bold'
                                                                        : 'border-neutral-300'
                                                                }`}>
                                                                    {isSelected && '✓'}
                                                                </div>
                                                            </div>

                                                            {option.description && (
                                                                <p className="text-xs text-neutral-500 font-serif italic leading-relaxed">
                                                                    {option.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* BARRE D'ACTION : QUANTITÉ & AJOUT AU PANIER */}
                        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FAF9F6] -mx-6 sm:-mx-10 md:-mx-12 -mb-6 sm:-mb-10 md:-mb-12 p-6 sm:p-8 rounded-b-3xl">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-neutral-500 block mb-1 font-bold">
                                    Nombre de convives
                                </span>
                                <div className="inline-flex items-center gap-3 bg-white border border-neutral-300 px-3 py-1.5 rounded-full shadow-xs">
                                    <button
                                        onClick={() => handleFormuleQuantityDelta(currentFormule.id, -1)}
                                        className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold transition-colors"
                                        aria-label="Diminuer le nombre de convives"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="font-serif font-bold text-lg text-black w-8 text-center">
                                        {formuleQuantities[currentFormule.id] || 1}
                                    </span>
                                    <button
                                        onClick={() => handleFormuleQuantityDelta(currentFormule.id, 1)}
                                        className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold transition-colors"
                                        aria-label="Augmenter le nombre de convives"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <div className="text-center sm:text-right">
                                    <div className="flex items-baseline justify-center sm:justify-end gap-2">
                                        <span className="text-xs text-neutral-500 font-semibold uppercase">Total formule :</span>
                                        <span className="font-serif text-3xl font-bold text-black">
                                            {((formuleQuantities[currentFormule.id] || 1) * currentFormule.price).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-[#927116] font-medium block">
                                        Remise -5%* déduite lors de la finalisation
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleAddFormuleToCart(currentFormule)}
                                    className="w-full sm:w-auto bg-black hover:bg-[#D4AF37] text-white hover:text-black px-8 py-4 rounded-full font-serif font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
                                >
                                    <ShoppingCart size={18} />
                                    <span>Ajouter la formule au panier</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================================================== */}
                {/* DEUXIÈME TEMPS : LA CARTE LIBRE & PLATS INDIVIDUELS  */}
                {/* ==================================================== */}
                <section id="carte-fetes" className="mt-20 sm:mt-28 pt-16 border-t-2 border-[#D4AF37]/30 scroll-mt-28 space-y-10">

                    {/* En-tête de section Carte */}
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full">
                            Choix Libre à la Pièce
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black mt-3 mb-2 font-bold">
                            La Carte de Fêtes
                        </h2>
                        <p className="font-serif italic text-neutral-600 text-sm sm:text-base">
                            Composez votre repas sur-mesure ou complétez vos formules : zakouskis apéritifs, entrées raffinées, plats nobles, desserts et fromages du terroir.
                        </p>
                    </div>

                    {/* Filtres de catégorie rapides */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                        <button
                            onClick={() => setActiveCarteCategory('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                                activeCarteCategory === 'all'
                                    ? 'bg-black text-[#D4AF37] shadow-sm scale-105'
                                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#D4AF37]'
                            }`}
                        >
                            Tous les plats
                        </button>
                        {CARTE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCarteCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                                    activeCarteCategory === cat.id
                                        ? 'bg-black text-[#D4AF37] shadow-sm scale-105'
                                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#D4AF37]'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Parcourir chaque catégorie de la carte */}
                    <div className="space-y-12">
                        {CARTE_CATEGORIES.filter(cat => activeCarteCategory === 'all' || activeCarteCategory === cat.id).map(category => {
                            const items = CARTE_FETES_ITEMS.filter(item => item.category === category.id);
                            if (items.length === 0) return null;

                            return (
                                <div key={category.id} className="space-y-5">
                                    {/* Titre de catégorie de la carte */}
                                    <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{category.icon}</span>
                                            <div>
                                                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black">
                                                    {category.label}
                                                </h3>
                                                <p className="text-xs text-neutral-500 font-serif italic mt-0.5">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs uppercase tracking-widest font-bold text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full hidden sm:inline">
                                            {category.unitPriceLabel}
                                        </span>
                                    </div>

                                    {/* Grille des articles de la catégorie */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                        {items.map(item => {
                                            const qty = carteQuantities[item.id] || 1;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-[#D4AF37]/60 hover:shadow-md transition-all flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <div className="flex items-baseline justify-between gap-2 mb-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-serif font-bold text-xl text-black">
                                                                    {item.priceFormatted}
                                                                </span>
                                                                <span className="text-[11px] text-neutral-400 font-sans">
                                                                    / {item.unitLabel}
                                                                </span>
                                                            </div>
                                                            <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                                -5%*
                                                            </span>
                                                        </div>

                                                        <h4 className="font-serif font-bold text-base sm:text-lg text-neutral-900 leading-snug mb-2">
                                                            {item.title}
                                                        </h4>

                                                        {item.description && (
                                                            <p className="text-xs text-neutral-500 font-serif italic leading-relaxed mb-4">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Sélecteur de quantité & Ajout au panier */}
                                                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3 mt-2">
                                                        <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-200/90 px-2 py-1 rounded-full">
                                                            <button
                                                                onClick={() => handleCarteQuantityDelta(item.id, -1)}
                                                                className="w-6 h-6 rounded-full bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs transition-colors shadow-2xs"
                                                                aria-label="Diminuer la quantité"
                                                            >
                                                                <Minus size={11} />
                                                            </button>
                                                            <span className="font-bold text-xs text-neutral-900 w-5 text-center">
                                                                {qty}
                                                            </span>
                                                            <button
                                                                onClick={() => handleCarteQuantityDelta(item.id, 1)}
                                                                className="w-6 h-6 rounded-full bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs transition-colors shadow-2xs"
                                                                aria-label="Augmenter la quantité"
                                                            >
                                                                <Plus size={11} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleAddCarteItemToCart(item)}
                                                            className="flex-1 bg-black hover:bg-[#D4AF37] text-white hover:text-black py-2 px-3 rounded-full font-serif font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs"
                                                        >
                                                            <ShoppingCart size={13} />
                                                            <span>Ajouter</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ==================================================== */}
                {/* 3. MENTION EXACTE DU FLYER & INFOS PRATIQUES          */}
                {/* ==================================================== */}
                <div className="mt-16 sm:mt-24 pt-10 border-t border-[#D4AF37]/30 text-center space-y-6">
                    {/* Mention officielle demandée au cahier des charges */}
                    <div className="inline-block bg-white px-6 sm:px-10 py-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
                        <p className="font-serif italic font-semibold text-neutral-800 text-sm sm:text-base tracking-wide">
                            &ldquo;Tout est préparé maison • bûchettes de chez La Pavée • prix par personne&rdquo;
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 text-neutral-600 text-xs sm:text-sm">
                        <div className="bg-white/80 p-5 rounded-2xl border border-neutral-200">
                            <h4 className="font-serif font-bold text-black uppercase tracking-wider text-xs mb-2">
                                📅 Retrait à l&apos;atelier
                            </h4>
                            <p className="text-neutral-500 font-light leading-relaxed">
                                Les 23 ou 24 Décembre pour Noël.<br />
                                Les 30 ou 31 Décembre pour Nouvel An.<br />
                                Rue Potay 3, 4470 Saint-Georges.
                            </p>
                        </div>

                        <div className="bg-white/80 p-5 rounded-2xl border border-neutral-200">
                            <h4 className="font-serif font-bold text-black uppercase tracking-wider text-xs mb-2">
                                ✨ Avantage -5%*
                            </h4>
                            <p className="text-neutral-500 font-light leading-relaxed">
                                Remise automatique de -5% pour toute commande confirmée par acompte avant le 1er décembre 2026.
                            </p>
                        </div>

                        <div className="bg-white/80 p-5 rounded-2xl border border-neutral-200">
                            <h4 className="font-serif font-bold text-black uppercase tracking-wider text-xs mb-2">
                                💳 Acompte & Paiement
                            </h4>
                            <p className="text-neutral-500 font-light leading-relaxed">
                                Possibilité de valider avec un acompte de 30% par virement bancaire pour bloquer la date et la réduction.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
