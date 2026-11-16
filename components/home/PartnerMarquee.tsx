"use client";

export interface PartnerItem {
  nom: string;
  url: string;
  logo: string;
}

export const PARTENAIRES_CONFIANCE: PartnerItem[] = [
  {
    nom: "Spaces",
    url: "https://www.spacesworks.com/fr",
    logo: "/images/partenaires/spaces.png",
  },
  {
    nom: "Orthodyne",
    url: "https://www.orthodyne.be/",
    logo: "/images/partenaires/orthodyne.png",
  },
  {
    nom: "Inductotherm",
    url: "https://inductotherm.com/",
    logo: "/images/partenaires/inductotherm.png",
  },
  {
    nom: "AKT for Wallonia",
    url: "https://akt.be/",
    logo: "/images/partenaires/akt-for-wallonia.png",
  },
  {
    nom: "Commune de Saint-Georges-sur-Meuse",
    url: "https://www.saint-georges-sur-meuse.be/",
    logo: "/images/partenaires/commune-saint-georges.png",
  },
  {
    nom: "Justice de Paix de Grâce-Hollogne",
    url: "https://www.tribunaux-rechtbanken.be/fr/justice-de-paix-de-grace-hollogne",
    logo: "/images/partenaires/justice-de-paix-grace-hollogne.png",
  },
  {
    nom: "Royal Stockay Saint-Georges",
    url: "https://www.royalstockaysaintgeorges.be/",
    logo: "/images/partenaires/royal-stockay.png",
  },
  {
    nom: "HEL",
    url: "https://www.hel.be/",
    logo: "/images/partenaires/hel-liege.png",
  },
  {
    nom: "Comité de Quartier Saint-Georges",
    url: "https://www.facebook.com/p/Comit%C3%A9-de-quartier-de-St-Georges-Centre-61559882724122/",
    logo: "/images/partenaires/comite-quartier-saint-georges.png",
  },
  {
    nom: "Banque Alimentaire de Liège",
    url: "https://www.foodbank-liege.be/",
    logo: "/images/partenaires/banque-alimentaire-liege.png",
  },
];

export default function PartnerMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Masques de fondu gauche / droite */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FAF8F5] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FAF8F5] to-transparent"
        aria-hidden="true"
      />

      {/* Piste du carrousel : flex + w-max + gap strict */}
      <div className="flex w-max animate-marquee items-center gap-16 md:gap-24 pr-16 md:pr-24 hover:[animation-play-state:paused]">
        {[...PARTENAIRES_CONFIANCE, ...PARTENAIRES_CONFIANCE].map(
          (partenaire, index) => (
            <a
              key={`${partenaire.nom}-${index}`}
              href={partenaire.url}
              target="_blank"
              rel="noopener noreferrer"
              title={partenaire.nom}
              className="flex shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partenaire.logo}
                alt={partenaire.nom}
                className="h-10 md:h-12 w-auto max-w-[180px] object-contain block"
              />
            </a>
          )
        )}
      </div>
    </div>
  );
}
