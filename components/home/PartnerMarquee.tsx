"use client";

import Image from "next/image";

export interface PartnerItem {
  name: string;
  href: string;
  logo: string;
  alt: string;
  sizeClass?: string;
}

export const PARTNERS: PartnerItem[] = [
  {
    name: "Spaces",
    href: "https://www.spacesworks.com/fr",
    logo: "/images/partenaires/spaces.png",
    alt: "Spaces - Partenaire Traiteur Compère",
  },
  {
    name: "Orthodyne",
    href: "https://www.orthodyne.be/",
    logo: "/images/partenaires/orthodyne.png",
    alt: "Orthodyne - Partenaire Traiteur Compère",
  },
  {
    name: "Inductotherm",
    href: "https://inductotherm.com/",
    logo: "/images/partenaires/inductotherm.png",
    alt: "Inductotherm - Partenaire Traiteur Compère",
  },
  {
    name: "AKT for Wallonia",
    href: "https://akt.be/",
    logo: "/images/partenaires/akt-for-wallonia.png",
    alt: "AKT for Wallonia - Partenaire Traiteur Compère",
  },
  {
    name: "Commune de Saint-Georges-sur-Meuse",
    href: "https://www.saint-georges-sur-meuse.be/",
    logo: "/images/partenaires/commune-saint-georges.png",
    alt: "Commune de Saint-Georges-sur-Meuse - Partenaire Traiteur Compère",
  },
  {
    name: "Justice de Paix de Grâce-Hollogne",
    href: "https://www.tribunaux-rechtbanken.be/fr/justice-de-paix-de-grace-hollogne",
    logo: "/images/partenaires/justice-de-paix-grace-hollogne.png",
    alt: "Justice de Paix de Grâce-Hollogne - Partenaire Traiteur Compère",
  },
  {
    name: "Royal Stockay Saint-Georges",
    href: "https://www.royalstockaysaintgeorges.be/",
    logo: "/images/partenaires/royal-stockay.png",
    alt: "Royal Stockay Saint-Georges S/M - Partenaire Traiteur Compère",
    sizeClass: "h-14 max-h-[58px]",
  },
  {
    name: "HEL",
    href: "https://www.hel.be/",
    logo: "/images/partenaires/hel-liege.png",
    alt: "HEL Haute École de Liège - Partenaire Traiteur Compère",
  },
  {
    name: "Comité de Quartier Saint-Georges",
    href: "https://www.facebook.com/p/Comit%C3%A9-de-quartier-de-St-Georges-Centre-61559882724122/",
    logo: "/images/partenaires/comite-quartier-saint-georges.png",
    alt: "Comité de Quartier Saint-Georges - Partenaire Traiteur Compère",
  },
  {
    name: "Banque Alimentaire de Liège",
    href: "https://www.foodbank-liege.be/",
    logo: "/images/partenaires/banque-alimentaire-liege.png",
    alt: "Banque Alimentaire de Liège - Partenaire Traiteur Compère",
  },
];

export default function PartnerMarquee() {
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-4">
      {/* Fondus latéraux sur le fond ivoire #FAF8F5 pour une entrée/sortie douce */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Carrousel continu lent : 2 logos visibles sur mobile, 3 à 4 sur desktop, en vraies couleurs */}
      <div className="animate-marquee items-center">
        {marqueeItems.map((partner, index) => (
          <a
            key={`${partner.name}-${index}`}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
            className="group shrink-0 w-[190px] sm:w-[240px] md:w-[280px] lg:w-[300px] px-5 sm:px-8 md:px-10 py-2.5 flex items-center justify-center"
          >
            <Image
              src={partner.logo}
              alt={partner.alt}
              width={260}
              height={95}
              className={`${partner.sizeClass ?? "h-12 md:h-14 max-h-[55px]"} w-auto max-w-[210px] md:max-w-[240px] object-contain opacity-100 group-hover:scale-105 transition-transform duration-300`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
