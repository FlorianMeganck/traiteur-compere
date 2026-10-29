import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Menus de Fêtes 2026 | Traiteur Compère",
  description:
    "Découvrez nos menus de réveillon, formules festives et compositions à la carte pour Noël et Nouvel An à Liège.",
  alternates: {
    canonical: '/menus-fetes',
  },
  openGraph: {
    title: "Menus de Fêtes 2026 | Traiteur Compère",
    description:
      "Découvrez nos menus de réveillon, formules festives et compositions à la carte pour Noël et Nouvel An à Liège.",
    url: 'https://www.traiteur-compere.be/menus-fetes',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Menus de Fêtes 2026 | Traiteur Compère',
      },
    ],
  },
};

export default function MenusFetesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
