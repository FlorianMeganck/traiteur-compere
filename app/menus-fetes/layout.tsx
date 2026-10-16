import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menus des Fêtes 2026 • Réveillons de Noël & Nouvel An | Traiteur Compère',
  description:
    'Découvrez nos 3 formules gastronomiques 4 services et notre carte festive à composer librement pour vos réveillons de Noël et Nouvel An. Retrait artisanal à Saint-Georges-sur-Meuse et livraison en région liégeoise.',
  alternates: {
    canonical: '/menus-fetes',
  },
  openGraph: {
    title: 'Menus des Fêtes 2026 • Réveillons de Noël & Nouvel An | Traiteur Compère',
    description:
      'Découvrez nos 3 formules gastronomiques 4 services et notre carte festive à composer librement pour vos réveillons de Noël et Nouvel An. Retrait artisanal à Saint-Georges-sur-Meuse et livraison en région liégeoise.',
    url: 'https://www.traiteur-compere.be/menus-fetes',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Menus des Fêtes 2026',
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
