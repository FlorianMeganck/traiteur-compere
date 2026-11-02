"use client";

import Image from "next/image";

export interface PartnerItem {
  name: string;
  sector: string;
  href: string;
  logo: string;
  alt: string;
}

export const PARTNERS: PartnerItem[] = [
  {
    name: "Spaces",
    sector: "Coworking & Espaces d'affaires",
    href: "https://www.spacesworks.com",
    logo: "/images/partenaires/spaces.png",
    alt: "Logo Spaces Coworking - Partenaire B2B Traiteur Compère à Liège",
  },
  {
    name: "Orthodyne",
    sector: "Haute technologie",
    href: "https://www.orthodyne.be",
    logo: "/images/partenaires/orthodyne.png",
    alt: "Logo Orthodyne Group - Partenaire entreprise Traiteur Compère",
  },
  {
    name: "Inductotherm",
    sector: "Ingénierie industrielle",
    href: "https://www.inductotherm.com",
    logo: "/images/partenaires/inductotherm.png",
    alt: "Logo Inductotherm Group Belgium - Référence industrielle Traiteur Compère",
  },
  {
    name: "AKT for Wallonia",
    sector: "Chambre de commerce & Réseau économique",
    href: "https://www.akt-cci.be",
    logo: "/images/partenaires/akt-for-wallonia.png",
    alt: "Logo AKT for Wallonia Chambre de Commerce - Partenaire institutionnel Traiteur Compère",
  },
  {
    name: "Commune de Saint-Georges-sur-Meuse",
    sector: "Administration publique",
    href: "https://www.saint-georges-sur-meuse.be",
    logo: "/images/partenaires/commune-saint-georges.png",
    alt: "Logo Commune de Saint-Georges-sur-Meuse - Partenaire public Traiteur Compère",
  },
  {
    name: "Justice de Paix de Grâce-Hollogne",
    sector: "Institution judiciaire",
    href: "https://www.cours-tribunaux.be",
    logo: "/images/partenaires/justice-de-paix-grace-hollogne.png",
    alt: "Logo Justice de Paix de Grâce-Hollogne Cours et Tribunaux - Référence Traiteur Compère",
  },
  {
    name: "Foot Stockay (R.R.F.C.)",
    sector: "Club sportif",
    href: "https://www.rrfcstockaywarfusee.be",
    logo: "/images/partenaires/foot-stockay.png",
    alt: "Logo R.R.F.C. Stockay-Warfusée - Club sportif partenaire Traiteur Compère",
  },
  {
    name: "HEL",
    sector: "Haute École & Enseignement",
    href: "https://www.hel.be",
    logo: "/images/partenaires/hel-liege.png",
    alt: "Logo HEL Haute École de Liège - Partenaire enseignement Traiteur Compère",
  },
  {
    name: "Comité de quartier de Saint-Georges",
    sector: "Vie associative locale",
    href: "https://www.saint-georges-sur-meuse.be",
    logo: "/images/partenaires/comite-quartier-saint-georges.png",
    alt: "Logo Comité de quartier de Saint-Georges-sur-Meuse - Partenaire associatif Traiteur Compère",
  },
  {
    name: "Banque Alimentaire de Liège",
    sector: "Solidarité & Action locale",
    href: "https://www.banquesalimentaires.be",
    logo: "/images/partenaires/banque-alimentaire-liege.png",
    alt: "Logo Banque Alimentaire de Liège - Partenaire solidaire Traiteur Compère",
  },
];

export default function PartnerMarquee() {
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <div className="w-full">
      {/* Desktop : Grille 5 colonnes x 2 lignes */}
      <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-5">
        {PARTNERS.map((partner) => (
          <a
            key={partner.name}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${partner.name} — ${partner.sector}`}
            className="group bg-white rounded-2xl border border-[#E8E2D5] px-4 py-4 flex flex-col items-center justify-between hover:border-[#D4AF37]/60 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="h-16 w-full flex items-center justify-center">
              <Image
                src={partner.logo}
                alt={partner.alt}
                width={220}
                height={82}
                className="max-h-14 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
            <div className="mt-2.5 text-center border-t border-[#FAF8F5] pt-2 w-full">
              <p className="text-xs font-serif font-bold text-[#1A1A1A] group-hover:text-[#996515] transition-colors line-clamp-1">
                {partner.name}
              </p>
              <p className="text-[11px] text-neutral-500 font-light line-clamp-1">
                {partner.sector}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Mobile : Infinite Marquee CSS */}
      <div className="md:hidden relative overflow-hidden py-2 -mx-4">
        {/* Dégradés latéraux doux */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10"
          aria-hidden="true"
        />

        <div className="animate-marquee gap-3.5 px-2">
          {marqueeItems.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 w-48 bg-white rounded-2xl border border-[#E8E2D5] p-3.5 flex flex-col items-center justify-between shadow-2xs active:scale-95 transition-all duration-300"
            >
              <div className="h-14 w-full flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  width={180}
                  height={68}
                  className="max-h-12 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <div className="mt-2 text-center border-t border-[#FAF8F5] pt-1.5 w-full">
                <p className="text-[11px] font-serif font-bold text-[#1A1A1A] truncate">
                  {partner.name}
                </p>
                <p className="text-[10px] text-neutral-500 font-light truncate">
                  {partner.sector}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
