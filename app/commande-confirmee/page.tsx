"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Download } from "lucide-react";
import { Suspense, useRef } from "react";
import QRCode from "react-qr-code";

function CommandeConfirmeeContent() {
    const searchParams = useSearchParams();
    const nom = searchParams.get('nom') || "Client";
    const prenom = searchParams.get('prenom') || "";
    const orderId = searchParams.get('orderId') || "";
    const jour = searchParams.get('jour') || "";
    const plat = searchParams.get('plat') || "votre commande";
    const total = searchParams.get('total') || "0";

    const qrRef = useRef<HTMLDivElement>(null);

    // Logique pour déterminer le jour de retrait
    const getPickupDay = (j: string) => {
        const d = j.toLowerCase();
        if (d === 'lundi' || d === 'mardi') return 'Mardi';
        if (d === 'mercredi' || d === 'jeudi') return 'Jeudi';
        if (d === 'vendredi' || d === 'samedi') return 'Samedi';
        return null;
    };
    const jourRetrait = getPickupDay(jour);

    // Informations bancaires pour la génération du QR Code (à adapter)
    const IBAN = process.env.NEXT_PUBLIC_TRAITEUR_IBAN || "BE22 0689 4683 8447";
    const BIC = process.env.NEXT_PUBLIC_TRAITEUR_BIC || "GKCCBEBB";
    const BENEFICIAIRE = process.env.NEXT_PUBLIC_TRAITEUR_BENEFICIAIRE || "JEAN COMPERE";
    const COMMUNICATION = `COMMANDE #${orderId} ${nom.toUpperCase()} ${prenom.toUpperCase()}`.trim();
    const TOTAL_NUM = parseFloat(total);

    // Fonction pour générer la chaîne EPC pour le QR Code (Virement SEPA)
    const generateEPCString = () => {
        const montantStr = TOTAL_NUM > 0 ? TOTAL_NUM.toFixed(2) : "";
        return `BCD\n002\n1\nSCT\n${BIC}\n${BENEFICIAIRE}\n${IBAN}\n${montantStr}\n\n\n${COMMUNICATION}\n\n`;
    };

    const handleDownloadQR = () => {
        if (!qrRef.current) return;
        const svg = qrRef.current.querySelector("svg");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = "QR_Paiement_Traiteur_Compere.png";
                downloadLink.href = `${pngFile}`;
                downloadLink.click();
            }
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white shadow-2xl p-8 md:p-14 rounded-[2rem] border-t-4 border-[#D4AF37] text-center"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm border-4 border-green-100">
                        <Check className="w-12 h-12 text-green-600" strokeWidth={4} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">Commande Confirmée</h1>

                    <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
                        Merci <span className="font-bold text-black">{prenom} {nom}</span>, votre commande pour <strong className="text-[#D4AF37] font-serif">{plat}</strong> a bien été enregistrée.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10 text-left">
                        {/* Bloc Récapitulatif Paiement */}
                        <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-neutral-800 mb-6 flex items-center gap-2">
                                    <span className="w-6 h-1 bg-[#D4AF37]"></span>
                                    Informations de paiement
                                </h3>
                                <div className="space-y-4 text-sm md:text-base text-neutral-600">
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">Bénéficiaire</span>
                                        <span className="font-medium text-black">{BENEFICIAIRE}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">IBAN</span>
                                        <span className="font-mono text-black font-semibold text-base tracking-wider">{IBAN}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">Communication</span>
                                        <span className="font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded inline-block w-fit mt-1">{COMMUNICATION}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">Jour de retrait</span>
                                        <span className="font-bold text-black flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            {jourRetrait ? `Le ${jourRetrait} après 11h` : "À confirmer"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-neutral-200">
                                <div className="flex justify-between items-end">
                                    <span className="uppercase tracking-widest font-bold text-neutral-500">Montant total</span>
                                    <span className="text-3xl font-serif font-bold text-black">{TOTAL_NUM.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloc QR Code */}
                        <div className="bg-black text-white p-8 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-6 z-10 text-center">
                                Scannez & Payez
                            </h3>
                            <p className="text-sm text-neutral-400 mb-6 text-center z-10">Ouvrez votre application bancaire et scannez ce code pour pré-remplir le virement.</p>

                            <div className="bg-white p-4 rounded-xl z-10" ref={qrRef}>
                                <QRCode
                                    value={generateEPCString()}
                                    size={180}
                                    level="M"
                                />
                            </div>

                            <button
                                onClick={handleDownloadQR}
                                className="mt-6 text-xs text-neutral-400 hover:text-white flex items-center gap-2 transition-colors z-10"
                            >
                                <Download size={14} />
                                Télécharger le QR Code
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-neutral-500 max-w-lg mx-auto mb-10 italic">
                        Un e-mail récapitulatif vous a été envoyé. N'oubliez pas que votre commande sera définitivement confirmée à la réception de votre paiement.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
                    >
                        <ArrowLeft size={16} />
                        Retour à l'accueil
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}

export default function CommandeConfirmee() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <CommandeConfirmeeContent />
        </Suspense>
    );
}
