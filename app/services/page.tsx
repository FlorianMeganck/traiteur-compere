"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

const HERO_ANCHORS = [
    {
        id: "receptions",
        num: "01",
        label: "Réceptions & Service en Salle",
    },
    {
        id: "brasseur",
        num: "02",
        label: "Bar Brasseur « Zéro Gaspillage »",
    },
    {
        id: "materiel",
        num: "03",
        label: "Matériel & Mobilier",
    },
];

const HOW_IT_WORKS_STEPS = [
    {
        step: "01",
        title: "Votre devis sur-mesure",
        desc: "Nous composons votre menu, calibrons vos boissons ainsi que le matériel nécessaire et vous transmettons une offre claire sous 24h.",
    },
    {
        step: "02",
        title: "Livraison, installation & service le jour J",
        desc: "Mise en place ponctuelle sur votre lieu de réception (frigo vitré, vaisselle, mobilier, buffets) et service attentif par notre équipe.",
    },
    {
        step: "03",
        title: "Reprise des invendus & décompte final",
        desc: "Nous reprenons le matériel, les vidanges et toutes les bouteilles ou fûts non entamés : vous ne réglez que le réel consommé.",
    },
];

const SERVICES_FAQ = [
    {
        question: "Comment fonctionne le Bar Brasseur « Zéro Gaspillage » ?",
        answer: "Nous livrons et installons un frigo vitré professionnel garni d'un stock calibré large (fûts, bières belges, vins, bulles, softs et eaux). Après la fête, nous reprenons intégralement les bouteilles et fûts non entamés ainsi que les vidanges : seules les consommations réellement ouvertes sont facturées.",
    },
    {
        question: "Que comprend la location de matériel, vaisselle et mobilier ?",
        answer: "Nous pouvons équiper l'ensemble de votre réception : vaisselle complète (1,50 €/pers. HTVA, lavage inclus), verrerie assortie (1,50 € par lot de 5 verres), matériel thermique (chafing dishes, bains-marie, grils), ainsi que mange-debout, tables, chaises et nappage avec livraison et reprise.",
    },
    {
        question: "Peut-on réserver uniquement le repas en livraison, avec ou sans personnel ?",
        answer: "Oui, tout est modulable selon votre événement : vous pouvez choisir la livraison frigorifique seule (ou le retrait gratuit à notre atelier) ou confier la mise en place, le service en salle et la tenue du bar à notre équipe au tarif transparent de 18,00 € / heure HTVA par personne.",
    },
    {
        question: "Dans quelles communes intervenez-vous ?",
        answer: "Depuis notre atelier de Saint-Georges-sur-Meuse (Rue Potay 3, accès direct E42), nous intervenons à Liège, Huy, Waremme, Grâce-Hollogne, Amay, Verlaine, Flémalle, Seraing, Hannut et partout en Wallonie.",
    },
];

export default function ServicesPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string
    ) => {
        const el = document.getElementById(targetId);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `#${targetId}`);
        }
    };

    return (
        <main className="bg-[#FAF8F5] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white pt-40 md:pt-48 overflow-hidden">
            {/* ============================================================== */}
            {/* 1. HERO SOBRE & 3 ANCRES DISCRÈTES                             */}
            {/* ============================================================== */}
            <section className="px-6 pb-16 md:pb-20 max-w-4xl mx-auto text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[#996515] font-bold mb-4">
                    Maison Compère • Liège, Huy, Waremme &amp; Saint-Georges
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#111111] leading-tight mb-6">
                    Nos Services Traiteur &amp; Réceptions
                </h1>
                <p className="text-neutral-600 font-light text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                    Un interlocuteur unique pour orchestrer votre événement de A à Z :
                    service attentionné en salle, bar brasseur sans perte et location
                    complète de matériel de réception.
                </p>

                {/* 3 ancres discrètes de navigation directe */}
                <nav
                    aria-label="Accès direct aux pôles de services"
                    className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-[#E8E2D5]"
                >
                    {HERO_ANCHORS.map((anchor, idx) => (
                        <div key={anchor.id} className="inline-flex items-center gap-6">
                            <a
                                href={`#${anchor.id}`}
                                onClick={(e) => handleSmoothScroll(e, anchor.id)}
                                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-[#996515] transition-colors"
                            >
                                <span className="font-serif italic text-[#996515] text-sm">
                                    {anchor.num}.
                                </span>
                                <span className="underline decoration-[#D4AF37]/40 underline-offset-4 group-hover:decoration-[#996515]">
                                    {anchor.label}
                                </span>
                            </a>
                            {idx < HERO_ANCHORS.length - 1 && (
                                <span
                                    className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#D4AF37]/60"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    ))}
                </nav>
            </section>

            {/* Séparateur doré satiné */}
            <div
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"
                aria-hidden="true"
            />

            {/* ============================================================== */}
            {/* BLOC 1 — RÉCEPTIONS & SERVICE EN SALLE (FOND BLANC)            */}
            {/* ============================================================== */}
            <section
                id="receptions"
                aria-labelledby="heading-receptions"
                className="scroll-mt-28 bg-white py-20 md:py-28 px-6 relative"
            >
                {/* Ancres secondaires de compatibilité SEO & maillage existant */}
                <span id="pole-receptions" className="scroll-mt-28" aria-hidden="true" />
                <span id="mariages" className="scroll-mt-28" aria-hidden="true" />
                <span id="entreprises" className="scroll-mt-28" aria-hidden="true" />
                <span id="particuliers" className="scroll-mt-28" aria-hidden="true" />

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Visuel éditorial */}
                    <div className="lg:col-span-5">
                        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#E8E2D5] aspect-[4/3] lg:aspect-[4/4.6] bg-neutral-100">
                            <Image
                                src="/images/Buffet-froid-reception.jpeg"
                                alt="Réceptions, mariages et service traiteur en salle à Liège, Huy et Waremme - Maison Compère"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                        </div>
                    </div>

                    {/* Contenu éditorial aéré */}
                    <div className="lg:col-span-7 space-y-7">
                        <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                                Pilier 01 • Réceptions &amp; Accompagnement Humain
                            </span>
                            <h2
                                id="heading-receptions"
                                className="text-3xl sm:text-4xl font-serif text-[#111111] leading-snug mb-4"
                            >
                                Réceptions &amp; Service en Salle
                            </h2>
                            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                                Du mariage intimiste au grand banquet d&apos;entreprise, notre
                                brigade assure la mise en place, la cuisson minute et un
                                service attentionné pour que vous profitiez pleinement de vos
                                invités.
                            </p>
                        </div>

                        {/* Deux colonnes légères pour aérer la lecture */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E2D5]/80">
                                <h3 className="font-serif font-bold text-lg text-[#111111] mb-2.5">
                                    Tous vos formats d&apos;événements
                                </h3>
                                <ul className="space-y-2.5 text-sm text-neutral-700 font-light leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Mariages &amp; noces :
                                            </strong>{" "}
                                            vin d&apos;honneur, buffets chauds ou de gala, BBQ
                                            noble et adaptation aux allergies.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Fêtes privées &amp; clubs :
                                            </strong>{" "}
                                            anniversaires, communions, baptêmes et soupers
                                            associatifs.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Corporate &amp; séminaires :
                                            </strong>{" "}
                                            walking dinners, réceptions pro et facturation HTVA
                                            claire.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E2D5]/80">
                                <h3 className="font-serif font-bold text-lg text-[#111111] mb-2.5">
                                    Équipe dédiée &amp; mise en place
                                </h3>
                                <ul className="space-y-2.5 text-sm text-neutral-700 font-light leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Tarif transparent :
                                            </strong>{" "}
                                            serveurs et maîtres d&apos;hôtel à{" "}
                                            <strong className="font-semibold text-[#996515]">
                                                18,00 €/h HTVA
                                            </strong>{" "}
                                            par personne.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Mise en place &amp; dressage :
                                            </strong>{" "}
                                            cuisson sur site, réassort continu des buffets et
                                            service à l&apos;assiette ou au plateau.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Débarrassage inclus :
                                            </strong>{" "}
                                            suivi discret du rythme de votre soirée (discours,
                                            animations) et remise en ordre.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* CTA unique du bloc */}
                        <div className="pt-2">
                            <Link
                                href="/contact?service=oui"
                                className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#111111] rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 shadow-xs"
                            >
                                <span>Demander un devis avec service en salle</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Séparateur doré satiné */}
            <div
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"
                aria-hidden="true"
            />

            {/* ============================================================== */}
            {/* BLOC 2 — BOISSONS & BAR BRASSEUR « ZÉRO GASPILLAGE » (CRÈME)   */}
            {/* ============================================================== */}
            <section
                id="brasseur"
                aria-labelledby="heading-brasseur"
                className="scroll-mt-28 bg-[#FAF8F5] py-20 md:py-28 px-6 relative overflow-hidden"
            >
                <span id="pole-bar-boissons" className="scroll-mt-28" aria-hidden="true" />
                {/* Légère lueur champagne en arrière-plan */}
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,_rgba(212,175,55,0.08)_0%,_transparent_65%)]"
                    aria-hidden="true"
                />

                <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Contenu éditorial à gauche sur desktop (alternance visuelle) */}
                    <div className="lg:col-span-7 order-2 lg:order-1 space-y-7">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515]">
                                    Pilier 02 • Formule Brasserie Clé en Main
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FAF6EB] text-[#996515] px-3 py-0.5 rounded-full border border-[#D4AF37]/40">
                                    Facturation au réel
                                </span>
                            </div>
                            <h2
                                id="heading-brasseur"
                                className="text-3xl sm:text-4xl font-serif text-[#111111] leading-snug mb-4"
                            >
                                Service Boissons &amp; Bar Brasseur « Zéro Gaspillage »
                            </h2>
                            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                                Oubliez les allers-retours au supermarché, le manque de place
                                au frais et les casiers restants le lendemain : nous livrons
                                votre bar complet et ne facturons strictement que ce qui a été
                                ouvert.
                            </p>
                        </div>

                        {/* Liste structurée à puces dorées dans un encadré blanc lumineux */}
                        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D5] shadow-2xs">
                            <ul className="space-y-4 text-sm sm:text-base text-neutral-700 font-light leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                    <span>
                                        <strong className="font-semibold text-[#111111]">
                                            Frigo vitré professionnel mis à disposition :
                                        </strong>{" "}
                                        livré et installé directement sur votre lieu de
                                        réception pour garantir des boissons servies à
                                        température idéale.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                    <span>
                                        <strong className="font-semibold text-[#111111]">
                                            Sélection complète calibrée avec marge :
                                        </strong>{" "}
                                        bières belges et spéciales, fûts au tirage, vins
                                        sélectionnés, bulles, softs et eaux plates ou
                                        pétillantes.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                    <span>
                                        <strong className="font-semibold text-[#111111]">
                                            Reprise intégrale des invendus &amp; vidanges :
                                        </strong>{" "}
                                        toutes les bouteilles et tous les fûts non entamés sont
                                        repris sans frais après la fête, avec évacuation
                                        complète des vidanges.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                    <span>
                                        <strong className="font-semibold text-[#111111]">
                                            Facturation au réel &amp; option barmans :
                                        </strong>{" "}
                                        décompte transparent après l&apos;événement, avec
                                        possibilité d&apos;ajouter nos barmans et serveurs à{" "}
                                        <strong className="font-semibold text-[#996515]">
                                            18,00 €/h HTVA
                                        </strong>
                                        .
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA unique du bloc */}
                        <div className="pt-2">
                            <Link
                                href="/contact?boissons=oui"
                                className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#111111] rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 shadow-xs"
                            >
                                <span>Inclure l&apos;option Bar Brasseur au devis</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Visuel bar événementiel à droite sur desktop */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#E8E2D5] aspect-[4/3] lg:aspect-[4/4.6] bg-neutral-100">
                            <Image
                                src="/images/logistique-service-brasseur.jpg"
                                alt="Service boissons et bar brasseur zéro gaspillage avec frigo vitré professionnel - Traiteur Compère"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Séparateur doré satiné */}
            <div
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"
                aria-hidden="true"
            />

            {/* ============================================================== */}
            {/* BLOC 3 — LOCATION DE MATÉRIEL & MOBILIER (FOND BLANC)          */}
            {/* ============================================================== */}
            <section
                id="materiel"
                aria-labelledby="heading-materiel"
                className="scroll-mt-28 bg-white py-20 md:py-28 px-6 relative"
            >
                <span
                    id="pole-logistique-confort"
                    className="scroll-mt-28"
                    aria-hidden="true"
                />

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Visuel arts de la table & réception */}
                    <div className="lg:col-span-5">
                        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#E8E2D5] aspect-[4/3] lg:aspect-[4/4.6] bg-neutral-100">
                            <Image
                                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop"
                                alt="Location de vaisselle, verrerie, mange-debout, tables et mobilier de réception en province de Liège"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                        </div>
                    </div>

                    {/* Contenu éditorial structuré */}
                    <div className="lg:col-span-7 space-y-7">
                        <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                                Pilier 03 • Arts de la Table &amp; Logistique
                            </span>
                            <h2
                                id="heading-materiel"
                                className="text-3xl sm:text-4xl font-serif text-[#111111] leading-snug mb-4"
                            >
                                Location de Matériel &amp; Mobilier
                            </h2>
                            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                                Transformez une salle communale, un chapiteau ou votre domicile
                                en véritable lieu de réception sans aucune corvée de vaisselle
                                ni de manutention le lendemain.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E2D5]/80">
                                <h3 className="font-serif font-bold text-lg text-[#111111] mb-2.5">
                                    Vaisselle, verrerie &amp; maintien au chaud
                                </h3>
                                <ul className="space-y-2.5 text-sm text-neutral-700 font-light leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Vaisselle complète :
                                            </strong>{" "}
                                            assiettes, couverts inox et serviettes à{" "}
                                            <strong className="font-semibold text-[#996515]">
                                                1,50 €/pers. HTVA
                                            </strong>{" "}
                                            (lavage inclus).
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Verrerie assortie :
                                            </strong>{" "}
                                            verres à vin, softs et flûtes à champagne (
                                            <strong className="font-semibold text-[#996515]">
                                                1,50 € / lot de 5
                                            </strong>
                                            , lavage inclus).
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Matériel thermique :
                                            </strong>{" "}
                                            chafing dishes, bains-marie, grils et plats de
                                            présentation fournis.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E2D5]/80">
                                <h3 className="font-serif font-bold text-lg text-[#111111] mb-2.5">
                                    Mobilier, nappage &amp; livraison
                                </h3>
                                <ul className="space-y-2.5 text-sm text-neutral-700 font-light leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Mobilier de réception :
                                            </strong>{" "}
                                            location de mange-debout, tables et chaises adaptés
                                            à la configuration de votre lieu.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Nappage soigné :
                                            </strong>{" "}
                                            habillage élégant des tables et mange-debout pour
                                            une salle harmonieuse.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                                        <span>
                                            <strong className="font-semibold text-[#111111]">
                                                Livraison &amp; reprise :
                                            </strong>{" "}
                                            transport frigorifique dans toute la région
                                            liégeoise ou retrait gratuit à Saint-Georges.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* CTA unique du bloc */}
                        <div className="pt-2">
                            <Link
                                href="/contact?materiel=oui"
                                className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#111111] rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 shadow-xs"
                            >
                                <span>Ajouter le matériel &amp; mobilier à mon devis</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Séparateur doré satiné */}
            <div
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"
                aria-hidden="true"
            />

            {/* ============================================================== */}
            {/* 4. COMMENT ÇA FONCTIONNE (3 ÉTAPES VISUELLES SUR FOND CRÈME)   */}
            {/* ============================================================== */}
            <section
                aria-labelledby="heading-fonctionnement"
                className="bg-[#FAF8F5] py-20 md:py-24 px-6"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#996515] font-bold mb-2">
                            Comment ça fonctionne
                        </p>
                        <h2
                            id="heading-fonctionnement"
                            className="text-3xl sm:text-4xl font-serif text-[#111111]"
                        >
                            Une organisation simple en 3 étapes
                        </h2>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Ligne horizontale reliant les étapes sur desktop */}
                        <div
                            className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[1px] bg-[#D4AF37]/40 z-0"
                            aria-hidden="true"
                        />

                        {HOW_IT_WORKS_STEPS.map((item) => (
                            <div
                                key={item.step}
                                className="relative z-10 bg-white rounded-2xl p-7 border border-[#E8E2D5] shadow-2xs flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-[#FAF6EB] border border-[#D4AF37]/60 text-[#996515] font-serif font-bold text-lg flex items-center justify-center mb-5">
                                    {item.step}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[#111111] mb-2.5">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 5. FAQ CONCISE & CTA FINAL UNIQUE                              */}
            {/* ============================================================== */}
            <section
                id="faq"
                aria-labelledby="heading-faq"
                className="scroll-mt-28 bg-white py-20 md:py-24 px-6 border-t border-[#E8E2D5]/70"
            >
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#996515] font-bold mb-2">
                            Questions fréquentes
                        </p>
                        <h2
                            id="heading-faq"
                            className="text-3xl sm:text-4xl font-serif text-[#111111]"
                        >
                            Tout savoir sur nos prestations
                        </h2>
                    </div>

                    <div className="space-y-3 mb-20">
                        {SERVICES_FAQ.map((item, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5] overflow-hidden transition-colors hover:border-[#D4AF37]/60"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaqIndex(isOpen ? null : idx)
                                        }
                                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="font-serif font-bold text-base sm:text-lg text-[#111111]">
                                            {item.question}
                                        </span>
                                        <span
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                                isOpen
                                                    ? "bg-[#1A1A1A] text-[#D4AF37] rotate-180"
                                                    : "bg-white text-neutral-600 border border-[#E8E2D5]"
                                            }`}
                                        >
                                            <ChevronDown size={16} />
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${
                                            isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-6 pb-5 pt-2 text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-t border-[#E8E2D5]/60">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bloc de contact final unique */}
                    <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 border border-[#D4AF37]/35 text-center space-y-6">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#996515] font-bold">
                            Liège • Saint-Georges-sur-Meuse • Huy • Waremme • Grâce-Hollogne
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] leading-tight">
                            Prêt à organiser votre réception ?
                        </h2>
                        <p className="text-neutral-600 font-light text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                            Décrivez-nous votre événement, le nombre de convives et les
                            options souhaitées : nous vous envoyons une proposition
                            détaillée sous 24h, ou découvrez d&apos;abord{" "}
                            <Link
                                href="/formules"
                                className="text-[#996515] font-medium underline decoration-[#D4AF37]/60 underline-offset-4 hover:text-[#111111]"
                            >
                                nos menus et buffets
                            </Link>
                            .
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#111111] rounded-full px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-300 shadow-sm"
                            >
                                <span>Demander mon devis personnalisé</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
