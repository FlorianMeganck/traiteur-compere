"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Check, ArrowLeft, Download, AlertCircle, Copy,
    CheckCheck, Printer, Mail, MapPin, Calendar, Clock,
    Phone, ExternalLink, Sparkles, ShieldCheck
} from "lucide-react";
import { Suspense, useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useCart } from "../hooks/useCart";

function CommandeConfirmeeContent() {
    const searchParams = useSearchParams();
    const nom = searchParams.get('nom') || "Client";
    const prenom = searchParams.get('prenom') || "";
    const email = searchParams.get('email') || "";
    const orderId = searchParams.get('orderId') || "NOEL-XXXXX";
    const jour = searchParams.get('jour') || "";
    const joursParam = searchParams.get('jours') || "";
    const creneauParam = searchParams.get('creneau') || "";
    const total = searchParams.get('total') || "0";
    const toPayParam = searchParams.get('toPay');
    const mode = searchParams.get('mode') || 'totalite_100';
    const solde = searchParams.get('solde') || '0';
    const remise = searchParams.get('remise') || '0';
    const isAcompte = mode === 'acompte_30';

    const { clearCart } = useCart();
    const qrRef = useRef<HTMLDivElement>(null);

    // Vider le panier dès l'arrivée sur cet écran
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    // État de copie des coordonnées avec feedback temporaire
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2500);
        }
    };

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
    const COMMUNICATION = isNoel
        ? `${orderId} - ${fullNameUpper}`
        : `COMMANDE #${orderId} ${fullNameUpper}`;

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
        const img = new Image();
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
            {/* Lueur d'ambiance dorée supérieure */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10 print:hidden" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">

                {/* ==================================================== */}
                {/* 1. EN-TÊTE : CONFIRMATION & ALERTE EMAIL             */}
                {/* ==================================================== */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-4"
                >
                    {/* Sceau / Coche discrète aux accents dorés */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF8F5] to-[#F2EDE2] border border-[#D4AF37]/60 flex items-center justify-center mx-auto shadow-md">
                        <div className="w-13 h-13 rounded-full bg-black text-[#D4AF37] flex items-center justify-center shadow-inner">
                            <Check className="w-7 h-7 text-[#D4AF37]" strokeWidth={2.75} />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black font-bold tracking-tight">
                        Votre réservation est bien enregistrée !
                    </h1>

                    {/* Numéro de commande bien en évidence */}
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider shadow-xs">
                            <Sparkles size={14} className="text-[#D4AF37]" />
                            <span>N° DE COMMANDE : {orderId}</span>
                        </span>
                    </div>

                    {/* Encadré Réassurance Email */}
                    <div className="mt-6 bg-[#F4F8F4] border border-emerald-600/25 rounded-2xl p-4 sm:p-5 text-left text-neutral-800 flex items-start gap-3.5 shadow-2xs">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                            <Mail size={18} />
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
                            <p className="font-semibold text-emerald-950">
                                Un email récapitulatif complet vient de vous être envoyé {email ? <>à <strong className="text-emerald-900 underline underline-offset-2">{email}</strong></> : "sur votre messagerie"}.
                            </p>
                            <p className="text-neutral-600">
                                Vous y retrouverez le détail de vos mets, les modalités de retrait ainsi que les instructions de paiement. Pensez à vérifier vos courriers indésirables (spams) si vous ne le recevez pas dans les prochaines minutes.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* ==================================================== */}
                {/* 2. BLOC CENTRAL : RÈGLEMENT PAR VIREMENT BANCAIRE    */}
                {/* ==================================================== */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-3xl border border-[#E8E2D5] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                    {/* A. MONTANT EXIGIBLE SOUS 48H */}
                    <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-[#FAF9F6] border-b border-[#E8E2D5] text-center space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#927116] border border-[#D4AF37]/30 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                            <Clock size={13} />
                            <span>
                                {isAcompte
                                    ? "Acompte de validation (30 %) à verser sous 48h"
                                    : "Règlement intégral sous 48h (commande ferme et figée)"}
                            </span>
                        </div>

                        {/* Montant affiché en très grand format */}
                        <div className="py-1">
                            <div className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-black tracking-tight">
                                {TOPAY_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                            </div>
                            {isAcompte && TOTAL_NUM > 0 && (
                                <p className="text-xs text-neutral-500 font-sans mt-1">
                                    Montant total TTC de la commande : {TOTAL_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                </p>
                            )}
                        </div>

                        {/* Mentions sous le montant selon acompte ou total */}
                        {isAcompte ? (
                            <div className="bg-[#FAF8F5] border border-[#D4AF37]/35 rounded-xl p-3.5 max-w-xl mx-auto text-xs text-neutral-700 leading-relaxed text-center sm:text-left">
                                <p>
                                    <strong className="text-neutral-900">Solde restant de {SOLDE_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> à régler au plus tard 7 jours avant le retrait. Le nombre de convives et vos choix restent ajustables par téléphone ou email jusqu&apos;à 7 jours avant le retrait.
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed">
                                Commande ferme et définitive. Votre réservation est enregistrée au centime près.
                            </p>
                        )}

                        {/* Avertissement délai de 48h */}
                        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2.5 max-w-xl mx-auto">
                            <AlertCircle size={15} className="shrink-0 text-amber-700" />
                            <span>
                                « Votre réservation ainsi que la remise éventuelle de -5 % sont définitivement verrouillées dès réception de votre virement bancaire sous 48h. »
                            </span>
                        </div>
                    </div>

                    {/* B. DEUX MÉTHODES DE PAIEMENT (CÔTE À CÔTE DESKTOP / EMPILÉES MOBILE) */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                        {/* OPTION 1 : QR CODE EPC BELGIQUE */}
                        <div className="bg-[#FAF9F6] border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 flex flex-col justify-between items-center text-center">
                            <div className="w-full space-y-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#927116] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                                    Option 1 • Instantané
                                </span>
                                <h3 className="font-serif font-bold text-lg text-black">
                                    Paiement par QR Code EPC
                                </h3>
                                <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                                    Scannez directement depuis votre application bancaire (Belfius, BNP Paribas Fortis, ING, KBC...) pour pré-remplir le virement sans saisie manuelle.
                                </p>
                            </div>

                            {/* Le QR Code */}
                            <div className="my-5 bg-white p-3.5 rounded-2xl border-2 border-neutral-200 shadow-sm" ref={qrRef}>
                                <QRCode
                                    value={generateEPCString()}
                                    size={160}
                                    level="M"
                                    className="rounded-lg"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleDownloadQR}
                                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs hover:border-[#D4AF37] print:hidden cursor-pointer"
                            >
                                <Download size={14} className="text-[#927116]" />
                                <span>Télécharger le QR Code PNG</span>
                            </button>
                        </div>

                        {/* OPTION 2 : COORDONNÉES BANCAIRES AVEC BOUTONS COPIER */}
                        <div className="bg-[#FAF9F6] border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
                            <div className="space-y-2 mb-4">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 bg-neutral-200/80 px-2.5 py-0.5 rounded-full">
                                    Option 2 • Virement manuel
                                </span>
                                <h3 className="font-serif font-bold text-lg text-black">
                                    Coordonnées bancaires
                                </h3>
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                    Copiez chaque coordonnée ci-dessous pour effectuer votre virement depuis votre application ou votre espace en ligne :
                                </p>
                            </div>

                            {/* Liste des champs avec bouton Copier */}
                            <div className="space-y-3">
                                {/* Bénéficiaire */}
                                <div className="bg-white p-3 rounded-xl border border-neutral-200/90 flex items-center justify-between gap-3 shadow-2xs">
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                                            Bénéficiaire
                                        </span>
                                        <span className="font-serif font-bold text-sm text-neutral-900 truncate block">
                                            {BENEFICIAIRE}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(BENEFICIAIRE, 'beneficiaire')}
                                        className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-800 hover:text-black border border-neutral-200 hover:border-[#D4AF37] transition-all flex items-center gap-1 cursor-pointer"
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

                                {/* IBAN */}
                                <div className="bg-white p-3 rounded-xl border border-neutral-200/90 flex items-center justify-between gap-3 shadow-2xs">
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                                            IBAN
                                        </span>
                                        <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 truncate block tracking-wide">
                                            {IBAN}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(IBAN_CLEAN, 'iban')}
                                        className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-800 hover:text-black border border-neutral-200 hover:border-[#D4AF37] transition-all flex items-center gap-1 cursor-pointer"
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

                                {/* BIC */}
                                <div className="bg-white p-3 rounded-xl border border-neutral-200/90 flex items-center justify-between gap-3 shadow-2xs">
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                                            BIC / SWIFT
                                        </span>
                                        <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 truncate block tracking-wider">
                                            {BIC}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(BIC, 'bic')}
                                        className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-[#FAF8F5] text-neutral-800 hover:text-black border border-neutral-200 hover:border-[#D4AF37] transition-all flex items-center gap-1 cursor-pointer"
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

                                {/* Communication obligatoire */}
                                <div className="bg-white p-3 rounded-xl border-2 border-[#D4AF37]/50 flex items-center justify-between gap-3 shadow-xs">
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] uppercase tracking-wider text-[#927116] font-bold block">
                                            Communication obligatoire
                                        </span>
                                        <span className="font-mono font-bold text-xs text-neutral-900 truncate block">
                                            {COMMUNICATION}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(COMMUNICATION, 'comm')}
                                        className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-black hover:bg-[#D4AF37] text-white hover:text-black transition-all flex items-center gap-1 cursor-pointer"
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
                </motion.section>

                {/* ==================================================== */}
                {/* 3. RAPPEL PRATIQUE DE LOGISTIQUE & RETRAIT           */}
                {/* ==================================================== */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-[#FAF8F5] border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs"
                >
                    <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                        <h2 className="font-serif font-bold text-lg sm:text-xl text-black">
                            Rappel pratique • Retrait de vos mets de fêtes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                        {/* Date du repas */}
                        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                                <Calendar size={13} className="text-[#927116]" />
                                <span>Date de votre repas</span>
                            </span>
                            <p className="font-serif font-bold text-base text-neutral-900">
                                {dateRepasText}
                            </p>
                        </div>

                        {/* Créneau de retrait */}
                        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                                <Clock size={13} className="text-[#927116]" />
                                <span>Créneau de retrait à l&apos;atelier</span>
                            </span>
                            <p className="font-serif font-semibold text-sm text-neutral-900 leading-snug">
                                {creneauParam || "Veille (14h00 - 18h00) ou Jour même (08h00 - 12h00)"}
                            </p>
                        </div>
                    </div>

                    {/* Adresse de retrait avec lien Google Maps */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                                <MapPin size={13} className="text-[#927116]" />
                                <span>Atelier artisanal de retrait</span>
                            </span>
                            <p className="font-serif font-bold text-base text-black">
                                Maison Compère — Rue Potay 3, 4470 Saint-Georges-sur-Meuse
                            </p>
                            <p className="text-xs text-neutral-500">
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
                    <div className="bg-[#F4EFE6]/60 border border-[#D4AF37]/30 rounded-2xl p-4 text-center">
                        <p className="font-serif italic text-neutral-800 text-xs sm:text-sm leading-relaxed">
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
                    className="text-center space-y-6 pt-2"
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
                    <p className="text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed pt-2">
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
