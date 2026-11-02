import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Wine,
  UtensilsCrossed,
  Building2,
  PartyPopper,
  ExternalLink,
} from "lucide-react";
import PartnerMarquee from "@/components/home/PartnerMarquee";
import StickyMobileBar from "@/components/home/StickyMobileBar";
import GoldenThread from "@/components/home/GoldenThread";

export const metadata: Metadata = {
  title:
    "Traiteur Artisanal Liège, Réceptions & Menus de Fêtes 2026 | Traiteur Compère",
  description:
    "Cuisine faite maison, buffets d'exception, service brasseur clé en main et Menus de Fêtes 2026 pour réceptions privées et entreprises à Liège, Saint-Georges, Huy et Waremme.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Traiteur Artisanal Liège, Réceptions & Menus de Fêtes 2026 | Traiteur Compère",
    description:
      "Cuisine faite maison, buffets d'exception, service brasseur clé en main et Menus de Fêtes 2026 pour réceptions privées et entreprises en Wallonie.",
    url: "https://www.traiteur-compere.be",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Traiteur Compère - Traiteur Artisanal & Événements à Liège",
      },
    ],
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CateringService"],
  "@id": "https://www.traiteur-compere.be/#localbusiness",
  name: "Traiteur Compère",
  legalName: "Maison Compère SRL",
  url: "https://www.traiteur-compere.be",
  telephone: "+32 468 38 50 82",
  email: "contact@traiteur-compere.be",
  image: "https://www.traiteur-compere.be/images/hero-traiteur.png",
  logo: "https://www.traiteur-compere.be/images/logo-2.png",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Potay 3",
    addressLocality: "Saint-Georges-sur-Meuse",
    postalCode: "4470",
    addressRegion: "Liège",
    addressCountry: "BE",
  },
  areaServed: [
    "Liège",
    "Saint-Georges-sur-Meuse",
    "Huy",
    "Waremme",
    "Grâce-Hollogne",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "48",
  },
};

const PORTES_ENTREE = [
  {
    icon: PartyPopper,
    tag: "Mariages, anniversaires, baptêmes",
    title: "Particuliers & Célébrations",
    lead: "Profitez pleinement de vos convives grâce à une cuisine généreuse livrée ou servie sur place.",
    bullets: [
      "Buffets froids, banquets chauds (2 à 5 services) et barbecues nobles",
      "Du vin d'honneur au dessert, en livraison ou avec brigade en salle",
      "Location de vaisselle, verrerie et frigo bar disponible en option",
    ],
    ctaLabel: "Explorer nos formules buffets →",
    ctaHref: "/formules",
  },
  {
    icon: Building2,
    tag: "Séminaires, banquets, networking",
    title: "Entreprises & Collectivités",
    lead: "Une organisation ponctuelle et soignée pour vos réceptions professionnelles et événements B2B.",
    bullets: [
      "Cocktails dînatoires, walking dinners, pains garnis et salad bars",
      "Installation clé en main dans vos locaux ou sur votre lieu d'événement",
      "Facturation professionnelle HTVA claire et devis rapide sous 24h",
    ],
    ctaLabel: "Découvrir nos services entreprises →",
    ctaHref: "/services",
  },
  {
    icon: UtensilsCrossed,
    tag: "Réveillons Noël/Nouvel An, plats à emporter",
    title: "Fêtes & Plats Cuisinés",
    lead: "Sublimez vos tables de fin d'année et vos repas hebdomadaires sans passer la journée aux fourneaux.",
    bullets: [
      "Menus de réveillon 4 services (dès 49 €) et carte festive à composer",
      "Zakouskis, foie gras maison, gibiers nobles et bûchettes artisanales",
      "Retrait fluide à l'atelier de Saint-Georges avec conseils de réchauffage",
    ],
    ctaLabel: "Commander pour les fêtes →",
    ctaHref: "/menus-fetes",
  },
];

const FORMULES_PHARES = [
  {
    title: "Buffet Froid Campagnard",
    priceLabel: "dès 14 € / pers.",
    subtitle: "Charcuteries artisanales, pâté de campagne, salades maison et crudités fraîches.",
    image: "/images/formule-buffet-campagnard.jpg",
    imageWidth: 740,
    imageHeight: 492,
    alt: "Buffet Froid Campagnard artisanal - Traiteur Compère Liège",
    href: "/formules#buffets-froids",
  },
  {
    title: "Buffet Froid Gala",
    priceLabel: "dès 22 € / pers.",
    subtitle: "Foie gras mi-cuit, cascade de fruits de mer, saumon en belle-vue et salades prestige.",
    image: "/images/formule-buffet-gala.jpg",
    imageWidth: 900,
    imageHeight: 600,
    alt: "Buffet Froid Gala avec foie gras et fruits de mer - Traiteur Compère",
    href: "/formules#buffets-froids",
  },
  {
    title: "Formule Barbecue Composé",
    priceLabel: "dès 21 € / pers.",
    subtitle: "Menu complet avec 2 entrées au choix, 2 viandes grillées et accompagnements à volonté.",
    image: "/images/formule-barbecue-compose.jpg",
    imageWidth: 900,
    imageHeight: 600,
    alt: "Formule Barbecue Composé et grillades artisanales - Traiteur Compère",
    href: "/formules#bbq",
  },
  {
    title: "Spécialités Chaudes & Événements",
    priceLabel: "2 à 5 services sur mesure",
    subtitle: "Buffets chauds mijotés, réceptions de mariage, pains surpris et formules collectivités.",
    image: "/images/formule-specialites-chaudes.jpg",
    imageWidth: 900,
    imageHeight: 600,
    alt: "Buffet chaud traiteur en chafing dish pour réceptions et mariages - Traiteur Compère",
    href: "/formules#buffets-chauds",
  },
];

const GARANTIES_BRASSEUR = [
  {
    title: "Mise à disposition de frigos vitrés professionnels",
    text: "Livrés et installés directement sur votre lieu de réception pour servir chaque boisson à température idéale.",
  },
  {
    title: "Large sélection de fûts, bières régionales, softs, vins et crémants",
    text: "Une carte complète calibrée avec marge de sécurité pour accompagner votre vin d'honneur et votre soirée.",
  },
  {
    title: "Facturation au réel & reprise des invendus :",
    text: "Les fûts et vidanges non entamés sont entièrement repris, zéro gaspillage.",
    highlight: true,
  },
  {
    title: "Équipe de barmans et service en salle sur simple demande",
    text: "Personnel souriant et expérimenté disponible pour assurer le service au plateau et la tenue du bar.",
  },
];

const PILIERS_HERITAGE = [
  {
    value: "1821",
    label: "Date d'origine de la tradition artisanale",
  },
  {
    value: "100%",
    label: "Fait maison dans notre atelier",
  },
  {
    value: "5.0 ★",
    label: "Satisfaction client Google Reviews",
  },
];

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Traiteur+Comp%C3%A8re,+Rue+Potay+3,+4470+Saint-Georges-sur-Meuse";

export default function Home() {
  return (
    <main className="bg-[#FAF8F5] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden pb-16 md:pb-0">
      {/* Données structurées SEO JSON-LD LocalBusiness / CateringService */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* ================================================================= */}
      {/* BLOC 1 : HERO HEADER À DOUBLE INTENTION                           */}
      {/* ================================================================= */}
      <section
        id="hero-section"
        className="relative w-full min-h-[640px] md:min-h-[88vh] flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-36 md:pb-24"
      >
        {/* Visuel plein écran avec priority={true} pour sécuriser le LCP */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-traiteur.png"
            alt="Buffet traiteur artisanal et réceptions sur mesure à Liège et en Wallonie — Maison Compère"
            fill
            priority={true}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
        </div>

        {/* Contenu centré */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          {/* Badge supérieur Google Reviews */}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-xs border border-[#D4AF37]/50 text-xs sm:text-sm text-white font-medium tracking-wide mb-6 transition-colors"
          >
            <span className="text-[#D4AF37] tracking-tighter font-bold">
              ★★★★★
            </span>
            <span>
              <strong>5,0/5</strong> sur Google Reviews • Traiteur artisanal
              Liège &amp; Province
            </span>
          </a>

          {/* Titre principal (H1) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white leading-[1.15] tracking-tight mb-5 drop-shadow-md max-w-3xl">
            L&apos;Art Culinaire Artisanal pour Vos Réceptions &amp; Vos Fêtes.
          </h1>

          {/* Sous-titre concis (2-3 lignes max) */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-200 font-light leading-relaxed max-w-2xl mb-9 drop-shadow-xs">
            Cuisine faite maison, buffets d&apos;exception et logistique
            complète pour réceptions privées, banquets d&apos;entreprise et
            tables de réveillon.
          </p>

          {/* Double CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            {/* CTA Primaire (Fêtes) : Bouton doré satiné */}
            <Link
              href="/menus-fetes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#D4AF37] hover:bg-[#e0bc42] text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Découvrir les Menus de Fêtes 2026 →</span>
            </Link>

            {/* CTA Secondaire (Événements) : Bouton transparent avec fine bordure dorée */}
            <Link
              href="/contact?type=devis"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-full border border-[#D4AF37]/80 bg-black/35 hover:bg-[#D4AF37] text-white hover:text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-xs transition-all duration-300"
            >
              <span>Demander un Devis Réception</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Conteneur principal avec Fil conducteur doré doux en arrière-plan */}
      <div className="relative">
        <GoldenThread />

        {/* =============================================================== */}
        {/* BLOC 2 : PREUVE SOCIALE & BANDEAU « ILS NOUS ONT FAIT CONFIANCE » */}
        {/* =============================================================== */}
        <section
          aria-labelledby="partenaires-heading"
          className="relative z-10 py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#E8E2D5]"
        >
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
              Références Entreprises &amp; Institutions
            </span>
            <h2
              id="partenaires-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#111111] mb-3"
            >
              Partenaire traiteur des institutions, entreprises et acteurs de
              notre région.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light flex flex-wrap items-center justify-center gap-2">
              <span>
                Note moyenne de{" "}
                <strong className="font-semibold text-[#111111]">
                  5,0/5 ★★★★★
                </strong>{" "}
                sur Google
              </span>
              <span className="text-neutral-300">•</span>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#996515] hover:text-[#111111] font-medium underline decoration-[#D4AF37]/60 underline-offset-4 transition-colors"
              >
                <span>Consulter les avis clients vérifiés</span>
                <ExternalLink size={13} />
              </a>
            </p>
          </div>

          <PartnerMarquee />
        </section>

        {/* =============================================================== */}
        {/* BLOC 3 : L'AIGUILLAGE EXPRESS (3 PORTES D'ENTRÉE)               */}
        {/* =============================================================== */}
        <section
          aria-labelledby="univers-heading"
          className="relative z-10 py-16 md:py-22 px-4 sm:px-6 max-w-7xl mx-auto"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
              3 Univers Sur Mesure
            </span>
            <h2
              id="univers-heading"
              className="text-2xl sm:text-4xl font-serif text-[#111111] mb-3"
            >
              Quelle réception préparez-vous ?
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light">
              Accédez directement à l&apos;offre adaptée à vos convives, votre
              format et votre calendrier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTES_ENTREE.map((card) => {
              const IconComponent = card.icon;
              return (
                <article
                  key={card.title}
                  className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-[#D4AF37]/60 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#996515] bg-[#FAF6EB] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                        {card.tag}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5] flex items-center justify-center text-[#996515] shrink-0">
                        <IconComponent size={19} />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#111111] mb-2.5">
                      {card.title}
                    </h3>

                    <p className="text-sm text-neutral-600 font-light leading-relaxed mb-5 line-clamp-2">
                      {card.lead}
                    </p>

                    <ul className="space-y-2.5 border-t border-[#FAF8F5] pt-4 mb-6">
                      {card.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 leading-snug"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D5]/60">
                    <Link
                      href={card.ctaHref}
                      className="inline-flex items-center text-sm font-bold text-[#996515] hover:text-[#111111] transition-colors"
                    >
                      <span>{card.ctaLabel}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* =============================================================== */}
        {/* BLOC 4 : FOCUS SAISONNALITÉ — MENUS DE FÊTES 2026               */}
        {/* =============================================================== */}
        <section
          aria-labelledby="fetes-2026-heading"
          className="relative z-10 py-6 md:py-10 px-4 sm:px-6 max-w-7xl mx-auto"
        >
          <div className="bg-[#121212] text-white rounded-3xl border border-[#D4AF37]/40 overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Contenu textuel (7 colonnes) */}
              <div className="lg:col-span-7 p-7 sm:p-10 md:p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} />
                  <span>Édition Limitée • Noël &amp; Nouvel An 2026</span>
                </div>

                <h2
                  id="fetes-2026-heading"
                  className="text-2xl sm:text-4xl font-serif text-white leading-tight"
                >
                  Menus de Fêtes 2026 : Vos Réveillons Gastronomiques Prêts à
                  Déguster.
                </h2>

                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl">
                  Découvrez nos 3 formules de réveillon 4 services (49 €, 59 €,
                  69 €) et notre carte libre : zakouskis froids artisanaux, foie
                  gras de canard mi-cuit maison, gibiers nobles et bûchettes de
                  chez La Pavée.
                </p>

                {/* Informations pratiques d'enlèvement & réservation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
                    <MapPin
                      size={17}
                      className="text-[#D4AF37] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        Retrait Atelier
                      </p>
                      <p className="text-xs text-neutral-300 font-light mt-0.5">
                        Rue Potay 3, 4470 Saint-Georges
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
                    <Clock
                      size={17}
                      className="text-[#D4AF37] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        Créneaux au choix
                      </p>
                      <p className="text-xs text-neutral-300 font-light mt-0.5">
                        Veille (14h–18h) ou Jour J (8h–12h)
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
                    <Calendar
                      size={17}
                      className="text-[#D4AF37] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        Clôture à J-4
                      </p>
                      <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                        -5 % Early Bird avant le 1er déc.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/menus-fetes"
                    className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-[#D4AF37] hover:bg-[#e0bc42] text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <span>
                      Accéder au catalogue festif &amp; Commander en ligne →
                    </span>
                  </Link>
                </div>
              </div>

              {/* Visuel festif (5 colonnes) */}
              <div className="lg:col-span-5 relative h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[440px] bg-neutral-900">
                <Image
                  src="/images/menus-fetes-2026.jpg"
                  alt="Zakouskis artisanaux, foie gras maison et menus de réveillon 2026 - Traiteur Compère"
                  width={850}
                  height={580}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#121212] via-[#121212]/25 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BLOC 5 : NOS FORMULES RÉCEPTIONS PHARES                         */}
        {/* =============================================================== */}
        <section
          aria-labelledby="formules-phares-heading"
          className="relative z-10 py-16 md:py-22 px-4 sm:px-6 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                Sélection Incontournable
              </span>
              <h2
                id="formules-phares-heading"
                className="text-2xl sm:text-4xl font-serif text-[#111111]"
              >
                Nos Formules Réceptions Phares
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 font-light max-w-md">
              Des compositions généreuses élaborées dans notre atelier avec des
              produits frais et des viandes rigoureusement sélectionnées.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FORMULES_PHARES.map((item) => (
              <article
                key={item.title}
                className="group bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={item.imageWidth}
                      height={item.imageHeight}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-block bg-[#111111]/90 backdrop-blur-xs text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/40">
                        {item.priceLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 pb-4">
                    <h3 className="font-serif text-lg font-bold text-[#111111] mb-1.5 group-hover:text-[#996515] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#996515] hover:text-[#111111] transition-colors"
                  >
                    <span>Voir la composition détaillée →</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =============================================================== */}
        {/* BLOC 6 : LA LOGISTIQUE CLÉ EN MAIN & SERVICE BRASSEUR           */}
        {/* =============================================================== */}
        <section
          aria-labelledby="logistique-brasseur-heading"
          className="relative z-10 py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-10 md:p-12 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Colonne gauche : Visuel bar événementiel */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-md aspect-[4/3] lg:aspect-[4/4.3]">
                  <Image
                    src="/images/logistique-service-brasseur.jpg"
                    alt="Bar événementiel avec verrerie étincelante et service brasseur clé en main - Traiteur Compère"
                    width={768}
                    height={1024}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs text-white px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 flex items-center gap-2.5">
                    <Wine size={18} className="text-[#D4AF37] shrink-0" />
                    <span className="text-xs font-medium">
                      Formule Brasseur • Zéro perte sur les boissons non
                      entamées
                    </span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Titre + 4 garanties + CTA Ghost */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                    Organisation Complète &amp; Service Brasseur
                  </span>
                  <h2
                    id="logistique-brasseur-heading"
                    className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#111111] leading-snug mb-3"
                  >
                    Cuisine &amp; Bar : Une logistique zéro tracas pour vos
                    événements.
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                    Un seul interlocuteur pour orchestrer votre repas, équiper
                    votre salle et gérer l&apos;intégralité de vos boissons en
                    province de Liège.
                  </p>
                </div>

                {/* 4 garanties concrètes avec puces dorées */}
                <ul className="space-y-3.5">
                  {GARANTIES_BRASSEUR.map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                        item.highlight
                          ? "bg-[#FAF6EB]/80 border-[#D4AF37]/50"
                          : "bg-[#FAF8F5] border-[#E8E2D5]"
                      }`}
                    >
                      <CheckCircle2
                        size={18}
                        className="text-[#D4AF37] shrink-0 mt-0.5"
                      />
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                        <strong className="font-semibold text-[#111111]">
                          {item.title}
                        </strong>{" "}
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* CTA Ghost */}
                <div className="pt-2">
                  <Link
                    href="/services#brasseur"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#D4AF37] text-[#1A1A1A] hover:bg-[#FAF6EB] font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-200"
                  >
                    <span>En savoir plus sur le service boissons →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BLOC 7 : L'HÉRITAGE ARTISANAL — MAISON COMPÈRE (BICENTENAIRE)   */}
        {/* =============================================================== */}
        <section
          aria-labelledby="heritage-heading"
          className="relative z-10 py-14 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto"
        >
          <div className="bg-[#F4EFE6] rounded-3xl border border-[#E8E2D5] p-7 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              <div className="lg:col-span-8 space-y-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515]">
                  Savoir-Faire Familial • Saint-Georges-sur-Meuse
                </span>
                <h2
                  id="heritage-heading"
                  className="text-2xl sm:text-4xl font-serif text-[#111111]"
                >
                  L&apos;Héritage Artisanal de la Maison Compère
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 font-light leading-relaxed max-w-2xl">
                  Née d&apos;une tradition bouchère fondée en 1821, notre Maison
                  perpétue dans son atelier de Saint-Georges-sur-Meuse une
                  cuisine 100 % faite maison, mijotée sans conservateurs
                  industriels à partir de viandes nobles locales.
                </p>
                <div className="pt-1">
                  <Link
                    href="/a-propos"
                    className="inline-flex items-center text-xs sm:text-sm font-bold text-[#996515] hover:text-[#111111] underline decoration-[#D4AF37]/60 underline-offset-4 transition-colors"
                  >
                    <span>Découvrir l&apos;histoire de notre Maison →</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-sm">
                  <Image
                    src="/images/heritage-maison-compere.jpg"
                    alt="Archives historiques de la Maison Compère fondée en 1821"
                    width={600}
                    height={580}
                    className="w-full h-full object-cover grayscale sepia-[.25]"
                  />
                </div>
              </div>
            </div>

            {/* Compteurs visuels (3 piliers) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-[#E8E2D5]">
              {PILIERS_HERITAGE.map((stat) => (
                <div
                  key={stat.value}
                  className="bg-white/90 rounded-2xl border border-[#E8E2D5] p-5 text-center"
                >
                  <p className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BLOC 8 : BANNIÈRE FINALE & CONTACT                              */}
        {/* =============================================================== */}
        <section
          aria-labelledby="contact-cta-heading"
          className="relative z-10 pt-6 pb-20 md:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center"
        >
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-8 sm:p-12 md:p-14 shadow-sm space-y-6">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515]">
              Réponse Rapide &amp; Accompagnement Sur Mesure
            </span>

            <h2
              id="contact-cta-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#111111]"
            >
              Vous avez un événement à organiser ?
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
              Réception privée, banquet d&apos;entreprise ou commande festive :
              composez votre demande en ligne ou appelez directement notre
              atelier.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all duration-300"
              >
                <span>Demander un devis personnalisé</span>
              </Link>

              <a
                href="tel:+32468385082"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#D4AF37] bg-[#FAF8F5] hover:bg-[#FAF6EB] text-[#111111] font-bold text-xs sm:text-sm tracking-wide transition-colors"
              >
                <Phone size={16} className="text-[#996515]" />
                <span>+32 468 38 50 82</span>
              </a>
            </div>

            {/* Ancrage géographique local (SEO) */}
            <p className="text-xs text-neutral-500 font-light pt-4 border-t border-[#FAF8F5] max-w-2xl mx-auto">
              Livraisons et réceptions à Liège, Saint-Georges-sur-Meuse, Huy,
              Waremme, Grâce-Hollogne et dans toute la Wallonie.
            </p>
          </div>
        </section>
      </div>

      {/* ================================================================= */}
      {/* COMPOSANT PERSISTANT : STICKY MOBILE ACTION BAR (< 768px)         */}
      {/* ================================================================= */}
      <StickyMobileBar />
    </main>
  );
}
