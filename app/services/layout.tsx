import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Traiteur : Mariages, Entreprises & Événements Privés',
  description:
    'Organisation traiteur sur-mesure pour vos mariages, réceptions professionnelles et fêtes privées à Liège et en Wallonie avec un service haut de gamme.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title:
      'Services Traiteur : Mariages, Entreprises & Événements Privés | Traiteur Compère',
    description:
      'Organisation traiteur sur-mesure pour vos mariages, réceptions professionnelles et fêtes privées à Liège et en Wallonie avec un service haut de gamme.',
    url: 'https://traiteur-compere.be/services',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Services Traiteur',
      },
    ],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
