"use client";

import Image from "next/image";

export interface PartnerItem {
  name: string;
  href: string;
  logo: string;
  alt: string;
}

export const PARTNERS: PartnerItem[] = [
  {
    name: "Spaces",
    href: "https://www.spacesworks.com",
    logo: "/images/partenaires/spaces.png",
    alt: "Spaces - Partenaire Traiteur Compère",
  },
  {
    name: "Orthodyne",
    href: "https://www.orthodyne.be",
    logo: "/images/partenaires/orthodyne.png",
    alt: "Orthodyne - Partenaire Traiteur Compère",
  },
  {
    name: "Inductotherm",
    href: "https://www.inductotherm.com",
    logo: "/images/partenaires/inductotherm.png",
    alt: "Inductotherm - Partenaire Traiteur Compère",
  },
  {
    name: "AKT for Wallonia",
    href: "https://www.akt-cci.be",
    logo: "/images/partenaires/akt-for-wallonia.png",
    alt: "AKT for Wallonia - Partenaire Traiteur Compère",
  },
  {
    name: "Commune de Saint-Georges-sur-Meuse",
    href: "https://www.saint-georges-sur-meuse.be",
    logo: "/images/partenaires/commune-saint-georges.png",
    alt: "Commune de Saint-Georges-sur-Meuse - Partenaire Traiteur Compère",
  },
  {
    name: "Justice de Paix de Grâce-Hollogne",
    href: "https://www.cours-tribunaux.be",
    logo: "/images/partenaires/justice-de-paix-grace-hollogne.png",
    alt: "Justice de Paix de Grâce-Hollogne - Partenaire Traiteur Compère",
  },
  {
    name: "Foot Stockay (R.R.F.C.)",
    href: "https://www.rrfcstockaywarfusee.be",
    logo: "/images/partenaires/foot-stockay.png",
    alt: "R.R.F.C. Stockay-Warfusée - Partenaire Traiteur Compère",
  },
  {
    name: "HEL",
    href: "https://www.hel.be",
    logo: "/images/partenaires/hel-liege.png",
    alt: "HEL Haute École de Liège - Partenaire Traiteur Compère",
  },
  {
    name: "Comité de quartier de Saint-Georges",
    href: "https://www.saint-georges-sur-meuse.be",
    logo: "/images/partenaires/comite-quartier-saint-georges.png",
    alt: "Comité de quartier de Saint-Georges - Partenaire Traiteur Compère",
  },
  {
    name: "Banque Alimentaire de Liège",
    href: "https://www.banquesalimentaires.be",
    logo: "/images/partenaires/banque-alimentaire-liege.png",
    alt: "Banque Alimentaire de Liège - Partenaire Traiteur Compère",
  },
];

export default function PartnerMarquee() {
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-3">
      {/* Fondus latéraux sur le fond ivoire #FAF8F5 pour une entrée/sortie douce */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Carrousel continu lent : 2 logos visibles sur mobile, 3 à 4 sur desktop */}
      <div className="animate-marquee items-center">
        {marqueeItems.map((partner, index) => (
          <a
            key={`${partner.name}-${index}`}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
            className="group shrink-0 w-[170px] sm:w-[220px] md:w-[270px] lg:w-[290px] px-5 sm:px-8 md:px-10 py-2 flex items-center justify-center transition-opacity duration-300"
          >
            <Image
              src={partner.logo}
              alt={partner.alt}
              width={240}
              height={90}
              className="h-11 sm:h-13 md:h-15 w-auto object-contain grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
