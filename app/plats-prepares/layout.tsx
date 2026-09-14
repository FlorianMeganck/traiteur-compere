import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plats Préparés du Chef à Emporter',
  description:
    'Commandez nos plats traiteur artisanaux cuisinés chaque semaine : recettes traditionnelles, produits frais locaux et formules à emporter en région liégeoise.',
  alternates: {
    canonical: '/plats-prepares',
  },
  openGraph: {
    title: 'Plats Préparés du Chef à Emporter | Traiteur Compère',
    description:
      'Commandez nos plats traiteur artisanaux cuisinés chaque semaine : recettes traditionnelles, produits frais locaux et formules à emporter en région liégeoise.',
    url: 'https://www.traiteur-compere.be/plats-prepares',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Plats Préparés du Chef',
      },
    ],
  },
};

export default function PlatsPreparesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
