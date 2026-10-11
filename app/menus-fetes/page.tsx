"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Check, Plus, Minus, ShoppingCart, X,
    ChefHat, Calendar, Clock, MapPin, Award, FileText, ArrowRight,
    UtensilsCrossed, CreditCard
} from "lucide-react";

import {
    FORMULES_FETES,
    FestiveFormule,
    MenuOption
} from "../data/menus-fetes";
import { useCart, CartItem } from "../hooks/useCart";

export default function MenusFetesPage() {
    const { addToCart, totalItems } = useCart();

    // Modale de composition active (formule en cours de configuration)
    const [activeFormuleModal, setActiveFormuleModal] = useState<FestiveFormule | null>(null);

    // État de composition dans la modale : quantité et sélections
    const [modalQuantity, setModalQuantity] = useState<number>(1);
    const [modalSelections, setModalSelections] = useState<Record<string, string | string[]>>({});

    // Toast de confirmation discret après ajout
    const [addedConfirmation, setAddedConfirmation] = useState<{
        formuleTitle: string;
        quantity: number;
    } | null>(null);

    // Initialiser les sélections par défaut quand on ouvre une formule
    const handleOpenModal = (formule: FestiveFormule) => {
        const initialSelections: Record<string, string | string[]> = {};

        formule.steps.forEach(step => {
            if (step.selectionType === 'single') {
                initialSelections[step.id] = step.options[0]?.id || "";
            } else if (step.selectionType === 'multiple_2') {
                initialSelections[step.id] = [step.options[0]?.id, step.options[1]?.id].filter(Boolean);
            } else if (step.selectionType === 'fixed') {
                initialSelections[step.id] = step.options[0]?.id || "";
            }
        });

        setModalSelections(initialSelections);
        setModalQuantity(1);
        setActiveFormuleModal(formule);
    };

    // Synchronisation avec l'URL (?formule=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const f = params.get("formule");
        if (f) {
            const found = FORMULES_FETES.find(item => item.id === f);
            if (found) {
                handleOpenModal(found);
            }
        }
    }, []);

    const handleCloseModal = () => {
        setActiveFormuleModal(null);
    };

    // Gestion du choix unique (radio)
    const handleModalSingleChoice = (stepId: string, optionId: string) => {
        setModalSelections(prev => ({
            ...prev,
            [stepId]: optionId
        }));
    };

    // Gestion du choix multiple (2 zakouskis)
    const handleModalMultiple2Choice = (stepId: string, optionId: string) => {
        setModalSelections(prev => {
            const current = (prev[stepId] as string[]) || [];
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
                [stepId]: updated
            };
        });
    };

    // Valider et ajouter au panier
    const handleConfirmAddToCart = () => {
        if (!activeFormuleModal) return;

        // Extraire les noms courts choisis pour le résumé par convive
        // Format demandé : "Potiron / Foie gras / Pintadeau / Moka"
        const selectedDishesShort: string[] = [];
        const coursesSummaryLines: string[] = [];

        activeFormuleModal.steps.forEach(step => {
            const val = modalSelections[step.id];
            if (Array.isArray(val)) {
                const titles = val.map(id => {
                    const opt = step.options.find(o => o.id === id);
                    return opt ? opt.title.split(',')[0].replace(/\(.*?\)/g, '').trim() : '';
                }).filter(Boolean);
                selectedDishesShort.push(titles.join(' + '));
                coursesSummaryLines.push(`${step.stepTitle.replace(/^\d+\s*/, '')}: ${titles.join(' + ')}`);
            } else if (typeof val === 'string') {
                const opt = step.options.find(o => o.id === val) || step.fixedItem;
                if (opt) {
                    // Nom court et nettoyé
                    const shortName = opt.title.split(',')[0].replace(/\(.*?\)/g, '').trim();
                    selectedDishesShort.push(shortName);
                    coursesSummaryLines.push(`${step.stepTitle.replace(/^\d+\s*/, '')}: ${opt.title}`);
                }
            }
        });

        const coursesDescription = selectedDishesShort.join(' / ');

        // Hash représentatif pour regrouper les convives ayant la même configuration
        const selectionHash = Object.values(modalSelections)
            .map(v => Array.isArray(v) ? v.sort().join('_') : v)
            .join('-');
        const cartItemId = `${activeFormuleModal.id}-${selectionHash}`;

        const cartItem: CartItem = {
            id: cartItemId,
            semaineId: "menus-fetes",
            jour: "Réveillon",
            nomPlat: `${activeFormuleModal.title} (${activeFormuleModal.price}€)`,
            prixUnitairePlat: activeFormuleModal.price,
            quantitePlat: modalQuantity,
            soupes: {},
            prixUnitaireSoupe: 0,
            prixTotalLigne: activeFormuleModal.price * modalQuantity,
            itemType: "menu_fete",
            badge: "Formule Fêtes",
            coursesSummary: coursesSummaryLines,
            coursesDescription
        };

        addToCart(cartItem);

        // Enregistrer la confirmation discrète
        setAddedConfirmation({
            formuleTitle: activeFormuleModal.title,
            quantity: modalQuantity
        });

        // Fermer la modale
        setActiveFormuleModal(null);
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] text-[#111111] font-sans selection:bg-[#D4AF37] selection:text-white pt-28 md:pt-36 pb-24 relative overflow-hidden">

            {/* Notification de confirmation discrète */}
            <AnimatePresence>
                {addedConfirmation && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] w-[90%] max-w-lg bg-black text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-[#D4AF37]/50 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-xs shrink-0">
                                ✓
                            </span>
                            <div className="text-xs sm:text-sm">
                                <p className="font-bold text-white font-serif">
                                    {addedConfirmation.quantity}x {addedConfirmation.formuleTitle} ajouté(e) !
                                </p>
                                <p className="text-neutral-300 text-xs mt-0.5">
                                    Votre sélection a été ajoutée à votre panier.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    setAddedConfirmation(null);
                                    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
                                }}
                                className="bg-[#D4AF37] hover:bg-[#b89528] text-black font-serif font-bold text-xs px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5"
                            >
                                <ShoppingCart size={13} />
                                <span>Voir le panier</span>
                            </button>
                            <button
                                onClick={() => setAddedConfirmation(null)}
                                className="text-neutral-400 hover:text-white p-1"
                                aria-label="Fermer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Halo doré décoratif */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

                {/* ==================================================== */}
                {/* 1. EN-TÊTE HERO                                      */}
                {/* ==================================================== */}
                <header className="text-center max-w-3xl mx-auto">
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
                </header>

                {/* ==================================================== */}
                {/* 2. BLOC DE RÉASSURANCE EN 2 COLONNES (STYLE PLATS)   */}
                {/* ==================================================== */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne de gauche : Comment commander */}
                    <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-neutral-200 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif text-black mb-8 flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#D4AF37]"></span>
                                Comment commander vos menus de fêtes ?
                            </h2>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#FAF9F6] p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shrink-0">
                                        <UtensilsCrossed size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            1. Choisissez vos formules & plats
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Composez vos menus festifs directement sur cette page pour l&apos;ensemble de vos convives.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="bg-[#FAF9F6] p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shrink-0">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            2. Validation & Acompte (30 %)
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Validez votre commande avec un acompte de 30 %. Le nombre de convives reste ajustable jusqu&apos;au 15 décembre.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="bg-[#FAF9F6] p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            3. Délais de réservation
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Commandes ouvertes du 20 décembre au 5 janvier, au plus tard 4 jours avant la date de retrait.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="bg-[#FAF9F6] p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            4. Retrait à l&apos;atelier
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Retrait à notre atelier à Saint-Georges-sur-Meuse (Rue Potay 3) selon les créneaux habituels de réveillon. Notice de réchauffage et dressage fournie.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Colonne de droite : Encart sombre noir & or élégant */}
                    <div className="lg:col-span-1 bg-black text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-[#D4AF37]/40">
                        {/* Halo doré décoratif */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
                            <div className="bg-[#D4AF37]/20 p-4 rounded-full text-[#D4AF37] border border-[#D4AF37]/30 shadow-inner">
                                <Sparkles size={38} />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[11px] uppercase tracking-widest font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                                    Offre Réservation Anticipée
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white pt-2">
                                    -5 %
                                </h3>
                                <p className="text-lg sm:text-xl font-serif text-[#D4AF37]">
                                    sur vos menus de fêtes
                                </p>
                            </div>

                            <p className="text-neutral-300 text-sm leading-relaxed font-light max-w-xs">
                                Pour toute réservation effectuée et validée avant le <strong>1er décembre</strong>.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 pt-6 border-t border-white/20 w-full text-center">
                            <p className="text-neutral-400 text-xs leading-relaxed">
                                Remise déduite automatiquement lors de la validation. Seul l&apos;acompte de 30 % est requis à la commande.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ==================================================== */}
                {/* 3. VITRINE DES 3 FORMULES (STYLE FLYER - GRANDES)    */}
                {/* ==================================================== */}
                <section className="space-y-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-serif text-black font-bold">
                            Nos 3 Formules Festives
                        </h2>
                        <p className="font-serif italic text-neutral-500 text-sm sm:text-base mt-2">
                            Menus 4 services harmonieux • Cliquez sur &laquo; Composer ce menu &raquo; pour choisir vos plats
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {FORMULES_FETES.map((formule) => {
                            return (
                                <div
                                    key={formule.id}
                                    className="bg-white rounded-3xl p-8 sm:p-9 border-2 border-neutral-200 hover:border-[#D4AF37] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Badge et titre */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full">
                                                {formule.badge}
                                            </span>
                                            <span className="text-xs font-serif font-bold text-neutral-400 uppercase tracking-wider">
                                                {formule.tagline}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-2 tracking-tight">
                                            {formule.title}
                                        </h3>
                                        <p className="font-serif italic text-sm text-neutral-600 mb-6 min-h-[2.75rem] leading-relaxed">
                                            {formule.subtitle}
                                        </p>

                                        {/* Tarif avec badge -5% : Prix grossi à fort impact */}
                                        <div className="flex items-baseline gap-2 mb-7 pb-6 border-b border-neutral-200">
                                            <span className="font-serif text-5xl sm:text-6xl font-extrabold text-black tracking-tight">
                                                {formule.price} €
                                            </span>
                                            <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                                                / pers. TVAC
                                            </span>
                                            <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ml-auto shadow-xs">
                                                -5%*
                                            </span>
                                        </div>

                                        {/* Décomposition des services du flyer avec espacement aéré */}
                                        <div className="space-y-4 mb-8">
                                            <p className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
                                                Composition du menu :
                                            </p>

                                            {formule.steps.map((st, sIdx) => (
                                                <div key={sIdx} className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
                                                    <p className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                                                        <span>{st.stepTitle}</span>
                                                    </p>
                                                    <p className="text-xs sm:text-[13px] text-neutral-700 font-serif italic pl-4 leading-relaxed">
                                                        {st.selectionType === 'fixed'
                                                            ? (st.fixedItem?.title || st.options[0]?.title)
                                                            : st.options.map(o => o.title).join(' • ')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Unique CTA clair */}
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenModal(formule)}
                                            className="w-full bg-black hover:bg-[#D4AF37] text-white hover:text-black py-4.5 px-6 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2.5"
                                        >
                                            <ChefHat size={18} />
                                            <span>Composer ce menu</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ==================================================== */}
                {/* 4. MENTION OFFICIELLE DU FLYER & INFOS PRATIQUES     */}
                {/* ==================================================== */}
                <footer className="pt-12 border-t border-[#D4AF37]/30 text-center space-y-6">
                    <div className="inline-block bg-white px-8 sm:px-12 py-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
                        <p className="font-serif italic font-semibold text-neutral-800 text-sm sm:text-base tracking-wide">
                            &ldquo;Tout est préparé maison • bûchettes de chez La Pavée • prix par personne&rdquo;
                        </p>
                    </div>

                    <p className="text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
                        Pour toute demande spécifique ou allergène particulier, n&apos;hésitez pas à nous contacter par téléphone au <a href="tel:+32468385082" className="font-bold text-black hover:text-[#D4AF37]">+32 468 38 50 82</a>.
                    </p>
                </footer>

            </div>

            {/* ==================================================== */}
            {/* 5. MODALE DE COMPOSITION D'UN MENU (1 À LA FOIS)    */}
            {/* ==================================================== */}
            <AnimatePresence>
                {activeFormuleModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Arrière-plan sombre avec flou */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={handleCloseModal}
                            className="fixed inset-0 bg-black/75 backdrop-blur-md"
                        />

                        {/* Boîte modale */}
                        <motion.div
                            initial={{ opacity: 1, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#D4AF37] p-6 sm:p-8 z-10 my-8 overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* En-tête de la modale */}
                            <div className="flex items-start justify-between pb-5 border-b border-neutral-100 shrink-0">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-2.5 py-1 rounded-full mb-1 inline-block">
                                        Composition de votre menu
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black">
                                        {activeFormuleModal.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-serif font-bold text-lg text-black">
                                            {activeFormuleModal.price} €
                                        </span>
                                        <span className="text-xs text-neutral-500">/ convive TVAC</span>
                                        <span className="bg-black text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            -5%*
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors"
                                    aria-label="Fermer la modale"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Sélecteur de convives pour ce choix */}
                            <div className="py-4 border-b border-neutral-100 flex items-center justify-between bg-[#FAF9F6] -mx-6 sm:-mx-8 px-6 sm:px-8 shrink-0">
                                <div>
                                    <span className="text-xs uppercase tracking-wider font-bold text-neutral-700 block">
                                        Nombre de convives pour ce choix
                                    </span>
                                    <span className="text-[11px] text-neutral-500">
                                        Dupliquer ces mêmes options pour plusieurs personnes
                                    </span>
                                </div>

                                <div className="inline-flex items-center gap-3 bg-white border border-neutral-300 px-3 py-1.5 rounded-full shadow-2xs">
                                    <button
                                        onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs transition-colors"
                                        aria-label="Diminuer"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="font-serif font-bold text-base text-black w-6 text-center">
                                        {modalQuantity}
                                    </span>
                                    <button
                                        onClick={() => setModalQuantity(prev => prev + 1)}
                                        className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs transition-colors"
                                        aria-label="Augmenter"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Zone de défilement des choix des plats */}
                            <div className="overflow-y-auto py-5 space-y-6 pr-1 flex-1">
                                {activeFormuleModal.steps.map((step) => {
                                    const currentVal = modalSelections[step.id];

                                    return (
                                        <div key={step.id} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-serif font-bold text-sm sm:text-base text-black flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-black text-[#D4AF37] text-[11px] font-bold flex items-center justify-center">
                                                        {step.stepNumber}
                                                    </span>
                                                    <span>{step.stepTitle}</span>
                                                </h4>

                                                {step.selectionType === 'multiple_2' && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#927116] px-2 py-0.5 rounded-full">
                                                        {Array.isArray(currentVal) ? currentVal.length : 0}/2 choisis
                                                    </span>
                                                )}

                                                {step.selectionType === 'fixed' && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                        Inclus
                                                    </span>
                                                )}
                                            </div>

                                            {/* Grille des choix */}
                                            {step.selectionType === 'fixed' ? (
                                                <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-neutral-200 flex items-start gap-3">
                                                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                        ✓
                                                    </div>
                                                    <div>
                                                        <p className="font-serif font-bold text-neutral-900 text-sm">
                                                            {step.fixedItem?.title}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 font-serif italic mt-0.5">
                                                            {step.fixedItem?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    {step.options.map((option) => {
                                                        const isSelected = step.selectionType === 'multiple_2'
                                                            ? Array.isArray(currentVal) && currentVal.includes(option.id)
                                                            : currentVal === option.id;

                                                        return (
                                                            <div
                                                                key={option.id}
                                                                onClick={() => {
                                                                    if (step.selectionType === 'multiple_2') {
                                                                        handleModalMultiple2Choice(step.id, option.id);
                                                                    } else {
                                                                        handleModalSingleChoice(step.id, option.id);
                                                                    }
                                                                }}
                                                                className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between text-left ${
                                                                    isSelected
                                                                        ? 'bg-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-xs'
                                                                        : 'bg-[#FAF9F6] border-neutral-200/90 hover:border-[#D4AF37]/50 hover:bg-white'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                                    <p className="font-serif font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
                                                                        {option.title}
                                                                    </p>
                                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                                                        isSelected
                                                                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black text-[10px] font-bold'
                                                                            : 'border-neutral-300'
                                                                    }`}>
                                                                        {isSelected && '✓'}
                                                                    </div>
                                                                </div>

                                                                {option.description && (
                                                                    <p className="text-[11px] text-neutral-500 font-serif italic leading-relaxed">
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

                            {/* Pied de modale : Total & Bouton d'ajout */}
                            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs text-neutral-500 font-semibold uppercase">Total :</span>
                                        <span className="font-serif text-2xl font-bold text-black">
                                            {(activeFormuleModal.price * modalQuantity).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-[#927116] block">
                                        Remise -5%* déduite lors de la finalisation
                                    </span>
                                </div>

                                <button
                                    onClick={handleConfirmAddToCart}
                                    className="w-full sm:w-auto bg-black hover:bg-[#D4AF37] text-white hover:text-black py-3.5 px-8 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={15} />
                                    <span>Ajouter au panier</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </main>
    );
}
