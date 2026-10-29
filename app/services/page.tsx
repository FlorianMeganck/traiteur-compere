"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

// --- TYPES & CATÉGORIES DE FILTRE ---
type FilterCategory =
    | "tous"
    | "mariages-fetes"
    | "entreprises"
    | "bar-boissons"
    | "logistique";

const FILTER_TABS: { id: FilterCategory; label: string }[] = [
    { id: "tous", label: "Tous" },
    { id: "mariages-fetes", label: "Mariages & Fêtes" },
    { id: "entreprises", label: "Entreprises" },
    { id: "bar-boissons", label: "Bar & Boissons" },
    { id: "logistique", label: "Logistique" },
];

interface ServiceCardItem {
    id: string;
    category: Exclude<FilterCategory, "tous">;
    tag: string;
    title: string;
    lead: string;
    bullets: [string, string, string]; // Exactement 3 puces concises ("Règle des 3 points")
    details: string[]; // Contenu de l'accordéon "Voir les détails et options" (toujours présent dans le DOM)
    image: string;
    imageAlt: string;
    ghostCtaLabel: string;
    ghostCtaHref: string;
    textLinkLabel?: string;
    textLinkHref?: string;
}

interface PillarSectionData {
    id: string;
    pillarNumber: string;
    subtitle: string;
    title: string;
    description: string;
    cards: ServiceCardItem[];
}

// --- DONNÉES STRUCTURÉES EN 3 PILIERS ---
const PILLARS_DATA: PillarSectionData[] = [
    {
        id: "pole-receptions",
        pillarNumber: "Pilier 01",
        subtitle: "Pôle Réceptions & Formats",
        title: "Mariages, Événements d'Entreprise & Réceptions Privées",
        description:
            "Une cuisine artisanale préparée maison pour vos réceptions à Liège, Huy, Waremme, Saint-Georges-sur-Meuse et Grâce-Hollogne.",
        cards: [
            {
                id: "card-mariages",
                category: "mariages-fetes",
                tag: "Mariages & Noces",
                title: "Votre Mariage sur mesure en Province de Liège",
                lead: "Du vin d'honneur pétillant au banquet servi ou buffet de gala, nous composons une réception à votre image.",
                bullets: [
                    "Vin d'honneur : zakouskis, verrines créatives et pains festifs",
                    "Repas principal : buffet chaud (2 à 5 services), buffet Gala ou BBQ noble",
                    "Coordination fluide avec le service bar et la brigade de salle",
                ],
                details: [
                    "Rencontre personnalisée pour définir le menu selon vos goûts et votre budget.",
                    "Adaptation complète aux régimes alimentaires et allergies (végétarien, sans gluten, sans lactose).",
                    "Possibilité d'inclure la cascade de desserts ou l'assortiment de mignardises maison.",
                    "Déplacement sur votre lieu de réception à Liège, Huy, Waremme et dans toute la Wallonie.",
                ],
                image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Traiteur mariage à Liège et en Wallonie - Maison Compère",
                ghostCtaLabel: "Découvrir nos buffets chauds →",
                ghostCtaHref: "/formules#buffets-chauds",
                textLinkLabel: "Devis Mariage",
                textLinkHref: "/contact?type=mariage",
            },
            {
                id: "card-entreprises",
                category: "entreprises",
                tag: "Corporate & B2B",
                title: "Événements d'Entreprise & Séminaires en Wallonie",
                lead: "Une prestation ponctuelle et soignée pour vos réceptions professionnelles, inaugurations et réunions.",
                bullets: [
                    "Cocktails dînatoires, walking dinners et réceptions de vœux",
                    "Petits pains garnis, wraps et salad bars pour vos journées d'étude",
                    "Facturation professionnelle HTVA claire et devis rapide sous 24h",
                ],
                details: [
                    "Installation autonome dans vos locaux d'entreprise (Liège, Grâce-Hollogne, Huy, Waremme) ou en salle.",
                    "Gammes Classique, Internationale et Premium pour vos zakouskis et verrines (formats 6 cl ou 12 cl).",
                    "Option bar brasseur clé en main avec personnel pour vos afterworks et fêtes du personnel.",
                ],
                image: "/images/event_pro1.jpeg",
                imageAlt: "Traiteur événementiel entreprise à Liège et Grâce-Hollogne - Traiteur Compère",
                ghostCtaLabel: "Découvrir nos apéritifs & verrines →",
                ghostCtaHref: "/formules#aperitifs",
                textLinkLabel: "Devis Entreprise",
                textLinkHref: "/contact?type=entreprise",
            },
            {
                id: "card-fetes-privees",
                category: "mariages-fetes",
                tag: "Particuliers & Associations",
                title: "Fêtes de Famille, Banquets & Repas Associatifs",
                lead: "Anniversaires, baptêmes, communions ou soupers de clubs : profitez de vos proches sans passer la journée en cuisine.",
                bullets: [
                    "Barbecues au feu de bois, cochon de lait et porchetta dès 11 €/pers.",
                    "Buffets froids artisanaux (Campagnard, Ardennais, Réception, Gala)",
                    "Plats uniques et formules collectivités dès 8 €/pers. HTVA",
                ],
                details: [
                    "À domicile, sous chapiteau ou en salle des fêtes dans toute la région liégeoise.",
                    "Choix libre entre la livraison seule (idéale pour les associations) ou le service complet.",
                    "Conditionnement professionnel facilitant le maintien au chaud et le service.",
                ],
                image: "/images/Buffet-froid-reception.jpeg",
                imageAlt: "Buffet froid de réception et barbecue traiteur à Huy et Waremme",
                ghostCtaLabel: "Découvrir nos barbecues & buffets →",
                ghostCtaHref: "/formules#bbq",
                textLinkLabel: "Voir les buffets froids",
                textLinkHref: "/formules#buffets-froids",
            },
        ],
    },
    {
        id: "pole-bar-boissons",
        pillarNumber: "Pilier 02",
        subtitle: "Pôle Bar & Boissons (Formule Brasserie)",
        title: "La Solution Boissons Clé en Main & Zéro Gaspillage",
        description:
            "Le complément naturel de notre cuisine : un seul interlocuteur pour orchestrer votre repas et l'ensemble de votre bar.",
        cards: [
            {
                id: "card-frigo-boissons",
                category: "bar-boissons",
                tag: "Matériel & Stock",
                title: "Frigo Vitré Professionnel & Fourniture Complète",
                lead: "Nous livrons et installons votre bar complet pour que chaque boisson soit servie à température idéale.",
                bullets: [
                    "Frigo vitré professionnel mis à disposition directement sur place",
                    "Sélection complète : bières belges, fûts, vins, bulles, softs et eaux",
                    "Quantités calibrées avec marge de sécurité pour ne jamais manquer",
                ],
                details: [
                    "Livraison anticipée sur le lieu de votre événement (Saint-Georges-sur-Meuse, Liège, Huy, Waremme, Grâce-Hollogne).",
                    "Conseils sur les accords mets & vins en fonction du buffet ou du barbecue choisi.",
                    "Option location de verrerie assortie : verres à vin, verres à soft et flûtes à champagne.",
                ],
                image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Location frigo vitré et service brasseur traiteur à Liège",
                ghostCtaLabel: "Inclure la formule Brasseur au devis →",
                ghostCtaHref: "/contact?boissons=oui",
                textLinkLabel: "Voir l'offre sur Formules",
                textLinkHref: "/formules#boissons",
            },
            {
                id: "card-zero-gaspillage",
                category: "bar-boissons",
                tag: "Budget Maîtrisé",
                title: "Consommation au Réel & Reprise des Invendus",
                lead: "Prévoyez large en toute sérénité : vous ne payez strictement que ce que vos invités ont consommé.",
                bullets: [
                    "Reprise intégrale des bouteilles et fûts non entamés après la fête",
                    "Gestion complète et évacuation des vidanges par notre équipe",
                    "Décompte transparent sur votre facture finale après l'événement",
                ],
                details: [
                    "Fini les allers-retours au supermarché, le stockage des casiers et la corvée des vidanges le lendemain.",
                    "Aucune perte financière sur les boissons non ouvertes.",
                    "Idéal aussi bien pour les mariages que pour les événements d'entreprise et fêtes de famille.",
                ],
                image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Service boissons zéro gaspillage avec reprise des invendus",
                ghostCtaLabel: "Simuler un devis avec boissons →",
                ghostCtaHref: "/contact?boissons=oui",
            },
            {
                id: "card-equipe-bar",
                category: "bar-boissons",
                tag: "Service au Bar",
                title: "Barmans & Service des Boissons en Salle",
                lead: "Confiez la tenue du bar et le service du vin d'honneur à une équipe souriante et expérimentée.",
                bullets: [
                    "Barmans et serveurs dédiés à 18,00 € / heure HTVA par personne",
                    "Service au plateau lors de la réception et gestion du bar en soirée",
                    "Mise en place, réassort des frigos et rangement des postes boissons",
                ],
                details: [
                    "Durée d'intervention modulable selon le déroulé de votre journée ou soirée.",
                    "Tenue professionnelle soignée et service discret.",
                    "Peut être combiné avec le service à table ou au buffet.",
                ],
                image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Barman et équipe de service pour réception traiteur en Wallonie",
                ghostCtaLabel: "Réserver avec personnel de bar →",
                ghostCtaHref: "/contact?boissons=oui&service=oui",
            },
        ],
    },
    {
        id: "pole-logistique-confort",
        pillarNumber: "Pilier 03",
        subtitle: "Pôle Logistique & Confort",
        title: "Personnel de Salle, Matériel, Vaisselle & Livraison",
        description:
            "Tout l'équipement et l'encadrement nécessaires pour transformer une salle ou votre domicile en lieu de réception.",
        cards: [
            {
                id: "card-personnel-salle",
                category: "logistique",
                tag: "Brigade & Salle",
                title: "Personnel de Salle & Brigade de Cuisine",
                lead: "Un accompagnement humain attentif pour orchestrer le rythme de votre repas du début à la fin.",
                bullets: [
                    "Cuisson minute sur place (barbecues, viandes nobles, cochon de lait)",
                    "Dressage esthétique et réassort permanent de vos buffets chauds et froids",
                    "Service en salle tarifé en toute transparence à 18,00 € / h HTVA",
                ],
                details: [
                    "Prise en charge du débarrassage des tables tout au long du repas.",
                    "Respect rigoureux du timing souhaité (discours, animations, ouverture de bal).",
                    "Conseil en amont sur le nombre optimal de serveurs selon votre nombre de convives.",
                ],
                image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Brigade de cuisine et personnel de salle Traiteur Compère",
                ghostCtaLabel: "Demander un devis avec service →",
                ghostCtaHref: "/contact?service=oui",
            },
            {
                id: "card-vaisselle-materiel",
                category: "logistique",
                tag: "Arts de la Table",
                title: "Matériel Thermique, Vaisselle & Verrerie",
                lead: "Équipez votre réception sans contrainte d'achat ni de vaisselle le lendemain de votre fête.",
                bullets: [
                    "Matériel de maintien au chaud (chafing dishes, bains-marie, grils) fourni",
                    "Option location de vaisselle complète à 1,50 € / pers. HTVA",
                    "Location de verrerie au choix : verres à vin, verres à soft et flûtes",
                ],
                details: [
                    "Reprise de la vaisselle et de la verrerie après l'événement.",
                    "Présentation sur plats, ardoises et supports élégants signés Maison Compère.",
                    "Sélectionnable directement par simple case à cocher dans le configurateur de devis.",
                ],
                image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Location vaisselle, verrerie et matériel traiteur à Huy et Waremme",
                ghostCtaLabel: "Configurer mes options matériel →",
                ghostCtaHref: "/contact?type=services",
            },
            {
                id: "card-livraison-retrait",
                category: "logistique",
                tag: "Mobilité & Flexibilité",
                title: "Livraison sur Site ou Retrait à l'Atelier",
                lead: "Une logistique ponctuelle adaptée aussi bien aux grandes réceptions qu'aux repas en livraison seule.",
                bullets: [
                    "Livraison frigorifique à Liège, Huy, Waremme, Grâce-Hollogne et environs",
                    "Retrait gratuit possible à notre atelier de Saint-Georges-sur-Meuse",
                    "Instructions claires de remise en température et de dressage fournies",
                ],
                details: [
                    "Atelier situé Rue Potay 3, 4470 Saint-Georges-sur-Meuse (accès direct autoroute E42).",
                    "Respect strict de la chaîne du froid et du chaud jusqu'à la mise en place.",
                    "Reprise planifiée du matériel, des frigos et des vidanges après votre événement.",
                ],
                image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
                imageAlt: "Livraison traiteur Saint-Georges-sur-Meuse, Liège, Huy et Waremme",
                ghostCtaLabel: "Voir nos formules collectivités →",
                ghostCtaHref: "/formules#collectivites",
                textLinkLabel: "Nous contacter",
                textLinkHref: "/contact?type=services",
            },
        ],
    },
];

// --- MINI-TIMELINE RASSURANTE (3 ÉTAPES CLÉS) ---
const TIMELINE_STEPS = [
    {
        step: "01",
        title: "1. Élaboration sur mesure",
        desc: "Nous composons ensemble votre menu, calibrons vos boissons et établissons un devis détaillé sans surprise.",
    },
    {
        step: "02",
        title: "2. Installation & coordination logistique",
        desc: "Livraison du matériel, mise en place du frigo vitré pro, de la vaisselle et dressage soigné sur votre lieu de réception.",
    },
    {
        step: "03",
        title: "3. Vous profitez de vos convives",
        desc: "Service attentif le jour J, puis reprise complète du matériel, des invendus boissons et des vidanges.",
    },
];

// --- FAQ PRESTATIONS (En bas de page) ---
const SERVICES_FAQ = [
    {
        question: "Comment fonctionne la Formule Brasseur « Zéro Gaspillage » ?",
        answer: "Nous installons un frigo vitré professionnel sur votre lieu de réception avec un stock complet (bières, fûts, vins, bulles, softs et eaux) prévu large pour vos invités. En fin d'événement, nous reprenons toutes les bouteilles et fûts non entamés ainsi que les vidanges : seules les boissons ouvertes sont facturées.",
    },
    {
        question: "Fournissez-vous la vaisselle, la verrerie et le matériel de réchauffage ?",
        answer: "Oui. Le matériel de présentation et de maintien au chaud est prévu avec nos formules chaudes. Vous pouvez ajouter en un clic dans votre devis la location de vaisselle (1,50 €/pers. HTVA) et de verrerie (verres à vin, softs, flûtes).",
    },
    {
        question: "Peut-on réserver uniquement le repas en livraison, avec ou sans personnel ?",
        answer: "Tout est modulable : vous pouvez opter pour la livraison seule (idéale pour les repas en famille ou associations) ou réserver nos serveurs et barmans au tarif de 18,00 € / heure HTVA par personne.",
    },
    {
        question: "Dans quelles communes intervenez-vous ?",
        answer: "Depuis notre atelier de Saint-Georges-sur-Meuse (Rue Potay 3), nous intervenons à Liège, Huy, Waremme, Grâce-Hollogne, Amay, Verlaine, Flémalle, Seraing, Hannut et dans toute la Wallonie.",
    },
];

export default function Services() {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>("tous");
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleCardDetails = (cardId: string) => {
        setExpandedCards((prev) => ({
            ...prev,
            [cardId]: !prev[cardId],
        }));
    };

    return (
        <main className="bg-[#FAF8F5] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white pt-40 md:pt-48 pb-24 overflow-hidden relative">
            {/* ============================================================== */}
            {/* 1. EN-TÊTE ÉPURÉ & SÉLECTEUR PAR PASTILLES (PILLS)             */}
            {/* ============================================================== */}
            <section className="px-6 mb-14 max-w-6xl mx-auto text-center relative z-10">
                <p className="text-xs uppercase tracking-[0.25em] text-[#996515] font-bold mb-3">
                    Maison Compère • Liège, Huy, Waremme &amp; Saint-Georges
                </p>
                <h1 className="text-4xl sm:text-6xl font-serif text-[#111111] uppercase tracking-wider mb-5">
                    Nos Services Traiteur &amp; Réceptions
                </h1>
                <p className="text-neutral-600 font-light text-base sm:text-lg max-w-2xl mx-auto mb-10 italic">
                    &ldquo;Une organisation complète regroupée en 3 pôles complémentaires : notre cuisine artisanale, notre service bar brasseur et notre logistique clé en main.&rdquo;
                </p>

                {/* SÉLECTEUR INTERACTIF PAR PASTILLES (PILLS) */}
                <div
                    role="tablist"
                    aria-label="Filtrer les services par catégorie"
                    className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 bg-white p-2 rounded-full border border-[#E8E2D5] shadow-2xs"
                >
                    {FILTER_TABS.map((tab) => {
                        const isActive = activeFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveFilter(tab.id)}
                                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                                    isActive
                                        ? "bg-[#1A1A1A] text-[#D4AF37] shadow-xs"
                                        : "bg-transparent text-neutral-600 hover:text-[#1A1A1A] hover:bg-[#FAF6EB]/60"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ============================================================== */}
            {/* 2. LES 3 PILIERS + FIL CONDUCTEUR EN ARRIÈRE-PLAN              */}
            {/* ============================================================== */}
            <div className="relative w-full max-w-7xl mx-auto px-6">
                {/* FIL CONDUCTEUR DOUX EN ARRIÈRE-PLAN (opacity-20) */}
                <ServiceThread />

                <div className="space-y-20 relative z-10">
                    {PILLARS_DATA.map((pillar) => {
                        // Vérifie si au moins une carte du pilier correspond au filtre actif
                        const hasVisibleCard =
                            activeFilter === "tous" ||
                            pillar.cards.some((c) => c.category === activeFilter);

                        return (
                            <section
                                key={pillar.id}
                                id={pillar.id}
                                // IMPORTANT SEO : Le pilier reste dans le DOM même lorsqu'il est masqué par le filtre
                                className={`scroll-mt-28 transition-opacity duration-300 ${
                                    hasVisibleCard ? "block opacity-100" : "hidden opacity-0"
                                }`}
                            >
                                {/* En-tête du Pilier (Hiérarchie sémantique H2) */}
                                <div className="max-w-3xl mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#996515] bg-[#FAF6EB] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                                            {pillar.pillarNumber} • {pillar.subtitle}
                                        </span>
                                        <span className="h-[1px] flex-1 bg-[#E8E2D5] max-w-[120px]" />
                                    </div>
                                    <h2 className="text-2xl sm:text-4xl font-serif text-[#111111] mb-2">
                                        {pillar.title}
                                    </h2>
                                    <p className="text-sm sm:text-base text-neutral-600 font-light">
                                        {pillar.description}
                                    </p>
                                </div>

                                {/* Grille des cartes du Pilier */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-start">
                                    {pillar.cards.map((card) => {
                                        const isCardVisible =
                                            activeFilter === "tous" || card.category === activeFilter;
                                        const isExpanded = !!expandedCards[card.id];

                                        return (
                                            <article
                                                key={card.id}
                                                id={card.id}
                                                // IMPORTANT SEO : La carte reste dans le DOM HTML même si filtrée
                                                className={`bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                                                    isCardVisible ? "flex" : "hidden"
                                                }`}
                                            >
                                                <div>
                                                    {/* Visuel ratio 16/10 soigné */}
                                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                                                        <Image
                                                            src={card.image}
                                                            alt={card.imageAlt}
                                                            fill
                                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                        <div className="absolute top-3 left-3">
                                                            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#1A1A1A] px-3 py-1 rounded-full border border-[#E8E2D5] shadow-2xs">
                                                                {card.tag}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Corps de la carte : Titre H3 + 1 phrase + 3 puces dorées */}
                                                    <div className="p-6 sm:p-7">
                                                        <h3 className="font-serif text-xl sm:text-2xl text-[#111111] font-bold mb-2 leading-snug">
                                                            {card.title}
                                                        </h3>
                                                        <p className="text-sm text-neutral-600 font-light leading-relaxed mb-5">
                                                            {card.lead}
                                                        </p>

                                                        {/* Règle des 3 points : Exactement 3 puces concises avec puce dorée fine */}
                                                        <ul className="space-y-2.5 mb-5 border-t border-[#FAF8F5] pt-4">
                                                            {card.bullets.map((bullet, bIdx) => (
                                                                <li
                                                                    key={bIdx}
                                                                    className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 leading-snug"
                                                                >
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                                                                    <span>{bullet}</span>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {/* Accordéon discret "Voir les détails et options" (toujours dans le DOM pour le SEO) */}
                                                        <div className="border-t border-[#E8E2D5]/70 pt-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleCardDetails(card.id)}
                                                                aria-expanded={isExpanded}
                                                                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#996515] hover:text-[#111111] py-1.5 transition-colors cursor-pointer"
                                                            >
                                                                <span>
                                                                    {isExpanded
                                                                        ? "Masquer les détails"
                                                                        : "Voir les détails et options"}
                                                                </span>
                                                                <ChevronDown
                                                                    size={15}
                                                                    className={`transition-transform duration-300 ${
                                                                        isExpanded ? "rotate-180" : ""
                                                                    }`}
                                                                />
                                                            </button>

                                                            {/* Contenu toujours rendu dans le DOM HTML pour l'indexation Google */}
                                                            <div
                                                                className={`grid transition-all duration-300 ease-in-out ${
                                                                    isExpanded
                                                                        ? "grid-rows-[1fr] opacity-100 mt-3"
                                                                        : "grid-rows-[0fr] opacity-0"
                                                                }`}
                                                            >
                                                                <div className="overflow-hidden">
                                                                    <ul className="space-y-2 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E2D5]/80 text-xs text-neutral-600 font-light leading-relaxed">
                                                                        {card.details.map((detail, dIdx) => (
                                                                            <li key={dIdx} className="flex items-start gap-2">
                                                                                <span className="text-[#D4AF37] font-bold">•</span>
                                                                                <span>{detail}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pied de carte : Bouton secondaire "Ghost" discret */}
                                                <div className="px-6 sm:px-7 pb-6 pt-2 flex flex-wrap items-center justify-between gap-3">
                                                    <Link
                                                        href={card.ghostCtaHref}
                                                        className="border border-[#D4AF37]/40 text-[#1A1A1A] hover:bg-[#FAF6EB] rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1.5"
                                                    >
                                                        <span>{card.ghostCtaLabel}</span>
                                                    </Link>

                                                    {card.textLinkLabel && card.textLinkHref && (
                                                        <Link
                                                            href={card.textLinkHref}
                                                            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-[#996515] transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <span>{card.textLinkLabel}</span>
                                                            <ArrowRight size={12} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* ============================================================== */}
                {/* 3. MINI-TIMELINE RASSURANTE EN 3 ÉTAPES CLÉS                   */}
                {/* ============================================================== */}
                <section className="my-24 relative z-10">
                    <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E8E2D5] shadow-2xs">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#996515] font-bold mb-2">
                                Votre tranquillité d&apos;esprit
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-serif text-[#111111]">
                                Une organisation fluide en 3 étapes
                            </h2>
                        </div>

                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Ligne horizontale fine reliant les 3 étapes sur desktop */}
                            <div
                                className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[1px] bg-[#E8E2D5] z-0"
                                aria-hidden="true"
                            />

                            {TIMELINE_STEPS.map((item) => (
                                <div
                                    key={item.step}
                                    className="relative z-10 flex flex-col items-center text-center px-2"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#FAF6EB] border border-[#D4AF37]/50 text-[#996515] font-serif font-bold text-base flex items-center justify-center mb-4 shadow-2xs">
                                        {item.step}
                                    </div>
                                    <h3 className="font-serif text-lg font-bold text-[#111111] mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-xs">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 4. FAQ DÉDIÉE EN BAS DE PAGE                                   */}
                {/* ============================================================== */}
                <section id="faq" className="scroll-mt-24 max-w-4xl mx-auto mb-24 relative z-10">
                    <div className="text-center mb-10">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#996515] font-bold mb-2">
                            Questions fréquentes
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-serif text-[#111111]">
                            Tout savoir sur nos prestations
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {SERVICES_FAQ.map((item, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden transition-colors hover:border-[#D4AF37]/50"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
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
                                                    : "bg-[#FAF8F5] text-neutral-600 border border-[#E8E2D5]"
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
                                            <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-t border-[#FAF8F5]">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 5. BOUTON PRINCIPAL DE CONVERSION MAJEURE (FIN DE PARCOURS)    */}
                {/* ============================================================== */}
                <section className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E8E2D5] shadow-sm space-y-6">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#996515] font-bold">
                            Liège • Saint-Georges-sur-Meuse • Huy • Waremme • Grâce-Hollogne
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] leading-tight">
                            Prêt à organiser votre réception ?
                        </h2>
                        <p className="text-neutral-600 font-light text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                            Que vous ayez besoin d&apos;un buffet convivial, d&apos;un service de mariage complet ou de notre formule Bar &amp; Brasseur, nous vous répondons sous 24h.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/contact?type=services"
                                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1A1A1A] rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Demander une proposition personnalisée →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

// --- FIL CONDUCTEUR EN ARRIÈRE-PLAN (OPACITÉ DOUCE opacity-20) ---
function ServiceThread() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });
    const pathLength = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

    return (
        <div
            ref={ref}
            className="absolute inset-0 z-0 pointer-events-none hidden md:block opacity-20"
            aria-hidden="true"
        >
            <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 300"
            >
                <motion.path
                    d="M 50 0 
                       C 50 30, 35 45, 35 80 
                       C 35 115, 65 130, 65 165
                       C 65 200, 35 220, 35 255
                       C 35 280, 50 290, 50 300"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="0.45"
                    style={{ pathLength }}
                />
            </svg>
        </div>
    );
}
