import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notre Histoire depuis 1821 | Traiteur Compère à Saint-Georges-sur-Meuse (Liège)',
  description:
    'Maison Compère, traiteur artisanal depuis 1821 à Saint-Georges-sur-Meuse (4470, province de Liège). Partenariat avec la Boucherie Otte, buffets froids et chauds, plats préparés et menus de fêtes livrés en Hesbaye et à Liège, Waremme, Huy, Ans, Awans, Fexhe-le-Haut-Clocher et Hannut.',
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title:
      'Notre Histoire depuis 1821 | Traiteur Compère à Saint-Georges-sur-Meuse (Liège)',
    description:
      'Découvrez le parcours de la Maison Compère depuis 1821 : boucherie familiale devenue traiteur événementiel à Saint-Georges-sur-Meuse en province de Liège, avec Christophe Compère et la Boucherie Otte.',
    url: 'https://www.traiteur-compere.be/a-propos',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère — Maison Compère depuis 1821 à Saint-Georges-sur-Meuse (Liège)',
      },
    ],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.traiteur-compere.be/a-propos#aboutpage',
  url: 'https://www.traiteur-compere.be/a-propos',
  name: 'Notre Histoire depuis 1821 | Traiteur Compère à Saint-Georges-sur-Meuse',
  description:
    'Histoire de la Maison Compère depuis 1821 à Saint-Georges-sur-Meuse en province de Liège : activité de traiteur événementiel, buffets froids et chauds, plats préparés et menus de fêtes.',
  mainEntity: {
    '@type': ['FoodEstablishment', 'CateringService'],
    '@id': 'https://www.traiteur-compere.be/#localbusiness',
    name: 'Traiteur Compère',
    legalName: 'Maison Compère SRL',
    url: 'https://www.traiteur-compere.be',
    telephone: '+32 468 38 50 82',
    email: 'contact@traiteur-compere.be',
    foundingDate: '1821',
    founder: {
      '@type': 'Person',
      name: 'Famille Compère (Oreye, 1821)',
    },
    employee: {
      '@type': 'Person',
      name: 'Christophe Compère',
      jobTitle: 'Traiteur & gérant',
    },
    servesCuisine: 'Cuisine artisanale belge, boucherie-charcuterie et traiteur',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue Potay 3',
      addressLocality: 'Saint-Georges-sur-Meuse',
      postalCode: '4470',
      addressRegion: 'Province de Liège',
      addressCountry: 'BE',
    },
    areaServed: [
      'Saint-Georges-sur-Meuse',
      'Hesbaye',
      'Province de Liège',
      'Waremme',
      'Liège',
      'Huy',
      'Ans',
      'Awans',
      'Fexhe-le-Haut-Clocher',
      'Crisnée',
      'Bierset',
      'Hannut',
    ],
    knowsAbout: [
      'Traiteur événementiel',
      'Buffets froids et chauds',
      'Plats préparés maison',
      'Menus de fêtes',
      'Découpe artisanale',
    ],
  },
};

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {children}
    </>
  );
}
