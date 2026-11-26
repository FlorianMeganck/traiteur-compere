import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notre Histoire depuis 1821 | Traiteur Compère à Fexhe-le-Haut-Clocher (Liège)',
  description:
    'Maison Compère, traiteur artisanal depuis 1821 en Hesbaye (Fexhe-le-Haut-Clocher, province de Liège). Partenariat avec la Boucherie Otte, buffets froids et chauds, plats préparés et menus de fêtes à Liège, Waremme, Ans, Awans, Crisnée, Bierset et Hannut.',
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title:
      'Notre Histoire depuis 1821 | Traiteur Compère à Fexhe-le-Haut-Clocher (Liège)',
    description:
      'Découvrez le parcours de la Maison Compère depuis 1821 : boucherie familiale devenue traiteur événementiel en Hesbaye et province de Liège, avec Christophe Compère et la Boucherie Otte.',
    url: 'https://www.traiteur-compere.be/a-propos',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère — Maison Compère depuis 1821 à Fexhe-le-Haut-Clocher (Liège)',
      },
    ],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.traiteur-compere.be/a-propos#aboutpage',
  url: 'https://www.traiteur-compere.be/a-propos',
  name: 'Notre Histoire depuis 1821 | Traiteur Compère à Fexhe-le-Haut-Clocher',
  description:
    'Histoire de la Maison Compère depuis 1821 en Hesbaye et province de Liège : activité de traiteur événementiel, buffets froids et chauds, plats préparés et menus de fêtes.',
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
      addressLocality: 'Fexhe-le-Haut-Clocher',
      addressRegion: 'Province de Liège (Hesbaye)',
      addressCountry: 'BE',
    },
    areaServed: [
      'Fexhe-le-Haut-Clocher',
      'Hesbaye',
      'Province de Liège',
      'Waremme',
      'Liège',
      'Ans',
      'Awans',
      'Crisnée',
      'Bierset',
      'Hannut',
      'Saint-Georges-sur-Meuse',
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
