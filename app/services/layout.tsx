import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nos Services Traiteur | Événements & Réceptions",
  description:
    "Organisation de banquets, mariages, anniversaires et service boissons complet. Traiteur mariage à Liège, événements d'entreprise en Wallonie et formule bar brasseur clé en main (Huy-Waremme).",
  keywords: [
    "traiteur mariage liège",
    "traiteur événementiel entreprise wallonie",
    "location matériel bar brasseur huy waremme",
    "service boissons traiteur",
    "traiteur saint-georges-sur-meuse",
    "organisation banquets réceptions liège"
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "Nos Services Traiteur | Événements & Réceptions",
    description:
      "Organisation de banquets, mariages, anniversaires et service boissons complet. Traiteur mariage à Liège, événements d'entreprise en Wallonie et formule bar brasseur clé en main.",
    url: 'https://www.traiteur-compere.be/services',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nos Services Traiteur | Événements & Réceptions',
      },
    ],
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Service", "CateringService"],
  "@id": "https://www.traiteur-compere.be/services#service",
  name: "Nos Services Traiteur | Événements, Brasseur & Logistique — Traiteur Compère",
  description:
    "Organisation de banquets, mariages, événements d'entreprise, service boissons brasseur clé en main et logistique complète en province de Liège.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.traiteur-compere.be/#caterer",
    name: "Traiteur Compère",
    legalName: "Maison Compère SRL",
    telephone: "+32 468 38 50 82",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue Potay 3",
      addressLocality: "Saint-Georges-sur-Meuse",
      postalCode: "4470",
      addressRegion: "Liège",
      addressCountry: "BE",
    },
  },
  areaServed: [
    "Liège",
    "Saint-Georges-sur-Meuse",
    "Huy",
    "Waremme",
    "Grâce-Hollogne",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catalogue des 3 Pôles de Services Traiteur Compère",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Pôle Réceptions & Formats",
        description:
          "Mariages sur mesure, événements d'entreprise, réceptions privées, banquets et repas d'associations à Liège, Huy et Waremme.",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Traiteur Mariages & Noces sur mesure",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Traiteur Événements d'entreprise & Séminaires",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Réceptions privées, Banquets & Associations",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Pôle Bar & Boissons (Formule Brasserie)",
        description:
          "Solution boissons clé en main : mise à disposition de frigo vitré professionnel, fûts et bouteilles, reprise des invendus/vidanges et équipe de bar.",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Frigo vitré pro & Fourniture complète fûts et bouteilles",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Formule Zéro Gaspillage avec reprise des invendus et vidanges",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Équipe de bar & Service des boissons",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Pôle Logistique & Confort",
        description:
          "Personnel de salle et de cuisine, matériel thermique, nappage, verrerie et vaisselle.",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Personnel de salle & Brigade de cuisine (18,00 €/h HTVA)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Location de matériel, nappage, verrerie & vaisselle",
            },
          },
        ],
      },
    ],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      {children}
    </>
  );
}
