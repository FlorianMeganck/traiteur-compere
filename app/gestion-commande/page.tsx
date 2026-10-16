"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, ArrowLeft, ArrowRight, AlertCircle, Copy,
    CheckCheck, Printer, Mail, MapPin, Calendar, Clock,
    Phone, ExternalLink, Sparkles, X, Plus, Minus,
    Trash2, ChefHat, ShoppingCart, ShieldCheck, Lock, User
} from "lucide-react";
import {
    FORMULES_FETES,
    CARTE_FETES_ITEMS,
    FestiveFormule,
    CarteItem
} from "../data/menus-fetes";

interface OrderData {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    repas_date: string;
    retrait_slot: string;
    payment_mode: 'acompte_30' | 'total_100';
    status: string;
    total_initial: number;
    early_bird_discount: number;
    amount_paid_initial: number;
    balance_remaining: number;
    items: any[];
    additional_items?: any[];
    notes?: string;
}

function GestionCommandeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialOrderParam = searchParams.get('order') || searchParams.get('orderId') || '';
    const initialEmailParam = searchParams.get('email') || '';

    // États de recherche / login
    const [orderNumberInput, setOrderNumberInput] = useState(initialOrderParam);
    const [emailInput, setEmailInput] = useState(initialEmailParam);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Données de la commande
    const [order, setOrder] = useState<OrderData | null>(null);
    const [canAdjust, setCanAdjust] = useState(false);
    const [isEarlyBirdOnAdditions, setIsEarlyBirdOnAdditions] = useState(false);

    // Nouveaux ajouts en cours (non encore validés)
    const [pendingAdditions, setPendingAdditions] = useState<any[]>([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Modales
    const [isFormuleModalOpen, setIsFormuleModalOpen] = useState(false);
    const [activeFormule, setActiveFormule] = useState<FestiveFormule | null>(null);
    const [formuleQuantity, setFormuleQuantity] = useState(1);
    const [formuleSelections, setFormuleSelections] = useState<Record<string, string | string[]>>({});

    const [isCarteModalOpen, setIsCarteModalOpen] = useState(false);
    const [carteQuantities, setCarteQuantities] = useState<Record<string, number>>({});

    // Fermeture avec Échap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsFormuleModalOpen(false);
                setIsCarteModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Chargement automatique si les paramètres sont dans l'URL
    const fetchOrder = async (orderId: string, email: string) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const res = await fetch(`/api/gestion-commande?order=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (res.ok && data.success && data.order) {
                setOrder(data.order);
                setCanAdjust(Boolean(data.canAdjust));
                setIsEarlyBirdOnAdditions(Boolean(data.isEarlyBirdOnAdditions));
            } else {
                setOrder(null);
                setErrorMessage(data?.error || "Commande introuvable. Veuillez vérifier votre référence et votre adresse email.");
            }
        } catch {
            setErrorMessage("Erreur de connexion. Veuillez réessayer dans quelques instants.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialOrderParam && initialEmailParam) {
            fetchOrder(initialOrderParam, initialEmailParam);
        }
    }, [initialOrderParam, initialEmailParam]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumberInput.trim() || !emailInput.trim()) {
            setErrorMessage("Veuillez renseigner votre numéro de commande et votre email.");
            return;
        }
        router.push(`/gestion-commande?order=${encodeURIComponent(orderNumberInput.trim())}&email=${encodeURIComponent(emailInput.trim())}`);
        fetchOrder(orderNumberInput.trim(), emailInput.trim());
    };

    // Gestion de la modale formule
    const openFormuleModal = (formule: FestiveFormule) => {
        setActiveFormule(formule);
        setFormuleQuantity(1);
        const defaults: Record<string, string | string[]> = {};
        formule.steps.forEach(st => {
            if (st.selectionType === 'single') {
                defaults[st.id] = st.options[0]?.id || '';
            } else if (st.selectionType === 'multiple_2') {
                defaults[st.id] = [st.options[0]?.id, st.options[1]?.id].filter(Boolean);
            }
        });
        setFormuleSelections(defaults);
        setIsFormuleModalOpen(true);
    };

    const handleAddFormuleToPending = () => {
        if (!activeFormule) return;

        const summary: string[] = [];
        activeFormule.steps.forEach(step => {
            if (step.selectionType === 'fixed') {
                summary.push(`${step.stepTitle} : ${step.fixedItem?.title || ''}`);
            } else if (step.selectionType === 'single') {
                const optId = formuleSelections[step.id];
                const opt = step.options.find(o => o.id === optId);
                if (opt) summary.push(`${step.stepTitle} : ${opt.title}`);
            } else if (step.selectionType === 'multiple_2') {
                const optIds = formuleSelections[step.id];
                if (Array.isArray(optIds)) {
                    const titles = optIds.map(id => step.options.find(o => o.id === id)?.title).filter(Boolean);
                    summary.push(`${step.stepTitle} : ${titles.join(' & ')}`);
                }
            }
        });

        // Appliquer la remise si Early Bird
        const discountRate = isEarlyBirdOnAdditions ? 0.05 : 0;
        const unitPriceNet = activeFormule.price * (1 - discountRate);
        const lineTotal = unitPriceNet * formuleQuantity;

        const newItem = {
            id: `addition-formule-${Date.now()}`,
            nomPlat: `${activeFormule.title} (${activeFormule.price}€)`,
            quantitePlat: formuleQuantity,
            prixUnitairePlat: unitPriceNet,
            prixTotalLigne: lineTotal,
            coursesSummary: summary,
            badge: "Formule Fêtes",
            isAddition: true
        };

        setPendingAdditions(prev => [...prev, newItem]);
        setIsFormuleModalOpen(false);
        setActiveFormule(null);
    };

    // Gestion des ajouts à la carte
    const handleAddCarteToPending = () => {
        const discountRate = isEarlyBirdOnAdditions ? 0.05 : 0;
        const newItems: any[] = [];

        Object.entries(carteQuantities).forEach(([itemId, qty]) => {
            if (qty <= 0) return;
            const item = CARTE_FETES_ITEMS.find(c => c.id === itemId);
            if (!item) return;

            const unitPriceNet = item.price * (1 - discountRate);
            newItems.push({
                id: `addition-carte-${itemId}-${Date.now()}`,
                nomPlat: item.title,
                quantitePlat: qty,
                prixUnitairePlat: unitPriceNet,
                prixTotalLigne: unitPriceNet * qty,
                badge: item.categoryLabel || "À la carte",
                isAddition: true
            });
        });

        if (newItems.length > 0) {
            setPendingAdditions(prev => [...prev, ...newItems]);
        }
        setCarteQuantities({});
        setIsCarteModalOpen(false);
    };

    const handleRemovePendingAddition = (index: number) => {
        setPendingAdditions(prev => prev.filter((_, i) => i !== index));
    };

    // Calculs financiers dynamiques
    const additionsTotalAmount = pendingAdditions.reduce((sum, item) => sum + Number(item.prixTotalLigne || 0), 0);
    const currentOrderBalance = order ? Number(order.balance_remaining || 0) : 0;
    const finalNewBalanceTotal = currentOrderBalance + additionsTotalAmount;

    // Redirection vers l'écran dédié de paiement du solde final
    const handleProceedToPayment = async () => {
        if (!order) return;

        setIsProcessingPayment(true);
        try {
            let currentOrderData = order;

            // 1. Si des ajouts sont en attente : enregistrement en DB (statut solde_en_attente) & envoi email avenant
            if (pendingAdditions.length > 0) {
                const res = await fetch("/api/gestion-commande", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: order.id,
                        email: order.email,
                        additionalItems: pendingAdditions,
                        additionalAmount: additionsTotalAmount,
                        newBalanceTotal: finalNewBalanceTotal
                    })
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    alert(data?.error || "Une erreur est survenue lors de l'enregistrement de vos modifications.");
                    setIsProcessingPayment(false);
                    return;
                }
                if (data.order) {
                    currentOrderData = data.order;
                }
            }

            // 2. Combiner l'ensemble des articles pour le récapitulatif figé
            const allItems = [
                ...(currentOrderData.items || []),
                ...(currentOrderData.additional_items || []),
                ...(currentOrderData === order && pendingAdditions.length > 0 ? pendingAdditions : [])
            ];

            const totalAdditions = (currentOrderData.additional_items || []).reduce(
                (sum: number, it: any) => sum + Number(it.prixTotalLigne || 0),
                0
            ) + (currentOrderData === order ? additionsTotalAmount : 0);

            const grandTotal = Number(currentOrderData.total_initial || 0) + totalAdditions;

            // 3. Stocker dans sessionStorage pour /commande-confirmee
            const orderSummaryPayload = {
                orderId: currentOrderData.id,
                prenom: currentOrderData.prenom,
                nom: currentOrderData.nom,
                email: currentOrderData.email,
                telephone: currentOrderData.telephone,
                total: grandTotal,
                toPay: finalNewBalanceTotal,
                paymentMode: 'solde_final',
                mode: 'solde_final',
                isSoldeFinal: true,
                solde: 0,
                remise: currentOrderData.early_bird_discount || 0,
                repasDate: currentOrderData.repas_date,
                jours: currentOrderData.repas_date,
                retraitSlot: currentOrderData.retrait_slot,
                creneau: currentOrderData.retrait_slot,
                items: allItems
            };

            if (typeof window !== 'undefined') {
                try {
                    sessionStorage.setItem('lastOrderSummary', JSON.stringify(orderSummaryPayload));
                } catch (err) {
                    console.error("Erreur enregistrement sessionStorage lastOrderSummary:", err);
                }
            }

            // 4. Redirection vers l'écran dédié de paiement
            router.push('/commande-confirmee');
        } catch (err) {
            console.error("Erreur lors de la redirection vers le paiement:", err);
            alert("Erreur de connexion. Veuillez réessayer.");
            setIsProcessingPayment(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 sm:pt-40 pb-20 bg-[#F7F5F0] text-neutral-900 relative">
            {/* Lueur dorée d'ambiance */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">

                {/* Si aucune commande chargée : Formulaire de connexion sécurisé */}
                {!order ? (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#D4AF37]/40 shadow-xl space-y-6 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#D4AF37] shadow-inner">
                            <ShieldCheck size={32} />
                        </div>

                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 inline-block mb-2">
                                Espace Personnel Sécurisé
                            </span>
                            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-black">
                                Suivi &amp; Solde de Commande
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                                Consultez votre réservation, complétez vos convives et réglez votre solde en toute sérénité.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-3 text-left flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSearchSubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs uppercase font-bold tracking-wider text-neutral-600 mb-1.5">
                                    Numéro de commande
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={orderNumberInput}
                                        onChange={(e) => setOrderNumberInput(e.target.value)}
                                        placeholder="ex: NOEL-64053"
                                        className="w-full bg-[#FAF9F6] border border-neutral-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase font-bold tracking-wider text-neutral-600 mb-1.5">
                                    Adresse email utilisée lors de la commande
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="votre.email@exemple.be"
                                        className="w-full bg-[#FAF9F6] border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-6 rounded-full bg-black hover:bg-[#D4AF37] text-white hover:text-black font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                {isLoading ? (
                                    <span>Recherche en cours...</span>
                                ) : (
                                    <>
                                        <Lock size={14} />
                                        <span>Accéder à ma commande</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-2 border-t border-neutral-100">
                            <p className="text-[11px] text-neutral-500">
                                Le numéro de commande figure dans l&apos;email de confirmation reçu lors de votre réservation.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* Commande chargée avec succès */
                    <div className="space-y-8">

                        {/* ==================================================== */}
                        {/* EN-TÊTE : STATUT & RÉFÉRENCE DE LA COMMANDE          */}
                        {/* ==================================================== */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                                        <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">
                                            Espace Gestion de Commande
                                        </span>
                                    </div>
                                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-black">
                                        Bonjour {order.prenom} {order.nom}
                                    </h1>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3.5 py-1.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono font-bold uppercase tracking-wider">
                                        N° {order.id}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${order.status === 'solde_regle'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                                        }`}>
                                        {order.status === 'solde_regle' ? 'Solde réglé' : 'Acompte enregistré (En attente de solde)'}
                                    </span>
                                </div>
                            </div>

                            {/* Modalités de retrait */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/80 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
                                        <Calendar size={13} className="text-[#927116]" />
                                        <span>Date de votre repas</span>
                                    </span>
                                    <p className="font-serif font-bold text-base text-neutral-900">
                                        {order.repas_date}
                                    </p>
                                </div>

                                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/80 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
                                        <Clock size={13} className="text-[#927116]" />
                                        <span>Créneau de retrait à l&apos;atelier</span>
                                    </span>
                                    <p className="font-serif font-semibold text-neutral-900">
                                        {order.retrait_slot || "À confirmer"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================== */}
                        {/* 1. SÉLECTION INITIALE (VERROUILLÉE)                  */}
                        {/* ==================================================== */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                                <div>
                                    <h2 className="font-serif font-bold text-lg sm:text-xl text-black">
                                        Mets de votre réservation initiale
                                    </h2>
                                    <p className="font-serif italic text-xs text-neutral-500 mt-0.5">
                                        &ldquo;Sélection initiale validée — non modifiable pour des raisons d&apos;organisation en cuisine&rdquo;
                                    </p>
                                </div>
                                <span className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
                                    Verrouillée
                                </span>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                                        <div className="space-y-1">
                                            <p className="font-bold text-neutral-900 font-serif text-sm sm:text-base">
                                                {item.quantitePlat || 1}x {item.nomPlat}
                                            </p>
                                            {item.coursesSummary && Array.isArray(item.coursesSummary) && item.coursesSummary.length > 0 && (
                                                <ul className="text-xs text-neutral-600 space-y-0.5 pl-3 border-l-2 border-[#D4AF37]/50 mt-1">
                                                    {item.coursesSummary.map((c: string, cIdx: number) => (
                                                        <li key={cIdx}>{c}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <span className="font-bold font-serif text-neutral-900 self-end sm:self-center shrink-0">
                                            {Number(item.prixTotalLigne || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Ajouts ultérieurs déjà validés (s'il y en a) */}
                            {order.additional_items && order.additional_items.length > 0 && (
                                <div className="pt-4 border-t border-neutral-200 space-y-3">
                                    <h3 className="font-serif font-bold text-sm text-[#927116] uppercase tracking-wider">
                                        Avenants précédents validés :
                                    </h3>
                                    {order.additional_items.map((item, idx) => (
                                        <div key={idx} className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs sm:text-sm">
                                            <div>
                                                <span className="font-bold text-neutral-900">{item.quantitePlat || 1}x {item.nomPlat}</span>
                                                {item.coursesSummary && (
                                                    <span className="text-[11px] text-neutral-600 block">{item.coursesSummary.join(' • ')}</span>
                                                )}
                                            </div>
                                            <span className="font-bold text-[#927116]">
                                                +{Number(item.prixTotalLigne || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Synthèse financière initiale */}
                            <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                                    <span className="text-neutral-500 block">Total initial TTC :</span>
                                    <span className="font-bold text-sm text-neutral-900">{order.total_initial.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                </div>
                                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                                    <span className="text-neutral-500 block">Acompte demandé (30%) :</span>
                                    <span className="font-bold text-sm text-neutral-900">{order.amount_paid_initial.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                </div>
                                <div className="bg-[#FAF6EB] p-3 rounded-xl border border-[#D4AF37]/40">
                                    <span className="text-[#8A6D1F] font-semibold block">Solde restant initial (70%) :</span>
                                    <span className="font-bold text-sm text-[#927116]">{(order.total_initial - order.amount_paid_initial).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================== */}
                        {/* 2. MODULE D'AJOUTS (« AJUSTER MA COMMANDE »)        */}
                        {/* ==================================================== */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-md space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#D4AF37]" />
                                        <span className="text-xs uppercase font-bold tracking-wider text-[#927116]">
                                            Flexibilité &amp; Convivialité
                                        </span>
                                    </div>
                                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-black mt-1">
                                        Ajuster ma commande (Ajouter des convives / mets)
                                    </h2>
                                </div>

                                {isEarlyBirdOnAdditions ? (
                                    <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                                        -5% Early Bird applicable
                                    </span>
                                ) : (
                                    <span className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto">
                                        Tarif standard
                                    </span>
                                )}
                            </div>

                            {order.payment_mode !== 'acompte_30' ? (
                                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl text-xs sm:text-sm text-neutral-700">
                                    Votre commande a été passée avec un règlement intégral (100 %). Les ajouts en ligne sont réservés aux réservations sur acompte. Pour toute demande d&apos;ajout, contactez notre atelier au <strong>+32 468 38 50 82</strong>.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {!canAdjust ? (
                                        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
                                            <AlertCircle size={18} className="text-amber-800 shrink-0 mt-0.5" />
                                            <span>
                                                La date limite d&apos;ajustement (7 jours avant la date de retrait) est atteinte. La production en cuisine est verrouillée pour garantir une fraîcheur irréprochable. Vous pouvez toutefois régler votre solde ci-dessous.
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                                Vous recevez des convives supplémentaires ? Vous pouvez compléter votre table jusqu&apos;à 7 jours avant le retrait.
                                                {isEarlyBirdOnAdditions
                                                    ? " La remise Early Bird de -5 % s'applique également sur vos ajouts !"
                                                    : " L'avantage de -5 % acquis sur votre commande initiale reste garanti. Les nouveaux ajouts sont comptabilisés au tarif plein standard."}
                                            </p>

                                            {/* Boutons d'ajouts */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => openFormuleModal(FORMULES_FETES[0])}
                                                    className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2EDE2] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all text-left flex items-center gap-3.5 group cursor-pointer shadow-xs"
                                                >
                                                    <div className="w-11 h-11 rounded-xl bg-black text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                        <ChefHat size={22} />
                                                    </div>
                                                    <div>
                                                        <span className="font-serif font-bold text-sm sm:text-base text-black block">
                                                            + Ajouter un convive (Formule)
                                                        </span>
                                                        <span className="text-[11px] text-neutral-500">
                                                            Formule 4 services gastronomiques au choix
                                                        </span>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setIsCarteModalOpen(true)}
                                                    className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2EDE2] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all text-left flex items-center gap-3.5 group cursor-pointer shadow-xs"
                                                >
                                                    <div className="w-11 h-11 rounded-xl bg-black text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                        <ShoppingCart size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="font-serif font-bold text-sm sm:text-base text-black block">
                                                            + Ajouter des mets à la carte
                                                        </span>
                                                        <span className="text-[11px] text-neutral-500">
                                                            Zakouskis, entrées, plats ou bûches à l&apos;unité
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* Liste des ajouts en attente de validation */}
                                            {pendingAdditions.length > 0 && (
                                                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-neutral-200/90 space-y-4">
                                                    <h3 className="font-serif font-bold text-sm text-black flex items-center justify-between">
                                                        <span>Ajouts en cours de validation ({pendingAdditions.length}) :</span>
                                                        <span className="text-xs text-[#927116] font-mono">
                                                            + {additionsTotalAmount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                                        </span>
                                                    </h3>

                                                    <div className="space-y-2">
                                                        {pendingAdditions.map((item, idx) => (
                                                            <div key={idx} className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 text-xs">
                                                                <div>
                                                                    <span className="font-bold text-neutral-900">{item.quantitePlat}x {item.nomPlat}</span>
                                                                    {item.coursesSummary && (
                                                                        <span className="text-[11px] text-neutral-500 block">{item.coursesSummary.join(' • ')}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    <span className="font-bold text-black">
                                                                        {Number(item.prixTotalLigne).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemovePendingAddition(idx)}
                                                                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                                                        title="Supprimer cet ajout"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* ==================================================== */}
                                    {/* DÉCOMPTE FINANCIER DYNAMIQUE DU SOLDE                */}
                                    {/* ==================================================== */}
                                    <div className="bg-[#FAF6EB] p-5 sm:p-6 rounded-2xl border border-[#E8D8A6] space-y-4">
                                        <h3 className="font-serif font-bold text-sm text-[#8A6D1F] uppercase tracking-wider">
                                            Décompte financier actualisé du solde
                                        </h3>

                                        <div className="space-y-1.5 text-xs sm:text-sm text-neutral-700">
                                            <div className="flex justify-between items-center">
                                                <span>Solde restant de la commande initiale (70%) :</span>
                                                <span className="font-bold text-neutral-900">
                                                    {(order.total_initial - order.amount_paid_initial).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                                </span>
                                            </div>

                                            {pendingAdditions.length > 0 && (
                                                <div className="flex justify-between items-center text-[#927116]">
                                                    <span>Nouveaux ajouts en cours :</span>
                                                    <span className="font-bold">
                                                        + {additionsTotalAmount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-baseline pt-2 border-t border-[#D4AF37]/30 text-sm sm:text-base">
                                                <span className="font-bold text-black uppercase tracking-wider">
                                                    Total net à régler pour solder la commande :
                                                </span>
                                                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#D4AF37]">
                                                    {finalNewBalanceTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                                </span>
                                            </div>
                                        </div>

                                        {order.status === 'solde_regle' ? (
                                            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs sm:text-sm text-emerald-900 font-semibold text-center">
                                                ✓ Le solde de cette commande a déjà été intégralement réglé. Merci pour votre confiance !
                                            </div>
                                        ) : (
                                            /* Bouton d'action principal bien mis en avant */
                                            <button
                                                type="button"
                                                onClick={handleProceedToPayment}
                                                disabled={isProcessingPayment}
                                                className="w-full mt-2 py-4 px-6 rounded-full bg-black hover:bg-[#D4AF37] text-white hover:text-black font-serif font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                            >
                                                {isProcessingPayment ? (
                                                    <span>Enregistrement &amp; redirection...</span>
                                                ) : (
                                                    <>
                                                        <span>Régler mon solde final — {finalNewBalanceTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions de pied de page */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] text-neutral-900 border border-[#D4AF37] hover:border-[#927116] font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Printer size={15} className="text-[#927116]" />
                                <span>Imprimer cette fiche de gestion</span>
                            </button>

                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black hover:bg-[#D4AF37] text-white hover:text-black font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={15} />
                                <span>Retour à l&apos;accueil</span>
                            </Link>
                        </div>

                    </div>
                )}
            </div>

            {/* ==================================================== */}
            {/* MODALE 1 : CONFIGURATION D'UNE FORMULE AJOUTÉE       */}
            {/* ==================================================== */}
            <AnimatePresence>
                {isFormuleModalOpen && activeFormule && (
                    <motion.div
                        key="modal-formule"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                    >
                        <div
                            onClick={() => setIsFormuleModalOpen(false)}
                            className="fixed inset-0 bg-black/75 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.97 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#D4AF37] p-6 sm:p-8 z-10 my-8 max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            {/* En-tête */}
                            <div className="flex items-start justify-between pb-4 border-b border-neutral-100 shrink-0">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-2.5 py-1 rounded-full mb-1 inline-block">
                                        Ajouter un convive
                                    </span>
                                    <h3 className="font-serif text-2xl font-bold text-black">
                                        {activeFormule.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-serif font-bold text-lg text-black">
                                            {isEarlyBirdOnAdditions ? (activeFormule.price * 0.95).toFixed(2) : activeFormule.price} €
                                        </span>
                                        <span className="text-xs text-neutral-500">/ convive TVAC</span>
                                        {isEarlyBirdOnAdditions && (
                                            <span className="bg-black text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                -5% Early Bird
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFormuleModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Quantité convives */}
                            <div className="py-3 border-b border-neutral-100 flex items-center justify-between bg-[#FAF9F6] -mx-6 sm:-mx-8 px-6 sm:px-8 shrink-0">
                                <span className="text-xs uppercase font-bold text-neutral-700">
                                    Nombre de convives pour ce choix
                                </span>
                                <div className="inline-flex items-center gap-3 bg-white border border-neutral-300 px-3 py-1.5 rounded-full shadow-2xs">
                                    <button
                                        type="button"
                                        onClick={() => setFormuleQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs"
                                    >
                                        <Minus size={11} />
                                    </button>
                                    <span className="font-serif font-bold text-sm text-black w-5 text-center">
                                        {formuleQuantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setFormuleQuantity(prev => prev + 1)}
                                        className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs"
                                    >
                                        <Plus size={11} />
                                    </button>
                                </div>
                            </div>

                            {/* Choix des étapes */}
                            <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
                                {activeFormule.steps.map(step => {
                                    const currentVal = formuleSelections[step.id];

                                    return (
                                        <div key={step.id} className="space-y-2">
                                            <h4 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-black text-[#D4AF37] text-[10px] font-bold flex items-center justify-center">
                                                    {step.stepNumber}
                                                </span>
                                                <span>{step.stepTitle}</span>
                                            </h4>

                                            {step.selectionType === 'fixed' ? (
                                                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-neutral-200 flex items-start gap-2.5">
                                                    <span className="text-xs text-[#D4AF37] font-bold">✓</span>
                                                    <span className="font-serif font-bold text-xs text-neutral-900">{step.fixedItem?.title}</span>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {step.options.map(option => {
                                                        const isSelected = step.selectionType === 'multiple_2'
                                                            ? Array.isArray(currentVal) && currentVal.includes(option.id)
                                                            : currentVal === option.id;

                                                        return (
                                                            <div
                                                                key={option.id}
                                                                onClick={() => {
                                                                    if (step.selectionType === 'multiple_2') {
                                                                        const prev = Array.isArray(currentVal) ? currentVal : [];
                                                                        if (prev.includes(option.id)) {
                                                                            setFormuleSelections(s => ({ ...s, [step.id]: prev.filter(x => x !== option.id) }));
                                                                        } else if (prev.length < 2) {
                                                                            setFormuleSelections(s => ({ ...s, [step.id]: [...prev, option.id] }));
                                                                        }
                                                                    } else {
                                                                        setFormuleSelections(s => ({ ...s, [step.id]: option.id }));
                                                                    }
                                                                }}
                                                                className={`cursor-pointer p-3 rounded-xl border transition-all text-left ${isSelected
                                                                        ? 'bg-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                                                                        : 'bg-[#FAF9F6] border-neutral-200 hover:border-[#D4AF37]/50'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <p className="font-serif font-bold text-xs text-neutral-900 leading-snug">
                                                                        {option.title}
                                                                    </p>
                                                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-black text-[9px] font-bold' : 'border-neutral-300'}`}>
                                                                        {isSelected && '✓'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pied */}
                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4 shrink-0">
                                <div>
                                    <span className="text-[11px] text-neutral-500 uppercase block">Montant ajout :</span>
                                    <span className="font-serif text-xl font-bold text-black">
                                        {((isEarlyBirdOnAdditions ? activeFormule.price * 0.95 : activeFormule.price) * formuleQuantity).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                    </span>
                                </div>

                                <button
                                    onClick={handleAddFormuleToPending}
                                    className="bg-black hover:bg-[#D4AF37] text-white hover:text-black py-3 px-6 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                                >
                                    Valider cet ajout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================================================== */}
            {/* MODALE 2 : SÉLECTEUR RAPIDE DE METS À LA CARTE        */}
            {/* ==================================================== */}
            <AnimatePresence>
                {isCarteModalOpen && (
                    <motion.div
                        key="modal-carte"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                    >
                        <div
                            onClick={() => setIsCarteModalOpen(false)}
                            className="fixed inset-0 bg-black/75 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.97 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#D4AF37] p-6 sm:p-8 z-10 my-8 max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="flex items-start justify-between pb-4 border-b border-neutral-100 shrink-0">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-2.5 py-1 rounded-full mb-1 inline-block">
                                        Mets à la carte
                                    </span>
                                    <h3 className="font-serif text-2xl font-bold text-black">
                                        Sélectionnez vos portions supplémentaires
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsCarteModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
                                {CARTE_FETES_ITEMS.map(item => {
                                    const qty = carteQuantities[item.id] || 0;
                                    const unitPrice = isEarlyBirdOnAdditions ? item.price * 0.95 : item.price;

                                    return (
                                        <div key={item.id} className="p-3 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 flex items-center justify-between gap-3 text-xs sm:text-sm">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] uppercase font-bold text-[#927116]">{item.categoryLabel}</span>
                                                <p className="font-serif font-bold text-neutral-900">{item.title}</p>
                                                <p className="text-[11px] text-neutral-500">{unitPrice.toFixed(2)} € / {item.unitLabel}</p>
                                            </div>

                                            <div className="inline-flex items-center gap-2 bg-white border border-neutral-300 px-2.5 py-1 rounded-full shadow-2xs shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setCarteQuantities(prev => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] || 0) - 1) }))}
                                                    className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="font-serif font-bold text-xs text-black w-4 text-center">
                                                    {qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setCarteQuantities(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                                                    className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    onClick={handleAddCarteToPending}
                                    className="bg-black hover:bg-[#D4AF37] text-white hover:text-black py-3 px-6 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                                >
                                    Valider ces articles
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function GestionCommandePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center text-sm font-serif text-neutral-500">Chargement de votre espace de gestion...</div>}>
            <GestionCommandeContent />
        </Suspense>
    );
}
