"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Check, Plus, Minus, ShoppingCart, X,
    ChefHat, Calendar, Clock, MapPin, Award, FileText, ArrowRight,
    UtensilsCrossed, CreditCard, Star, ShoppingBag, Info,
    ChevronLeft, ChevronRight, BookOpen
} from "lucide-react";

import {
    FORMULES_FETES,
    FestiveFormule,
    MenuOption,
    BOOKLET_PAGES,
    BookletPage,
    BookletDish,
    isEarlyBirdFestivePromoActive
} from "../data/menus-fetes";
import { useCart, CartItem } from "../hooks/useCart";

export default function MenusFetesPage() {
    const { addToCart, addMultipleToCart, totalItems } = useCart();

    // Modale de composition active (formule en cours de configuration)
    const [activeFormuleModal, setActiveFormuleModal] = useState<FestiveFormule | null>(null);

    // État de composition dans la modale : quantité et sélections
    const [modalQuantity, setModalQuantity] = useState<number>(1);
    const [modalSelections, setModalSelections] = useState<Record<string, string | string[]>>({});

    // État du Livret de Table (Page active 1 à 4 et direction de transition)
    const [activeBookletPage, setActiveBookletPage] = useState<number>(1);
    const [bookletSlideDirection, setBookletSlideDirection] = useState<number>(1);

    // État des quantités sélectionnées dans le Livret de Table { [dishId]: quantity }
    const [carteQuantities, setCarteQuantities] = useState<Record<string, number>>({});

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

    // Valider et ajouter une Formule au panier
    const handleConfirmAddToCart = () => {
        if (!activeFormuleModal) return;

        // Format demandé : "Cresson / Foie gras / Pintadeau / Mousse chocolat"
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

        // Confirmation visuelle
        setAddedConfirmation({
            formuleTitle: `${modalQuantity}x ${activeFormuleModal.title}`,
            quantity: modalQuantity
        });

        // Fermer la modale pour permettre de composer un autre menu
        setActiveFormuleModal(null);
    };

    // Navigation dans le Livret de Table
    const goToBookletPage = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > BOOKLET_PAGES.length) return;
        setBookletSlideDirection(pageNumber > activeBookletPage ? 1 : -1);
        setActiveBookletPage(pageNumber);
    };

    // Gestion des quantités dans le Livret de Table
    const getBookletDishQty = (dishId: string) => carteQuantities[dishId] || 0;

    const setBookletDishQty = (dishId: string, delta: number) => {
        setCarteQuantities(prev => {
            const current = prev[dishId] || 0;
            const updated = Math.max(0, current + delta);
            if (updated === 0) {
                const { [dishId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [dishId]: updated };
        });
    };

    // Ensemble de tous les mets du livret
    const allBookletDishes: BookletDish[] = BOOKLET_PAGES.flatMap(p => p.subsections.flatMap(s => s.dishes));

    // Liste des mets sélectionnés avec quantité > 0
    const selectedBookletDishes = allBookletDishes
        .map(dish => ({ dish, qty: carteQuantities[dish.id] || 0 }))
        .filter(item => item.qty > 0);

    const totalBookletItemsCount = selectedBookletDishes.reduce((acc, item) => acc + item.qty, 0);
    const rawBookletSubtotal = selectedBookletDishes.reduce((acc, item) => acc + item.dish.price * item.qty, 0);

    // Calcul remise Early Bird -5%
    const isEarlyBirdActive = isEarlyBirdFestivePromoActive();
    const bookletDiscountAmount = isEarlyBirdActive ? Math.round(rawBookletSubtotal * 0.05 * 100) / 100 : 0;
    const finalBookletTotal = Math.max(0, rawBookletSubtotal - bookletDiscountAmount);

    // Décompte textuel exhaustif des mets sélectionnés (ex : « 2x Blini de maquereau • 1x Velouté potiron • 2x Pavé de saumon »)
    const summaryBreakdownText = selectedBookletDishes.length > 0
        ? selectedBookletDishes.map(item => `${item.qty}x ${item.dish.shortTitle || item.dish.title}`).join(" • ")
        : "Feuilletez le livret et composez vos mets pour les fêtes";

    // Nombre d'articles sélectionnés par page de livret (pour le badge de l'onglet)
    const getPageSelectedCount = (page: BookletPage) => {
        const pageDishIds = page.subsections.flatMap(s => s.dishes.map(d => d.id));
        return pageDishIds.reduce((sum, id) => sum + (carteQuantities[id] || 0), 0);
    };

    // Page de livret courante
    const currentBookletPage = BOOKLET_PAGES.find(p => p.pageNumber === activeBookletPage) || BOOKLET_PAGES[0];

    // Ajouter toute la sélection du livret en un seul clic au panier
    const handleAddAllBookletItems = () => {
        if (selectedBookletDishes.length === 0) return;

        const cartItemsToAdd: CartItem[] = selectedBookletDishes.map(({ dish, qty }) => ({
            id: `carte-${dish.id}`,
            semaineId: "menus-fetes",
            jour: "Fêtes",
            nomPlat: dish.title,
            prixUnitairePlat: dish.price,
            quantitePlat: qty,
            soupes: {},
            prixUnitaireSoupe: 0,
            prixTotalLigne: dish.price * qty,
            itemType: "menu_fete",
            badge: dish.categoryLabel,
            coursesDescription: `${dish.categoryLabel} • ${dish.priceFormatted} / ${dish.unitLabel}`
        }));

        addMultipleToCart(cartItemsToAdd);

        // Feedback
        setAddedConfirmation({
            formuleTitle: `${totalBookletItemsCount} mets à la carte`,
            quantity: totalBookletItemsCount
        });

        // Vider la sélection du livret après ajout
        setCarteQuantities({});
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] text-[#111111] font-sans selection:bg-[#D4AF37] selection:text-white pt-44 sm:pt-48 md:pt-52 pb-24 relative overflow-hidden">

            {/* Notification de confirmation discrète */}
            <AnimatePresence>
                {addedConfirmation && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] w-[92%] max-w-lg bg-black text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-[#D4AF37]/50 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-xs shrink-0">
                                ✓
                            </span>
                            <div className="text-xs sm:text-sm">
                                <p className="font-bold text-white font-serif">
                                    {addedConfirmation.formuleTitle} ajouté au panier !
                                </p>
                                <p className="text-neutral-300 text-xs mt-0.5">
                                    Votre sélection a été ajoutée. Vous pouvez composer un autre menu pour un autre convive.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    setAddedConfirmation(null);
                                    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
                                }}
                                className="bg-[#D4AF37] hover:bg-[#b89528] text-black font-serif font-bold text-xs px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#927116] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4 shadow-xs">
                        <Sparkles size={13} className="text-[#D4AF37]" />
                        <span>Maison Compère • Réveillons & Fêtes 2026</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-black tracking-tight mb-4 font-bold">
                        Menus des Fêtes 2026
                    </h1>

                    <p className="font-serif italic text-neutral-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        &ldquo;Pour vos réveillons de Noël et de Nouvel An, savourez l&apos;art de recevoir sans le stress des préparatifs.&rdquo;
                    </p>
                </header>

                {/* ==================================================== */}
                {/* 2. BANDEAU DE RÉASSURANCE EN 2 COLONNES (STYLE PLATS) */}
                {/* ==================================================== */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Colonne Gauche (Fond crème / clair) – "Comment commander vos menus de fêtes ?" */}
                    <div className="lg:col-span-2 bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl shadow-sm border border-neutral-200/90 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif text-black mb-8 flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#D4AF37] rounded-full"></span>
                                Comment commander vos menus de fêtes ?
                            </h2>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shadow-xs shrink-0">
                                        <UtensilsCrossed size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            Composez vos menus & plats
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Choisissez parmi nos 3 formules ou composez votre table librement avec la carte à l&apos;unité.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shadow-xs shrink-0">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            Acompte de 30 % ou Paiement total
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Versez 30 % d&apos;acompte pour bloquer votre commande (option disponible jusqu&apos;au 10 décembre). Le solde et le nombre de convives sont ajustables jusqu&apos;à 7 jours avant le retrait.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shadow-xs shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            Dates & Délais de réservation
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Menus disponibles du 20 décembre au 5 janvier inclus. Commandes acceptées au plus tard 4 jours avant la date de retrait (J-4).
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-2xl text-[#927116] border border-[#D4AF37]/30 shadow-xs shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                            Retrait à l&apos;atelier & Livraison
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Retrait à notre atelier (Saint-Georges-sur-Meuse, Rue Potay 3) la veille de 14h à 18h ou le jour même de 8h à 12h. Livraison possible si besoin et sur demande. Toutes les explications nécessaires pour un réchauffage et un dressage parfaits vous seront fournies.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Colonne Droite (Encart sombre noir & or élégant) – "Offre Réservation Anticipée" */}
                    <div className="lg:col-span-1 bg-black text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-[#D4AF37]/40">
                        {/* Halo doré décoratif */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
                            {/* Icône étoile dorée / macaron */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#927116] p-0.5 shadow-lg">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[#D4AF37]">
                                    <Star size={30} fill="#D4AF37" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[11px] uppercase tracking-widest font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                                    Offre Réservation Anticipée
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white pt-2 leading-tight">
                                    -5 % sur toute votre commande de fêtes
                                </h3>
                            </div>

                            <p className="text-neutral-300 text-sm leading-relaxed font-light max-w-xs">
                                Valable sur l&apos;ensemble des formules et des plats à la carte pour toute commande validée avant le <strong>1er décembre 2026</strong>.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 pt-6 border-t border-white/20 w-full text-center">
                            <p className="text-neutral-400 text-xs leading-relaxed">
                                Remise déduite automatiquement dans votre panier. Réservation validée dès versement de votre acompte de 30 % sous 48h par virement.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ==================================================== */}
                {/* 3. VITRINE DES 3 FORMULES (CARTES GRAND FORMAT)      */}
                {/* ==================================================== */}
                <section className="space-y-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
                            <Award size={14} />
                            <span>Sélection Gastronomique 4 Services</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-serif text-black font-bold">
                            Nos 3 Formules de Fêtes
                        </h2>
                        <p className="font-serif italic text-neutral-600 text-sm sm:text-base mt-2">
                            Harmonie de saveurs et réchauffage facile • Cliquez sur &laquo; Composer ce menu &raquo; pour choisir vos déclinaisons
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {FORMULES_FETES.map((formule) => {
                            return (
                                <div
                                    key={formule.id}
                                    className="bg-white rounded-3xl p-8 sm:p-9 border-2 border-neutral-200/90 hover:border-[#D4AF37] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                                >
                                    <div>
                                        {/* Badge et titre */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
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

                                        {/* Tarif harmonieux et raffiné avec badge -5% */}
                                        <div className="flex items-baseline gap-2 mb-7 pb-6 border-b border-neutral-200">
                                            <span className="font-sans font-semibold text-3xl sm:text-4xl text-neutral-900 tracking-tight tabular-nums">
                                                {formule.price} €
                                            </span>
                                            <span className="text-xs text-neutral-500 font-medium">
                                                TVAC / pers.
                                            </span>
                                            <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ml-auto shadow-xs">
                                                -5%*
                                            </span>
                                        </div>

                                        {/* Décomposition des services avec espacement aéré */}
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

                                    {/* Bouton CTA sous chaque formule */}
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
                {/* 4. SECTION "LIVRET DE TABLE / MENU TOURNANT"         */}
                {/* ==================================================== */}
                <section id="livret-de-table" className="pt-10 space-y-8 border-t border-neutral-200">
                    {/* En-tête de section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#927116] text-xs font-bold uppercase tracking-wider mb-2">
                                <BookOpen size={14} />
                                <span>Livret de table • Carte Gastronomique</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-serif text-black font-bold">
                                Le Livret de Table
                            </h2>
                            <p className="font-serif italic text-neutral-600 text-sm sm:text-base mt-1">
                                Tournez les pages de notre carte et composez librement vos mets pour vos réveillons et tables de fête.
                            </p>
                        </div>

                        {/* Remise -5% rappel carte */}
                        <div className="bg-black text-white px-5 py-3 rounded-2xl border border-[#D4AF37]/40 flex items-center gap-3 shrink-0 shadow-sm">
                            <span className="text-[#D4AF37] text-xl">✨</span>
                            <div className="text-xs">
                                <p className="font-bold text-[#D4AF37]">Remise de -5 % Early Bird également sur la carte</p>
                                <p className="text-neutral-400">Pour toute commande validée avant le 1er décembre 2026.</p>
                            </div>
                        </div>
                    </div>

                    {/* LE CONTENEUR LIVRET DE TABLE */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Flèches latérales desktop (pour tourner les pages d'un clic) */}
                        <button
                            type="button"
                            onClick={() => goToBookletPage(activeBookletPage - 1)}
                            disabled={activeBookletPage === 1}
                            className={`hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center border transition-all z-20 ${
                                activeBookletPage === 1
                                    ? "bg-white/40 border-neutral-200 text-neutral-300 cursor-not-allowed"
                                    : "bg-white hover:bg-black text-neutral-800 hover:text-white border-[#D4AF37]/40 hover:border-black shadow-md hover:scale-105 active:scale-95"
                            }`}
                            aria-label="Page précédente"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => goToBookletPage(activeBookletPage + 1)}
                            disabled={activeBookletPage === BOOKLET_PAGES.length}
                            className={`hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center border transition-all z-20 ${
                                activeBookletPage === BOOKLET_PAGES.length
                                    ? "bg-white/40 border-neutral-200 text-neutral-300 cursor-not-allowed"
                                    : "bg-white hover:bg-black text-neutral-800 hover:text-white border-[#D4AF37]/40 hover:border-black shadow-md hover:scale-105 active:scale-95"
                            }`}
                            aria-label="Page suivante"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Livret Cartonné Central - Style Porte-menu gastronomique */}
                        <div className="bg-[#F4EFE6] rounded-3xl border border-[#D4AF37]/40 shadow-[0_22px_60px_-15px_rgba(20,20,20,0.08),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">

                            {/* En-tête du livret : Les 4 intercalaires fixes répartis équitablement sur toute la largeur */}
                            <div className="bg-[#ECE6DA] border-b border-[#D4AF37]/25 px-1 sm:px-3 pt-2 sm:pt-3 grid grid-cols-4 w-full gap-1 sm:gap-2">
                                {BOOKLET_PAGES.map((page) => {
                                    const isActive = page.pageNumber === activeBookletPage;
                                    const pageCount = getPageSelectedCount(page);

                                    return (
                                        <button
                                            key={page.pageNumber}
                                            type="button"
                                            onClick={() => goToBookletPage(page.pageNumber)}
                                            className={`group relative px-1 sm:px-2.5 py-2 sm:py-2.5 rounded-t-xl text-[10px] sm:text-xs md:text-sm font-serif font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 text-center -mb-px w-full ${
                                                isActive
                                                    ? "bg-[#FAF8F5] text-black border-t-2 border-l border-r border-[#D4AF37]/50 shadow-sm"
                                                    : "text-neutral-500 hover:text-neutral-900 hover:bg-white/40"
                                            }`}
                                        >
                                            <span className={isActive ? "text-[#927116]" : "text-neutral-400 group-hover:text-neutral-600"}>
                                                {page.tabNumber}.
                                            </span>
                                            <span className="truncate">{page.tabShort}</span>

                                            {/* Badge compte de sélection sur cette page */}
                                            {pageCount > 0 && (
                                                <span className="inline-flex items-center justify-center min-w-[15px] sm:min-w-[18px] h-3.5 sm:h-[18px] px-1 rounded-full text-[9px] sm:text-[10px] font-sans font-bold bg-[#D4AF37] text-black shadow-2xs shrink-0">
                                                    {pageCount}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Corps du livret : Feuille de menu intérieure ivoire chaud (#FAF8F5) avec encadrement double bordure et coins d'ornement */}
                            <div className="p-3 sm:p-6 md:p-8 bg-[#F4EFE6]/80">
                                <div className="bg-[#FAF8F5] rounded-2xl border border-[#D4AF37]/45 p-2 sm:p-2.5 shadow-[0_4px_25px_rgba(20,20,10,0.05)] relative">
                                    {/* Deuxième filet doré intérieur en retrait de 6 à 8px (border-[#D4AF37]/40) */}
                                    <div className="border border-[#D4AF37]/40 rounded-xl p-4 sm:p-7 md:p-9 relative">

                                        {/* Mini ornements et angles biseautés dorés aux 4 coins (esprit flyer physique) */}
                                        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
                                        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
                                        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
                                        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />

                                        {/* Petits angles biseautés / losanges d'angle */}
                                        <span className="absolute top-1.5 left-1.5 text-[8px] text-[#927116] select-none pointer-events-none">❖</span>
                                        <span className="absolute top-1.5 right-1.5 text-[8px] text-[#927116] select-none pointer-events-none">❖</span>
                                        <span className="absolute bottom-1.5 left-1.5 text-[8px] text-[#927116] select-none pointer-events-none">❖</span>
                                        <span className="absolute bottom-1.5 right-1.5 text-[8px] text-[#927116] select-none pointer-events-none">❖</span>

                                        {/* Animation de page avec support swipe horizontal */}
                                        <AnimatePresence mode="wait" custom={bookletSlideDirection}>
                                            <motion.div
                                                key={activeBookletPage}
                                                custom={bookletSlideDirection}
                                                variants={{
                                                    enter: (dir: number) => ({
                                                        x: dir > 0 ? 40 : -40,
                                                        opacity: 0,
                                                    }),
                                                    center: {
                                                        x: 0,
                                                        opacity: 1,
                                                        transition: { duration: 0.32, ease: [0.25, 1, 0.5, 1] }
                                                    },
                                                    exit: (dir: number) => ({
                                                        x: dir > 0 ? -40 : 40,
                                                        opacity: 0,
                                                        transition: { duration: 0.22, ease: [0.25, 1, 0.5, 1] }
                                                    })
                                                }}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                drag="x"
                                                dragConstraints={{ left: 0, right: 0 }}
                                                dragElastic={0.15}
                                                onDragEnd={(_, info) => {
                                                    if (info.offset.x < -60 && activeBookletPage < BOOKLET_PAGES.length) {
                                                        goToBookletPage(activeBookletPage + 1);
                                                    } else if (info.offset.x > 60 && activeBookletPage > 1) {
                                                        goToBookletPage(activeBookletPage - 1);
                                                    }
                                                }}
                                                className="touch-pan-y"
                                            >
                                                {/* En-tête de la page */}
                                                <div className="text-center mb-8 pb-5 border-b border-[#D4AF37]/20">
                                                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#927116]">
                                                        Maison Compère • Réveillons & Fêtes 2026
                                                    </span>
                                                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1 tracking-tight">
                                                        {currentBookletPage.pageTitle}
                                                    </h3>
                                                    <p className="font-serif italic text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-lg mx-auto">
                                                        {currentBookletPage.pageTagline}
                                                    </p>
                                                </div>

                                                {/* Sous-sections et mets sous forme de lignes élégantes horizontales */}
                                                <div className="space-y-8">
                                                    {currentBookletPage.subsections.map((sub, sIdx) => (
                                                        <div key={sIdx} className="space-y-3">
                                                            {/* Intertitre de service façon restaurant gastronomique : lettres capitales espacées avec tirets et filets dorés fins */}
                                                            <div className="text-center my-6">
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37] flex-1 max-w-[50px] sm:max-w-[90px]" />
                                                                    <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-900 tracking-[0.22em] uppercase">
                                                                        — {sub.subtitle} —
                                                                    </h4>
                                                                    <div className="h-px bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#D4AF37] flex-1 max-w-[50px] sm:max-w-[90px]" />
                                                                </div>
                                                                {sub.note && (
                                                                    <p className="text-[11px] text-[#927116] font-serif italic mt-1 tracking-wide">
                                                                        {sub.note}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Lignes de mets façon restaurant étoilé */}
                                                            <div className="divide-y divide-neutral-200/60">
                                                                {sub.dishes.map((dish) => {
                                                                    const qty = getBookletDishQty(dish.id);
                                                                    const isSelected = qty > 0;

                                                                    return (
                                                                        <div
                                                                            key={dish.id}
                                                                            className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                                                                                isSelected
                                                                                    ? "bg-[#D4AF37]/10 border border-[#D4AF37]/35 shadow-2xs"
                                                                                    : "hover:bg-white/80 border border-transparent"
                                                                            }`}
                                                                        >
                                                                            {/* Intitulé et description en italique fin */}
                                                                            <div className="flex-1 pr-3">
                                                                                <h5 className="font-serif font-semibold text-base sm:text-lg text-neutral-900 group-hover:text-[#927116] transition-colors leading-snug">
                                                                                    {dish.title}
                                                                                </h5>
                                                                                {dish.description && (
                                                                                    <p className="font-serif italic text-xs sm:text-sm text-neutral-600 mt-0.5 leading-relaxed">
                                                                                        {dish.description}
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Prix sobre & Mini-compteur compact */}
                                                                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/40">
                                                                                <div className="text-right">
                                                                                    <span className="font-serif font-bold text-base sm:text-lg text-neutral-900">
                                                                                        {dish.priceFormatted}
                                                                                    </span>
                                                                                    <span className="text-[11px] text-neutral-500 ml-1">
                                                                                        / {dish.unitLabel}
                                                                                    </span>
                                                                                </div>

                                                                                {/* Mini-compteur [ – ] Q [ + ] ou bouton sobre [ + Choisir ] */}
                                                                                {qty === 0 ? (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setBookletDishQty(dish.id, 1)}
                                                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold text-neutral-800 bg-white hover:bg-black hover:text-white border border-[#D4AF37]/50 shadow-2xs transition-all duration-200"
                                                                                        aria-label={`Choisir ${dish.title}`}
                                                                                    >
                                                                                        <Plus size={13} className="text-[#927116] group-hover:text-white" />
                                                                                        <span>Choisir</span>
                                                                                    </button>
                                                                                ) : (
                                                                                    <div className="inline-flex items-center gap-1.5 bg-white border border-[#D4AF37] p-1 rounded-full shadow-2xs">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setBookletDishQty(dish.id, -1)}
                                                                                            className="w-6 h-6 rounded-full bg-[#FAF9F6] hover:bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-xs transition-colors"
                                                                                            aria-label="Diminuer la quantité"
                                                                                        >
                                                                                            <Minus size={11} />
                                                                                        </button>
                                                                                        <span className="font-bold text-xs text-black w-6 text-center font-serif">
                                                                                            {qty}
                                                                                        </span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setBookletDishQty(dish.id, 1)}
                                                                                            className="w-6 h-6 rounded-full bg-black hover:bg-[#927116] text-white flex items-center justify-center font-bold text-xs transition-colors"
                                                                                            aria-label="Augmenter la quantité"
                                                                                        >
                                                                                            <Plus size={11} />
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Mention sobre en bas de page (ex. Page 4) */}
                                                {currentBookletPage.footnote && (
                                                    <div className="mt-8 pt-4 border-t border-[#D4AF37]/30 text-center">
                                                        <p className="font-serif italic text-xs sm:text-sm text-neutral-700 font-medium">
                                                            « {currentBookletPage.footnote} »
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Bas du Livret : Numérotation & Boutons de navigation */}
                            <div className="bg-[#ECE6DA] border-t border-[#D4AF37]/25 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
                                {/* Bouton Précédent */}
                                <div className="w-1/3 text-left">
                                    {activeBookletPage > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => goToBookletPage(activeBookletPage - 1)}
                                            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-neutral-700 hover:text-black transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/60"
                                        >
                                            <ChevronLeft size={16} />
                                            <span className="hidden sm:inline">
                                                {currentBookletPage.prevPageTitle ? currentBookletPage.prevPageTitle : "Précédent"}
                                            </span>
                                            <span className="sm:hidden">Préc.</span>
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                </div>

                                {/* Rappel du numéro de page & points */}
                                <div className="w-1/3 flex flex-col items-center justify-center text-center">
                                    <span className="font-serif text-xs text-neutral-700 font-bold tracking-wider">
                                        — Page {activeBookletPage} sur {BOOKLET_PAGES.length} —
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {BOOKLET_PAGES.map((p) => (
                                            <button
                                                key={p.pageNumber}
                                                type="button"
                                                onClick={() => goToBookletPage(p.pageNumber)}
                                                className={`h-1.5 rounded-full transition-all ${
                                                    p.pageNumber === activeBookletPage
                                                        ? "w-4 bg-[#927116]"
                                                        : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                                                }`}
                                                aria-label={`Aller à la page ${p.pageNumber}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Bouton Suivant */}
                                <div className="w-1/3 text-right">
                                    {activeBookletPage < BOOKLET_PAGES.length ? (
                                        <button
                                            type="button"
                                            onClick={() => goToBookletPage(activeBookletPage + 1)}
                                            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-neutral-900 hover:text-[#927116] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/60 ml-auto"
                                        >
                                            <span className="hidden sm:inline">
                                                {currentBookletPage.nextPageTitle ? `${currentBookletPage.nextPageTitle}` : "Suivant"}
                                            </span>
                                            <span className="sm:hidden">Suiv.</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ENCART RÉCAPITULATIF & AJOUT GLOBAL (SOUS LE LIVRET) */}
                        <div className="mt-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-black text-white p-6 sm:p-7 rounded-3xl border border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                            {/* Récapitulatif en temps réel */}
                            <div className="space-y-2.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={14} />
                                    <span>Votre sélection du livret</span>
                                </div>

                                {totalBookletItemsCount === 0 ? (
                                    <p className="font-serif italic text-neutral-400 text-sm">
                                        Feuilletez le livret et composez vos mets pour les fêtes.
                                    </p>
                                ) : (
                                    <div className="space-y-2.5">
                                        {/* Liste exhaustive et détaillée des choix du client avec quantités exactes sous forme de badges élégants */}
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-h-28 overflow-y-auto pr-1 scrollbar-thin">
                                            {selectedBookletDishes.map(({ dish, qty }) => (
                                                <span
                                                    key={dish.id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-900/90 border border-[#D4AF37]/40 text-neutral-100 shadow-2xs hover:border-[#D4AF37] transition-colors"
                                                >
                                                    <span className="font-bold text-[#D4AF37] font-serif">{qty}x</span>
                                                    <span className="font-serif text-white">{dish.shortTitle || dish.title}</span>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Remise Early Bird */}
                                        {isEarlyBirdActive && (
                                            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-medium bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-full">
                                                <span>✨ Remise Early Bird -5 % incluse (-{bookletDiscountAmount.toLocaleString("fr-BE", { minimumFractionDigits: 2 })} €)</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Prix total & Bouton d'action principal dynamique */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-800">
                                <div className="text-left sm:text-right">
                                    <div className="text-xs text-neutral-400 font-medium">Total sélection</div>
                                    <div className="flex items-baseline gap-2 sm:justify-end">
                                        {isEarlyBirdActive && bookletDiscountAmount > 0 && (
                                            <span className="text-xs line-through text-neutral-500">
                                                {rawBookletSubtotal.toLocaleString("fr-BE", { minimumFractionDigits: 2 })} €
                                            </span>
                                        )}
                                        <span className="font-serif font-bold text-2xl sm:text-3xl text-white">
                                            {finalBookletTotal.toLocaleString("fr-BE", { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-neutral-400">TVAC • Remise déduite</div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddAllBookletItems}
                                    disabled={totalBookletItemsCount === 0}
                                    className={`px-6 sm:px-7 py-3.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md ${
                                        totalBookletItemsCount > 0
                                            ? "bg-[#D4AF37] hover:bg-[#F3E5AB] text-black cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                            : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                                    }`}
                                >
                                    <ShoppingCart size={15} />
                                    <span>
                                        {totalBookletItemsCount > 0
                                            ? `Ajouter la sélection au panier (${totalBookletItemsCount} ${totalBookletItemsCount > 1 ? "mets" : "met"}) — ${finalBookletTotal.toLocaleString("fr-BE", { minimumFractionDigits: 2 })} €`
                                            : `Sélectionnez vos mets dans le livret`}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================================================== */}
                {/* 5. MENTION OFFICIELLE DU FLYER & INFOS PRATIQUES     */}
                {/* ==================================================== */}
                <footer className="pt-12 border-t border-[#D4AF37]/30 text-center space-y-6">
                    <div className="inline-block bg-white px-8 sm:px-12 py-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
                        <p className="font-serif italic font-semibold text-neutral-800 text-sm sm:text-base tracking-wide">
                            &ldquo;Tout est préparé maison • bûchettes de chez La Pavée • notice de réchauffage fournie&rdquo;
                        </p>
                    </div>

                    <p className="text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
                        Pour toute demande spécifique ou allergène particulier, n&apos;hésitez pas à nous contacter par téléphone au <a href="tel:+32468385082" className="font-bold text-black hover:text-[#D4AF37]">+32 468 38 50 82</a>.
                    </p>
                </footer>

            </div>

            {/* ==================================================== */}
            {/* 6. MODALE DE COMPOSITION D'UN MENU (POP-UP)          */}
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
                                            -5%* Early Bird
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

                            {/* Sélecteur de convives réglé par défaut sur 1 (+ / - pour dupliquer à l'identique) */}
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
                                        type="button"
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
                                        type="button"
                                        onClick={() => setModalQuantity(prev => prev + 1)}
                                        className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs transition-colors"
                                        aria-label="Augmenter"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Zone de défilement des choix des options selon la formule */}
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
                                                                className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between text-left ${isSelected
                                                                        ? 'bg-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-xs'
                                                                        : 'bg-[#FAF9F6] border-neutral-200/90 hover:border-[#D4AF37]/50 hover:bg-white'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                                    <p className="font-serif font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
                                                                        {option.title}
                                                                    </p>
                                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected
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
                                        Remise -5%* déduite lors de la validation
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
