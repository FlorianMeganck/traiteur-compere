"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, ArrowLeft, Download, AlertCircle, Copy,
    CheckCheck, Printer, Mail, MapPin, Calendar, Clock,
    Phone, ExternalLink, Sparkles, ZoomIn, X
} from "lucide-react";
import { Suspense, useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useCart } from "../hooks/useCart";

interface LastOrderSummary {
    orderId?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    total?: number | string;
    toPay?: number | string;
    paymentMode?: 'acompte' | 'total';
    mode?: string;
    solde?: number | string;
    remise?: number | string;
    repasDate?: string;
    jours?: string;
    jour?: string;
    retraitSlot?: string;
    creneau?: string;
}

function CommandeConfirmeeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [order, setOrder] = useState<LastOrderSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { clearCart } = useCart();
    const qrRef = useRef<HTMLDivElement>(null);

    // Vider le panier dès l'arrivée sur cet écran
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    // Récupérer les données depuis la session (ou fallback dev searchParams)
    useEffect(() => {
        let foundOrder: LastOrderSummary | null = null;

        // 1. Priorité absolue : lecture sécurisée depuis sessionStorage
        if (typeof window !== "undefined") {
            try {
                const data = sessionStorage.getItem("lastOrderSummary");
                if (data) {
                    foundOrder = JSON.parse(data);
                }
            } catch (err) {
                console.error("Erreur lecture sessionStorage lastOrderSummary:", err);
            }
        }

        // 2. Fallback temporaire pour le dev via searchParams si présents
        if (!foundOrder && searchParams.get("orderId")) {
            foundOrder = {
                orderId: searchParams.get("orderId") || "NOEL-XXXXX",
                nom: searchParams.get("nom") || "Client",
                prenom: searchParams.get("prenom") || "",
                email: searchParams.get("email") || "",
                total: searchParams.get("total") || "0",
                toPay: searchParams.get("toPay") || undefined,
                mode: searchParams.get("mode") || "totalite_100",
                paymentMode: searchParams.get("mode") === "acompte_30" ? "acompte" : "total",
                solde: searchParams.get("solde") || "0",
                remise: searchParams.get("remise") || "0",
                jours: searchParams.get("jours") || searchParams.get("jour") || "",
                creneau: searchParams.get("creneau") || "",
            };
        }

        if (foundOrder) {
            setOrder(foundOrder);
            setIsLoading(false);
        } else {
            // Aucun ordre en session (accès direct sans commande) : redirection vers l'accueil
            router.replace("/");
        }
    }, [router, searchParams]);

    // État d'ouverture de la modale / lightbox du QR Code
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    // Fermeture avec la touche Échap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsQrModalOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // État de copie des coordonnées avec feedback temporaire
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2500);
        }
    };

    if (isLoading || !order) {
        return (
            <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center text-sm font-serif text-neutral-500">
                Chargement de votre reçu...
            </div>
        );
    }

    const nom = order.nom || "Client";
    const prenom = order.prenom || "";
    const email = order.email || "";
    const orderId = order.orderId || "NOEL-XXXXX";
    const jour = order.jour || "";
    const joursParam = order.jours || order.repasDate || "";
    const creneauParam = order.creneau || order.retraitSlot || "";
    const total = String(order.total ?? "0");
    const toPayParam = order.toPay !== undefined && order.toPay !== null ? String(order.toPay) : undefined;
    const mode = order.mode || (order.paymentMode === "acompte" ? "acompte_30" : "totalite_100");
    const solde = String(order.solde ?? "0");
    const remise = String(order.remise ?? "0");
    const isAcompte = mode === "acompte_30" || order.paymentMode === "acompte";

    // Formattage date de repas et créneau
    let dateRepasText = "À confirmer";
    if (joursParam) {
        dateRepasText = joursParam;
    } else if (jour) {
        dateRepasText = jour;
    }

    // Coordonnées bancaires
    const IBAN_RAW = process.env.NEXT_PUBLIC_TRAITEUR_IBAN || "BE22 0689 4683 8447";
    const IBAN = IBAN_RAW.replace(/(\w{4})/g, "$1 ").trim();
    const IBAN_CLEAN = IBAN_RAW.replace(/\s+/g, "");
    const BIC = process.env.NEXT_PUBLIC_TRAITEUR_BIC || "GKCCBEBB";
    const BENEFICIAIRE = process.env.NEXT_PUBLIC_TRAITEUR_BENEFICIAIRE || "JEAN COMPERE";
    const isNoel = orderId.startsWith("NOEL-");
    const fullNameUpper = `${nom.toUpperCase()} ${prenom.toUpperCase()}`.trim();

    // 1. COMMUNICATION BANCAIRE EXPLICITE (ACOMPTE 30% VS TOTAL 100%)
    let COMMUNICATION = "";
    if (isNoel) {
        if (isAcompte) {
            COMMUNICATION = `${orderId} - ACOMPTE 30% - ${fullNameUpper}`;
        } else {
            COMMUNICATION = `${orderId} - TOTAL 100% - ${fullNameUpper}`;
        }
    } else {
        COMMUNICATION = `COMMANDE #${orderId} ${fullNameUpper}`;
    }

    const TOTAL_NUM = parseFloat(total);
    const TOPAY_NUM = toPayParam ? parseFloat(toPayParam) : TOTAL_NUM;
    const SOLDE_NUM = parseFloat(solde);
    const REMISE_NUM = parseFloat(remise);

    // Chaîne SEPA EPC QR Code standardisée
    const generateEPCString = () => {
        const montantStr = TOPAY_NUM > 0 ? `EUR${TOPAY_NUM.toFixed(2)}` : (TOTAL_NUM > 0 ? `EUR${TOTAL_NUM.toFixed(2)}` : "");
        return `BCD\n002\n1\nSCT\n${BIC}\n${BENEFICIAIRE}\n${IBAN_CLEAN}\n${montantStr}\n\n\n${COMMUNICATION}\n\n`;
    };

    // Téléchargement du QR Code en image PNG
    const handleDownloadQR = () => {
        if (!qrRef.current) return;
        const svg = qrRef.current.querySelector("svg");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new window.Image();
        img.onload = () => {
            canvas.width = img.width + 40;
            canvas.height = img.height + 40;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 20, 20);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `QR_Paiement_${orderId}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    // Impression propre du reçu
    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="min-h-screen pt-32 sm:pt-40 pb-20 bg-[#F7F5F0] text-neutral-900 relative print:bg-white print:pt-0 print:pb-0">
            {/* Lueur d'ambiance dorée supérieure (masquée à l'impression) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10 print:hidden" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 print:max-w-none print:px-0 print:space-y-4">

                {/* ==================================================== */}
                {/* EN-TÊTE DÉDIÉ IMPRESSION A4 (Uniquement pour print)  */}
                {/* ==================================================== */}
                <div className="hidden print:flex flex-col items-center justify-center text-center pb-3 mb-2 border-b-2 border-neutral-800 print-avoid-break">
                    <div className="relative w-44 h-14 mb-1">
                        <Image
                            src="/images/Logo_traiteur.png"
                            alt="Traiteur Compère"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <p className="font-serif italic text-xs text-neutral-800">
                        Maison Gastronomique Compère • Rue Potay 3, 4470 Saint-Georges-sur-Meuse
                    </p>
                    <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                        Tél : +32 468 38 50 82 • contact@traiteur-compere.be • www.traiteur-compere.be
                    </p>
                </div>

                {/* ==================================================== */}
                {/* 1. EN-TÊTE : CONFIRMATION & ALERTE EMAIL             */}
                {/* ==================================================== */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-4 print-avoid-break"
                >
                    {/* Sceau / Coche discrète aux accents dorés (écran uniquement) */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF8F5] to-[#F2EDE2] border border-[#D4AF37]/60 flex items-center justify-center mx-auto shadow-md print:hidden">
                        <div className="w-13 h-13 rounded-full bg-black text-[#D4AF37] flex items-center justify-center shadow-inner">
                            <Check className="w-7 h-7 text-[#D4AF37]" strokeWidth={2.75} />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black font-bold tracking-tight print:text-2xl print:mb-1">
                        Votre réservation est bien enregistrée !
                    </h1>

                    {/* Numéro de commande bien en évidence */}
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider shadow-xs print:bg-neutral-100 print:text-black print:border-neutral-400 print:py-1">
                            <Sparkles size={14} className="text-[#D4AF37] print:hidden" />
                            <span>N° DE COMMANDE : {orderId}</span>
                        </span>
                    </div>

                    {/* Encadré Réassurance Email */}
                    <div className="mt-4 bg-[#F4F8F4] border border-emerald-600/25 rounded-2xl p-4 sm:p-5 text-left text-neutral-800 flex items-start gap-3.5 shadow-2xs print:bg-white print:border-neutral-300 print:p-2.5 print:mt-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 print:hidden">
                            <Mail size={18} />
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed space-y-1 print:text-[10pt]">
                            <p className="font-semibold text-emerald-950 print:text-black">
                                Un email récapitulatif complet vient de vous être envoyé {email ? <>à <strong className="text-emerald-900 underline underline-offset-2 print:text-black">{email}</strong></> : "sur votre messagerie"}.
                            </p>
                            <p className="text-neutral-600 print:text-neutral-700">
                                Vous y retrouverez le détail de vos mets, les modalités de retrait ainsi que les instructions de paiement. Pensez à vérifier vos courriers indésirables (spams) si vous ne le recevez pas dans les prochaines minutes.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* ==================================================== */}
                {/* AVERTISSEMENT DÉLAI 48H & SOUMISSION                 */}
                {/* ==================================================== */}
                <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 sm:p-5 text-left shadow-2xs print:border-neutral-300 print:bg-white print:p-2.5 print-avoid-break">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 print:hidden">
                            <AlertCircle size={18} className="text-amber-800" />
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm">
                            <h4 className="font-bold text-amber-950 font-serif text-sm sm:text-base print:text-black">
                                Validation sous 48h par virement bancaire
                            </h4>
                            <p className="text-neutral-800 leading-relaxed">
                                {isAcompte ? (
                                    <>Votre réservation et la remise de -5 % sont verrouillées dès réception de votre acompte de <strong>{TOPAY_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> sous 48h.</>
                                ) : (
                                    <>Votre réservation est définitivement confirmée dès réception de votre règlement de <strong>{TOPAY_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> sous 48h.</>
                                )}
                            </p>
                            {isAcompte && (
                                <p className="text-neutral-600 text-xs">
                                    Solde restant de <strong>{SOLDE_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> à régler au plus tard 7 jours avant le retrait. Convives ajustables jusqu&apos;à J-7.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. MODULE BANCAIRE ÉPROUVÉ (ANCIENNE STRUCTURE RÉUTILISÉE & PERFECTIONNÉE) */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left print:grid-cols-2 print:gap-4 print-avoid-break">

                    {/* COLONNE GAUCHE : COORDONNÉES BANCAIRES & RÉCAPITULATIF */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between print:border-neutral-300 print:p-3">
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-widest text-neutral-800 mb-6 flex items-center gap-2 print:text-sm print:mb-3">
                                <span className="w-5 h-1 bg-[#D4AF37]"></span>
                                Informations de paiement
                            </h3>

                            <div className="space-y-4 text-sm text-neutral-600 print:space-y-2">
                                {/* Bénéficiaire */}
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">
                                        Bénéficiaire
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-serif font-bold text-neutral-900 text-base select-all">
                                            {BENEFICIAIRE}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(BENEFICIAIRE, 'beneficiaire')}
                                            className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-700 hover:text-black border border-neutral-200 transition-all flex items-center gap-1 cursor-pointer print:hidden"
                                            title="Copier le nom du bénéficiaire"
                                        >
                                            {copiedKey === 'beneficiaire' ? (
                                                <>
                                                    <CheckCheck size={12} className="text-emerald-600" />
                                                    <span className="text-emerald-700">Copié !</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} className="text-[#927116]" />
                                                    <span>Copier</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* IBAN sans coupure */}
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">
                                        IBAN (Compte bancaire)
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-black font-semibold text-sm sm:text-base tracking-wider select-all break-all sm:break-normal">
                                            {IBAN}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(IBAN_CLEAN, 'iban')}
                                            className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-700 hover:text-black border border-neutral-200 transition-all flex items-center gap-1 cursor-pointer print:hidden"
                                            title="Copier l'IBAN"
                                        >
                                            {copiedKey === 'iban' ? (
                                                <>
                                                    <CheckCheck size={12} className="text-emerald-600" />
                                                    <span className="text-emerald-700">Copié !</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} className="text-[#927116]" />
                                                    <span>Copier</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* BIC */}
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">
                                        BIC / SWIFT
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-black font-semibold text-sm sm:text-base tracking-wider select-all">
                                            {BIC}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(BIC, 'bic')}
                                            className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-700 hover:text-black border border-neutral-200 transition-all flex items-center gap-1 cursor-pointer print:hidden"
                                            title="Copier le code BIC"
                                        >
                                            {copiedKey === 'bic' ? (
                                                <>
                                                    <CheckCheck size={12} className="text-emerald-600" />
                                                    <span className="text-emerald-700">Copié !</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} className="text-[#927116]" />
                                                    <span>Copier</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Communication explicite */}
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-widest text-[#927116] font-bold mb-1 print:text-black">
                                        Communication obligatoire
                                    </span>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#D4AF37]/10 p-2.5 rounded-xl border border-[#D4AF37]/40 print:bg-neutral-100 print:border-neutral-300">
                                        <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 select-all break-words">
                                            {COMMUNICATION}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(COMMUNICATION, 'comm')}
                                            className="self-start sm:self-center shrink-0 px-2.5 py-1 rounded text-xs font-semibold bg-black hover:bg-[#D4AF37] text-white hover:text-black transition-all flex items-center gap-1 cursor-pointer print:hidden"
                                            title="Copier la communication"
                                        >
                                            {copiedKey === 'comm' ? (
                                                <>
                                                    <CheckCheck size={12} className="text-emerald-400" />
                                                    <span>Copié !</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    <span>Copier</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Récapitulatif financier sous les coordonnées */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 space-y-2.5 print:mt-4 print:pt-3 print:space-y-1.5">
                            {REMISE_NUM > 0 && (
                                <div className="flex justify-between items-center text-xs sm:text-sm text-emerald-700 font-medium">
                                    <span>Promotion Early Bird (-5%)</span>
                                    <span className="font-bold">-{REMISE_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs sm:text-sm text-neutral-600">
                                <span>Total global TTC</span>
                                <span className="font-bold text-black">{TOTAL_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                            </div>

                            {isAcompte ? (
                                <>
                                    <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-neutral-200">
                                        <div>
                                            <span className="uppercase tracking-widest font-bold text-amber-800 text-xs block">
                                                Acompte à verser (30%)
                                            </span>
                                            <span className="text-[11px] text-neutral-500">Sous 48h pour valider</span>
                                        </div>
                                        <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">
                                            {TOPAY_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-neutral-500 pt-0.5">
                                        <span>Solde restant (à J-7 du retrait)</span>
                                        <span className="font-medium text-neutral-800">
                                            {SOLDE_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-neutral-200">
                                    <span className="uppercase tracking-widest font-bold text-neutral-600 text-xs">
                                        Montant intégral (100%)
                                    </span>
                                    <span className="text-2xl sm:text-3xl font-serif font-bold text-black">
                                        {TOTAL_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLONNE DROITE : MODULE NOIR & OR SCANNEZ & PAYEZ AVEC ZOOM */}
                    <div className="bg-black text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden text-center print:bg-white print:text-black print:border print:border-neutral-300 print:p-3">
                        {/* Lueur dorée d'angle (masquée print) */}
                        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none print:hidden"></div>

                        <h3 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-1.5 z-10 print:text-black print:text-sm">
                            Scannez &amp; Payez
                        </h3>

                        <p className="text-xs font-semibold text-neutral-300 mb-2 z-10 print:text-black">
                            Montant : <span className="text-[#D4AF37] font-bold text-sm sm:text-base print:text-black">{TOPAY_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                            {isAcompte ? ' (Acompte 30%)' : ' (Paiement total)'}
                        </p>

                        <p className="text-xs text-neutral-400 mb-4 z-10 max-w-xs print:text-[8.5pt] print:text-neutral-600">
                            Scannez ce QR Code EPC avec votre application bancaire (Belfius, BNP, ING, KBC...) pour pré-remplir le virement.
                        </p>

                        {/* Le QR Code Cliquable avec zoom / modale */}
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setIsQrModalOpen(true)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setIsQrModalOpen(true);
                                }
                            }}
                            className="bg-white p-3.5 sm:p-4 rounded-xl z-10 cursor-pointer hover:ring-4 hover:ring-[#D4AF37]/60 transition-all duration-200 group relative shadow-md print:border print:border-neutral-300 print:p-2"
                            title="Cliquer pour agrandir le QR Code"
                            aria-label="Agrandir le QR Code"
                        >
                            <div ref={qrRef} className="flex justify-center">
                                <QRCode
                                    value={generateEPCString()}
                                    size={160}
                                    level="M"
                                    className="rounded-lg print:w-28 print:h-28"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center pointer-events-none print:hidden">
                                <span className="bg-black text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                                    <ZoomIn size={13} />
                                    <span>Agrandir</span>
                                </span>
                            </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 mt-2 z-10 print:hidden flex items-center gap-1">
                            <ZoomIn size={12} className="text-[#D4AF37]" />
                            <span>Cliquer sur le QR code pour l&apos;agrandir</span>
                        </p>

                        <button
                            type="button"
                            onClick={handleDownloadQR}
                            className="mt-4 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors z-10 print:hidden cursor-pointer bg-neutral-900/80 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800"
                        >
                            <Download size={13} className="text-[#D4AF37]" />
                            <span>Télécharger le QR Code PNG</span>
                        </button>
                    </div>
                </div>

                {/* ==================================================== */}
                {/* 3. RAPPEL PRATIQUE DE LOGISTIQUE & RETRAIT           */}
                {/* ==================================================== */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-[#FAF8F5] border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs print:bg-white print:border-neutral-300 print:rounded-2xl print:p-4 print:space-y-3 print-avoid-break"
                >
                    <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3 print:border-neutral-300 print:pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] print:hidden" />
                        <h2 className="font-serif font-bold text-lg sm:text-xl text-black print:text-sm">
                            Rappel pratique • Retrait de vos mets de fêtes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm print:grid-cols-2 print:gap-3">
                        {/* Date du repas */}
                        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1 print:border-neutral-300 print:p-2.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5 print:text-neutral-600">
                                <Calendar size={13} className="text-[#927116] print:hidden" />
                                <span>Date de votre repas</span>
                            </span>
                            <p className="font-serif font-bold text-base text-neutral-900 print:text-xs">
                                {dateRepasText}
                            </p>
                        </div>

                        {/* Créneau de retrait */}
                        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1 print:border-neutral-300 print:p-2.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5 print:text-neutral-600">
                                <Clock size={13} className="text-[#927116] print:hidden" />
                                <span>Créneau de retrait à l&apos;atelier</span>
                            </span>
                            <p className="font-serif font-semibold text-sm text-neutral-900 leading-snug print:text-xs">
                                {creneauParam || "Veille (14h00 - 18h00) ou Jour même (08h00 - 12h00)"}
                            </p>
                        </div>
                    </div>

                    {/* Adresse de retrait avec lien Google Maps */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:border-neutral-300 print:p-2.5">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5 print:text-neutral-600">
                                <MapPin size={13} className="text-[#927116] print:hidden" />
                                <span>Atelier artisanal de retrait</span>
                            </span>
                            <p className="font-serif font-bold text-base text-black print:text-xs">
                                Maison Compère — Rue Potay 3, 4470 Saint-Georges-sur-Meuse
                            </p>
                            <p className="text-xs text-neutral-500 print:text-[8.5pt]">
                                Parking aisé devant l&apos;atelier • Province de Liège
                            </p>
                        </div>

                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Traiteur+Compere+Rue+Potay+3+4470+Saint-Georges-sur-Meuse"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-800 hover:text-black border border-neutral-200 hover:border-[#D4AF37] text-xs font-semibold transition-colors shrink-0 shadow-2xs print:hidden"
                        >
                            <span>Ouvrir dans Google Maps</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>

                    {/* Réchauffage & Dressage */}
                    <div className="bg-[#F4EFE6]/60 border border-[#D4AF37]/30 rounded-2xl p-4 text-center print:bg-white print:border-neutral-300 print:p-2.5">
                        <p className="font-serif italic text-neutral-800 text-xs sm:text-sm leading-relaxed print:text-[8.5pt]">
                            &ldquo;Toutes les explications nécessaires pour une remise en température et un dressage parfaits vous seront fournies lors du retrait.&rdquo;
                        </p>
                    </div>
                </motion.section>

                {/* ==================================================== */}
                {/* 4. ACTIONS UTILES (PIED DE PAGE)                     */}
                {/* ==================================================== */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-center space-y-6 pt-2 print:space-y-2 print:pt-1 print-avoid-break"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 print:hidden">
                        {/* Bouton 1 : Imprimer ce reçu */}
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] text-neutral-900 border border-[#D4AF37] hover:border-[#927116] font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Printer size={15} className="text-[#927116]" />
                            <span>Imprimer ce reçu</span>
                        </button>

                        {/* Bouton 2 : Retour à l'accueil */}
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black hover:bg-[#D4AF37] text-white hover:text-black font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={15} />
                            <span>Retour à l&apos;accueil</span>
                        </Link>
                    </div>

                    {/* Ligne d'assistance */}
                    <p className="text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed pt-2 print:text-[8.5pt] print:text-neutral-700">
                        Une question concernant votre commande ? Contactez-nous directement au{" "}
                        <a href="tel:+32468385082" className="font-bold text-black hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/50 underline-offset-2">
                            +32 468 38 50 82
                        </a>{" "}
                        ou par email à{" "}
                        <a href="mailto:contact@traiteur-compere.be" className="font-bold text-black hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/50 underline-offset-2">
                            contact@traiteur-compere.be
                        </a>.
                    </p>
                </motion.section>

            </div>

            {/* ==================================================== */}
            {/* 5. MODALE / LIGHTBOX DU QR CODE (AGRANDISSEMENT)     */}
            {/* ==================================================== */}
            <AnimatePresence>
                {isQrModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
                        {/* Arrière-plan sombre avec flou */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsQrModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                            aria-label="Fermer la modale"
                        />

                        {/* Conteneur de la modale */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-2 border-[#D4AF37] z-10 text-center space-y-4 my-auto overflow-hidden"
                        >
                            {/* Bouton fermeture croix */}
                            <button
                                type="button"
                                onClick={() => setIsQrModalOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Fermer"
                            >
                                <X size={16} />
                            </button>

                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 inline-block mb-1.5">
                                    Paiement par QR Code EPC
                                </span>
                                <h3 className="font-serif font-bold text-xl text-black">
                                    Scannez pour payer
                                </h3>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Ouvrez votre application bancaire belge (KBC, Belfius, BNP, ING...)
                                </p>
                            </div>

                            {/* Le grand QR Code bien lisible */}
                            <div className="bg-white p-4 rounded-2xl border-2 border-neutral-200 shadow-md inline-block mx-auto">
                                <QRCode
                                    value={generateEPCString()}
                                    size={220}
                                    level="M"
                                    className="rounded-lg"
                                />
                            </div>

                            {/* Rappel du montant et de la communication structurée */}
                            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-200/90 text-left space-y-2 text-xs">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500 font-medium">Montant exact :</span>
                                    <span className="font-serif font-bold text-lg text-black">
                                        {TOPAY_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        {isAcompte && <span className="text-[11px] text-[#927116] font-sans font-semibold ml-1">(Acompte 30%)</span>}
                                    </span>
                                </div>
                                <div className="border-t border-neutral-200/70 pt-2">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                                        Communication obligatoire :
                                    </span>
                                    <span className="font-mono font-bold text-xs text-neutral-900 block break-words select-all">
                                        {COMMUNICATION}
                                    </span>
                                </div>
                            </div>

                            {/* Bouton de téléchargement */}
                            <button
                                type="button"
                                onClick={handleDownloadQR}
                                className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                            >
                                <Download size={14} />
                                <span>Télécharger l&apos;image du QR Code</span>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function CommandeConfirmee() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center text-sm font-serif text-neutral-500">Chargement de votre reçu...</div>}>
            <CommandeConfirmeeContent />
        </Suspense>
    );
}
