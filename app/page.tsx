import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import PartnerMarquee from "@/components/home/PartnerMarquee";
import StickyMobileBar from "@/components/home/StickyMobileBar";

export const metadata: Metadata = {
  title:
    "Traiteur Artisanal Liège, Réceptions & Menus de Fêtes 2026 | Traiteur Compère",
  description:
    "Buffets chauds et froids, viandes sélectionnées, service brasseur clé en main et Menus de Fêtes 2026 pour vos réceptions privées et d'entreprise à Liège, Saint-Georges, Huy et Waremme.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Traiteur Artisanal Liège, Réceptions & Menus de Fêtes 2026 | Traiteur Compère",
    description:
      "Buffets chauds et froids, viandes sélectionnées, service brasseur clé en main et Menus de Fêtes 2026 pour vos événements privés et d'entreprise en Wallonie.",
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
    tag: "Mariages • Anniversaires • Baptêmes",
    title: "Particuliers & Célébrations",
    lead: "Profitez de vos proches autour d'une table généreuse, livrée à domicile ou servie en salle.",
    bullets: [
      "Buffets froids, banquets chauds (2 à 5 services) et barbecues",
      "Du vin d'honneur au dessert, avec ou sans personnel de salle",
      "Location de vaisselle, verrerie et frigo bar en option",
    ],
    ctaLabel: "Explorer nos formules buffets →",
    ctaHref: "/formules",
  },
  {
    tag: "Séminaires • Banquets • Networking",
    title: "Entreprises & Collectivités",
    lead: "Une logistique ponctuelle et soignée pour vos réceptions professionnelles et repas d'équipe.",
    bullets: [
      "Cocktails dînatoires, walking dinners, pains garnis et salad bars",
      "Mise en place clé en main dans vos locaux ou en salle",
      "Facturation professionnelle HTVA claire et devis sous 24h",
    ],
    ctaLabel: "Découvrir nos services entreprises →",
    ctaHref: "/services",
  },
  {
    tag: "Noël & Nouvel An • Plats à emporter",
    title: "Fêtes & Plats Cuisinés",
    lead: "Retrouvez le goût du fait maison pour vos tables de réveillon et vos repas de la semaine.",
    bullets: [
      "Menus de réveillon 4 services (dès 49 €) et carte festive libre",
      "Zakouskis, foie gras maison, gibiers nobles et bûchettes",
      "Retrait fluide à l'atelier de Saint-Georges avec conseils du chef",
    ],
    ctaLabel: "Commander pour les fêtes →",
    ctaHref: "/menus-fetes",
  },
];

const FORMULES_PHARES = [
  {
    title: "Buffet Froid Campagnard",
    priceLabel: "dès 14 € / pers.",
    subtitle:
      "Charcuteries artisanales, pâté de campagne, salades maison et crudités fraîches.",
    image: "/images/formule-buffet-campagnard.jpg",
    imageWidth: 740,
    imageHeight: 492,
    alt: "Buffet Froid Campagnard artisanal - Traiteur Compère Liège",
    href: "/formules#buffets-froids",
  },
  {
    title: "Buffet Froid Gala",
    priceLabel: "dès 22 € / pers.",
    subtitle:
      "Foie gras mi-cuit, cascade de fruits de mer, saumon en belle-vue et salades prestige.",
    image: "/images/formule-buffet-gala.jpg",
    imageWidth: 900,
    imageHeight: 600,
    alt: "Buffet Froid Gala avec foie gras et fruits de mer - Traiteur Compère",
    href: "/formules#buffets-froids",
  },
  {
    title: "Formule Barbecue Composé",
    priceLabel: "dès 21 € / pers.",
    subtitle:
      "2 entrées au choix, 2 viandes grillées et accompagnements chauds et froids à volonté.",
    image: "/images/formule-barbecue-compose.jpg",
    imageWidth: 900,
    imageHeight: 600,
    alt: "Formule Barbecue Composé et grillades artisanales - Traiteur Compère",
    href: "/formules#bbq",
  },
  {
    title: "Spécialités Chaudes & Événements",
    priceLabel: "2 à 5 services",
    subtitle:
      "Buffets chauds mijotés, réceptions de mariage, zakouskis et formules collectivités.",
    image: "/images/formule-specialites-chaudes.jpg",
    imageWidth: 900,
    imageHeight: 600,
    alt: "Buffet chaud traiteur pour réceptions et mariages - Traiteur Compère",
    href: "/formules#buffets-chauds",
  },
];

const GARANTIES_BRASSEUR = [
  {
    title: "Mise à disposition de frigos vitrés professionnels",
    text: "directement sur votre lieu de réception.",
  },
  {
    title: "Large sélection de fûts, bières régionales, softs, vins et crémants",
    text: "calibrés selon votre nombre d'invités.",
  },
  {
    title: "Facturation au réel & reprise des invendus :",
    text: "les fûts et vidanges non entamés sont entièrement repris, zéro gaspillage.",
  },
  {
    title: "Équipe de barmans et service en salle",
    text: "disponibles sur simple demande pour orchestrer votre soirée.",
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
      {/* BLOC 1 : HERO HEADER ÉPURÉ À DOUBLE INTENTION                     */}
      {/* ================================================================= */}
      <section
        id="hero-section"
        className="relative w-full min-h-[620px] md:min-h-[86vh] flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-36 md:pb-24"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-traiteur.png"
            alt="Buffet traiteur artisanal et réceptions sur mesure à Liège et en Wallonie — Maison Compère"
            fill
            priority={true}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white leading-[1.15] tracking-tight mb-5 drop-shadow-md max-w-3xl">
            Traiteur artisanal pour vos réceptions &amp; vos fêtes.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-100 font-light leading-relaxed max-w-2xl mb-10 drop-shadow-xs">
            Buffets chauds et froids, viandes sélectionnées et logistique
            complète pour vos événements privés, d’entreprise et vos tables de
            fin d&apos;année.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/menus-fetes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#e0bc42] text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Découvrir les Menus de Fêtes 2026 →</span>
            </Link>

            <Link
              href="/contact?type=devis"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full border border-[#D4AF37]/85 bg-black/30 hover:bg-[#D4AF37] text-white hover:text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-xs transition-all duration-300"
            >
              <span>Demander un Devis Réception</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOC 2 : BANDEAU PARTENAIRES EN COULEUR & TAILLE VALORISANTE      */}
      {/* ================================================================= */}
      <section
        aria-label="Références et partenaires"
        className="relative overflow-hidden bg-[#FAF8F5] pt-14 pb-12 md:pt-18 md:pb-14 px-4 sm:px-6"
      >
        {/* Lueur radiale champagne diffuse (7 %) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.07)_0%,_transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center mb-7">
            <h2 className="text-xs sm:text-sm font-sans uppercase tracking-[0.2em] text-neutral-600 font-semibold">
              Ils nous font confiance pour leurs réceptions &amp; événements
            </h2>
            <span className="hidden sm:inline text-[#D4AF37]/60">•</span>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#996515] hover:text-[#111111] font-medium transition-colors"
            >
              <span>★★★★★ 5,0/5 sur Google</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <PartnerMarquee />
        </div>
      </section>

      {/* Séparateur horizontal doré satiné */}
      <div
        className="h-[1px] w-full max-w-5xl mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* BLOC 3 : L'AIGUILLAGE EXPRESS (3 PORTES D'ENTRÉE AÉRÉES)          */}
      {/* ================================================================= */}
      <section
        aria-labelledby="univers-heading"
        className="relative overflow-hidden bg-[#FAF8F5] py-20 md:py-28 px-4 sm:px-6"
      >
        {/* Mesh / Radial Glow ambre doux sur le côté droit */}
        <div
          className="pointer-events-none absolute -top-24 right-0 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.07)_0%,_transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
              À chaque occasion sa formule
            </span>
            <h2
              id="univers-heading"
              className="text-3xl sm:text-4xl font-serif text-[#111111]"
            >
              Quelle réception préparez-vous ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5]">
            {PORTES_ENTREE.map((item) => (
              <article
                key={item.title}
                className="py-8 md:py-2 md:px-8 lg:px-10 first:pt-0 last:pb-0 md:first:pl-2 md:last:pr-2 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-[1.5px] bg-[#D4AF37] mb-4 group-hover:w-14 transition-all duration-300" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#996515] mb-2">
                    {item.tag}
                  </p>
                  <h3 className="text-2xl font-serif text-[#111111] mb-3 group-hover:text-[#996515] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed mb-5">
                    {item.lead}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {item.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 leading-snug"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href={item.ctaHref}
                    className="inline-flex items-center text-sm font-bold text-[#111111] hover:text-[#996515] border-b border-[#D4AF37] pb-1 transition-colors"
                  >
                    <span>{item.ctaLabel}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Séparateur horizontal doré satiné */}
      <div
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* BLOC 4 : FOCUS SAISONNALITÉ — MENUS DE FÊTES 2026 (ZONE BLANC PUR)*/}
      {/* ================================================================= */}
      <section
        aria-labelledby="fetes-2026-heading"
        className="relative overflow-hidden bg-white py-20 md:py-28 px-4 sm:px-6"
      >
        {/* Dégradés d'ambiance Mesh / Radial Glows (champagne & ambre 6-8 %) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(212,175,55,0.08)_0%,_transparent_60%),radial-gradient(ellipse_at_85%_20%,_rgba(180,130,40,0.05)_0%,_transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visuel festif */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md">
                <Image
                  src="/images/menus-fetes-2026.jpg"
                  alt="Zakouskis artisanaux, foie gras maison et menus de réveillon 2026 - Traiteur Compère"
                  width={850}
                  height={580}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texte éditorial sur blanc pur et halo chaud */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#996515]">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span>Saison Festive • Noël &amp; Nouvel An 2026</span>
              </div>

              <h2
                id="fetes-2026-heading"
                className="text-3xl sm:text-4xl font-serif text-[#111111] leading-tight"
              >
                Menus de Fêtes 2026 : Vos Réveillons Prêts à Déguster.
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-2xl border-l-2 border-[#D4AF37] pl-4">
                3 formules de réveillon 4 services (49 €, 59 €, 69 €) et une
                carte libre : zakouskis froids artisanaux, foie gras de canard
                mi-cuit maison, gibiers nobles et bûchettes de chez La Pavée.
              </p>

              {/* Repères pratiques en ligne */}
              <div className="flex flex-wrap gap-y-3 gap-x-8 pt-2 text-xs sm:text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#D4AF37] shrink-0" />
                  <span>
                    <strong className="font-semibold text-[#111111]">
                      Atelier :
                    </strong>{" "}
                    Rue Potay 3, Saint-Georges
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#D4AF37] shrink-0" />
                  <span>
                    <strong className="font-semibold text-[#111111]">
                      Retrait :
                    </strong>{" "}
                    Veille (14h–18h) ou Jour J (8h–12h)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#D4AF37] shrink-0" />
                  <span>
                    <strong className="font-semibold text-[#111111]">
                      Réservation :
                    </strong>{" "}
                    Jusqu&apos;à J-4 (-5 % avant le 1er déc.)
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/menus-fetes"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all duration-300"
                >
                  <span>
                    Accéder au catalogue festif &amp; Commander en ligne →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur horizontal doré satiné */}
      <div
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* BLOC 5 : NOS FORMULES RÉCEPTIONS PHARES (SUR FOND IVOIRE #FAF8F5) */}
      {/* ================================================================= */}
      <section
        aria-labelledby="formules-phares-heading"
        className="relative overflow-hidden bg-[#FAF8F5] py-20 md:py-28 px-4 sm:px-6"
      >
        {/* Halo radial champagne diffus au centre */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(212,175,55,0.06)_0%,_transparent_65%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
              La Carte des Réceptions
            </span>
            <h2
              id="formules-phares-heading"
              className="text-3xl sm:text-4xl font-serif text-[#111111] mb-3"
            >
              Nos Formules Réceptions Phares
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light">
              Des préparations fraîches et généreuses, façonnées dans notre
              atelier pour toutes vos envies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-9">
            {FORMULES_PHARES.map((item) => (
              <article
                key={item.title}
                className="group flex flex-col justify-between"
              >
                <div>
                  <Link
                    href={item.href}
                    className="block relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 shadow-xs"
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={item.imageWidth}
                      height={item.imageHeight}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>

                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-serif text-lg font-bold text-[#111111] group-hover:text-[#996515] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-bold text-[#996515] shrink-0">
                      {item.priceLabel}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-3 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                <div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-neutral-700 group-hover:text-[#996515] transition-colors"
                  >
                    <span>Voir la composition détaillée →</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Séparateur horizontal doré satiné */}
      <div
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* BLOC 6 : LA LOGISTIQUE CLÉ EN MAIN & SERVICE BRASSEUR             */}
      {/* ================================================================= */}
      <section
        aria-labelledby="logistique-brasseur-heading"
        className="relative overflow-hidden bg-gradient-to-b from-white via-white to-[#FAF8F5] py-20 md:py-28 px-4 sm:px-6"
      >
        {/* Lueur chaude diffuse ambre/champagne (7 %) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,_rgba(212,175,55,0.07)_0%,_transparent_65%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Colonne gauche : Visuel bar événementiel */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[4/3] lg:aspect-[4/4.2]">
                <Image
                  src="/images/logistique-service-brasseur.jpg"
                  alt="Bar événementiel avec verrerie étincelante et service brasseur clé en main - Traiteur Compère"
                  width={768}
                  height={1024}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Colonne droite : Texte ouvert */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                  Organisation &amp; Service Brasseur
                </span>
                <h2
                  id="logistique-brasseur-heading"
                  className="text-3xl sm:text-4xl font-serif text-[#111111] leading-snug mb-4"
                >
                  Cuisine &amp; Bar : Une logistique zéro tracas pour vos
                  événements.
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                  Un seul interlocuteur pour orchestrer votre repas, équiper
                  votre salle et gérer l&apos;ensemble de vos boissons sans
                  aucune perte.
                </p>
              </div>

              <ul className="space-y-3.5 pt-1">
                {GARANTIES_BRASSEUR.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm sm:text-base text-neutral-700 leading-relaxed font-light"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                    <span>
                      <strong className="font-semibold text-[#111111]">
                        {item.title}
                      </strong>{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/services#brasseur"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#D4AF37] text-[#1A1A1A] hover:bg-[#D4AF37] hover:text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-300"
                >
                  <span>En savoir plus sur le service boissons →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur horizontal doré satiné */}
      <div
        className="h-[1px] w-full max-w-5xl mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* TRANSITION STRATÉGIQUE AVEC FILIGRANE DU BLASON MAISON COMPÈRE    */}
      {/* BLOC 7 (HÉRITAGE 1821) + BLOC 8 (CONTACT FINAL)                   */}
      {/* ================================================================= */}
      <div className="relative overflow-hidden bg-[#FAF8F5]">
        {/* Lueurs chaudes diffuses (Mesh / Radial Glows champagne & ambre 7-9 %) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(212,175,55,0.08)_0%,_transparent_65%),radial-gradient(ellipse_at_50%_90%,_rgba(180,130,40,0.06)_0%,_transparent_60%)]"
          aria-hidden="true"
        />

        {/* Filigrane géant de l'arabesque / blason Maison Compère (opacité ~2.8 %) */}
        <div
          className="pointer-events-none select-none absolute top-8 left-1/2 -translate-x-1/2 w-[580px] sm:w-[760px] md:w-[940px] flex justify-center z-0"
          aria-hidden="true"
        >
          <Image
            src="/images/Logo_traiteur.png"
            alt=""
            width={940}
            height={496}
            className="w-full h-auto object-contain opacity-[0.028]"
          />
        </div>

        {/* =============================================================== */}
        {/* BLOC 7 : L'HÉRITAGE ARTISANAL — MAISON COMPÈRE (BICENTENAIRE)   */}
        {/* =============================================================== */}
        <section
          aria-labelledby="heritage-heading"
          className="relative z-10 py-20 md:py-28 px-4 sm:px-6 max-w-5xl mx-auto text-center"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
            Savoir-Faire Familial • Saint-Georges-sur-Meuse
          </span>
          <h2
            id="heritage-heading"
            className="text-3xl sm:text-4xl font-serif text-[#111111] mb-4"
          >
            L&apos;Héritage Artisanal de la Maison Compère
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto mb-6">
            Née d&apos;une tradition bouchère fondée en 1821, notre Maison
            perpétue dans son atelier de Saint-Georges-sur-Meuse une cuisine
            100 % faite maison, mijotée sans conservateurs industriels à partir
            de viandes nobles locales.
          </p>
          <div className="mb-14">
            <Link
              href="/a-propos"
              className="inline-flex items-center text-xs sm:text-sm font-bold text-[#996515] hover:text-[#111111] border-b border-[#D4AF37]/60 pb-0.5 transition-colors"
            >
              <span>Découvrir l&apos;histoire de notre Maison →</span>
            </Link>
          </div>

          {/* 3 Piliers encadrés par de fins séparateurs dorés satinés */}
          <div
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D5] py-10">
            {PILIERS_HERITAGE.map((stat) => (
              <div key={stat.value} className="py-4 sm:py-0 px-4">
                <p className="text-4xl sm:text-5xl font-serif text-[#111111] mb-1.5">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
            aria-hidden="true"
          />
        </section>

        {/* =============================================================== */}
        {/* BLOC 8 : BANNIÈRE FINALE & CONTACT                              */}
        {/* =============================================================== */}
        <section
          aria-labelledby="contact-cta-heading"
          className="relative z-10 pt-4 pb-24 md:pb-32 px-4 sm:px-6 max-w-3xl mx-auto text-center"
        >
          <h2
            id="contact-cta-heading"
            className="text-3xl sm:text-5xl font-serif text-[#111111] mb-4"
          >
            Vous avez un événement à organiser ?
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed mb-8">
            Réception privée, banquet d&apos;entreprise ou commande festive :
            demandez votre devis en ligne ou appelez directement notre atelier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all duration-300"
            >
              <span>Demander un devis personnalisé</span>
            </Link>

            <a
              href="tel:+32468385082"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#D4AF37] text-[#111111] hover:bg-[#D4AF37]/15 font-bold text-xs sm:text-sm tracking-wide transition-colors"
            >
              <Phone size={16} className="text-[#996515]" />
              <span>+32 468 38 50 82</span>
            </a>
          </div>

          <p className="text-xs text-neutral-500 font-light max-w-xl mx-auto">
            Livraisons et réceptions à Liège, Saint-Georges-sur-Meuse, Huy,
            Waremme, Grâce-Hollogne et dans toute la Wallonie.
          </p>
        </section>
      </div>

      {/* ================================================================= */}
      {/* COMPOSANT PERSISTANT : STICKY MOBILE ACTION BAR (< 768px)         */}
      {/* ================================================================= */}
      <StickyMobileBar />
    </main>
  );
}
