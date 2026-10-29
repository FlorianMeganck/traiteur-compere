"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Sparkles,
    Wine,
    ChefHat,
    Users,
    Truck,
    CheckCircle2,
    ArrowRight,
    Clock,
    ShieldCheck,
    HelpCircle,
    ChevronDown,
    Utensils,
    Building2,
    HeartHandshake,
    PartyPopper,
    MapPin,
    Phone,
    RefreshCw,
    ThermometerSnowflake,
    GlassWater
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
                            "description": "Buffets artisanaux chauds (2 à 5 services), buffets froids de terroir ou de gala et barbecues au feu de bois pour mariages, banquets et réceptions."
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
                            "description": "Mise à disposition du frigo vitré professionnel, fourniture complète des boissons (fûts, bières, vins, bulles, softs) avec reprise intégrale des invendus non entamés et gestion des vidanges."
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
                        "url": "https://www.traiteur-compere.be/contact?type=mariage-boissons"
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
                        "text": "Nous livrons sur votre lieu de réception un frigo vitré professionnel ainsi qu'un stock complet de boissons (bières, vins, bulles, eaux et softs) calibré selon votre nombre d'invités. À la fin de votre événement, nous reprenons l'intégralité des bouteilles et fûts non entamés ainsi que les vidanges : vous ne payez que ce qui a réellement été consommé."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Fournissez-vous la vaisselle, la verrerie et le matériel de maintien au chaud ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Oui. Le matériel de service et de maintien au chaud (bains-marie, chafing dishes, barbecues) est prévu avec nos formules chaudes. Vous pouvez également activer l'option location de vaisselle (1,50 €/pers. HTVA) et de verrerie (verres à vin, verres à soft, flûtes) directement dans votre devis, reprise sale incluse."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Peut-on réserver le personnel en salle et au bar, ou opter pour la livraison seule ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Les deux options sont possibles. Vous pouvez choisir la livraison seule (idéale pour les associations, clubs ou repas conviviaux) ou faire appel à notre brigade de serveurs et barmans au tarif transparent de 18,00 € / heure HTVA par membre du personnel."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Dans quelles communes de Liège, Huy-Waremme et Wallonie intervenez-vous ?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Basée à Saint-Georges-sur-Meuse, la Maison Compère intervient dans toute la province de Liège, l'axe Huy-Waremme (Amay, Verlaine, Villers-le-Bouillet, Hannut, Flémalle, Seraing) ainsi que partout en Wallonie pour vos mariages, événements d'entreprise et réceptions privées."
                    }
                }
            ]
        }
    ]
};

// --- DONNÉES DU SÉLECTEUR INTERACTIF PAR TYPOLOGIE D'ÉVÉNEMENT ---
type EventProfileKey = "mariage" | "entreprise" | "famille" | "association";

interface EventProfileData {
    key: EventProfileKey;
    tabLabel: string;
    badge: string;
    seoSubtitle: string;
    title: string;
    description: string;
    recommendedFormula: string;
    includedPoints: string[];
    brasseurHighlight: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    image: string;
    imageAlt: string;
}

const EVENT_PROFILES: Record<EventProfileKey, EventProfileData> = {
    mariage: {
        key: "mariage",
        tabLabel: "Mariage & Noces",
        badge: "Traiteur Mariage Liège & Wallonie",
        seoSubtitle: "Réception de mariage clé en main : du vin d'honneur à la soirée dansante",
        title: "Un mariage à votre image, sans aucune charge mentale",
        description:
            "Pour le plus beau jour de votre vie, nous orchestrons aussi bien l'assiette que le verre. Du cocktail apéritif aux zakouskis jusqu'au banquet chaud ou barbecue prestige, notre brigade veille sur chaque détail.",
        recommendedFormula: "Vin d'honneur (Zakouskis & Verrines) + Buffet Chaud 3 à 5 services ou BBQ Viandes Nobles + Formule Brasseur & Service en salle",
        includedPoints: [
            "Rencontre personnalisée et élaboration d'un menu sur-mesure selon votre budget",
            "Gestion complète du vin d'honneur, du repas et du buffet de desserts / mignardises",
            "Location de vaisselle, verrerie (flûtes, verres à vin, softs) et matériel thermique",
            "Brigade de salle et barmans dédiés (18,00 €/h HTVA) pour un service fluide"
        ],
        brasseurHighlight:
            "Inclus sur demande : Frigo vitré pro installé la veille ou le matin, gestion des bulles, vins & fûts, et reprise intégrale des bouteilles non entamées.",
        primaryCtaLabel: "Simuler mon devis Mariage & Bar",
        primaryCtaHref: "/contact?type=mariage-boissons&boissons=oui",
        secondaryCtaLabel: "Découvrir nos buffets & menus",
        secondaryCtaHref: "/formules",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
        imageAlt: "Réception de mariage élégante par Traiteur Compère en province de Liège"
    },
    entreprise: {
        key: "entreprise",
        tabLabel: "Événement d'Entreprise",
        badge: "Traiteur Événementiel Entreprise Wallonie",
        seoSubtitle: "Séminaires, inaugurations, vœux d'entreprise, walking dinners & repas corporate",
        title: "Valorisez votre image de marque avec une réception irréprochable",
        description:
            "Qu'il s'agisse d'un lunch de direction aux petits pains garnis, d'un cocktail dînatoire pour 200 collaborateurs ou d'une journée portes ouvertes, nous garantissons ponctualité, présentation soignée et facturation transparente.",
        recommendedFormula: "Cocktail Dînatoire (Zakouskis, Verrines 6cl/12cl, Pains Festifs) ou Salad Bar / BBQ + Bar Brasseur Clé en Main",
        includedPoints: [
            "Formats adaptés au rythme pro : walking dinner, buffet froid réception ou lunch rapide",
            "Installation autonome sur votre site d'entreprise ou salle de réception en Wallonie",
            "Prise en compte rigoureuse des régimes (végétarien, sans gluten, allergènes identifiés)",
            "Devis HTVA clair sous 24h et facturation au réel des boissons consommées"
        ],
        brasseurHighlight:
            "Zéro logistique interne : nous livrons les frigos vitrés, les softs, eaux, bières et vins, assurons le service au bar et reprenons toutes les vidanges.",
        primaryCtaLabel: "Demander un devis Pro & Boissons",
        primaryCtaHref: "/contact?type=entreprise-boissons&boissons=oui",
        secondaryCtaLabel: "Voir nos formules réceptions & apéritifs",
        secondaryCtaHref: "/formules",
        image: "/images/event_pro1.jpeg",
        imageAlt: "Service traiteur événementiel pour entreprises en Wallonie et à Liège"
    },
    famille: {
        key: "famille",
        tabLabel: "Fête Privée & Famille",
        badge: "Banquets, Anniversaires, Baptêmes & Communions",
        seoSubtitle: "À domicile ou en salle partout à Liège, Huy, Waremme et environs",
        title: "Profitez enfin de vos invités, la Maison Compère s'occupe du reste",
        description:
            "Anniversaire marquant, communion, baptême ou noces d'or : recevez vos proches en toute sérénité. Nous adaptons le niveau de prestation à vos envies, du buffet déposé prêt à déguster jusqu'au service complet avec barman.",
        recommendedFormula: "Buffet Froid (Campagnard à Gala) ou Cochon de lait / BBQ + Option Frigo Brasseur à la carte",
        includedPoints: [
            "Liberté totale : avec personnel de service à table/au buffet ou en installation simple",
            "Large choix de buffets froids, barbecues au feu de bois et menus chauds dès 14 €/pers.",
            "Option vaisselle et verrerie louées et reprises sans lavage de votre côté",
            "Conseils précis sur les quantités pour éviter tout gaspillage"
        ],
        brasseurHighlight:
            "Fini les allers-retours au supermarché et les casiers tièdes : notre frigo vitré pro garde vos boissons fraîches et nous reprenons tout le surplus.",
        primaryCtaLabel: "Configurer ma fête privée",
        primaryCtaHref: "/contact?type=fete-privee-boissons&boissons=oui",
        secondaryCtaLabel: "Comparer nos formules & tarifs",
        secondaryCtaHref: "/formules",
        image: "/images/Buffet-froid-reception.jpeg",
        imageAlt: "Buffet froid de réception pour fête de famille par Traiteur Compère"
    },
    association: {
        key: "association",
        tabLabel: "Associations & Livraison",
        badge: "Soupers d'École, Clubs Sportifs & Collectivités",
        seoSubtitle: "Solutions généreuses, économiques et prêtes à servir dès 8 € / pers.",
        title: "La qualité artisanale à budget maîtrisé pour vos grands rassemblements",
        description:
            "Vous organisez un souper de club sportif, une fête scolaire ou un repas associatif ? Nous livrons des plats mijotés savoureux (boulets à la liégeoise, lasagnes maison, carbonnade, vol-au-vent...) prêts à être servis par vos bénévoles.",
        recommendedFormula: "Plats Chauds Collectivités (dès 8 €/pers.) ou Salad Bar + Option Boissons Brasseur sur mesure",
        includedPoints: [
            "Tarifs étudiés pour permettre à votre association ou club de dégager une belle marge",
            "Conditionnement professionnel facilitant le réchauffage et le service rapide",
            "Livraison ponctuelle sur le lieu de votre événement ou retrait à notre atelier",
            "Possibilité de coupler avec notre fourniture de boissons et frigos en dépôt-vente"
        ],
        brasseurHighlight:
            "Idéal pour la buvette de votre événement : ne prenez aucun risque financier sur le stock de boissons grâce à la reprise intégrale des invendus non entamés.",
        primaryCtaLabel: "Devis Collectivité / Association",
        primaryCtaHref: "/contact?menu=collectivite",
        secondaryCtaLabel: "Voir la carte Collectivités & Salad Bar",
        secondaryCtaHref: "/formules",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
        imageAlt: "Repas traiteur pour associations et collectivités en région liégeoise"
    }
};

// --- DONNÉES TIMELINE LOGISTIQUE 4 ÉTAPES ---
const LOGISTICS_STEPS = [
    {
        step: "01",
        title: "Élaboration du menu & calibrage des boissons",
        subtitle: "Conseil personnalisé & Devis sous 24h",
        description:
            "Ensemble, nous définissons la formule culinaire (buffet, barbecue, cocktail ou banquet) et activons, si vous le souhaitez, l'option Brasseur. Nous calibrons le volume idéal de fûts, vins, bulles et softs selon le profil de vos convives.",
        highlights: ["Devis transparent et détaillé", "Adaptation aux allergies & régimes", "Zéro frais caché"]
    },
    {
        step: "02",
        title: "Livraison du matériel, vaisselle & frigos vitrés",
        subtitle: "Installation anticipée sur votre lieu de réception",
        description:
            "Nous acheminons sur place (salle, chapiteau, entreprise ou domicile à Liège, Huy, Waremme et en Wallonie) le frigo vitré professionnel, le stock de boissons, la verrerie et la vaisselle afin que tout soit parfaitement frais à l'arrivée de vos invités.",
        highlights: ["Frigo vitré professionnel fourni", "Mise au frais garantie", "Vaisselle & verrerie en option"]
    },
    {
        step: "03",
        title: "Prestation gourmande & Service le jour J",
        subtitle: "En cuisine, en salle et derrière le bar",
        description:
            "Nos chefs dressent vos buffets ou assurent les cuissons minute. Si vous avez opté pour le service, notre brigade de salle et nos barmans (18,00 €/h HTVA) accueillent et servent vos convives avec discrétion et sourire.",
        highlights: ["Produits frais faits maison", "Service fluide au bar & à table", "Ou formule livraison seule au choix"]
    },
    {
        step: "04",
        title: "Reprise sans tracas & Décompte au réel",
        subtitle: "Zéro gaspillage, zéro corvée de vidanges",
        description:
            "Après la fête, nous reprenons le frigo, le matériel, la vaisselle louée ainsi que toutes les bouteilles et fûts non entamés et les vidanges. Seules les boissons réellement ouvertes sont facturées.",
        highlights: ["Reprise intégrale des invendus", "Gestion complète des vidanges", "Facturation au réel consommé"]
    }
];

// --- DONNÉES FAQ PRESTATIONS ---
const SERVICES_FAQ = [
    {
        question: "Comment fonctionne concrètement la Formule Brasseur « Zéro Gaspillage » ?",
        answer: "C'est notre solution clé en main pour vous éviter l'achat, le transport et le refroidissement des boissons. Nous mettons à disposition un frigo vitré professionnel sur le lieu de votre événement avec une sélection complète (bières, vins, bulles, softs, eaux) prévue large pour ne jamais manquer. En fin de prestation, nous reprenons toutes les bouteilles et fûts non entamés ainsi que les vidanges : vous êtes facturé uniquement sur la consommation réelle."
    },
    {
        question: "Fournissez-vous la vaisselle, les verres et le matériel de service ?",
        answer: "Oui. Tout le matériel de présentation des buffets et de maintien au chaud est inclus dans nos prestations chaudes. En complément, vous pouvez cocher dans votre demande de devis la location de vaisselle (1,50 € / pers. HTVA) ainsi que la location de verrerie au choix (verres à vin, verres à soft, flûtes à champagne). Nous reprenons le tout après votre événement."
    },
    {
        question: "Comment est tarifé le personnel en salle et au bar ?",
        answer: "Vous gardez une maîtrise totale de votre budget : la mise à disposition d'un serveur en salle ou d'un barman dédié est facturée au tarif clair de 18,00 € / heure HTVA par personne. Vous pouvez également choisir nos formules en livraison seule si vous préférez gérer le service vous-même."
    },
    {
        question: "Dans quelles zones géographiques vous déplacez-vous ?",
        answer: "Notre atelier est situé Rue Potay 3 à Saint-Georges-sur-Meuse (4470). Nous assurons les livraisons et réceptions complètes dans toute la province de Liège, sur l'axe Huy-Waremme (Amay, Verlaine, Villers-le-Bouillet, Hannut, Flémalle, Seraing) et plus largement dans toute la Wallonie."
    },
    {
        question: "Pouvez-vous adapter les menus aux allergies ou régimes particuliers ?",
        answer: "Absolument. Qu'il s'agisse d'options végétariennes, sans porc, sans gluten ou sans lactose, nous adaptons nos compositions sur simple mention lors de votre demande de devis. De plus, notre matrice complète des 14 allergènes majeurs est consultable à tout moment en ligne."
    },
    {
        question: "Peut-on réserver uniquement le repas sans les boissons (ou inversement) ?",
        answer: "Bien sûr ! Nos prestations sont 100 % modulables. Vous pouvez commander uniquement votre buffet, barbecue ou repas associatif en livraison, ou combiner la cuisine artisanale et la Formule Brasseur pour profiter d'un interlocuteur unique du début à la fin."
    }
];

// --- MAIN COMPONENT ---
export default function Services() {
    const [activeProfile, setActiveProfile] = useState<EventProfileKey>("mariage");
    const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const currentProfile = EVENT_PROFILES[activeProfile];

    return (
        <main className="bg-[#FAF8F5] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white pt-40 md:pt-48 pb-20 overflow-hidden relative">
            {/* Injection des données structurées Schema.org */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchemaJsonLd) }}
            />

            {/* Halo doré supérieur subtil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* ============================================================== */}
            {/* 1. HERO ÉDITORIAL & PROPOSITION DE VALEUR CLÉ EN MAIN           */}
            {/* ============================================================== */}
            <section className="px-6 mb-12 max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6EB] border border-[#D4AF37]/40 text-[#996515] text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-6 shadow-2xs"
                >
                    <Sparkles size={13} className="text-[#D4AF37]" />
                    <span>Maison Compère • Traiteur &amp; Brasseur Événementiel</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#111111] tracking-tight mb-6 leading-[1.1]"
                >
                    Nos Services Traiteur &amp; Réceptions{" "}
                    <span className="italic font-normal text-[#996515]">Clé en Main</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-neutral-600 font-sans font-light text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
                >
                    De la célébration intime au grand banquet de mariage ou d&apos;entreprise : nous unissons{" "}
                    <strong className="font-medium text-neutral-900">cuisine artisanale faite maison</strong> et{" "}
                    <strong className="font-medium text-neutral-900">service bar brasseur zéro gaspillage</strong> à Liège, Huy, Waremme et dans toute la Wallonie.
                </motion.p>

                {/* Double CTA Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-xl mx-auto mb-10"
                >
                    <Link
                        href="/contact?type=mariage-boissons&boissons=oui"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-black font-serif font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <span>Demander un devis sur-mesure</span>
                        <ArrowRight size={15} />
                    </Link>
                    <Link
                        href="/formules"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FAF6EB] text-neutral-900 border border-[#D4AF37] font-serif font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-2xs hover:shadow-md text-center"
                    >
                        Explorer nos formules &amp; tarifs
                    </Link>
                </motion.div>

                {/* Bandeau de réassurance rapide */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left bg-white/90 border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF6EB] text-[#996515] flex items-center justify-center shrink-0">
                            <ChefHat size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-900">Cuisine 100% Maison</p>
                            <p className="text-[11px] text-neutral-500">Terroir local depuis 1821</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF6EB] text-[#996515] flex items-center justify-center shrink-0">
                            <ThermometerSnowflake size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-900">Frigo Vitré Fourni</p>
                            <p className="text-[11px] text-neutral-500">Boissons fraîches sur place</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF6EB] text-[#996515] flex items-center justify-center shrink-0">
                            <RefreshCw size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-900">Zéro Gaspillage</p>
                            <p className="text-[11px] text-neutral-500">Reprise des invendus</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF6EB] text-[#996515] flex items-center justify-center shrink-0">
                            <Users size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-900">Service à la Carte</p>
                            <p className="text-[11px] text-neutral-500">Salle &amp; bar à 18 €/h HTVA</p>
                        </div>
                    </div>
                </div>

                {/* VISUAL SUMMARY STICKY NAV */}
                <VisualSummary />
            </section>

            {/* ============================================================== */}
            {/* 2. SÉLECTEUR INTERACTIF PAR TYPOLOGIE D'ÉVÉNEMENT              */}
            {/* ============================================================== */}
            <section id="configurateur" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-24 relative z-10">
                <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E8E2D5] shadow-md">
                    <div className="text-center max-w-3xl mx-auto mb-8">
                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#996515] bg-[#FAF6EB] px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
                            Diagnostic rapide • Quel événement préparez-vous ?
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-serif text-[#111111] mt-3 mb-2">
                            Visualisez en 1 clic la formule adaptée à votre réception
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-500 font-light">
                            Sélectionnez votre type d&apos;événement pour découvrir notre accompagnement cuisine, matériel et service bar brasseur.
                        </p>
                    </div>

                    {/* Onglets de sélection */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
                        {(Object.keys(EVENT_PROFILES) as EventProfileKey[]).map((key) => {
                            const item = EVENT_PROFILES[key];
                            const isActive = activeProfile === key;
                            const IconComponent =
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
                                    className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                                        isActive
                                            ? "bg-[#111111] text-white border-[#111111] shadow-lg scale-[1.01]"
                                            : "bg-[#FAF8F5] text-neutral-700 border-[#E8E2D5] hover:border-[#D4AF37] hover:bg-white"
                                    }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            isActive
                                                ? "bg-[#D4AF37] text-black"
                                                : "bg-white text-[#996515] border border-[#E8E2D5]"
                                        }`}
                                    >
                                        <IconComponent size={19} />
                                    </div>
                                    <div>
                                        <p
                                            className={`text-xs sm:text-sm font-bold leading-tight ${
                                                isActive ? "text-white" : "text-neutral-900"
                                            }`}
                                        >
                                            {item.tabLabel}
                                        </p>
                                        <p
                                            className={`text-[11px] mt-0.5 ${
                                                isActive ? "text-[#D4AF37]" : "text-neutral-500"
                                            }`}
                                        >
                                            Voir ce qui est inclus →
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Contenu dynamique de la typologie sélectionnée */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProfile.key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#E8E2D5]"
                        >
                            {/* Colonne Texte & Inclus */}
                            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#996515] bg-[#FAF6EB] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                                            {currentProfile.badge}
                                        </span>
                                        <span className="text-xs text-neutral-500 italic">
                                            {currentProfile.seoSubtitle}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-serif text-[#111111] leading-snug">
                                        {currentProfile.title}
                                    </h3>

                                    <p className="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
                                        {currentProfile.description}
                                    </p>

                                    {/* Configuration recommandée */}
                                    <div className="bg-white p-4 rounded-xl border border-[#E8E2D5]">
                                        <p className="text-[11px] uppercase tracking-widest font-bold text-[#996515] mb-1">
                                            Configuration plébiscitée par nos clients :
                                        </p>
                                        <p className="text-xs sm:text-sm font-medium text-neutral-900">
                                            {currentProfile.recommendedFormula}
                                        </p>
                                    </div>

                                    {/* Liste de ce qui est pris en charge */}
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        {currentProfile.includedPoints.map((pt, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 bg-white/80 p-3 rounded-xl border border-[#EAE6DF]"
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[#D4AF37] shrink-0 mt-0.5"
                                                />
                                                <span>{pt}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Encart Complément Brasseur */}
                                    <div className="bg-[#FAF6EB] border border-[#D4AF37]/40 rounded-xl p-4 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shrink-0 mt-0.5">
                                            <Wine size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-[#996515]">
                                                Complément Naturel : Service Bar &amp; Brasseur
                                            </p>
                                            <p className="text-xs sm:text-sm text-neutral-700 mt-0.5 leading-relaxed">
                                                {currentProfile.brasseurHighlight}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons d'action contextualisés */}
                                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                                    <Link
                                        href={currentProfile.primaryCtaHref}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-black font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <span>{currentProfile.primaryCtaLabel}</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                    <Link
                                        href={currentProfile.secondaryCtaHref}
                                        className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold uppercase tracking-widest text-xs transition-all duration-300 text-center"
                                    >
                                        {currentProfile.secondaryCtaLabel}
                                    </Link>
                                </div>
                            </div>

                            {/* Colonne Visuel */}
                            <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden shadow-md border border-[#E8E2D5]">
                                <Image
                                    src={currentProfile.image}
                                    alt={currentProfile.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
                                            Maison Compère • Depuis 1821
                                        </p>
                                        <p className="text-base font-serif mt-0.5">
                                            Une seule équipe pour orchestrer votre table et votre bar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 3. CONTENEUR DES PRESTATIONS AVEC LE FIL CONDUCTEUR DORÉ       */}
            {/* ============================================================== */}
            <div className="relative w-full max-w-7xl mx-auto">
                {/* THE GOLDEN THREAD (SVG) */}
                <ServiceThread />

                {/* 3.1 MARIAGES (Texte Gauche / Mosaïque Droite) */}
                <div id="mariages" className="scroll-mt-24 relative z-10">
                    <SectionService
                        badge="Traiteur Mariage Liège & Wallonie"
                        title="VOTRE MARIAGE"
                        subtitle="Du vin d'honneur pétillant au banquet gastronomique, nous donnons du goût à votre union."
                        desc="Le repas et le service des boissons rythment toute votre journée de noces. Nous prenons le temps de vous rencontrer pour construire un menu qui vous ressemble — buffet chaud multi-services, buffet froid de gala ou barbecue d'exception — tout en coordonnant le bar et l'équipe de salle."
                        includedBadges={[
                            "Vin d'honneur & Zakouskis",
                            "Buffet Chaud, Gala ou BBQ",
                            "Bar Brasseur & Verrerie",
                            "Brigade en salle dédiée"
                        ]}
                        ctaLabel="Construire mon devis Mariage"
                        ctaLink="/contact?type=mariage-boissons&boissons=oui"
                        secondaryCtaLabel="Voir nos buffets & formules"
                        secondaryCtaLink="/formules"
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

                {/* 3.2 ENTREPRISES (Mosaïque Gauche / Texte Droite) */}
                <div id="entreprises" className="scroll-mt-24 relative z-10">
                    <SectionService
                        badge="Traiteur Événementiel Entreprise Wallonie"
                        title="VOS ÉVÉNEMENTS PRO"
                        subtitle="Une logistique sans faille et une cuisine raffinée à la hauteur de votre réputation."
                        desc="Du lunch de réunion aux petits pains garnis jusqu'au grand cocktail dînatoire pour vos vœux d'entreprise, anniversaires de société ou séminaires. Nous assurons une ponctualité stricte, un dressage élégant et, si souhaité, un bar complet avec barmans pour recevoir vos clients et collaborateurs."
                        includedBadges={[
                            "Cocktails & Walking Dinners",
                            "Petits Pains, Wraps & Verrines",
                            "Frigos & Boissons clé en main",
                            "Facturation Pro HTVA claire"
                        ]}
                        ctaLabel="Demander un devis Entreprise"
                        ctaLink="/contact?type=entreprise-boissons&boissons=oui"
                        secondaryCtaLabel="Découvrir la carte apéritive"
                        secondaryCtaLink="/formules"
                        images={[
                            "/images/event_pro1.jpeg",
                            "/images/event_pro2.jpeg",
                            "/images/event_pro3.jpeg",
                            "/images/event_pro4.jpeg"
                        ]}
                        decorType="geometric"
                        reverse={true}
                    />
                </div>

                {/* 3.3 PARTICULIERS & FÊTES DE FAMILLE (Texte Gauche / Mosaïque Droite) */}
                <div id="particuliers" className="scroll-mt-24 relative z-10">
                    <SectionService
                        badge="Réceptions Privées • Liège, Huy & Waremme"
                        title="VOS FÊTES DE FAMILLE"
                        subtitle="Savourez chaque instant avec vos proches, sans passer votre journée en cuisine ni derrière le bar."
                        desc="Un anniversaire, un baptême, une communion ou des noces d'or ? À domicile, sous chapiteau ou en salle, nous nous adaptons à votre espace et à l'ambiance souhaitée : buffet froid généreux, cochon de lait à la broche, barbecue convivial ou menu chaud servi avec le sourire."
                        includedBadges={[
                            "Dès 14 € / pers. HTVA",
                            "À domicile ou en salle",
                            "Option Vaisselle & Verrerie",
                            "Avec ou sans personnel"
                        ]}
                        ctaLabel="Simuler ma réception privée"
                        ctaLink="/contact?type=fete-privee-boissons&boissons=oui"
                        secondaryCtaLabel="Explorer nos formules"
                        secondaryCtaLink="/formules"
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

                {/* ============================================================== */}
                {/* 4. INTÉGRATION NATURELLE : CUISINE & SERVICE BAR BRASSEUR      */}
                {/* ============================================================== */}
                <section id="boissons" className="scroll-mt-24 relative z-10 py-16 px-6">
                    <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-[#D4AF37]/35 shadow-xl relative overflow-hidden">
                        {/* Décor lumineux discret */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FAF6EB] rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

                        {/* En-tête de la section Brasseur */}
                        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6EB] border border-[#D4AF37]/40 text-[#996515] text-xs uppercase tracking-widest font-bold">
                                <Wine size={14} />
                                <span>L&apos;Alliance Parfaite • Cuisine &amp; Brasseur</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-serif text-[#111111] leading-tight">
                                La Formule Clé en Main :{" "}
                                <span className="italic font-normal text-[#996515]">
                                    Cuisine Artisanale &amp; Service Bar Complet
                                </span>
                            </h2>
                            <p className="text-neutral-600 text-base sm:text-lg font-light leading-relaxed">
                                Pourquoi multiplier les prestataires entre le traiteur, le brasseur et le loueur de frigos ? En complément de nos menus, nous prenons en charge{" "}
                                <strong className="font-medium text-neutral-900">
                                    100 % de la logistique boissons à Liège, Huy-Waremme et en Wallonie
                                </strong>{" "}
                                avec une règle d&apos;or : vous ne payez que ce qui est consommé.
                            </p>
                        </div>

                        {/* Grille des 4 piliers du parcours sans friction */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
                            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E2D5] flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/30 text-[#996515] flex items-center justify-center mb-4 shadow-2xs">
                                        <ThermometerSnowflake size={22} />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#996515]">
                                        1. Équipement Pro
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-[#111111] mt-1 mb-2">
                                        Frigo vitré pro mis à disposition
                                    </h3>
                                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                                        Plus besoin de remplir des bacs de glaçons : nous installons directement sur votre lieu de réception un frigo vitré professionnel haute capacité.
                                    </p>
                                </div>
                                <p className="text-xs font-semibold text-[#996515] mt-4 pt-3 border-t border-[#E8E2D5]">
                                    ✓ Température idéale garantie
                                </p>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E2D5] flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/30 text-[#996515] flex items-center justify-center mb-4 shadow-2xs">
                                        <GlassWater size={22} />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#996515]">
                                        2. Carte Complète
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-[#111111] mt-1 mb-2">
                                        Fûts, bouteilles, vins &amp; softs
                                    </h3>
                                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                                        Bières belges, vins blancs, rouges et rosés sélectionnés pour s&apos;accorder à votre menu, bulles pour le toast, eaux plates/pétillantes et softs.
                                    </p>
                                </div>
                                <p className="text-xs font-semibold text-[#996515] mt-4 pt-3 border-t border-[#E8E2D5]">
                                    ✓ Quantités calibrées sans rupture
                                </p>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E2D5] flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/30 text-[#996515] flex items-center justify-center mb-4 shadow-2xs">
                                        <RefreshCw size={22} />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#996515]">
                                        3. Zéro Gaspillage
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-[#111111] mt-1 mb-2">
                                        Reprise des invendus &amp; vidanges
                                    </h3>
                                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                                        Nous prévoyons large pour votre tranquillité, mais vous ne payez que les bouteilles et fûts entamés. Nous reprenons tout le stock intact et gérons les vidanges.
                                    </p>
                                </div>
                                <p className="text-xs font-semibold text-[#996515] mt-4 pt-3 border-t border-[#E8E2D5]">
                                    ✓ Facturation 100 % au réel
                                </p>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E2D5] flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/30 text-[#996515] flex items-center justify-center mb-4 shadow-2xs">
                                        <Users size={22} />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#996515]">
                                        4. Service &amp; Verrerie
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-[#111111] mt-1 mb-2">
                                        Équipe de service si souhaité
                                    </h3>
                                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                                        Besoin de barmans ou de serveurs pour le vin d&apos;honneur et la soirée ? Notre personnel qualifié assure le service et la tenue du bar.
                                    </p>
                                </div>
                                <p className="text-xs font-semibold text-[#996515] mt-4 pt-3 border-t border-[#E8E2D5]">
                                    ✓ Tarif clair : 18,00 € / h HTVA
                                </p>
                            </div>
                        </div>

                        {/* Bandeau récapitulatif & Double CTA Brasseur */}
                        <div className="bg-[#FAF6EB] rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/40 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="space-y-1.5 text-center lg:text-left max-w-2xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-[#996515]">
                                    Location matériel &amp; bar brasseur • Liège, Saint-Georges, Huy &amp; Waremme
                                </p>
                                <h4 className="text-xl sm:text-2xl font-serif text-[#111111]">
                                    Activez l&apos;option Bar &amp; Boissons en 1 clic dans votre demande de devis
                                </h4>
                                <p className="text-xs sm:text-sm text-neutral-600 font-light">
                                    L&apos;option sera automatiquement pré-cochée dans notre formulaire pour que nous puissions chiffrer votre repas et vos boissons ensemble.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                                <Link
                                    href="/contact?type=mariage-boissons&boissons=oui"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-black font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-md"
                                >
                                    <span>Devis Cuisine + Formule Brasseur</span>
                                    <ArrowRight size={15} />
                                </Link>
                                <Link
                                    href="/formules"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 border border-[#D4AF37]/50 font-bold uppercase tracking-widest text-xs transition-all duration-300 text-center"
                                >
                                    Choisir d&apos;abord mon menu
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3.4 LIVRAISON SEULE & ASSOCIATIONS (Mosaïque Gauche / Texte Droite) */}
                <section id="livraison" className="scroll-mt-24 relative z-10">
                    <SectionService
                        badge="Collectivités, Écoles & Clubs Sportifs"
                        title="LIVRAISON SEULE & ASSOCIATIONS"
                        subtitle="Des plats conviviaux, généreux et prêts à servir pour maximiser la réussite de vos soupers."
                        desc="Idéal pour vos soupers d'école, clubs sportifs, mouvements de jeunesse ou fêtes de quartier. Nous livrons des plats chauds ou froids généreux, prêts à être servis par vos soins. Une solution économique et pratique sans personnel ni vaisselle, qui ne sacrifie rien au goût artisanal de la Maison Compère."
                        includedBadges={[
                            "Plats chauds dès 8 € / pers.",
                            "Conditionnement pro pratique",
                            "Livraison ou retrait atelier",
                            "Option dépôt-vente boissons"
                        ]}
                        ctaLabel="Devis Repas Associatif"
                        ctaLink="/contact?menu=collectivite"
                        secondaryCtaLabel="Voir les plats collectivités"
                        secondaryCtaLink="/formules"
                        images={[
                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
                        ]}
                        decorType="geometric"
                        reverse={true}
                    />
                </section>
            </div>

            {/* ============================================================== */}
            {/* 5. SECTION INTERACTIVE : LA LOGISTIQUE SIMPLIFIÉE (TIMELINE)   */}
            {/* ============================================================== */}
            <section id="logistique" className="scroll-mt-24 max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#996515] bg-[#FAF6EB] px-4 py-1.5 rounded-full border border-[#D4AF37]/30">
                        Organisation Sans Stress • De A à Z
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif text-[#111111]">
                        La logistique simplifiée en 4 étapes
                    </h2>
                    <p className="text-neutral-600 font-light text-base sm:text-lg">
                        De votre première demande de devis jusqu&apos;à la reprise des vidanges le lendemain, voici comment se déroule votre réception.
                    </p>
                </div>

                {/* Sélecteur d'étapes interactif + Cartes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {LOGISTICS_STEPS.map((item, idx) => {
                        const isSelected = activeStepIndex === idx;
                        return (
                            <button
                                key={item.step}
                                type="button"
                                onClick={() => setActiveStepIndex(idx)}
                                className={`text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                                    isSelected
                                        ? "bg-[#111111] text-white border-[#111111] shadow-xl scale-[1.02]"
                                        : "bg-white text-neutral-800 border-[#E8E2D5] hover:border-[#D4AF37]"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                                isSelected
                                                    ? "bg-[#D4AF37] text-black"
                                                    : "bg-[#FAF6EB] text-[#996515]"
                                            }`}
                                        >
                                            Étape {item.step}
                                        </span>
                                        {idx < LOGISTICS_STEPS.length - 1 && (
                                            <ArrowRight
                                                size={16}
                                                className={isSelected ? "text-[#D4AF37]" : "text-neutral-300"}
                                            />
                                        )}
                                    </div>
                                    <h3
                                        className={`font-serif text-lg sm:text-xl font-bold leading-snug mb-2 ${
                                            isSelected ? "text-white" : "text-[#111111]"
                                        }`}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className={`text-xs leading-relaxed ${
                                            isSelected ? "text-neutral-300" : "text-neutral-500"
                                        }`}
                                    >
                                        {item.subtitle}
                                    </p>
                                </div>

                                <div
                                    className={`mt-4 pt-3 border-t text-[11px] font-bold uppercase tracking-wider ${
                                        isSelected
                                            ? "border-white/15 text-[#D4AF37]"
                                            : "border-neutral-100 text-[#996515]"
                                    }`}
                                >
                                    {isSelected ? "Étape sélectionnée" : "Voir le détail →"}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Détail de l'étape active */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStepIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D5] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
                    >
                        <div className="space-y-4 max-w-3xl">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#996515]">
                                <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-serif">
                                    {LOGISTICS_STEPS[activeStepIndex].step}
                                </span>
                                <span>{LOGISTICS_STEPS[activeStepIndex].subtitle}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-serif text-[#111111]">
                                {LOGISTICS_STEPS[activeStepIndex].title}
                            </h3>
                            <p className="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
                                {LOGISTICS_STEPS[activeStepIndex].description}
                            </p>
                            <div className="flex flex-wrap gap-2.5 pt-1">
                                {LOGISTICS_STEPS[activeStepIndex].highlights.map((h, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FAF8F5] text-neutral-800 px-3.5 py-1.5 rounded-full border border-[#E8E2D5]"
                                    >
                                        <CheckCircle2 size={14} className="text-[#D4AF37]" />
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                            {activeStepIndex < LOGISTICS_STEPS.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                                    className="px-6 py-3.5 rounded-full bg-[#FAF6EB] hover:bg-[#D4AF37] text-[#996515] hover:text-black font-bold text-xs uppercase tracking-widest transition-colors border border-[#D4AF37]/40 cursor-pointer"
                                >
                                    Étape suivante ({LOGISTICS_STEPS[activeStepIndex + 1].step}/04) →
                                </button>
                            ) : null}
                            <Link
                                href="/contact?type=mariage-boissons&boissons=oui"
                                className="px-7 py-4 rounded-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-colors text-center shadow-sm"
                            >
                                Lancer l&apos;étape 1 : Mon devis gratuit
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* ============================================================== */}
            {/* 6. VALEURS & ANCRAGE LOCAL (LIÈGE, HUY, WAREMME, WALLONIE)     */}
            {/* ============================================================== */}
            <section className="px-6 py-16 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
                    <ValueItem
                        title="Fait Maison & Terroir Local"
                        path="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        desc="Pas de secret : pour que ce soit bon, il faut de bons produits. Nous privilégions les producteurs de notre région et la cuisine préparée dans notre atelier."
                        delay={0.1}
                    />
                    <ValueItem
                        title="Sur-Mesure & Écoute"
                        path="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21 1.01.33 2.05.33 3.1 0 5.5-4.5 10-10 10z"
                        desc="Un régime spécial, une allergie ou une envie particulière ? Nous construisons le menu et la carte des boissons avec vous pour qu'ils vous ressemblent."
                        delay={0.2}
                    />
                    <ValueItem
                        title="Transparence Totale"
                        path="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                        desc="Aucune mauvaise surprise sur la facture. Nos devis sont clairs, nos tarifs de service affichés (18 €/h HTVA) et les boissons non entamées sont intégralement reprises."
                        delay={0.3}
                    />
                </div>

                {/* Encart SEO Local : Zones de déplacement */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-[#FAF6EB] text-[#996515] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111]">
                                Votre traiteur &amp; brasseur en Province de Liège, Huy-Waremme et Wallonie
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 leading-relaxed">
                                Depuis notre atelier de <strong>Saint-Georges-sur-Meuse</strong>, nous assurons la livraison, l&apos;installation des frigos et le service complet à{" "}
                                <strong>Liège, Huy, Waremme, Amay, Verlaine, Villers-le-Bouillet, Flémalle, Seraing, Hannut</strong> et dans l&apos;ensemble de la Wallonie.
                            </p>
                        </div>
                    </div>
                    <a
                        href="tel:+32468385082"
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FAF8F5] hover:bg-[#FAF6EB] border border-[#D4AF37]/40 text-xs font-bold text-neutral-900 transition-colors"
                    >
                        <Phone size={14} className="text-[#996515]" />
                        <span>+32 468 38 50 82</span>
                    </a>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 7. FAQ DÉDIÉE AUX PRESTATIONS TRAITEUR & BRASSEUR              */}
            {/* ============================================================== */}
            <section id="faq" className="scroll-mt-24 max-w-4xl mx-auto px-6 py-16 relative z-10">
                <div className="text-center mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EB] border border-[#D4AF37]/30 text-[#996515] text-xs font-bold uppercase tracking-widest">
                        <HelpCircle size={14} />
                        <span>Questions Fréquentes</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-[#111111]">
                        Tout savoir sur nos prestations &amp; la formule Brasseur
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base font-light">
                        Vaisselle, personnel en salle, gestion des invendus boissons et déplacements : nos réponses claires.
                    </p>
                </div>

                <div className="space-y-3.5">
                    {SERVICES_FAQ.map((item, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs transition-colors hover:border-[#D4AF37]/60"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-serif font-bold text-base sm:text-lg text-[#111111]">
                                        {item.question}
                                    </span>
                                    <span
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? "bg-[#111111] text-[#D4AF37] rotate-180"
                                                : "bg-[#FAF8F5] text-neutral-600"
                                        }`}
                                    >
                                        <ChevronDown size={18} />
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-t border-neutral-100">
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

            {/* ============================================================== */}
            {/* 8. CALL TO ACTION FINAL (PARALLAX)                             */}
            {/* ============================================================== */}
            <ParallaxCta />
        </main>
    );
}

// --- VISUAL SUMMARY (STICKY SUB-NAVIGATION) ---
function VisualSummary() {
    return (
        <nav
            aria-label="Navigation des services"
            className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-10 border-t border-b border-[#E8E2D5] py-4 px-4 mt-10 bg-white/90 backdrop-blur-md sticky top-20 z-40 rounded-2xl shadow-2xs transition-all duration-300 text-center"
        >
            {[
                { label: "Par Événement", href: "#configurateur" },
                { label: "Mariages", href: "#mariages" },
                { label: "Entreprises", href: "#entreprises" },
                { label: "Fêtes Privées", href: "#particuliers" },
                { label: "Bar & Brasseur", href: "#boissons" },
                { label: "Associations", href: "#livraison" },
                { label: "Logistique 4 Étapes", href: "#logistique" },
                { label: "FAQ", href: "#faq" }
            ].map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="text-xs sm:text-sm uppercase tracking-[0.16em] font-semibold text-neutral-600 hover:text-[#996515] transition-colors duration-300 relative group py-1"
                >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
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
                viewBox="0 0 100 400"
            >
                <motion.path
                    d="M 50 0 
                       C 50 25, 28 25, 28 60 
                       C 28 95, 50 95, 50 130
                       C 50 165, 72 165, 72 200
                       C 72 235, 50 235, 50 270
                       C 50 305, 28 305, 28 340
                       C 28 375, 50 375, 50 400"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="0.45"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                        <stop offset="10%" stopColor="#D4AF37" stopOpacity="0.45" />
                        <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.85" />
                        <stop offset="90%" stopColor="#D4AF37" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// --- REUSABLE SECTION SERVICE ---
function SectionService({
    badge,
    title,
    subtitle,
    desc,
    includedBadges,
    ctaLabel = "En savoir plus",
    ctaLink = "/contact",
    secondaryCtaLabel,
    secondaryCtaLink,
    images,
    decorType,
    reverse
}: {
    badge?: string;
    title: string;
    subtitle: string;
    desc: string;
    includedBadges?: string[];
    ctaLabel?: string;
    ctaLink?: string;
    secondaryCtaLabel?: string;
    secondaryCtaLink?: string;
    images: string[];
    decorType: "flower" | "herb" | "geometric";
    reverse: boolean;
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

    const yBg = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const yDecor = useTransform(scrollYProgress, [0, 1], [0, -50]);

    const blobRadius = reverse
        ? "30% 70% 70% 30% / 30% 30% 70% 70%"
        : "70% 30% 30% 70% / 70% 70% 30% 30%";

    let DecorSVG = null;
    let decorClass = "";

    if (decorType === "flower") {
        decorClass = "w-48 md:w-64 -top-20 -right-12 md:-right-20 rotate-12 opacity-30 text-[#D4AF37]";
        DecorSVG = (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
                <path d="M50 50 C20 80 0 50 20 20 C40 0 60 0 80 20 C100 50 80 80 50 50 Z M50 50 Q30 30 50 10 M50 50 Q70 30 50 10 M50 50 Q30 70 50 90 M50 50 Q70 70 50 90" />
                <path d="M50 50 C35 60 25 40 35 30 C45 20 65 20 75 30 C85 40 75 60 50 50" />
                <path d="M50 90 Q50 100 55 100" strokeWidth="1" />
            </svg>
        );
    } else if (decorType === "herb") {
        decorClass = "w-40 md:w-56 -bottom-16 -left-10 md:-left-16 -rotate-12 opacity-30 text-[#996515]";
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
        decorClass = "w-56 md:w-72 -top-16 -left-12 md:-left-20 opacity-20 text-[#D4AF37]";
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
        <section ref={ref} className="relative py-20 md:py-28 w-full overflow-hidden">
            {/* Organic background card layer */}
            <motion.div
                style={{
                    y: yBg,
                    borderRadius: blobRadius
                }}
                className={`absolute top-4 bottom-4 bg-white border border-[#EAE6DF] w-[92%] md:w-[78%] -z-20 shadow-xs
                ${reverse ? "-left-16" : "-right-16"}
                transition-all duration-700 ease-out`}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${reverse ? "md:flex-row-reverse" : ""}`}>
                    {/* EDITORIAL CONTENT */}
                    <div className="w-full md:w-5/12 space-y-6 relative bg-white/90 md:bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-sm">
                        <motion.div
                            style={{ y: yDecor }}
                            className={`absolute pointer-events-none z-0 ${decorClass} hidden md:block`}
                        >
                            {DecorSVG}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 space-y-5"
                        >
                            {badge && (
                                <span className="inline-block text-[11px] uppercase tracking-widest font-bold text-[#996515] bg-[#FAF6EB] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                                    {badge}
                                </span>
                            )}

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-wider text-[#111111]">
                                {title}
                            </h2>

                            <div className="border-l-2 border-[#D4AF37] pl-4 py-1">
                                <p className="font-sans text-neutral-800 text-base sm:text-lg font-medium leading-snug">
                                    {subtitle}
                                </p>
                            </div>

                            <p className="text-neutral-600 font-sans font-light leading-relaxed text-sm sm:text-base">
                                {desc}
                            </p>

                            {includedBadges && includedBadges.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {includedBadges.map((b, i) => (
                                        <span
                                            key={i}
                                            className="text-xs font-medium bg-[#FAF8F5] text-neutral-800 px-3 py-1.5 rounded-xl border border-[#E8E2D5] flex items-center gap-1.5"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <Link
                                    href={ctaLink}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xs"
                                >
                                    <span>{ctaLabel}</span>
                                    <ArrowRight size={14} />
                                </Link>

                                {secondaryCtaLabel && secondaryCtaLink && (
                                    <Link
                                        href={secondaryCtaLink}
                                        className="inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#FAF6EB] text-neutral-800 border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-widest transition-all duration-300"
                                    >
                                        {secondaryCtaLabel}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* MOSAIC GRID (2x2) */}
                    <div className="w-full md:w-7/12 relative">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            {images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
                                    className={`relative aspect-[4/4] sm:aspect-[3/4] overflow-hidden shadow-lg rounded-2xl border border-[#E8E2D5]
                                        ${idx === 1 ? "mt-6 md:mt-10" : ""} 
                                        ${idx === 2 ? "-mt-6 md:-mt-10" : ""}
                                    `}
                                >
                                    <Image
                                        src={img}
                                        alt={`${title} - Prestation ${idx + 1} - Traiteur Compère Liège`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 28vw, 320px"
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
    text = "Prêt à donner vie à votre événement ?",
    subText = "Composez votre menu et activez l'option Bar Brasseur en quelques clics : devis personnalisé sous 24h.",
    link = "/contact?type=mariage-boissons&boissons=oui",
    buttonText = "DEMANDER UN DEVIS GRATUIT",
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

    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <section ref={ref} className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden mt-16">
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[135%] -top-[18%] z-0">
                <Image
                    src={image}
                    alt="Ambiance réception, service bar et traiteur haut de gamme - Traiteur Compère"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>

            <div className="absolute inset-0 bg-black/65 z-10" />

            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-6">
                <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                    Maison Compère • Cuisine &amp; Brasseur
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                    {text}
                </h2>
                <p className="text-white/90 font-sans font-light text-base md:text-xl max-w-2xl mx-auto">
                    {subText}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Link
                        href={link}
                        className="w-full sm:w-auto inline-block bg-[#D4AF37] text-black px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-white transition-all duration-300 shadow-lg"
                    >
                        {buttonText}
                    </Link>
                    <Link
                        href="/formules"
                        className="w-full sm:w-auto inline-block bg-white/10 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-all duration-300"
                    >
                        VOIR NOS FORMULES &amp; TARIFS
                    </Link>
                </div>
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
            className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-[#E8E2D5] shadow-2xs"
        >
            <div className="w-12 h-12 mb-5 text-[#D4AF37] bg-[#FAF6EB] p-3 rounded-2xl border border-[#D4AF37]/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d={path} />
                </svg>
            </div>
            <h3 className="font-serif text-xl text-[#111111] mb-3 uppercase tracking-wider font-bold">{title}</h3>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}
