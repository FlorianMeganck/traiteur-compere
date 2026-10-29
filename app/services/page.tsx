"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
    Utensils,
    Building2,
    HeartHandshake,
    PartyPopper,
    Wine,
    Check
} from "lucide-react";

// --- DONNÉES STRUCTURÉES SCHEMA.ORG (CateringService + Service + FAQPage) ---
const servicesSchemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": ["Service", "FoodEstablishment", "CateringService"],
            "@id": "https://www.traiteur-compere.be/services#catering-service",
            "name": "Traiteur Compère — Services Événementiels, Mariages & Formule Brasseur",
            "serviceType": [
                "Traiteur mariage Liège",
                "Traiteur événementiel entreprise Wallonie",
                "Location matériel & bar brasseur Huy-Waremme",
                "Organisation de banquets et réceptions privées"
            ],
            "provider": {
                "@type": "LocalBusiness",
                "@id": "https://www.traiteur-compere.be/#caterer",
                "name": "Traiteur Compère (Maison Compère SRL)",
                "telephone": "+32 468 38 50 82",
                "email": "contact@traiteur-compere.be",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Rue Potay 3",
                    "addressLocality": "Saint-Georges-sur-Meuse",
                    "postalCode": "4470",
                    "addressRegion": "Liège",
                    "addressCountry": "BE"
                }
            },
            "areaServed": [
                { "@type": "City", "name": "Liège" },
                { "@type": "City", "name": "Saint-Georges-sur-Meuse" },
                { "@type": "City", "name": "Huy" },
                { "@type": "City", "name": "Waremme" },
                { "@type": "City", "name": "Amay" },
                { "@type": "City", "name": "Verlaine" },
                { "@type": "City", "name": "Flémalle" },
                { "@type": "City", "name": "Hannut" },
                { "@type": "City", "name": "Seraing" },
                { "@type": "AdministrativeArea", "name": "Province de Liège" },
                { "@type": "AdministrativeArea", "name": "Wallonie" }
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Prestations Traiteur & Service Brasseur Clé en Main",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Buffets Chauds, Buffets Froids & Barbecues sur-mesure",
                            "description": "Buffets artisanaux chauds (2 à 5 services), buffets froids de terroir ou de gala et barbecues au feu de bois."
                        },
                        "url": "https://www.traiteur-compere.be/formules"
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Organisation de Banquets, Mariages & Réceptions d'Entreprise",
                            "description": "Accompagnement personnalisé pour mariages en province de Liège, cocktails dînatoires corporate en Wallonie et fêtes de famille."
                        },
                        "url": "https://www.traiteur-compere.be/services#mariages"
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Service Bar & Brasseur Zéro Gaspillage (Frigo vitré & Reprise des invendus)",
                            "description": "Mise à disposition du frigo vitré professionnel, fourniture complète des boissons avec reprise intégrale des invendus non entamés."
                        },
                        "url": "https://www.traiteur-compere.be/services#boissons"
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Personnel de Salle, Barman & Location de Vaisselle / Verrerie",
                            "description": "Équipe de service professionnelle en salle et au bar (18,00 €/h HTVA) et location de vaisselle et verrerie assortie."
                        },
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": "18.00",
                            "priceCurrency": "EUR",
                            "unitText": "par heure HTVA par serveur/barman"
                        },
                        "url": "https://www.traiteur-compere.be/contact?boissons=oui"
                    }
                ]
            }
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.traiteur-compere.be/services#faq-schema",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Comment fonctionne la formule Brasseur « Zéro Gaspillage » et la reprise des invendus ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Nous livrons sur votre lieu de réception un frigo vitré professionnel ainsi qu'un stock complet de boissons (bières, vins, bulles, eaux et softs). À la fin de votre événement, nous reprenons l'intégralité des bouteilles et fûts non entamés ainsi que les vidanges : vous ne payez que ce qui a réellement été consommé."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Fournissez-vous la vaisselle, la verrerie et le matériel de maintien au chaud ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Oui. Le matériel de service et de maintien au chaud est prévu avec nos formules chaudes. Vous pouvez également activer l'option location de vaisselle (1,50 €/pers. HTVA) et de verrerie (verres à vin, verres à soft, flûtes) directement dans votre devis."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Peut-on réserver le personnel en salle et au bar, ou opter pour la livraison seule ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Les deux options sont possibles. Vous pouvez choisir la livraison seule ou faire appel à notre brigade de serveurs et barmans au tarif de 18,00 € / heure HTVA par membre du personnel."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Dans quelles communes de Liège, Huy-Waremme et Wallonie intervenez-vous ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Basée à Saint-Georges-sur-Meuse, la Maison Compère intervient dans toute la province de Liège, l'axe Huy-Waremme (Amay, Verlaine, Villers-le-Bouillet, Hannut, Flémalle, Seraing) ainsi que partout en Wallonie."
                    }
                }
            ]
        }
    ]
};

// --- DONNÉES DU SÉLECTEUR LÉGER PAR ÉVÉNEMENT ---
type EventProfileKey = "mariage" | "entreprise" | "famille" | "association";

const EVENT_PROFILES: Record<
    EventProfileKey,
    {
        tabLabel: string;
        title: string;
        cuisineText: string;
        barLogisticsText: string;
        primaryLabel: string;
        primaryHref: string;
        secondaryLabel: string;
        secondaryHref: string;
    }
> = {
    mariage: {
        tabLabel: "Mariage",
        title: "Une réception de mariage clé en main, du vin d'honneur à la soirée",
        cuisineText: "Zakouskis & verrines à l'apéritif, suivis d'un buffet chaud (2 à 5 services), d'un buffet de Gala ou d'un barbecue viandes nobles.",
        barLogisticsText: "Frigo vitré pro installé sur place, gestion complète des bulles, vins, bières et softs (reprise des invendus), vaisselle et brigade en salle.",
        primaryLabel: "Voir les Buffets Chauds",
        primaryHref: "/formules#buffets-chauds",
        secondaryLabel: "Devis Mariage sur-mesure",
        secondaryHref: "/contact?type=mariage"
    },
    entreprise: {
        tabLabel: "Entreprise",
        title: "Séminaires, cocktails dînatoires et réceptions professionnelles",
        cuisineText: "Petits pains garnis et wraps pour vos réunions, zakouskis et verrines pour vos walking dinners, ou salad bar et barbecue corporate.",
        barLogisticsText: "Livraison ponctuelle sur site en Wallonie, boissons fraîches en frigo vitré avec service au bar si souhaité, et facturation HTVA claire.",
        primaryLabel: "Voir les Apéritifs & Verrines",
        primaryHref: "/formules#aperitifs",
        secondaryLabel: "Demander un devis Pro",
        secondaryHref: "/contact?type=entreprise"
    },
    famille: {
        tabLabel: "Fête de famille",
        title: "Anniversaires, baptêmes, communions et repas entre amis",
        cuisineText: "Barbecues conviviaux au feu de bois, cochon de lait, porchetta ou buffets froids généreux dès 14 € / pers. HTVA.",
        barLogisticsText: "À domicile ou en salle : choisissez la simple mise en place ou ajoutez la vaisselle, le frigo brasseur et un serveur dédié.",
        primaryLabel: "Voir les Barbecues & Buffets",
        primaryHref: "/formules#bbq",
        secondaryLabel: "Devis Fête privée",
        secondaryHref: "/contact?type=fete-privee"
    },
    association: {
        tabLabel: "Association & Club",
        title: "Soupers d'école, clubs sportifs et grands rassemblements",
        cuisineText: "Plats mijotés faits maison (boulets liégeoise, lasagnes, carbonnade, vol-au-vent...) et salad bar dès 8 € / pers. HTVA.",
        barLogisticsText: "Livraison chaude ou froide prête à servir par vos bénévoles, sans personnel ni vaisselle pour optimiser votre budget.",
        primaryLabel: "Voir les Plats Collectivités",
        primaryHref: "/formules#collectivites",
        secondaryLabel: "Configurer un repas associatif",
        secondaryHref: "/contact?menu=collectivite"
    }
};

// --- DONNÉES TIMELINE LOGISTIQUE 4 ÉTAPES ---
const LOGISTICS_STEPS = [
    {
        step: "01",
        title: "Menu & Boissons",
        desc: "Choix de votre formule culinaire et calibrage des boissons sur-mesure. Devis clair sous 24h."
    },
    {
        step: "02",
        title: "Livraison & Frigos",
        desc: "Installation anticipée du frigo vitré pro, des boissons et de la vaisselle sur votre lieu de réception."
    },
    {
        step: "03",
        title: "Prestation le Jour J",
        desc: "Dressage des buffets, cuissons minute et, si souhaité, service en salle et au bar (18 €/h HTVA)."
    },
    {
        step: "04",
        title: "Reprise sans tracas",
        desc: "Reprise du matériel, des vidanges et des bouteilles non entamées. Facturation au réel consommé."
    }
];

// --- DONNÉES FAQ PRESTATIONS ---
const SERVICES_FAQ = [
    {
        question: "Comment fonctionne la Formule Brasseur « Zéro Gaspillage » ?",
        answer: "Nous installons un frigo vitré professionnel sur le lieu de votre réception avec un stock complet (bières, vins, bulles, softs et eaux) calibré largement pour vos invités. En fin d'événement, nous reprenons toutes les bouteilles et fûts non entamés ainsi que les vidanges : seules les boissons ouvertes sont facturées."
    },
    {
        question: "Fournissez-vous la vaisselle, les verres et le matériel de service ?",
        answer: "Oui. Le matériel de présentation des buffets et de maintien au chaud est prévu avec nos formules chaudes. Vous pouvez ajouter en 1 clic dans votre devis la location de vaisselle (1,50 €/pers. HTVA) et de verrerie (verres à vin, softs, flûtes)."
    },
    {
        question: "Peut-on réserver uniquement le repas, avec ou sans personnel en salle ?",
        answer: "Tout est modulable. Vous pouvez opter pour la livraison seule (idéale pour les associations ou repas en famille) ou réserver nos serveurs et barmans au tarif de 18,00 € / heure HTVA par personne."
    },
    {
        question: "Dans quelles villes et régions vous déplacez-vous ?",
        answer: "Depuis notre atelier de Saint-Georges-sur-Meuse (Rue Potay 3), nous intervenons dans toute la province de Liège, sur l'axe Huy-Waremme (Amay, Verlaine, Hannut, Flémalle, Seraing) et partout en Wallonie."
    },
    {
        question: "Comment gérez-vous les allergies et régimes spécifiques ?",
        answer: "Nous adaptons nos menus (options végétariennes, sans gluten, sans lactose...) sur simple mention lors de votre demande de devis, et notre matrice des 14 allergènes est consultable en ligne."
    }
];

// --- MAIN COMPONENT ---
export default function Services() {
    const [activeProfile, setActiveProfile] = useState<EventProfileKey>("mariage");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const currentProfile = EVENT_PROFILES[activeProfile];

    return (
        <main className="bg-white text-gray-900 font-sans selection:bg-[#D4AF37] selection:text-white pt-40 md:pt-48 pb-20 overflow-hidden relative">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchemaJsonLd) }}
            />

            {/* 1. INTRO & TITLE (Épuré) */}
            <section className="px-6 mb-14 max-w-7xl mx-auto text-center relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-serif text-black uppercase tracking-widest mb-6"
                >
                    NOS SERVICES
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="text-gray-600 font-sans font-light text-lg max-w-2xl mx-auto mb-10 italic"
                >
                    &ldquo;De la célébration intime au grand banquet, nous créons l&apos;ambiance gourmande qui vous ressemble — de la cuisine jusqu&apos;au service bar.&rdquo;
                </motion.p>

                {/* VISUAL SUMMARY */}
                <VisualSummary />
            </section>

            {/* 2. SÉLECTEUR COMPACT PAR ÉVÉNEMENT */}
            <section className="px-6 mb-16 max-w-5xl mx-auto relative z-10">
                <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E8E2D5]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D5]">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#996515] font-bold">
                                Aperçu rapide
                            </p>
                            <h2 className="text-xl sm:text-2xl font-serif text-black mt-0.5">
                                Que préparez-vous ?
                            </h2>
                        </div>

                        {/* 4 PILLS */}
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(EVENT_PROFILES) as EventProfileKey[]).map((key) => {
                                const isActive = activeProfile === key;
                                const Icon =
                                    key === "mariage"
                                        ? HeartHandshake
                                        : key === "entreprise"
                                            ? Building2
                                            : key === "famille"
                                                ? PartyPopper
                                                : Utensils;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveProfile(key)}
                                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isActive
                                                ? "bg-black text-[#D4AF37] shadow-sm"
                                                : "bg-white text-neutral-600 border border-[#E8E2D5] hover:border-[#D4AF37] hover:text-black"
                                            }`}
                                    >
                                        <Icon size={14} />
                                        <span>{EVENT_PROFILES[key].tabLabel}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeProfile}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                        >
                            <div className="md:col-span-8 space-y-3">
                                <h3 className="font-serif text-xl text-black">
                                    {currentProfile.title}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-600 font-light">
                                    <p className="flex items-start gap-2">
                                        <Check size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                                        <span><strong className="font-medium text-neutral-900">Côté cuisine :</strong> {currentProfile.cuisineText}</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <Wine size={16} className="text-[#996515] shrink-0 mt-0.5" />
                                        <span><strong className="font-medium text-neutral-900">Côté bar &amp; logistique :</strong> {currentProfile.barLogisticsText}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-4 flex flex-col gap-2.5">
                                <Link
                                    href={currentProfile.primaryHref}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black hover:bg-[#D4AF37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    <span>{currentProfile.primaryLabel}</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <Link
                                    href={currentProfile.secondaryHref}
                                    className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-[#E8E2D5] text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    {currentProfile.secondaryLabel}
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* 3. CONTAINER FOR SERVICES & GOLDEN THREAD */}
            <div className="relative w-full max-w-7xl mx-auto">
                {/* THE GOLDEN THREAD (SVG) */}
                <ServiceThread />

                {/* MARIAGES (Texte Gauche / Mosaïque Droite) */}
                <div id="mariages" className="scroll-mt-24 relative z-10">
                    <SectionService
                        title="VOTRE MARIAGE"
                        desc="Le repas est au cœur de cette journée spéciale. Nous prenons le temps de vous rencontrer pour construire un menu qui vous ressemble — vin d'honneur, buffet chaud ou froid et service bar — en respectant votre budget et vos goûts. Pas de stress, on gère."
                        ctaLabel="En discuter ensemble"
                        ctaLink="/contact?type=mariage"
                        secondaryLabel="Voir nos buffets chauds"
                        secondaryLink="/formules#buffets-chauds"
                        images={[
                            "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1000&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1000&auto=format&fit=crop"
                        ]}
                        decorType="flower"
                        reverse={false}
                    />
                </div>

                {/* ENTREPRISES (Mosaïque Gauche / Texte Droite) */}
                <div id="entreprises" className="scroll-mt-24 relative z-10">
                    <SectionService
                        title="VOS ÉVÉNEMENTS PRO"
                        desc="Du sandwich garni pour une réunion rapide au cocktail dînatoire pour vos vœux d'entreprise en Wallonie. Nous savons que votre image est en jeu, c'est pourquoi nous garantissons un service fluide, ponctuel et une qualité constante."
                        ctaLabel="Demander un devis Pro"
                        ctaLink="/contact?type=entreprise"
                        secondaryLabel="Voir nos apéritifs & verrines"
                        secondaryLink="/formules#aperitifs"
                        images={[
                            "/images/event_pro1.jpeg",
                            "/images/event_pro2.jpeg",
                            "/images/event_pro3.jpeg",
                            "/images/event_pro4.jpg"
                        ]}
                        decorType="geometric"
                        reverse={true}
                    />
                </div>

                {/* PARTICULIERS (Texte Gauche / Mosaïque Droite) */}
                <div id="particuliers" className="scroll-mt-24 relative z-10">
                    <SectionService
                        title="VOS FÊTES DE FAMILLE"
                        desc="Un anniversaire, un baptême ou simplement un repas entre amis ? Nous nous occupons de tout pour que vous puissiez profiter de vos invités. Barbecue au feu de bois, buffet froid ou service à table : on s'adapte à l'ambiance que vous voulez donner."
                        ctaLabel="Découvrir nos Barbecues & Buffets"
                        ctaLink="/formules#bbq"
                        secondaryLabel="Voir nos buffets froids"
                        secondaryLink="/formules#buffets-froids"
                        images={[
                            "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=1000&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1000&auto=format&fit=crop"
                        ]}
                        decorType="herb"
                        reverse={false}
                    />
                </div>

                {/* 4. FORMULE BRASSERIE & BOISSONS (Intégrée avec sobriété) */}
                <section id="boissons" className="scroll-mt-24 relative z-10 pt-12 pb-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-[#FAF8F5] text-neutral-800 rounded-3xl p-8 md:p-14 border border-[#E8E2D5] relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EB] border border-[#D4AF37]/30 text-[#996515] text-xs uppercase tracking-widest font-bold">
                                        <span>🍺</span> La Formule Clé en Main • Cuisine &amp; Brasseur
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] tracking-wide">
                                        Service Bar &amp; Boissons (Formule Brasserie)
                                    </h2>
                                    <p className="text-[#4A4A4A] font-light text-base md:text-lg leading-relaxed">
                                        En complément naturel de notre cuisine, nous gérons vos boissons de A à Z à Liège, Huy et Waremme : matériel pro installé sur place, stock complet et reprise des invendus.
                                    </p>

                                    <div className="space-y-3.5 pt-1">
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#EAE6DF]">
                                            <div className="w-10 h-10 rounded-full bg-[#FAF6EB] text-[#B8860B] flex items-center justify-center shrink-0 text-lg">
                                                ❄️
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1A1A1A] text-sm mb-0.5">Frigo vitré professionnel fourni</h3>
                                                <p className="text-sm text-neutral-500 leading-relaxed">
                                                    Mis à disposition directement sur votre lieu de réception pour garantir des boissons fraîches dès le premier verre.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#EAE6DF]">
                                            <div className="w-10 h-10 rounded-full bg-[#FAF6EB] text-[#B8860B] flex items-center justify-center shrink-0 text-lg">
                                                🔄
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1A1A1A] text-sm mb-0.5">Zéro gaspillage : consommation au réel</h3>
                                                <p className="text-sm text-neutral-500 leading-relaxed">
                                                    Fûts, bières, vins, bulles, softs et eaux. Reprise intégrale des bouteilles non entamées et des vidanges en fin de fête.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#EAE6DF]">
                                            <div className="w-10 h-10 rounded-full bg-[#FAF6EB] text-[#B8860B] flex items-center justify-center shrink-0 text-lg">
                                                🤵
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1A1A1A] text-sm mb-0.5">Service au bar &amp; en salle si souhaité</h3>
                                                <p className="text-sm text-neutral-500 leading-relaxed">
                                                    Barman ou serveur dédié tout au long de la réception : <strong className="text-[#996515]">18,00 € / h HTVA</strong> (location de verrerie également disponible).
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <Link
                                            href="/contact?boissons=oui"
                                            className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-[#D4AF37] hover:bg-[#1A1A1A] hover:text-white text-black font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-sm"
                                        >
                                            Devis avec Formule Brasseur →
                                        </Link>
                                        <Link
                                            href="/formules"
                                            className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-[#EAE6DF] font-bold uppercase tracking-widest text-xs transition-all duration-300"
                                        >
                                            Choisir un menu repas
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md ring-1 ring-[#E8E2D5]">
                                    <Image
                                        src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop"
                                        alt="Service Bar & Boissons Traiteur Compère à Liège"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 40vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                                        <div className="text-white">
                                            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Zéro Gaspillage</p>
                                            <p className="text-sm font-light text-neutral-200">Seules les bouteilles entamées sont facturées</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. LIVRAISON SEULE & ASSOCIATIONS (Mosaïque Gauche / Texte Droite) */}
                <section id="livraison" className="scroll-mt-24 relative z-10 pt-8">
                    <SectionService
                        title="Livraison Seule & Associations"
                        desc="Idéal pour vos soupers d'école, clubs sportifs ou fêtes de quartier. Nous livrons des plats généreux et conviviaux, prêts à être servis par vos soins. Une solution économique et pratique sans personnel ni vaisselle, qui ne sacrifie rien à la qualité."
                        ctaLabel="Voir nos Plats Uniques & Salad Bar"
                        ctaLink="/formules#collectivites"
                        secondaryLabel="Devis repas associatif"
                        secondaryLink="/contact?menu=collectivite"
                        images={[
                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop"
                        ]}
                        decorType="geometric"
                        reverse={true}
                    />
                </section>
            </div>

            {/* 6. LA LOGISTIQUE SIMPLIFIÉE (4 étapes lisibles d'un coup d'œil) */}
            <section id="logistique" className="scroll-mt-24 px-6 my-24 max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#996515] font-bold mb-2">
                        Organisation sereine
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-black">
                        La logistique simplifiée en 4 étapes
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LOGISTICS_STEPS.map((item) => (
                        <div
                            key={item.step}
                            className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E2D5] flex flex-col justify-between"
                        >
                            <div>
                                <span className="inline-block font-serif text-2xl font-bold text-[#D4AF37] mb-3">
                                    {item.step}.
                                </span>
                                <h3 className="font-serif text-lg font-bold text-black mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. NOS VALEURS (Style épuré d'origine) */}
            <section className="px-6 my-24 max-w-7xl mx-auto text-center relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-center max-w-6xl mx-auto">
                    <ValueItem
                        title="Fait Maison & Local"
                        path="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        desc="Pas de secret : pour que ce soit bon, il faut de bons produits. Nous privilégions les producteurs de la région et la cuisine faite minute."
                        delay={0.1}
                    />
                    <ValueItem
                        title="Sur Mesure & Écoute"
                        path="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21 1.01.33 2.05.33 3.1 0 5.5-4.5 10-10 10z"
                        desc="Un régime spécial ? Une envie particulière ? Nous ne vous imposons rien. Nous construisons le menu et la carte des boissons avec vous."
                        delay={0.2}
                    />
                    <ValueItem
                        title="Transparence Totale"
                        path="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                        desc="Pas de mauvaise surprise sur la facture. Nos devis sont clairs, détaillés et respectés. Seules les boissons entamées sont facturées."
                        delay={0.3}
                    />
                </div>
            </section>

            {/* 8. FAQ DÉDIÉE EN BAS DE PAGE */}
            <section id="faq" className="scroll-mt-24 max-w-4xl mx-auto px-6 my-24 relative z-10">
                <div className="text-center mb-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#996515] font-bold mb-2">
                        Questions fréquentes
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-black">
                        Vos questions sur nos prestations
                    </h2>
                </div>

                <div className="space-y-3">
                    {SERVICES_FAQ.map((item, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5] overflow-hidden transition-colors hover:border-[#D4AF37]/60"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-serif font-bold text-base sm:text-lg text-black">
                                        {item.question}
                                    </span>
                                    <span
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen
                                                ? "bg-black text-[#D4AF37] rotate-180"
                                                : "bg-white text-neutral-600 border border-[#E8E2D5]"
                                            }`}
                                    >
                                        <ChevronDown size={17} />
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 9. Call to Action Footer (Parallax) */}
            <ParallaxCta />
        </main>
    );
}

// --- VISUAL SUMMARY ---
function VisualSummary() {
    return (
        <nav className="flex flex-wrap md:flex-nowrap justify-center gap-6 md:gap-10 border-t border-b border-neutral-100 py-5 mt-8 bg-white/85 backdrop-blur-sm sticky top-20 z-40 transition-all duration-300 text-center">
            {[
                { label: "Mariages", href: "#mariages" },
                { label: "Entreprises", href: "#entreprises" },
                { label: "Particuliers", href: "#particuliers" },
                { label: "Bar & Boissons", href: "#boissons" },
                { label: "Livraison seule", href: "#livraison" },
                { label: "FAQ", href: "#faq" }
            ].map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="text-xs md:text-sm uppercase tracking-[0.2em] text-neutral-500 hover:text-[#D4AF37] transition-colors duration-300 relative group"
                >
                    {item.label}
                    <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </Link>
            ))}
        </nav>
    );
}

// --- THE GOLDEN THREAD COMPONENT ---
function ServiceThread() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block" aria-hidden="true">
            <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 300"
            >
                <motion.path
                    d="M 50 0 
                       C 50 20, 30 20, 30 50 
                       C 30 80, 50 80, 50 100
                       C 50 120, 70 120, 70 150
                       C 70 180, 50 180, 50 200
                       C 50 220, 30 220, 30 250
                       C 30 280, 50 280, 50 300"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                        <stop offset="10%" stopColor="#D4AF37" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                        <stop offset="90%" stopColor="#D4AF37" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// --- REUSABLE SECTION SERVICE (Épuré & Aéré) ---
function SectionService({
    title,
    desc,
    ctaLabel = "En savoir plus",
    ctaLink = "/contact",
    secondaryLabel,
    secondaryLink,
    images,
    decorType,
    reverse
}: {
    title: string;
    desc: string;
    ctaLabel?: string;
    ctaLink?: string;
    secondaryLabel?: string;
    secondaryLink?: string;
    images: string[];
    decorType: "flower" | "herb" | "geometric";
    reverse: boolean;
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

    const yBg = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const yDecor = useTransform(scrollYProgress, [0, 1], [0, -60]);

    const blobRadius = reverse
        ? "30% 70% 70% 30% / 30% 30% 70% 70%"
        : "70% 30% 30% 70% / 70% 70% 30% 30%";

    let DecorSVG = null;
    let decorClass = "";

    if (decorType === "flower") {
        decorClass = "w-48 md:w-64 -top-24 -right-16 md:-right-24 rotate-12 opacity-30 text-[#D4AF37]";
        DecorSVG = (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
                <path d="M50 50 C20 80 0 50 20 20 C40 0 60 0 80 20 C100 50 80 80 50 50 Z M50 50 Q30 30 50 10 M50 50 Q70 30 50 10 M50 50 Q30 70 50 90 M50 50 Q70 70 50 90" />
                <path d="M50 50 C35 60 25 40 35 30 C45 20 65 20 75 30 C85 40 75 60 50 50" />
                <path d="M50 90 Q50 100 55 100" strokeWidth="1" />
            </svg>
        );
    } else if (decorType === "herb") {
        decorClass = "w-40 md:w-56 -bottom-20 -left-12 md:-left-20 -rotate-12 opacity-30 text-gray-400";
        DecorSVG = (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                <path d="M50 100 Q50 50 80 10" />
                <path d="M50 80 Q30 70 20 60" />
                <path d="M55 70 Q75 60 85 50" />
                <path d="M60 50 Q40 40 30 30" />
                <path d="M65 30 Q85 20 90 10" />
            </svg>
        );
    } else {
        decorClass = "w-56 md:w-72 -top-20 -left-16 md:-left-24 opacity-20 text-[#D4AF37]";
        DecorSVG = (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
                <circle cx="50" cy="50" r="40" />
                <circle cx="50" cy="50" r="30" />
                <line x1="10" y1="50" x2="90" y2="50" />
                <line x1="50" y1="10" x2="50" y2="90" />
                <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" />
            </svg>
        );
    }

    return (
        <section ref={ref} className="relative py-24 md:py-28 w-full overflow-hidden">
            {/* A. TEXTURE LAYER (CSS Organic Blob) */}
            <motion.div
                style={{
                    y: yBg,
                    borderRadius: blobRadius
                }}
                className={`absolute top-0 bottom-0 bg-[#F9F7F1] w-[90%] md:w-[75%] -z-20 
                ${reverse ? "-left-20" : "-right-20"}
                ${reverse ? "origin-left" : "origin-right"}
                transition-all duration-700 ease-out`}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className={`flex flex-col md:flex-row items-center gap-16 md:gap-24 ${reverse ? "md:flex-row-reverse" : ""}`}>
                    {/* B. CONTENT EDITORIAL */}
                    <div className="w-full md:w-5/12 space-y-8 relative">
                        <motion.div
                            style={{ y: yDecor }}
                            className={`absolute pointer-events-none z-0 ${decorClass} hidden md:block`}
                        >
                            {DecorSVG}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-widest text-black relative inline-block">
                                {title}
                            </h2>

                            <div className="border-l border-[#D4AF37] pl-6 py-2 mt-8">
                                <p className="font-sans text-gray-700 text-lg font-medium">
                                    Une équipe dédiée à la réussite de votre événement, avec des produits frais, locaux et un savoir-faire authentique.
                                </p>
                            </div>

                            <p className="text-gray-600 font-sans font-light leading-relaxed text-lg mt-8 bg-white/60 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-2xl p-2 md:p-0">
                                {desc}
                            </p>

                            <div className="pt-8 flex flex-wrap items-center gap-6">
                                <Link href={ctaLink} className="group relative inline-flex items-center text-sm font-bold uppercase tracking-widest text-black pb-1">
                                    {ctaLabel}
                                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#D4AF37] w-full absolute bottom-0"></span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </Link>

                                {secondaryLabel && secondaryLink && (
                                    <Link
                                        href={secondaryLink}
                                        className="text-xs font-bold uppercase tracking-widest text-[#996515] hover:text-black transition-colors"
                                    >
                                        {secondaryLabel} →
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* C. MOSAIC GRID (2x2) */}
                    <div className="w-full md:w-7/12 relative">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            {images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                                    className={`relative aspect-[3/4] overflow-hidden shadow-2xl shadow-neutral-200 rounded-2xl
                                        ${idx === 1 ? "mt-8 md:mt-12" : ""} 
                                        ${idx === 2 ? "-mt-8 md:-mt-12" : ""}
                                    `}
                                >
                                    <Image
                                        src={img}
                                        alt={`${title} - Présentation ${idx + 1} - Traiteur Compère`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ParallaxCta({
    text = "Prêt à sublimer votre événement ?",
    subText = "Discutons de vos envies et créons ensemble un menu sur mesure.",
    link = "/contact",
    buttonText = "DEMANDER UN DEVIS",
    image = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
}: {
    text?: string;
    subText?: string;
    link?: string;
    buttonText?: string;
    image?: string;
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section ref={ref} className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mt-24">
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] -top-[20%] z-0">
                <Image
                    src={image}
                    alt="Ambiance réception et traiteur haut de gamme - Traiteur Compère"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>

            <div className="absolute inset-0 bg-black/60 z-10" />

            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                    {text}
                </h2>
                <p className="text-white/90 font-sans text-lg md:text-xl">
                    {subText}
                </p>
                <Link
                    href={link}
                    className="inline-block bg-white text-black px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                >
                    {buttonText}
                </Link>
            </div>
        </section>
    );
}

function ValueItem({ title, desc, path, delay }: { title: string; desc: string; path: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="flex flex-col items-center px-4"
        >
            <div className="w-12 h-12 mb-6 text-[#D4AF37]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d={path} />
                </svg>
            </div>
            <h3 className="font-serif text-xl text-black mb-4 uppercase tracking-widest">{title}</h3>
            <p className="text-lg text-neutral-700 leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}
